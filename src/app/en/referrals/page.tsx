import type { Metadata } from "next";
import PageReferences from "@/components/PageReferences";
import { REFERENCES_EN } from "@/lib/contenu/references";
import { EN } from "@/lib/textes/en";

export const metadata: Metadata = {
  title: "Referral program | Resto Action",
  description: REFERENCES_EN.sousTitre,
  alternates: { canonical: "/en/referrals", languages: { "fr-CA": "/refere-un-resto", "en-CA": "/en/referrals", "x-default": "/refere-un-resto" } },
};

export default function Referrals() {
  return <PageReferences t={EN} />;
}
