import { CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MenuDeroulant from "@/components/MenuDeroulant";
import MenuMobile from "@/components/MenuMobile";
import SelecteurLangue from "@/components/SelecteurLangue";
import { groupesNav } from "@/lib/navigation";
import type { Textes } from "@/lib/textes/fr";

/* La barre de navigation, la même sur toutes les pages.

   TROIS ZONES DANS UNE GRILLE, ET AUCUN POSITIONNEMENT ABSOLU. Une version
   précédente centrait le logo en absolu : il ne prenait donc pas de place, et
   les liens passaient dessous. Une grille garde les trois zones dans le flux :
   elles se poussent, elles ne peuvent pas se chevaucher.

   Les colonnes latérales sont en 1fr ET NON EN auto : avec `auto`, la colonne
   du milieu se centrait entre le logo et les actions, qui n'ont pas la même
   largeur. Deux colonnes égales centrent le menu sur la BARRE.

   ELLE PORTAIT SIX LIENS À PLAT, ELLE EN PORTE TROIS GROUPES. Les six étaient
   arrivés un par un, au fil des pages ajoutées, et occupaient 524 px — d'où
   une échelle de paliers (`md:block`, `lg:block`, `xl:block`) qui les faisait
   disparaître un à un quand la place manquait. Les trois groupes en occupent
   380 px : ils tiennent tous dès `md`, et CETTE ÉCHELLE A DISPARU. Elle
   n'existait que pour absorber un trop-plein qui n'existe plus.

   Les largeurs de fente restent fixes et mesurées (voir src/lib/navigation.ts) :
   sans elles, « Plateforme » plus long que « Platform » ferait glisser toute la
   barre au changement de langue. */
export default function BarreNav({ t }: { t: Textes }) {
  const groupes = groupesNav(t);
  const accueil = t.racine || "/";

  return (
    <header className="sticky top-0 z-50 rounded-b-[1.75rem] border-b border-bone bg-white lg:rounded-b-[2.25rem]">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-5 py-3 md:gap-4">
        <Link href={accueil} className="col-start-1 shrink-0">
          <Image
            draggable={false}
            src="/logo-marque.png"
            alt={t.nav.logoAlt}
            width={1012}
            height={128}
            priority
            /* `object-contain` EST UN GARDE-FOU, PAS UNE DÉCORATION. La règle
               `img { max-width: 100% }` de Tailwind autorise le navigateur à
               comprimer l'image quand sa piste est trop étroite — avec une
               hauteur fixe, ça DÉFORME le mot-marque au lieu de le réduire.
               C'est ce qui arrivait au téléphone : 253 px de logo dans 110 px
               de piste. `contain` le fait rapetisser proprement si la place
               vient encore à manquer sous 360 px. */
            className="h-7 w-auto object-contain md:h-9"
          />
        </Link>

        {/* Les trois groupes, centrés dans la colonne du milieu. */}
        <nav
          aria-label={t.nav.aria}
          className="col-start-2 hidden items-center justify-center gap-1 text-sm font-bold md:flex"
        >
          {groupes.map((groupe) => (
            <MenuDeroulant key={groupe.cle} groupe={groupe} />
          ))}
        </nav>

        <div className="col-start-3 flex items-center justify-end gap-2 md:gap-4">
          {/* Le sélecteur en texte, pas en pilule : à côté d'un vrai bouton,
              sa pilule bordée en imitait un second et l'œil hésitait entre les
              deux. Un réglage n'est pas une action. */}
          <span className="hidden md:block">
            <SelecteurLangue t={t} ton="barre" />
          </span>
          {/* Il mène à /contact, pas à `tel:` — d'où l'absence d'icône
              téléphone, qui promettrait un appel alors que la page offre aussi
              l'agenda. `min-w` calé sur « Nous contacter », plus long que
              « Contact us » : sans lui, la colonne de droite rétrécirait en
              anglais et toute la barre glisserait.

              En coins doux plutôt qu'en pilule : à cette taille, une pilule se
              lit comme une étiquette, un rectangle arrondi se lit comme un
              bouton. Le bouton du héro avait déjà fait ce chemin. */}
          <Link
            href={`${t.racine}/contact`}
            className="hidden min-w-[9.5rem] shrink-0 items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-black text-white transition-colors hover:bg-ink md:inline-flex"
          >
            {t.nav.contacter}
          </Link>

          {/* LE MÊME BOUTON, RÉDUIT À SON ICÔNE, AU TÉLÉPHONE.

              En toutes lettres il réclamait 152 px. Avec les 253 px du logo,
              les 40 px du menu et les gouttières, la barre demandait 493 px
              pour 350 disponibles sur un écran de 390 : elle débordait, et
              c'est le logo qui payait en se faisant écraser.

              Le supprimer était tentant — le héro juste dessous porte le même
              bouton en grand, et le menu en contient un pleine largeur. Mais la
              barre est COLLANTE : elle suit tout le défilement, et c'est
              justement plus bas, une fois le héro passé, que l'appel à
              l'action n'existe plus nulle part ailleurs. L'icône garde cette
              porte ouverte pour 40 px au lieu de 152.

              L'icône est un agenda et non un téléphone : le lien mène à
              /contact, qui offre les deux, et une icône de combiné promettrait
              un appel immédiat.

              LE LIBELLÉ EST UN VRAI TEXTE, pas un `aria-label`. Les deux
              disent la même chose aux lecteurs d'écran, mais un aria-label ne
              met rien dans le textContent : un robot qui relève les ancres
              voit alors deux liens vers /contact dans l'en-tête, dont un
              vide. `sr-only` le sort de l'écran sans le sortir du document,
              donc l'ancre a son texte et le bouton reste une icône. */}
          <Link
            href={`${t.racine}/contact`}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white transition-colors hover:bg-ink md:hidden"
          >
            <CalendarDays className="size-5" />
            <span className="sr-only">{t.nav.contacter}</span>
          </Link>
          <MenuMobile t={t} />
        </div>
      </div>
    </header>
  );
}
