import BoutonReserver from "@/components/BoutonReserver";
import { Telephone } from "@/components/IllustrationPiece";
import Reveal from "@/components/Reveal";
import { BoutonContour, PointCiel } from "@/components/lancement/ui";
import { contenuLancement, type Langue } from "@/lib/contenu/lancement";
import { ui } from "@/lib/contenu/ui-lancement";
import { formats } from "@/lib/format";

/* LA RARETÉ, À LA OWNER : le grand bandeau de couleur avec le téléphone qui
   dépasse en haut, le titre en gros, une ligne, deux boutons. Plus de mur de
   texte : les détails (2 semaines de préparation, etc.) sont dans la FAQ. */
export default function RareteLancement({ langue = "fr" }: { langue?: Langue }) {
  const { ANCRES, DATE_COHORTE, RARETE, RESTOS_PAR_MOIS, bonusDisponibles, lienReservation } = contenuLancement(langue);
  const { typo: fr } = formats(langue);
  const U = ui(langue);
  const en = langue === "en";
  const expire = bonusDisponibles().filter((b) => b.expire);
  return (
    <section
      id={ANCRES.reserver.slice(1)}
      className="bg-white px-3 pb-3 pt-16 md:px-5 md:pb-5 md:pt-24 lg:px-6 lg:pb-6"
    >
      <div className="relative rounded-[2rem] bg-gradient-to-br from-hero via-hero to-brand text-white lg:rounded-[3rem]">
        <div
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden rounded-[2rem] lg:rounded-[3rem]"
        >
          <div className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]" />
          <div className="absolute -right-20 top-1/2 size-[28rem] -translate-y-1/2 rounded-full bg-white/15 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-black uppercase tracking-widest">
              <PointCiel />
              {fr(U.prochaineCohorte(DATE_COHORTE))}
            </p>
            <h2 className="mt-6 font-display text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">
              {fr(en ? `${RESTOS_PAR_MOIS} restaurants a month, no more.` : `${RESTOS_PAR_MOIS} restos par mois, pas plus.`)}
            </h2>
            <p className="mt-5 max-w-xl text-lg font-bold leading-relaxed text-white/90">
              {fr(RARETE.courte)}
            </p>
            {expire.length > 0 && (
              <p className="mt-2 max-w-xl text-white/75">
                {RARETE.expirePrefixe} {expire.map((b) => b.nom).join(en ? " and " : " et ")}.
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <BoutonReserver
                href={lienReservation()}
                libelle={RARETE.bouton}
                ton="blanc"
                taille="xl"
              />
              <BoutonContour href={ANCRES.calculateur} ton="clair">
                {en ? "Calculate your number" : "Calcule ton chiffre"}
              </BoutonContour>
            </div>
          </Reveal>
          {/* Le téléphone qui dépasse du bandeau, comme chez Owner. */}
          {/* Coupé au bas du bandeau (clip-path), libre en haut. */}
          <div className="relative flex justify-center lg:-mb-20 lg:-mt-40 lg:items-start lg:self-stretch lg:[clip-path:inset(-40rem_-20rem_0_-20rem)]">
            <Telephone
              ecran={{
                src: "/demo-app/client/accueil.webp",
                alt: en ? "The Bistro Habibi app, built by us" : "L'app de Bistro Habibi, faite par nous",
              }}
              className="w-56 drop-shadow-[0_45px_45px_rgba(0,0,0,0.35)] [transform:perspective(1400px)_rotateY(-20deg)_rotateX(8deg)_rotateZ(14deg)] md:w-64 lg:w-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
