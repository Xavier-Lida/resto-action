import { test } from "node:test";
import assert from "node:assert/strict";
import { borner60, calculer60, CALCUL_60_DEPART, lienDossier60, lireDossier60, partCommission, sur5Ans } from "./calcul60.ts";

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

test("sur 5 ans : 19 500 $ par année, 97 500 $ en 5 ans", () => {
  assert.equal(sur5Ans(calculer60({ commandes: 50, panier: 30, taux: 0.25 })), 97500);
});

test("la part des commandes : 1 sur 5, 1 sur 4, 3 sur 10", () => {
  assert.deepEqual(partCommission(0.2), { parts: 1, sur: 5 });
  assert.deepEqual(partCommission(0.25), { parts: 1, sur: 4 });
  assert.deepEqual(partCommission(0.3), { parts: 3, sur: 10 });
});

test("le lien du dossier ne porte que les 3 chiffres", () => {
  assert.equal(lienDossier60({ commandes: 50, panier: 30, taux: 0.25 }), "/calcul/dossier?c=50&m=30&t=25");
  assert.equal(lienDossier60({ commandes: 120, panier: 27.5, taux: 0.3 }), "/calcul/dossier?c=120&m=27.5&t=30");
});

test("le dossier se relit depuis l'adresse, et refuse ce qui sort des limites", () => {
  assert.deepEqual(lireDossier60({ c: "50", m: "30", t: "25" }), { commandes: 50, panier: 30, taux: 0.25 });
  assert.deepEqual(lireDossier60({ c: "120", m: "27.5", t: "30" }), { commandes: 120, panier: 27.5, taux: 0.3 });
  assert.equal(lireDossier60({ c: "50", m: "30" }), null);
  assert.equal(lireDossier60({ c: "50", m: "30", t: "40" }), null);
  assert.equal(lireDossier60({ c: "999", m: "30", t: "25" }), null);
  assert.equal(lireDossier60({ c: "50", m: "0", t: "25" }), null);
  assert.equal(lireDossier60({ c: "50<script>", m: "30", t: "25" }), null);
  assert.equal(lireDossier60({ c: ["50", "60"], m: "30", t: "25" }), null);
});
