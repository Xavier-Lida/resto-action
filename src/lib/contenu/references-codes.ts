/* LES CODES DU PROGRAMME « RÉFÈRE UN RESTO », REMPLIS À LA MAIN.

   Mode pilote : pas de base de données dans le site. Pour donner un lien à un
   resto client ou à un partenaire, on ajoute une ligne ici, on publie, et son
   lien marche : restoaction.ca/p/CODE (client) ou restoaction.ca/f/CODE
   (fournisseur ou professionnel).

   PLUS TARD, LE CRM DE XAVIER REMPLACE CE FICHIER, derrière la même fonction
   (`trouverReferent` dans src/lib/references/codes.ts). Rien d'autre ne change.

   LES RÈGLES D'UN CODE
   - 4 à 12 caractères, lettres A à Z et chiffres 2 à 9. Pas de 0 ni de 1 :
     comme ça, un O et un I sont toujours des lettres.
   - En majuscules ici. Le visiteur peut le taper en minuscules, ça marche.
   - Unique. Un code ne se réutilise jamais, même désactivé.
   - Pour couper un lien sans le supprimer : `actif: false`. Le lien envoie
     alors sur l'accueil, sans rien dire, comme un code inconnu.

   Une ligne, par exemple :
     { code: "CHEZTI", type: "client", nom: "Chez Ti-Jean", actif: true },
     { code: "FRITMAU", type: "fournisseur", nom: "Friteuses Mauricie", representant: "Luc Bergeron", formule: "commission", actif: true }, */

export type TypeReferent = "client" | "fournisseur" | "professionnel";
export type FormulePartenaire = "commission" | "echange" | "mixte";

export type CodeReference = {
  code: string;
  type: TypeReferent;
  /** Le nom affiché au resto référé : « {nom} t'a recommandé Resto Action ». */
  nom: string;
  /** Le représentant d'un fournisseur, s'il y en a un. */
  representant?: string;
  /** Fournisseur ou professionnel seulement, tel qu'écrit dans son entente. Jamais pour un client. */
  formule?: FormulePartenaire;
  actif: boolean;
};

/** Les vrais codes. Vide tant qu'aucun lien n'a été donné. */
export const CODES_REFERENCES: CodeReference[] = [];

/** Des codes pour essayer les liens en local et sur les aperçus Vercel.
    Ils ne marchent JAMAIS en production (voir trouverReferent). */
export const CODES_ESSAI: CodeReference[] = [
  { code: "ESSAI", type: "client", nom: "Resto d'essai", actif: true },
  { code: "ESSAIF", type: "fournisseur", nom: "Fournisseur d'essai", representant: "Représentant d'essai", formule: "commission", actif: true },
];
