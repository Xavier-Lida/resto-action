import type { Metadata } from "next";
import PageConditions from "@/components/PageConditions";
import { CONDITIONS_FR } from "@/lib/contenu/conditions-fondateur";
import { FR } from "@/lib/textes/fr";
import { CONDITIONS, hreflang } from "@/lib/routes";

export const metadata: Metadata = {
  title: CONDITIONS_FR.metaTitre,
  description: CONDITIONS_FR.metaDescription,
  alternates: { canonical: CONDITIONS.fr, languages: hreflang(CONDITIONS) },
};

export default function ConditionsFondateur() {
  return <PageConditions t={FR} c={CONDITIONS_FR} />;
}
