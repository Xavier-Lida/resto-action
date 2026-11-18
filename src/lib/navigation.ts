import { YOUTUBE_URL } from "@/lib/site";
import { colonnesProduit } from "@/lib/contenu/pieces";
import type { Textes } from "@/lib/textes/fr";

/* LA COMPOSITION DE LA NAVIGATION, à un seul endroit.

   La barre du bureau et le menu mobile proposaient jusqu'ici deux listes
   écrites séparément — donc deux arborescences du même site, libres de
   diverger. Les deux lisent maintenant ceci.

   AUCUN CHEMIN N'EST RECOPIÉ. Les quatre fonctionnalités ont déjà leur `slug`
   et leur `filNom` dans contenu/fonctionnalites.ts ; les libellés de sections
   existent déjà dans `pied`. Ce module ne fait que les assembler. La seule
   chose qu'il ajoute, ce sont les titres des trois groupes.

   LES FENTES SONT MESURÉES, pas devinées : Manrope en gras à 14 px (la police
   de la barre), somme des avances de glyphes, plus 28 px de respiration, plus
   20 px pour le chevron et son écart, arrondi AU QUART DE REM SUPÉRIEUR. La
   fente retenue est celle du plus long des deux libellés, français ou anglais.
   Si un titre de groupe change, ou si la police du site change, il faut
   remesurer.

   Les chiffres ci-dessous ont été relevés au navigateur après le passage
   d'Helvetica à Manrope. Manrope est un poil plus large — « Plateforme » gagne
   2,8 px — mais les trois fentes retombent sur les mêmes quarts de rem, donc
   aucune largeur n'a bougé. */

export type LienNav = { href: string; libelle: string };
export type GroupeNav = {
  cle: string;
  titre: string;
  fente: string;
  liens: LienNav[];
  /** Un grand panneau en colonnes (Plateforme) : les mêmes 4 groupes que le pied de page. */
  colonnes?: { titre: string; liens: { nom: string; href: string }[] }[];
};

export function groupesNav(t: Textes): GroupeNav[] {
  /* Les ancres sont préfixées par la racine ET par l'accueil : la barre vit
     aussi sur /contact, /plateforme et les articles, où un fragment seul ne
     mènerait nulle part. */
  const ancre = (nom: string) => `${t.racine}/#${nom}`;

  return [
    {
      cle: "plateforme",
      titre: t.nav.groupes.plateforme,
      fente: "w-[7.75rem]", // Plateforme 75,2 · Platform 58,8
      /* 18 nov. : toutes les pièces du Système, en 4 colonnes, comme dans le
         pied de page (une seule source : colonnesProduit). */
      liens: [{ href: t.nav.plateformeHref, libelle: t.nav.vueDensemble }],
      colonnes: colonnesProduit(t.code === "fr" ? "fr" : "en"),
    },
    {
      cle: "entreprise",
      titre: t.nav.groupes.entreprise,
      fente: "w-[7.5rem]", // Entreprise 70,8 · Company 64,6
      liens: [
        { href: ancre("approche"), libelle: t.pied.approche },
        { href: ancre("histoire"), libelle: t.pied.histoire },
        /* « Réfère un resto » : une seule entrée (18 nov.). « Partenaires », dans
           la barre, mène à la même page. */
        ...(t.code === "fr"
          ? [
              { href: "/refere-un-resto", libelle: "Réfère un resto" },
            ]
          : [
              { href: "/en/referrals", libelle: "Referral program" },
            ]),
        { href: `${t.racine}/contact`, libelle: t.nav.contacter },
      ],
    },
    {
      cle: "ressources",
      titre: t.nav.groupes.ressources,
      fente: "w-[8rem]", // Ressources 79,6 · Resources 72,0
      liens: [
        { href: t.nav.blogueHref, libelle: t.pied.blogue },
        { href: t.htmlLang.startsWith("fr") ? "/faq" : ancre("faq"), libelle: t.nav.faq },
        // La section YouTube n'existe plus sur l'accueil (18 nov.) : on mène à la chaîne.
        { href: YOUTUBE_URL, libelle: t.pied.youtube },
      ],
    },
  ];
}
