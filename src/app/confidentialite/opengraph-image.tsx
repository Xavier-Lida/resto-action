import { TAILLE, TYPE, visuel } from "@/lib/og";
import { CONFIDENTIALITE_FR } from "@/lib/contenu/confidentialite";

export const alt = CONFIDENTIALITE_FR.metaTitre;
export const size = TAILLE;
export const contentType = TYPE;

export default function Image() {
  return visuel({
    surTitre: CONFIDENTIALITE_FR.surTitre,
    titre: CONFIDENTIALITE_FR.titre,
  });
}
