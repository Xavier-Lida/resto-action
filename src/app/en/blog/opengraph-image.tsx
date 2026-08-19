import { TAILLE, TYPE, visuel } from "@/lib/og";
import { INDEX_EN } from "@/lib/contenu/blogue";

export const alt = INDEX_EN.metaTitre;
export const size = TAILLE;
export const contentType = TYPE;

export default function Image() {
  return visuel({ surTitre: INDEX_EN.surTitre, titre: INDEX_EN.titre });
}
