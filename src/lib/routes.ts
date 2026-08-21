import type { MetadataRoute } from "next";
import { CLES, FONCTIONNALITES_EN, FONCTIONNALITES_FR } from "@/lib/contenu/fonctionnalites";
import { PLATEFORME_EN, PLATEFORME_FR } from "@/lib/contenu/plateforme";
import { ARTICLES, INDEX_EN, INDEX_FR } from "@/lib/contenu/blogue";

/* LE REGISTRE DES PAGES BILINGUES — source unique des chemins du site.

   Il remplace src/lib/textes/alternances.ts, qui tenait les paires FR/EN pour
   les balises hreflang pendant que src/app/sitemap.ts tenait la MÊME liste une
   deuxième fois pour le plan du site. Deux listes des mêmes chemins, tenues à
   la main : ajouter une page voulait dire penser aux deux, et en oublier une
   ne casse rien de visible — le sitemap annonce simplement une page de moins,
   ou une paire hreflang boiteuse, pendant des mois.

   Une paire ajoutée ici apparaît désormais dans le plan du site ET porte ses
   liens de langue, sans autre geste.

   POURQUOI DES PAIRES ET NON DES PAGES. Chaque page existe deux fois, et les
   deux versions doivent s'annoncer mutuellement : c'est la paire qui est
   l'unité réelle, pas la page. Les deux entrées du sitemap sont dérivées. */

export type Paire = {
  fr: string;
  en: string;
  frequence: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  /* La priorité est RELATIVE au site : elle ne dit pas à Google que la page
     est importante dans l'absolu, seulement laquelle compte le plus ici. Les
     deux langues partagent la leur — l'ancien sitemap donnait 0,1 de moins à
     l'anglais, ce qui revenait à déclarer la version anglaise secondaire alors
     qu'elle vise un autre public, pas un public moindre. */
  priorite: number;
  /* La date du dernier remaniement RÉEL du contenu, en ISO. Optionnelle : une
     page sans date propre retombe sur MISE_A_JOUR (src/lib/site.ts).

     ELLE MANQUAIT, ET LE PLAN DU SITE METTAIT LA DATE DU BUILD. Un `new Date()`
     évalué au déploiement donnait le même horodatage aux 24 URL, et il bougeait
     à chaque correction de CSS : le plan annonçait que tout le site avait changé
     alors que pas un mot n'avait bougé. Un moteur à qui on ment de la sorte
     apprend à ne plus lire la balise du tout — et le jour où un article change
     pour vrai, plus personne n'écoute. site.ts le disait déjà de sa propre
     MISE_A_JOUR : « une date de build mentirait ».

     UNE SEULE DATE POUR LES DEUX LANGUES, comme la priorité juste au-dessus.
     Les deux versions d'un article sont traduites ensemble — PaireArticle rend
     même impossible d'en publier une sans l'autre — donc les dater séparément
     inventerait une différence qui n'existe pas. */
  modifieLe?: string;
};

export const ACCUEIL: Paire = {
  /* « / » et non « » : ces chemins servent AUSSI de href aux balises hreflang,
     où une chaîne vide n'est pas une URL relative mais rien du tout — Next ne
     peut pas la résoudre et le prérendu échoue. C'est le plan du site qui
     normalise pour composer ses URL absolues, pas le registre qui se déforme
     pour lui. */
  fr: "/",
  en: "/en",
  frequence: "monthly",
  priorite: 1,
};

/* /contact vient juste après l'accueil : c'est là que mènent tous les boutons
   d'action du site, donc la page qu'on veut voir indexée en deuxième. */
export const CONTACT: Paire = {
  fr: "/contact",
  en: "/en/contact",
  frequence: "monthly",
  priorite: 0.8,
};

export const CONFIDENTIALITE: Paire = {
  fr: "/confidentialite",
  en: "/en/privacy",
  frequence: "yearly",
  priorite: 0.3,
};

export const PLATEFORME: Paire = {
  fr: PLATEFORME_FR.slug,
  en: PLATEFORME_EN.slug,
  frequence: "monthly",
  priorite: 0.9,
};

/* Les quatre pages de fonctionnalité, déduites du contenu plutôt que
   recopiées : leurs chemins sont déjà écrits une fois dans le module de
   contenu, et une deuxième liste ici serait une liste à désynchroniser. */
