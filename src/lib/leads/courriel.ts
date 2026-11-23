import { echapper, enveloppe } from "@/lib/courriels-fondateur";
import { decrireProvenance } from "@/lib/provenance";
import { LIGNE_DOUBLON, libelleReferent, lignesReference, type EvenementComplet } from "@/lib/references/envoi";
import { SITE_URL } from "@/lib/site";
import { TEXTOS_LEADS } from "@/lib/contenu/leads";
import { cellulaireLisible, lienAppeler, lienTexter, remplirTexto, sujetLead, type Enregistrement, type Lead, type ReferentFiche, type SourceLead } from "./lead";

/* L'ALERTE [Lead] : UN COURRIEL À L'ÉQUIPE POUR CHAQUE LEAD, POUR RÉPONDRE VITE.

   Le même objet pour toutes les sources, « [Lead] {source} : {resto}, {ville} »,
   pour que Guillaume les filtre dans sa boîte. Dans l'ordre :
     1. En haut, 3 liens : Appeler, Texter et Ouvrir la fiche (/tableau/leads).
        Texter ouvre un texto adressé au bon numéro, sur iPhone et sur Android;
        les gabarits, eux, se choisissent sur la fiche. Si la fiche dit « Ne
        plus texter », le lien Texter n'y est pas.
     2. Tant que le CRM n'est pas branché (`sansBase`), l'alerte n'en parle
        pas : ni rouge, ni bouton vers une fiche. Le lead en entier est au bas
        du courriel, pour le CRM plus tard.
        Si la base est branchée et n'a pas répondu : « Pas enregistré dans le CRM », en rouge,
        avec le lien pour ajouter le lead à la main. Tout ce qu'il faut pour le
        faire est dans le courriel.
     3. « Référé par {nom} ({type}) » s'il y a lieu, et « Déjà dans le CRM
        depuis le {date} » si le resto avait déjà une fiche.
     4. Tout le lead, une ligne par champ, lisible sur un cellulaire : ce qu'il
        a rempli, le consentement, la provenance.

   Français seulement : c'est l'équipe qui lit. Ce courriel ne part JAMAIS au
   resto. */

type Ligne = [string, string];

const LIBELLES_SOURCE: Record<SourceLead, string> = {
  "calcul-60": "Le Calcul 60 secondes",
  classement: "Ton rang sur Google (le Classement)",
  studio: "Le Studio Photo",
  reference: "Réfère un resto",
  "reserve-ta-place": "Réserve ta place (/reserver)",
  reservation: "Rendez-vous à l'agenda",
  "dossier-releve": "Le Dossier pour ton associé (calculateur avec relevé)",
  contact: "Contact",
  manuel: "Ajouté à la main",
};

const PAS_ENREGISTRE = "Pas enregistré dans le CRM";

/** L'adresse d'une fiche, et celle de l'écran « Ajouter ». */
const lienFiche = (leadId: string) => `${SITE_URL}/tableau/leads/${leadId}`;
const LIEN_AJOUTER = `${SITE_URL}/tableau/leads/ajouter`;

function jour(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-CA", { timeZone: "America/Toronto", dateStyle: "long" });
}

/** Les noms lisibles des données propres à chaque source. Une clé absente d'ici s'affiche telle quelle. */
const LIBELLES_DONNEES: Record<string, string> = {
  // Le Calcul 60 secondes
  commandes_par_semaine: "Commandes par semaine",
  commande_moyenne: "Commande moyenne ($)",
  taux_commission: "Taux de commission",
  par_semaine: "Réponse : par semaine ($)",
  par_annee: "Réponse : par année ($)",
  lien_dossier: "Lien du dossier",
  // Le Classement
  type_libelle: "Type de resto",
  type: "Type (Google)",
  rang: "Rang (le jour de la demande)",
  total: "Sur combien de restos du même type",
  test_bouton: "Test du bouton « Commander en ligne »",
  fiche: "Fiche Google",
  // Le Studio
  originale: "Photo originale",
  retouche: "Photo retouchée",
  moteur: "Moteur",
  verdict_controle: "Verdict du contrôle",
  reponse_1: "Réponse 1",
  reponse_2: "Réponse 2",
  exemple_permis: "Accepte que son avant et après serve d'exemple",
  publication: "Publication proposée",
  // /reserver
  etape: "Étape",
  menu: "Menu",
  service: "Service",
  plateformes: "Plateformes",
  commandes: "Commandes par semaine",
  conditions: "Version des conditions",
  accord_coche: "Case d'accord cochée",
  accord_texte: "Texte de la case d'accord",
  // L'agenda
  debut: "Début du rendez-vous",
  fin: "Fin du rendez-vous",
  meet: "Lien Meet",
  message: "Message",
  google_event_id: "Événement Google",
  // Contact
  demande: "Demande",
  adresse: "Adresse",
  profil: "Profil",
  entreprise: "Resto ou entreprise",
  region: "Ville ou région",
  resto_en_tete: "Resto en tête",
  consentement_refere: "Le resto sait qu'on va le contacter",
};

