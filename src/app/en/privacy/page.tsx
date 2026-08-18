import type { Metadata } from "next";
import PageConfidentialite from "@/components/PageConfidentialite";
import { CONFIDENTIALITE_EN } from "@/lib/contenu/confidentialite";
import { EN } from "@/lib/textes/en";
import { CONFIDENTIALITE, hreflang } from "@/lib/routes";

export const metadata: Metadata = {
  title: CONFIDENTIALITE_EN.metaTitre,
  description: CONFIDENTIALITE_EN.metaDescription,
  alternates: {
    canonical: "/en/privacy",
    languages: hreflang(CONFIDENTIALITE),
  },
  openGraph: {
    type: "website",
    locale: EN.meta.ogLocale,
    alternateLocale: "fr_CA",
    url: "/en/privacy",
    siteName: "Resto Action",
    title: CONFIDENTIALITE_EN.metaTitre,
    description: CONFIDENTIALITE_EN.metaDescription,
  },
};

export default function Privacy() {
  return <PageConfidentialite t={EN} c={CONFIDENTIALITE_EN} />;
}
