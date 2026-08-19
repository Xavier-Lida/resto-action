import { TAILLE, TYPE, visuel } from "@/lib/og";
import { INDEX_FR } from "@/lib/contenu/blogue";

export const alt = INDEX_FR.metaTitre;
export const size = TAILLE;
export const contentType = TYPE;

export default function Image() {
  return visuel({ surTitre: INDEX_FR.surTitre, titre: INDEX_FR.titre });
}
