import type { Metadata } from "next";
import PageBlogue from "@/components/PageBlogue";
import { articlesFr, INDEX_FR } from "@/lib/contenu/blogue";
import { FR } from "@/lib/textes/fr";
import { BLOGUE, hreflang } from "@/lib/routes";

export const metadata: Metadata = {
  title: INDEX_FR.metaTitre,
  description: INDEX_FR.metaDescription,
  alternates: { canonical: INDEX_FR.slug, languages: hreflang(BLOGUE) },
  openGraph: {
    type: "website",
    locale: FR.meta.ogLocale,
    alternateLocale: "en_CA",
    url: INDEX_FR.slug,
    siteName: "Resto Action",
    title: INDEX_FR.metaTitre,
    description: INDEX_FR.metaDescription,
  },
};

export default function Blogue() {
  return <PageBlogue t={FR} index={INDEX_FR} articles={articlesFr()} />;
}
