import { TAILLE, TYPE, visuel } from "@/lib/og";
import { CLES, FONCTIONNALITES_EN, cleParSegment, segment } from "@/lib/contenu/fonctionnalites";
import { PLATEFORME_EN } from "@/lib/contenu/plateforme";

/* Voir plateforme/[slug]/opengraph-image.tsx pour les trois pièges de la
   convention sur une route dynamique. */

export const alt = PLATEFORME_EN.metaTitre;
export const size = TAILLE;
export const contentType = TYPE;

const PAR_SEGMENT = cleParSegment(FONCTIONNALITES_EN);

export function generateStaticParams() {
  return CLES.map((cle) => ({ slug: segment(FONCTIONNALITES_EN[cle].slug) }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cle = PAR_SEGMENT.get(slug);
  const f = cle ? FONCTIONNALITES_EN[cle] : undefined;

  return visuel({
    surTitre: f?.surTitre ?? PLATEFORME_EN.surTitre,
    titre: f?.titre ?? PLATEFORME_EN.titre,
  });
}
