import { randomUUID } from "node:crypto";
import { echapper, enveloppe, para } from "@/lib/courriels-fondateur";
import { DELAIS, NOM_PROGRAMME } from "@/lib/contenu/references";
import type { CodeReference, TypeReferent } from "@/lib/contenu/references-codes";
import { envoyerCourriel } from "@/lib/google/courriel";
import { decrireProvenance, type Provenance } from "@/lib/provenance";

/* LE SEUL POINT DE SORTIE DES ÉVÉNEMENTS DE « RÉFÈRE UN RESTO ».

   Le format exact est dans docs/references-contrat-crm.md (section 2). Toutes
   les pages et routes du programme passent par `signalerReference`, et rien
   d'autre ne parle au CRM ou à la boîte de l'équipe pour ce programme.

   DEUX CHEMINS, UN SEUL RÉSULTAT : RIEN NE SE PERD.
     1. Si CRM_REFERENCES_URL et CRM_INGESTION_SECRET sont posées : POST signé
        au CRM, comme signalerReservation et signalerFondateur.
     2. Sinon, ou si le CRM refuse ou ne répond pas : le même événement part
        par courriel à REFERENCES_COURRIEL_EQUIPE (posée dans Vercel, jamais
        écrite ici).
   Si les deux échouent, on journalise et on renvoie « echec » : la route
   montre alors au visiteur un message honnête avec notre numéro.

   CETTE FONCTION NE LÈVE JAMAIS. Ce fichier tourne seulement sur le serveur. */

const DELAI_MS = 10_000;

// ─── Les formes (miroir du contrat) ───

export type ReferentEvenement = {
  code: string;
  type: TypeReferent;
  nom: string;
  representant: string | null;
};

export type SourceEvenement = "lien" | "formulaire" | "carte" | "representant";

export type Consentement = {
  donne: true;
  /** Le texte affiché, mot pour mot. */
  texte: string;
  horodatage: string;
};

export type Refere = {
  resto_nom: string;
  contact_prenom: string | null;
  contact_nom: string | null;
  telephone: string | null;
  courriel: string | null;
  ville: string | null;
};

type Base = {
  langue: "fr" | "en";
  page: string;
  provenance?: Provenance;
  source: SourceEvenement;
};

export type EvenementReference = Base &
  (
    | {
        type: "reference.recue";
        /** `null` si la personne n'a pas de code (ou un code inconnu) : voir referent_contact. */
        referent: ReferentEvenement | null;
        refere: Refere;
        consentement_contact: Consentement;
        referent_contact: {
          nom: string;
          entreprise: string;
          courriel: string | null;
          telephone: string | null;
          /** Ce que la personne a tapé dans « Ton code », s'il ne correspond à aucun code actif. */
          code_saisi: string | null;
        };
      }
    | {
        type: "lien.demande";
        referent: null;
        demandeur: { nom: string; resto: string; courriel: string; telephone: string | null };
      }
    | {
        type: "reference.attribuee";
        referent: ReferentEvenement;
        refere: Refere;
        reservation: { etape: "reservation" | "rendez_vous"; conditions: string | null };
        attribution: { premier_contact: string; via: "url" | "temoin" };
      }
    | { type: "reference.visite"; referent: ReferentEvenement }
    | {
        type: "partenaire.candidature";
        referent: null;
        candidat: {
          entreprise: string;
          ce_qu_elle_vend: string;
          nom: string;
          fonction: string;
          courriel: string;
          telephone: string;
          restos_clients_approx: string;
          regions: string;
          facon_de_referer: string[];
        };
        consentement_contact: Consentement;
      }
    | {
        type: "avantage.presentation";
        referent: null;
        resto: { resto_nom: string; contact_nom: string; courriel: string; telephone: string; ville: string; besoin: string };
        partenaire: { id: string; nom: string };
        consentement: Consentement;
        donnees_transmises: string[];
      }
    | { type: "avantage.clic"; referent: null; partenaire: { id: string; nom: string } }
  );

export type EvenementComplet = EvenementReference & { id: string; version: 1; horodatage: string };

export type ResultatEnvoi = "crm" | "courriel" | "ignore" | "echec";

/** Un référent de la liste des codes, sous la forme de l'événement. */
export function referentDe(c: CodeReference): ReferentEvenement {
  return { code: c.code, type: c.type, nom: c.nom, representant: c.representant ?? null };
}

// ─── L'envoi ───

export async function signalerReference(e: EvenementReference): Promise<ResultatEnvoi> {
  const complet = { id: randomUUID(), version: 1, horodatage: new Date().toISOString(), ...e } as EvenementComplet;

  if (await versCrm(complet)) return "crm";

  // Une simple visite ne mérite pas un courriel : trop de bruit. CRM seulement.
  if (complet.type === "reference.visite") return "ignore";

  if (await versCourriel(complet)) return "courriel";

  console.error(`[references] ÉVÉNEMENT NON TRANSMIS (${complet.type}, ${complet.id}) :`, JSON.stringify(complet));
  return "echec";
}

