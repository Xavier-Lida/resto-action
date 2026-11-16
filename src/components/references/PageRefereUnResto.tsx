import Link from "next/link";
import BarreNav from "@/components/BarreNav";
import Footer from "@/components/Footer";
import { BoutonContour, PointCiel, Surtitre } from "@/components/lancement/ui";
import {
  AFFICHER_MONTANTS,
  CONDITIONS_PRETES,
  MONTANTS,
  PARTENAIRES_REFERENTS,
  REFERE_UN_RESTO,
  ROUTES_REFERENCES,
  SUIVI_ACTIF,
} from "@/lib/contenu/references";
import { formats } from "@/lib/format";
import { FR } from "@/lib/textes/fr";
import ChoixReferent from "./ChoixReferent";
import FormulaireLien from "./FormulaireLien";
import FormulairePartenaire from "./FormulairePartenaire";
import FormulairePresente from "./FormulairePresente";

/* LA PAGE /refere-un-resto, dans l'ordre :
     1. La promesse et les deux portes (j'ai un resto, je suis un pro).
     Puis LE CHOIX (ChoixReferent) : deux grandes cartes. « J'ai un resto »
     ouvre les parties 2 à 4, « Je suis un pro » ouvre la partie 5.
     2. Comment ça marche, en 4 étapes.
     3. Ce que gagne chacun, et les règles.
     4. « Ton lien à toi » (resto client), puis « Présente-nous quelqu'un ».
     5. Les partenaires référents (fournisseurs, comptables, associations…).
     6. La FAQ.
   Tous les textes : src/lib/contenu/references.ts. Les montants n'apparaissent
   que si AFFICHER_MONTANTS est vrai ; les formules des partenaires, que si
   ENTENTE_TYPE_PRETE l'est aussi. */
