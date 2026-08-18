import type { Metadata } from "next";
import PageConfidentialite from "@/components/PageConfidentialite";
import { CONFIDENTIALITE_FR } from "@/lib/contenu/confidentialite";
import { FR } from "@/lib/textes/fr";
import { CONFIDENTIALITE, hreflang } from "@/lib/routes";

/* La page n'existait qu'en français et ne déclarait aucun homologue : elle
   annonce maintenant /en/privacy, et réciproquement. */
export const metadata: Metadata = {
  title: CONFIDENTIALITE_FR.metaTitre,
  description: CONFIDENTIALITE_FR.metaDescription,
  alternates: {
    canonical: "/confidentialite",
    languages: hreflang(CONFIDENTIALITE),
  },
  openGraph: {
    type: "website",
    locale: FR.meta.ogLocale,
    alternateLocale: "en_CA",
    url: "/confidentialite",
    siteName: "Resto Action",
    title: CONFIDENTIALITE_FR.metaTitre,
    description: CONFIDENTIALITE_FR.metaDescription,
  },
};

export default function Confidentialite() {
  return <PageConfidentialite t={FR} c={CONFIDENTIALITE_FR} />;
}
