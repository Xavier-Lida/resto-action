import Image from "next/image";
import { ArrowDown, Phone } from "lucide-react";
import MenuMobile from "@/components/MenuMobile";
import TitreTournant from "@/components/TitreTournant";
import SelecteurLangue from "@/components/SelecteurLangue";
import { LINKEDIN_URL, PHONE_HREF } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

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

export default function Hero({ t }: { t: Textes }) {
  return (
    <section id="top" className="bg-white p-3 md:p-5 lg:p-6">
      {/* La carte rouge arrondie posée sur la page blanche. Les languettes
          blanches (logo, flèche) se fondent dans le blanc qui l'entoure. */}
      <div className="relative flex min-h-[92svh] flex-col rounded-[2rem] bg-hero pb-14 text-white lg:rounded-[3rem] lg:pb-0">
        {/* Languette haute : le logo. top-0 = appuyée sur le bord intérieur de
            la bordure blanche (continuité blanc sur blanc), le logo reste
            entier dans la languette. */}
        <div className="absolute left-0 top-0 z-30 rounded-br-[1.25rem] bg-white px-5 pb-3 pt-2.5 md:left-1/2 md:-translate-x-1/2 md:rounded-b-[1.5rem] md:px-8 xl:px-10">
          <Image
            draggable={false}
            src="/logo-marque.png"
            alt={t.nav.logoAlt}
            width={1012}
            height={128}
            loading="eager"
            className="h-8 w-auto md:h-6 lg:h-8 xl:h-10"
          />
        </div>

        {/* Languette basse : une bosse rouge qui sort de la carte vers le
            bas, la flèche blanche logée dedans */}
        <a
          href={`${t.racine}/#resultats`}
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
        </a>

        {/* Nav intégrée à la carte */}
        <nav
          aria-label={t.nav.aria}
          className="animate-hero flex items-center justify-between gap-2 px-4 pt-4 md:px-5 md:pt-5 lg:px-9"
        >
          <div className="hidden items-center gap-1 text-sm font-bold md:flex lg:gap-2 lg:text-base">
            <a
              href={`${t.racine}/#top`}
              className="rounded-full bg-white px-3 py-2 text-brand lg:px-4 lg:py-2.5 xl:px-6 xl:py-3"
            >
              {t.nav.accueil}
            </a>
            <a
              href={`${t.racine}/#approche`}
              className="rounded-full px-3 py-2 transition-colors hover:bg-white/15 lg:px-4 lg:py-2.5 xl:px-6 xl:py-3"
            >
              {t.nav.approche}
            </a>
            <a
              href={`${t.racine}/#mission`}
              className="hidden rounded-full px-3 py-2 transition-colors hover:bg-white/15 lg:block lg:px-4 lg:py-2.5 xl:px-6 xl:py-3"
            >
              {t.nav.mission}
            </a>
          </div>
          <div className="ml-auto flex items-center gap-1 text-sm font-bold lg:gap-2 lg:text-base">
            <a
              href={`${t.racine}/#histoire`}
              className="hidden rounded-full px-3 py-2 transition-colors hover:bg-white/15 lg:px-4 lg:py-2.5 xl:px-6 xl:py-3 md:block"
            >
              {t.nav.histoire}
            </a>
            <a
              href={`${t.racine}/#faq`}
              className="hidden rounded-full px-3 py-2 transition-colors hover:bg-white/15 lg:px-4 lg:py-2.5 xl:px-6 xl:py-3 md:block"
            >
              {t.nav.faq}
            </a>
            <a
              href={`${t.racine}/#contact`}
              className="hidden rounded-full border-2 border-white px-5 py-2 font-black transition-colors hover:bg-white hover:text-brand md:block lg:px-6 lg:py-2.5 xl:px-8 xl:py-3"
            >
              {t.nav.contact}
            </a>
            <span className="hidden md:block">
              <SelecteurLangue t={t} />
            </span>
            <MenuMobile t={t} />
          </div>
        </nav>

        {/* Le titre. Le mot-marque géant qui tenait cette place a cédé : il ne
            disait que la marque, alors que c'est le signal le plus fort de la
            page. La marque reste dans sa languette blanche, en haut de la
            carte. La bouée 3D qui suivait le titre est partie aussi — le
            composant Buoy sert encore ailleurs (contact, chargement de
            l'agenda), seule l'image du héro s'en va. */}
        <div className="mt-12 md:mt-10">
          <TitreTournant t={t} />
        </div>

        {/* Zone basse : LinkedIn à gauche, carte Guillaume à droite */}
        <div className="mt-auto grid grid-cols-[minmax(0,1fr)] items-end gap-6 px-5 pt-10 md:px-8 lg:contents">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener"
            aria-label={t.nav.linkedin}
            className="animate-hero delay-3 grid size-12 place-items-center justify-self-start rounded-full bg-white text-brand shadow-md transition-colors hover:bg-ink hover:text-white lg:absolute lg:bottom-10 lg:left-10 lg:z-20"
          >
            <IconeLinkedIn className="size-5" />
          </a>

          {/* Carte façon « Get a Free Consultation » : Guillaume détouré,
              aligné au bas de la carte, le buste dépasse du haut. */}
          <div className="animate-hero delay-4 relative rounded-3xl bg-white p-5 pr-32 text-ink lg:absolute lg:bottom-10 lg:right-10 lg:z-20 lg:w-[24rem]">
            <p className="text-sm font-black leading-snug">{t.hero.carteTitre}</p>
            <p className="mt-0.5 text-xs text-ink/70">{t.hero.carteSousTitre}</p>
            <a
              href={PHONE_HREF}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-black text-white transition-colors hover:bg-ink"
            >
              <Phone className="size-3.5" />
              {t.nav.appelle}
            </a>
            <Image
              draggable={false}
              src="/guillaume-detoure.webp"
              alt={t.hero.guillaumeAlt}
              width={500}
              height={780}
              unoptimized
              className="pointer-events-none absolute bottom-0 right-4 h-44 w-auto lg:right-9 lg:h-52"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
