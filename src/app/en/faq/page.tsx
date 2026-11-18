import type { Metadata } from "next";
import PageFaq from "@/components/PageFaq";
import { EN } from "@/lib/textes/en";

/* La mise en service passe de 750 $ à 1 500 $ le 19 déc. à 0 h (heure de Montréal) :
   la page se régénère toutes les 5 minutes, sans redéploiement. */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Frequently asked questions | Resto Action",
  description: "The questions restaurant owners ask us: the platforms, the price, the guarantees, delivery, your team.",
  alternates: { canonical: "/en/faq", languages: { "fr-CA": "/faq", "en-CA": "/en/faq", "x-default": "/faq" } },
};

export default function FaqEn() {
  return <PageFaq t={EN} />;
}
