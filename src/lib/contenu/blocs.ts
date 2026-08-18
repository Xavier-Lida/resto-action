/* Le modèle de contenu des textes longs — pages de plateforme et articles.

   POURQUOI PAS MDX. C'est le format naturel pour de la prose, et il a été
   écarté pour une raison précise : il casse le seul garde-fou qui tienne ce
   site bilingue. Aujourd'hui, `fr.ts` définit la forme et `en.ts` doit la
   satisfaire — une clé oubliée ne compile pas. Avec MDX, un article français
   et sa traduction seraient deux fichiers sans lien typé : traduire à moitié
   passerait la compilation et partirait en production. Ici, un article dont la
   version anglaise manque une section ne se construit pas.

   Le prix à payer : la prose s'écrit en TypeScript, entre guillemets. C'est
   moins agréable qu'un fichier Markdown, et c'est le seul inconvénient.

   LE BALISAGE EN LIGNE EST VOLONTAIREMENT MINUSCULE : `**gras**` et
   `[libellé](url)`, rien d'autre. Deux règles se lisent d'un coup d'œil et se
   parsent en dix lignes ; un mini-Markdown complet finirait par réclamer une
   librairie, et on serait revenu au point de départ. */

export type Bloc =
  | { t: "h2"; texte: string }
  | { t: "h3"; texte: string }
  | { t: "p"; texte: string }
  | { t: "ul"; items: string[] }
  /* La liste ORDONNÉE sert quand la suite compte (une marche à suivre). Elle
     est aussi ce que les moteurs reprennent le plus volontiers en extrait. */
  | { t: "ol"; items: string[] }
  | { t: "citation"; texte: string; source?: string }
  /* Le tableau comparatif que l'audit réclamait : c'est le format qui capte
     les extraits enrichis de type tableau, et le seul qui montre deux colonnes
     de chiffres côte à côte sans faire lire un paragraphe. */
  | { t: "tableau"; entetes: string[]; lignes: string[][] }
  /* L'encadré : une mise en garde ou un aparté, visuellement détaché du fil. */
  | { t: "encadre"; titre: string; texte: string };
