import { TAILLE, TYPE, visuel } from "@/lib/og";
import { PLATEFORME_EN } from "@/lib/contenu/plateforme";

/* Le jumeau anglais de plateforme/opengraph-image.tsx — même raison d'être,
   autre dictionnaire. */

export const alt = PLATEFORME_EN.metaTitre;
export const size = TAILLE;
export const contentType = TYPE;

export default function Image() {
  return visuel({ surTitre: PLATEFORME_EN.surTitre, titre: PLATEFORME_EN.titre });
}
