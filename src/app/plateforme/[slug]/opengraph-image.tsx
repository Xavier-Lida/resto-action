import { TAILLE, TYPE, visuel } from "@/lib/og";
import { CLES, FONCTIONNALITES_FR, cleParSegment, segment } from "@/lib/contenu/fonctionnalites";
import { PLATEFORME_FR } from "@/lib/contenu/plateforme";

/* Une seule image pour les quatre fonctionnalités : `params` arrive ici comme
   dans la page voisine, et donne le slug demandé.

   TROIS PIÈGES, tous vérifiés dans le résolveur de Next plutôt que devinés :

   - `generateStaticParams` DOIT être réexporté ici. L'image est une route à
     part entière, avec son propre arbre : elle n'hérite pas de celui de
     page.tsx. Sans lui, les quatre images se fabriquent à la première
     requête — c'est-à-dire pendant que Facebook attend.
   - `dynamicParams` ne sert à rien dans ce fichier : le chargeur d'images le
     jette. Un slug inventé rendra donc une image au lieu d'un 404. Sans
     conséquence, rien ne pointe vers ces URL — mais que personne n'aille
     « réparer » son absence.
   - `alt` est une constante de module : elle ne peut pas varier par slug sans
     passer par generateImageMetadata, qui coûterait un identifiant de plus
     dans l'URL. Un libellé de section suffit. */

export const alt = PLATEFORME_FR.metaTitre;
export const size = TAILLE;
export const contentType = TYPE;

const PAR_SEGMENT = cleParSegment(FONCTIONNALITES_FR);

export function generateStaticParams() {
  return CLES.map((cle) => ({ slug: segment(FONCTIONNALITES_FR[cle].slug) }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cle = PAR_SEGMENT.get(slug);
  const f = cle ? FONCTIONNALITES_FR[cle] : undefined;

  return visuel({
    surTitre: f?.surTitre ?? PLATEFORME_FR.surTitre,
    titre: f?.titre ?? PLATEFORME_FR.titre,
  });
}
