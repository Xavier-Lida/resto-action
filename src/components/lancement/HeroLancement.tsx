import BoutonReserver from "@/components/BoutonReserver";
import DemoApp from "@/components/DemoApp";
import TitreRoulant from "@/components/TitreRoulant";
import { contenuLancement, type Langue } from "@/lib/contenu/lancement";
import { ui } from "@/lib/contenu/ui-lancement";
import { formats } from "@/lib/format";
import type { Textes } from "@/lib/textes/fr";

/* LE HÉRO DU GRAND LANCEMENT D'HIVER.

   Bloc 1 de l'accueil : la promesse qui roule (H1), le sous-titre,
   l'accroche surlignée en cyan et UN bouton, celui du calculateur. Le
   téléphone sur le grand panneau rouge reste dessous. L'imprimante de cuisine animée prend
   place à côté du téléphone : ce que le client commande sur l'app sort sur le
   billet. */
export default function HeroLancement({ t, langue = "fr" }: { t: Textes; langue?: Langue }) {
  const { ANCRES, DATE_LIMITE, HERO, RESTOS_PAR_MOIS } = contenuLancement(langue);
  const { typo: fr } = formats(langue);
  const U = ui(langue);
  const [debutAccroche, finAccroche] = HERO.accroche.split(U.accrocheCoupure);
  return (
    <section id="top" className="bg-white px-3 pt-10 md:px-5 md:pt-16 lg:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        {/* Le titre qui roule, comme owner.com : le cœur de l'offre, en gros. */}
        <TitreRoulant
          avant={fr(HERO.titreRoulant.avant)}
          lignes={HERO.titreRoulant.mots.map(fr)}
          apres={HERO.titreRoulant.apres.map(fr)}
          classeMot="bg-gradient-to-r from-brand via-[#ff6a3d] to-[#ffb36b] bg-clip-text text-transparent"
          className="animate-hero delay-1 mt-6 w-full max-w-6xl font-display text-[9.5vw] font-black leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl"
        />

        <p className="animate-hero delay-2 mt-6 max-w-2xl text-lg leading-relaxed text-ink/70 md:text-xl">
          {fr(HERO.sousTitre)}
        </p>

        {/* L'accroche, en gros caractères de la maison, le bout qui compte
            surligné en cyan. */}
        <p className="animate-hero delay-2 mt-8 max-w-3xl font-display text-2xl font-black leading-tight tracking-tight text-ink sm:text-3xl md:text-4xl">
          {debutAccroche}{" "}
          <span className="relative inline-block whitespace-nowrap px-1">
            <span
              aria-hidden="true"
              className="surligne absolute inset-x-0 bottom-[0.08em] top-[0.45em] -z-0 rounded-md bg-ciel"
            />
            <span className="relative">
              {U.accrocheCoupure.trim()} {finAccroche}
            </span>
          </span>
        </p>

        <div className="flex w-full flex-col items-center">
          <div className="order-2 mt-10 flex w-full flex-col items-center gap-5 lg:order-1">
            <div className="animate-hero delay-3">
              <BoutonReserver
                href={ANCRES.calculateur}
                libelle={HERO.boutonPrincipal}
                taille="xl"
              />
            </div>
            {/* L'URGENCE, DÈS LE HAUT : la limite et la date. */}
            <p className="animate-hero delay-4 max-w-xl rounded-3xl bg-bone px-4 py-2 text-center text-sm font-bold">
              <span
                className="mr-2 inline-block size-2 rounded-full bg-brand align-middle"
                aria-hidden="true"
              />
              {fr(U.urgence(RESTOS_PAR_MOIS, DATE_LIMITE))}
            </p>
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
                  {[140, 230, 320, 410, 500, 590, 680, 770, 860, 950].map(
                    (r, k) => (
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
                    ),
                  )}
                </svg>
                <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
              </div>
              <div className="relative flex items-end justify-center gap-6 sm:gap-12">
                <DemoApp
                  demo="client"
                  alt={t.hero.maquette.exempleAlt}
                  attente={t.hero.maquette.attente}
                  className="[--demo-w:15rem] sm:[--demo-w:17rem] lg:[--demo-w:18.5rem]"
                />
              </div>
            </div>
            <figcaption className="mt-3 text-sm font-bold text-ink/55">
              {t.hero.appHabibi}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