export const FONCTIONNALITES: Paire[] = CLES.map((cle) => ({
  fr: FONCTIONNALITES_FR[cle].slug,
  en: FONCTIONNALITES_EN[cle].slug,
  frequence: "monthly",
  priorite: 0.7,
}));

export const BLOGUE: Paire = {
  fr: INDEX_FR.slug,
  en: INDEX_EN.slug,
  frequence: "weekly",
  priorite: 0.6,
};

/* Un article ajouté au registre du blogue apparaît ici tout seul, avec ses
   deux langues appariées. C'est tout l'intérêt d'avoir gardé les deux versions
   dans un même objet : il n'existe pas d'article sans sa traduction, donc pas
   d'entrée de sitemap boiteuse. */
export const ARTICLES_PAIRES: Paire[] = ARTICLES.map(({ fr, en }) => ({
  fr: fr.slug,
  en: en.slug,
  frequence: "yearly",
  priorite: 0.5,
  /* Chaque article porte DÉJÀ sa date de modification (blogue/types.ts), celle
     que son BlogPosting déclare en dateModified. Le plan du site lit la même :
     deux dates pour une seule page, c'est une occasion qu'elles divergent. */
  modifieLe: fr.modifieLe,
}));

export const paireArticle = (cheminFr: string): Paire => {
  const paire = ARTICLES_PAIRES.find((p) => p.fr === cheminFr);
  if (!paire) throw new Error(`Article hors registre : ${cheminFr}`);
  return paire;
};

export const PAIRES: Paire[] = [
  ACCUEIL,
  PLATEFORME,
  ...FONCTIONNALITES,
  BLOGUE,
  ...ARTICLES_PAIRES,
  CONTACT,
  CONFIDENTIALITE,
];

/* La paire d'une fonctionnalité, pour ses balises hreflang. */
export const paireFonctionnalite = (cle: (typeof CLES)[number]): Paire => ({
  fr: FONCTIONNALITES_FR[cle].slug,
  en: FONCTIONNALITES_EN[cle].slug,
  frequence: "monthly",
  priorite: 0.7,
});

/* LE CHEMIN ÉQUIVALENT DANS L'AUTRE LANGUE.

   Le sélecteur de langue renvoyait tout le monde à l'accueil. Il lisait un
   `href` figé dans les dictionnaires — « /en » côté français, « / » côté
   anglais — qui ne savait rien de la page courante : quelqu'un qui lisait un
   article et cliquait EN perdait sa lecture et se retrouvait sur la page
   d'accueil, à recommencer.

   L'INFORMATION EXISTAIT DÉJÀ ICI. `PAIRES` apparie toutes les pages du site,
   c'est elle qui alimente le plan du site et les balises hreflang. Il ne
   manquait qu'une table plate pour la consulter dans les deux sens — et c'est
   bien à ce registre-ci de la fournir, pas à une constante recopiée ailleurs
   qu'on oublierait de tenir à jour. */
const VERS_EN = new Map(PAIRES.map(({ fr, en }) => [fr, en]));
const VERS_FR = new Map(PAIRES.map(({ fr, en }) => [en, fr]));

export function equivalentLangue(chemin: string, cible: "fr" | "en"): string {
  // Une éventuelle barre finale, pour que « /contact/ » trouve sa paire.
  // La racine « / » est la seule qui garde la sienne.
  const normalise = chemin.length > 1 ? chemin.replace(/\/+$/, "") : chemin;
  const table = cible === "en" ? VERS_EN : VERS_FR;
  /* Repli sur l'accueil pour ce qui n'est pas au registre — la page 404, qui
     n'a pas de traduction. Toute VRAIE page y figure forcément, puisque c'est
     ce registre qui la déclare au plan du site : une page absente d'ici est
     déjà invisible pour Google, le sélecteur n'est pas le premier symptôme. */
  return table.get(normalise) ?? (cible === "en" ? ACCUEIL.en : ACCUEIL.fr);
}

/* Les liens hreflang d'une paire.

   x-default pointe sur le français : c'est la version d'origine, et c'est ce
   qu'on sert à un visiteur dont on ne connaît pas la langue.

   Les deux versions d'une page annoncent la MÊME table — c'est cet accord qui
   dit à Google qu'il s'agit d'une page en deux langues et non de deux pages
   concurrentes. Les écrire à la main de chaque côté, c'était se donner
   l'occasion de les désaccorder. */
export const hreflang = ({ fr, en }: Paire) => ({
  "fr-CA": fr,
  "en-CA": en,
  "x-default": fr,
});
