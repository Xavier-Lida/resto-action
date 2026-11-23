/* UN LEAD, TOUJOURS LE MÊME FORMAT.

   Le contrat exact, avec un exemple par source, est dans
   docs/leads-contrat-crm.md. Ce fichier en est le miroir : les formes, et les
   petites fonctions pures qui les remplissent (le cellulaire en 10 chiffres,
   la clé du resto, l'heure de Montréal, le lien Texter).

   IL TOURNE DES DEUX CÔTÉS, et les tests l'importent tel quel : il n'importe
   donc rien d'autre que des types. L'envoi lui-même est dans ./envoi.ts
   (serveur seulement). */

export const SOURCES_LEAD = [
  "calcul-60",
  "classement",
  "studio",
  "reference",
  "reserve-ta-place",
  "reservation",
  "dossier-releve",
  "contact",
  // Un lead que Guillaume ajoute lui-même, dans /tableau/leads/ajouter.
  "manuel",
] as const;

export type SourceLead = (typeof SOURCES_LEAD)[number];

/** Qui nous a présenté ce resto : le témoin de 30 jours, tel qu'il voyage déjà dans les 2 POST. */
export type ReferenceLead = {
  code: string;
  type: "client" | "fournisseur" | "professionnel";
  nom: string;
  representant: string | null;
  source: "lien" | "carte" | "representant";
  premier_contact: string;
};

export type Lead = {
  /** UUID créé dans le navigateur : un double clic ou un rechargement garde le même. */
  id: string;
  version: 1;
  type: "lead";
  source: SourceLead;
  /** ISO 8601 à l'heure de Montréal (America/Toronto), décalage compris. */
  horodatage: string;
  langue: "fr" | "en";
  contact: {
    prenom: string;
    nom: string | null;
    /** Toujours 10 chiffres, sans rien d'autre. `null` s'il n'y en a pas. */
    cellulaire: string | null;
    /** Seulement si ce qui a été tapé ne se ramène pas à 10 chiffres (numéro étranger). */
    cellulaire_saisi?: string;
    courriel: string | null;
  };
  resto: {
    nom: string;
    ville: string | null;
    /** L'identifiant de lieu de Google, le même pour le Calcul, le Classement et le Studio. */
    google_place_id: string | null;
  };
  /** Les données propres à la source (voir le contrat). */
  donnees: Record<string, unknown>;
  /** `null` quand le formulaire n'a pas de case. */
  consentement: { texte: string; coche: boolean; horodatage: string } | null;
  provenance: {
    /** La page du formulaire. */
    page: string;
    /** La première page de la visite. */
    page_arrivee: string | null;
    /** Le site d'où il vient (domaine), s'il y en a un. */
    site_origine: string | null;
    utm: {
      source: string | null;
      medium: string | null;
      campaign: string | null;
      content: string | null;
      term: string | null;
    };
    /** La vidéo regardée sur le site, s'il y en a une. */
    video: string | null;
    reference: ReferenceLead | null;
  };
  /** Pour reconnaître le même resto : le cellulaire, sinon l'identifiant Google. La base fusionne (supabase/schema.sql). */
  cle_resto: string;
};

/** Qui a présenté ce resto, pour la fiche : « Référé par {nom} ({type}) ». */
export type ReferentFiche = { code: string; nom: string; type: ReferenceLead["type"] };

/* Le lead tel que la base le reçoit (la fonction `enregistrer_lead` de
   supabase/schema.sql) : les colonnes de la fiche à plat, et tout le reste
   pour le journal. Rien n'est perdu en route : ce qui n'a pas sa colonne est
   dans `contact` ou dans `donnees`. */
export function rangeeDeLead(lead: Lead, referent: ReferentFiche | null) {
  const c = lead.consentement;
  return {
    id: lead.id,
    type: lead.source === "manuel" ? "ajout_manuel" : "formulaire",
    source: lead.source,
    recu_le: lead.horodatage,
    resto: lead.resto.nom,
    ville: lead.resto.ville,
    google_place_id: lead.resto.google_place_id,
    prenom: lead.contact.prenom || null,
    cellulaire: lead.contact.cellulaire,
    courriel: lead.contact.courriel,
    contact: { ...lead.contact, resto: lead.resto.nom, ville: lead.resto.ville, langue: lead.langue },
    donnees: lead.donnees,
    consentement_texte: c?.texte ?? null,
    consentement_coche: c ? c.coche : null,
    consentement_le: c?.horodatage ?? null,
    page: lead.provenance.page,
    page_arrivee: lead.provenance.page_arrivee,
    site_origine: lead.provenance.site_origine,
    utm: lead.provenance.utm,
    video: lead.provenance.video,
    reference: lead.provenance.reference ?? referent,
  };
}

