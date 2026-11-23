import { test } from "node:test";
import assert from "node:assert/strict";
import {
  boiteSure,
  cadrer,
  coutJetonsUsd,
  jourMontreal,
  lireDepense,
  nomDepense,
  ouiClair,
  rapportProche,
  type Verdict,
} from "./studio/cadrage.ts";

// ─── Le cadrage des 2 formats : jamais on ne coupe le plat ───

const rapport = (z: { largeur: number; hauteur: number }) => z.largeur / z.hauteur;
const contient = (z: { gauche: number; haut: number; largeur: number; hauteur: number }, x0: number, y0: number, x1: number, y1: number) =>
  z.gauche <= x0 + 1 && z.haut <= y0 + 1 && z.gauche + z.largeur >= x1 - 1 && z.haut + z.hauteur >= y1 - 1;

test("photo verticale, plat au centre : le carré se rogne autour du plat", () => {
  const c = cadrer(3000, 4000, { x: 0.2, y: 0.35, l: 0.6, h: 0.4 }, 1080, 1080);
  assert.equal(c.mode, "rogner");
  assert.ok(Math.abs(rapport(c.zone) - 1) < 0.01);
  assert.ok(contient(c.zone, 600, 1400, 2400, 3000));
});

test("photo verticale 3:4, plat au centre : le vertical 4:5 se rogne à peine", () => {
  const c = cadrer(3000, 4000, { x: 0.15, y: 0.25, l: 0.7, h: 0.5 }, 1080, 1350);
  assert.equal(c.mode, "rogner");
  assert.ok(Math.abs(rapport(c.zone) - 0.8) < 0.01);
  assert.equal(c.zone.largeur, 3000);
});

test("le plat est dans un coin : le cadre se colle au bord, sans sortir de l'image", () => {
  const c = cadrer(4000, 3000, { x: 0.0, y: 0.0, l: 0.5, h: 0.6 }, 1080, 1080);
  assert.equal(c.mode, "rogner");
  assert.equal(c.zone.gauche, 0);
  assert.equal(c.zone.haut, 0);
  assert.ok(c.zone.gauche + c.zone.largeur <= 4000 && c.zone.haut + c.zone.hauteur <= 3000);
});

test("photo large, plat qui prend toute la largeur : le carré est complété, pas coupé", () => {
  const boite = { x: 0.05, y: 0.2, l: 0.9, h: 0.6 };
  const c = cadrer(4000, 3000, boite, 1080, 1080);
  assert.equal(c.mode, "completer");
  // Tout le plat (sans la marge) est dans la zone gardée.
  assert.ok(contient(c.zone, 0.05 * 4000, 0.2 * 3000, 0.95 * 4000, 0.8 * 3000));
});

test("photo large, grand plat : le vertical est complété lui aussi", () => {
  const c = cadrer(4000, 3000, { x: 0.1, y: 0.1, l: 0.8, h: 0.8 }, 1080, 1350);
  assert.equal(c.mode, "completer");
  assert.ok(contient(c.zone, 400, 300, 3600, 2700));
});

test("la zone est toujours dans l'image, en pixels entiers", () => {
  for (const [l, h] of [[1200, 1600], [1600, 1200], [1000, 1000], [4032, 3024], [801, 1203]]) {
    for (const b of [{ x: 0.3, y: 0.3, l: 0.4, h: 0.4 }, { x: 0, y: 0, l: 1, h: 1 }, { x: 0.6, y: 0.1, l: 0.4, h: 0.3 }]) {
      for (const [cl, ch] of [[1080, 1080], [1080, 1350]]) {
        const { zone } = cadrer(l, h, b, cl, ch);
        assert.ok(Number.isInteger(zone.gauche) && Number.isInteger(zone.haut) && Number.isInteger(zone.largeur) && Number.isInteger(zone.hauteur));
        assert.ok(zone.gauche >= 0 && zone.haut >= 0 && zone.largeur >= 1 && zone.hauteur >= 1);
        assert.ok(zone.gauche + zone.largeur <= l && zone.haut + zone.hauteur <= h);
      }
    }
  }
});

test("sans boîte lisible, on prend le centre de l'image", () => {
  const centre = { x: 0.1, y: 0.1, l: 0.8, h: 0.8 };
  assert.deepEqual(boiteSure(null), centre);
  assert.deepEqual(boiteSure({ x: 0.5, y: 0.5, l: 0.9, h: 0.2 }), centre);
  assert.deepEqual(boiteSure({ x: Number.NaN, y: 0, l: 1, h: 1 }), centre);
  assert.deepEqual(boiteSure({ x: 0, y: 0, l: 0, h: 0 }), centre);
  const bonne = { x: 0.2, y: 0.2, l: 0.5, h: 0.5 };
  assert.equal(boiteSure(bonne), bonne);
});

test("le rapport demandé au moteur d'IA est celui de la photo", () => {
  assert.equal(rapportProche(3024, 4032), "3:4");
  assert.equal(rapportProche(4032, 3024), "4:3");
  assert.equal(rapportProche(1080, 1080), "1:1");
  assert.equal(rapportProche(1080, 1350), "4:5");
  assert.equal(rapportProche(1080, 1920), "9:16");
});

// ─── Le deuxième contrôle : seul un oui clair laisse passer ───

const oui: Verdict = {
  meme_plat: "oui",
  memes_aliments: true,
  memes_portions: true,
  meme_assiette: true,
  rien_ajoute: true,
  rien_enleve: true,
  differences: [],
};

test("un oui clair : « oui » et les 5 points vrais", () => {
  assert.equal(ouiClair(oui), true);
});

test("tout le reste fait refaire la retouche", () => {
  assert.equal(ouiClair(null), false);
  assert.equal(ouiClair(undefined), false);
  assert.equal(ouiClair({ ...oui, meme_plat: "incertain" }), false);
  assert.equal(ouiClair({ ...oui, meme_plat: "non" }), false);
  for (const point of ["memes_aliments", "memes_portions", "meme_assiette", "rien_ajoute", "rien_enleve"] as const) {
    assert.equal(ouiClair({ ...oui, [point]: false }), false, point);
  }
});

// ─── Le coût, le plafond, les limites ───

test("le coût d'un appel de vision, au prix par million de jetons", () => {
  assert.equal(coutJetonsUsd(1_000_000, 0, 5, 25), 5);
  assert.equal(coutJetonsUsd(0, 1_000_000, 5, 25), 25);
  assert.ok(Math.abs(coutJetonsUsd(6000, 800, 5, 25) - 0.05) < 1e-9);
});

test("une dépense s'écrit dans le nom du fichier et se relit pareille", () => {
  const id = "20261118-143012-a1b2c3d4e5";
  assert.equal(nomDepense(id, 0.1304), `${id}-130400`);
  assert.equal(lireDepense(nomDepense(id, 0.1304)), 0.1304);
  assert.equal(lireDepense(`studio/depenses/20261118/${id}-50400`), 0.0504);
  assert.equal(lireDepense("n'importe quoi"), 0);
  assert.equal(nomDepense(id, -1), `${id}-0`);
});

test("le jour se compte à Montréal, pas à Londres", () => {
  // 3 h UTC le 19 novembre : encore le 18 à Montréal (22 h).
  assert.equal(jourMontreal(new Date("2026-11-19T03:00:00Z")), "20261118");
  assert.equal(jourMontreal(new Date("2026-11-19T06:00:00Z")), "20261119");
});
