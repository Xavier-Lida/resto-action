import type { Metadata } from "next";
import PageReferences from "@/components/PageReferences";
import { REFERENCES } from "@/lib/contenu/references";
import { ANGLAIS_ACTIF } from "@/lib/site";
import { FR } from "@/lib/textes/fr";

/* LE PROGRAMME DE RÉFÉRENCES (/references). Le contenu : src/components/PageReferences.tsx. */
export const metadata: Metadata = {
  title: "Programme de références | Resto Action",
  description: REFERENCES.sousTitre,
  alternates: { canonical: "/references", languages: ANGLAIS_ACTIF ? { "fr-CA": "/references", "en-CA": "/en/referrals", "x-default": "/references" } : { "fr-CA": "/references" } },
};

export default function References() {
  return <PageReferences t={FR} />;
}
