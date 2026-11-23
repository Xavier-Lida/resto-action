/**
 * Le Calcul 60 secondes : ce qu'un resto verse aux plateformes en commissions.
 * Fonctions pures, sans React. Testé dans calcul60.test.ts.
 *
 *   par semaine = commandes × commande moyenne × taux
 *   par année   = par semaine × 52, arrondi à la centaine
 *
 * C'est ce que le resto VERSE, pas ce qu'il sauverait : le chiffre exact sort
 * du relevé (src/lib/calcul.ts).
 */

export const COMMANDES_MIN = 5;
export const COMMANDES_MAX = 300;
export const COMMANDES_PAS = 5;
export const PANIER_MIN = 1;
export const PANIER_MAX = 500;

/** Les 3 taux offerts. Le deuxième est choisi au départ. */
export const TAUX_60 = [0.2, 0.25, 0.3] as const;
export type Taux60 = (typeof TAUX_60)[number];

export const CALCUL_60_DEPART = { commandes: 50, panier: 30, taux: 0.25 as Taux60 };

export type Entrees60 = {
  /** Commandes par semaine sur les plateformes. */
  commandes: number;
  /** Commande moyenne, en dollars. */
  panier: number;
  /** Taux de commission : 0,20, 0,25 ou 0,30. */
  taux: number;
};

export type Reponse60 = { parSemaine: number; parAnnee: number };

const borne = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Ramène des chiffres saisis dans les limites du calculateur. */
export function borner60(e: Entrees60): Entrees60 {
  const commandes = Number.isFinite(e.commandes) ? Math.round(e.commandes) : CALCUL_60_DEPART.commandes;
  const panier = Number.isFinite(e.panier) ? e.panier : CALCUL_60_DEPART.panier;
  const taux = (TAUX_60 as readonly number[]).includes(e.taux) ? e.taux : CALCUL_60_DEPART.taux;
  return {
    commandes: borne(commandes, COMMANDES_MIN, COMMANDES_MAX),
    panier: borne(Math.round(panier * 100) / 100, PANIER_MIN, PANIER_MAX),
    taux,
  };
}

export function calculer60(e: Entrees60): Reponse60 {
  // Au cent près, pour ne pas traîner les restes de virgule flottante.
  const parSemaine = Math.round(e.commandes * e.panier * e.taux * 100) / 100;
  const parAnnee = Math.round((parSemaine * 52) / 100) * 100;
  return { parSemaine, parAnnee };
}

// ───────────── La carte du chiffre : 5 ans, et la part des commandes ─────────────

/** « Au même rythme, ça fait … en 5 ans » : le chiffre par année (arrondi), 5 fois. */
export function sur5Ans(r: Reponse60): number {
  return r.parAnnee * 5;
}

/** « C'est 1 commande sur 4 qui part en commission » : `parts` sur `sur`. */
export const PART_COMMISSION: Record<Taux60, { parts: number; sur: number }> = {
  0.2: { parts: 1, sur: 5 },
  0.25: { parts: 1, sur: 4 },
  0.3: { parts: 3, sur: 10 },
};

export function partCommission(taux: number): { parts: number; sur: number } {
  return PART_COMMISSION[taux as Taux60] ?? PART_COMMISSION[CALCUL_60_DEPART.taux];
}

// ───────────── Le dossier : les 3 chiffres dans l'adresse, rien d'autre ─────────────

/* /calcul/dossier?c=50&m=30&t=25 : c = commandes par semaine, m = commande
   moyenne en dollars, t = taux en pour cent. Aucun nom, aucun cellulaire :
   l'adresse peut se transférer sans rien dire de la personne. */
export const CHEMIN_DOSSIER_60 = "/calcul/dossier";

export function lienDossier60(e: Entrees60): string {
  const b = borner60(e);
  return `${CHEMIN_DOSSIER_60}?c=${b.commandes}&m=${b.panier}&t=${Math.round(b.taux * 100)}`;
}

/** Les 3 chiffres lus dans l'adresse, ou null si l'un d'eux manque ou sort des limites. */
export function lireDossier60(p: { c?: unknown; m?: unknown; t?: unknown }): Entrees60 | null {
  const lire = (v: unknown) => (typeof v === "string" && /^\d{1,3}(\.\d{1,2})?$/.test(v) ? Number(v) : NaN);
  const commandes = lire(p.c);
  const panier = lire(p.m);
  const taux = lire(p.t) / 100;
  if (!Number.isInteger(commandes) || commandes < COMMANDES_MIN || commandes > COMMANDES_MAX) return null;
  if (!Number.isFinite(panier) || panier < PANIER_MIN || panier > PANIER_MAX) return null;
  if (!(TAUX_60 as readonly number[]).includes(taux)) return null;
  return { commandes, panier, taux };
}
