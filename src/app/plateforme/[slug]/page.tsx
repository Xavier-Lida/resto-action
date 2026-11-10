import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageFonctionnalite from "@/components/PageFonctionnalite";
import {
  CLES,
  FONCTIONNALITES_FR,
  cleParSegment,
  segment,
} from "@/lib/contenu/fonctionnalites";
import { PLATEFORME_FR } from "@/lib/contenu/plateforme";
import { PIECES_EN, PIECES_FR, piecesPretes } from "@/lib/contenu/pieces";
import { ANGLAIS_ACTIF } from "@/lib/site";
import { FR } from "@/lib/textes/fr";
import { hreflang, paireFonctionnalite } from "@/lib/routes";

/* Les quatre pages de fonctionnalité, sur une seule route.

   `params` est une PROMESSE depuis Next 15 : il faut l'attendre. Écrit comme
   un objet ordinaire, le code compile et casse au rendu.

   `dynamicParams = false` : tout slug absent de generateStaticParams rend un
   404 au lieu d'être fabriqué à la demande. Il n'y a que quatre
   fonctionnalités, et une cinquième URL inventée ne doit pas répondre 200 —
   une page vide indexée coûte plus cher qu'une page absente. */
export const dynamicParams = false;

const PAR_SEGMENT = cleParSegment(FONCTIONNALITES_FR);

/* Les quatre fonctionnalités d'origine (bilingues) et les pages des pièces
   (français seulement, src/lib/contenu/pieces.ts). Une pièce pas prête au
   lancement n'a pas de page. */
const piece = (slug: string) => {
  const p = PIECES_FR[slug];
  return p && piecesPretes().includes(p) ? p : null;
};

/** Toutes les pages du Système, pour les liens « Ça marche avec le reste ». */
const TOUTES = [
  ...CLES.map((c) => FONCTIONNALITES_FR[c]),
  ...piecesPretes(),
].map((f) => ({ nom: f.filNom, href: f.slug, resume: f.resume }));

export function generateStaticParams() {
  return [
    ...CLES.map((cle) => ({ slug: segment(FONCTIONNALITES_FR[cle].slug) })),
    ...piecesPretes().map((p) => ({ slug: segment(p.slug) })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cle = PAR_SEGMENT.get(slug);
  const p = piece(slug);
  if (p) {
    return {
      title: p.metaTitre,
      description: p.metaDescription,
      alternates: {
        canonical: p.slug,
        languages: ANGLAIS_ACTIF && PIECES_EN[slug] ? { "fr-CA": p.slug, "en-CA": PIECES_EN[slug].slug, "x-default": p.slug } : { "fr-CA": p.slug, "x-default": p.slug },
      },
      openGraph: { type: "website", locale: FR.meta.ogLocale, url: p.slug, siteName: "Resto Action", title: p.metaTitre, description: p.metaDescription },
    };
  }
  if (!cle) return {};

  const f = FONCTIONNALITES_FR[cle];
  return {
    title: f.metaTitre,
    description: f.metaDescription,
    alternates: {
      canonical: f.slug,
      languages: hreflang(paireFonctionnalite(cle)),
    },
    openGraph: {
      type: "website",
      locale: FR.meta.ogLocale,
      alternateLocale: "en_CA",
      url: f.slug,
      siteName: "Resto Action",
      title: f.metaTitre,
      description: f.metaDescription,
    },
  };
}

export default async function Fonctionnalite({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const f = piece(slug) ?? (PAR_SEGMENT.get(slug) ? FONCTIONNALITES_FR[PAR_SEGMENT.get(slug)!] : null);
  if (!f) notFound();
  const autres = TOUTES.filter((a) => a.href !== f.slug);

  return <PageFonctionnalite t={FR} f={f} plateforme={PLATEFORME_FR} autres={autres} />;
}
