import type { Metadata } from "next";
import PageBlogue from "@/components/PageBlogue";
import { articlesEn, INDEX_EN } from "@/lib/contenu/blogue";
import { EN } from "@/lib/textes/en";
import { BLOGUE, hreflang } from "@/lib/routes";

export const metadata: Metadata = {
  title: INDEX_EN.metaTitre,
  description: INDEX_EN.metaDescription,
  alternates: { canonical: INDEX_EN.slug, languages: hreflang(BLOGUE) },
  openGraph: {
    type: "website",
    locale: EN.meta.ogLocale,
    alternateLocale: "fr_CA",
    url: INDEX_EN.slug,
    siteName: "Resto Action",
    title: INDEX_EN.metaTitre,
    description: INDEX_EN.metaDescription,
  },
};

export default function Blog() {
  return <PageBlogue t={EN} index={INDEX_EN} articles={articlesEn()} />;
}
