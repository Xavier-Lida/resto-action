import { createHash, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

/* LA PORTE DU TABLEAU DE BORD.

   `/tableau` montre d'où viennent les rendez-vous : des chiffres d'affaires,
   pas un secret d'État, mais rien qui regarde un moteur ou un curieux. Une
   authentification HTTP « Basic » suffit : le navigateur affiche lui-même la
   boîte de mot de passe, ça marche sur un téléphone, et il n'y a ni session,
   ni page de connexion, ni témoin à déclarer dans la politique.

   FERMÉ PAR DÉFAUT : sans `TABLEAU_MDP` dans l'environnement, la page répond
   401 à tout le monde. Un déploiement où on a oublié la variable est un
   déploiement où le tableau est invisible, pas public. Il faut la poser en
   Production ET en Preview dans Vercel.

   Ce fichier est un `proxy.ts` (le `middleware.ts` d'avant Next 16) et ne
   s'exécute que sur `/tableau` : le `matcher` doit rester un littéral, Next
   le lit à la compilation. */

export const config = { matcher: "/tableau/:path*" };

const REFUS = {
  status: 401,
  headers: { "WWW-Authenticate": 'Basic realm="Resto Action", charset="UTF-8"' },
};

/* Comparaison en temps constant, sur des empreintes SHA-256 : `timingSafeEqual`
   exige deux tampons de même longueur, et la longueur d'un mot de passe est
   déjà une information. */
function memeSecret(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function proxy(request: NextRequest): Response | undefined {
  const attendu = process.env.TABLEAU_MDP;
  if (!attendu) return new Response("Accès réservé", REFUS);

  const entete = request.headers.get("authorization") ?? "";
  if (!entete.startsWith("Basic ")) return new Response("Accès réservé", REFUS);

  let fourni = "";
  try {
    // « utilisateur:motdepasse » ; l'utilisateur est ignoré, seul le mot de
    // passe compte. Un « : » dans le mot de passe survit au découpage.
    const decode = Buffer.from(entete.slice(6), "base64").toString("utf8");
    fourni = decode.slice(decode.indexOf(":") + 1);
  } catch {
    return new Response("Accès réservé", REFUS);
  }

  if (!memeSecret(fourni, attendu)) return new Response("Accès réservé", REFUS);
  return undefined;
}
