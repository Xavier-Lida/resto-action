import Reveal from "@/components/Reveal";
import Buoy from "@/components/Buoy";
import IconeGarantie from "@/components/lancement/IconeGarantie";
import { Surtitre } from "@/components/lancement/ui";
import { contenuLancement, type Langue } from "@/lib/contenu/lancement";
import { formats } from "@/lib/format";

/* BLOC 4 : LES 4 GARANTIES, UNE LIGNE CHACUNE.

   Quatre cartes blanches sur la carte sombre : le nom et une ligne courte.
   Le texte complet (celui qui fait foi, repris mot pour mot dans la FAQ et
   dans /conditions-fondateur) s'ouvre en dessous, avec la condition et le
   lien vers le calcul. */
export default function GarantiesLancement({ langue = "fr" }: { langue?: Langue }) {
  const { ANCRES, GARANTIES_CONDITION, GARANTIES_DETAILS, GARANTIES_LIEN_CALCUL, GARANTIES_SECTION, garantiesDisponibles } = contenuLancement(langue);
  const { typo: fr } = formats(langue);
  const garanties = garantiesDisponibles();
  return (
    <section id={ANCRES.garanties.slice(1)} className="bg-white px-3 pb-3 md:px-5 md:pb-5 lg:px-6 lg:pb-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white lg:rounded-[3rem]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-brand/30 blur-3xl" />
        <Buoy className="pointer-events-none absolute -bottom-24 -left-24 w-[380px] opacity-[0.08] -rotate-12" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
          <Reveal>
            <Surtitre ton="sombre">{langue === "en" ? "The guarantees" : "Les garanties"}</Surtitre>
            <h2 className="mt-6 font-display text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">
              {GARANTIES_SECTION.titre}
            </h2>
          </Reveal>
          <ol className="mt-10 grid list-none gap-3 md:grid-cols-2 lg:grid-cols-4">
            {garanties.map((g, i) => (
              <li key={g.id} className="h-full">
                <Reveal delay={Math.min(i, 3) as 0 | 1 | 2 | 3} className="h-full">
                  <div className="flex h-full flex-col rounded-[1.6rem] bg-white p-6 text-ink shadow-2xl">
                    <IconeGarantie id={g.id} />
                    <h3 className="mt-4 font-display text-xl font-black leading-tight">{fr(g.nom)}</h3>
                    <p className="mt-2 font-bold leading-snug text-ink/75">{fr(g.court)}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal>
            <details className="group mt-6 rounded-[1.6rem] bg-white/[0.06] ring-1 ring-white/10 open:bg-white/[0.09]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-black [&::-webkit-details-marker]:hidden">
                {GARANTIES_DETAILS}
                <span aria-hidden="true" className="text-2xl leading-none transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <div className="grid gap-4 px-6 pb-6">
                {garanties.map((g) => (
                  <p key={g.id} className="leading-relaxed text-white/85">
                    <strong className="text-white">{fr(g.nom)}{langue === "en" ? ":" : " :"}</strong> {langue === "en" ? `“${g.texte}”` : `« ${fr(g.texte)} »`}
                  </p>
                ))}
                <p className="text-sm leading-relaxed text-white/60">{fr(GARANTIES_CONDITION)}</p>
                <a href={ANCRES.calculGarantie} className="text-sm font-bold text-white underline underline-offset-4 hover:text-brand">
                  {GARANTIES_LIEN_CALCUL}
                </a>
              </div>
            </details>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
