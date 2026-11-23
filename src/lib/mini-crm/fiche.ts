/* LE MINI CRM : la fiche d'un contact, et les calculs purs autour.

   Aucun import du site ici : ce fichier est testé tel quel par
   `node --test` (src/lib/mini-crm.test.ts). La lecture et l'écriture sont dans
   ./carnet.ts (serveur seulement). */

export const STATUTS = ["nouveau", "contacte", "rendez-vous", "client", "pas-interesse"] as const;
export type Statut = (typeof STATUTS)[number];

export const LIBELLES_STATUT: Record<Statut, string> = {
  nouveau: "Nouveau",
  contacte: "Contacté",
  "rendez-vous": "Rendez-vous pris",
  client: "Client",
  "pas-interesse": "Pas intéressé",
};

/** D'où vient le contact : le premier formulaire qu'il a envoyé. Les autres formulaires s'ajoutent ici. */
export type SourceMini = "studio" | "classement" | "calcul-60";

/** « Ton rang sur Google », tel que le proprio l'a vu le jour de sa demande.
    Le rang et le total sont notre calcul. NI NOMBRE D'AVIS NI NOTE : ce sont
    les données de Google, et ses règles ne permettent de garder que
    l'identifiant de lieu. */
export type ClassementMini = {
  quand: string;
  /** « pizzerias », « casse-croûtes »… */
  type: string;
  rang: number | null;
  total: number | null;
  /** Sa réponse à « Clique sur Commander en ligne. Tu tombes où? », en clair. */
  testBouton: string;
  placeId: string;
};

/** « Le Calcul 60 secondes » : ses 3 chiffres, la réponse (recalculée par le
    serveur) et le lien de sa page de dossier, celui que Guillaume lui texte. */
export type CalculMini = {
  quand: string;
  /** Commandes par semaine sur les plateformes. */
  commandes: number;
  /** Commande moyenne, en dollars. */
  panier: number;
  /** 0.2, 0.25 ou 0.3. */
  taux: number;
  parSemaine: number;
  parAnnee: number;
  lienDossier: string;
};

export type LeadMini = {
  /** L'empreinte du cellulaire : un resto, une fiche, peu importe combien de photos. */
  cle: string;
  creeLe: string;
  majLe: string;
  source: SourceMini;
  prenom: string;
  /** « (819) 555-0100 » */
  cellulaire: string;
  resto: string;
  ville: string;
  statut: Statut;
  note: string;
  /** Les 2 réponses facultatives de l'attente. */
  plateformes: string;
  commandes: string;
  /** La case obligatoire : son texte exact et le moment où elle a été cochée. */
  consentement: { texte: string; horodatage: string };
  /** Les photos retouchées au Studio (identifiants des fiches), la plus récente d'abord. */
  photos: string[];
  /** Celles dont le resto a permis l'usage comme exemple (2e case). */
  photosExemple: string[];
  /** Son dernier classement, s'il a rempli « Ton rang sur Google ». */
  classement?: ClassementMini;
  /** Son dernier calcul, s'il a demandé son dossier au Calcul 60 secondes. */
  calcul?: CalculMini;
  /** Ce qui s'est passé, le plus récent d'abord. */
  journal: { quand: string; quoi: string }[];
};

/** Ce qu'un formulaire envoyé apporte. */
export type Arrivee = {
  cle: string;
  source: SourceMini;
  prenom: string;
  cellulaire: string;
  resto: string;
  ville: string;
  plateformes: string;
  commandes: string;
  consentementTexte: string;
  /** Le Studio : la photo retouchée, et si elle peut servir d'exemple. */
  photo?: string;
  exemple?: boolean;
  /** Ton rang sur Google : ce qu'il a vu. */
  classement?: Omit<ClassementMini, "quand">;
  /** Le Calcul 60 secondes : ses chiffres et le lien de son dossier. */
  calcul?: Omit<CalculMini, "quand">;
  /** Une ligne pour le journal, ex. « Photo retouchée par IA ». */
  quoi: string;
};

