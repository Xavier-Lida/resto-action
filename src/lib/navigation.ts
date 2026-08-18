import {
  CLES,
  FONCTIONNALITES_EN,
  FONCTIONNALITES_FR,
} from "@/lib/contenu/fonctionnalites";
import type { Textes } from "@/lib/textes/fr";

/* LA COMPOSITION DE LA NAVIGATION, à un seul endroit.

   La barre du bureau et le menu mobile proposaient jusqu'ici deux listes
   écrites séparément — donc deux arborescences du même site, libres de
   diverger. Les deux lisent maintenant ceci.

   AUCUN CHEMIN N'EST RECOPIÉ. Les quatre fonctionnalités ont déjà leur `slug`
   et leur `filNom` dans contenu/fonctionnalites.ts ; les libellés de sections
   existent déjà dans `pied`. Ce module ne fait que les assembler. La seule
   chose qu'il ajoute, ce sont les titres des trois groupes.

   LES FENTES SONT MESURÉES, pas devinées : Helvetica en gras à 14 px (la police
   de la barre), somme des avances de glyphes, plus 28 px de respiration, plus
   20 px pour le chevron et son écart, arrondi au quart de rem. La méthode
   reproduit au dixième de pixel les largeurs relevées au navigateur pour les
   anciens libellés. Si un titre de groupe change, il faut remesurer. */

export type LienNav = { href: string; libelle: string };
export type GroupeNav = {
  cle: string;
  titre: string;
  fente: string;
  liens: LienNav[];
};

export function groupesNav(t: Textes): GroupeNav[] {
  /* Le dictionnaire de contenu suit la langue de la page. C'est ce qui fait
     que le panneau « Plateforme » mène à /plateforme/... en français et à
     /en/platform/... en anglais, sans qu'aucun chemin soit écrit deux fois. */
  const fonctionnalites =
    t.code === "fr" ? FONCTIONNALITES_FR : FONCTIONNALITES_EN;

  /* Les ancres sont préfixées par la racine ET par l'accueil : la barre vit
     aussi sur /contact, /plateforme et les articles, où un fragment seul ne
     mènerait nulle part. */
  const ancre = (nom: string) => `${t.racine}/#${nom}`;

  return [
    {
      cle: "plateforme",
      titre: t.nav.groupes.plateforme,
      fente: "w-[7.75rem]", // Plateforme 72,4 · Platform 56,8
      liens: [
        { href: t.nav.plateformeHref, libelle: t.nav.vueDensemble },
        ...CLES.map((cle) => ({
          href: fonctionnalites[cle].slug,
          libelle: fonctionnalites[cle].filNom,
        })),
      ],
    },
    {
      cle: "entreprise",
      titre: t.nav.groupes.entreprise,
      fente: "w-[7.5rem]", // Entreprise 69,2 · Company 63,8
      liens: [
        { href: ancre("approche"), libelle: t.pied.approche },
        { href: ancre("mission"), libelle: t.pied.mission },
        { href: ancre("histoire"), libelle: t.pied.histoire },
      ],
    },
    {
      cle: "ressources",
      titre: t.nav.groupes.ressources,
      fente: "w-[8rem]", // Ressources 79,4 · Resources 71,6
      liens: [
        { href: t.nav.blogueHref, libelle: t.pied.blogue },
        { href: ancre("faq"), libelle: t.nav.faq },
      ],
    },
  ];
}
