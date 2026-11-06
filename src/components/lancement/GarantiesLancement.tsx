import { ShieldCheck } from "lucide-react";
import Reveal from "@/components/Reveal";
import Buoy from "@/components/Buoy";
import { Surtitre } from "@/components/lancement/ui";
import {
  ANCRES,
  GARANTIES_CONDITION,
  GARANTIES_LIEN_CALCUL,
  GARANTIES_SECTION,
  garantiesDisponibles,
} from "@/lib/contenu/grand-lancement";
import { fr } from "@/lib/format";

/* LES 4 GARANTIES. Une carte sombre avec la lueur rouge de l'ancienne offre
   fondateur, quatre cartes blanches, la condition et le lien vers la FAQ. Le
   texte vient d'une seule source (GARANTIES) : il est identique ici, dans la
   FAQ et dans /conditions-fondateur. */
export default function GarantiesLancement() {
  const garanties = garantiesDisponibles();
  return (
    <section id={ANCRES.garanties.slice(1)} className="bg-white px-3 pb-3 md:px-5 md:pb-5 lg:px-6 lg:pb-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white lg:rounded-[3rem]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-brand/30 blur-3xl" />
        <Buoy className="pointer-events-none absolute -bottom-24 -left-24 w-[380px] opacity-[0.08] -rotate-12" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
          <Reveal>
            <Surtitre ton="sombre">Les garanties</Surtitre>
            <h2 className="mt-6 font-display text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">
              {GARANTIES_SECTION.titre}
            </h2>
          </Reveal>
          <ol className="mt-12 grid list-none gap-5 md:grid-cols-2 lg:grid-cols-4">
            {garanties.map((g, i) => (
              <li key={g.id}>
                <Reveal delay={Math.min(i, 3) as 0 | 1 | 2 | 3}>
                  <div className="flex h-full flex-col rounded-[2rem] bg-white p-7 text-ink shadow-2xl">
                    <ShieldCheck className="size-9 text-brand" aria-hidden="true" />
                    <h3 className="mt-5 font-display text-2xl font-black leading-tight">{fr(g.nom)}</h3>
                    <p className="mt-3 leading-relaxed text-ink/80">« {fr(g.texte)} »</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal>
            <p className="mt-8 max-w-3xl text-sm leading-relaxed text-white/60">{fr(GARANTIES_CONDITION)}</p>
            <a href={ANCRES.faq} className="mt-3 inline-block text-sm font-bold text-white underline underline-offset-4 hover:text-brand">
              {GARANTIES_LIEN_CALCUL}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
