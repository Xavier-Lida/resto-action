import { randomUUID } from "node:crypto";
import { envoyerCourriel } from "@/lib/google/courriel";
import type { Provenance } from "@/lib/provenance";
import { completerReference, type EvenementComplet, type EvenementReference } from "@/lib/references/envoi";
import { referencePourCrm, type ReferenceAttribuee } from "@/lib/references/lien";
import { baseBranchee, enregistrerLead } from "./base";
import { courrielLead } from "./courriel";
import { cellulaire10, cleResto, couperNom, idValide, isoToronto, type Enregistrement, type Lead, type ReferentFiche, type SourceLead } from "./lead";

/* LA PORTE UNIQUE DES LEADS (18 nov. 2026).

   Tous les formulaires du site où un resto laisse un contact passent par
   `signalerLead`, et par rien d'autre. C'est le seul endroit du site qui
   range un lead et qui prévient l'équipe. Le format est dans ./lead.ts.

   CE QUE FAIT UN ENVOI, DANS L'ORDRE :
     1. La base (Supabase, ./base.ts). La fiche du resto est trouvée (même
        cellulaire, sinon même identifiant Google) ou créée, et l'événement
        s'ajoute à son journal, avec le texte exact de la case, l'heure et la
        provenance. Un 2e formulaire du même resto ajoute un événement, jamais
        une 2e fiche.
     LE CRM N'EST PAS ENCORE BRANCHÉ (19 nov.) : tant que SUPABASE_URL et
     SUPABASE_CLE_SECRETE manquent, l'étape 1 est sautée et l'alerte par
     courriel fait tout le travail, sans avertissement. Le jour où les 2
     variables sont posées, la base se branche toute seule : rien à changer ici.

     2. L'alerte [Lead] par courriel à l'équipe (./courriel.ts), TOUJOURS, que
        la base ait répondu ou non. Si elle n'a pas répondu, l'alerte porte la
        mention « Pas enregistré dans le CRM » et tout ce qu'il faut pour
        ajouter le lead à la main.

   ON NE PERD JAMAIS UN LEAD. Le résultat est « base » ou « courriel » dès
   qu'un des deux a marché : la route montre alors un succès. Sinon « echec » :
   le lead entier est écrit au journal du serveur, et la route montre au
   visiteur un message honnête avec notre numéro.

   UN DOUBLE CLIC N'ENVOIE PAS 2 FOIS : chaque lead porte un identifiant créé
   dans le navigateur. La base refuse un identifiant déjà au journal, et aucune
   2e alerte ne part. Un petit filtre en mémoire fait la même chose pour 2
   envois qui arrivent au même instant sur la même instance.

   LE CODE DE RÉFÉRENCE (témoin de 30 jours) voyage avec tous les leads, peu
   importe l'outil : il est posé sur la fiche à sa création (le premier contact
   gagne) et écrit au journal à chaque événement. Aucun crédit ni commission
   n'est promis ou calculé ici.

   AUCUN TEXTO NI COURRIEL NE PART AU RESTO D'ICI : c'est Guillaume qui écrit.

   L'ANCIEN CRM (dashboard.restoaction.ca) N'EST PLUS APPELÉ D'ICI. Son code
   reste en place, sans appelant parmi les formulaires : src/lib/crm.ts
   (signalerFondateur, signalerReservation) et le POST de signalerReference
   (src/lib/references/envoi.ts). Le webhook Stripe appelle encore
   signalerFondateur : il n'a pas été touché.

   CETTE FONCTION NE LÈVE JAMAIS. Serveur seulement. */

export type EvenementLead = {
  /** L'identifiant créé dans le navigateur. Absent ou abîmé : le serveur en crée un. */
  id?: unknown;
  source: SourceLead;
  langue?: "fr" | "en";
  contact: {
    prenom?: string;
    /** « Marie Tremblay » : coupé en prénom et nom. Ignoré si `prenom` est donné. */
    nomComplet?: string;
    nom?: string | null;
    cellulaire?: string | null;
    courriel?: string | null;
  };
  resto: { nom: string; ville?: string | null; googlePlaceId?: string | null };
  donnees?: Record<string, unknown>;
  /** Le texte EXACT de la case, copié du fichier de contenu par la route, et si elle est cochée. */
  consentement?: { texte: string; coche: boolean } | null;
  /** La page du formulaire. */
  page: string;
  provenance?: Provenance;
  /** Le témoin de 30 jours lu par la route (referenceDeLaRequete). */
  attribution?: ReferenceAttribuee;
  /** Une précision ajoutée à l'objet du courriel, ex. « étape 1 ». */
  precision?: string;
  /** La fiche du resto dans le mini CRM du site (/tableau/leads), si elle y est rangée : le bouton « Ouvrir la fiche » de l'alerte y mène. */
  lienFiche?: string;
  /** Réfère un resto : l'événement du programme. Il devient les données du lead, tel quel. */
  reference?: EvenementReference;
};

export type ResultatLead = "base" | "courriel" | "echec";

// ─── L'anti-doublon de l'instance (la base, elle, refuse pour de bon) ───

const DUREE_SOUVENIR_MS = 10 * 60_000;
const recents = new Map<string, { quand: number; resultat: Promise<ResultatLead> }>();

function retenir(id: string, resultat: Promise<ResultatLead>): void {
  const maintenant = Date.now();
  if (recents.size > 300) {
    for (const [cle, v] of recents) if (maintenant - v.quand > DUREE_SOUVENIR_MS) recents.delete(cle);
  }
  recents.set(id, { quand: maintenant, resultat });
  // Un échec ne se retient pas : le visiteur doit pouvoir réessayer avec le même identifiant.
  void resultat.then((r) => {
    if (r === "echec") recents.delete(id);
  });
}

