import type { Metadata } from "next";
import PageRefereUnResto from "@/components/references/PageRefereUnResto";
import { NOM_PROGRAMME, REFERE_UN_RESTO } from "@/lib/contenu/references";
import { ANGLAIS_ACTIF } from "@/lib/site";

/* RÉFÈRE UN RESTO (/refere-un-resto). L'ancienne adresse /references y
   redirige (next.config.ts). En anglais, /en/referrals reste la page simple
   tant que la version anglaise du programme n'est pas écrite. */
export const metadata: Metadata = {
  title: `${NOM_PROGRAMME} | Resto Action`,
  description: REFERE_UN_RESTO.page.sousTitre,
  alternates: {
    canonical: "/refere-un-resto",
    languages: ANGLAIS_ACTIF
      ? { "fr-CA": "/refere-un-resto", "en-CA": "/en/referrals", "x-default": "/refere-un-resto" }
      : { "fr-CA": "/refere-un-resto" },
  },
};

export default function Page() {
  return <PageRefereUnResto />;
}
