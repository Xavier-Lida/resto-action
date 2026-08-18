import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageFonctionnalite from "@/components/PageFonctionnalite";
import {
  CLES,
  FONCTIONNALITES_EN,
  cleParSegment,
  segment,
} from "@/lib/contenu/fonctionnalites";
import { PLATEFORME_EN } from "@/lib/contenu/plateforme";
import { EN } from "@/lib/textes/en";
import { hreflang, paireFonctionnalite } from "@/lib/routes";

/* Les quatre pages de fonctionnalité, sur une seule route.

   `params` est une PROMESSE depuis Next 15 : il faut l'attendre. Écrit comme
   un objet ordinaire, le code compile et casse au rendu.

   `dynamicParams = false` : tout slug absent de generateStaticParams rend un
   404 au lieu d'être fabriqué à la demande. Il n'y a que quatre
   fonctionnalités, et une cinquième URL inventée ne doit pas répondre 200 —
   une page vide indexée coûte plus cher qu'une page absente. */
export const dynamicParams = false;

const PAR_SEGMENT = cleParSegment(FONCTIONNALITES_EN);

export function generateStaticParams() {
  return CLES.map((cle) => ({ slug: segment(FONCTIONNALITES_EN[cle].slug) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cle = PAR_SEGMENT.get(slug);
  if (!cle) return {};

  const f = FONCTIONNALITES_EN[cle];
  return {
    title: f.metaTitre,
    description: f.metaDescription,
    alternates: {
      canonical: f.slug,
      languages: hreflang(paireFonctionnalite(cle)),
    },
    openGraph: {
      type: "website",
      locale: EN.meta.ogLocale,
      alternateLocale: "fr_CA",
      url: f.slug,
      siteName: "Resto Action",
      title: f.metaTitre,
      description: f.metaDescription,
    },
  };
}

export default async function Feature({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cle = PAR_SEGMENT.get(slug);
  if (!cle) notFound();

  return <PageFonctionnalite t={EN} f={FONCTIONNALITES_EN[cle]} plateforme={PLATEFORME_EN} />;
}
