import { test } from "node:test";
import assert from "node:assert/strict";
import { dixChiffres, telephoneNormalise } from "./telephone.ts";

test("le cellulaire s'écrit dans n'importe quel format et part dans un seul", () => {
  for (const brut of ["8195550100", "819 555-0100", "819.555.0100", "(819) 555-0100", "+1 819 555 0100", "1-819-555-0100"]) {
    assert.equal(dixChiffres(brut), "8195550100", brut);
    assert.equal(telephoneNormalise(brut), "(819) 555-0100", brut);
  }
});

test("un cellulaire qui n'a pas 10 chiffres est refusé", () => {
  for (const brut of ["", "819 555", "819 555-010", "819 555-01000", "abc"]) {
    assert.equal(dixChiffres(brut), null, brut);
    assert.equal(telephoneNormalise(brut), null, brut);
  }
});
