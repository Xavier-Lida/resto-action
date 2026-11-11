/**
 * Le contenu du Grand Lancement d'hiver (page d'accueil française).
 *
 * Tout ce qui est variable vit ici : noms, dates, prix, valeurs, pièces et
 * bonus disponibles, garanties, FAQ. Les composants lisent ce fichier et ne
 * contiennent aucun chiffre ni texte de vente.
 *
 * Règles (voir le prompt du Grand Lancement) :
 *  - Une pièce ou un bonus avec `disponible: false` ne s'affiche nulle part.
 *    Les phrases qui en dépendent (`dependDe`) se cachent avec.
 *  - Une valeur en dollars s'affiche seulement si `soumissions === 2`.
 *  - Le total de la pile s'affiche seulement si chaque pièce et chaque bonus
 *    affichés ont une valeur affichable.
 *  - Une date de fin du 750 $ s'affiche seulement si DATE_FIN_750 est remplie.
 *  - Les liens vides retombent sur l'appel téléphonique.
 */

// ───────────────────────── Variables ─────────────────────────

export const NOM_OFFRE = "Le Grand Lancement d'hiver";
export const NOM_SYSTEME = "Le Système Nouveaux Clients en 7 jours";
export const ACCROCHE = "Cet hiver, ton imprimante va chauffer.";

export const NOM_BLITZ = "Le Blitz 7 jours";

export const NOMS_GARANTIES = {
  chrono: "48 h top chrono",
  imprimante: "L'Imprimante qui chauffe",
  gratuit: "Ça se paie ou c'est gratuit",
  boomerang: "L'Argent boomerang",
} as const;

/** Date provisoire. Guillaume peut l'avancer. Premiers lancements le 1er janvier. */
export const DATE_COHORTE = "janvier 2027";
export const DATE_LIMITE = "vendredi 18 décembre 2026";
/** Vide tant qu'aucune date de fin du 750 $ n'est décidée. */
export const DATE_FIN_750 = "";

export const RESTOS_PAR_MOIS = 16;
export const RESTOS_PAR_SEMAINE = 4;

export const ABONNEMENT = 200;
export const MISE_EN_SERVICE_ACTUELLE = 750;
export const MISE_EN_SERVICE_ENSUITE = 1500;
export const PRIX_GELE_MOIS = 24;
export const CREDIT_SORTIE_MAX = 400;
export const PUB_LANCEMENT = 300;
export const PUB_GARANTIE_SEMAINE = 100;
export const COMMANDES_VISEES_7_JOURS = 10;

/** Nos frais à la commande. Frais de carte inclus. */
export const FRAIS = {
  livraisonPct: 0.1,
  livraisonFixe: 3.51,
  cueillettePct: 0.05,
  cueilletteFixe: 0.3,
  livraisonClient: 4.99,
} as const;

/** Hypothèses des exemples affichés sur la page (toujours marqués « exemple »). */
export const EXEMPLE = {
  panier: 30,
  aliments: 0.3,
  tauxPlateforme: 0.25,
  ventesPlateforme: 5000,
  partApp: 0.6,
  nouvellesCommandes: 40,
  hausse: 0.1,
} as const;

/** Villes de départ. */
export const VILLES = ["Trois-Rivières", "Québec", "Victoriaville"];
export const EQUIPE = "Guillaume et Xavier";
export const VILLE_EQUIPE = "Trois-Rivières";

// ───────────────────────── Liens et contact ─────────────────────────

import { PHONE_HREF } from "../site.ts";

/** Lien de prise de rendez-vous (Google Meet). Vide : le bouton appelle. */
export const LIEN_APPEL = "";
/** Lien de réservation externe, facultatif. Vide : le formulaire /reserver du site. */
export const RESERVATION_URL = "";
/** Vidéo face caméra de Guillaume. Vide : le bloc « vrais chiffres » s'affiche. */
export const VIDEO_GUILLAUME_URL = "";

export const ANCRES = {
  calculateur: "#calculateur",
  prix: "#prix",
  faq: "/faq",
  garanties: "#garanties",
  commentCaMarche: "#comment-ca-marche",
  reserver: "#reserver",
  calculGarantie: "/faq#faq-calcul-garantie",
} as const;

export function lienAppel(): string {
  return LIEN_APPEL || PHONE_HREF;
}

/** La réservation : le formulaire /reserver (gratuit; la mise en service se paie à la signature). */
export function lienReservation(): string {
  return RESERVATION_URL || "/reserver";
}

// ───────────────────────── Types ─────────────────────────

export type Soumissions = 0 | 1 | 2;

export type Piece = {
  id: string;
  nom: string;
  ligne: string;
  /** Valeur en dollars. Affichée seulement si soumissions === 2. */
  valeur: number | null;
  soumissions: Soumissions;
  /** Prête à la date de lancement de la prochaine cohorte. Xavier le remplit. */
  disponible: boolean;
  /** Visuel animé de la carte (voir src/components/visuels). */
  visuel?: Visuel;
};

export type Visuel =
  | "app"
  | "fiche-google"
  | "calendrier"
  | "blitz"
  | "fidelite"
  | "avis"
  | "textos"
  | "livraison"
  | "imprimante";

export type GroupePieces = {
  id: string;
  titre: string;
  pieces: Piece[];
};

export type Bonus = Piece & {
  /** Expire à la date limite. */
  expire: boolean;
};

export type Garantie = {
  id: keyof typeof NOMS_GARANTIES;
  nom: string;
  /** La ligne de l'accueil. Le texte complet (texte) s'ouvre en dessous et fait foi. */
  court: string;
  texte: string;
  dependDe?: string[];
};

export type Dependant = { dependDe?: string[] };

// ───────────────────────── Pièces ─────────────────────────

