import * as FR from "./grand-lancement";
import * as EN from "./grand-lancement.en";

/* LE CONTENU DU GRAND LANCEMENT, DANS LA BONNE LANGUE.

   grand-lancement.ts (français) et grand-lancement.en.ts (anglais) exportent
   les mêmes noms avec les mêmes formes. Les composants de l'accueil reçoivent
   `langue` et lisent tout par contenuLancement(langue). Les chiffres viennent
   toujours du fichier français, réexportés par l'anglais. */
export type Langue = "fr" | "en";
export type ContenuLancement = typeof FR;

export function contenuLancement(langue: Langue = "fr"): ContenuLancement {
  return langue === "en" ? (EN as unknown as ContenuLancement) : FR;
}
