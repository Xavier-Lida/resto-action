import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageArticle from "@/components/PageArticle";
import {
  articlesFr,
  INDEX_FR,
  parSegment,
  segment,
} from "@/lib/contenu/blogue";
import { FR } from "@/lib/textes/fr";
import { hreflang, paireArticle } from "@/lib/routes";
import { ARTICLES } from "@/lib/contenu/blogue";

/* Un article par slug. `params` est une PROMESSE depuis Next 15.

   `dynamicParams = false` : une URL d'article qui n'existe pas rend un 404 au
   lieu d'être fabriquée à la demande. */
export const dynamicParams = false;

const PAR_SEGMENT = parSegment(articlesFr());

export function generateStaticParams() {
  return articlesFr().map((a) => ({ slug: segment(a.slug) }));
}

/* Le chemin français sert de CLÉ D'APPARIEMENT pour retrouver la paire : c'est
   lui qui identifie l'article dans le registre, quelle que soit la langue
   affichée. */
const cheminFr = (slug: string) =>
  ARTICLES.find((p) => segment(p.fr.slug) === slug)?.fr.slug;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = PAR_SEGMENT.get(slug);
  const fr = cheminFr(slug);
  if (!article || !fr) return {};

  return {
    title: article.metaTitre,
    description: article.metaDescription,
    alternates: {
      canonical: article.slug,
      languages: hreflang(paireArticle(fr)),
    },
    openGraph: {
      type: "article",
      locale: FR.meta.ogLocale,
      alternateLocale: "en_CA",
      url: article.slug,
      siteName: "Resto Action",
      title: article.metaTitre,
      description: article.metaDescription,
      publishedTime: article.publieLe,
      modifiedTime: article.modifieLe,
    },
  };
}

export default async function ArticleFr({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = PAR_SEGMENT.get(slug);
  if (!article) notFound();

  const autres = articlesFr().filter((a) => a.slug !== article.slug);
  return (
    <PageArticle
      t={FR}
      article={article}
      index={INDEX_FR}
      autres={autres}
    />
  );
}
