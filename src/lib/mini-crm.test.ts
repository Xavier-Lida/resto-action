import { test } from "node:test";
import assert from "node:assert/strict";
import { fusionner, remplir, statutValide, suivre, trier, type Arrivee, type LeadMini } from "./mini-crm/fiche.ts";

const arrivee: Arrivee = {
  cle: "a".repeat(32),
  source: "studio",
  prenom: "Marie",
  cellulaire: "(819) 555-0100",
  resto: "Casse-Croûte Chez Essai",
  ville: "Trois-Rivières",
  plateformes: "DoorDash",
  commandes: "50 à 150",
  consentementTexte: "J'accepte de recevoir des textos de Resto Action au sujet de mes photos.",
  photo: "20261123-101500-aaaaaaaaaa",
  exemple: false,
  quoi: "Photo retouchée par IA au Studio",
};

test("un nouveau contact : statut « nouveau », la photo, le consentement daté", () => {
  const l = fusionner(null, arrivee, "2026-11-23T15:00:00.000Z");
  assert.equal(l.statut, "nouveau");
  assert.equal(l.note, "");
  assert.equal(l.creeLe, "2026-11-23T15:00:00.000Z");
  assert.deepEqual(l.photos, [arrivee.photo]);
  assert.deepEqual(l.photosExemple, []);
  assert.deepEqual(l.consentement, { texte: arrivee.consentementTexte, horodatage: "2026-11-23T15:00:00.000Z" });
  assert.equal(l.journal.length, 1);
});

test("un contact qui revient garde son statut, sa note, sa date et son consentement", () => {
  const premier = suivre(fusionner(null, arrivee, "2026-11-23T15:00:00.000Z"), "contacte", "Rappeler jeudi", "2026-11-24T15:00:00.000Z");
  const l = fusionner(premier, { ...arrivee, photo: "20261125-101500-bbbbbbbbbb", exemple: true, plateformes: "" }, "2026-11-25T15:00:00.000Z");
  assert.equal(l.statut, "contacte");
  assert.equal(l.note, "Rappeler jeudi");
  assert.equal(l.creeLe, "2026-11-23T15:00:00.000Z");
  assert.equal(l.majLe, "2026-11-25T15:00:00.000Z");
  assert.equal(l.consentement.horodatage, "2026-11-23T15:00:00.000Z");
  // La photo la plus récente d'abord; une réponse vide ne remplace pas l'ancienne.
  assert.deepEqual(l.photos, ["20261125-101500-bbbbbbbbbb", arrivee.photo]);
  assert.deepEqual(l.photosExemple, ["20261125-101500-bbbbbbbbbb"]);
  assert.equal(l.plateformes, "DoorDash");
});

test("la même photo envoyée 2 fois ne compte qu'une fois", () => {
  const un = fusionner(null, arrivee, "2026-11-23T15:00:00.000Z");
  assert.deepEqual(fusionner(un, arrivee, "2026-11-23T15:01:00.000Z").photos, [arrivee.photo]);
});

test("le suivi : le statut et la note changent, et le journal le dit", () => {
  const l = fusionner(null, arrivee, "2026-11-23T15:00:00.000Z");
  const s = suivre(l, "rendez-vous", "  Appel mardi 10 h  ", "2026-11-24T15:00:00.000Z");
  assert.equal(s.statut, "rendez-vous");
  assert.equal(s.note, "Appel mardi 10 h");
  assert.equal(s.majLe, "2026-11-24T15:00:00.000Z");
  assert.equal(s.journal[0].quoi, "Statut : Nouveau → Rendez-vous pris");
  assert.equal(s.journal[1].quoi, "Note modifiée");
});

test("un suivi sans changement ne touche à rien", () => {
  const l = fusionner(null, arrivee, "2026-11-23T15:00:00.000Z");
  assert.equal(suivre(l, "nouveau", "", "2026-11-24T15:00:00.000Z"), l);
});

test("seuls les statuts de la liste passent", () => {
  assert.equal(statutValide("client"), true);
  assert.equal(statutValide("n'importe quoi"), false);
  assert.equal(statutValide(undefined), false);
});

test("le tri : les plus récemment touchés d'abord, les « pas intéressé » à la fin", () => {
  const base = fusionner(null, arrivee, "2026-11-23T15:00:00.000Z");
  const f = (cle: string, majLe: string, statut: LeadMini["statut"]): LeadMini => ({ ...base, cle, majLe, statut });
  const tries = trier([f("a", "2026-11-25", "pas-interesse"), f("b", "2026-11-23", "nouveau"), f("c", "2026-11-24", "client")]);
  assert.deepEqual(tries.map((l) => l.cle), ["c", "b", "a"]);
});

test("le texto proposé est rempli avec le prénom, le resto et la ville", () => {
  const l = fusionner(null, arrivee, "2026-11-23T15:00:00.000Z");
  assert.equal(remplir("Salut {prenom}, {resto} à {ville}.", l), "Salut Marie, Casse-Croûte Chez Essai à Trois-Rivières.");
});

// ─── « Ton rang sur Google » dans le mini CRM (23 nov.) ───

const demandeClassement: Arrivee = {
  cle: "a".repeat(32),
  source: "classement",
  prenom: "Marie",
  cellulaire: "(819) 555-0100",
  resto: "Casse-Croûte Chez Essai",
  ville: "Trois-Rivières",
  plateformes: "",
  commandes: "",
  consentementTexte: "J'accepte de recevoir des textos de Resto Action au sujet de mon classement.",
  classement: { type: "casse-croûtes", rang: 4, total: 31, testBouton: "Sur une plateforme", placeId: "ChIJessai0000000000" },
  quoi: "Classement Google demandé : 4e sur 31 casse-croûtes",
};

