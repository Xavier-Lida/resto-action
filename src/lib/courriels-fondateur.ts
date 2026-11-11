import { FR } from "@/lib/textes/fr";
import { EN } from "@/lib/textes/en";
import { PHONE_DISPLAY, SITE_URL } from "@/lib/site";
import type { Courriel } from "@/lib/google/courriel";

/* LES COURRIELS DU GRAND LANCEMENT.

   0. Réservation : envoyé par /api/fondateur quand un resto réserve sa place
      (gratuit). Une copie détaillée part aussi à l'équipe, au cas où le CRM
      ne l'aurait pas reçue.
   1. Bienvenue : envoyé par le webhook Stripe quand la mise en service est
      payée, à la signature. Il porte le lien du dossier privé.
   2. Avancement : envoyé quand on modifie les métadonnées du client dans
      Stripe (etape, prochain_point, date_lancement ou message). Le webhook
      reçoit customer.updated et prévient le resto, sans autre geste.

   Les noms d'étapes viennent des dictionnaires (reservation.dossier.etapes) :
   la page et le courriel disent toujours la même chose. */

export type Langue = "fr" | "en";

export const lienDossier = (session: string, langue: Langue) =>
  `${SITE_URL}${langue === "en" ? "/en/status" : "/dossier"}/${session}`;

// L'anglais est en pause : les conditions sont en français pour tout le monde.
export const LIEN_CONDITIONS = `${SITE_URL}/conditions-fondateur`;

const prenomDe = (nom: string) => nom.trim().split(/\s+/)[0] ?? "";

export const echapper = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* Le HTML reste sobre : une colonne, du texte, un bouton. Les clients courriel
   ignorent les feuilles de style, d'où les styles en ligne. */
