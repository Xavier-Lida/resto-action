import { CODES_ESSAI, CODES_REFERENCES, type CodeReference } from "@/lib/contenu/references-codes";

/* TROUVER À QUI APPARTIENT UN CODE.

   La seule porte d'entrée vers la liste des codes. Aujourd'hui elle lit
   src/lib/contenu/references-codes.ts ; quand le CRM sera prêt, elle lira la
   table `referrers` et rien d'autre dans le site ne changera.

   UN CODE INCONNU EST IGNORÉ EN SILENCE : pas d'erreur, pas de page « code
   invalide ». Le visiteur arrive sur l'accueil comme n'importe qui. On ne veut
   ni aider quelqu'un à deviner des codes, ni punir une faute de frappe. */

export const MOTIF_CODE = /^[A-Z2-9]{4,12}$/;

/** Le code tel que tapé, ramené à sa forme propre : majuscules, sans espace ni tiret. */
export function normaliserCode(brut: unknown): string | undefined {
  if (typeof brut !== "string") return undefined;
  const code = brut.trim().toUpperCase().replace(/[\s-]+/g, "");
  return MOTIF_CODE.test(code) ? code : undefined;
}

/* Les codes d'essai ne marchent qu'en local et sur les aperçus Vercel.
   VERCEL_ENV vaut « production » seulement sur restoaction.ca. */
function codesEnVigueur(): CodeReference[] {
  const production = process.env.VERCEL_ENV === "production";
  return production ? CODES_REFERENCES : [...CODES_REFERENCES, ...CODES_ESSAI];
}

/** Le référent actif qui porte ce code, ou `undefined`. */
export function trouverReferent(brut: unknown): CodeReference | undefined {
  const code = normaliserCode(brut);
  if (!code) return undefined;
  return codesEnVigueur().find((c) => c.code === code && c.actif);
}
