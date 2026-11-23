import { ecrire, lire, lister, stockagePret, supprimer } from "@/lib/studio/stockage";
import { fusionner, statutValide, suivre, trier, type Arrivee, type LeadMini, type Statut } from "./fiche";

/* LE MINI CRM (23 nov. 2026) : les contacts laissés au Studio Photo, suivis
   dans le site lui-même, sans dépendre de personne.

   OÙ ÇA VIT : dans le magasin privé du Studio (Vercel Blob), un petit fichier
   JSON par resto (crm/leads/<empreinte du cellulaire>.json). Pas de base de
   données, pas de nouveau compte, pas de nouvelle clé : si le Studio marche,
   le mini CRM marche. Un même cellulaire retombe toujours sur la même fiche.

   CES FICHES NE S'EFFACENT PAS TOUTES SEULES, contrairement aux photos
   (30 jours) : c'est le suivi des clients. On les supprime à la main, dans le
   tableau, ou sur demande du resto.

   CE QUE ÇA N'EST PAS : la porte unique des leads (src/lib/leads/, Supabase) ni
   le CRM de Xavier (dashboard.restoaction.ca). Le jour où on branche l'un ou
   l'autre, STUDIO.crmBranche passe à vrai et ces fiches s'y versent.

   On le lit dans /tableau/leads, derrière le mot de passe du tableau de bord.
   Serveur seulement. */

const DOSSIER = "crm/leads/";
const chemin = (cle: string) => `${DOSSIER}${cle}.json`;
const CLE_VALIDE = /^[a-f0-9]{32}$/;

export const carnetPret = stockagePret;

export async function lireLead(cle: string): Promise<LeadMini | null> {
  if (!CLE_VALIDE.test(cle)) return null;
  const brut = await lire(chemin(cle), true);
  if (!brut) return null;
  try {
    return JSON.parse(brut.toString("utf8")) as LeadMini;
  } catch {
    return null;
  }
}

async function ecrireLead(lead: LeadMini): Promise<void> {
  await ecrire(chemin(lead.cle), JSON.stringify(lead), "application/json", { garde: false });
}

/** Un formulaire envoyé : la fiche est créée, ou complétée si le resto est déjà venu. LÈVE si le magasin ne répond pas. */
export async function noterArrivee(a: Arrivee): Promise<LeadMini> {
  const lead = fusionner(await lireLead(a.cle), a, new Date().toISOString());
  await ecrireLead(lead);
  return lead;
}

/** Une photo de plus pour un resto déjà connu (« Fais-en 4 autres »). Ne lève jamais. */
export async function ajouterPhoto(cle: string, photo: string): Promise<void> {
  try {
    const lead = await lireLead(cle);
    if (!lead || lead.photos.includes(photo)) return;
    const maintenant = new Date().toISOString();
    await ecrireLead({
      ...lead,
      majLe: maintenant,
      photos: [photo, ...lead.photos],
      journal: [{ quand: maintenant, quoi: "Autre photo envoyée au Studio" }, ...lead.journal].slice(0, 50),
    });
  } catch (erreur) {
    console.error("[mini-crm] photo non ajoutée :", erreur instanceof Error ? erreur.name : "erreur inconnue");
  }
}

/** Le suivi fait dans le tableau. Vrai si la fiche existe et a été écrite. */
export async function mettreAJour(cle: string, statut: unknown, note: unknown): Promise<boolean> {
  const lead = await lireLead(cle);
  if (!lead || !statutValide(statut)) return false;
  const suivi = suivre(lead, statut as Statut, typeof note === "string" ? note : lead.note, new Date().toISOString());
  if (suivi !== lead) await ecrireLead(suivi);
  return true;
}

export async function supprimerLead(cle: string): Promise<void> {
  if (CLE_VALIDE.test(cle)) await supprimer(chemin(cle));
}

export async function tousLesLeads(): Promise<LeadMini[]> {
  const cles = (await lister(DOSSIER)).map((c) => c.slice(DOSSIER.length).replace(/\.json$/, ""));
  const leads = await Promise.all(cles.map(lireLead));
  return trier(leads.filter((l): l is LeadMini => l !== null));
}