export function enveloppe(corps: string): string {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f1f1ef;font-family:Arial,Helvetica,sans-serif;color:#191919;">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:28px;line-height:1.55;font-size:15px;">
<p style="margin:0 0 18px;font-weight:900;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#ff3008;">Resto Action</p>
${corps}
</div></body></html>`;
}

const bouton = (href: string, libelle: string) =>
  `<p style="margin:22px 0;"><a href="${echapper(href)}" style="display:inline-block;background:#ff3008;color:#ffffff;text-decoration:none;font-weight:900;padding:13px 22px;border-radius:999px;">${echapper(libelle)}</a></p>`;

export const para = (t: string) => `<p style="margin:0 0 14px;">${echapper(t)}</p>`;

/* ─── 0. Réservation (gratuite) ─── */

const RESERVATION = {
  fr: {
    sujet: "C'est noté : {resto}",
    salut: "Salut {prenom},",
    ouverture: "On a bien reçu ta réservation pour {resto} dans le Grand Lancement d'hiver. C'est gratuit.",
    appel: "On t'appelle dans les 24 h pour fixer ta date et signer ton bon d'accord.",
    suiteTitre: "La suite",
    suite: FR.reservation.merci.suite,
    prix: "La mise en service de 750 $ se paie à la signature. Pas de dépôt.",
    conditions: "Les conditions :",
    question: "Une question? Réponds à ce courriel ou appelle-moi au {tel}.",
  },
  en: {
    sujet: "Got it: {resto}",
    salut: "Hi {prenom},",
    ouverture: "We received your reservation for {resto} in the Winter Launch. It's free.",
    appel: "We'll call you within 24 hours to set your date and sign your agreement.",
    suiteTitre: "What's next",
    suite: EN.reservation.merci.suite,
    prix: "The $750 setup is paid at signing. No deposit.",
    conditions: "The terms:",
    question: "A question? Reply to this email or call me at {tel}.",
  },
};

export function courrielReservation(d: { a: string; nom: string; restaurant: string; langue: Langue }): Courriel {
  const r = RESERVATION[d.langue];
  const remplir = (v: string) =>
    v.replace("{resto}", d.restaurant).replace("{prenom}", prenomDe(d.nom)).replace("{tel}", PHONE_DISPLAY);
  const conditions = LIEN_CONDITIONS;

  const texte = [
    remplir(r.salut),
    "",
    remplir(r.ouverture),
    r.appel,
    "",
    `${r.suiteTitre} :`,
    ...r.suite.map((l, i) => `${i + 1}. ${l}`),
    "",
    r.prix,
    `${r.conditions} ${conditions}`,
    "",
    remplir(r.question),
    "",
    "Guillaume",
    "Resto Action",
  ].join("\n");

  const html = enveloppe(
    [
      para(remplir(r.salut)),
      para(remplir(r.ouverture)),
      para(r.appel),
      `<p style="margin:18px 0 6px;font-weight:900;">${echapper(r.suiteTitre)}</p>`,
      `<ol style="margin:0 0 14px;padding-left:20px;">${r.suite.map((l) => `<li style="margin-bottom:4px;">${echapper(l)}</li>`).join("")}</ol>`,
      para(r.prix),
      `<p style="margin:0 0 14px;">${echapper(r.conditions)} <a href="${echapper(conditions)}" style="color:#191919;">${echapper(conditions.replace("https://", ""))}</a></p>`,
      para(remplir(r.question)),
      `<p style="margin:18px 0 0;">Guillaume<br>Resto Action</p>`,
    ].join("\n"),
  );

  return { a: d.a, sujet: remplir(r.sujet), texte, html };
}

/** La copie pour l'équipe : toutes les réponses, à l'adresse de GOOGLE_SUJET. */
export function courrielReservationEquipe(d: {
  nom: string;
  courriel: string;
  telephone: string;
  restaurant: string;
  ville: string;
  langue: Langue;
  menu: string;
  service: string;
  plateformes: string;
  commandes: string;
  consentementTextos: boolean;
  source: string;
  /** « Réfère un resto » : « Chez Ti-Jean (code CHEZTI) », ou rien. */
  referePar?: string;
  crm: boolean;
}): Courriel {
  const lignes: [string, string][] = [
    ["Resto", d.restaurant],
    ["Ville", d.ville],
    ["Nom", d.nom],
    ["Courriel", d.courriel],
    ["Téléphone", d.telephone],
    ["Langue", d.langue],
    ["Menu", d.menu || "(aucun)"],
    ["Service", d.service],
    ["Plateformes", d.plateformes || "(non précisé)"],
    ["Commandes par semaine", d.commandes || "(non précisé)"],
    ["Accepte les textos", d.consentementTextos ? "oui" : "non"],
    ["Provenance", d.source || "(directe)"],
    ...(d.referePar ? ([["Référé par", d.referePar]] as [string, string][]) : []),
    ["Reçue par le CRM", d.crm ? "oui" : "NON : à entrer à la main"],
  ];
  const texte = ["Nouvelle réservation (gratuite) sur /reserver.", "", ...lignes.map(([k, v]) => `${k} : ${v}`), "", "À rappeler dans les 24 h."].join("\n");
  const html = enveloppe(
    [
      para("Nouvelle réservation (gratuite) sur /reserver."),
      `<table style="border-collapse:collapse;width:100%;">${lignes
        .map(([k, v]) => `<tr><td style="padding:4px 8px 4px 0;font-weight:900;vertical-align:top;">${echapper(k)}</td><td style="padding:4px 0;">${echapper(v)}</td></tr>`)
        .join("")}</table>`,
      para("À rappeler dans les 24 h."),
    ].join("\n"),
  );
  return { a: process.env.GOOGLE_SUJET ?? "", sujet: `Réservation : ${d.restaurant} (${d.ville})`, texte, html };
}

/* ─── 1. Bienvenue (mise en service payée) ─── */

const BIENVENUE = {
  fr: {
    sujet: "Ton bon d'accord est signé : {resto}",
    salut: "Salut {prenom},",
    ouverture: "Ton bon d'accord pour {resto} est signé et ta mise en service est payée. Merci de nous faire confiance!",
    dossierTitre: "Ton dossier privé",
    dossierTexte:
      "Garde ce lien. Tu y vois en tout temps où en est ton app, le prochain point avec nous et ta date de mise en service. On t'écrit aussi chaque fois que ton dossier avance.",
    bouton: "Voir mon dossier",
    suiteTitre: "La suite",
    suite: FR.reservation.merci.suite,
    rappel: "Ton abonnement de 200 $ par mois commence à la mise en ligne de ton app, avec tes 4 garanties.",
    conditions: "Tes conditions :",
    facture: "Ta facture Stripe, avec la TPS et la TVQ, arrive dans un courriel séparé.",
    question: "Une question? Réponds à ce courriel ou appelle-moi au {tel}.",
  },
  en: {
    sujet: "Your agreement is signed: {resto}",
    salut: "Hi {prenom},",
    ouverture: "Your agreement for {resto} is signed and your setup is paid. Thanks for trusting us!",
    dossierTitre: "Your private file",
    dossierTexte:
      "Keep this link. It shows at any time where your app is at, your next check-in with us and your go-live date. We'll also email you each time your file moves forward.",
    bouton: "See my file",
    suiteTitre: "What's next",
    suite: EN.reservation.merci.suite,
    rappel: "Your $200 monthly subscription starts when your app goes live, with your 4 guarantees.",
    conditions: "Your terms:",
    facture: "Your Stripe invoice, with GST and QST, arrives in a separate email.",
    question: "A question? Reply to this email or call me at {tel}.",
  },
};

export function courrielBienvenue(d: {
  a: string;
  nom: string;
  restaurant: string;
  session: string;
  langue: Langue;
}): Courriel {
  const b = BIENVENUE[d.langue];
  const remplir = (v: string) =>
    v.replace("{resto}", d.restaurant).replace("{prenom}", prenomDe(d.nom)).replace("{tel}", PHONE_DISPLAY);
  const dossier = lienDossier(d.session, d.langue);
  const conditions = LIEN_CONDITIONS;

  const texte = [
    remplir(b.salut),
    "",
    remplir(b.ouverture),
    "",
    `${b.dossierTitre} : ${dossier}`,
    b.dossierTexte,
    "",
    `${b.suiteTitre} :`,
    ...b.suite.map((l, i) => `${i + 1}. ${l}`),
    "",
    b.rappel,
    `${b.conditions} ${conditions}`,
    "",
    b.facture,
    "",
    remplir(b.question),
    "",
    "Guillaume",
    "Resto Action",
  ].join("\n");

  const html = enveloppe(
    [
      para(remplir(b.salut)),
      para(remplir(b.ouverture)),
      `<p style="margin:18px 0 6px;font-weight:900;">${echapper(b.dossierTitre)}</p>`,
      para(b.dossierTexte),
      bouton(dossier, b.bouton),
      `<p style="margin:18px 0 6px;font-weight:900;">${echapper(b.suiteTitre)}</p>`,
      `<ol style="margin:0 0 14px;padding-left:20px;">${b.suite.map((l) => `<li style="margin-bottom:4px;">${echapper(l)}</li>`).join("")}</ol>`,
      para(b.rappel),
      `<p style="margin:0 0 14px;">${echapper(b.conditions)} <a href="${echapper(conditions)}" style="color:#191919;">${echapper(conditions.replace("https://", ""))}</a></p>`,
      para(b.facture),
      para(remplir(b.question)),
      `<p style="margin:18px 0 0;">Guillaume<br>Resto Action</p>`,
    ].join("\n"),
  );

  return { a: d.a, sujet: remplir(b.sujet), texte, html };
}

/* ─── 2. Avancement ─── */

const AVANCEMENT = {
  fr: {
    sujet: "Ton dossier avance : {etape}",
    salut: "Salut {prenom},",
    ouverture: "Ton dossier pour {resto} vient d'avancer.",
    etape: "Étape {n} sur {total} : {titre}",
    bouton: "Voir mon dossier",
    question: "Une question? Réponds à ce courriel ou appelle-moi au {tel}.",
  },
  en: {
    sujet: "Your file moved forward: {etape}",
    salut: "Hi {prenom},",
    ouverture: "Your file for {resto} just moved forward.",
    etape: "Step {n} of {total}: {titre}",
    bouton: "See my file",
    question: "A question? Reply to this email or call me at {tel}.",
  },
};

export function courrielAvancement(d: {
  a: string;
  nom: string;
  restaurant: string;
  session: string;
  langue: Langue;
  etape: number;
  prochainPoint: string | null;
  dateLancement: string | null;
  message: string | null;
}): Courriel {
  const v = AVANCEMENT[d.langue];
  const t = (d.langue === "en" ? EN : FR).reservation.dossier;
  const total = t.etapes.length;
  const n = Math.min(total, Math.max(1, d.etape));
  const e = t.etapes[n - 1];
  const remplir = (s: string) =>
    s.replace("{resto}", d.restaurant).replace("{prenom}", prenomDe(d.nom)).replace("{tel}", PHONE_DISPLAY);
  const ligneEtape = v.etape.replace("{n}", String(n)).replace("{total}", String(total)).replace("{titre}", e.titre);
  const dossier = lienDossier(d.session, d.langue);

  const details: [string, string][] = [];
  if (d.prochainPoint) details.push([t.prochainPoint, d.prochainPoint]);
  if (d.dateLancement) details.push([t.dateLancement, d.dateLancement]);
  if (d.message) details.push([t.message, d.message]);

  const texte = [
    remplir(v.salut),
    "",
    remplir(v.ouverture),
    "",
    ligneEtape,
    e.texte,
    ...(details.length ? ["", ...details.map(([k, val]) => `${k} : ${val}`)] : []),
    "",
    `${v.bouton} : ${dossier}`,
    "",
    remplir(v.question),
    "",
    "Guillaume",
    "Resto Action",
  ].join("\n");

  const html = enveloppe(
    [
      para(remplir(v.salut)),
      para(remplir(v.ouverture)),
      `<div style="margin:18px 0;padding:16px 18px;border-radius:12px;background:#f1f1ef;">
<p style="margin:0 0 4px;font-weight:900;">${echapper(ligneEtape)}</p>
<p style="margin:0;">${echapper(e.texte)}</p></div>`,
      ...details.map(
        ([k, val]) =>
          `<p style="margin:0 0 10px;"><strong>${echapper(k)}</strong><br>${echapper(val)}</p>`,
      ),
      bouton(dossier, v.bouton),
      para(remplir(v.question)),
      `<p style="margin:18px 0 0;">Guillaume<br>Resto Action</p>`,
    ].join("\n"),
  );

  return { a: d.a, sujet: v.sujet.replace("{etape}", e.titre), texte, html };
}
