import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import BarrePlaces from "@/components/BarrePlaces";
import Reveal from "@/components/Reveal";
import { cheminReservation } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

/* L'OFFRE FONDATEUR.

   À gauche, ce qu'on gagne : la promesse (des nouveaux clients, pas juste des
   économies), les 300 $ de pub payée par nous AU LIEU D'UN RABAIS, tout ce
   qui est inclus, la garantie. À droite, une carte blanche qui dit ce
   qu'on paye AU COMPLET, étape par étape, puis le compteur de places et le
   bouton. Tout afficher d'avance est voulu : un resto qui découvre un coût au
   contrat demande son remboursement.

   La garantie et les montants doivent rester identiques au contrat. La
   garantie est à faire valider par l'avocat avant la mise en ligne. */
export default function SectionOffre({ t }: { t: Textes }) {
  const o = t.offre;
  const reserver = cheminReservation(t.racine);

  return (
    <section id="offre" className="bg-white px-3 pb-3 md:px-5 md:pb-5 lg:px-6 lg:pb-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white lg:rounded-[3rem]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-brand/30 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-20 md:py-28 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
          <Reveal>
            <p className="inline-flex rounded-full bg-brand px-4 py-1.5 text-xs font-black uppercase tracking-widest">
              {o.surTitre}
            </p>
            <h2 className="mt-6 font-display text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">
              {o.titre}
            </h2>
            <p className="mt-5 text-xl font-bold text-white/80">{o.sousTitre}</p>

            {/* L'AVANTAGE FONDATEUR : 300 $ DE PUB AU LIEU D'UN RABAIS. C'est
                le morceau qui doit sauter aux yeux, d'où le gros montant. */}
            <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-brand p-6 md:flex-row md:items-center md:gap-6 md:p-7">
              <p className="shrink-0 font-display text-6xl font-black leading-none tracking-tight md:text-7xl">
                {o.pub.montant}
              </p>
              <div>
                <p className="font-display text-xl font-black leading-tight">{o.pub.titre}</p>
                <p className="mt-2 leading-relaxed text-white/90">{o.pub.texte}</p>
              </div>
            </div>

            <p className="mt-10 text-xs font-black uppercase tracking-widest text-white/50">
              {o.inclusTitre}
            </p>
            <ul className="mt-4 grid list-none gap-3 sm:grid-cols-2">
              {o.inclus.map((chose) => (
                <li key={chose} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold leading-snug">{chose}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex gap-4 rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
              <ShieldCheck className="size-8 shrink-0 text-brand" aria-hidden="true" />
              <div>
                <p className="font-display text-lg font-black">{o.garantie.titre}</p>
                <p className="mt-1 leading-relaxed text-white/80">{o.garantie.texte}</p>
                <p className="mt-2 text-sm text-white/50">{o.garantie.note}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="rounded-[2rem] bg-white p-7 text-ink shadow-2xl md:p-8">
              <p className="text-xs font-black uppercase tracking-widest text-ink/50">
                {o.coutsTitre}
              </p>
              <ol className="relative mt-6 grid list-none gap-6 border-l-2 border-ink/10 pl-6">
                {o.couts.map((c, k) => {
                  const { quand, quoi, detail } = c;
                  return (
                    <li key={quand} className="relative">
                      <span
                        aria-hidden="true"
                        className={`absolute -left-[1.95rem] top-1 size-3.5 rounded-full ring-4 ring-white ${
                          k === 0 ? "bg-brand" : "bg-ink/25"
                        }`}
                      />
                      <p className="text-sm font-bold text-ink/55">{quand}</p>
                      <p
                        className={`font-display font-black leading-tight ${
                          k === 0 ? "text-4xl text-brand" : "text-xl"
                        }`}
                      >
                        {quoi}
                        {"barre" in c && c.barre && (
                          <span className="ml-3 align-middle text-xl text-ink/35 line-through decoration-brand decoration-2">
                            {c.barre}
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-sm text-ink/65">{detail}</p>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-6 text-xs text-ink/50">{o.taxes}</p>

              <BarrePlaces modele={t.hero.places} ton="sombre" className="mt-6" />
              <a
                href={reserver}
                className="group mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-brand px-6 py-5 text-lg font-black text-white shadow-[0_5px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
              >
                {o.reserver}
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </a>
              <p className="mt-3 text-center text-sm font-bold text-ink/60">{o.condition}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