// ─── La porte ───

export function signalerLead(e: EvenementLead): Promise<ResultatLead> {
  const id = idValide(e.id) ? e.id.toLowerCase() : randomUUID();
  const deja = recents.get(id);
  if (deja && Date.now() - deja.quand < DUREE_SOUVENIR_MS) return deja.resultat;

  const resultat = envoyer(id, e).catch((erreur) => {
    console.error("[leads] panne inattendue :", erreur instanceof Error ? erreur.message : erreur, e.source, id);
    return "echec" as const;
  });
  retenir(id, resultat);
  return resultat;
}

/** Le lead au format unique, à partir de ce que la route a validé. */
export function construireLead(id: string, e: EvenementLead, maintenant = new Date()): Lead {
  const horodatage = isoToronto(maintenant);
  const coupe = e.contact.prenom !== undefined ? { prenom: e.contact.prenom.trim(), nom: e.contact.nom ?? null } : couperNom(e.contact.nomComplet ?? "");
  const saisi = (e.contact.cellulaire ?? "").trim();
  const cellulaire = cellulaire10(saisi);
  const googlePlaceId = e.resto.googlePlaceId || null;
  const ville = e.resto.ville?.trim() || null;
  const nom = e.resto.nom.trim();
  const p = e.provenance;

  const lead: Lead = {
    id,
    version: 1,
    type: "lead",
    source: e.source,
    horodatage,
    langue: e.langue ?? "fr",
    contact: {
      prenom: coupe.prenom,
      nom: coupe.nom,
      cellulaire,
      ...(saisi && !cellulaire ? { cellulaire_saisi: saisi } : {}),
      courriel: e.contact.courriel?.trim().toLowerCase() || null,
    },
    resto: { nom, ville, google_place_id: googlePlaceId },
    donnees: e.donnees ?? {},
    consentement: e.consentement ? { texte: e.consentement.texte, coche: e.consentement.coche, horodatage } : null,
    provenance: {
      page: e.page,
      page_arrivee: p?.page ?? null,
      site_origine: p?.referent ?? null,
      utm: {
        source: p?.source ?? null,
        medium: p?.medium ?? null,
        campaign: p?.campaign ?? null,
        content: p?.content ?? null,
        term: p?.term ?? null,
      },
      video: p?.video ?? null,
      // Un lead de source « reference » porte son référent dans ses données, pas ici.
      reference: (e.source !== "reference" && referencePourCrm(e.attribution)) || null,
    },
    cle_resto: cleResto({ cellulaire, googlePlaceId, nom, ville }),
  };
  return lead;
}

/** Qui a présenté ce resto, pour la fiche : le témoin de 30 jours, sinon le code du formulaire « Présente-nous ce resto ». */
function referentDuLead(lead: Lead, reference: EvenementComplet | undefined): ReferentFiche | null {
  const r = lead.provenance.reference ?? (reference?.type === "reference.recue" ? reference.referent : null);
  return r ? { code: r.code, nom: r.nom, type: r.type } : null;
}

async function envoyer(id: string, e: EvenementLead): Promise<ResultatLead> {
  const lead = construireLead(id, e);

  /* Une référence EST un lead : ses données sont l'événement complet du
     programme (même identifiant que le lead). */
  let reference: EvenementComplet | undefined;
  if (e.reference) {
    reference = completerReference(e.reference, id);
    lead.donnees = reference as unknown as Record<string, unknown>;
  }
  const referent = referentDuLead(lead, reference);

  // 1. La base.
  const enregistrement = await enregistrerLead(lead, referent);

  // Un double envoi que la base a reconnu : rien n'a été ajouté, aucune 2e alerte.
  if (enregistrement?.dejaRecu) return "base";

  // 2. L'alerte, toujours.
  const courriel = await versCourriel(lead, enregistrement, referent, e.precision, e.lienFiche);

  if (enregistrement) return "base";
  if (courriel) return "courriel";
  console.error(`[leads] LEAD NON TRANSMIS (${lead.source}, ${lead.id}) :`, JSON.stringify(lead));
  return "echec";
}

// ─── Le courriel à l'équipe ───

/* L'adresse vient de LEADS_COURRIEL_EQUIPE (posée par Guillaume, jamais écrite
   ici). Tant qu'elle manque, on retombe sur les boîtes qui recevaient déjà ces
   courriels, pour ne rien perdre : REFERENCES_COURRIEL_EQUIPE pour une
   référence, puis GOOGLE_SUJET (là où arrivait la réservation). */
function adresseEquipe(source: SourceLead): string | undefined {
  return (
    process.env.LEADS_COURRIEL_EQUIPE ||
    (source === "reference" ? process.env.REFERENCES_COURRIEL_EQUIPE : undefined) ||
    process.env.GOOGLE_SUJET ||
    undefined
  );
}

async function versCourriel(
  lead: Lead,
  enregistrement: Enregistrement | null,
  referent: ReferentFiche | null,
  precision: string | undefined,
  lienFicheMini: string | undefined,
): Promise<boolean> {
  const a = adresseEquipe(lead.source);
  if (!a) {
    console.error("[leads] LEADS_COURRIEL_EQUIPE n'est pas posée : courriel impossible.");
    return false;
  }
  try {
    await envoyerCourriel({ a, ...courrielLead(lead, { enregistrement, referent, precision, sansBase: !baseBranchee(), lienFiche: lienFicheMini }) });
    return true;
  } catch (erreur) {
    console.error("[leads] courriel refusé :", erreur instanceof Error ? erreur.message : erreur, lead.source, lead.id);
    return false;
  }
}
