import Image from "next/image";
import { Phone } from "lucide-react";
import MenuMobile from "@/components/MenuMobile";
import SelecteurLangue from "@/components/SelecteurLangue";
import { PHONE_HREF } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

/* La barre de navigation, la même sur toutes les pages.

   Elle était AVANT dans la carte rouge du héro, avec le logo posé sur une
   plaque blanche parce que le mot « Resto » est noir. Cette plaque ne
   s'alignait sur rien : 24 px du bord d'une carte au coin arrondi de 48 px,
   donc son angle droit tombait au milieu de la courbe, avec un arrondi de
   24 px qui jurait avec celui de la carte. Sortir la barre de la carte règle
   tout ça d'un coup — sur le blanc de la page, le logo se pose tel quel.

   TROIS ZONES DANS UNE GRILLE, ET AUCUN POSITIONNEMENT ABSOLU. La version
   précédente centrait le logo en absolu : il ne prenait donc pas de place, et
   les liens passaient dessous — mesuré, il recouvrait « Histoire » de 1280 à
   800 px. Une grille garde les trois zones dans le flux : elles se poussent,
   elles ne peuvent pas se chevaucher. C'est structurel, pas un réglage.

   Les colonnes latérales sont en 1fr ET NON EN auto : avec `auto`, la colonne
   du milieu se centrait entre le logo et les actions, qui n'ont pas la même
   largeur — les liens tombaient 31 px à côté du centre en français, 52 px en
   anglais. Deux colonnes égales les centrent sur la BARRE. Le 1fr vaut
   minmax(auto, 1fr), donc une colonne trop pleine s'élargit quand même plutôt
   que de déborder.

   Et chaque zone dit SA colonne, au lieu de la prendre dans l'ordre : sous
   `md`, les liens passent en `display: none` et un élément caché sort de la
   grille — les actions remontaient alors dans la colonne du milieu, tassées
   contre le logo avec un vide à droite. `col-start-3` les tient à droite quel
   que soit ce qui disparaît à leur gauche. */
export default function BarreNav({ t }: { t: Textes }) {
  const lien = (ancre: string) => `${t.racine}/#${ancre}`;

  const liens: [string, string, string][] = [
    // [ancre, libellé, à partir de quelle largeur il apparaît]
    ["top", t.nav.accueil, "xl:block"],
    ["approche", t.nav.approche, "md:block"],
    ["mission", t.nav.mission, "lg:block"],
    ["histoire", t.nav.histoire, "md:block"],
    ["faq", t.nav.faq, "lg:block"],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-bone bg-white/90 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-3">
        <a href={lien("top")} className="col-start-1 shrink-0">
          <Image
            draggable={false}
            src="/logo-marque.png"
            alt={t.nav.logoAlt}
            width={1012}
            height={128}
            priority
            className="h-8 w-auto md:h-9"
          />
        </a>

        {/* Les liens, centrés dans la colonne du milieu. Ils sortent du plus
            secondaire au plus important quand la place manque. */}
        <nav
          aria-label={t.nav.aria}
          className="col-start-2 hidden items-center justify-center gap-5 text-sm font-bold md:flex lg:gap-7"
        >
          {liens.map(([ancre, etiquette, palier]) => (
            <a
              key={ancre}
              href={lien(ancre)}
              className={`hidden whitespace-nowrap transition-colors hover:text-brand ${palier}`}
            >
              {etiquette}
            </a>
          ))}
        </nav>

        <div className="col-start-3 flex items-center justify-end gap-4">
          {/* Le sélecteur en texte, pas en pilule : à côté d'un vrai bouton,
              sa pilule bordée en imitait un second et l'œil hésitait entre les
              deux. Un réglage n'est pas une action. */}
          <span className="hidden md:block">
            <SelecteurLangue t={t} ton="barre" />
          </span>
          <a
            href={PHONE_HREF}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-black text-white transition-colors hover:bg-ink"
          >
            <Phone className="size-4" />
            <span className="hidden sm:inline">{t.nav.appelle}</span>
          </a>
          <MenuMobile t={t} />
        </div>
      </div>
    </header>
  );
}
