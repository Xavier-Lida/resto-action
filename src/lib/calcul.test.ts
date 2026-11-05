import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculer,
  releveManuel,
  releveDepuisExtraction,
  encoderDossier,
  decoderDossier,
  HYPOTHESES_DEFAUT,
} from "./calcul.ts";

test("resto à 5 000 $ à 25 %, 30 $, tout en livraison : +629 $", () => {
  const releve = releveManuel({
    plateforme: "doordash",
    ventes: 5000,
    nbCommandes: 5000 / 30,
    partLivraison: 1,
    taux: 0.25,
  });
  const r = calculer(releve, {
    ...HYPOTHESES_DEFAUT,
    partApp: 0.6,
    prixAjustes: true,
    nouvellesCommandes: 40,
    aliments: 0.3,
  });
  assert.equal(Math.round(r.nouvelles), 580);
  assert.equal(Math.round(r.recupere), 99);
  assert.equal(Math.round(r.ajustes), 150);
  assert.equal(r.abonnement, 200);
  assert.equal(Math.round(r.total), 629);
  assert.equal(r.seuil, 14);
  assert.equal(r.economieNegative, false);
});

test("resto à 3 000 $ à 20 %, 30 $ : économie négative (−0,51 $ par livraison)", () => {
  const releve = releveManuel({
    plateforme: "skip",
    ventes: 3000,
    nbCommandes: 100,
    partLivraison: 1,
    taux: 0.2,
  });
  const r = calculer(releve);
  assert.equal(r.economieParCommande, -0.51);
  assert.equal(r.economieNegative, true);
  assert.ok(r.recupere < 0);
});

test("relevé illisible : pas de relevé, le formulaire manuel s'ouvre", () => {
  assert.equal(releveDepuisExtraction({ lisible: false }), null);
  assert.equal(releveDepuisExtraction(null), null);
  assert.equal(releveDepuisExtraction({ lisible: true, ventes: 0 }), null);
  const ok = releveDepuisExtraction({
    lisible: true,
    plateforme: "ubereats",
    periode_jours: 7,
    nb_livraison: 40,
    nb_cueillette: 10,
    ventes: 1500,
    commissions: 300,
    autres_frais: 20,
  });
  assert.ok(ok);
  assert.equal(ok.plateforme, "ubereats");
  assert.equal(ok.periodeJours, 7);
});

test("Uber Eats : la cueillette passe de 10 à 15 % quand les prix sont ajustés", () => {
  const releve = {
    plateforme: "ubereats" as const,
    periodeJours: 30,
    nbLivraison: 0,
    nbCueillette: 100,
    ventes: 3000,
    commissions: 300,
    autresFrais: 0,
  };
  const r = calculer(releve, { ...HYPOTHESES_DEFAUT, partApp: 0.5, prixAjustes: true });
  // Reste 1 500 $ : 1,10 × 1 500 × 0,85 − 1 500 × 0,90 = 1 402,50 − 1 350 = 52,50
  assert.equal(r.ajustes, 52.5);
});

test("le dossier s'encode et se décode dans l'adresse", () => {
  const d = {
    releve: releveManuel({ plateforme: "doordash", ventes: 5000, nbCommandes: 167, partLivraison: 1, taux: 0.25 }),
    hypotheses: HYPOTHESES_DEFAUT,
    prenom: "Élise",
    resto: "Chez Élise",
  };
  const s = encoderDossier(d);
  assert.deepEqual(decoderDossier(s), d);
  assert.equal(decoderDossier("n'importe quoi"), null);
});
