import type { Metadata } from "next";
import PageConditions from "@/components/PageConditions";
import { CONDITIONS_EN } from "@/lib/contenu/conditions-fondateur";
import { EN } from "@/lib/textes/en";
import { CONDITIONS, hreflang } from "@/lib/routes";

export const metadata: Metadata = {
  title: CONDITIONS_EN.metaTitre,
  description: CONDITIONS_EN.metaDescription,
  alternates: { canonical: CONDITIONS.en, languages: hreflang(CONDITIONS) },
};

export default function FounderTerms() {
  return <PageConditions t={EN} c={CONDITIONS_EN} />;
}
