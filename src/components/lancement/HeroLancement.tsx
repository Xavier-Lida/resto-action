import { ArrowDown } from "lucide-react";
import BarrePlaces from "@/components/BarrePlaces";
import BoutonReserver from "@/components/BoutonReserver";
import DemoApp from "@/components/DemoApp";
import GenerateurApp from "@/components/GenerateurApp";
import { Imprimante } from "@/components/lancement/Imprimante";
import { BoutonContour } from "@/components/lancement/ui";
import { ANCRES, DATE_COHORTE, DATE_LIMITE, HERO, RESTOS_PAR_MOIS, lienReservation } from "@/lib/contenu/grand-lancement";
import { fr } from "@/lib/format";
import type { Textes } from "@/lib/textes/fr";

/* LE HÉRO DU GRAND LANCEMENT D'HIVER.

   Même squelette que le héro d'avant (centré, le téléphone sur le grand
   panneau rouge, « Trouve ton resto » sous le titre), avec les textes de
   l'offre : surtitre, H1, sous-titre, l'accroche en écriture manuscrite, les
   deux boutons et la ligne de cohorte. L'imprimante de cuisine animée prend
   place à côté du téléphone : ce que le client commande sur l'app sort sur le
   billet. */
export default function HeroLancement({ t }: { t: Textes }) {
  return (
    <section id="top" className="bg-white px-3 pt-10 md:px-5 md:pt-16 lg:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <p className="animate-hero inline-flex rounded-full bg-bone px-4 py-1.5 text-xs font-black uppercase tracking-widest text-ink">
          {HERO.surtitre}
        </p>

        <h1 className="animate-hero delay-1 mt-6 max-w-4xl font-display text-[9.5vw] font-black leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-7xl">
          {fr(HERO.h1)}
        </h1>

        <p className="animate-hero delay-2 mt-6 max-w-2xl text-lg leading-relaxed text-ink/70 md:text-xl">
          {fr(HERO.sousTitre)}
        </p>

        <p className="animate-hero delay-2 mt-7 font-script text-4xl leading-none text-brand sm:text-5xl md:text-6xl">
          {HERO.accroche}
        </p>
        <p className="animate-hero delay-3 mt-3 max-w-xl text-sm font-semibold text-ink/55">{fr(HERO.sousAccroche)}</p>

        <div className="flex w-full flex-col items-center">
          <div className="order-2 mt-10 flex w-full flex-col items-center gap-5 lg:order-1">
            <div className="animate-hero delay-3 flex w-full justify-center">
              <GenerateurApp t={t} lancement />
            </div>

            <div className="animate-hero delay-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <BoutonReserver href={ANCRES.calculateur} libelle={HERO.boutonPrincipal} />
              <BoutonContour href={lienReservation()}>
                {HERO.boutonSecondaire}
                <ArrowDown className="size-4 -rotate-90" aria-hidden="true" />
              </BoutonContour>
            </div>

            <div className="animate-hero delay-5">
              <BarrePlaces
                modele={fr(`On lance au plus ${RESTOS_PAR_MOIS} restos par mois au Québec`)}
                prix={fr(`Prochaine cohorte : ${DATE_COHORTE} · Inscriptions jusqu'au ${DATE_LIMITE}`)}
                ton="sombre"
              />
            </div>
          </div>

          {/* LE TÉLÉPHONE ET L'IMPRIMANTE SUR LE PANNEAU ROUGE. */}
          <figure className="animate-hero delay-2 relative order-1 mt-10 w-full lg:order-2 lg:mt-16">
            <div className="relative h-[27rem] overflow-hidden sm:h-[31rem] lg:h-[34rem]">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 top-16 overflow-hidden rounded-[2rem] bg-gradient-to-br from-hero via-hero to-brand lg:top-24 lg:rounded-[3rem]"
              >
                <div className="absolute left-1/2 top-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-white/15 blur-3xl" />
                <svg
                  className="absolute left-1/2 top-full h-[320%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
                  viewBox="0 0 1000 1000"
                  fill="none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {[140, 230, 320, 410, 500, 590, 680, 770, 860, 950].map((r, k) => (
                    <circle
                      key={r}
                      cx="500"
                      cy="500"
                      r={r / 2}
                      stroke="white"
                      strokeOpacity={0.28 - k * 0.022}
                      strokeWidth="1.2"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
              </div>
              <div className="relative flex items-end justify-center gap-6 sm:gap-12">
                {/* L'imprimante, à gauche du téléphone, posée sur le panneau. */}
                <div className="hidden w-52 self-center pt-24 sm:block lg:w-64 lg:pt-32">
                  <Imprimante mode="boucle" className="w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)]" />
                </div>
                <DemoApp
                  demo="client"
                  alt={t.hero.maquette.exempleAlt}
                  attente={t.hero.maquette.attente}
                  className="[--demo-w:15rem] sm:[--demo-w:17rem] lg:[--demo-w:18.5rem]"
                />
              </div>
            </div>
            <figcaption className="mt-3 text-sm font-bold text-ink/55">{t.hero.appHabibi}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
