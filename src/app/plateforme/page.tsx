import type { Metadata } from "next";
import PagePlateforme from "@/components/PagePlateforme";
import { FONCTIONNALITES_FR } from "@/lib/contenu/fonctionnalites";
import { PLATEFORME_FR } from "@/lib/contenu/plateforme";
import { FR } from "@/lib/textes/fr";
import { PLATEFORME, hreflang } from "@/lib/routes";

export const metadata: Metadata = {
  title: PLATEFORME_FR.metaTitre,
  description: PLATEFORME_FR.metaDescription,
  alternates: { canonical: PLATEFORME_FR.slug, languages: hreflang(PLATEFORME) },
  openGraph: {
    type: "website",
    locale: FR.meta.ogLocale,
    alternateLocale: "en_CA",
    url: PLATEFORME_FR.slug,
    siteName: "Resto Action",
    title: PLATEFORME_FR.metaTitre,
    description: PLATEFORME_FR.metaDescription,
  },
};

export default function Plateforme() {
  return (
    <PagePlateforme
      t={FR}
      p={PLATEFORME_FR}
      fonctionnalites={FONCTIONNALITES_FR}
    />
  );
}
