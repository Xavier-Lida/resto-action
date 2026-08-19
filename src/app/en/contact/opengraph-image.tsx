import { TAILLE, TYPE, visuel } from "@/lib/og";
import { EN } from "@/lib/textes/en";

export const alt = EN.pageContact.metaTitre;
export const size = TAILLE;
export const contentType = TYPE;

export default function Image() {
  return visuel({
    surTitre: EN.pageContact.surtitre,
    titre: EN.pageContact.titre,
  });
}
