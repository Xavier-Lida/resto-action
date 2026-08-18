import Image from "next/image";
import MenuMobile from "@/components/MenuMobile";
import SelecteurLangue from "@/components/SelecteurLangue";
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
   que soit ce qui disparaît à leur gauche.

   LA BARRE NE BOUGE PAS D'UNE LANGUE À L'AUTRE. Chaque lien porte une largeur
   fixe, et le bouton d'action une largeur minimale — sinon « Home » plus court
   qu'« Accueil » et « Story » plus court qu'« Histoire » rétrécissent le bloc
   central, et tout se décale au changement de langue. */
export default function BarreNav({ t }: { t: Textes }) {
  const lien = (ancre: string) => `${t.racine}/#${ancre}`;

  /* Les largeurs de fente sont MESURÉES au navigateur : on rend les deux
     dictionnaires, on relève le `scrollWidth` de chaque lien, on garde le plus
     large des deux libellés DE CETTE PAIRE, et on ajoute 28 px de respiration
     avant d'arrondir au quart de rem. Les largeurs relevées sont en commentaire
     de chaque ligne. Une largeur unique pour tous les liens aurait donné une
     pilule « FAQ » aussi large qu'une pilule « Approche » — la stabilité ne
     vaut pas ça. Si un libellé change, il faut remesurer. */

  /* La barre est OPAQUE, plus translucide à flou : sur le rouge du héro, le
     voile à 90 % rosissait toute la bande. Son bas est arrondi comme la carte
     du héro, et c'est justement l'opacité qui rend l'arrondi lisible — au
     défilement, le contenu passe DERRIÈRE la barre et ressort dans les deux
     coins au lieu de transparaître partout. */
  const liens: [string, string, string, string][] = [
    // [ancre, libellé, palier d'apparition, largeur de fente]
    ["top", t.nav.accueil, "xl:block", "w-[5rem]"], // Accueil 49,8 · Home 38,9
    ["approche", t.nav.approche, "md:block", "w-[6rem]"], // Approche 65,3 · Approach 65,3
    ["mission", t.nav.mission, "lg:block", "w-[5.25rem]"], // Mission 52,1 · idem
    ["histoire", t.nav.histoire, "md:block", "w-[5.25rem]"], // Histoire 52,1 · Story 35,8
    ["faq", t.nav.faq, "lg:block", "w-[3.75rem]"], // FAQ 28,8 · idem
  ];

  return (
    <header className="sticky top-0 z-50 rounded-b-[1.75rem] border-b border-bone bg-white lg:rounded-b-[2.25rem]">
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
            secondaire au plus important quand la place manque.

            Des boutons fantômes : le fond apparaît au survol, le texte ne
            change pas de couleur. Le rouge de marque est réservé à l'action —
            l'étaler sur cinq liens de navigation le dévalue.

            Le `gap` est serré parce que le rembourrage des pilules fait déjà
            l'écart ; avec l'ancien gap-5, le bloc s'étalait deux fois. */}
        <nav
          aria-label={t.nav.aria}
          className="col-start-2 hidden items-center justify-center gap-1 text-sm font-bold md:flex"
        >
          {liens.map(([ancre, etiquette, palier, fente]) => (
            <a
              key={ancre}
              href={lien(ancre)}
              className={`hidden whitespace-nowrap rounded-full py-2 text-center transition-colors hover:bg-ink/[0.06] focus-visible:bg-ink/[0.06] ${fente} ${palier}`}
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
          {/* Il mène à /contact, pas à `tel:` — d'où l'absence d'icône
              téléphone, qui promettrait un appel alors que la page offre aussi
              l'agenda. `min-w` calé sur « Nous contacter », plus long que
              « Contact us » : sans lui, la colonne de droite rétrécirait en
              anglais et toute la barre glisserait. */}
          <a
            href={`${t.racine}/contact`}
            className="inline-flex min-w-[9.5rem] shrink-0 items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-black text-white transition-colors hover:bg-ink"
          >
            {t.nav.contacter}
          </a>
          <MenuMobile t={t} />
        </div>
      </div>
    </header>
  );
}
