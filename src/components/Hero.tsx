import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import IconeYoutube from "@/components/IconeYoutube";
import LecteurVideo from "@/components/LecteurVideo";
import TitreTournant from "@/components/TitreTournant";
import { LINKEDIN_URL, VIDEO_ACCUEIL, YOUTUBE_ABONNEMENT_URL } from "@/lib/site";
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
        <div className="mt-8 flex flex-col items-center justify-center gap-4 px-5 py-6 sm:flex-row">
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

        {/* LA VIDÉO, DANS LA CARTE, SOUS LES BOUTONS.

            Elle remplit le grand vide rouge qui séparait le titre du bas de la
            carte, et c'est elle qui explique le produit le plus vite. Même
            lecteur que la section YouTube : rien n'est demandé à Google tant
            que personne n'appuie sur lecture. Les boutons restent AU-DESSUS :
            l'action doit se voir avant la vidéo, pas après. */}
        <div className="animate-hero delay-4 mx-auto mt-2 w-full max-w-2xl px-5">
          <LecteurVideo
            id={VIDEO_ACCUEIL.id}
            miniature={VIDEO_ACCUEIL.miniature}
            titre={t.hero.video.titre}
            lire={t.hero.video.lire}
            langue={t.htmlLang}
          />
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
        {/* Au téléphone, les promesses passent en fin de carte (`order-last`) :
            l'ordre du DOM reste celui de la lecture, seul l'œil voit l'échange. */}
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

        {/* Zone basse : LinkedIn et YouTube à gauche */}
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

          {/* La carte « Parle à Guillaume » (photo détourée et bouton d'appel)
              a quitté le héro : la vidéo y prend la place, et le téléphone reste
              offert dans la section contact et la barre de navigation. */}
        </div>
      </div>
    </section>
  );
}
