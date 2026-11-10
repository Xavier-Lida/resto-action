import type { Metadata } from "next";
import PageFaq from "@/components/PageFaq";
import { EN } from "@/lib/textes/en";

export const metadata: Metadata = {
  title: "Frequently asked questions | Resto Action",
  description: "The questions restaurant owners ask us: the platforms, the price, the guarantees, delivery, your team.",
  alternates: { canonical: "/en/faq", languages: { "fr-CA": "/faq", "en-CA": "/en/faq", "x-default": "/faq" } },
};

export default function FaqEn() {
  return <PageFaq t={EN} />;
}
