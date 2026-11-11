import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BarreNav from "@/components/BarreNav";
import Footer from "@/components/Footer";
import { CONDITIONS_PRETES, NOM_PROGRAMME, REFERE_UN_RESTO } from "@/lib/contenu/references";
import { FR } from "@/lib/textes/fr";

/* LES CONDITIONS DU PROGRAMME (/conditions-refere-un-resto).

   NON PUBLIÉE tant que CONDITIONS_PRETES est faux : la page répond 404. Le
   texte viendra de l'avocat ; il remplacera conditionsGabarit dans
   references.ts, puis on passera l'interrupteur à vrai. */
export const metadata: Metadata = {
  title: `Conditions | ${NOM_PROGRAMME}`,
  robots: CONDITIONS_PRETES ? undefined : { index: false, follow: false },
};

export default function Conditions() {
  if (!CONDITIONS_PRETES) notFound();
  return (
    <>
      <BarreNav t={FR} />
      <main className="flex-1" lang="fr-CA">
        <article className="mx-auto max-w-3xl px-5 py-16 md:py-24">
          <h1 className="font-display text-3xl font-black tracking-tight md:text-5xl">Conditions : {NOM_PROGRAMME}</h1>
          <div className="mt-8 whitespace-pre-line text-ink/80">{REFERE_UN_RESTO.conditionsGabarit}</div>
        </article>
      </main>
      <Footer t={FR} />
    </>
  );
}
