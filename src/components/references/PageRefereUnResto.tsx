import Link from "next/link";
import BarreNav from "@/components/BarreNav";
import Footer from "@/components/Footer";
import { BoutonContour, PointCiel, Surtitre } from "@/components/lancement/ui";
import {
  AFFICHER_MONTANTS,
  CONDITIONS_PRETES,
  ENTENTE_TYPE_PRETE,
  MONTANTS,
  PARTENAIRES_REFERENTS,
  REFERE_UN_RESTO,
  ROUTES_REFERENCES,
  SUIVI_ACTIF,
} from "@/lib/contenu/references";
import { formats } from "@/lib/format";
import { FR } from "@/lib/textes/fr";
import FormulaireLien from "./FormulaireLien";
import FormulairePartenaire from "./FormulairePartenaire";
import FormulairePresente from "./FormulairePresente";

/* LA PAGE /refere-un-resto, dans l'ordre :
     1. La promesse et les deux portes (mon lien, partenaire).
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
  const { typo: fr } = formats("fr");
  const formules = PARTENAIRES_REFERENTS.formules;

  return (
    <>
      <BarreNav t={FR} />
      <main className="flex-1" lang="fr-CA">
        {/* 1. LA PROMESSE */}
        <section className="bg-white px-3 pt-3 md:px-5 md:pt-5 lg:px-6 lg:pt-6">
          <div className="rounded-[2rem] bg-bone px-5 py-14 md:py-20 lg:rounded-[3rem]">
            <div className="mx-auto max-w-4xl text-center">
              <Surtitre>{P.surtitre}</Surtitre>
              <h1 className="mt-4 font-display text-3xl font-black leading-[1.08] tracking-tight md:text-5xl">{fr(P.titre)}</h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-ink/65">{fr(P.sousTitre)}</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#mon-lien"
                  className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-4 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5"
                >
                  {P.boutonClient}
                </a>
                <BoutonContour href="#partenaires">{P.boutonPartenaire}</BoutonContour>
              </div>
              <a href="#presente" className="mt-5 inline-block text-sm font-black text-ink/60 underline decoration-ciel decoration-2 underline-offset-4 hover:text-ink">
                {REFERE_UN_RESTO.presenteNous.titre}
              </a>
            </div>
          </div>
        </section>

        {/* 2. COMMENT ÇA MARCHE */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
            <h2 className="font-display text-3xl font-black tracking-tight md:text-4xl">{P.etapesTitre}</h2>
            <ol className="mt-8 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {P.etapes.map((e, i) => (
                <li key={e.titre} className="rounded-[2rem] bg-bone p-6">
                  <p className="font-display text-3xl font-black text-brand">{String(i + 1).padStart(2, "0")}.</p>
                  <h3 className="mt-3 font-display text-lg font-black leading-tight">{fr(e.titre)}</h3>
                  <p className="mt-2 text-ink/65">{fr(e.texte)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 3. CE QUE GAGNE CHACUN + LES RÈGLES */}
        <section className="bg-white px-3 md:px-5 lg:px-6">
          <div className="rounded-[2rem] bg-ink text-white lg:rounded-[3rem]">
            <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
              <div>
                <h2 className="font-display text-3xl font-black tracking-tight md:text-4xl">{P.gainsTitre}</h2>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    [P.gains.parrainTitre, P.gains.parrain, P.gains.parrainMontant(MONTANTS)],
                    [P.gains.refereTitre, P.gains.refere, P.gains.refereMontant(MONTANTS)],
                  ].map(([titre, texte, montant]) => (
                    <div key={titre} className="rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/10">
                      <p className="text-xs font-black uppercase tracking-widest text-white/50">{titre}</p>
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
                <p className="mt-6 text-sm text-white/60">{fr(P.cohorte)} {fr(P.dateLimite)}</p>
                {SUIVI_ACTIF && <p className="mt-2 text-sm text-white/60">{fr(P.suivi)}</p>}
              </div>
              <div>
                <h2 className="font-display text-2xl font-black tracking-tight md:text-3xl">{P.reglesTitre}</h2>
                <ul className="mt-6 grid list-none gap-3">
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

        {/* 5. LES PARTENAIRES RÉFÉRENTS : la section « techno ». Fond nuit, grille
            fine qui s'efface, deux lueurs (ciel et violet), cartes en verre.
            Peu de texte : trois atouts, quatre étapes, le formulaire. */}
        <section id="partenaires" className="scroll-mt-24 bg-white px-3 md:px-5 lg:px-6">
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#0a0e16] text-white lg:rounded-[3rem]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
            />
            <div aria-hidden="true" className="pointer-events-none absolute -top-48 left-1/2 -z-10 h-[30rem] w-[44rem] -translate-x-1/2 rounded-full bg-ciel/20 blur-[120px]" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-24 -z-10 size-[26rem] rounded-full bg-[#5b5ff0]/25 blur-[110px]" />

            <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
              {/* L'en-tête */}
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-display text-3xl font-black leading-[1.05] tracking-tight md:text-5xl">
                  {fr(B.titreA)}{" "}
                  <span className="bg-gradient-to-r from-ciel to-[#8b8ff8] bg-clip-text text-transparent">{fr(B.titreB)}</span>
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">{fr(B.sousTitreCourt)}</p>
              </div>

              {/* Les trois atouts */}
              <ul className="mt-12 grid list-none gap-3 md:grid-cols-3">
                {B.atouts.map((a, i) => (
                  <li key={a.titre} className="relative overflow-hidden rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10 backdrop-blur md:p-6">
                    <span aria-hidden="true" className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-ciel/70 to-transparent" />
                    <p className="font-mono text-xs font-bold text-ciel">0{i + 1}</p>
                    <p className="mt-2 font-display text-lg font-black md:mt-3 md:text-xl">{fr(a.titre)}</p>
                    <p className="mt-1 text-sm text-white/60">{fr(a.texte)}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
                {/* Les quatre étapes, sur une ligne qui s'allume */}
                <div>
                  <h3 className="font-display text-2xl font-black">{B.etapesTitre}</h3>
                  <ol className="relative mt-7 grid list-none gap-7">
                    <span aria-hidden="true" className="absolute bottom-3 left-[15px] top-3 w-px bg-gradient-to-b from-ciel via-[#5b5ff0] to-transparent" />
                    {B.etapes.map((e, i) => (
                      <li key={e.titre} className="relative flex gap-4">
                        <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-[#0a0e16] font-mono text-xs font-bold text-ciel ring-1 ring-ciel/50 shadow-[0_0_18px_rgba(25,211,240,0.35)]">
                          {i + 1}
                        </span>
                        <span className="pt-1">
                          <span className="block font-black">{fr(e.titre)}</span>
                          <span className="block text-sm text-white/55">{fr(e.texte)}</span>
                        </span>
                      </li>
                    ))}
                  </ol>

                  {ENTENTE_TYPE_PRETE && AFFICHER_MONTANTS ? (
                    <ul className="mt-8 grid list-none gap-2 text-sm">
                      <li className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">{fr(formules.commission(MONTANTS))}</li>
                      <li className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">{fr(formules.mixte(MONTANTS))}</li>
                      <li className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">{fr(formules.echange())}</li>
                    </ul>
                  ) : (
                    <p className="mt-8 text-xs text-white/45">{fr(B.gainsSansEntente)}</p>
                  )}

                  {/* Les règles, repliées : elles comptent, mais pas en gros. */}
                  <details className="group mt-4 rounded-2xl bg-white/[0.04] px-5 py-4 ring-1 ring-white/10">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-white/80 [&::-webkit-details-marker]:hidden">
                      {B.jamaisTitre}
                      <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 leading-none transition group-open:rotate-45">+</span>
                    </summary>
                    <ul className="mt-3 grid list-none gap-2 text-sm text-white/65">
                      {B.jamais.map((x) => (
                        <li key={x} className="flex gap-3">
                          <span className="mt-2 h-0.5 w-3 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                          {fr(x)}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>

                {/* Le formulaire, dans un cadre qui brille sur ses bords */}
                <div>
                  <h3 className="font-display text-2xl font-black">{B.formulaireTitre}</h3>
                  <div className="mt-7 rounded-[2.1rem] bg-gradient-to-br from-ciel/70 via-white/10 to-[#5b5ff0]/70 p-px shadow-[0_30px_80px_-20px_rgba(25,211,240,0.35)]">
                    <FormulairePartenaire />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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