function quand(iso: string): string {
  return new Date(iso).toLocaleString("fr-CA", { timeZone: "America/Toronto", dateStyle: "long", timeStyle: "short" });
}

function valeur(cle: string, v: unknown): string | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "boolean") return v ? "oui" : "non";
  if (typeof v === "number") return cle === "taux_commission" ? `${Math.round(v * 100)} %` : v.toLocaleString("fr-CA");
  if (typeof v === "string") {
    if ((cle === "debut" || cle === "fin") && !Number.isNaN(Date.parse(v))) return quand(v);
    return v.startsWith("/") && cle.startsWith("lien") ? `${SITE_URL}${v}` : v;
  }
  if (Array.isArray(v) && v.every((x) => typeof x === "string" || typeof x === "number")) return v.join(", ");
  // Un objet (le relevé, les hypothèses…) : il est en entier dans la fiche.
  return "(en entier dans la fiche)";
}

/** Les données propres à la source, en lignes lisibles. */
function lignesDonnees(lead: Lead): { lignes: Ligne[]; doublon: boolean } {
  if (lead.source === "reference") {
    // Une référence : exactement ce que signalerReference envoie, avec ses propres lignes.
    const { lignes, doublon } = lignesReference(lead.donnees as unknown as EvenementComplet);
    return { lignes, doublon };
  }
  const lignes: Ligne[] = [];
  for (const [cle, v] of Object.entries(lead.donnees)) {
    const texte = valeur(cle, v);
    if (texte !== null) lignes.push([LIBELLES_DONNEES[cle] ?? cle, texte]);
  }
  return { lignes, doublon: false };
}

const estLien = (v: string) => /^https?:\/\//.test(v);

function rangee([k, v]: Ligne): string {
  const contenu = estLien(v)
    ? `<a href="${echapper(v)}" style="color:#191919;word-break:break-all;">${echapper(v)}</a>`
    : echapper(v).replace(/\n/g, "<br>");
  return `<tr><td style="padding:7px 0;border-bottom:1px solid #eeeeec;"><div style="font-size:12px;color:#777777;">${echapper(k)}</div><div style="font-size:16px;font-weight:700;">${contenu}</div></td></tr>`;
}

function bloc(titre: string, lignes: Ligne[]): string {
  if (lignes.length === 0) return "";
  return `<p style="margin:22px 0 4px;font-weight:900;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:#777777;">${echapper(titre)}</p><table style="border-collapse:collapse;width:100%;">${lignes.map(rangee).join("")}</table>`;
}

const boutonHaut = (href: string, libelle: string, fond: string) =>
  `<a href="${echapper(href)}" style="display:inline-block;margin:0 8px 8px 0;background:${fond};color:#ffffff;text-decoration:none;font-weight:900;font-size:17px;padding:14px 26px;border-radius:999px;">${echapper(libelle)}</a>`;

