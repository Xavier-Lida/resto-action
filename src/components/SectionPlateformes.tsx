import { ArrowRight, Check, X } from "lucide-react";
import BarrePlaces from "@/components/BarrePlaces";
import Reveal from "@/components/Reveal";
import { RESERVATION_URL } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

/* PLATEFORMES CONTRE TON APP — ET LE GROS BOUTON.

   Trois mots-chocs par colonne, en gros : ça se lit d'un coup d'œil, sans
   paragraphe. La colonne des plateformes est barrée de croix, la nôtre cochée.
   Dessous, la réservation prend toute la largeur, dans le rouge du héro, avec
   le compteur de places : c'est l'endroit de la page où l'envie est la plus
   forte, le bouton doit y être impossible à manquer. */
export default function SectionPlateformes({ t }: { t: Textes }) {
  const p = t.plateformes;
  const reserver = RESERVATION_URL ?? `${t.racine}/contact`;

  return (
    <section id="plateformes" className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Reveal>
          <h2 className="max-w-4xl font-display text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">
            {p.titre}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-[2rem] border-2 border-ink/10 bg-bone p-8 md:p-10">
              <p className="text-xs font-black uppercase tracking-widest text-ink/50">
                {p.eux.titre}
              </p>
              <ul className="mt-6 grid list-none gap-5">
                {p.eux.points.map((point) => (
                  <li key={point} className="flex items-center gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink/10 text-ink/60">
                      <X className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-xl font-black text-ink/55 md:text-2xl">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="h-full rounded-[2rem] bg-ink p-8 text-white md:p-10">
              <p className="text-xs font-black uppercase tracking-widest text-brand">
                {p.toi.titre}
              </p>
              <ul className="mt-6 grid list-none gap-5">
                {p.toi.points.map((point) => (
                  <li key={point} className="flex items-center gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white">
                      <Check className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-xl font-black md:text-2xl">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={2}>
          <div className="mt-5 flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-hero p-8 text-white md:flex-row md:items-center md:p-10">
            <div className="flex flex-col gap-3">
              <BarrePlaces modele={t.hero.places} />
              <p className="text-sm font-semibold text-white/85">{p.sous}</p>
            </div>
            <a
              href={reserver}
              className="group inline-flex items-center gap-3 rounded-full bg-white px-9 py-5 text-xl font-black text-ink shadow-[0_5px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 hover:shadow-[0_7px_0_0_var(--ombre-cta)] active:translate-y-1 active:shadow-none md:text-2xl"
            >
              {p.reserver}
              <ArrowRight className="size-6 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
