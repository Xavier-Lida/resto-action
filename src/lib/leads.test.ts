import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SOURCES_LEAD,
  cellulaire10,
  cellulaireLisible,
  cleResto,
  couperNom,
  idValide,
  isoToronto,
  lienAppeler,
  lienTexter,
  rangeeDeLead,
  remplirTexto,
  sujetLead,
  type Lead,
} from "./leads/lead.ts";

test("le cellulaire part dans un seul format : 10 chiffres", () => {
  for (const tape of ["819 555-0100", "(819) 555-0100", "819.555.0100", "8195550100", "+1 819 555 0100", "1-819-555-0100"]) {
    assert.equal(cellulaire10(tape), "8195550100", tape);
  }
});

test("un numéro qui n'a pas 10 chiffres n'est pas inventé", () => {
  assert.equal(cellulaire10("555-0100"), null);
  assert.equal(cellulaire10("+33 6 12 34 56 78"), null);
  assert.equal(cellulaire10(""), null);
  assert.equal(cellulaire10(null), null);
});

test("le cellulaire lisible : 819 555-0100", () => {
  assert.equal(cellulaireLisible("8195550100"), "819 555-0100");
});

test("la clé du resto : le cellulaire, sinon l'identifiant Google, sinon le nom et la ville", () => {
  const base = { nom: "Chez Ti-Jean", ville: "Trois-Rivières" };
  assert.equal(cleResto({ ...base, cellulaire: "8195550100", googlePlaceId: "ChIJabcdefghij" }), "tel:8195550100");
  assert.equal(cleResto({ ...base, cellulaire: null, googlePlaceId: "ChIJabcdefghij" }), "google:ChIJabcdefghij");
  assert.equal(cleResto({ ...base, cellulaire: null, googlePlaceId: null }), "nom:chez ti jean|trois rivieres");
});

test("la même clé pour le même resto, peu importe les accents et les majuscules", () => {
  const a = cleResto({ nom: "Pizzéria du Coin", ville: "Montréal", cellulaire: null, googlePlaceId: null });
  const b = cleResto({ nom: "  pizzeria DU coin ", ville: "montreal", cellulaire: null, googlePlaceId: null });
  assert.equal(a, b);
});

test("l'heure est celle de Montréal, décalage compris (hiver et été)", () => {
  assert.equal(isoToronto(new Date("2026-11-18T19:32:07Z")), "2026-11-18T14:32:07-05:00");
  assert.equal(isoToronto(new Date("2026-07-01T03:05:09Z")), "2026-06-30T23:05:09-04:00");
  // Le même instant, relu : rien n'est perdu.
  assert.equal(new Date(isoToronto(new Date("2026-11-18T19:32:07Z"))).toISOString(), "2026-11-18T19:32:07.000Z");
});

test("l'identifiant du navigateur : un UUID, et rien d'autre", () => {
  assert.equal(idValide("6f0d3c2a-2b1e-4d1c-9d6a-0f3f1d7c9b21"), true);
  assert.equal(idValide("6F0D3C2A-2B1E-4D1C-9D6A-0F3F1D7C9B21"), true);
  assert.equal(idValide("pas-un-uuid"), false);
  assert.equal(idValide(""), false);
  assert.equal(idValide(undefined), false);
  assert.equal(idValide(42), false);
});

test("« Marie Tremblay » : prénom Marie, nom Tremblay", () => {
  assert.deepEqual(couperNom("Marie Tremblay"), { prenom: "Marie", nom: "Tremblay" });
  assert.deepEqual(couperNom("  Marie  "), { prenom: "Marie", nom: null });
  assert.deepEqual(couperNom("Jean-Guy De La Tour"), { prenom: "Jean-Guy", nom: "De La Tour" });
});

test("l'objet du courriel : le même préfixe pour toutes les sources", () => {
  for (const source of SOURCES_LEAD) {
    const sujet = sujetLead({ source, resto: { nom: "TEST", ville: "Trois-Rivières", google_place_id: null } });
    assert.equal(sujet, `[Lead] ${source} : TEST, Trois-Rivières`);
  }
  assert.equal(sujetLead({ source: "reservation", resto: { nom: "TEST", ville: null, google_place_id: null } }), "[Lead] reservation : TEST");
  assert.equal(
    sujetLead({ source: "reserve-ta-place", resto: { nom: "TEST", ville: "Shawinigan", google_place_id: null } }, "étape 1"),
    "[Lead] reserve-ta-place : TEST, Shawinigan (étape 1)",
  );
});

test("les 9 sources, et pas une de plus", () => {
  assert.deepEqual(
    [...SOURCES_LEAD].sort(),
    ["calcul-60", "classement", "contact", "dossier-releve", "manuel", "reference", "reservation", "reserve-ta-place", "studio"],
  );
});