async function versCrm(e: EvenementComplet): Promise<boolean> {
  const url = process.env.CRM_REFERENCES_URL;
  const secret = process.env.CRM_INGESTION_SECRET;
  if (!url || !secret) return false;
  try {
    const reponse = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify(e),
      signal: AbortSignal.timeout(DELAI_MS),
      cache: "no-store",
    });
    if (!reponse.ok) console.error("[references] CRM refusé :", reponse.status, e.type, e.id);
    return reponse.ok;
  } catch (erreur) {
    // Ni le corps ni le secret dans les journaux : seulement la nature de la panne.
    console.error("[references] CRM injoignable :", erreur instanceof Error ? erreur.name : "erreur inconnue", e.type, e.id);
    return false;
  }
}

async function versCourriel(e: EvenementComplet): Promise<boolean> {
  const a = process.env.REFERENCES_COURRIEL_EQUIPE;
  if (!a) {
    console.error("[references] REFERENCES_COURRIEL_EQUIPE n'est pas posée : courriel impossible.");
    return false;
  }
  try {
    await envoyerCourriel({ a, ...courrielEquipe(e) });
    return true;
  } catch (erreur) {
    console.error("[references] courriel refusé :", erreur instanceof Error ? erreur.message : erreur);
    return false;
  }
}

// ─── Le courriel à l'équipe ───

const LIBELLES_TYPE: Record<EvenementReference["type"], string> = {
  "reference.recue": "Un référent nous présente un resto",
  "lien.demande": "Un resto client demande son lien",
  "reference.attribuee": "Un resto réserve sa place avec un code",
  "reference.visite": "Visite d'un lien de référence",
  "partenaire.candidature": "Une entreprise veut devenir partenaire référent",
  "avantage.presentation": "Un resto client demande à être présenté à un fournisseur",
  "avantage.clic": "Un resto client clique le lien d'un fournisseur",
};

const LIBELLES_REFERENT: Record<TypeReferent, string> = {
  client: "resto client",
  fournisseur: "fournisseur",
  professionnel: "professionnel",
};

const LIBELLES_SOURCE: Record<SourceEvenement, string> = {
  lien: "son lien",
  formulaire: "le formulaire du site",
  carte: "le code QR de la carte",
  representant: "un représentant",
};

function quand(iso: string): string {
  return new Date(iso).toLocaleString("fr-CA", { timeZone: "America/Toronto", dateStyle: "long", timeStyle: "short" });
}

const ouRien = (v: string | null | undefined) => (v && v.trim()) || "(rien)";

function lignesRefere(r: Refere): [string, string][] {
  const contact = [r.contact_prenom, r.contact_nom].filter(Boolean).join(" ");
  return [
    ["Resto référé", r.resto_nom],
    ["Contact", ouRien(contact)],
    ["Téléphone", ouRien(r.telephone)],
    ["Courriel", ouRien(r.courriel)],
    ["Ville", ouRien(r.ville)],
  ];
}

function lignesConsentement(c: Consentement): [string, string][] {
  return [
    ["Consentement", `oui, le ${quand(c.horodatage)}`],
    ["Texte affiché", `« ${c.texte} »`],
  ];
}

