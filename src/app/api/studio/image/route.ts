import type { NextRequest } from "next/server";
import { ficheDuVisiteur, introuvable, studioPret } from "@/lib/studio/acces";
import { lireFlux } from "@/lib/studio/stockage";
import { CHEMINS } from "@/lib/studio/types";

/* LE STUDIO PHOTO : les images du visiteur.

   Le magasin est privé : chaque image passe par ici, et il faut l'identifiant
   et le jeton de la retouche.
     - `avant` et `apres` : les aperçus de taille réduite, pour le curseur.
     - `carre` et `vertical` : les 2 formats en haute qualité, SEULEMENT après
       l'envoi du formulaire. `telecharger=1` les fait enregistrer plutôt qu'ouvrir.
   L'originale en pleine taille ne sort jamais par cette route. */
export const runtime = "nodejs";

const VUES = ["avant", "apres", "carre", "vertical"] as const;
type VueVisiteur = (typeof VUES)[number];

export async function GET(requete: NextRequest): Promise<Response> {
  if (!studioPret()) return introuvable();
  const p = requete.nextUrl.searchParams;
  const vue = p.get("vue") as VueVisiteur;
  if (!VUES.includes(vue)) return introuvable();

  const fiche = await ficheDuVisiteur(p.get("id"), p.get("jeton"));
  if (!fiche) return introuvable();
  if (vue !== "avant" && fiche.etat !== "pret") return introuvable();
  if ((vue === "carre" || vue === "vertical") && !fiche.contact) return introuvable();

  const image = await lireFlux(CHEMINS.photo(fiche.id, vue));
  if (!image) return introuvable();

  const entetes: Record<string, string> = {
    "Content-Type": "image/jpeg",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "private, max-age=600",
    "X-Robots-Tag": "noindex, nofollow",
  };
  if (p.get("telecharger") === "1") {
    entetes["Content-Disposition"] = `attachment; filename="resto-action-${vue}.jpg"`;
  }
  return new Response(image.flux, { headers: entetes });
}
