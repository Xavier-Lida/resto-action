import { test } from "node:test";
import assert from "node:assert/strict";
import { borner60, calculer60, CALCUL_60_DEPART } from "./calcul60.ts";

test("50 commandes, 30 $, 25 % : 375 $ par semaine, environ 19 500 $ par année", () => {
  const r = calculer60({ commandes: 50, panier: 30, taux: 0.25 });
  assert.equal(r.parSemaine, 375);
  assert.equal(r.parAnnee, 19500);
});

test("les chiffres de départ sont 50 commandes, 30 $ et 25 %", () => {
  assert.deepEqual(CALCUL_60_DEPART, { commandes: 50, panier: 30, taux: 0.25 });
});

test("à 20 % et à 30 %", () => {
  assert.deepEqual(calculer60({ commandes: 50, panier: 30, taux: 0.2 }), { parSemaine: 300, parAnnee: 15600 });
  assert.deepEqual(calculer60({ commandes: 50, panier: 30, taux: 0.3 }), { parSemaine: 450, parAnnee: 23400 });
});

test("l'année est arrondie à la centaine", () => {
  // 55 × 27 $ × 30 % = 445,50 $ par semaine; × 52 = 23 166 $ → 23 200 $
  const r = calculer60({ commandes: 55, panier: 27, taux: 0.3 });
  assert.equal(r.parSemaine, 445.5);
  assert.equal(r.parAnnee, 23200);
});

test("les chiffres saisis sont ramenés dans les limites", () => {
  assert.deepEqual(borner60({ commandes: 2, panier: 0, taux: 0.5 }), { commandes: 5, panier: 1, taux: 0.25 });
  assert.deepEqual(borner60({ commandes: 999, panier: 9999, taux: 0.3 }), { commandes: 300, panier: 500, taux: 0.3 });
  assert.deepEqual(borner60({ commandes: 62, panier: 27.5, taux: 0.2 }), { commandes: 62, panier: 27.5, taux: 0.2 });
  assert.deepEqual(borner60({ commandes: NaN, panier: NaN, taux: NaN }), { commandes: 50, panier: 30, taux: 0.25 });
});
