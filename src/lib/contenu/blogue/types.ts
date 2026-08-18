import type { Bloc } from "@/lib/contenu/blocs";
import type { CleFondateur } from "@/lib/site";

/* La forme d'un article, et rien d'autre — le type vit à part du registre pour
   qu'un fichier d'article n'ait pas à importer la liste de tous les autres.

   LES DEUX DATES SONT ISO ET SÉPARÉES. `publieLe` ne bouge jamais ; `modifieLe`
   avance quand le texte change pour vrai. Les deux partent dans le BlogPosting :
   un moteur qui voit un article modifié récemment le relit plus volontiers, et
   un article sans date de modification le laisse deviner.

   `auteur` est une CLÉ, pas un nom : elle pointe sur FONDATEURS (site.ts), d'où
   sortent le nom affiché et le `sameAs` LinkedIn. C'est ce sameAs, identique à
   celui déclaré en `founder` de l'entreprise, qui permet à un moteur de
   comprendre que l'auteur de l'article est le dirigeant de la boîte. */
export type Article = {
  slug: string;
  metaTitre: string;
  metaDescription: string;
  filNom: string;
  titre: string;
  // L'accroche affichée sur la carte de l'index, et la description du JSON-LD.
  extrait: string;
  publieLe: string;
  modifieLe: string;
  auteur: CleFondateur;
  // Le temps de lecture est CALCULÉ, jamais écrit : voir minutesDeLecture().
  blocs: Bloc[];
};

/* Une paire d'articles : le même texte dans les deux langues. Les garder
   ensemble est ce qui rend impossible de publier une version sans l'autre — le
   type l'exige, la compilation le vérifie. */
export type PaireArticle = { fr: Article; en: Article };
