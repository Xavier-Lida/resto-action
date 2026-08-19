import { TAILLE, TYPE, visuel } from "@/lib/og";

/* L'image de partage de la page anglaise.

   Elle EXISTE parce que `opengraph-image` est une convention de fichier liée à
   son segment : sans ce fichier, /en n'aurait aucune image à lui. Voir
   src/app/opengraph-image.tsx pour la règle d'héritage exacte — elle est plus
   étroite que ce qui était écrit ici avant.

   Le dessin est le même — seule la phrase change. */

export const alt =
  "Resto Action: so the work of Quebec restaurant owners pays them back";
export const size = TAILLE;
export const contentType = TYPE;

export default function OpengraphImageEn() {
  return visuel({
    titre: "It makes no sense that the people",
    chute: "who cook are the ones left broke.",
  });
}