export default function PageRefereUnResto() {
  const P = REFERE_UN_RESTO.page;
  const B = PARTENAIRES_REFERENTS.page;
  const S = PARTENAIRES_REFERENTS.simple;
  const { typo: fr } = formats("fr");
  const C = REFERE_UN_RESTO.choix;

  return (
    <>
      <BarreNav t={FR} />
      <main className="flex-1" lang="fr-CA">
        {/* 1. LA PROMESSE */}
        <section className="bg-white px-3 pt-3 md:px-5 md:pt-5 lg:px-6 lg:pt-6">
          <div className="rounded-[2rem] bg-bone px-5 py-10 md:py-20 lg:rounded-[3rem]">
            <div className="mx-auto max-w-4xl text-center">
              <Surtitre>{P.surtitre}</Surtitre>
              {/* Au cellulaire, la version courte ; à l'ordi, la longue. */}
              <h1 className="font-display text-4xl font-black leading-[1.05] tracking-tight md:mt-4 md:text-5xl">
                <span className="md:hidden">{fr(P.titreCourt)}</span>
                <span className="hidden md:inline">{fr(P.titre)}</span>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-ink/65 md:mt-5">
                <span className="md:hidden">{fr(P.sousTitreCourt)}</span>
                <span className="hidden md:inline">{fr(P.sousTitre)}</span>
              </p>
              {/* Au cellulaire, les deux cartes juste dessous font déjà le travail des boutons. */}
              <div className="mt-8 hidden flex-col items-center justify-center gap-3 sm:flex sm:flex-row">
                <a
                  href="#resto"
                  className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-4 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5"
                >
                  {P.boutonResto}
                </a>
                <BoutonContour href="#partenaires">{P.boutonPro}</BoutonContour>
              </div>
            </div>
          </div>
        </section>

        {/* LE CHOIX : j'ai un resto, ou je suis un pro. La partie choisie s'ouvre dessous. */}
        <ChoixReferent
          titre={C.titre}
          choisir={C.choisir}
          choisi={C.choisi}
          resto={{
            etiquette: C.resto.etiquette,
            qui: C.resto.qui,
            montant: AFFICHER_MONTANTS ? fr(C.resto.montant(MONTANTS)) : "",
            sousMontant: AFFICHER_MONTANTS ? C.resto.sousMontant : C.resto.sansMontant,
            sousCourt: AFFICHER_MONTANTS ? C.resto.sousCourt : C.resto.sansMontant,
            texte: fr(AFFICHER_MONTANTS ? C.resto.texte(MONTANTS) : C.resto.texteSansMontant),
          }}
          pro={{
            etiquette: C.pro.etiquette,
            qui: C.pro.qui,
            montant: AFFICHER_MONTANTS ? fr(C.pro.montant(MONTANTS)) : "",
            sousMontant: AFFICHER_MONTANTS ? C.pro.sousMontant : C.pro.sansMontant,
            sousCourt: AFFICHER_MONTANTS ? C.pro.sousCourt : C.pro.sansMontant,
            texte: fr(AFFICHER_MONTANTS ? C.pro.texte : C.pro.texteSansMontant),
          }}
          contenuResto={
            <>
            {/* 2. COMMENT ÇA MARCHE */}
            <section className="bg-white">
              <div className="mx-auto max-w-6xl px-5 py-10 md:py-20">
                <h2 className="font-display text-2xl font-black tracking-tight md:text-4xl">{P.etapesTitre}</h2>
                {/* Au cellulaire : 4 lignes compactes (numéro à gauche) ; à l'ordi : 4 cartes. */}
                <ol className="mt-5 grid list-none gap-2 sm:grid-cols-2 md:mt-8 md:gap-4 lg:grid-cols-4">
                  {P.etapes.map((e, i) => (
                    <li key={e.titre} className="flex gap-4 rounded-2xl bg-bone p-4 md:block md:rounded-[2rem] md:p-6">
                      <p className="font-display text-2xl font-black text-brand md:text-3xl">{String(i + 1).padStart(2, "0")}.</p>
                      <div>
                        <h3 className="font-display text-base font-black leading-tight md:mt-3 md:text-lg">{fr(e.titre)}</h3>
                        <p className="mt-1 text-sm text-ink/65 md:mt-2 md:text-base">{fr(e.texte)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* 3. CE QUE GAGNE CHACUN + LES RÈGLES */}
            <section className="bg-white px-3 md:px-5 lg:px-6">
              <div className="rounded-[2rem] bg-ink text-white lg:rounded-[3rem]">
                <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 md:gap-10 md:py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
                  <div>
                    <h2 className="font-display text-2xl font-black tracking-tight md:text-4xl">{P.gainsTitre}</h2>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {[
                        [P.gains.parrainTitre, P.gains.parrain, P.gains.parrainMontant(MONTANTS)],
                        [P.gains.refereTitre, P.gains.refere, P.gains.refereMontant(MONTANTS)],
                      ].map(([titre, texte, montant]) => (
                        <div key={titre} className="rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/10">
                          <p className="text-sm font-bold text-white/50">{titre}</p>
                          <p className="mt-2 text-lg font-black leading-snug">{fr(texte)}</p>
                          {AFFICHER_MONTANTS && <p className="mt-2 font-black text-ciel">{fr(montant)}</p>}
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 inline-flex items-center gap-2 text-sm text-white/70">
                      <PointCiel />
                      {fr(P.gains.liberation)}
                    </p>
                    {!AFFICHER_MONTANTS && <p className="mt-2 text-sm text-white/50">{fr(P.gains.confirmeParEcrit)}</p>}
                    <p className="mt-6 hidden text-sm text-white/60 md:block">{fr(P.cohorte)} {fr(P.dateLimite)}</p>
                    {SUIVI_ACTIF && <p className="mt-2 text-sm text-white/60">{fr(P.suivi)}</p>}
                  </div>
                  <div>
                    {/* Au cellulaire, les règles sont repliées. */}
                    <details className="group rounded-2xl bg-white/[0.06] px-5 py-4 ring-1 ring-white/10 md:hidden">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black [&::-webkit-details-marker]:hidden">
                        {P.reglesTitre}
                        <span aria-hidden="true" className="grid size-6 place-items-center rounded-full bg-white/10 leading-none transition group-open:rotate-45">+</span>
                      </summary>
                      <ul className="mt-4 grid list-none gap-2 text-sm">
                        {P.regles.map((r) => (
                          <li key={r} className="flex gap-3 text-white/80">
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ciel" aria-hidden="true" />
                            {fr(r)}
                          </li>
                        ))}
                      </ul>
                    </details>
                    <h2 className="hidden font-display text-2xl font-black tracking-tight md:block md:text-3xl">{P.reglesTitre}</h2>
                    <ul className="mt-6 hidden list-none gap-3 md:grid">
                      {P.regles.map((r) => (
                        <li key={r} className="flex gap-3 text-white/80">
                          <span className="mt-2 size-2 shrink-0 rounded-full bg-ciel" aria-hidden="true" />
                          {fr(r)}
                        </li>
                      ))}
                    </ul>
                    {CONDITIONS_PRETES && (
                      <Link href={ROUTES_REFERENCES.conditions} className="mt-6 inline-block text-sm font-black text-white/70 underline underline-offset-4 hover:text-white">
                        {P.conditionsLien}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 4. TON LIEN, PUIS PRÉSENTE-NOUS QUELQU'UN */}
            <section className="bg-white">
              <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
                <div id="mon-lien" className="scroll-mt-28">
                  <h2 className="font-display text-3xl font-black tracking-tight md:text-4xl">{REFERE_UN_RESTO.monLien.titre}</h2>
                  <p className="mt-2 text-lg text-ink/65">{fr(REFERE_UN_RESTO.monLien.aide)}</p>
                  <div className="mt-8">
                    <FormulaireLien />
                  </div>
                </div>
                <div id="presente" className="scroll-mt-28">
                  <h2 className="font-display text-3xl font-black tracking-tight md:text-4xl">{REFERE_UN_RESTO.presenteNous.titre}</h2>
                  <p className="mt-2 text-lg text-ink/65">{fr(REFERE_UN_RESTO.presenteNous.aide)}</p>
                  <div className="mt-8">
                    <FormulairePresente />
                  </div>
                </div>
              </div>
            </section>
            </>
          }
          contenuPro={
            <>
            {/* 5. JE CONNAIS UN RESTO (16 nov.) : très simple, pour n'importe qui.
                Un titre qui dit le montant, trois étapes, le formulaire. */}
            <section className="bg-white px-3 pb-6 md:px-5 lg:px-6">
              <div className="rounded-[2rem] bg-bone lg:rounded-[3rem]">
                <div className="mx-auto max-w-5xl px-5 py-14 md:py-20">
                  <div className="text-center">
                    <h2 className="font-display text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">
                      {fr(S.titreA)}
                      <span className="block text-brand">{fr(S.titreB(MONTANTS))}</span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink/70">{fr(S.sousTitre(MONTANTS))}</p>
                  </div>

                  <ol className="mt-10 grid list-none gap-3 md:mt-12 md:grid-cols-3">
                    {S.etapes(MONTANTS).map((e, i) => (
                      <li
                        key={e.titre}
                        className={`flex gap-4 rounded-3xl p-5 md:block md:p-7 ${i === 2 ? "bg-brand text-white" : "bg-white text-ink"}`}
                      >
                        <span className={`grid size-10 shrink-0 place-items-center rounded-full font-display text-lg font-black ${i === 2 ? "bg-white text-brand" : "bg-ink text-white"}`}>
                          {i + 1}
                        </span>
                        <span className="block md:mt-5">
                          <span className="block font-display text-xl font-black leading-tight">{fr(e.titre)}</span>
                          <span className={`mt-1 block text-sm leading-relaxed ${i === 2 ? "text-white/85" : "text-ink/60"}`}>{fr(e.texte)}</span>
                        </span>
                      </li>
                    ))}
                  </ol>

                  <div className="mx-auto mt-12 max-w-2xl">
                    <h3 className="text-center font-display text-2xl font-black md:text-3xl">{fr(S.formulaireTitre)}</h3>
                    <div className="mt-6">
                      <FormulairePartenaire />
                    </div>
                    <p className="mt-4 text-center text-xs text-ink/50">{fr(S.ecrit)}</p>

                    {/* Les règles, repliées : elles comptent, mais pas en gros. */}
                    <details className="group mt-6 rounded-2xl bg-white px-5 py-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-ink/70 [&::-webkit-details-marker]:hidden">
                        {B.jamaisTitre}
                        <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-bone leading-none transition group-open:rotate-45">+</span>
                      </summary>
                      <ul className="mt-3 grid list-none gap-2 text-sm text-ink/65">
                        {B.jamais.map((x) => (
                          <li key={x} className="flex gap-3">
                            <span className="mt-2 h-0.5 w-3 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                            {fr(x)}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                </div>
              </div>
            </section>
            </>
          }
        />

        {/* 6. LA FAQ */}
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
            <h2 className="font-display text-3xl font-black tracking-tight md:text-4xl">FAQ</h2>
            <div className="mt-8 divide-y divide-bone rounded-[2rem] bg-white ring-1 ring-ink/10">
              {REFERE_UN_RESTO.faq.map((q) => (
                <details key={q.q} className="group px-6 py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black [&::-webkit-details-marker]:hidden">
                    {fr(q.q)}
                    <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-bone text-lg leading-none transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-ink/70">{fr(q.r)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer t={FR} />
    </>
  );
}