/** Le sujet et le contenu, en français : c'est l'équipe qui lit. */
export function courrielEquipe(e: EvenementComplet): { sujet: string; texte: string; html: string } {
  const lignes: [string, string][] = [["Événement", LIBELLES_TYPE[e.type]]];
  let sujet = `[${NOM_PROGRAMME}] ${LIBELLES_TYPE[e.type]}`;
  let doublon = false;

  if (e.referent) {
    lignes.push(["Référé par", `${e.referent.nom} (code ${e.referent.code}, ${LIBELLES_REFERENT[e.referent.type]})`]);
    if (e.referent.representant) lignes.push(["Représentant", e.referent.representant]);
  }
  lignes.push(["Arrivé par", LIBELLES_SOURCE[e.source]]);

  switch (e.type) {
    case "reference.recue":
      sujet = `[${NOM_PROGRAMME}] Nouvelle référence : ${e.refere.resto_nom}${e.refere.ville ? `, ${e.refere.ville}` : ""}`;
      lignes.push(...lignesRefere(e.refere));
      if (!e.referent) lignes.push(["Référé par", `${e.referent_contact.nom} (${e.referent_contact.entreprise}), sans code`]);
      if (e.referent_contact.code_saisi) lignes.push(["Code tapé (inconnu)", e.referent_contact.code_saisi]);
      lignes.push(["Courriel du référent", ouRien(e.referent_contact.courriel)], ["Téléphone du référent", ouRien(e.referent_contact.telephone)]);
      lignes.push(...lignesConsentement(e.consentement_contact));
      doublon = true;
      break;
    case "reference.attribuee":
      sujet = `[${NOM_PROGRAMME}] Nouvelle référence : ${e.refere.resto_nom}${e.refere.ville ? `, ${e.refere.ville}` : ""}`;
      lignes.push(...lignesRefere(e.refere));
      lignes.push(
        ["Ce qu'il a fait", e.reservation.etape === "reservation" ? "réservé sa place sur /reserver" : "pris un rendez-vous à l'agenda"],
        ["Premier clic sur le lien", quand(e.attribution.premier_contact)],
      );
      doublon = true;
      break;
    case "lien.demande":
      sujet = `[${NOM_PROGRAMME}] Demande de lien : ${e.demandeur.resto}`;
      lignes.push(
        ["Nom", e.demandeur.nom],
        ["Resto", e.demandeur.resto],
        ["Courriel", e.demandeur.courriel],
        ["Téléphone", ouRien(e.demandeur.telephone)],
        ["À faire", "Vérifier que c'est un client en ligne et à jour, ajouter son code dans references-codes.ts, lui envoyer son lien."],
      );
      break;
    case "partenaire.candidature":
      sujet = `[${NOM_PROGRAMME}] Candidature partenaire : ${e.candidat.entreprise}`;
      lignes.push(
        ["Entreprise", e.candidat.entreprise],
        ["Ce qu'elle vend aux restos", ouRien(e.candidat.ce_qu_elle_vend)],
        ["Nom", e.candidat.nom],
        ["Fonction", ouRien(e.candidat.fonction)],
        ["Courriel", ouRien(e.candidat.courriel)],
        ["Téléphone", ouRien(e.candidat.telephone)],
        ["Restos clients, environ", ouRien(e.candidat.restos_clients_approx)],
        ["Régions", ouRien(e.candidat.regions)],
        ["Façon de référer", ouRien(e.candidat.facon_de_referer.join(", "))],
      );
      lignes.push(...lignesConsentement(e.consentement_contact));
      break;
    case "avantage.presentation":
      sujet = `[${NOM_PROGRAMME}] Présentation à ${e.partenaire.nom} : ${e.resto.resto_nom}`;
      lignes.push(
        ["Fournisseur", e.partenaire.nom],
        ["Resto", e.resto.resto_nom],
        ["Contact", e.resto.contact_nom],
        ["Courriel", ouRien(e.resto.courriel)],
        ["Téléphone", ouRien(e.resto.telephone)],
        ["Ville", ouRien(e.resto.ville)],
        ["Besoin", ouRien(e.resto.besoin)],
        ["Données qu'on peut transmettre", e.donnees_transmises.join(", ")],
        ["À effacer chez le fournisseur après", `${DELAIS.conservationFournisseurMois} mois`],
      );
      lignes.push(...lignesConsentement(e.consentement));
      break;
    case "avantage.clic":
      lignes.push(["Fournisseur", e.partenaire.nom]);
      break;
    case "reference.visite":
      break;
  }

  lignes.push(
    ["Page", e.page],
    ["Provenance", decrireProvenance(e.provenance)],
    ["Langue", e.langue],
    ["Reçu le", quand(e.horodatage)],
    ["Reçu par le CRM", "NON : à entrer à la main"],
  );
  const verifier = doublon
    ? `À vérifier dans le CRM : doublon? (même resto en discussion avec nous dans les ${DELAIS.fenetreDoublonJours} derniers jours, ou le propre resto du parrain)`
    : null;

  const texte = [
    ...lignes.map(([k, v]) => `${k} : ${v}`),
    "",
    ...(verifier ? [verifier, ""] : []),
    `Identifiant : ${e.id}`,
    "",
    "Pour le CRM (à coller tel quel) :",
    JSON.stringify(e, null, 2),
  ].join("\n");

  const html = enveloppe(
    [
      `<table style="border-collapse:collapse;width:100%;">${lignes
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 8px 4px 0;font-weight:900;vertical-align:top;">${echapper(k)}</td><td style="padding:4px 0;">${echapper(v)}</td></tr>`,
        )
        .join("")}</table>`,
      verifier ? `<p style="margin:18px 0 14px;padding:10px 12px;background:#fff4d6;border-radius:8px;font-weight:700;">${echapper(verifier)}</p>` : "",
      para(`Identifiant : ${e.id}`),
      `<pre style="white-space:pre-wrap;font-size:11px;color:#555;background:#f6f6f4;padding:10px;border-radius:8px;">${echapper(JSON.stringify(e, null, 2))}</pre>`,
    ].join("\n"),
  );

  return { sujet, texte, html };
}
