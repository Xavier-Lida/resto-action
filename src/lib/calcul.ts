/**
 * Le calculateur « Ton relevé, ton estimation ».
 * Fonctions pures, sans React. Tout est ramené sur 30 jours.
 * Testé dans calcul.test.ts avec les 3 cas du prompt.
 */
import { ABONNEMENT, FRAIS } from "./contenu/grand-lancement.ts";

export type Plateforme = "doordash" | "ubereats" | "skip" | "autre";

export const PLATEFORMES: { id: Plateforme; nom: string }[] = [
  { id: "doordash", nom: "DoorDash" },
  { id: "ubereats", nom: "Uber Eats" },
  { id: "skip", nom: "Skip" },
  { id: "autre", nom: "Autre" },
];

/** Les chiffres d'un relevé, sur sa période. */
export type Releve = {
  plateforme: Plateforme;
  /** Durée couverte par le relevé, en jours. */
  periodeJours: number;
  nbLivraison: number;
  nbCueillette: number;
  /** Ventes d'aliments et boissons sur la période. */
  ventes: number;
  /** Commissions prises par la plateforme sur la période. */
  commissions: number;
  /** Autres frais pris par la plateforme sur la période. */
  autresFrais: number;
};

export type Hypotheses = {
  /** Part des clients qui passent à l'app : 0,25 à 0,75. */
  partApp: number;
  /** Prix +10 % sur ce qui reste sur la plateforme, si l'entente le permet. */
  prixAjustes: boolean;
  /** Scénario de nouvelles commandes par mois (20, 40, 60) ou aucun. */
  nouvellesCommandes: number | null;
  /** Coût des aliments, 0,30 par défaut. */
  aliments: number;
  /** Sur Uber Eats, taux de cueillette avant ajustement (10 %). */
  tauxCueilletteUber: number;
};

export const HYPOTHESES_DEFAUT: Hypotheses = {
  partApp: 0.5,
  prixAjustes: false,
  nouvellesCommandes: null,
  aliments: 0.3,
  tauxCueilletteUber: 0.1,
};

export const HAUSSE_PRIX = 0.1;
export const TAUX_CUEILLETTE_UBER_AJUSTE = 0.15;

export type Resultat = {
  panier: number;
  /** Chiffres ramenés sur 30 jours. */
  mois: {
    ventes: number;
    ventesLivraison: number;
    ventesCueillette: number;
    nbLivraison: number;
    nbCueillette: number;
    prisParPlateforme: number;
    coutChezNous: number;
  };
  tauxEffectif: number;
  /** Ce que la plateforme prend moins ce que ça coûterait chez nous, toutes commandes. */
  economieBrute: number;
  economieParCommande: number;
  economieNegative: boolean;
  recupere: number;
  ajustes: number;
  profitParNouvelleCommande: number;
  nouvelles: number;
  abonnement: number;
  total: number;
  /** Commandes de nouveaux clients par mois pour payer l'abonnement. */
  seuil: number;
};

const arrondi2 = (n: number) => Math.round(n * 100) / 100;

export function coutChezNous(ventesLiv: number, nbLiv: number, ventesCue: number, nbCue: number) {
  return (
    FRAIS.livraisonPct * ventesLiv +
    FRAIS.livraisonFixe * nbLiv +
    FRAIS.cueillettePct * ventesCue +
    FRAIS.cueilletteFixe * nbCue
  );
}

export function profitNouvelleCommande(panier: number, aliments: number): number {
  return panier * (1 - aliments) - (FRAIS.livraisonPct * panier + FRAIS.livraisonFixe);
}