/** Ce que la base répond après avoir rangé un lead. */
export type Enregistrement = {
  leadId: string;
  /** La fiche était déjà là avant cet envoi. */
  existait: boolean;
  /** La date de création de la fiche (ISO). */
  depuis: string | null;
  /** Cet identifiant d'envoi était déjà au journal : rien n'a été ajouté. */
  dejaRecu: boolean;
  nePlusTexter: boolean;
};

export const MOTIF_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Vrai si c'est un UUID bien formé (celui du navigateur). */
export function idValide(v: unknown): v is string {
  return typeof v === "string" && MOTIF_ID.test(v);
}

/** « (819) 555-0100 », « 819-555-0100 », « +1 819 555 0100 » → « 8195550100 ». `null` sinon. */
export function cellulaire10(brut: string | null | undefined): string | null {
  if (!brut) return null;
  let chiffres = brut.replace(/\D/g, "");
  if (chiffres.length === 11 && chiffres.startsWith("1")) chiffres = chiffres.slice(1);
  return chiffres.length === 10 ? chiffres : null;
}

/** « 8195550100 » → « 819 555-0100 », pour l'œil. */
export function cellulaireLisible(dix: string): string {
  return `${dix.slice(0, 3)} ${dix.slice(3, 6)}-${dix.slice(6)}`;
}

/** Minuscules, sans accents ni ponctuation : « Chez Ti-Jean » → « chez ti jean ». */
function simple(v: string): string {
  return v
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Le cellulaire, sinon l'identifiant Google, sinon le nom et la ville. */
export function cleResto(d: { cellulaire: string | null; googlePlaceId: string | null; nom: string; ville: string | null }): string {
  if (d.cellulaire) return `tel:${d.cellulaire}`;
  if (d.googlePlaceId) return `google:${d.googlePlaceId}`;
  return `nom:${simple(d.nom)}|${simple(d.ville ?? "")}`;
}

/** L'instant donné, écrit à l'heure de Montréal : « 2026-11-18T14:32:07-05:00 ». */
export function isoToronto(date: Date): string {
  const morceaux = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZoneName: "longOffset",
  }).formatToParts(date);
  const v = (type: string) => morceaux.find((m) => m.type === type)?.value ?? "";
  // « GMT-05:00 » → « -05:00 » ; « GMT » seul (jamais à Montréal) → « +00:00 ».
  const decalage = v("timeZoneName").replace("GMT", "") || "+00:00";
  return `${v("year")}-${v("month")}-${v("day")}T${v("hour")}:${v("minute")}:${v("second")}${decalage}`;
}

/** « Marie Tremblay » → prénom « Marie », nom « Tremblay ». */
export function couperNom(complet: string): { prenom: string; nom: string | null } {
  const [prenom, ...reste] = complet.trim().split(/\s+/);
  return { prenom: prenom ?? "", nom: reste.join(" ") || null };
}

/** L'objet du courriel : le même préfixe pour toutes les sources, pour le filtrer. */
export function sujetLead(lead: Pick<Lead, "source" | "resto">, precision?: string): string {
  const ou = [lead.resto.nom || "(resto non précisé)", lead.resto.ville].filter(Boolean).join(", ");
  return `[Lead] ${lead.source} : ${ou}${precision ? ` (${precision})` : ""}`;
}

/** Remplit {prenom}, {resto}, {ville} et {lien} (le lien de son dossier, s'il en a un) dans un gabarit de texto. */
export function remplirTexto(gabarit: string, lead: Pick<Lead, "contact" | "resto">, lien = ""): string {
  return gabarit
    .replaceAll("{prenom}", lead.contact.prenom)
    .replaceAll("{resto}", lead.resto.nom)
    .replaceAll("{ville}", lead.resto.ville ?? "")
    .replaceAll("{lien}", lien)
    .trim();
}

export function lienAppeler(dix: string): string {
  return `tel:+1${dix}`;
}

/* « ?&body= » : la seule écriture qu'iPhone ET Android comprennent tous les
   deux (iOS veut « & », Android veut « ? »). Sans texte, le lien ouvre un
   texto vide adressé au bon numéro. */
export function lienTexter(dix: string, texte: string): string {
  return texte ? `sms:+1${dix}?&body=${encodeURIComponent(texte)}` : `sms:+1${dix}`;
}
