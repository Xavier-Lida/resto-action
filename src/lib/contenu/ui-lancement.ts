import type { Langue } from "./lancement";

/* LES PETITS TEXTES ÉCRITS DANS LES COMPOSANTS DE L'ACCUEIL, dans les deux
   langues. Le gros du contenu vit dans grand-lancement.ts et .en.ts. */
const FR = {
  urgence: (n: number, date: string) => `${n} restos par mois, pas plus · Inscriptions jusqu'au ${date}`,
  accrocheCoupure: " va ",
  exemple: "exemple",
  prochaineCohorte: (d: string) => `Prochaine cohorte : ${d}`,
};

export type TextesUi = typeof FR;

const EN: TextesUi = {
  urgence: (n, date) => `${n} restaurants a month, no more · Sign up by ${date}`,
  accrocheCoupure: " is going to ",
  exemple: "example",
  prochaineCohorte: (d) => `Next cohort: ${d}`,
};

export function ui(langue: Langue = "fr"): TextesUi {
  return langue === "en" ? EN : FR;
}
