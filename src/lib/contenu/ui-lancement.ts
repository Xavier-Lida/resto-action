import type { Langue } from "./lancement";

/* LES PETITS TEXTES ÉCRITS DANS LES COMPOSANTS DE L'ACCUEIL, dans les deux
   langues. Le gros du contenu vit dans grand-lancement.ts et .en.ts. */
/* La date limite, sans le jour de la semaine ni l'année :
   « vendredi 18 décembre 2026 » → « 18 décembre » ; « Friday, December 18, 2026 » → « December 18 ». */
const sansJourNiAnnee = (d: string) => d.replace(/^[^\d,]+,?\s+(?=\S)/, "").replace(/,?\s+\d{4}$/, "");
/* Encore plus court, pour la barre au cellulaire : « 18 déc. » / « Dec 18 ». */
const abrege = (d: string) =>
  sansJourNiAnnee(d)
    .replace(/\b(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\b/, (m) =>
      ({ janvier: "janv.", février: "févr.", mars: "mars", avril: "avr.", mai: "mai", juin: "juin", juillet: "juill.", août: "août", septembre: "sept.", octobre: "oct.", novembre: "nov.", décembre: "déc." })[m] ?? m,
    )
    .replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/, (m) => m.slice(0, 3));

/* 13 nov. : court et concret (« 16 places par mois, pas plus. Fin le 18 décembre »). */
const FR = {
  urgence: (n: number, date: string) => `${n} places par mois, pas plus · Fin le ${sansJourNiAnnee(date)}`,
  accrocheCoupure: " va ",
  exemple: "exemple",
  prochaineCohorte: (d: string) => `Prochaine cohorte : ${d}`,
  urgenceCourte: (n: number, date: string) => `${n} places par mois · Fin le ${abrege(date)}`,
};

export type TextesUi = typeof FR;

const EN: TextesUi = {
  urgence: (n, date) => `${n} spots a month, no more · Ends ${sansJourNiAnnee(date)}`,
  accrocheCoupure: " is going to ",
  exemple: "example",
  prochaineCohorte: (d) => `Next cohort: ${d}`,
  urgenceCourte: (n, date) => `${n} spots a month · Ends ${abrege(date)}`,
};

export function ui(langue: Langue = "fr"): TextesUi {
  return langue === "en" ? EN : FR;
}
