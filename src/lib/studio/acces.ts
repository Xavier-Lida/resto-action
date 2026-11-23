import { createHash, timingSafeEqual } from "node:crypto";
import { studioOuvert } from "@/lib/site";
import { controlePret, essaiSansIA } from "@/lib/studio/controle";
import { lireFiche, memeJeton, stockagePret } from "@/lib/studio/stockage";
import { ID_VALIDE, JETON_VALIDE, type Fiche } from "@/lib/studio/types";

/* LE STUDIO PHOTO : qui a le droit de quoi, pour toutes ses routes.

   - Le Studio fermé (STUDIO_ACTIF à faux, hors poste de développement) : 404 partout.
   - Le visiteur ne lit que SA retouche : il lui faut l'identifiant et le jeton
     que le serveur lui a remis au départ. Les 2 formats en haute qualité
     demandent en plus que le formulaire ait été envoyé.
   - L'équipe (/studio/suivi) : le mot de passe du tableau de bord (TABLEAU_MDP),
     vérifié ICI en plus de src/proxy.ts. Une image privée ne doit pas dépendre
     d'un seul verrou. */

export const SANS_CACHE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

export function refus(code: string, statut = 400): Response {
  return Response.json({ erreur: code }, { status: statut, headers: SANS_CACHE });
}

export const introuvable = () => new Response("Introuvable", { status: 404, headers: SANS_CACHE });

/** Ce qu'il faut pour qu'une retouche puisse partir : le Studio ouvert, le magasin et le contrôle branchés. */
export function studioPret(): boolean {
  return studioOuvert() && stockagePret() && (controlePret() || essaiSansIA());
}

export function texte(valeur: unknown, max: number): string {
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

export function ipDe(requete: Request): string {
  return requete.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
}

/** Un frein en mémoire, par adresse IP, contre les rafales. La vraie limite par
    jour est comptée dans le magasin (stockage.ts). */
export function frein(max: number, fenetreMs = 10 * 60_000) {
  const tentatives = new Map<string, number[]>();
  return (ip: string): boolean => {
    const maintenant = Date.now();
    const recentes = (tentatives.get(ip) ?? []).filter((t) => maintenant - t < fenetreMs);
    recentes.push(maintenant);
    if (tentatives.size > 500) tentatives.clear();
    tentatives.set(ip, recentes);
    return recentes.length > max;
  };
}

/** La fiche, seulement si l'identifiant et le jeton sont les bons. */
export async function ficheDuVisiteur(id: unknown, jeton: unknown): Promise<Fiche | null> {
  if (typeof id !== "string" || typeof jeton !== "string") return null;
  if (!ID_VALIDE.test(id) || !JETON_VALIDE.test(jeton)) return null;
  const fiche = await lireFiche(id);
  return fiche && memeJeton(jeton, fiche.jetonHache) ? fiche : null;
}

/** Le mot de passe de l'équipe (HTTP « Basic », l'utilisateur est ignoré). Fermé sans TABLEAU_MDP. */
export function estEquipe(requete: Request): boolean {
  return enteteEquipe(requete.headers.get("authorization"));
}

/** La même vérification, à partir de l'en-tête seul (pour une action de formulaire côté serveur). */
export function enteteEquipe(valeur: string | null | undefined): boolean {
  const attendu = process.env.TABLEAU_MDP;
  const entete = valeur ?? "";
  if (!attendu || !entete.startsWith("Basic ")) return false;
  let fourni = "";
  try {
    const decode = Buffer.from(entete.slice(6), "base64").toString("utf8");
    fourni = decode.slice(decode.indexOf(":") + 1);
  } catch {
    return false;
  }
  const a = createHash("sha256").update(fourni).digest();
  const b = createHash("sha256").update(attendu).digest();
  return timingSafeEqual(a, b);
}
