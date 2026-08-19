import { TAILLE, TYPE, visuel } from "@/lib/og";
import { articlesFr, INDEX_FR, parSegment, segment } from "@/lib/contenu/blogue";

/* Voir plateforme/[slug]/opengraph-image.tsx pour les trois pièges de la
   convention sur une route dynamique. Ici le sur-titre est celui du blogue :
   un article n'a pas de sur-titre à lui, et le titre suffit à dire de quoi il
   parle. */

export const alt = INDEX_FR.metaTitre;
export const size = TAILLE;
export const contentType = TYPE;

const PAR_SEGMENT = parSegment(articlesFr());

export function generateStaticParams() {
  return articlesFr().map((a) => ({ slug: segment(a.slug) }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = PAR_SEGMENT.get(slug);

  return visuel({
    surTitre: INDEX_FR.filNom,
    titre: article?.titre ?? INDEX_FR.titre,
  });
}
