import Reveal from "@/components/Reveal";
import { Surtitre } from "@/components/lancement/ui";
import { ANCRES, FRISE, disponible } from "@/lib/contenu/grand-lancement";
import { fr } from "@/lib/format";

/* COMMENT ÇA MARCHE : la frise des 7 étapes, de la réservation au premier
   lundi. Le titre à gauche, la frise à droite, dans une carte crème. La frise
   reprend la ligne de jalons de l'ancienne carte de prix. */
export default function FriseLancement() {
  const etapes = FRISE.etapes.filter(disponible);
  return (
    <section id={ANCRES.commentCaMarche.slice(1)} className="bg-white px-3 pb-3 md:px-5 md:pb-5 lg:px-6 lg:pb-6">
      <div className="rounded-[2rem] bg-bone lg:rounded-[3rem]">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <Reveal>
            <Surtitre>Comment ça marche</Surtitre>
            <h2 className="mt-4 font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
              {fr(FRISE.titre)}
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <ol className="liste-numerotee relative grid list-none gap-7 border-l-2 border-ink/10 pl-8">
              {etapes.map((e) => (
                <li key={e.titre} className="relative">
                  <span className="puce-numero absolute -left-[2.55rem] top-0 grid size-8 place-items-center rounded-full bg-brand text-sm font-black text-white ring-4 ring-bone" />
                  <p className="font-display text-lg font-black leading-tight md:text-xl">{fr(e.titre)}</p>
                  <p className="mt-1 leading-relaxed text-ink/70">{fr(e.texte)}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