const JOURNAL_MAX = 50;

/* UN CONTACT QUI REVIENT NE REPART PAS À ZÉRO : le statut, la note et la date
   de création restent. Le reste est mis à jour, et la photo s'ajoute. Une
   réponse vide ne remplace pas une réponse déjà donnée. */
export function fusionner(existant: LeadMini | null, a: Arrivee, maintenant: string): LeadMini {
  const sansDouble = (liste: string[], id: string) => [id, ...liste.filter((x) => x !== id)];
  // Un formulaire sans photo (le classement) ne touche pas aux photos, et l'inverse.
  const photos = existant?.photos ?? [];
  const photosExemple = existant?.photosExemple ?? [];
  const classement = a.classement ? { ...a.classement, quand: maintenant } : existant?.classement;
  const calcul = a.calcul ? { ...a.calcul, quand: maintenant } : existant?.calcul;
  return {
    cle: a.cle,
    creeLe: existant?.creeLe ?? maintenant,
    majLe: maintenant,
    source: existant?.source ?? a.source,
    prenom: a.prenom || existant?.prenom || "",
    cellulaire: a.cellulaire,
    resto: a.resto || existant?.resto || "",
    ville: a.ville || existant?.ville || "",
    statut: existant?.statut ?? "nouveau",
    note: existant?.note ?? "",
    plateformes: a.plateformes || existant?.plateformes || "",
    commandes: a.commandes || existant?.commandes || "",
    consentement: existant?.consentement ?? { texte: a.consentementTexte, horodatage: maintenant },
    photos: a.photo ? sansDouble(photos, a.photo) : photos,
    photosExemple: a.photo && a.exemple ? sansDouble(photosExemple, a.photo) : photosExemple,
    ...(classement ? { classement } : {}),
    ...(calcul ? { calcul } : {}),
    journal: [{ quand: maintenant, quoi: a.quoi }, ...(existant?.journal ?? [])].slice(0, JOURNAL_MAX),
  };
}

/** Le suivi fait à la main dans le tableau : le statut et la note. */
export function suivre(lead: LeadMini, statut: Statut, note: string, maintenant: string): LeadMini {
  const propre = note.trim().slice(0, 2000);
  const lignes: string[] = [];
  if (statut !== lead.statut) lignes.push(`Statut : ${LIBELLES_STATUT[lead.statut]} → ${LIBELLES_STATUT[statut]}`);
  if (propre !== lead.note) lignes.push("Note modifiée");
  if (lignes.length === 0) return lead;
  return {
    ...lead,
    statut,
    note: propre,
    majLe: maintenant,
    journal: [...lignes.map((quoi) => ({ quand: maintenant, quoi })), ...lead.journal].slice(0, JOURNAL_MAX),
  };
}

export function statutValide(v: unknown): v is Statut {
  return typeof v === "string" && (STATUTS as readonly string[]).includes(v);
}

/** Les plus récemment touchés d'abord, les « pas intéressé » à la fin. */
export function trier(leads: LeadMini[]): LeadMini[] {
  const fin = (l: LeadMini) => (l.statut === "pas-interesse" ? 1 : 0);
  return [...leads].sort((a, b) => fin(a) - fin(b) || b.majLe.localeCompare(a.majLe));
}

/** Remplit {prenom}, {resto} et {ville} dans le texto proposé, et les variables de `plus` (ex. {rang}, {total}, {type}, {lien}). */
export function remplir(gabarit: string, lead: Pick<LeadMini, "prenom" | "resto" | "ville">, plus: Record<string, string> = {}): string {
  let texte = gabarit.replaceAll("{prenom}", lead.prenom).replaceAll("{resto}", lead.resto).replaceAll("{ville}", lead.ville);
  for (const [nom, valeur] of Object.entries(plus)) texte = texte.replaceAll(`{${nom}}`, valeur);
  return texte.trim();
}
