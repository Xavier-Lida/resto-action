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
