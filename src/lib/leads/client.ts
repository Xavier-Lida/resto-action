import { useState, useSyncExternalStore } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { track } from "@vercel/analytics";
import type { SourceLead } from "./lead";

/* CE QUE LES FORMULAIRES FONT DANS LE NAVIGATEUR, POUR LA PORTE DES LEADS.

   1. L'IDENTIFIANT D'UN LEAD. Créé ici, une fois par formulaire, et renvoyé
      tel quel si le visiteur clique deux fois ou réessaie : le serveur
      reconnaît le doublon (src/lib/leads/envoi.ts).

   2. LE PRÉREMPLISSAGE. Quand un visiteur a rempli un formulaire, les autres
      lui reviennent préremplis (prénom, resto, ville, cellulaire). C'EST GARDÉ
      SUR SON APPAREIL SEULEMENT (`localStorage`), 30 jours, jamais envoyé à
      part, et il peut tout changer. L'identifiant Google du resto y est aussi :
      le Calcul, le Classement et le Studio envoient ainsi le même, et le CRM
      peut mettre les 3 sur la même fiche. La politique de confidentialité doit
      le dire (phrase proposée à Guillaume).

   3. LA MESURE. Un événement « lead » par envoi réussi, avec la source, dans
      les 2 outils du site : Vercel Analytics (sans témoins) et Google
      Analytics 4 (seulement si le visiteur a accepté les témoins). Le pixel
      Meta reçoit « Lead » s'il est installé (il ne l'est pas aujourd'hui).
      AUCUNE DONNÉE PERSONNELLE : la source, et rien d'autre.

   Rien ici ne lève : un stockage refusé ou une mesure bloquée ne doit jamais
   empêcher un formulaire de partir. */

// ─── 1. L'identifiant ───