export function calculer(releve: Releve, h: Hypotheses = HYPOTHESES_DEFAUT): Resultat {
  const jours = releve.periodeJours > 0 ? releve.periodeJours : 30;
  const f = 30 / jours;
  const nbTotal = releve.nbLivraison + releve.nbCueillette;
  const panier = nbTotal > 0 ? releve.ventes / nbTotal : 0;
  const partLiv = nbTotal > 0 ? releve.nbLivraison / nbTotal : 1;

  const ventes = releve.ventes * f;
  const nbLivraison = releve.nbLivraison * f;
  const nbCueillette = releve.nbCueillette * f;
  const ventesLivraison = ventes * partLiv;
  const ventesCueillette = ventes - ventesLivraison;
  const prisParPlateforme = (releve.commissions + releve.autresFrais) * f;
  const cout = coutChezNous(ventesLivraison, nbLivraison, ventesCueillette, nbCueillette);

  const tauxEffectif = releve.ventes > 0 ? releve.commissions / releve.ventes : 0;
  const economieBrute = prisParPlateforme - cout;
  const nbMois = nbLivraison + nbCueillette;
  const economieParCommande = nbMois > 0 ? economieBrute / nbMois : 0;

  const partApp = Math.min(0.75, Math.max(0.25, h.partApp));
  const recupere = economieBrute * partApp;

  // Prix ajustés sur ce qui reste sur la plateforme, à volume égal,
  // après la commission de la plateforme.
  let ajustes = 0;
  if (h.prixAjustes) {
    const resteLiv = ventesLivraison * (1 - partApp);
    const resteCue = ventesCueillette * (1 - partApp);
    const tauxLiv = tauxEffectif;
    const uber = releve.plateforme === "ubereats";
    const tauxCue = uber ? h.tauxCueilletteUber : tauxEffectif;
    // Sur Uber Eats, la commission de cueillette passe de 10 à 15 %.
    const tauxCueAjuste = uber ? TAUX_CUEILLETTE_UBER_AJUSTE : tauxCue;
    ajustes =
      HAUSSE_PRIX * resteLiv * (1 - tauxLiv) +
      ((1 + HAUSSE_PRIX) * resteCue * (1 - tauxCueAjuste) - resteCue * (1 - tauxCue));
  }

  const profit = profitNouvelleCommande(panier, h.aliments);
  const nouvelles = h.nouvellesCommandes ? h.nouvellesCommandes * profit : 0;
  const seuil = profit > 0 ? Math.ceil(ABONNEMENT / profit) : Infinity;

  const total = recupere + ajustes + nouvelles - ABONNEMENT;

  return {
    panier: arrondi2(panier),
    mois: {
      ventes: arrondi2(ventes),
      ventesLivraison: arrondi2(ventesLivraison),
      ventesCueillette: arrondi2(ventesCueillette),
      nbLivraison: Math.round(nbLivraison),
      nbCueillette: Math.round(nbCueillette),
      prisParPlateforme: arrondi2(prisParPlateforme),
      coutChezNous: arrondi2(cout),
    },
    tauxEffectif,
    economieBrute: arrondi2(economieBrute),
    economieParCommande: arrondi2(economieParCommande),
    economieNegative: economieBrute < 0,
    recupere: arrondi2(recupere),
    ajustes: arrondi2(ajustes),
    profitParNouvelleCommande: arrondi2(profit),
    nouvelles: arrondi2(nouvelles),
    abonnement: ABONNEMENT,
    total: arrondi2(total),
    seuil,
  };
}

/** Formulaire manuel : ventes, nombre de commandes, part en livraison, taux. */
export function releveManuel(args: {
  plateforme: Plateforme;
  ventes: number;
  nbCommandes: number;
  partLivraison: number;
  taux: number;
}): Releve {
  const nbLiv = args.nbCommandes * args.partLivraison;
  return {
    plateforme: args.plateforme,
    periodeJours: 30,
    nbLivraison: nbLiv,
    nbCueillette: args.nbCommandes - nbLiv,
    ventes: args.ventes,
    commissions: args.ventes * args.taux,
    autresFrais: 0,
  };
}

/** Ce que renvoie la lecture par l'IA (voir /api/releve). */
export type Extraction = {
  lisible: boolean;
  plateforme?: string | null;
  periode_jours?: number | null;
  nb_livraison?: number | null;
  nb_cueillette?: number | null;
  ventes?: number | null;
  commissions?: number | null;
  autres_frais?: number | null;
  taux_commission?: number | null;
};

const PLATEFORME_IDS: Plateforme[] = ["doordash", "ubereats", "skip", "autre"];

/**
 * Transforme l'extraction en relevé. Renvoie null si le relevé est illisible
 * ou s'il manque les chiffres essentiels : le formulaire manuel s'ouvre alors.
 */
export function releveDepuisExtraction(e: Extraction | null | undefined): Releve | null {
  if (!e || !e.lisible) return null;
  const ventes = Number(e.ventes);
  const nbLiv = Number(e.nb_livraison ?? 0);
  const nbCue = Number(e.nb_cueillette ?? 0);
  if (!Number.isFinite(ventes) || ventes <= 0) return null;
  if (!Number.isFinite(nbLiv + nbCue) || nbLiv + nbCue <= 0) return null;
  let commissions = Number(e.commissions);
  if (!Number.isFinite(commissions) || commissions < 0) {
    const taux = Number(e.taux_commission);
    if (!Number.isFinite(taux) || taux <= 0) return null;
    commissions = ventes * (taux > 1 ? taux / 100 : taux);
  }
  const plateforme = PLATEFORME_IDS.includes(e.plateforme as Plateforme)
    ? (e.plateforme as Plateforme)
    : "autre";
  const jours = Number(e.periode_jours);
  return {
    plateforme,
    periodeJours: Number.isFinite(jours) && jours > 0 ? jours : 30,
    nbLivraison: Math.max(0, Math.round(nbLiv)),
    nbCueillette: Math.max(0, Math.round(nbCue)),
    ventes,
    commissions,
    autresFrais: Math.max(0, Number(e.autres_frais) || 0),
  };
}

// ───────────── Dossier : encodage dans l'adresse ─────────────

export type Dossier = {
  releve: Releve;
  hypotheses: Hypotheses;
  prenom?: string;
  resto?: string;
  ville?: string;
};

export function encoderDossier(d: Dossier): string {
  const json = JSON.stringify(d);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decoderDossier(s: string | undefined): Dossier | null {
  if (!s) return null;
  try {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const d = JSON.parse(new TextDecoder().decode(bytes)) as Dossier;
    if (!d?.releve || !d?.hypotheses) return null;
    return d;
  } catch {
    return null;
  }
}
