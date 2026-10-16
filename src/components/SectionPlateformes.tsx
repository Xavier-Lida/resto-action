import { Check, X } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { Textes } from "@/lib/textes/fr";

/* PLATEFORMES CONTRE TON APP.

   Trois mots-chocs par colonne, en gros : ça se lit d'un coup d'œil, sans
   paragraphe. La colonne des plateformes est barrée de croix, la nôtre cochée.
   Le gros bloc Réserver qui suivait est retiré : l'offre fondateur, juste au-
   dessus, a déjà le sien, et la barre flottante prend le relais. */
export default function SectionPlateformes({ t }: { t: Textes }) {
  const p = t.plateformes;

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

      </div>
    </section>
  );
}
