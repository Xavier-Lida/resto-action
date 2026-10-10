import Link from "next/link";
import { ArrowDown } from "lucide-react";
import BarrePlaces from "@/components/BarrePlaces";
import GenerateurApp from "@/components/GenerateurApp";
import IconeYoutube from "@/components/IconeYoutube";
import LecteurVideo from "@/components/LecteurVideo";
import LienPasPret from "@/components/LienPasPret";
import {
  LINKEDIN_URL,
  cheminReservation,
  VIDEO_ACCUEIL,
  YOUTUBE_ABONNEMENT_URL,
} from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";
import BoutonReserver from "@/components/BoutonReserver";

// Glyphe LinkedIn (lucide-react ne fournit plus d'icônes de marques).
function IconeLinkedIn({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452z" />
    </svg>
  );
}

/* LE HÉRO DE LA MAQUETTE : LE TEXTE À GAUCHE, LA VIDÉO À DROITE.

   À gauche, tout ce qui fait agir, dans l'ordre de lecture : d'où on vient, ce
   qu'on promet (le H1), ce qui est inclus, le champ « trouve ton resto », la
   condition de la réservation, puis les deux portes — réserver, ou parler
   d'abord. À droite, la vidéo, qui démarre seule et sans son quand le visiteur
   a accepté les témoins (voir LecteurVideo). En pile, au téléphone, la vidéo
   suit le texte : l'action se voit avant elle.

   L'ancien H1 tournant (TitreTournant) et la carte « Parle à Guillaume » ont
   quitté le héro ; le composant TitreTournant reste dans le dépôt. */
export default function Hero({ t }: { t: Textes }) {
  const reserver = cheminReservation(t.racine);

  return (
    <section id="top" className="bg-white p-3 md:p-5 lg:p-6">
      <div className="relative flex min-h-[84svh] flex-col rounded-[2rem] bg-hero pb-12 text-white lg:rounded-[3rem] lg:pb-0">
        {/* Languette basse : une bosse rouge qui sort de la carte vers le
            bas, la flèche blanche logée dedans */}
        <Link
          href={`${t.racine}/#approche`}
          aria-label={t.nav.descendre}
          className="absolute left-1/2 top-full z-30 -mt-px -translate-x-1/2"
        >
          <svg
            viewBox="0 0 180 44"
            aria-hidden="true"
            className="block h-11 w-44 fill-hero"
          >
            <path d="M0,0 C45,0 48,38 90,38 C132,38 135,0 180,0 Z" />
          </svg>
          <ArrowDown className="absolute left-1/2 top-1.5 size-5 -translate-x-1/2 animate-bounce text-white" />
        </Link>

        {/* La colonne de la vidéo est plus large que celle du texte (7 contre 5) et
            le conteneur s'élargit sur grand écran : à 1440 px, la vidéo passe
            d'environ 515 px à 750 px de large, assez pour lire les sous-titres. */}
        <div className="mx-auto grid w-full max-w-[90rem] flex-1 items-center gap-10 px-5 pt-14 md:px-8 md:pt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:pb-28">
          <div className="flex flex-col gap-6">
            <p className="animate-hero delay-1 self-start rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
              {t.hero.badge}
            </p>

            <h1 className="animate-hero delay-1 font-display text-5xl font-black leading-[0.95] tracking-tight md:text-7xl lg:text-6xl xl:text-7xl">
              {t.hero.titre.map((ligne) => (
                <span key={ligne} className="block">
                  {ligne}
                </span>
              ))}
            </h1>

            <ul className="animate-hero delay-2 flex list-none flex-wrap gap-2">
              {t.hero.puces.map((puce) => (
                <li
                  key={puce}
                  className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold"
                >
                  {puce}
                </li>
              ))}
            </ul>

            {/* « TROUVE TON RESTO » : l'aperçu de l'app au nom du resto. */}
            <GenerateurApp t={t} />

            <div className="animate-hero delay-3 flex flex-col gap-2">
              <p className="text-sm font-bold leading-relaxed text-white">{t.lancement.accroche}</p>
              <BarrePlaces modele={t.hero.places} />
              <p className="text-sm font-semibold text-white/85">
                {t.hero.condition}
              </p>
            </div>

            <div className="animate-hero delay-3 flex flex-wrap items-center gap-x-5 gap-y-3">
              <BoutonReserver href={reserver} libelle={t.hero.reserver} ton="blanc" />
              <LienPasPret
                libelle={t.hero.pasPret}
                className="font-bold underline underline-offset-4 transition hover:text-white/80"
              />
            </div>
          </div>

          <div className="animate-hero delay-4">
            <LecteurVideo
              auto
              id={VIDEO_ACCUEIL.id}
              miniature={VIDEO_ACCUEIL.miniature}
              titre={t.hero.video.titre}
              lire={t.hero.video.lire}
              langue={t.htmlLang}
            />
          </div>
        </div>

        {/* Les quatre promesses restent, discrètes, sous le contenu : ce sont
            les mêmes mots-clés, dans le même ordre, que les onglets Résultats. */}
        <ul className="animate-hero delay-5 order-last mx-auto mt-8 flex max-w-2xl list-none flex-wrap items-center justify-center gap-x-2.5 gap-y-1 px-5 pb-4 text-xs text-white/70 lg:order-none lg:mt-0 lg:pb-12">
          {t.hero.promesses.map((promesse, i) => (
            <li key={promesse} className="flex items-center gap-2.5">
              {i > 0 && (
                <span aria-hidden="true" className="text-white/35">
                  ·
                </span>
              )}
              {promesse}
            </li>
          ))}
        </ul>

        {/* Zone basse : LinkedIn et YouTube à gauche */}
        <div className="mt-auto px-5 pt-10 md:px-8 lg:contents">
          <div className="animate-hero delay-5 flex gap-3 lg:absolute lg:bottom-10 lg:left-10 lg:z-20">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener"
              aria-label={t.nav.linkedin}
              className="grid size-12 place-items-center rounded-full bg-white text-brand shadow-md transition-colors hover:bg-ink hover:text-white"
            >
              <IconeLinkedIn className="size-5" />
            </a>
            <a
              href={YOUTUBE_ABONNEMENT_URL}
              target="_blank"
              rel="noopener"
              aria-label={t.nav.youtube}
              className="grid size-12 place-items-center rounded-full bg-white text-brand shadow-md transition-colors hover:bg-ink hover:text-white"
            >
              <IconeYoutube className="size-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
