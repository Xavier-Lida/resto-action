import { TAILLE, TYPE, visuel } from "@/lib/og";
import { articlesEn, INDEX_EN, parSegment, segment } from "@/lib/contenu/blogue";

/* Voir plateforme/[slug]/opengraph-image.tsx pour les trois pièges de la
   convention sur une route dynamique. */

export const alt = INDEX_EN.metaTitre;
export const size = TAILLE;
export const contentType = TYPE;

const PAR_SEGMENT = parSegment(articlesEn());

export function generateStaticParams() {
  return articlesEn().map((a) => ({ slug: segment(a.slug) }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = PAR_SEGMENT.get(slug);

  return visuel({
    surTitre: INDEX_EN.filNom,
    titre: article?.titre ?? INDEX_EN.titre,
  });
}