const LEAD_TEST: Lead = {
  id: "6f0d3c2a-2b1e-4d1c-9d6a-0f3f1d7c9b21",
  version: 1,
  type: "lead",
  source: "calcul-60",
  horodatage: "2026-11-18T14:32:07-05:00",
  langue: "fr",
  contact: { prenom: "Marie", nom: "Tremblay", cellulaire: "8195550100", courriel: null },
  resto: { nom: "TEST", ville: "Trois-Rivières", google_place_id: "ChIJabcdefghij" },
  donnees: { par_annee: 31200 },
  consentement: { texte: "Le texte exact de la case.", coche: true, horodatage: "2026-11-18T14:32:07-05:00" },
  provenance: {
    page: "/calcul",
    page_arrivee: "/",
    site_origine: "facebook.com",
    utm: { source: "meta", medium: "paid", campaign: "hiver", content: null, term: null },
    video: null,
    reference: null,
  },
  cle_resto: "tel:8195550100",
};

test("le lead pour la base : la fiche à plat, le consentement et la provenance au journal", () => {
  const r = rangeeDeLead(LEAD_TEST, null);
  assert.equal(r.id, LEAD_TEST.id);
  assert.equal(r.type, "formulaire");
  assert.equal(r.source, "calcul-60");
  assert.equal(r.resto, "TEST");
  assert.equal(r.ville, "Trois-Rivières");
  assert.equal(r.google_place_id, "ChIJabcdefghij");
  assert.equal(r.prenom, "Marie");
  assert.equal(r.cellulaire, "8195550100");
  // Le texte exact de la case, si elle est cochée, et l'heure.
  assert.equal(r.consentement_texte, "Le texte exact de la case.");
  assert.equal(r.consentement_coche, true);
  assert.equal(r.consentement_le, "2026-11-18T14:32:07-05:00");
  assert.equal(r.page, "/calcul");
  assert.equal(r.site_origine, "facebook.com");
  assert.equal(r.utm.source, "meta");
  // Le nom de famille n'a pas de colonne sur la fiche : il est au journal.
  assert.equal(r.contact.nom, "Tremblay");
  assert.equal(r.reference, null);
});

test("le lead pour la base : sans case, pas de consentement inventé", () => {
  const r = rangeeDeLead({ ...LEAD_TEST, consentement: null }, null);
  assert.equal(r.consentement_texte, null);
  assert.equal(r.consentement_coche, null);
  assert.equal(r.consentement_le, null);
});

test("le lead pour la base : « Référé par » voyage avec le lead", () => {
  const temoin = { code: "ESSAI", type: "client" as const, nom: "Resto d'essai", representant: null, source: "lien" as const, premier_contact: "2026-11-01T15:00:00.000Z" };
  // Le témoin de 30 jours, tel quel, avec la date du premier clic.
  assert.deepEqual(rangeeDeLead({ ...LEAD_TEST, provenance: { ...LEAD_TEST.provenance, reference: temoin } }, { code: "ESSAI", nom: "Resto d'essai", type: "client" }).reference, temoin);
  // Le code tapé dans « Présente-nous ce resto » : pas de témoin, mais un référent.
  assert.deepEqual(rangeeDeLead(LEAD_TEST, { code: "ESSAIF", nom: "Fournisseur d'essai", type: "fournisseur" }).reference, { code: "ESSAIF", nom: "Fournisseur d'essai", type: "fournisseur" });
});

test("un lead ajouté à la main : un événement « ajout_manuel »", () => {
  assert.equal(rangeeDeLead({ ...LEAD_TEST, source: "manuel" }, null).type, "ajout_manuel");
});

test("Appeler et Texter : des liens que le cellulaire comprend", () => {
  assert.equal(lienAppeler("8195550100"), "tel:+18195550100");
  // « ?&body= » : iPhone et Android.
  assert.equal(lienTexter("8195550100", "Salut Marie, c'est noté!"), "sms:+18195550100?&body=Salut%20Marie%2C%20c'est%20not%C3%A9!");
  // Gabarit vide : un texto vide, au bon numéro.
  assert.equal(lienTexter("8195550100", ""), "sms:+18195550100");
});

test("le gabarit de texto : {prenom}, {resto} et {ville} sont remplis", () => {
  const lead = { contact: { prenom: "Marie", nom: null, cellulaire: "8195550100", courriel: null }, resto: { nom: "TEST", ville: "Shawinigan", google_place_id: null } };
  assert.equal(remplirTexto("Salut {prenom}, pour {resto} à {ville} : {prenom}?", lead), "Salut Marie, pour TEST à Shawinigan : Marie?");
  assert.equal(remplirTexto("", lead), "");
  // {lien} : le lien du dossier, quand le lead en a un.
  assert.equal(
    remplirTexto("Salut {prenom}, ton dossier : {lien}", lead, "https://www.restoaction.ca/calcul/dossier?c=50&m=30&t=25"),
    "Salut Marie, ton dossier : https://www.restoaction.ca/calcul/dossier?c=50&m=30&t=25",
  );
});