export function courrielLead(
  lead: Lead,
  o: {
    enregistrement: Enregistrement | null;
    referent: ReferentFiche | null;
    precision?: string;
    /** Vrai tant que le CRM n'est pas branché : l'alerte n'en parle pas, ce n'est pas une panne. */
    sansBase?: boolean;
    /** La fiche du resto dans le mini CRM du site, quand la base n'a pas la sienne. */
    lienFiche?: string;
  },
): { sujet: string; texte: string; html: string } {
  const sujet = sujetLead(lead, o.precision);
  const cell = lead.contact.cellulaire;
  const e = o.enregistrement;
  // La base est branchée et n'a pas répondu : là, c'est une panne, et l'alerte le dit en rouge.
  const panne = !e && !o.sansBase;
  const appeler = cell ? lienAppeler(cell) : null;
  // « Ne plus texter » sur la fiche : pas de lien Texter.
  /* Un lead qui a un dossier (le Calcul 60 secondes) : Texter ouvre le texto
     déjà écrit, avec le lien de son dossier. Guillaume n'a qu'à appuyer sur
     Envoyer. Le texte vient de src/lib/contenu/leads.ts. */
  const lienDossier = typeof lead.donnees.lien_dossier === "string" ? lead.donnees.lien_dossier : "";
  const texto = lienDossier ? remplirTexto(TEXTOS_LEADS[lead.source], lead, lienDossier) : "";
  const texter = cell && !e?.nePlusTexter ? lienTexter(cell, texto) : null;
  const fiche = e ? lienFiche(e.leadId) : (o.lienFiche ?? null);
  const ref = lead.provenance.reference;
  const { lignes: donnees, doublon: doublonReference } = lignesDonnees(lead);
  const doublon = doublonReference || Boolean(ref);
  const referePar = o.referent ? `Référé par ${o.referent.nom} (${libelleReferent(o.referent.type)})` : null;
  const dejaLa = e?.existait && e.depuis ? `Déjà dans le CRM depuis le ${jour(e.depuis)}` : null;

  // ── Qui, et quel resto ──
  const contact = [lead.contact.prenom, lead.contact.nom].filter(Boolean).join(" ");
  const qui: Ligne[] = [
    ["Source", `${lead.source} · ${LIBELLES_SOURCE[lead.source]}${o.precision ? ` (${o.precision})` : ""}`],
    ["Resto", lead.resto.nom || "(non précisé)"],
    ["Ville", lead.resto.ville ?? "(non précisée)"],
    ["Prénom et nom", contact || "(non précisé)"],
    ["Cellulaire", cell ? cellulaireLisible(cell) : lead.contact.cellulaire_saisi ? `${lead.contact.cellulaire_saisi} (tel que tapé)` : "(aucun)"],
    ["Courriel", lead.contact.courriel ?? "(aucun)"],
  ];
  if (lead.resto.google_place_id) {
    qui.push(["Fiche Google du resto", `https://www.google.com/maps/place/?q=place_id:${lead.resto.google_place_id}`]);
  }

  // ── Le consentement ──
  const consentement: Ligne[] = lead.consentement
    ? [
        ["Case cochée", `${lead.consentement.coche ? "oui" : "non"}, le ${quand(lead.consentement.horodatage)}`],
        ["Texte de la case", `« ${lead.consentement.texte} »`],
      ]
    : [["Case de consentement", "aucune sur ce formulaire"]];

  // ── La provenance ──
  const p = lead.provenance;
  const provenance: Ligne[] = [
    ["Page du formulaire", p.page],
    [
      "Provenance",
      decrireProvenance({
        source: p.utm.source ?? undefined,
        medium: p.utm.medium ?? undefined,
        campaign: p.utm.campaign ?? undefined,
        content: p.utm.content ?? undefined,
        term: p.utm.term ?? undefined,
        referent: p.site_origine ?? undefined,
        page: p.page_arrivee ?? undefined,
        video: p.video ?? undefined,
      }),
    ],
  ];
  if (p.page_arrivee) provenance.push(["Première page de la visite", p.page_arrivee]);
  if (p.site_origine) provenance.push(["Site d'où il vient", p.site_origine]);
  if (ref) {
    provenance.push(
      ["Référé par", `${ref.nom} (${libelleReferent(ref.type)})`],
      ["Code de référence", `${ref.code}${ref.representant ? `, représentant : ${ref.representant}` : ""}`],
      ["Premier clic sur le lien", quand(ref.premier_contact)],
    );
  }

  const suivi: Ligne[] = [
    ["Reçu le", quand(lead.horodatage)],
    [
      "Dans le CRM",
      e
        ? e.existait
          ? "oui, ajouté à une fiche qui existait déjà"
          : "oui, nouvelle fiche"
        : panne
          ? `NON. ${PAS_ENREGISTRE}.`
          : o.lienFiche
            ? "pas encore branché. Le resto est rangé dans le mini CRM du site (Ouvrir la fiche)."
            : "pas encore branché. Ce courriel est la seule copie du lead : garde-le.",
    ],
    ["Identifiant de l'envoi", lead.id],
  ];

  const ligneLiens = !cell
    ? "Pas de cellulaire : aucun lien Appeler ni Texter."
    : e?.nePlusTexter
      ? "La fiche dit « Ne plus texter » : pas de lien Texter."
      : texto
        ? "Texter ouvre le texto déjà écrit, avec le lien de son dossier. Relis-le, puis appuie sur Envoyer."
        : e
          ? "Texter ouvre un texto vide au bon numéro. Tes gabarits sont sur la fiche."
          : "Texter ouvre un texto vide au bon numéro.";
  const alerteBase = !panne ? null : `${PAS_ENREGISTRE}. La base n'a pas répondu : ajoute ce lead à la main, tout est plus bas.`;
  // Le lead en entier, seulement quand la base ne l'a pas : rien ne doit se perdre.
  const json = e ? null : JSON.stringify(lead, null, 2);
  const titreJson = panne ? "Le lead en entier (la base ne l'a pas) :" : "Le lead en entier (pour le CRM, plus tard) :";

  // ── La version texte ──
  const enTexte = (titre: string, lignes: Ligne[]) => (lignes.length ? [titre.toUpperCase(), ...lignes.map(([k, v]) => `${k} : ${v}`), ""] : []);
  const texte = [
    ...(appeler ? [`Appeler : ${appeler}`] : []),
    ...(texter ? [`Texter : ${texter}`] : []),
    ...(fiche ? [`Ouvrir la fiche : ${fiche}`] : []),
    ligneLiens,
    "",
    ...(alerteBase ? [alerteBase, `Ajouter à la main : ${LIEN_AJOUTER}`, ""] : []),
    ...(referePar ? [referePar] : []),
    ...(dejaLa ? [dejaLa] : []),
    ...(referePar || dejaLa ? [""] : []),
    ...enTexte("Le lead", qui),
    ...enTexte("Ce qu'il a rempli", donnees),
    ...enTexte("Le consentement", consentement),
    ...enTexte("La provenance", provenance),
    ...(doublon ? [LIGNE_DOUBLON, ""] : []),
    ...enTexte("Le suivi", suivi),
    ...(json ? [titreJson, json] : []),
  ].join("\n");

  // ── La version HTML ──
  const html = enveloppe(
    [
      `<p style="margin:0 0 6px;">${appeler ? boutonHaut(appeler, "Appeler", "#ff3008") : ""}${texter ? boutonHaut(texter, "Texter", "#191919") : ""}${
        fiche ? boutonHaut(fiche, "Ouvrir la fiche", "#555555") : panne ? boutonHaut(LIEN_AJOUTER, "Ajouter à la main", "#555555") : ""
      }</p>`,
      `<p style="margin:0 0 14px;font-size:13px;color:#777777;">${echapper(ligneLiens)}</p>`,
      alerteBase ? `<p style="margin:0 0 14px;padding:10px 12px;background:#ffe1d9;border-radius:8px;font-weight:900;color:#b3210a;">${echapper(alerteBase)}</p>` : "",
      referePar || dejaLa
        ? `<p style="margin:0 0 14px;padding:10px 12px;background:#fff4d6;border-radius:8px;font-weight:900;">${[referePar, dejaLa].filter((v): v is string => Boolean(v)).map(echapper).join("<br>")}</p>`
        : "",
      bloc("Le lead", qui),
      bloc("Ce qu'il a rempli", donnees),
      bloc("Le consentement", consentement),
      bloc("La provenance", provenance),
      doublon ? `<p style="margin:18px 0 0;padding:10px 12px;background:#fff4d6;border-radius:8px;font-weight:700;">${echapper(LIGNE_DOUBLON)}</p>` : "",
      bloc("Le suivi", suivi),
      json
        ? `<p style="margin:22px 0 6px;font-size:12px;color:#777777;">${echapper(titreJson)}</p><pre style="white-space:pre-wrap;word-break:break-word;font-size:11px;color:#555555;background:#f6f6f4;padding:10px;border-radius:8px;margin:0;">${echapper(json)}</pre>`
        : "",
    ].join("\n"),
  );

  return { sujet, texte, html };
}
