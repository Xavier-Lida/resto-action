import { TAILLE, TYPE, visuel } from "@/lib/og";
import { CONFIDENTIALITE_EN } from "@/lib/contenu/confidentialite";

export const alt = CONFIDENTIALITE_EN.metaTitre;
export const size = TAILLE;
export const contentType = TYPE;

export default function Image() {
  return visuel({
    surTitre: CONFIDENTIALITE_EN.surTitre,
    titre: CONFIDENTIALITE_EN.titre,
  });
}
