import { COMMISSIONS } from "@/lib/contenu/blogue/commissions-livraison";
import { FICHE_GOOGLE } from "@/lib/contenu/blogue/fiche-google-business";
import { AVIS_GOOGLE } from "@/lib/contenu/blogue/avis-google";
import type { Article, PaireArticle } from "@/lib/contenu/blogue/types";

/* LE REGISTRE DES ARTICLES.

   L'ordre de ce tableau est l'ordre d'affichage de l'index : le plus récent en
   premier. Il n'est pas trié par date à l'exécution — un tri sur des dates
   identiques donne un ordre arbitraire, et trois articles publiés le même jour,
   c'est exactement le cas au lancement.

   Un article ajouté ici apparaît à l'index, dans le plan du site et dans ses
   balises hreflang, sans autre geste. */
export const ARTICLES: PaireArticle[] = [COMMISSIONS, FICHE_GOOGLE, AVIS_GOOGLE];

export const articlesFr = (): Article[] => ARTICLES.map((a) => a.fr);
export const articlesEn = (): Article[] => ARTICLES.map((a) => a.en);

export const segment = (slug: string) => slug.split("/").pop() as string;

export const parSegment = (articles: Article[]) =>
  new Map(articles.map((a) => [segment(a.slug), a] as const));

/* Le temps de lecture, CALCULÉ à partir du texte réel.

   Écrit à la main, il devient faux à la première correction et personne ne s'en
   aperçoit. 200 mots la minute est une moyenne de lecture posée ; on arrondit
   vers le haut, et jamais en dessous d'une minute. */
export function minutesDeLecture(article: Article): number {
  const texte = article.blocs
    .map((b) => {
      switch (b.t) {
        case "ul":
        case "ol":
          return b.items.join(" ");
        case "tableau":
          return [...b.entetes, ...b.lignes.flat()].join(" ");
        case "encadre":
          return `${b.titre} ${b.texte}`;
        case "citation":
          return `${b.texte} ${b.source ?? ""}`;
        default:
          return b.texte;
      }
    })
    .join(" ");
  const mots = texte.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(mots / 200));
}

/* Les textes de la page d'index, dans les deux langues. */
export const INDEX_FR = {
  slug: "/blogue",
  metaTitre: "Le blogue",
  metaDescription:
    "Ce qui gruge les restos indépendants du Québec, expliqué sans jargon : commissions de livraison, fiche Google Business, avis clients.",
  filNom: "Blogue",
  surTitre: "Ce qu'on voit passer",
  titre: "Le blogue",
  intro:
    "Les questions que les restaurateurs nous posent au téléphone, répondues au long. Pas de recette miracle, pas de jargon d'agence.",
  parAuteur: "Par {auteur}",
  lecture: "{n} min de lecture",
  lire: "Lire l'article",
  retour: "Tous les articles",
};

export type IndexBlogue = typeof INDEX_FR;

export const INDEX_EN: IndexBlogue = {
  slug: "/en/blog",
  metaTitre: "The blog",
  metaDescription:
    "What's eating Quebec's independent restaurants, explained without the jargon: delivery commissions, Google Business Profile, customer reviews.",
  filNom: "Blog",
  surTitre: "What we keep seeing",
  titre: "The blog",
  intro:
    "The questions restaurant owners ask us on the phone, answered at length. No miracle recipes, no agency jargon.",
  parAuteur: "By {auteur}",
  lecture: "{n} min read",
  lire: "Read the article",
  retour: "All articles",
};
