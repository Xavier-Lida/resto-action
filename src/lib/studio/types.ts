import type { RaisonRefus } from "@/lib/contenu/studio";
import type { Boite, Verdict } from "@/lib/studio/cadrage";

/* LE STUDIO PHOTO : la fiche d'une retouche.

   Un petit fichier JSON par photo, dans le magasin privé (studio/fiches/).
   C'est à la fois l'état que la page interroge pendant l'attente et la ligne
   que montre /studio/suivi. Elle s'efface avec les photos, après la durée de
   garde. Le cellulaire n'y est JAMAIS écrit en clair : seulement son empreinte
   (`cellHache`), pour compter les 5 photos par resto. Le contact, lui, vit dans
   le mini CRM (src/lib/mini-crm/, /tableau/leads), sous la même empreinte. */

export type Etape = "reception" | "controle" | "retouche" | "verification" | "formats";

/** Ce que répond le premier contrôle. */
export type Controle1 = {
  est_plat: boolean;
  visage: boolean;
  qualite: "bonne" | "floue" | "sombre";
  motif: string;
  boite: Boite;
  aliments: string[];
  publication: string;
};

/** Pourquoi on a livré la correction sans génération. */
export type RaisonRepli = "controle" | "panne" | "plafond";

export type Fiche = {
  id: string;
  /** Empreinte du jeton que seul le navigateur du visiteur connaît. */
  jetonHache: string;
  creeLe: string;
  resto: string;
  ville: string;
  ipHache: string;
  /** Le chemin du fichier téléversé (effacé dès que l'originale est rangée). */
  televersement: string;
  etat: "en-cours" | "pret" | "refusee" | "erreur";
  etape: Etape;
  refus?: RaisonRefus;
  /** L'explication du contrôle, pour l'équipe seulement. */
  motif?: string;
  moteur?: "ia" | "correction";
  repli?: RaisonRepli;
  /** Le verdict du deuxième contrôle à chaque essai (2 au plus). */
  verdicts: Verdict[];
  essais: number;
  publication?: string;
  dureeMs?: number;
  coutUsd?: number;
  /** Rempli quand le formulaire est envoyé : c'est ce qui ouvre les 2 formats. */
  contact?: {
    prenom: string;
    cellHache: string;
    exemple: boolean;
    envoyeLe: string;
  };
};

export const CHEMINS = {
  televersements: "studio/televersements/",
  fiche: (id: string) => `studio/fiches/${id}.json`,
  fiches: "studio/fiches/",
  photo: (id: string, vue: Vue) => `studio/photos/${id}/${vue}.jpg`,
  exemple: (id: string, vue: "avant" | "apres") => `studio/exemples/${id}/${vue}.jpg`,
  noteExemple: (id: string) => `studio/exemples/${id}/note.json`,
  depenses: (jour: string) => `studio/depenses/${jour}/`,
  visiteur: (jour: string, ipHache: string) => `studio/visiteurs/${jour}/${ipHache}/`,
  cellulaire: (cellHache: string) => `studio/cellulaires/${cellHache}/`,
};

/** Les images gardées pour une retouche. `avant` et `apres` sont les aperçus réduits. */
export const VUES = ["originale", "avant", "apres", "carre", "vertical"] as const;
export type Vue = (typeof VUES)[number];

export const ID_VALIDE = /^\d{8}-\d{6}-[a-f0-9]{10}$/;
export const JETON_VALIDE = /^[a-f0-9]{48}$/;
