import type { Metadata } from "next";
import Link from "next/link";
import CadreCalcul from "@/components/lancement/CadreCalcul";
import { calculer60, lireDossier60, sur5Ans } from "@/lib/calcul60";
import { CALCUL_60 as K, HERO } from "@/lib/contenu/grand-lancement";
import { argent, entier, fr, pourcent } from "@/lib/format";

/* LE DOSSIER DU CALCUL 60 SECONDES : le calcul du resto, en lecture seule.

   C'est le lien que Guillaume texte au resto, et que le resto montre à son
   associé ou à son comptable. L'adresse porte ses 3 chiffres et RIEN D'AUTRE
   (/calcul/dossier?c=50&m=30&t=25) : ni nom, ni cellulaire, ni nom de resto.
   Rien n'est enregistré chez nous : la page recalcule à partir de l'adresse.
   Pas indexée, et absente du plan du site. */
export const metadata: Metadata = {
  title: K.dossier.titrePage,
  robots: { index: false, follow: false },
};

/** 30 → « 30 $ », 27,5 → « 27,50 $ ». */
function dollars(n: number): string {
  return argent(n, Number.isInteger(n) ? 0 : 2);
}

export default async function DossierCalcul({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const entrees = lireDossier60(await searchParams);

  if (!entrees) {
    return (
      <CadreCalcul>
        <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
          <h1 className="font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">{K.dossier.introuvable}</h1>
          <Link href="/calcul" className="mt-8 inline-flex rounded-full bg-brand px-7 py-3.5 font-black text-white hover:bg-ink">
            {HERO.boutonPrincipal}
          </Link>
        </div>
      </CadreCalcul>
    );
  }

  const reponse = calculer60(entrees);
  const [avantX, apresX] = K.reponse.split("{x}");
  const parAnnee = argent(reponse.parAnnee);

  return (
    <CadreCalcul>
      <div className="mx-auto max-w-3xl px-5 py-10 md:py-16">
        <h1 className="font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">{K.dossier.titrePage}</h1>
        <div className="relative mt-8 overflow-hidden rounded-[2rem] bg-ink p-7 text-white md:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-brand/30 blur-3xl" />
          <p className="relative">
            <span className="block text-lg font-bold text-white/75">{avantX.trim()}</span>
            <span className={`mt-1 block font-display font-black tabular-nums ${parAnnee.length > 9 ? "text-4xl md:text-6xl" : "text-5xl md:text-7xl"}`}>{parAnnee}</span>
            <span className="mt-1 block text-lg font-bold text-white/75">{apresX.trim()}</span>
          </p>
          <p className="relative mt-6 font-display text-xl font-black md:text-2xl">{fr(K.parSemaine.replace("{y}", dollars(reponse.parSemaine)))}</p>
          <p className="relative mt-1 text-base font-bold text-white/85 md:text-lg">{fr(K.sur5Ans.replace("{z}", argent(sur5Ans(reponse))))}</p>
          <p className="relative mt-3 text-sm tabular-nums text-white/60">
            {fr(
              K.formule
                .replace("{commandes}", entier(entrees.commandes))
                .replace("{panier}", dollars(entrees.panier))
                .replace("{taux}", pourcent(entrees.taux)),
            )}
          </p>
          {entrees.taux === 0.2 && <p className="relative mt-6 border-l-4 border-brand pl-4 text-base font-bold">{fr(K.franc20)}</p>}
          <p className="relative mt-6 text-sm leading-relaxed text-white/80">{fr(K.avertissement)}</p>
        </div>
      </div>
    </CadreCalcul>
  );
}