export function nouvelIdLead(): string {
  try {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  } catch {
    // Vieux navigateur ou page non sécurisée : on le fabrique à la main.
  }
  const o = new Uint8Array(16);
  try {
    crypto.getRandomValues(o);
  } catch {
    for (let i = 0; i < 16; i++) o[i] = Math.floor(Math.random() * 256);
  }
  o[6] = (o[6] & 0x0f) | 0x40;
  o[8] = (o[8] & 0x3f) | 0x80;
  const h = Array.from(o, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// ─── 2. Le préremplissage ───

export const CLE_CONTACT = "ra-contact";
export const CONTACT_JOURS = 30;

export type ContactGarde = {
  prenom?: string;
  resto?: string;
  ville?: string;
  cellulaire?: string;
  /** L'identifiant Google du resto, et le nom pour lequel il vaut. */
  lieu?: { id: string; resto: string };
  /** Quand c'est gardé, en millisecondes. */
  le: number;
};

const court = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined);

function analyser(brut: string | null): ContactGarde | null {
  if (!brut) return null;
  try {
    const d = JSON.parse(brut) as Record<string, unknown>;
    const le = typeof d.le === "number" ? d.le : 0;
    if (Date.now() - le > CONTACT_JOURS * 86_400_000) return null;
    const lieu = d.lieu as Record<string, unknown> | undefined;
    const id = court(lieu?.id, 300);
    const restoLieu = court(lieu?.resto, 160);
    return {
      prenom: court(d.prenom, 120),
      resto: court(d.resto, 160),
      ville: court(d.ville, 80),
      cellulaire: court(d.cellulaire, 40),
      lieu: id && restoLieu ? { id, resto: restoLieu } : undefined,
      le,
    };
  } catch {
    return null;
  }
}

// `useSyncExternalStore` exige la MÊME valeur tant que rien n'a changé.
let dernierBrut: string | null | undefined;
let derniereValeur: ContactGarde | null = null;
const abonnes = new Set<() => void>();

function lire(): ContactGarde | null {
  let brut: string | null = null;
  try {
    brut = window.localStorage.getItem(CLE_CONTACT);
  } catch {
    // Navigation privée : pas de préremplissage, le formulaire marche pareil.
  }
  if (brut !== dernierBrut) {
    dernierBrut = brut;
    derniereValeur = analyser(brut);
  }
  return derniereValeur;
}

function abonner(prevenir: () => void): () => void {
  abonnes.add(prevenir);
  window.addEventListener("storage", prevenir);
  return () => {
    abonnes.delete(prevenir);
    window.removeEventListener("storage", prevenir);
  };
}

/** Ce que le visiteur a déjà rempli sur cet appareil, ou `null`. Toujours `null` au rendu du serveur. */
export function useContactGarde(): ContactGarde | null {
  return useSyncExternalStore(abonner, lire, () => null);
}

/* Préremplit un formulaire : `appliquer` est appelé une fois quand ce qui est
   gardé arrive (après l'hydratation), puis chaque fois que ça change (un autre
   formulaire de la page vient d'être envoyé). C'est au formulaire de ne
   remplir que ses champs encore vides : `setX((v) => v || garde.x || "")`.

   L'état est ajusté pendant le rendu, comme React le recommande pour un état
   qui suit une autre valeur, plutôt que dans un effet. */
export function usePreremplir(appliquer: (garde: ContactGarde) => void): ContactGarde | null {
  const garde = useContactGarde();
  const [vu, setVu] = useState<ContactGarde | null>(null);
  if (garde && garde !== vu) {
    setVu(garde);
    appliquer(garde);
  }
  return garde;
}

const pareil = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** L'identifiant Google gardé, seulement s'il vaut encore pour ce nom de resto. */
export function lieuGarde(garde: ContactGarde | null, resto: string): string | undefined {
  return garde?.lieu && resto.trim() && pareil(garde.lieu.resto, resto) ? garde.lieu.id : undefined;
}

/** À appeler après un envoi réussi. Les champs vides ne remplacent rien. */
export function garderContact(c: { prenom?: string; resto?: string; ville?: string; cellulaire?: string; lieu?: { id: string; resto: string } }): void {
  try {
    const avant = analyser(window.localStorage.getItem(CLE_CONTACT));
    const resto = court(c.resto, 160) ?? avant?.resto;
    // L'identifiant Google ne suit pas un autre nom de resto.
    const lieuAvant = avant?.lieu && resto && pareil(avant.lieu.resto, resto) ? avant.lieu : undefined;
    const suivant: ContactGarde = {
      prenom: court(c.prenom, 120) ?? avant?.prenom,
      resto,
      ville: court(c.ville, 80) ?? avant?.ville,
      cellulaire: court(c.cellulaire, 40) ?? avant?.cellulaire,
      lieu: c.lieu?.id && c.lieu.resto.trim() ? { id: c.lieu.id, resto: c.lieu.resto.trim() } : lieuAvant,
      le: Date.now(),
    };
    window.localStorage.setItem(CLE_CONTACT, JSON.stringify(suivant));
    for (const prevenir of abonnes) prevenir();
  } catch {
    // Stockage refusé : rien n'est gardé, et c'est tout.
  }
}

// ─── 3. La mesure ───

type Fbq = (commande: "track", nom: "Lead", proprietes?: Record<string, string>) => void;

function versLesOutils(nom: string, proprietes: Record<string, string>): void {
  if (typeof window === "undefined") return;
  try {
    track(nom, proprietes);
  } catch {
    // Vercel Analytics bloqué : on continue.
  }
  try {
    // Sans accord pour les témoins, gtag.js n'est pas dans la page : on n'appelle rien.
    if (Array.isArray((window as unknown as { dataLayer?: unknown }).dataLayer)) sendGAEvent("event", nom, proprietes);
  } catch {
    // Google Analytics bloqué : on continue.
  }
}

/** Un envoi réussi : l'événement « lead », avec la source et rien d'autre. */
export function mesurerLead(source: SourceLead): void {
  versLesOutils("lead", { source });
  try {
    const fbq = (window as unknown as { fbq?: Fbq }).fbq;
    if (typeof fbq === "function") fbq("track", "Lead", { content_category: source });
  } catch {
    // Pixel Meta bloqué ou absent : on continue.
  }
}

/** Pas un lead, mais une main levée : le clic sur « Parle 15 minutes avec Guillaume ». `ou` : l'endroit du bouton. */
export function mesurerMainLevee(geste: "appel-15-min", ou: string): void {
  versLesOutils("main_levee", { geste, ou });
}
