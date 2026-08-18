import Image from "next/image";
import { ArrowDown, ArrowRight, Phone } from "lucide-react";
import TitreTournant from "@/components/TitreTournant";
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
      {/* La carte rouge arrondie posée sur la page blanche. La bosse basse à
          flèche se fond dans le blanc qui l'entoure ; la languette du logo,
          elle, est partie avec la nav. */}
      <div className="relative flex min-h-[84svh] flex-col rounded-[2rem] bg-hero pb-12 text-white lg:rounded-[3rem] lg:pb-0">
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

        {/* Le titre. Le mot-marque géant qui tenait cette place a cédé : il ne
            disait que la marque, alors que c'est le signal le plus fort de la
            page. La marque vit maintenant dans la barre de navigation, au-
            dessus de la carte. La bouée 3D qui suivait le titre est partie
            aussi — le
            composant Buoy sert encore ailleurs (contact, chargement de
            l'agenda), seule l'image du héro s'en va. */}
        {/* La nav occupait la première rangée de la carte ; elle est sortie
            au-dessus, le titre a donc besoin de son propre air en haut. */}
        <div className="mt-14 md:mt-16">
          <TitreTournant t={t} />
        </div>

        {/* Le vide au centre de la carte est comblé par la seule action qui
            compte. Blanc plein sur le rouge, en coins doux plutôt qu'en pilule :
            une pilule de cette taille se lit comme une étiquette, un rectangle
            arrondi se lit comme un bouton.

            L'ombre portée le décolle du rouge, et la flèche avance au survol :
            le mouvement dit où mène le clic mieux qu'un changement de couleur.

            `my-auto` le pose entre le titre et la zone basse sans figer de
            hauteur : quelle que soit la longueur de la variante du titre, il
            reste au milieu de ce qui reste. */}
        <div className="my-auto flex justify-center px-5 py-6">
          <a
            href={`${t.racine}/contact`}
            className="animate-hero delay-2 group inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-black text-ink shadow-xl shadow-ink/15 transition hover:-translate-y-0.5 hover:bg-ink hover:text-white hover:shadow-2xl hover:shadow-ink/25 active:translate-y-0 active:scale-95 md:px-10 md:py-5 md:text-xl"
          >
            {t.nav.contacter}
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </a>
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
