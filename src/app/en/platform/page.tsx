import type { Metadata } from "next";
import PagePlateforme from "@/components/PagePlateforme";
import { FONCTIONNALITES_EN } from "@/lib/contenu/fonctionnalites";
import { PLATEFORME_EN } from "@/lib/contenu/plateforme";
import { EN } from "@/lib/textes/en";
import { PLATEFORME, hreflang } from "@/lib/routes";

export const metadata: Metadata = {
  title: PLATEFORME_EN.metaTitre,
  description: PLATEFORME_EN.metaDescription,
  alternates: { canonical: PLATEFORME_EN.slug, languages: hreflang(PLATEFORME) },
  openGraph: {
    type: "website",
    locale: EN.meta.ogLocale,
    alternateLocale: "fr_CA",
    url: PLATEFORME_EN.slug,
    siteName: "Resto Action",
    title: PLATEFORME_EN.metaTitre,
    description: PLATEFORME_EN.metaDescription,
  },
};

export default function Platform() {
  return (
    <PagePlateforme
      t={EN}
      p={PLATEFORME_EN}
      fonctionnalites={FONCTIONNALITES_EN}
    />
  );
}
