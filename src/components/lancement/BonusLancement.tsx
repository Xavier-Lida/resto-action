import Reveal from "@/components/Reveal";
import { AnimerAuDefilement } from "@/components/lancement/AnimerAuDefilement";
import { Surtitre } from "@/components/lancement/ui";
import { Visuel } from "@/components/lancement/visuels";
import { BONUS_SECTION, bonusDisponibles, valeurAffichable } from "@/lib/contenu/grand-lancement";
import { argent, fr } from "@/lib/format";

/* LES 5 BONUS. Cartes crème numérotées; l'étiquette « Si tu signes avant
   le… » sur ceux qui expirent. L'imprimante du haut de page sert de visuel à
   L'Équipement offert. Une valeur s'affiche seulement avec 2 soumissions. */
export default function BonusLancement() {
  const bonus = bonusDisponibles();
  return (
    <section id="bonus" className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Reveal>
          <Surtitre>Les bonus</Surtitre>
          <h2 className="mt-4 font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
            {fr(BONUS_SECTION.titre)}
          </h2>
        </Reveal>
        <ol className="liste-numerotee mt-12 grid list-none gap-5 md:grid-cols-2 lg:grid-cols-3">
          {bonus.map((b, i) => {
            const valeur = valeurAffichable(b);
            return (
              <li key={b.id}>
                <Reveal delay={(i % 3) as 0 | 1 | 2}>
                  <div className="flex h-full flex-col rounded-[2rem] bg-bone p-6 md:p-7">
                    {b.visuel && (
                      <AnimerAuDefilement>
                        <Visuel type={b.visuel} />
                      </AnimerAuDefilement>
                    )}
                    <div className="flex items-start justify-between gap-3">
                      <span className="puce-numero grid size-8 place-items-center rounded-full bg-brand text-sm font-black text-white" />
                      {valeur != null && (
                        <span className="rounded-full bg-white px-3 py-1 text-sm font-black">{argent(valeur)}</span>
                      )}
                    </div>
                    <h3 className="mt-4 font-display text-xl font-black leading-tight">{fr(b.nom)}</h3>
                    <p className="mt-2 leading-relaxed text-ink/75">{fr(b.ligne)}</p>
                    {b.expire && (
                      <p className="mt-4 inline-flex w-fit rounded-full bg-brand px-3 py-1 text-[0.7rem] font-black uppercase tracking-widest text-white">
                        {fr(BONUS_SECTION.etiquetteExpire)}
                      </p>
                    )}
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
