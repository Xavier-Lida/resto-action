import { TAILLE, TYPE, visuel } from "@/lib/og";
import { FR } from "@/lib/textes/fr";

export const alt = FR.pageContact.metaTitre;
export const size = TAILLE;
export const contentType = TYPE;

export default function Image() {
  return visuel({
    surTitre: FR.pageContact.surtitre,
    titre: FR.pageContact.titre,
  });
}
