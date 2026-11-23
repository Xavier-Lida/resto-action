import type { NextRequest } from "next/server";
import { estEquipe, introuvable } from "@/lib/studio/acces";
import { stockagePret, lireFlux } from "@/lib/studio/stockage";
import { CHEMINS, ID_VALIDE, VUES, type Vue } from "@/lib/studio/types";

/* LE STUDIO PHOTO : les images vues par l'équipe (/studio/suivi et les liens
   du CRM et de l'alerte [Lead]).

   Protégée 2 fois : par src/proxy.ts (la boîte de mot de passe du navigateur)
   et ICI, juste avant de lire l'image. Ouverte même quand le Studio est fermé
   au public : on doit pouvoir vérifier les retouches en tout temps. */
export const runtime = "nodejs";

const REFUS = {
  status: 401,
  headers: { "WWW-Authenticate": 'Basic realm="Resto Action", charset="UTF-8"', "Cache-Control": "no-store" },
};

export async function GET(requete: NextRequest): Promise<Response> {
  if (!estEquipe(requete)) return new Response("Accès réservé", REFUS);
  if (!stockagePret()) return introuvable();

  const p = requete.nextUrl.searchParams;
  const id = p.get("id") ?? "";
  const vue = p.get("vue") as Vue;
  if (!ID_VALIDE.test(id) || !VUES.includes(vue)) return introuvable();

  const image = await lireFlux(CHEMINS.photo(id, vue));
  if (!image) return introuvable();
  return new Response(image.flux, {
    headers: {
      "Content-Type": "image/jpeg",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
