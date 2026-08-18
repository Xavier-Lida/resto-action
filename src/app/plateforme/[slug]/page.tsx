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

export function generateStaticParams() {
  return CLES.map((cle) => ({ slug: segment(FONCTIONNALITES_FR[cle].slug) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cle = PAR_SEGMENT.get(slug);
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
  const cle = PAR_SEGMENT.get(slug);
  if (!cle) notFound();

  return <PageFonctionnalite t={FR} f={FONCTIONNALITES_FR[cle]} plateforme={PLATEFORME_FR} />;
}
