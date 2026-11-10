import type { Metadata } from "next";
import PageFaq from "@/components/PageFaq";
import { ANGLAIS_ACTIF } from "@/lib/site";
import { FR } from "@/lib/textes/fr";

/* LA FAQ, SUR SA PROPRE PAGE (/faq). Le contenu : src/components/PageFaq.tsx. */
export const metadata: Metadata = {
  title: "Questions fréquentes | Resto Action",
  description: "Les questions que les proprios de restos nous posent : les plateformes, le prix, les garanties, la livraison, ton équipe.",
  alternates: { canonical: "/faq", languages: ANGLAIS_ACTIF ? { "fr-CA": "/faq", "en-CA": "/en/faq", "x-default": "/faq" } : { "fr-CA": "/faq" } },
};

export default function Faq() {
  return <PageFaq t={FR} />;
}