export const GROUPES: GroupePieces[] = [
  {
    id: "avant",
    titre: "Avant de signer, gratuit",
    pieces: [
      {
        id: "calcul-releve",
        nom: "Le Calcul sur ton relevé",
        ligne:
          "Ton relevé passé à notre calculateur. Tu vois tes vrais frais et ton estimation, frais de carte compris.",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
      {
        id: "apercu-app",
        nom: "L'aperçu de ton app",
        ligne:
          "Ton app avec ton nom et ta fiche Google, avant même de nous parler.",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
      {
        id: "dossier-associe",
        nom: "Le Dossier pour ton associé",
        ligne:
          "Une page avec tes chiffres, pour ton associé ou ton comptable.",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
      {
        id: "preuve-locale",
        nom: "La Preuve locale",
        ligne: "Des proprios d'ici, en vidéo, avec leurs chiffres.",
        valeur: null,
        soumissions: 0,
        // Affichée seulement quand les vidéos existent.
        disponible: false,
      },
    ],
  },
  {
    id: "lancement",
    titre: "Ton lancement",
    pieces: [
      {
        id: "installation",
        visuel: "fiche-google",
        nom: "L'Installation Clé en main",
        ligne:
          "Ton app, ton menu, tes photos et ta fiche Google montés pour toi. Sur place, ton imprimante est branchée en 10 minutes. Tu valides.",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
      {
        id: "menu-qui-vend",
        nom: "Le Menu qui Vend",
        ligne:
          "Ton menu en ligne monté pour faire monter le panier : combos, extras, suggestions d'ajouts.",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
      {
        id: "blitz",
        visuel: "blitz",
        nom: NOM_BLITZ,
        ligne:
          "Affiches, plaques, cartons, publications et 300 $ de pub payés par nous. Ta première commande directe visée en 7 jours.",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
      {
        id: "kit-equipe",
        nom: "Le Kit Équipe 15 minutes",
        ligne:
          "Ton staff formé en 15 minutes, avec une vidéo et un guide au poste.",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
      {
        id: "zero-double-saisie",
        nom: "Zéro Double Saisie",
        ligne:
          "Tes commandes au même endroit, dans ta caisse si elle est compatible, sinon sur ton imprimante de cuisine.",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
    ],
  },
  {
    id: "nouvelles-ventes",
    titre: "Des nouvelles ventes",
    pieces: [
      {
        id: "cartes-cadeaux",
        nom: "Les Cartes-cadeaux",
        ligne:
          "Des cartes-cadeaux vendues sur ton app. L'argent entre d'avance, et ceux qui les reçoivent deviennent tes clients.",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
      {
        id: "parrainage",
        nom: "Le Parrainage",
        ligne:
          "Chaque client a un lien pour inviter un ami. L'ami a un rabais, ton client des points.",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
      {
        id: "clients-fideles",
        visuel: "fidelite",
        nom: "Le Moteur Clients Fidèles",
        ligne:
          "Points, offres et textos qui font revenir tes clients tout seuls (relance après 30 jours, panier abandonné).",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
      {
        id: "avis",
        visuel: "avis",
        nom: "Les Avis qui Rapportent",
        ligne:
          "Après chaque commande, ton app demande un avis Google à ton client. On te propose une réponse pour chaque avis, et tu l'approuves par texto avant qu'elle soit publiée, surtout pour les avis à 1 ou 2 étoiles. Plus d'avis et une réponse à chacun, c'est une fiche Google plus forte, et plus de commandes directes.",
        valeur: null,
        soumissions: 0,
        // Faux tant que Xavier ne l'a pas bâtie : la carte, la FAQ et le Système la cachent.
        disponible: false,
      },
      {
        id: "marketing",
        visuel: "calendrier",
        nom: "Le Marketing Fait pour Toi",
        ligne:
          "Tes réseaux et ta fiche Google actifs, 3 mois programmés d'avance.",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
    ],
  },
  {
    id: "argent-recupere",
    titre: "L'argent récupéré sur les plateformes",
    pieces: [
      {
        id: "cueillette-abord",
        nom: "La Cueillette d'abord",
        ligne:
          "La cueillette mise de l'avant sur ton app, avec points doublés.",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
      {
        id: "reglage-plateformes",
        nom: "Le Réglage Plateformes",
        ligne:
          "On lit tes ententes et on monte tes prix de 10 à 15 % sur les plateformes dès le jour 1, si ton entente le permet. Tu gardes plus sur ce qui y reste. (Sur Uber Eats, des prix plus hauts qu'en salle font passer la cueillette de 10 à 15 % : on le vérifie avec toi.)",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
      {
        id: "livraison-incluse",
        visuel: "livraison",
        nom: "La Livraison Incluse",
        ligne:
          "La livraison à 4,99 $ pour ton client, sans un seul livreur à gérer. Tu paies la course au prix coûtant, et les plaintes, c'est nous.",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
    ],
  },
  {
    id: "clientele",
    titre: "Ta clientèle à toi",
    pieces: [
      {
        id: "app-a-ton-nom",
        visuel: "app",
        nom: "Ton App à ton nom",
        ligne:
          "Ton app web et mobile, commande sans compte, l'argent direct dans ton compte.",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
      {
        id: "clientele-appartient",
        nom: "Ta Clientèle T'appartient",
        ligne: "Ta liste de clients, ton domaine et ta fiche, à ton nom.",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
    ],
  },
  {
    id: "chaque-semaine",
    titre: "Chaque semaine",
    pieces: [
      {
        id: "texto-lundi",
        visuel: "textos",
        nom: "Le Texto du Lundi",
        ligne:
          "Chaque lundi, en un texto, tes commandes directes, tes nouvelles ventes et l'argent rapporté.",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
      {
        id: "departement-en-ligne",
        nom: "Ton Département en ligne",
        ligne:
          "Un seul numéro, en français, pour tout ce qui est en ligne.",
        valeur: null,
        soumissions: 0,
        disponible: true,
      },
    ],
  },
];

/* Prête au lancement? Lit GROUPES directement (INDEX_PIECES est défini plus
   bas). Sert aux phrases qui nomment le parrainage ou les cartes-cadeaux :
   à faux, elles s'écrivent sans eux. */
function pret(id: string): boolean {
  return GROUPES.some((g) => g.pieces.some((p) => p.id === id && p.disponible));
}

/** ["a", "b", "c"] → « a, b et c ». Les valeurs fausses sont sautées. */
function enumerer(items: (string | false)[], dernier = " et "): string {
  const l = items.filter((x): x is string => Boolean(x));
  return l.length <= 1 ? l.join("") : `${l.slice(0, -1).join(", ")}${dernier}${l[l.length - 1]}`;
}

/** Les canaux qui amènent un nouveau client, pour les garanties 3 et 4. */
const CANAUX = enumerer(["pub", pret("parrainage") && "parrainage", pret("cartes-cadeaux") && "carte-cadeau", "fiche Google"], ", ");

// ───────────────────────── Bonus ─────────────────────────

export const BONUS: Bonus[] = [
  {
    id: "equipement",
    visuel: "imprimante",
    nom: "L'Équipement offert",
    ligne:
      "Une imprimante de cuisine qui sort chaque commande toute seule. Pas de tablette : tu suis tout sur ton cell.",
    valeur: 495,
    soumissions: 1,
    disponible: true,
    expire: false,
  },
  {
    id: "boite-lancement",
    nom: "La Boîte de lancement",
    ligne:
      "Plaques, cartons, affiche, carte QR de la vidéo de formation, et ton app sur ton cell.",
    valeur: null,
    soumissions: 0,
    disponible: true,
    expire: false,
  },
  {
    id: "formation-privee",
    nom: "La Formation privée",
    ligne:
      "1 h en tête-à-tête pendant l'installation. Tu apprends à lire tes ventes et ton Texto du Lundi; ton staff, à recevoir les commandes et à parler de l'app.",
    valeur: 150,
    soumissions: 2,
    // Repose sur 2 prix publics : au Canada, Toast facture 1 200 $ pour une
    // journée de 8 h sur place (qui sert aussi à former le staff); aux
    // États-Unis, Toast facture 125 $ US pour une heure de configuration et
    // de formation.
    disponible: true,
    expire: false,
  },
  {
    id: "credit-sortie",
    nom: "Le Crédit de sortie",
    ligne:
      "La pénalité de ton fournisseur actuel, créditée jusqu'à 400 $ sur preuve.",
    valeur: null,
    soumissions: 0,
    disponible: true,
    expire: true,
  },
  {
    id: "prix-gele",
    nom: "Ton Prix gelé",
    ligne: "200 $ par mois, gelé 24 mois.",
    valeur: null,
    soumissions: 0,
    disponible: true,
    expire: true,
  },
];

// ───────────────────────── Garanties ─────────────────────────
// Texte unique, rendu en 3.8, dans la FAQ et dans /conditions-fondateur.

export const GARANTIES: Garantie[] = [
  {
    id: "chrono",
    nom: NOMS_GARANTIES.chrono,
    court: "Pas en ligne à ta date? Ton premier mois est gratuit.",
    texte:
      "Envoie-nous ton menu, tes photos et tes accès dans les 5 jours : ton app est prête en 48 h et tu es en ligne à ta date. Sinon, ton premier mois est gratuit.",
    dependDe: ["installation"],
  },
  {
    id: "imprimante",
    nom: NOMS_GARANTIES.imprimante,
    court: "Moins de 10 commandes en 7 jours? On remet de la pub à nos frais.",
    texte:
      "Si ton app ne reçoit pas 10 commandes dans tes 7 premiers jours, on remet 100 $ de pub chaque semaine, à nos frais, jusqu'à ce que tu les aies.",
    dependDe: ["blitz"],
  },
  {
    id: "gratuit",
    nom: NOMS_GARANTIES.gratuit,
    court: "Ton app ne paie pas son abonnement un mois? Tu ne le paies pas.",
    texte:
      "Ton app paie son abonnement chaque mois, en économies ou en nouvelles ventes. Sinon, tu ne le paies pas.",
    dependDe: ["texto-lundi"],
  },
  {
    id: "boomerang",
    nom: NOMS_GARANTIES.boomerang,
    court: "Pas rapporté ta mise en service en 90 jours? On te la rembourse.",
    texte:
      "Si ton app ne t'a pas rapporté au moins ta mise en service dans tes 90 premiers jours, on te la rembourse. Tu gardes ton imprimante, et tu restes ou tu pars : c'est toi qui décides.",
  },
];

export const GARANTIES_CONDITION =
  "Pour les 4 garanties : tes plaques et ton affiche en place, et nos cartons dans tes sacs. La 1re demande aussi ton menu, tes photos et tes accès dans les 5 jours. Un même mois n'est jamais crédité deux fois.";

export const GARANTIES_DETAILS = "Lire les 4 garanties au complet";

export const GARANTIES_LIEN_CALCUL = "Comment on calcule la 3e et la 4e garantie";

// ───────────────────────── Haut de page ─────────────────────────

export const HERO = {
  surtitre: NOM_OFFRE,
  h1: "Plus de ventes en ligne. Plus d'argent à la fin du mois.",
  /** Le titre qui roule dans le haut de page (le H1 complet reste lisible par Google). */
  /* Seul le mot du milieu roule (11 nov. : « nouveaux clients » sonnait mal,
     « commandes » prend « en ligne », et au cell le titre sautait). */
  titreRoulant: {
    avant: "Plus de",
    mots: ["ventes", "commandes", "clients"],
    apres: "en ligne.",
  },
  /** Version B à tester plus tard. */
  h1VersionB: "On fait monter ton chiffre d'affaires en ligne.",
  sousTitre:
    "Le Système Nouveaux Clients en 7 jours : ton app à ton nom, des nouveaux clients qu'on va chercher pour toi, et moins d'argent laissé aux plateformes.",
  accroche: ACCROCHE,
  sousAccroche:
    "L'hiver, les gens restent chez eux et commandent, alors on te lance avant le gros de la saison.",
  boutonPrincipal: "Calcule ce que tu aurais gardé",
  boutonSecondaire: "Réserve ta place",
  ligneCohorte: `On lance au plus ${RESTOS_PAR_MOIS} restos par mois au Québec. Prochaine cohorte : ${DATE_COHORTE}. Inscriptions jusqu'au ${DATE_LIMITE}.`,
};

// ───────────────────────── Le problème ─────────────────────────

/** Le problème, en une ligne (bloc 2 de l'accueil). */
export const PROBLEME =
  "Les plateformes prennent de 20 à 30 % de chaque livraison, et tes clients restent les leurs.";

// ───────────────────────── Les 3 moteurs ─────────────────────────

export const MOTEURS = {
  titre: "On ne vend pas une app. On t'amène des commandes.",
  liste: [
    {
      id: "nouvelles-ventes",
      titre: "Des nouvelles ventes, le cœur.",
      texte:
        "On va chercher des clients que tu n'as pas aujourd'hui, et on les fait revenir. Une nouvelle commande de 30 $ en livraison te laisse environ 14,50 $ après les aliments et nos frais (exemple avec des aliments à 30 %).",
    },
    {
      id: "argent-recupere",
      titre: "L'argent récupéré sur les plateformes, le bonus.",
      texte:
        "Tu ne lâches pas les plateformes : on y ajuste tes prix, si ton entente le permet. Chaque client qui vient chercher sa commande sur ton app au lieu de se la faire livrer par une plateforme te laisse environ 6 $ de plus (exemple : plateforme à 25 %, commande de 30 $, avant l'ajustement de prix). En livraison, l'économie dépend de ton taux : le calculateur te la montre avec ton relevé.",
    },
    {
      id: "clientele",
      titre: "Une clientèle à toi, l'actif.",
      texte:
        "Les noms, numéros et commandes de tes clients sont à toi, avec ton domaine et ta fiche Google. Si tu pars, tu gardes ta liste de clients, ton domaine et ta fiche.",
    },
  ],
  effort:
    "Ce que tu fais, toi : 10 minutes pour l'installation, une heure de formation et 15 minutes pour ton équipe. Le reste, c'est nous, en français.",
};

// ───────────────────────── Comment ça marche ─────────────────────────

export type Etape = Dependant & { titre: string; texte: string };

export const FRISE: { titre: string; etapes: Etape[] } = {
  titre: "Comment ça marche : de ta réservation à ton premier lundi",
  etapes: [
    {
      titre: "Tu réserves ta place gratuitement, puis tu signes avec nous",
      texte: `mise en service de ${MISE_EN_SERVICE_ACTUELLE} $, imprimante offerte. Pas de dépôt.`,
    },
    {
      titre: "Tu nous envoies ton menu, tes photos et tes accès",
      texte: "5 jours.",
    },
    { titre: "Ton app est prête", texte: "48 h." },
    {
      titre: "Ta date de lancement",
      texte:
        "ton imprimante branchée en 10 minutes, et ta formation privée d'une heure, en personne.",
      dependDe: ["installation"],
    },
    {
      titre: "Tes 7 premiers jours",
      texte:
        "300 $ de pub payés par nous, nos cartons dans tes sacs, et un texto chaque soir avec tes commandes du jour.",
      dependDe: ["blitz"],
    },
    {
      titre: "Chaque lundi",
      texte:
        "un texto avec tes commandes, tes nouvelles ventes et l'argent rapporté. Et un texto à ta 1re, 10e, 50e et 100e commande.",
      dependDe: ["texto-lundi"],
    },
  ],
};

// ─────────────── Tout ce qui est inclus, étape par étape ───────────────
// Remplace la liste de 19 noms (trop compliquée) ET la frise : chaque étape
// du lancement dit ce qui se passe, ce que tu fais, et les pièces que tu
// reçois à ce moment-là. Les pièces sont nommées par leur id (GROUPES ou
// BONUS) : une pièce à `disponible: false` disparaît toute seule.

export type EtapeInclus = {
  quand: string;
  titre: string;
  toi: string;
  pieces: string[];
};

export const ETAPES_INCLUS: { titre: string; sousTitre: string; etapes: EtapeInclus[] } = {
  titre: "Tout ce qui est inclus, étape par étape",
  sousTitre: "{n} pièces, dans le même prix. Voici ce que tu reçois, et quand.",
  etapes: [
    {
      quand: "Avant de signer",
      titre: "Tu vois tes chiffres, gratuitement",
      toi: "Tu téléverses ton relevé de plateforme. C'est tout.",
      pieces: ["calcul-releve", "apercu-app", "dossier-associe"],
    },
    {
      quand: "Tu signes",
      titre: "On monte tout pour toi",
      toi: `Tu réserves gratuitement, tu signes ton bon d'accord (mise en service de ${MISE_EN_SERVICE_ACTUELLE} $) et tu nous envoies ton menu, tes photos et tes accès dans les 5 jours. Ton app est prête en 48 h.`,
      pieces: ["installation", "app-a-ton-nom", "menu-qui-vend", "reglage-plateformes", "marketing"],
    },
    {
      quand: "Ta date de lancement",
      titre: "On vient chez toi",
      toi: "Tu nous donnes une heure pour ta formation privée. Ton équipe, 15 minutes.",
      pieces: ["equipement", "zero-double-saisie", "formation-privee", "kit-equipe", "boite-lancement"],
    },
    {
      quand: "Tes 7 premiers jours",
      titre: "On va chercher tes clients",
      toi: "Tu laisses tes plaques et ton affiche en place, et tu glisses nos cartons dans tes sacs.",
      pieces: ["blitz", "livraison-incluse", "cueillette-abord"],
    },
    {
      quand: "Ensuite, chaque semaine",
      titre: "Ils reviennent, et tu vois ce que ça rapporte",
      toi: "Tu lis ton Texto du Lundi. Le reste roule tout seul.",
      pieces: ["texto-lundi", "clients-fideles", "parrainage", "cartes-cadeaux", "departement-en-ligne", "clientele-appartient"],
    },
  ],
};

/** Où mène chaque pièce, quand elle a sa page. */
export const PAGE_DE_PIECE: Record<string, string> = {
  "calcul-releve": "/#calculateur",
  "app-a-ton-nom": "/plateforme/application-mobile",
  "menu-qui-vend": "/plateforme/menu-qui-vend",
  "reglage-plateformes": "/plateforme/reglage-plateformes",
  marketing: "/plateforme/departement-en-ligne",
  equipement: "/plateforme/imprimante-cuisine",
  "zero-double-saisie": "/plateforme/imprimante-cuisine",
  blitz: "/plateforme/pub-du-lancement",
  "livraison-incluse": "/plateforme/livraison",
  "cueillette-abord": "/plateforme/livraison",
  "texto-lundi": "/plateforme/texto-du-lundi",
  "clients-fideles": "/plateforme/points-recompenses",
  parrainage: "/plateforme/parrainage-cartes-cadeaux",
  "cartes-cadeaux": "/plateforme/parrainage-cartes-cadeaux",
  "departement-en-ligne": "/plateforme/departement-en-ligne",
};

// ───────────────────────── Pile de valeur ─────────────────────────

export const PILE = {
  titre: "Tout ce qui est inclus",
  sousTitre: "{n} pièces, dans le même prix. Touche un nom pour voir le détail.",
  totalLibelle: "Valeur totale",
  prixLigne: `Ton prix : ${ABONNEMENT} $ par mois, plus nos frais à la commande, et une mise en service de ${MISE_EN_SERVICE_ACTUELLE} $`,
  prixLien: "Voir le prix, tout compris",
};

// ───────────────────────── Bonus ─────────────────────────

/** Les bonus, en 3 lignes, sous le prix. */
export const BONUS_COURT: (Dependant & { texte: string; expire: boolean })[] = [
  { texte: "Ton imprimante, ta Boîte de lancement et ta formation privée : offertes.", expire: false },
  { texte: `Le Crédit de sortie : la pénalité de ton fournisseur actuel, créditée jusqu'à ${CREDIT_SORTIE_MAX} $.`, expire: true, dependDe: ["credit-sortie"] },
  { texte: `Ton Prix gelé : ${ABONNEMENT} $ par mois, gelé ${PRIX_GELE_MOIS} mois.`, expire: true, dependDe: ["prix-gele"] },
];

export const BONUS_SECTION = {
  titre: "En plus : 5 bonus",
  etiquetteExpire: `Si tu signes avant le ${DATE_LIMITE}`,
  etiquetteCourte: "Signe avant le 18 déc.",
};

export const GARANTIES_SECTION = {
  titre: "4 garanties sur tes résultats",
};

// ───────────────────────── Comparaison ─────────────────────────

export const COMPARAISON = {
  titre: "On ne se compare pas à une app. On se compare à un résultat.",
  entetes: ["Si tu prends…", "Tu achètes", "Qui le fait marcher", "Tes clients sont à qui"],
  lignes: [
    ["Une plateforme de livraison", "Ses clients, à 20 à 30 % par livraison", "Elle", "À elle"],
    ["Une app ou un module de commande", "Un outil", "Toi", "À toi, si tu vas les chercher"],
    ["Un site web (agence, neveu)", "Une vitrine", "Toi", "À toi, si tu vas les chercher"],
    ["Une agence de pub", "De la visibilité", "Elle, pour la pub", "Là où ils commandent"],
    [
      "Resto Action",
      "Des commandes en plus, ton app et ta clientèle",
      "Nous, en français, sur le terrain",
      "À toi",
    ],
  ],
  sousTableau:
    "Pour avoir la même chose ailleurs, il faudrait quatre fournisseurs : une app, une agence de pub, un service de livraison et quelqu'un sur le terrain.",
  seulCoupTitre: "Ce que tu reçois d'un seul coup chez nous",
  seulCoup: [
    {
      texte: `Quelqu'un va chercher tes clients : ${enumerer(["300 $ de pub payés par nous", "nos cartons dans tes sacs", pret("parrainage") && "le parrainage"], ", ")}.`,
      dependDe: ["blitz"],
    },
    {
      texte:
        "Une app à ton nom, à tes prix de salle, avec la livraison sans livreur à gérer.",
      dependDe: ["app-a-ton-nom", "livraison-incluse"],
    },
    {
      texte: "L'argent récupéré sur tes plateformes dès le jour 1, sans les lâcher.",
      dependDe: ["reglage-plateformes"],
    },
    {
      texte:
        "La preuve chaque lundi : tes nouvelles ventes et l'argent rapporté, en un texto.",
      dependDe: ["texto-lundi"],
    },
    {
      texte:
        "Des humains, en français, ici : l'installation et la formation en personne, un numéro pour tout.",
      dependDe: ["installation", "departement-en-ligne"],
    },
    {
      texte: "Ta clientèle, à toi pour de bon : ta liste, ton domaine, ta fiche Google.",
      dependDe: ["clientele-appartient"],
    },
  ] satisfies (Dependant & { texte: string })[],
  testTitre: "Le test du resto d'en face : 5 questions à poser à n'importe quel fournisseur",
  test: [
    {
      question: "Combien de nouveaux clients tu vas m'amener, et comment?",
      reponse: `10 commandes visées dans tes 7 premiers jours, avec ${enumerer(["300 $ de pub", "nos cartons", pret("parrainage") && "le parrainage"])}; sinon, on remet de la pub à nos frais.`,
      dependDe: ["blitz"],
    },
    {
      question: "Qui paie la pub du lancement?",
      reponse: "nous, 300 $.",
      dependDe: ["blitz"],
    },
    {
      question: "Qui vient m'installer et me former, en personne?",
      reponse: "quelqu'un de notre équipe, avec une heure de formation privée.",
      dependDe: ["installation"],
    },
    {
      question: "Est-ce que je vois chaque semaine ce que ça m'a rapporté?",
      reponse: "oui, avec le Texto du Lundi.",
      dependDe: ["texto-lundi"],
    },
    {
      question: "Si je pars, je garde ma liste de clients, mon domaine et ma fiche?",
      reponse: "oui.",
      dependDe: ["clientele-appartient"],
    },
  ] satisfies (Dependant & { question: string; reponse: string })[],
  reponsePrefixe: "Chez nous :",
};

// ───────────────────────── Prix ─────────────────────────

export const PRIX = {
  titre: "Le prix, tout compris",
  taxes: "taxes en sus",
  lignes: {
    abonnement: `Abonnement : ${ABONNEMENT} $ par mois, dès ta mise en ligne.`,
    miseEnService: `Mise en service : ${MISE_EN_SERVICE_ACTUELLE} $ pour ${NOM_OFFRE}, puis ${MISE_EN_SERVICE_ENSUITE.toLocaleString("fr-CA")} $, une hausse annoncée d'avance. Elle se paie à la signature; pas de dépôt. Si ton app ne te l'a pas rapportée en 90 jours, on te la rembourse (${NOMS_GARANTIES.boomerang}).`,
    miseEnServiceFin: DATE_FIN_750 ? `Le ${MISE_EN_SERVICE_ACTUELLE} $ est offert jusqu'au ${DATE_FIN_750}.` : "",
    livraison:
      "Livraison : 10 % des aliments et boissons + 3,51 $ par livraison aujourd'hui (la course au prix coûtant : ce qu'elle nous coûte, moins les 4,99 $ que paie ton client). Ton client paie 4,99 $ de livraison, rien d'autre.",
    cueillette: "Cueillette : 5 % + 0,30 $ par commande.",
    inclus: "Frais de carte inclus. Aucun minimum de commande. L'imprimante est offerte.",
  },
  sousBouton: "Gratuit. On t'appelle pour fixer ta date.",
  exempleMention: "exemple, pas une promesse",
  exempleHypotheses:
    "resto à 5 000 $ par mois sur une plateforme à 25 %, commandes de 30 $ en livraison, aliments à 30 %, prix ajustés sur la plateforme si son entente le permet.",
  exempleEntetes: ["D'où vient l'argent", "Par mois"],
  exempleLignes: [
    ["40 nouvelles commandes (10 par semaine)", 580],
    ["3 000 $ de commandes qui passent à ton app", 99],
    ["Prix +10 % sur les 2 000 $ qui restent sur la plateforme, à volume égal", 150],
    ["Abonnement", -200],
  ] as [string, number][],
  exempleTotalLibelle: "Tu gardes de plus",
  /** Les mêmes lignes, en court, pour la section Prix de l'accueil. */
  exempleCourt: [
    ["40 nouvelles commandes", 580],
    ["3 000 $ qui passent à ton app", 99],
    ["Prix +10 % sur la plateforme", 150],
    ["Abonnement", -200],
  ] as [string, number][],
  /** 3 000 $ qui passent à l'app + 40 nouvelles commandes de 30 $. */
  exempleVentesApp: 4200,
  exempleHypothesesCourt: "Resto à 5 000 $ par mois sur une plateforme à 25 %, commandes de 30 $.",
  exempleTotal: 629,
};

// ───────────────────────── Rareté ─────────────────────────

export const RARETE = {
  titre: `${RESTOS_PAR_MOIS} restos par mois, pas plus`,
  lignes: [
    `On lance au plus ${RESTOS_PAR_MOIS} restos par mois au Québec, ${RESTOS_PAR_SEMAINE} par semaine : c'est notre limite, pour lancer chaque resto comme il faut.`,
    `Prochaine cohorte : ${DATE_COHORTE}. Pour en faire partie, signe avant le ${DATE_LIMITE} : il faut 2 semaines pour ton menu, tes photos, ton app, l'impression et l'installation. Après, tu pars avec la cohorte suivante, un mois plus tard.`,
  ],
  /** La version courte du bandeau : une ligne. */
  courte: `Signe avant le ${DATE_LIMITE} pour lancer en ${DATE_COHORTE}. Réserver est gratuit.`,
  expirePrefixe: "Après cette date, tu perds",
  signature: `La mise en service de ${MISE_EN_SERVICE_ACTUELLE} $ se paie à la signature. Pas encore prêt? Inscris-toi gratuitement : on te garde au courant.`,
  bouton: "Réserve ta place",
};

// ───────────────────────── Qui on est ─────────────────────────

export const QUI = {
  titre: "Qui on est",
  texte: "Deux cofondateurs d'ici, et une équipe qui parle ta langue.",
  preuveAVenir:
    "Les vrais chiffres de nos premiers restos seront ici, en vidéo, dès qu'ils seront lancés.",
  photoGuillaume: "/guillaume.jpg",
};

// ───────────────────────── FAQ ─────────────────────────

export type QuestionFaq = Dependant & {
  id?: string;
  /** Une des 6 plus grosses peurs, visibles d'entrée. Les autres s'ouvrent sous « Voir toutes les questions ». */
  top?: boolean;
  question: string;
  reponse: string;
};

export const FAQ: { titre: string; questions: QuestionFaq[] } = {
  titre: "Ce que les proprios nous disent",
  questions: [
    {
      top: true,
      question: "Mes clients sont sur les plateformes, ils viendront jamais sur mon app.",
      reponse:
        "On leur donne une raison. Ton menu coûte moins cher chez toi (on ajuste tes prix sur les plateformes, si ton entente le permet), la cueillette est mise de l'avant avec des points doublés, et nos cartons sont glissés dans chaque sac.",
      dependDe: ["reglage-plateformes", "cueillette-abord"],
    },
    {
      question: "Personne va trouver mon app.",
      reponse:
        "On paie 300 $ de pub pour ton lancement, on monte ta fiche Google à l'installation, et on garde tes réseaux actifs.",
      dependDe: ["blitz", "marketing"],
    },
    {
      top: true,
      question: "Ça m'amènera pas de nouveaux clients.",
      reponse: `On va les chercher : ${enumerer(["la pub du lancement", "nos cartons dans tes sacs", "ta fiche Google", pret("parrainage") && "le parrainage", pret("cartes-cadeaux") && "les cartes-cadeaux"])}.`,
      dependDe: ["blitz"],
    },
    {
      question: "Mes clients reviennent pas tout seuls.",
      reponse:
        "Le Moteur Clients Fidèles les fait revenir avec des points, des offres et des textos.",
      dependDe: ["clients-fideles"],
    },
    {
      question: "En ligne, c'est des petits paniers.",
      reponse:
        "Ton menu en ligne est monté pour faire monter le panier (combos, extras, suggestions).",
      dependDe: ["menu-qui-vend"],
    },
    {
      question: "Si je monte mes prix sur les plateformes, je vais perdre des ventes.",
      reponse:
        "Ceux qui trouvent ça cher viennent commander chez toi. S'ils viennent chercher leur commande, tu gardes environ 3 $ de plus qu'avec la plateforme (exemple : plateforme à 25 %, commande de 30 $). On monte tes prix seulement si ton entente le permet.",
      dependDe: ["reglage-plateformes"],
    },
    {
      top: true,
      question: "J'ai pas le temps, et je suis pas techno.",
      reponse:
        "On monte tout pour toi : sur place, ton imprimante est branchée en 10 minutes. On s'occupe de ton marketing, et tu as un seul numéro, en français, pour tout ce qui est en ligne.",
      dependDe: ["installation", "departement-en-ligne"],
    },
    {
      question: "Encore une tablette sur le comptoir.",
      reponse:
        "Pas de tablette. Tes commandes sortent sur une imprimante de cuisine offerte, ou dans ta caisse si elle est compatible, et tu suis tout sur ton cell.",
      dependDe: ["zero-double-saisie"],
    },
    {
      question: "Mon staff va se mélanger.",
      reponse:
        "Ton équipe est formée en 15 minutes, avec une vidéo et un guide au poste. Et toi, tu as une heure de formation privée, en personne.",
      dependDe: ["kit-equipe"],
    },
    {
      question: "La livraison, c'est un casse-tête.",
      reponse:
        "Tu n'as aucun livreur à gérer : on s'occupe de la livraison et des plaintes. Ton client paie 4,99 $, et toi, la course au prix coûtant.",
      dependDe: ["livraison-incluse"],
    },
    {
      question: "Revenu Québec et la Loi 25, je veux pas de trouble.",
      reponse:
        "Notre système est en voie de certification auprès de Revenu Québec, pour des factures conformes. Les consentements de tes clients sont gérés dans l'app.",
    },
    {
      top: true,
      question: "200 $ par mois, c'est une dépense de plus.",
      reponse:
        "Fais le calcul avec ton relevé. Environ 14 commandes de nouveaux clients par mois paient l'abonnement (exemple avec des commandes de 30 $ en livraison et des aliments à 30 %). Sinon, la garantie le rend gratuit.",
    },
    {
      question: "Les frais de carte vont manger l'économie.",
      reponse:
        "Nos frais incluent la carte : 10 % + 3,51 $ par livraison (la course), et 5 % + 0,30 $ en cueillette. Rien d'autre.",
    },
    {
      top: true,
      question: "C'est trop beau pour être vrai.",
      reponse:
        "Calcule-le avec ton propre relevé, et lis nos garanties : si ton app ne se paie pas, tu ne paies pas ton abonnement, et si les commandes tardent, c'est nous qui remettons de la pub.",
    },
    {
      question: "Je vais payer sans jamais savoir si ça marche.",
      reponse:
        "Chaque lundi, un texto te dit tes commandes directes, tes nouvelles ventes et l'argent rapporté. La première semaine, tu en reçois un chaque soir.",
      dependDe: ["texto-lundi"],
    },
    {
      question: "Mon associé (ou mon comptable) va dire non.",
      reponse: "On te prépare une page avec tes chiffres, à lui montrer.",
      dependDe: ["dossier-associe"],
    },
    {
      question: "Si je pars, je perds tout.",
      reponse:
        "Non. Ta liste de clients, ton domaine et ta fiche Google sont à ton nom, et tu les gardes.",
      dependDe: ["clientele-appartient"],
    },
    {
      question: "J'ai déjà un site ou un contrat ailleurs.",
      reponse:
        "On transfère ton menu et tes photos. Si tu signes avant la date limite, on te crédite la pénalité de ton fournisseur actuel, jusqu'à 400 $.",
      dependDe: ["credit-sortie"],
    },
    {
      id: "faq-garanties",
      top: true,
      question: "Et si ça marche pas pour moi?",
      reponse: `Tu as 4 garanties : ${NOMS_GARANTIES.chrono}, ${NOMS_GARANTIES.imprimante}, ${NOMS_GARANTIES.gratuit}, et ${NOMS_GARANTIES.boomerang}.`,
    },
    {
      id: "faq-calcul-garantie",
      question: "Comment vous calculez les garanties 3 et 4?",
      reponse:
        `Chaque mois, on additionne ce que tu as sauvé sur les commandes venues des plateformes (au taux de ton relevé) et 10 $ par commande d'un nouveau client arrivé par un de nos canaux (${CANAUX}). Si le total ne couvre pas ton abonnement, tu ne le paies pas ce mois-là. Pour la 4e : si le total de tes 90 premiers jours ne couvre pas ta mise en service, on te la rembourse.`,
    },
    {
      id: "faq-mise-en-service",
      question: "C'est quoi, la mise en service?",
      reponse: `${MISE_EN_SERVICE_ACTUELLE} $ pour ${NOM_OFFRE}, ensuite ${MISE_EN_SERVICE_ENSUITE.toLocaleString("fr-CA")} $. Elle se paie à la signature et couvre ton installation, ta formation privée et ta Boîte de lancement. Ton imprimante est offerte et t'appartient. Si ton app ne te l'a pas rapportée en 90 jours, on te la rembourse (${NOMS_GARANTIES.boomerang}).`,
    },
    {
      question: "J'ai peur des mauvais avis.",
      reponse:
        "On te propose une réponse pour chaque avis, et rien n'est publié sans ton OK par texto. Un avis à 1 ou 2 étoiles, on te l'envoie tout de suite, avec une réponse calme à approuver.",
      dependDe: ["avis"],
    },
  ],
};

// ───────────────────────── Règle des avis ─────────────────────────
// Affichée partout où les avis apparaissent (carte, FAQ, scène, conditions).

export const REGLE_AVIS =
  "Chaque client reçoit la même demande d'avis, sans points, rabais ni récompense en échange, et sans aucun tri entre les clients. Une réponse publique ne donne jamais de détail sur la commande ou sur le client. Rien n'est publié sans ton OK.";

// ───────────────────────── Le Système en images ─────────────────────────

export type EtapeScene = Dependant & { texte: string; sansAvis?: string };

export const SCENE: { titre: string; etapes: EtapeScene[]; sousScene: string } = {
  titre: "Le Système en images",
  etapes: [
    {
      texte: "La pub, les cartons et la fiche Google amènent un nouveau client.",
    },
    { texte: "Il commande sur l'app du resto." },
    { texte: "L'imprimante sort la commande." },
    { texte: "La livraison part, ou le client vient la chercher." },
    {
      texte:
        "Le client reçoit ses points et une demande d'avis Google, et plus tard un texto qui le fait revenir.",
      // Si Les Avis qui Rapportent ne sont pas disponibles, l'étape s'écrit sans la demande d'avis.
      sansAvis: "Le client reçoit ses points, et plus tard un texto qui le fait revenir.",
    },
    {
      texte:
        "Le soir, le proprio reçoit son texto avec les commandes du jour. Le lundi, il reçoit son Texto du Lundi.",
    },
  ],
  sousScene: "Tout est relié : on va chercher le client, ton app le sert, et on le fait revenir.",
};

// ───────────────────────── Le Système, couche par couche ─────────────────────────
// La section du haut de l'accueil : en défilant, les couches du Système se
// posent une par une. Les ventes d'abord (couches 1 et 2), le reste ensuite.
// Une pièce avec un `id` disparaît si elle n'est pas « disponible ».

export type IconeCouche =
  | "pub"
  | "google"
  | "cartons"
  | "cadeau"
  | "app"
  | "menu"
  | "panier"
  | "imprimante"
  | "livraison"
  | "reglage"
  | "points"
  | "texto"
  | "lundi"
  | "equipe"
  | "clientele";

export type PieceCouche = { nom: string; icone: IconeCouche; id?: string; href?: string };

export type Couche = { titre: string; texte: string; pieces: PieceCouche[] };

const COUCHES_BRUTES: Couche[] = [
  {
    titre: "On t'amène le client",
    texte: "Avant même ton lancement, on va chercher tes premiers clients, à nos frais.",
    pieces: [
      { nom: "La pub du lancement", icone: "pub", id: "blitz" },
      { nom: "Ta fiche Google", icone: "google", href: "/plateforme/referencement-google" },
      { nom: "Nos cartons dans chaque sac", icone: "cartons" },
      { nom: "Le parrainage", icone: "cadeau", id: "parrainage" },
    ],
  },
  {
    titre: "Il commande chez toi",
    texte: "Sur ton app à ton nom, avec un menu qui propose les extras au bon moment. Pas sur une plateforme.",
    pieces: [
      { nom: "Ton app à ton nom", icone: "app", id: "app-a-ton-nom" },
      { nom: "Le Menu qui Vend", icone: "menu", id: "menu-qui-vend" },
      { nom: "Les commandes en ligne", icone: "panier", href: "/plateforme/commandes-en-ligne" },
    ],
  },
  {
    titre: "La commande sort toute seule",
    texte: "Elle s'imprime en cuisine. La livraison part, ou le client vient la chercher.",
    pieces: [
      { nom: "L'imprimante de cuisine", icone: "imprimante", id: "zero-double-saisie" },
      { nom: "La livraison", icone: "livraison", id: "livraison-incluse" },
      { nom: "Le Réglage Plateformes", icone: "reglage", id: "reglage-plateformes" },
    ],
  },
  {
    titre: "Il revient",
    texte: "Ses points, ses récompenses et un texto au bon moment le ramènent chez toi.",
    pieces: [
      { nom: "Points et récompenses", icone: "points", id: "clients-fideles" },
      { nom: "Les relances texto", icone: "texto", href: "/plateforme/relances-clients" },
      { nom: "Les cartes-cadeaux", icone: "cadeau", id: "cartes-cadeaux" },
    ],
  },
  {
    titre: "Tu vois tout, sans rien gérer",
    texte: "Un texto chaque soir ta première semaine, le Texto du Lundi ensuite, et une équipe qui parle ta langue.",
    pieces: [
      { nom: "Le Texto du Lundi", icone: "lundi", id: "texto-lundi" },
      { nom: "Ton Département en ligne", icone: "equipe", id: "departement-en-ligne" },
      { nom: "Ta clientèle t'appartient", icone: "clientele", id: "clientele-appartient" },
    ],
  },
];

export const COUCHES: Couche[] = COUCHES_BRUTES.map((c) => ({
  ...c,
  pieces: c.pieces
    .filter((p) => !p.id || pret(p.id))
    .map((p) => ({ ...p, href: p.href ?? (p.id ? PAGE_DE_PIECE[p.id] : undefined) })),
}));

// ───────────────────────── Visuels (exemples) ─────────────────────────
// Chaque nom et chaque chiffre est un exemple. Aucun vrai client.

export const NOM_RESTO_EXEMPLE = "Ton Resto";
export const MENTION_EXEMPLE = "exemple";

export const VISUELS = {
  menu: [
    ["Poutine classique", "9,50 $"],
    ["Pizza 12 po", "18 $"],
    ["Combo du midi", "14 $"],
    ["Sous-marin 12 po", "13 $"],
    ["Salade César", "11 $"],
  ],
  ficheBouton: "Commander",
  ficheNote: "4,8",
  calendrierMois: ["Janvier", "Février", "Mars"],
  blitzPub: "300 $ payés par nous",
  blitzItems: ["Plaques", "Affiche", "Cartons"],
  fideliteTexto: "Ta pizza te manque? Points doublés ce soir.",
  fidelitePoints: 8,
  fidelitePointsMax: 10,
  avisTexte: "Super bon, livraison rapide.",
  avisEtoiles: 5,
  avisReponseProposee: "Merci! On t'attend pour la prochaine.",
  avisOk: "OK",
  textoSoir: "Ce soir : 7 commandes directes.",
  textoLundi: "Cette semaine : 31 commandes, 12 nouveaux clients, 486 $ rapportés.",
  livraisonTexto: "Ta commande est en route.",
};

// ───────────────────────── Fin de page ─────────────────────────

export const FIN = {
  texte:
    "On t'amène des nouveaux clients, on les fait revenir, et ton app paie son abonnement chaque mois, sinon tu ne le paies pas. Tout est fait pour toi, en français.",
  titre: `${NOM_OFFRE} : ta place dans la prochaine cohorte`,
  boutons: {
    calcul: "Calcule ce que tu aurais gardé",
    reserver: "Réserve ta place",
    appel: "Parle 15 minutes avec Guillaume",
  },
  barreCollante: "Calcule ton chiffre",
};

// ───────────────────────── Calculateur ─────────────────────────

export const CALCULATEUR = {
  surtitre: "Le calculateur",
  titre: "Ton relevé, lu par l'IA en 30 secondes",
  sousTitre: "Téléverse ton relevé de plateforme. L'IA lit tes chiffres et te montre les ventes que ton app peut aller chercher, et ce qu'il te reste en plus.",
  apercuBadge: "Ce que tu vas voir",
  apercuNote: "Exemple de notre offre : resto à 5 000 $ par mois sur une plateforme à 25 %, 3 000 $ qui passent à ton app, 40 commandes de nouveaux clients, prix +10 % sur la plateforme si ton entente le permet. Tes chiffres à toi sortent de ton relevé.",
  ventesTitre: "Tes ventes sur ton app",
  ventesSuffixe: "par mois, sur ton app à ton nom",
  ventesDont: "dont {n} de nouveaux clients",
  resteTitre: "Il te reste en plus, abonnement payé",
  scoreTitre: "Score plateforme",
  deposerTitre: "Glisse ton relevé ici",
  deposerAide: "ou clique pour le choisir. Au cell, tu peux le prendre en photo.",
  deposerFormats: "PDF, JPG ou PNG · 10 Mo max",
  deposerChanger: "Changer de fichier",
  plateformes: ["DoorDash", "Uber Eats", "Skip"],
  etapes: ["Téléverser", "Lecture par l'IA", "Vérifier", "Résultat"],
  televerserTitre: "Téléverse ton relevé de plateforme",
  televerserAide:
    "DoorDash, Uber Eats ou Skip. PDF ou photo, en français ou en anglais.",
  /** Texte à faire valider par l'avocat. */
  consentement:
    "J'accepte que Resto Action analyse mon relevé avec un outil d'intelligence artificielle (Anthropic, hébergé hors du Québec) pour calculer mon estimation. Le fichier est supprimé dès l'analyse. Les chiffres extraits sont gardés dans notre outil de suivi pour te recontacter, jamais vendus ni donnés à d'autres entreprises.",
  boutonAnalyser: "Analyser mon relevé",
  boutonManuel: "Entrer mes chiffres à la main",
  lectureEnCours: "On lit ton relevé…",
  lectureEchec:
    "On n'a pas réussi à lire ton relevé. Entre tes chiffres à la main.",
  verifierTitre: "Vérifie tes chiffres",
  verifierAide: "Corrige ce qui ne correspond pas à ton relevé, puis calcule.",
  boutonCalculer: "Calculer mon estimation",
  resultatPrefixe: "ton estimation : environ",
  scenarioNote: "Scénario choisi : {n} commandes de nouveaux clients par mois. Change-le plus bas.",
  resultatSuffixe: "par mois",
  commentOnCalcule: "Comment on calcule",
  partApp: "Part de tes clients qui passent à ton app",
  prixAjustes: "Prix +10 % sur ce qui reste sur la plateforme",
  siEntente: "si ton entente le permet",
  scenario: "Nouvelles commandes par mois",
  scenarios: [20, 40, 60],
  aliments: "Coût des aliments",
  seuilPrefixe: "Ton app se paie avec",
  seuilSuffixe: "commandes de nouveaux clients par mois.",
  economieNegative:
    "À ton taux, l'économie sur la plateforme est petite. Ton gain viendra des nouveaux clients.",
  avertissement:
    "Estimation faite avec ton relevé et des hypothèses que tu peux changer. Ce n'est pas une promesse de résultat.",
  dossierTitre: "Le Dossier pour ton associé",
  dossierAide:
    "Une page avec tes chiffres, facile à transférer à ton associé ou à ton comptable.",
  dossierBouton: "Voir mon dossier",
  consentementTextos: "J'accepte de recevoir des textos de Resto Action.",
  boutonReserver: `Réserve ta place dans ${NOM_OFFRE}`,
  boutonAppel: "Parle 15 minutes avec Guillaume",
  champs: {
    plateforme: "Plateforme",
    periodeJours: "Période du relevé (jours)",
    nbLivraison: "Commandes en livraison",
    nbCueillette: "Commandes en cueillette",
    ventes: "Ventes d'aliments et boissons",
    commissions: "Commissions prises par la plateforme",
    autresFrais: "Autres frais",
    tauxLivraison: "Taux de la plateforme en livraison",
    tauxCueillette: "Taux de la plateforme en cueillette",
    partLivraison: "Part en livraison",
    prenom: "Prénom",
    resto: "Resto",
    ville: "Ville",
    cellulaire: "Cellulaire",
    courriel: "Courriel",
  },
  moteurs: {
    recupere: "L'argent récupéré sur les plateformes",
    ajustes: "Les prix ajustés sur la plateforme",
    nouvelles: "Les nouvelles ventes",
    abonnement: "L'abonnement",
  },
};

// ───────────────────────── Nav ─────────────────────────

export const NAV = {
  liens: [
    { label: "Comment ça marche", href: ANCRES.commentCaMarche },
    { label: "Calculateur", href: ANCRES.calculateur },
    { label: "Prix", href: ANCRES.prix },
    { label: "FAQ", href: ANCRES.faq },
  ],
  bouton: "Réserve ta place",
};

export const PIED = {
  entreprise: "Resto Action — un produit de Studio LT, Trois-Rivières, Québec.",
  liens: [
    { label: "Conditions", href: "/conditions-fondateur" },
    { label: "Confidentialité", href: "/confidentialite" },
  ],
};

// ───────────────────────── Aides ─────────────────────────

const INDEX_PIECES: Record<string, Piece> = Object.fromEntries(
  [...GROUPES.flatMap((g) => g.pieces), ...BONUS].map((p) => [p.id, p]),
);

/** Vrai si toutes les pièces listées sont disponibles (ou s'il n'y en a aucune). */
export function disponible(item: Dependant): boolean {
  return (item.dependDe ?? []).every((id) => INDEX_PIECES[id]?.disponible ?? false);
}

export function piecesDisponibles(): GroupePieces[] {
  return GROUPES.map((g) => ({ ...g, pieces: g.pieces.filter((p) => p.disponible) })).filter(
    (g) => g.pieces.length > 0,
  );
}

export function bonusDisponibles(): Bonus[] {
  return BONUS.filter((b) => b.disponible);
}

export function garantiesDisponibles(): Garantie[] {
  return GARANTIES.filter(disponible);
}

/** Une valeur s'affiche seulement avec 2 vraies soumissions. */
export function valeurAffichable(p: Piece): number | null {
  return p.soumissions === 2 && p.valeur != null ? p.valeur : null;
}

/** Total affiché seulement quand chaque pièce et chaque bonus affichés ont une valeur. */
export function valeurTotale(): number | null {
  const items = [...piecesDisponibles().flatMap((g) => g.pieces), ...bonusDisponibles()];
  if (items.length === 0) return null;
  let total = 0;
  for (const p of items) {
    const v = valeurAffichable(p);
    if (v == null) return null;
    total += v;
  }
  return total;
}

/** Nombre de pièces disponibles (pour la grille de vérification). */
export function nombrePieces(): number {
  return piecesDisponibles().reduce((n, g) => n + g.pieces.length, 0);
}
