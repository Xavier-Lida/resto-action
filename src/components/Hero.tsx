import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Phone } from "lucide-react";
import IconeYoutube from "@/components/IconeYoutube";
import TitreTournant from "@/components/TitreTournant";
import { LINKEDIN_URL, PHONE_HREF, YOUTUBE_ABONNEMENT_URL } from "@/lib/site";
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
        <Link
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
        </Link>

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

        {/* LA PAIRE DE CTA — variante « Bloc encré ».

            Elle corrige trois défauts mesurés sur l'état précédent : les boutons
            étaient EMPILÉS alors qu'ils tiennent côte à côte, ils étaient trop
            LARGES pour ce qu'ils disent, et le secondaire — blanc translucide sur
            le rouge — était quasi invisible.

            L'ENCRE PLUTÔT QUE LE BLANC pour le primaire : sur ce rouge, le
            presque-noir contraste plus fort que le blanc, donc il s'affirme mieux
            comme l'action principale. La flèche reste blanche avec le texte : en
            rouge de marque elle attirait l'œil avant le libellé qu'elle suit.

            L'OMBRE EST SANS FLOU, donc elle se lit comme une épaisseur sous le
            bouton plutôt que comme une lueur. C'est elle qui porte l'interaction :
            au survol le bouton se lève de 2 px et l'épaisseur passe à 6, au clic
            il descend exactement de la hauteur de son ombre et vient s'asseoir
            dessus. Dans les deux cas l'arête basse ne bouge pas — c'est ça qui
            rend l'enfoncement crédible plutôt que flottant.

            L'ORDRE A CHANGÉ : l'appel repasse devant. Il était second du temps où
            le bouton des produits menait le regard vers le bas de la page ; la
            bosse à flèche, juste dessous, dit déjà « plus bas ». */}
        <div className="my-auto flex flex-col items-center justify-center gap-4 px-5 py-6 sm:flex-row">
          <Link
            href={`${t.racine}/contact`}
            className="animate-hero delay-2 group inline-flex items-center gap-3 rounded-xl bg-ink px-8 py-4 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--ombre-cta)] active:translate-y-1 active:shadow-none"
          >
            {t.nav.contacter}
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href={`${t.racine}/#produits`}
            className="animate-hero delay-3 inline-flex items-center rounded-xl bg-white px-8 py-4 text-lg font-black text-ink shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 hover:bg-bone hover:shadow-[0_6px_0_0_var(--ombre-cta)] active:translate-y-1 active:shadow-none"
          >
            {t.nav.produits}
          </Link>
        </div>

        {/* CE QU'ON VEND — DISCRÈTEMENT, SOUS L'ACTION.

            Ces quatre promesses étaient entre le titre et le bouton, en gras
            et en 16 px : mesurées, elles réclamaient 765 px pour 672 px
            disponibles, donc elles retombaient sur deux lignes et formaient un
            second bloc de texte qui coupait le titre de son bouton.

            Sous le bouton, en 12 px et sans gras, elles tiennent sur un seul
            rang dans les deux langues (536 px mesurés) et redeviennent ce
            qu'elles doivent être : une précision qu'on lit après avoir compris
            le titre, pas un obstacle entre les deux.

            Elles restent une VRAIE liste — pour un robot comme pour un lecteur
            d'écran, c'est l'énumération de ce qui est vendu. Discret à l'œil ne
            veut pas dire absent du document.

            Les séparateurs sont des `span` décoratifs à l'intérieur des `li`
            plutôt que des bordures CSS : une bordure gauche réapparaîtrait en
            début de ligne si la liste se replie sur deux rangs au téléphone. */}
        {/* ELLE PASSE SOUS LA CARTE DE GUILLAUME AU TÉLÉPHONE, ET SEULEMENT LÀ.

            En pile, ces quatre promesses se glissaient entre le bouton et la
            carte : trois blocs qui se suivent, dont celui du milieu n'est ni
            une action ni une signature. Renvoyées en fin de carte, elles
            redeviennent ce qu'elles sont — une précision qu'on lit en dernier.

            À partir de `lg`, rien ne change : la carte de Guillaume et le
            LinkedIn sont épinglés en absolu dans les coins, donc hors du flux.
            La liste y reste sous le bouton, là où elle a été mesurée.

            `order` plutôt qu'un déplacement dans le JSX : l'ordre du DOM reste
            celui de la lecture — titre, action, promesses, signature — pour un
            lecteur d'écran comme pour un robot. Seul l'œil voit l'échange. */}
        <ul className="animate-hero delay-4 order-last mx-auto mt-6 flex max-w-2xl list-none flex-wrap items-center justify-center gap-x-2.5 gap-y-1 px-5 pb-4 text-xs text-white/70 lg:order-none lg:-mt-2">
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

        {/* Zone basse : LinkedIn et YouTube à gauche, carte Guillaume à droite */}
        <div className="mt-auto grid grid-cols-[minmax(0,1fr)] items-end gap-6 px-5 pt-10 md:px-8 lg:contents">
          {/* Le PLACEMENT est porté par ce conteneur, plus par le lien : il y
              a maintenant deux pastilles, et c'est la paire qui se pose en bas
              à gauche. Chacune ne garde que son apparence. */}
          <div className="animate-hero delay-5 flex gap-3 justify-self-start lg:absolute lg:bottom-10 lg:left-10 lg:z-20">
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

          {/* Carte façon « Get a Free Consultation » : Guillaume détouré,
              aligné au bas de la carte, le buste dépasse du haut. */}
          <div className="animate-hero delay-6 relative rounded-3xl bg-white p-5 pr-32 text-ink lg:absolute lg:bottom-10 lg:right-10 lg:z-20 lg:w-[24rem]">
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
