import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageArticle from "@/components/PageArticle";
import {
  articlesEn,
  INDEX_EN,
  parSegment,
  segment,
} from "@/lib/contenu/blogue";
import { EN } from "@/lib/textes/en";
import { hreflang, paireArticle } from "@/lib/routes";
import { ARTICLES } from "@/lib/contenu/blogue";

/* Un article par slug. `params` est une PROMESSE depuis Next 15.

   `dynamicParams = false` : une URL d'article qui n'existe pas rend un 404 au
   lieu d'être fabriquée à la demande. */
export const dynamicParams = false;

const PAR_SEGMENT = parSegment(articlesEn());

export function generateStaticParams() {
  return articlesEn().map((a) => ({ slug: segment(a.slug) }));
}

/* Le chemin français sert de CLÉ D'APPARIEMENT pour retrouver la paire : c'est
   lui qui identifie l'article dans le registre, quelle que soit la langue
   affichée. */
const cheminFr = (slug: string) =>
  ARTICLES.find((p) => segment(p.en.slug) === slug)?.fr.slug;

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
      locale: EN.meta.ogLocale,
      alternateLocale: "fr_CA",
      url: article.slug,
      siteName: "Resto Action",
      title: article.metaTitre,
      description: article.metaDescription,
      publishedTime: article.publieLe,
      modifiedTime: article.modifieLe,
    },
  };
}

export default async function ArticleEn({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = PAR_SEGMENT.get(slug);
  if (!article) notFound();

  const autres = articlesEn().filter((a) => a.slug !== article.slug);
  return (
    <PageArticle
      t={EN}
      article={article}
      index={INDEX_EN}
      autres={autres}
    />
  );
}
