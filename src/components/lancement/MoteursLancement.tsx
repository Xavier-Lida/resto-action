import Image from "next/image";
import Reveal from "@/components/Reveal";
import { MOTEURS } from "@/lib/contenu/grand-lancement";
import { fr } from "@/lib/format";

/* LES 3 MOTEURS, PORTÉS PAR LA MASCOTTE. Même mise en page que les trois
   étapes « Comment ça marche » d'avant : cercles reliés par un pointillé,
   pastille numérotée, le titre et le texte. */
const IMAGES = ["/mascotte-regle.webp", "/mascotte-creuse.webp", "/mascotte-ecoute.webp"];

export default function MoteursLancement() {
  return (
    <section id="moteurs" className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Reveal>
          <h2 className="max-w-3xl font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
            {fr(MOTEURS.titre)}
          </h2>
        </Reveal>

        <div className="relative mt-16">
          <div
            aria-hidden="true"
            className="absolute left-[17%] right-[17%] top-20 hidden border-t-2 border-dashed border-brand/40 md:block"
          />
          <ol className="liste-numerotee grid list-none gap-12 md:grid-cols-3 md:gap-8">
            {MOTEURS.liste.map((m, i) => (
              <li key={m.id}>
                <Reveal delay={i as 0 | 1 | 2}>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative z-10">
                      <div className="size-40 overflow-hidden rounded-full border-2 border-ink bg-bone">
                        <Image draggable={false} src={IMAGES[i]} alt="" width={1024} height={1024} unoptimized className="size-full object-cover" />
                      </div>
                      <span className="puce-numero absolute -bottom-3 left-1/2 z-20 grid size-8 -translate-x-1/2 place-items-center rounded-full bg-brand text-sm font-black text-white" />
                    </div>
                    <h3 className="mt-7 font-display text-lg font-bold md:text-xl">{fr(m.titre)}</h3>
                    <p className="mt-2 max-w-[40ch] leading-relaxed text-ink/75">{fr(m.texte)}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <Reveal>
          <p className="mx-auto mt-16 max-w-3xl rounded-3xl bg-bone px-6 py-5 text-center text-lg font-bold leading-snug md:text-xl">
            {fr(MOTEURS.effort)}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
