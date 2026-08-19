import { TAILLE, TYPE, visuel } from "@/lib/og";

/* L'image de partage de l'accueil français.

   CE QU'ON CROYAIT, ET QUI ÉTAIT FAUX : qu'une image posée ici s'appliquait à
   toutes les routes du site. Le HTML construit dit le contraire — vingt-trois
   pages sur vingt-six partaient sans image, alors que la carte est déclarée
   `summary_large_image` pour tout le monde.

   LA VRAIE RÈGLE, lue dans le résolveur de métadonnées de Next : l'image de la
   racine descend tant qu'aucun segment plus bas ne déclare `openGraph`. Or
   chaque page du site en déclare un — locale, url, titre. Next remplace alors
   le bloc du parent EN ENTIER, images comprises, et seule une image
   colocalisée dans le même segment les remet. D'où les douze fichiers frères
   sous plateforme, blogue, contact et confidentialite, et leurs jumeaux
   anglais. La 404 échappe à la règle : elle ne déclare pas d'openGraph, donc
   elle hérite bel et bien de celle-ci.

   Pas de `twitter-image` à côté : Next recopie `openGraph.images` dans
   `twitter.images` quand cette dernière est vide. Un second fichier doublerait
   le temps de rendu pour un HTML identique. */

export const alt =
  "Resto Action : pour que le fruit du travail des restaurateurs québécois leur revienne";
export const size = TAILLE;
export const contentType = TYPE;

export default function OpengraphImage() {
  /* L'accueil est la seule page dont la phrase se casse en deux : la chute
     passe au rouge. Les pages profondes, elles, ont un sur-titre. */
  return visuel({
    titre: "Pas normal que ceux qui cuisinent",
    chute: "soient ceux qui restent pauvres.",
  });
}
