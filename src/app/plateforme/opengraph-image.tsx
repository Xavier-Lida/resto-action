import { TAILLE, TYPE, visuel } from "@/lib/og";
import { PLATEFORME_FR } from "@/lib/contenu/plateforme";

/* Le dessin vit dans lib/og : ici, seulement le texte de CETTE page.

   Ce fichier existe parce que la convention `opengraph-image` ne descend pas
   toute seule. Dès qu'une page déclare un bloc `openGraph`, Next REMPLACE
   celui du parent — images comprises — et seule une image colocalisée dans le
   même segment les remet. Sans ce fichier, partager /plateforme donne une
   grande carte vide, puisque le site déclare summary_large_image partout. */

export const alt = PLATEFORME_FR.metaTitre;
export const size = TAILLE;
export const contentType = TYPE;

export default function Image() {
  return visuel({ surTitre: PLATEFORME_FR.surTitre, titre: PLATEFORME_FR.titre });
}
