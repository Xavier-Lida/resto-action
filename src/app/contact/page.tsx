import type { Metadata } from "next";
import PageContact from "@/components/PageContact";
import { FR } from "@/lib/textes/fr";
import { CONTACT, hreflang } from "@/lib/routes";

/* Le canonique et l'OpenGraph vivent ici, jamais dans le layout : sinon
   /en/contact hériterait du canonique français. Même règle que pour l'accueil. */
export const metadata: Metadata = {
  title: FR.pageContact.metaTitre,
  description: FR.pageContact.metaDescription,
  alternates: { canonical: "/contact", languages: hreflang(CONTACT) },
  openGraph: {
    type: "website",
    locale: FR.meta.ogLocale,
    alternateLocale: "en_CA",
    url: "/contact",
    siteName: "Resto Action",
    title: FR.pageContact.metaTitre,
    description: FR.pageContact.metaDescription,
  },
};

export default function Contact() {
  return <PageContact t={FR} />;
}
