import BarreNav from "@/components/BarreNav";
import Footer from "@/components/Footer";
import FormulaireReference from "@/components/FormulaireReference";
import { PointCiel } from "@/components/lancement/ui";
import { AFFICHER_MONTANTS, MONTANTS, REFERENCES, REFERENCES_EN } from "@/lib/contenu/references";
import { formats } from "@/lib/format";
import type { Textes } from "@/lib/textes/fr";

/* LE PROGRAMME DE RÉFÉRENCES (/references), version simple : on explique
   comment ça marche, puis la personne laisse ses coordonnées et on la
   rappelle. Les montants ne s'affichent pas tant qu'ils ne sont pas
   confirmés (AFFICHER_MONTANTS dans src/lib/contenu/references.ts). */
export default function PageReferences({ t }: { t: Textes }) {
  const langue = t.htmlLang.startsWith("en") ? "en" : "fr";
  const R = langue === "en" ? REFERENCES_EN : REFERENCES;
  const { typo: fr } = formats(langue);
  return (
    <>
      <BarreNav t={t} />
      <main className="flex-1" lang={t.htmlLang}>
        {/* L'EN-TÊTE */}
        <section className="bg-white px-3 pt-3 md:px-5 md:pt-5 lg:px-6 lg:pt-6">
          <div className="rounded-[2rem] bg-bone px-5 py-14 md:py-20 lg:rounded-[3rem]">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="font-display text-3xl font-black leading-[1.08] tracking-tight md:text-5xl">{fr(R.titre)}</h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-ink/65">{fr(R.sousTitre)}</p>
              <a
                href="#formulaire"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-brand px-7 py-4 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5"
              >
                {R.bouton}
              </a>
            </div>
          </div>
        </section>

        {/* COMMENT ÇA MARCHE */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
            <h2 className="font-display text-3xl font-black tracking-tight md:text-4xl">{R.etapesTitre}</h2>
            <ol className="mt-8 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {R.etapes.map((e, i) => (
                <li key={e.titre} className="rounded-[2rem] bg-bone p-6">
                  <p className="font-display text-3xl font-black text-brand">{String(i + 1).padStart(2, "0")}.</p>
                  <h3 className="mt-3 font-display text-lg font-black leading-tight">{fr(e.titre)}</h3>
                  <p className="mt-2 text-ink/65">{fr(e.texte)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CE QUE TU REÇOIS + LES RÈGLES */}
        <section className="bg-white px-3 md:px-5 lg:px-6">
          <div className="rounded-[2rem] bg-ink text-white lg:rounded-[3rem]">
            <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
              <div>
                <h2 className="font-display text-3xl font-black tracking-tight md:text-4xl">{R.pourQuiTitre}</h2>
                <ul className="mt-8 grid list-none gap-3">
                  {R.pourQui.map((p) => (
                    <li key={p.profil} className="rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/10">
                      <p className="font-black">{fr(p.profil)}</p>
                      <p className="mt-1 text-white/70">{fr(p.texte)}</p>
                      {AFFICHER_MONTANTS && <p className="mt-2 font-black text-ciel">{fr(p.montant(MONTANTS))}</p>}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 inline-flex items-center gap-2 text-sm text-white/60">
                  <PointCiel />
                  {fr(AFFICHER_MONTANTS ? R.refereMontant(MONTANTS) : R.refere)}
                </p>
                {!AFFICHER_MONTANTS && <p className="mt-2 text-sm text-white/60">{fr(R.confirmeParEcrit)}</p>}
              </div>
              <div>
                <h2 className="font-display text-2xl font-black tracking-tight md:text-3xl">{R.reglesTitre}</h2>
                <ul className="mt-6 grid list-none gap-3">
                  {R.regles.map((r) => (
                    <li key={r} className="flex gap-3 text-white/80">
                      <span className="mt-2 size-2 shrink-0 rounded-full bg-ciel" aria-hidden="true" />
                      {fr(r)}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-white/50">{fr(R.conditionsNote)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* LE FORMULAIRE */}
        <section id="formulaire" className="scroll-mt-24 bg-white">
          <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
            <h2 className="font-display text-3xl font-black tracking-tight md:text-4xl">{R.formulaireTitre}</h2>
            <p className="mt-2 text-lg text-ink/65">{R.formulaireAide}</p>
            <div className="mt-8">
              <FormulaireReference langue={langue} />
            </div>
          </div>
        </section>
      </main>
      <Footer t={t} />
    </>
  );
}
