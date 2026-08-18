import type { Metadata } from "next";
import PageContact from "@/components/PageContact";
import { EN } from "@/lib/textes/en";
import { CONTACT, hreflang } from "@/lib/routes";

export const metadata: Metadata = {
  title: EN.pageContact.metaTitre,
  description: EN.pageContact.metaDescription,
  alternates: { canonical: "/en/contact", languages: hreflang(CONTACT) },
  openGraph: {
    type: "website",
    locale: EN.meta.ogLocale,
    alternateLocale: "fr_CA",
    url: "/en/contact",
    siteName: "Resto Action",
    title: EN.pageContact.metaTitre,
    description: EN.pageContact.metaDescription,
  },
};

export default function ContactEn() {
  return <PageContact t={EN} />;
}