test("une demande de classement : une fiche sans photo, avec le rang daté", () => {
  const l = fusionner(null, demandeClassement, "2026-11-23T15:00:00.000Z");
  assert.equal(l.source, "classement");
  assert.equal(l.statut, "nouveau");
  assert.deepEqual(l.photos, []);
  assert.deepEqual(l.photosExemple, []);
  assert.deepEqual(l.classement, { ...demandeClassement.classement, quand: "2026-11-23T15:00:00.000Z" });
  assert.equal(l.journal[0].quoi, demandeClassement.quoi);
});

test("le Studio puis le classement : une seule fiche, les photos et le suivi restent", () => {
  const studio = suivre(fusionner(null, arrivee, "2026-11-23T15:00:00.000Z"), "contacte", "Rappeler jeudi", "2026-11-24T15:00:00.000Z");
  const l = fusionner(studio, demandeClassement, "2026-11-25T15:00:00.000Z");
  assert.equal(l.source, "studio");
  assert.equal(l.statut, "contacte");
  assert.equal(l.note, "Rappeler jeudi");
  assert.deepEqual(l.photos, [arrivee.photo]);
  assert.equal(l.plateformes, "DoorDash");
  assert.equal(l.classement?.rang, 4);
  // Le consentement gardé est celui du premier formulaire.
  assert.equal(l.consentement.texte, arrivee.consentementTexte);
});

test("le classement puis le Studio : le rang reste, la photo s'ajoute", () => {
  const l = fusionner(fusionner(null, demandeClassement, "2026-11-23T15:00:00.000Z"), arrivee, "2026-11-25T15:00:00.000Z");
  assert.equal(l.source, "classement");
  assert.deepEqual(l.photos, [arrivee.photo]);
  assert.equal(l.classement?.quand, "2026-11-23T15:00:00.000Z");
});

test("le texto du classement est rempli avec le rang, le total et le type", () => {
  const l = fusionner(null, demandeClassement, "2026-11-23T15:00:00.000Z");
  assert.equal(
    remplir("{resto} est {rang} sur {total} {type} à {ville}.", l, { rang: "4e", total: "31", type: "casse-croûtes" }),
    "Casse-Croûte Chez Essai est 4e sur 31 casse-croûtes à Trois-Rivières.",
  );
});

const demandeDossier: Arrivee = {
  cle: "a".repeat(32),
  source: "calcul-60",
  prenom: "Marie",
  cellulaire: "(819) 555-0100",
  resto: "Casse-Croûte Chez Essai",
  ville: "Trois-Rivières",
  plateformes: "",
  commandes: "",
  consentementTexte: "J'accepte de recevoir des textos de Resto Action au sujet de mon calcul.",
  calcul: { commandes: 50, panier: 30, taux: 0.25, parSemaine: 375, parAnnee: 19500, lienDossier: "https://www.restoaction.ca/calcul/dossier?c=50&m=30&t=25" },
  quoi: "Dossier demandé au Calcul 60 secondes : 19 500 $ par année",
};

test("un dossier demandé au Calcul 60 secondes : une fiche sans photo, avec ses chiffres datés", () => {
  const l = fusionner(null, demandeDossier, "2026-11-23T15:00:00.000Z");
  assert.equal(l.source, "calcul-60");
  assert.equal(l.statut, "nouveau");
  assert.deepEqual(l.photos, []);
  assert.deepEqual(l.calcul, { ...demandeDossier.calcul, quand: "2026-11-23T15:00:00.000Z" });
  assert.equal(l.journal[0].quoi, demandeDossier.quoi);
});

test("le Studio puis le Calcul : une seule fiche, les photos et le suivi restent, le calcul s'ajoute", () => {
  const studio = suivre(fusionner(null, arrivee, "2026-11-23T15:00:00.000Z"), "contacte", "Rappeler jeudi", "2026-11-24T15:00:00.000Z");
  const l = fusionner(studio, demandeDossier, "2026-11-25T15:00:00.000Z");
  assert.equal(l.source, "studio");
  assert.equal(l.statut, "contacte");
  assert.equal(l.note, "Rappeler jeudi");
  assert.deepEqual(l.photos, [arrivee.photo]);
  assert.equal(l.calcul?.parAnnee, 19500);
});

test("un 2e calcul remplace le premier; un autre formulaire n'y touche pas", () => {
  const premier = fusionner(null, demandeDossier, "2026-11-23T15:00:00.000Z");
  const autre = { ...demandeDossier, calcul: { ...demandeDossier.calcul!, commandes: 100, parSemaine: 750, parAnnee: 39000, lienDossier: "https://www.restoaction.ca/calcul/dossier?c=100&m=30&t=25" } };
  const deuxieme = fusionner(premier, autre, "2026-11-24T15:00:00.000Z");
  assert.equal(deuxieme.calcul?.parAnnee, 39000);
  assert.equal(deuxieme.calcul?.quand, "2026-11-24T15:00:00.000Z");
  assert.equal(deuxieme.creeLe, "2026-11-23T15:00:00.000Z");
  const puisStudio = fusionner(deuxieme, arrivee, "2026-11-25T15:00:00.000Z");
  assert.equal(puisStudio.calcul?.parAnnee, 39000);
});

test("le texto du dossier est rempli avec le prénom, le resto et le lien", () => {
  const l = fusionner(null, demandeDossier, "2026-11-23T15:00:00.000Z");
  assert.equal(
    remplir("Salut {prenom}, voici ton dossier pour {resto} : {lien}", l, { lien: l.calcul!.lienDossier }),
    "Salut Marie, voici ton dossier pour Casse-Croûte Chez Essai : https://www.restoaction.ca/calcul/dossier?c=50&m=30&t=25",
  );
});
