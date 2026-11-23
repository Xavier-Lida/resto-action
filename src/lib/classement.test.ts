import { test } from "node:test";
import assert from "node:assert/strict";
import { classer, contient, decouper, fusionner, memeVille, ordinal, rectangleAutour, trier } from "./classement.ts";
import { libelleType, typeVoisin, libelleTypes } from "./contenu/classement.ts";

const r = (id: string, avis: number, note: number | null = 4.5) => ({ id, nom: id.toUpperCase(), avis, note });

test("le tri : par nombre d'avis, du plus grand au plus petit", () => {
  assert.deepEqual(
    trier([r("a", 10), r("b", 300), r("c", 45)]).map((x) => x.id),
    ["b", "c", "a"],
  );
});

test("à égalité d'avis, la meilleure note passe devant", () => {
  assert.deepEqual(
    trier([r("a", 100, 4.1), r("b", 100, 4.8), r("c", 100, null)]).map((x) => x.id),
    ["b", "a", "c"],
  );
});

test("3e sur 5 : les 2 devant, du plus proche au plus loin, et l'écart", () => {
  const c = classer([r("a", 500), r("b", 320), r("moi", 250), r("d", 90), r("e", 12)], "moi");
  assert.ok(c);
  assert.equal(c.rang, 3);
  assert.equal(c.total, 5);
  assert.deepEqual(c.devant.map((x) => [x.id, x.rang]), [["b", 2], ["a", 1]]);
  // 320 − 250 = 70 pour l'égaler, 71 pour le passer.
  assert.equal(c.manque, 71);
  assert.equal(c.avance, null);
  assert.deepEqual(c.premiers.map((x) => x.id), ["a", "b", "moi"]);
});

test("2e : un seul resto devant", () => {
  const c = classer([r("a", 500), r("moi", 250), r("d", 90)], "moi");
  assert.ok(c);
  assert.equal(c.rang, 2);
  assert.deepEqual(c.devant.map((x) => x.id), ["a"]);
  assert.equal(c.manque, 251);
});

test("premier : personne devant, et l'avance sur le 2e", () => {
  const c = classer([r("moi", 900), r("b", 640), r("c", 12)], "moi");
  assert.ok(c);
  assert.equal(c.rang, 1);
  assert.deepEqual(c.devant, []);
  assert.equal(c.manque, null);
  assert.equal(c.avance, 260);
});

test("seul de son type : premier, sans 2e", () => {
  const c = classer([r("moi", 40)], "moi");
  assert.ok(c);
  assert.equal(c.rang, 1);
  assert.equal(c.total, 1);
  assert.equal(c.avance, null);
});

test("à égalité avec celui d'en avant, il manque 1 avis", () => {
  const c = classer([r("a", 100, 4.9), r("moi", 100, 4.2)], "moi");
  assert.ok(c);
  assert.equal(c.rang, 2);
  assert.equal(c.manque, 1);
});

test("un resto absent de la liste n'a pas de rang", () => {
  assert.equal(classer([r("a", 1)], "moi"), null);
});

test("fusion par identifiant de lieu : un resto vu dans 2 zones compte une fois", () => {
  const f = fusionner([[r("a", 10), r("b", 20)], [r("b", 20), r("c", 30)]]);
  assert.deepEqual(f.map((x) => x.id).sort(), ["a", "b", "c"]);
  const c = classer([...f, r("b", 20)], "a");
  assert.equal(c?.total, 3);
});

test("les ordinaux", () => {
  assert.equal(ordinal(1), "1er");
  assert.equal(ordinal(2), "2e");
  assert.equal(ordinal(14), "14e");
});

test("une ville coupée en 4 zones qui la couvrent au complet", () => {
  const ville = { bas: { lat: 46.2, lng: -72.8 }, haut: { lat: 46.5, lng: -72.4 } };
  const zones = decouper(ville);
  assert.equal(zones.length, 4);
  for (const p of [
    { lat: 46.21, lng: -72.79 },
    { lat: 46.49, lng: -72.41 },
    { lat: 46.21, lng: -72.41 },
    { lat: 46.49, lng: -72.79 },
    { lat: 46.35, lng: -72.6 },
  ]) {
    assert.ok(zones.some((z) => contient(z, p)), `${p.lat}, ${p.lng}`);
  }
});

test("le rectangle de secours contient le resto", () => {
  const p = { lat: 46.34, lng: -72.54 };
  assert.ok(contient(rectangleAutour(p), p));
});

test("la même ville, avec ou sans accents et traits d'union", () => {
  assert.ok(memeVille("Trois-Rivières", "trois rivieres"));
  assert.ok(!memeVille("Trois-Rivières", "Bécancour"));
  assert.ok(!memeVille("", ""));
});

test("la table des types : libellés au pluriel, « restos » pour un type inconnu", () => {
  assert.equal(libelleType("pizza_restaurant"), "pizzerias");
  assert.equal(libelleType("hamburger_restaurant"), "restos de burgers");
  assert.equal(libelleType("type_que_google_inventera"), "restos");
  assert.equal(libelleType("restaurant"), "restos");
});

test("le type voisin : le plus proche, et aucun pour « restaurant »", () => {
  assert.equal(typeVoisin("pizza_restaurant"), "italian_restaurant");
  assert.equal(typeVoisin("type_que_google_inventera"), "restaurant");
  assert.equal(typeVoisin("restaurant"), null);
});

test("un type élargi nomme les deux", () => {
  assert.equal(libelleTypes("pizza_restaurant", "italian_restaurant"), "pizzerias et restos italiens");
  assert.equal(libelleTypes("pizza_restaurant", null), "pizzerias");
});
