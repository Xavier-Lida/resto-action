/**
 * The Big Winter Launch content, English version (mirror of grand-lancement.ts).
 *
 * Same exports, same shapes: a component can swap
 * `import * as C from "./grand-lancement"` for this module.
 *
 * Numbers, prices, links and availability are NOT duplicated here: they are
 * re-exported or read from the French module, so the two never drift. Only
 * the text is translated. Pieces, bonuses and guarantees take their id,
 * value, submissions, availability, visual and `dependDe` from the French
 * object with the same id.
 */

import * as FR from "./grand-lancement.ts";
import type {
  Bonus,
  Couche,
  Dependant,
  Etape,
  EtapeInclus,
  EtapeScene,
  Garantie,
  GroupePieces,
  Piece,
  QuestionFaq,
} from "./grand-lancement.ts";
import {
  ABONNEMENT,
  CREDIT_SORTIE_MAX,
  MISE_EN_SERVICE_ACTUELLE,
  MISE_EN_SERVICE_ENSUITE,
  PRIX_GELE_MOIS,
  RESERVATION_URL,
  RESTOS_PAR_MOIS,
  RESTOS_PAR_SEMAINE,
} from "./grand-lancement.ts";

export type {
  Bonus,
  Couche,
  Dependant,
  Etape,
  EtapeInclus,
  EtapeScene,
  Garantie,
  GroupePieces,
  IconeCouche,
  Piece,
  PieceCouche,
  QuestionFaq,
  Soumissions,
  Visuel,
} from "./grand-lancement.ts";

export {
  ABONNEMENT,
  COMMANDES_VISEES_7_JOURS,
  CREDIT_SORTIE_MAX,
  EXEMPLE,
  FRAIS,
  LIEN_APPEL,
  MISE_EN_SERVICE_ACTUELLE,
  MISE_EN_SERVICE_ENSUITE,
  PRIX_GELE_MOIS,
  PUB_GARANTIE_SEMAINE,
  PUB_LANCEMENT,
  RESERVATION_URL,
  RESTOS_PAR_MOIS,
  RESTOS_PAR_SEMAINE,
  VIDEO_GUILLAUME_URL,
  VILLES,
  VILLE_EQUIPE,
  lienAppel,
} from "./grand-lancement.ts";

// ───────────────────────── Variables ─────────────────────────

export const NOM_OFFRE = "The Big Winter Launch";
export const NOM_SYSTEME = "The 7-Day New Customer System";
export const ACCROCHE = "This winter, your printer is going to be busy.";

export const NOM_BLITZ = "The 7-Day Blitz";

export const NOMS_GARANTIES = {
  chrono: "48 Hours Flat",
  imprimante: "The Busy Printer",
  gratuit: "It Pays Off or It's Free",
  boomerang: "Boomerang Money",
} as const;

export const DATE_COHORTE = "January 2027";
export const DATE_LIMITE = "Friday, December 18, 2026";
/** Empty until an end date for the $750 is decided. Fill it in when the French
    DATE_FIN_750 is filled in (it stays hidden here until then). */
export const DATE_FIN_750 = "";

export const EQUIPE = "Guillaume and Xavier";

// ───────────────────────── Links ─────────────────────────

export const ANCRES = {
  calculateur: "#calculateur",
  prix: "#prix",
  faq: "/en/faq",
  garanties: "#garanties",
  commentCaMarche: "#comment-ca-marche",
  reserver: "#reserver",
  calculGarantie: "/en/faq#faq-calcul-garantie",
} as const;

/** Reservation: the site's /en/reserve form (free; the setup is paid on signing). */
export function lienReservation(): string {
  return RESERVATION_URL || "/en/reserve";
}

// ───────────────── Flags taken from the French module ─────────────────

const FR_PIECES = new Map<string, Piece>(
  [...FR.GROUPES.flatMap((g) => g.pieces), ...FR.BONUS].map((p) => [p.id, p]),
);

/** The French piece with this id, with English text. Keeps id, value, submissions, availability and visual. */
function piece(id: string, nom: string, ligne: string): Piece {
  const fr = FR_PIECES.get(id);
  if (!fr) throw new Error(`grand-lancement.en: unknown piece "${id}"`);
  return { ...fr, nom, ligne };
}

function bonus(id: string, nom: string, ligne: string): Bonus {
  const fr = FR.BONUS.find((b) => b.id === id);
  if (!fr) throw new Error(`grand-lancement.en: unknown bonus "${id}"`);
  return { ...fr, nom, ligne };
}

function garantie(id: Garantie["id"], court: string, texte: string): Garantie {
  const fr = FR.GARANTIES.find((g) => g.id === id);
  if (!fr) throw new Error(`grand-lancement.en: unknown guarantee "${id}"`);
  return { ...fr, nom: NOMS_GARANTIES[id], court, texte };
}

// ───────────────────────── Pieces ─────────────────────────

export const GROUPES: GroupePieces[] = [
  {
    id: "avant",
    titre: "Before you sign, free",
    pieces: [
      piece(
        "calcul-releve",
        "The Statement Calculation",
        "Your statement run through our calculator. You see your real fees and your estimate, card fees included.",
      ),
      piece(
        "apercu-app",
        "Your App Preview",
        "Your app with your name and your Google profile, before you even talk to us.",
      ),
      piece(
        "dossier-associe",
        "The Partner File",
        "One page with your numbers, for your partner or your accountant.",
      ),
      piece("preuve-locale", "Local Proof", "Owners from around here, on video, with their numbers."),
    ],
  },
  {
    id: "lancement",
    titre: "Your launch",
    pieces: [
      piece(
        "installation",
        "The Turnkey Installation",
        "Your app, menu, photos and Google profile built for you. On site, your printer is hooked up in 10 minutes. You approve.",
      ),
      piece(
        "menu-qui-vend",
        "The Menu That Sells",
        "Your online menu built to grow the order: combos, extras, add-on suggestions.",
      ),
      piece(
        "blitz",
        NOM_BLITZ,
        "Posters, counter signs, inserts, posts and $300 of ads paid by us. Your first direct order targeted within 7 days.",
      ),
      piece(
        "kit-equipe",
        "The 15-Minute Team Kit",
        "Your staff trained in 15 minutes, with a video and a guide at the station.",
      ),
      piece(
        "zero-double-saisie",
        "Zero Double Entry",
        "Your orders in one place: in your POS if it's compatible, otherwise on your kitchen printer.",
      ),
    ],
  },
  {
    id: "nouvelles-ventes",
    titre: "New sales",
    pieces: [
      piece(
        "cartes-cadeaux",
        "Gift Cards",
        "Gift cards sold on your app. The money comes in up front, and the people who receive them become your customers.",
      ),
      piece(
        "parrainage",
        "Referrals",
        "Every customer gets a link to invite a friend. The friend gets a discount, your customer gets points.",
      ),
      piece(
        "clients-fideles",
        "The Loyal Customer Engine",
        "Points, offers and texts that bring your customers back on their own (reminder after 30 days, abandoned cart).",
      ),
      piece(
        "avis",
        "Reviews That Pay Off",
        "After every order, your app asks your customer for a Google review. We suggest a reply for every review, and you approve it by text before it's posted, especially for 1- or 2-star reviews. More reviews and a reply to each one means a stronger Google profile, and more direct orders.",
      ),
      piece(
        "marketing",
        "Marketing Done for You",
        "Your social media and Google profile active, 3 months scheduled ahead.",
      ),
    ],
  },
  {
    id: "argent-recupere",
    titre: "Money recovered from the platforms",
    pieces: [
      piece("cueillette-abord", "Pickup First", "Pickup featured up front on your app, with double points."),
      piece(
        "reglage-plateformes",
        "The Platform Price Tune-Up",
        "We read your agreements and raise your prices 10 to 15% on the platforms from day 1, if your agreement allows it. You keep more on what stays there. (On Uber Eats, prices higher than in-store push the pickup rate from 10% to 15%: we check it with you.)",
      ),
      piece(
        "livraison-incluse",
        "Delivery Included",
        "Delivery at $4.99 for your customer, without a single driver to manage. You pay the delivery run at cost, and complaints are on us.",
      ),
    ],
  },
  {
    id: "clientele",
    titre: "Customers of your own",
    pieces: [
      piece(
        "app-a-ton-nom",
        "Your Own Branded App",
        "Your web and mobile app, no account needed to order, money straight to your account.",
      ),
      piece(
        "clientele-appartient",
        "Your Customers Belong to You",
        "Your customer list, your domain and your Google profile, in your name.",
      ),
    ],
  },
  {
    id: "chaque-semaine",
    titre: "Every week",
    pieces: [
      piece(
        "texto-lundi",
        "The Monday Text",
        "Every Monday, in one text: your direct orders, your new sales and the money brought in.",
      ),
      piece("departement-en-ligne", "Your Online Department", "One local number for everything online."),
    ],
  },
];

/* Ready at launch? Reads GROUPES directly. Used by sentences that name
   referrals or gift cards: when false, they are written without them. */
function pret(id: string): boolean {
  return GROUPES.some((g) => g.pieces.some((p) => p.id === id && p.disponible));
}

/** ["a", "b", "c"] → "a, b and c". Falsy values are skipped. */
function enumerer(items: (string | false)[], dernier = " and "): string {
  const l = items.filter((x): x is string => Boolean(x));
  return l.length <= 1 ? l.join("") : `${l.slice(0, -1).join(", ")}${dernier}${l[l.length - 1]}`;
}

/** The channels that bring in a new customer, for guarantees 3 and 4. */
const CANAUX = enumerer(["ads", pret("parrainage") && "referral", pret("cartes-cadeaux") && "gift card", "Google profile"], ", ");

// ───────────────────────── Bonuses ─────────────────────────

export const BONUS: Bonus[] = [
  bonus(
    "equipement",
    "The Equipment, on Us",
    "A kitchen printer that prints every order on its own. No tablet: you follow everything on your phone.",
  ),
  bonus(
    "boite-lancement",
    "The Launch Box",
    "Counter signs, inserts, poster, a QR card for the training video, and your app on your phone.",
  ),
  bonus(
    "formation-privee",
    "Private Training",
    "1 hour one-on-one during installation. You learn to read your sales and your Monday Text; your staff learns to take orders and talk about the app.",
  ),
  bonus(
    "credit-sortie",
    "The Exit Credit",
    "Your current provider's penalty, credited up to $400 with proof.",
  ),
  bonus("prix-gele", "Your Locked-In Price", "$200 a month, locked for 24 months."),
];

// ───────────────────────── Guarantees ─────────────────────────

export const GARANTIES: Garantie[] = [
  garantie(
    "chrono",
    "Not live by your date? Your first month is free.",
    "Send us your menu, photos and access within 5 days: your app is ready in 48 hours and you're live on your date. If not, your first month is free.",
  ),
  garantie(
    "imprimante",
    "Under 10 orders in 7 days? We add more ads at our cost.",
    "If your app doesn't get 10 orders in your first 7 days, we put in $100 of ads every week, at our cost, until you get them.",
  ),
  garantie(
    "gratuit",
    "Your app doesn't cover its subscription one month? You don't pay it.",
    "Your app pays for its subscription every month, in savings or new sales. If not, you don't pay it.",
  ),
  garantie(
    "boomerang",
    "Setup not earned back in 90 days? We refund it.",
    "If your app hasn't brought in at least your setup fee in your first 90 days, we refund it. You keep your printer, and you stay or you go: your call.",
  ),
];

export const GARANTIES_CONDITION =
  "For all 4 guarantees: your counter signs and poster in place, and our inserts in your bags. The 1st also requires your menu, photos and access within 5 days. The same month is never credited twice.";

export const GARANTIES_DETAILS = "Read all 4 guarantees in full";

export const GARANTIES_LIEN_CALCUL = "How we calculate the 3rd and 4th guarantees";

// ───────────────────────── Top of page ─────────────────────────

export const HERO = {
  surtitre: NOM_OFFRE,
  h1: "More online sales. More money at the end of the month.",
  /** The rotating title at the top of the page (the full H1 stays readable by Google). */
  titresRoulants: [
    "More online sales.",
    "More new customers.",
    "More orders.",
    "More money.",
  ],
  /** Version B, to test later. */
  h1VersionB: "We grow your online revenue.",
  sousTitre:
    "The 7-Day New Customer System: your own branded app, new customers we go out and find for you, and less money left to the platforms.",
  accroche: ACCROCHE,
  sousAccroche:
    "In winter, people stay home and order in, so we launch you before the busy season.",
  boutonPrincipal: "Calculate what you'd have kept",
  boutonSecondaire: "Reserve your spot",
  ligneCohorte: `We launch at most ${RESTOS_PAR_MOIS} restaurants a month in Québec. Next cohort: ${DATE_COHORTE}. Sign-ups until ${DATE_LIMITE}.`,
};

// ───────────────────────── The problem ─────────────────────────

/** The problem, in one line (block 2 of the homepage). */
export const PROBLEME =
  "The platforms take 20 to 30% of every delivery, and your customers stay theirs.";

// ───────────────────────── The 3 engines ─────────────────────────

export const MOTEURS = {
  titre: "We don't sell an app. We bring you orders.",
  liste: [
    {
      id: "nouvelles-ventes",
      titre: "New sales, the core.",
      texte:
        "We go find customers you don't have today, and we bring them back. A new $30 delivery order leaves you about $14.50 after food and our fees (example with a 30% food cost).",
    },
    {
      id: "argent-recupere",
      titre: "Money recovered from the platforms, the bonus.",
      texte:
        "You don't drop the platforms: we adjust your prices there, if your agreement allows it. Every customer who picks up their order through your app instead of getting it delivered by a platform leaves you about $6 more (example: 25% platform, $30 order, before the price adjustment). On delivery, the savings depend on your rate: the calculator shows you with your statement.",
    },
    {
      id: "clientele",
      titre: "Customers of your own, the asset.",
      texte:
        "Your customers' names, numbers and orders are yours, along with your domain and your Google profile. If you leave, you keep your customer list, your domain and your profile.",
    },
  ],
  effort:
    "What you do: 10 minutes for the installation, one hour of training and 15 minutes for your team. The rest is on us, done locally.",
};

// ───────────────────────── How it works ─────────────────────────

export const FRISE: { titre: string; etapes: Etape[] } = {
  titre: "How it works: from your reservation to your first Monday",
  etapes: [
    {
      titre: "You reserve your spot for free, then you sign with us",
      texte: `$${MISE_EN_SERVICE_ACTUELLE} setup, printer included. No deposit.`,
    },
    {
      titre: "You send us your menu, photos and access",
      texte: "5 days.",
    },
    { titre: "Your app is ready", texte: "48 hours." },
    {
      titre: "Your launch date",
      texte:
        "your printer hooked up in 10 minutes, and your private one-hour training, in person.",
      dependDe: ["installation"],
    },
    {
      titre: "Your first 7 days",
      texte:
        "$300 of ads paid by us, our inserts in your bags, and a text every evening with the day's orders.",
      dependDe: ["blitz"],
    },
    {
      titre: "Every Monday",
      texte:
        "a text with your orders, your new sales and the money brought in. Plus a text at your 1st, 10th, 50th and 100th order.",
      dependDe: ["texto-lundi"],
    },
  ],
};

// ─────────────── Everything included, step by step ───────────────

export const ETAPES_INCLUS: { titre: string; sousTitre: string; etapes: EtapeInclus[] } = {
  titre: "Everything included, step by step",
  sousTitre: "{n} items, all for the same price. Here's what you get, and when.",
  etapes: [
    {
      quand: "Before you sign",
      titre: "You see your numbers, for free",
      toi: "You upload your platform statement. That's it.",
      pieces: ["calcul-releve", "apercu-app", "dossier-associe"],
    },
    {
      quand: "You sign",
      titre: "We build everything for you",
      toi: `You reserve for free, sign your agreement ($${MISE_EN_SERVICE_ACTUELLE} setup) and send us your menu, photos and access within 5 days. Your app is ready in 48 hours.`,
      pieces: ["installation", "app-a-ton-nom", "menu-qui-vend", "reglage-plateformes", "marketing"],
    },
    {
      quand: "Your launch date",
      titre: "We come to you",
      toi: "You give us one hour for your private training. Your team, 15 minutes.",
      pieces: ["equipement", "zero-double-saisie", "formation-privee", "kit-equipe", "boite-lancement"],
    },
    {
      quand: "Your first 7 days",
      titre: "We go find your customers",
      toi: "You leave your counter signs and poster in place, and slip our inserts into your bags.",
      pieces: ["blitz", "livraison-incluse", "cueillette-abord"],
    },
    {
      quand: "Then, every week",
      titre: "They come back, and you see what it brings in",
      toi: "You read your Monday Text. The rest runs on its own.",
      pieces: ["texto-lundi", "clients-fideles", "parrainage", "cartes-cadeaux", "departement-en-ligne", "clientele-appartient"],
    },
  ],
};

/** Where each piece leads, when it has its own page. */
export const PAGE_DE_PIECE: Record<string, string> = {
  "calcul-releve": "/en#calculateur",
  "app-a-ton-nom": "/en/platform/mobile-app",
  "menu-qui-vend": "/en/platform/menu-that-sells",
  "reglage-plateformes": "/en/platform/platform-pricing",
  marketing: "/en/platform/online-department",
  equipement: "/en/platform/kitchen-printer",
  "zero-double-saisie": "/en/platform/kitchen-printer",
  blitz: "/en/platform/launch-ads",
  "livraison-incluse": "/en/platform/delivery",
  "cueillette-abord": "/en/platform/delivery",
  "texto-lundi": "/en/platform/monday-text",
  "clients-fideles": "/en/platform/points-rewards",
  parrainage: "/en/platform/referrals-gift-cards",
  "cartes-cadeaux": "/en/platform/referrals-gift-cards",
  "departement-en-ligne": "/en/platform/online-department",
};

// ───────────────────────── Value stack ─────────────────────────

export const PILE = {
  titre: "Everything included",
  sousTitre: "{n} items, all for the same price. Tap a name to see the details.",
  totalLibelle: "Total value",
  prixLigne: `Your price: $${ABONNEMENT} a month, plus our per-order fees, and a $${MISE_EN_SERVICE_ACTUELLE} setup`,
  prixLien: "See the full price",
};

// ───────────────────────── Bonuses ─────────────────────────

/** The bonuses, in 3 lines, under the price. */
export const BONUS_COURT: (Dependant & { texte: string; expire: boolean })[] = [
  { texte: "Your printer, your Launch Box and your private training: on us.", expire: false },
  { texte: `The Exit Credit: your current provider's penalty, credited up to $${CREDIT_SORTIE_MAX}.`, expire: true, dependDe: ["credit-sortie"] },
  { texte: `Your Locked-In Price: $${ABONNEMENT} a month, locked for ${PRIX_GELE_MOIS} months.`, expire: true, dependDe: ["prix-gele"] },
];

export const BONUS_SECTION = {
  titre: "On top of that: 5 bonuses",
  etiquetteExpire: `If you sign before ${DATE_LIMITE}`,
  etiquetteCourte: "Sign before Dec. 18",
};

export const GARANTIES_SECTION = {
  titre: "4 guarantees on your results",
};

// ───────────────────────── Comparison ─────────────────────────

export const COMPARAISON = {
  titre: "We don't compare ourselves to an app. We compare ourselves to a result.",
  entetes: ["If you choose…", "You're buying", "Who makes it work", "Whose customers"],
  lignes: [
    ["A delivery platform", "Its customers, at 20 to 30% per delivery", "It does", "Theirs"],
    ["An app or ordering module", "A tool", "You", "Yours, if you go get them"],
    ["A website (agency, nephew)", "A storefront", "You", "Yours, if you go get them"],
    ["An ad agency", "Visibility", "They do, for the ads", "Wherever they order"],
    [
      "Resto Action",
      "More orders, your app and your customers",
      "Us, locally, on the ground",
      "Yours",
    ],
  ],
  sousTableau:
    "To get the same thing elsewhere, you'd need four providers: an app, an ad agency, a delivery service and someone on the ground.",
  seulCoupTitre: "What you get all at once with us",
  seulCoup: [
    {
      texte: `Someone goes out and finds your customers: ${enumerer(["$300 of ads paid by us", "our inserts in your bags", pret("parrainage") && "referrals"], ", ")}.`,
      dependDe: ["blitz"],
    },
    {
      texte:
        "Your own branded app, at your in-store prices, with delivery and no drivers to manage.",
      dependDe: ["app-a-ton-nom", "livraison-incluse"],
    },
    {
      texte: "Money recovered from your platforms from day 1, without dropping them.",
      dependDe: ["reglage-plateformes"],
    },
    {
      texte:
        "Proof every Monday: your new sales and the money brought in, in one text.",
      dependDe: ["texto-lundi"],
    },
    {
      texte:
        "Real people, right here: installation and training in person, one number for everything.",
      dependDe: ["installation", "departement-en-ligne"],
    },
    {
      texte: "Your customers, yours for good: your list, your domain, your Google profile.",
      dependDe: ["clientele-appartient"],
    },
  ] satisfies (Dependant & { texte: string })[],
  testTitre: "The restaurant-across-the-street test: 5 questions to ask any provider",
  test: [
    {
      question: "How many new customers will you bring me, and how?",
      reponse: `10 orders targeted in your first 7 days, with ${enumerer(["$300 of ads", "our inserts", pret("parrainage") && "referrals"])}; if not, we add more ads at our cost.`,
      dependDe: ["blitz"],
    },
    {
      question: "Who pays for the launch ads?",
      reponse: "we do, $300.",
      dependDe: ["blitz"],
    },
    {
      question: "Who comes to install and train me, in person?",
      reponse: "someone from our team, with one hour of private training.",
      dependDe: ["installation"],
    },
    {
      question: "Do I see every week what it brought in?",
      reponse: "yes, with the Monday Text.",
      dependDe: ["texto-lundi"],
    },
    {
      question: "If I leave, do I keep my customer list, my domain and my profile?",
      reponse: "yes.",
      dependDe: ["clientele-appartient"],
    },
  ] satisfies (Dependant & { question: string; reponse: string })[],
  reponsePrefixe: "With us:",
};

// ───────────────────────── Price ─────────────────────────

/** English labels on the French example lines: the amounts come from the French module. */
function montants(textes: string[], fr: [string, number][]): [string, number][] {
  return textes.map((t, i) => [t, fr[i][1]]);
}

export const PRIX = {
  titre: "The price, all in",
  taxes: "plus taxes",
  lignes: {
    abonnement: `Subscription: $${ABONNEMENT} a month, starting when you go live.`,
    miseEnService: `Setup: $${MISE_EN_SERVICE_ACTUELLE} for ${NOM_OFFRE}, then $${MISE_EN_SERVICE_ENSUITE.toLocaleString("en-CA")}, an increase announced in advance. It's paid when you sign; no deposit. If your app hasn't earned it back in 90 days, we refund it (${NOMS_GARANTIES.boomerang}).`,
    miseEnServiceFin: DATE_FIN_750 ? `The $${MISE_EN_SERVICE_ACTUELLE} is offered until ${DATE_FIN_750}.` : "",
    livraison:
      "Delivery: 10% of food and drinks + $3.51 per delivery today (the delivery run at cost: what it costs us, minus the $4.99 your customer pays). Your customer pays $4.99 for delivery, nothing else.",
    cueillette: "Pickup: 5% + $0.30 per order.",
    inclus: "Card fees included. No order minimum. The printer is on us.",
  },
  sousBouton: "Free. We'll call you to set your date.",
  exempleMention: "example, not a promise",
  exempleHypotheses:
    "restaurant doing $5,000 a month on a 25% platform, $30 delivery orders, 30% food cost, platform prices adjusted if the agreement allows it.",
  exempleEntetes: ["Where the money comes from", "Per month"],
  exempleLignes: montants(
    [
      "40 new orders (10 a week)",
      "$3,000 of orders moving to your app",
      "Prices +10% on the $2,000 left on the platform, same volume",
      "Subscription",
    ],
    FR.PRIX.exempleLignes,
  ),
  exempleTotalLibelle: "You keep extra",
  /** The same lines, short, for the homepage Price section. */
  exempleCourt: montants(
    ["40 new orders", "$3,000 moving to your app", "Prices +10% on the platform", "Subscription"],
    FR.PRIX.exempleCourt,
  ),
  /** $3,000 moving to the app + 40 new $30 orders. */
  exempleVentesApp: FR.PRIX.exempleVentesApp,
  exempleHypothesesCourt: "Restaurant doing $5,000 a month on a 25% platform, $30 orders.",
  exempleTotal: FR.PRIX.exempleTotal,
};

// ───────────────────────── Scarcity ─────────────────────────

export const RARETE = {
  titre: `${RESTOS_PAR_MOIS} restaurants a month, no more`,
  lignes: [
    `We launch at most ${RESTOS_PAR_MOIS} restaurants a month in Québec, ${RESTOS_PAR_SEMAINE} a week: that's our limit, so we can launch each one right.`,
    `Next cohort: ${DATE_COHORTE}. To be part of it, sign before ${DATE_LIMITE}: it takes 2 weeks for your menu, photos, app, printing and installation. After that, you go with the next cohort, a month later.`,
  ],
  /** The short banner version: one line. */
  courte: `Sign before ${DATE_LIMITE} to launch in ${DATE_COHORTE}. Reserving is free.`,
  expirePrefixe: "After this date, you lose",
  signature: `The $${MISE_EN_SERVICE_ACTUELLE} setup is paid when you sign. Not ready yet? Sign up for free: we'll keep you posted.`,
  bouton: "Reserve your spot",
};

// ───────────────────────── Who we are ─────────────────────────

export const QUI = {
  titre: "Who we are",
  texte: "Two local co-founders, and a team that speaks your language.",
  preuveAVenir:
    "The real numbers from our first restaurants will be here, on video, as soon as they launch.",
  photoGuillaume: FR.QUI.photoGuillaume,
};

// ───────────────────────── FAQ ─────────────────────────

export const FAQ: { titre: string; questions: QuestionFaq[] } = {
  titre: "What owners tell us",
  questions: [
    {
      top: true,
      question: "My customers are on the platforms, they'll never come to my app.",
      reponse:
        "We give them a reason. Your menu costs less with you (we adjust your platform prices, if your agreement allows it), pickup is featured with double points, and our inserts go in every bag.",
      dependDe: ["reglage-plateformes", "cueillette-abord"],
    },
    {
      question: "Nobody will find my app.",
      reponse:
        "We pay $300 of ads for your launch, set up your Google profile at installation, and keep your social media active.",
      dependDe: ["blitz", "marketing"],
    },
    {
      top: true,
      question: "It won't bring me new customers.",
      reponse: `We go get them: ${enumerer(["the launch ads", "our inserts in your bags", "your Google profile", pret("parrainage") && "referrals", pret("cartes-cadeaux") && "gift cards"])}.`,
      dependDe: ["blitz"],
    },
    {
      question: "My customers don't come back on their own.",
      reponse:
        "The Loyal Customer Engine brings them back with points, offers and texts.",
      dependDe: ["clients-fideles"],
    },
    {
      question: "Online orders are small orders.",
      reponse:
        "Your online menu is built to grow the order (combos, extras, suggestions).",
      dependDe: ["menu-qui-vend"],
    },
    {
      question: "If I raise my prices on the platforms, I'll lose sales.",
      reponse:
        "Those who find it pricey come order from you. If they pick up their order, you keep about $3 more than with the platform (example: 25% platform, $30 order). We only raise your prices if your agreement allows it.",
      dependDe: ["reglage-plateformes"],
    },
    {
      top: true,
      question: "I don't have time, and I'm not a tech person.",
      reponse:
        "We set everything up for you: on site, your printer is hooked up in 10 minutes. We handle your marketing, and you have one local number for everything online.",
      dependDe: ["installation", "departement-en-ligne"],
    },
    {
      question: "Another tablet on the counter.",
      reponse:
        "No tablet. Your orders print on a kitchen printer we provide, or go into your POS if it's compatible, and you follow everything on your phone.",
      dependDe: ["zero-double-saisie"],
    },
    {
      question: "My staff will get mixed up.",
      reponse:
        "Your team is trained in 15 minutes, with a video and a guide at the station. And you get one hour of private training, in person.",
      dependDe: ["kit-equipe"],
    },
    {
      question: "Delivery is a headache.",
      reponse:
        "You have no drivers to manage: we handle delivery and complaints. Your customer pays $4.99, and you pay the delivery run at cost.",
      dependDe: ["livraison-incluse"],
    },
    {
      question: "Revenu Québec and Law 25, I don't want any trouble.",
      reponse:
        "Our system is in the process of certification with Revenu Québec, for compliant invoices. Your customers' consents are managed in the app.",
    },
    {
      top: true,
      question: "$200 a month is one more expense.",
      reponse:
        "Run the numbers with your statement. About 14 orders from new customers a month pay for the subscription (example with $30 delivery orders and a 30% food cost). If not, the guarantee makes it free.",
    },
    {
      question: "Card fees will eat up the savings.",
      reponse:
        "Our fees include card fees: 10% + $3.51 per delivery (the delivery run), and 5% + $0.30 on pickup. Nothing else.",
    },
    {
      top: true,
      question: "It's too good to be true.",
      reponse:
        "Calculate it with your own statement, and read our guarantees: if your app doesn't pay for itself, you don't pay your subscription, and if orders are slow to come, we're the ones putting in more ads.",
    },
    {
      question: "I'll pay without ever knowing if it works.",
      reponse:
        "Every Monday, a text tells you your direct orders, your new sales and the money brought in. The first week, you get one every evening.",
      dependDe: ["texto-lundi"],
    },
    {
      question: "My partner (or my accountant) will say no.",
      reponse: "We prepare a page with your numbers for you to show them.",
      dependDe: ["dossier-associe"],
    },
    {
      question: "If I leave, I lose everything.",
      reponse:
        "No. Your customer list, your domain and your Google profile are in your name, and you keep them.",
      dependDe: ["clientele-appartient"],
    },
    {
      question: "I already have a website or a contract elsewhere.",
      reponse:
        "We transfer your menu and photos. If you sign before the deadline, we credit your current provider's penalty, up to $400.",
      dependDe: ["credit-sortie"],
    },
    {
      id: "faq-garanties",
      top: true,
      question: "What if it doesn't work for me?",
      reponse: `You have 4 guarantees: ${NOMS_GARANTIES.chrono}, ${NOMS_GARANTIES.imprimante}, ${NOMS_GARANTIES.gratuit} and ${NOMS_GARANTIES.boomerang}.`,
    },
    {
      id: "faq-calcul-garantie",
      question: "How do you calculate guarantees 3 and 4?",
      reponse:
        `Every month, we add up what you saved on orders that came over from the platforms (at your statement's rate) and $10 per order from a new customer who came through one of our channels (${CANAUX}). If the total doesn't cover your subscription, you don't pay it that month. For the 4th: if the total for your first 90 days doesn't cover your setup fee, we refund it.`,
    },
    {
      id: "faq-mise-en-service",
      question: "What's the setup fee?",
      reponse: `$${MISE_EN_SERVICE_ACTUELLE} for ${NOM_OFFRE}, then $${MISE_EN_SERVICE_ENSUITE.toLocaleString("en-CA")}. It's paid when you sign and covers your installation, your private training and your Launch Box. Your printer is on us and belongs to you. If your app hasn't earned it back in 90 days, we refund it (${NOMS_GARANTIES.boomerang}).`,
    },
    {
      question: "I'm worried about bad reviews.",
      reponse:
        "We suggest a reply for every review, and nothing is posted without your OK by text. A 1- or 2-star review is sent to you right away, with a calm reply to approve.",
      dependDe: ["avis"],
    },
  ],
};

// ───────────────────────── Review rule ─────────────────────────
// Shown everywhere reviews appear (card, FAQ, scene, terms).

export const REGLE_AVIS =
  "Every customer gets the same review request, with no points, discounts or rewards in exchange, and no screening between customers. A public reply never gives details about the order or the customer. Nothing is posted without your OK.";

// ───────────────────────── The System in pictures ─────────────────────────

export const SCENE: { titre: string; etapes: EtapeScene[]; sousScene: string } = {
  titre: "The System in pictures",
  etapes: [
    {
      texte: "Ads, inserts and the Google profile bring in a new customer.",
    },
    { texte: "They order on the restaurant's app." },
    { texte: "The printer prints the order." },
    { texte: "The delivery goes out, or the customer picks it up." },
    {
      texte:
        "The customer gets their points and a Google review request, and later a text that brings them back.",
      // If Reviews That Pay Off is not available, the step is written without the review request.
      sansAvis: "The customer gets their points, and later a text that brings them back.",
    },
    {
      texte:
        "In the evening, the owner gets a text with the day's orders. On Monday, they get their Monday Text.",
    },
  ],
  sousScene: "It's all connected: we find the customer, your app serves them, and we bring them back.",
};

// ───────────────────────── The System, layer by layer ─────────────────────────

const COUCHES_BRUTES: Couche[] = [
  {
    titre: "We bring you the customer",
    texte: "Even before your launch, we go find your first customers, at our cost.",
    pieces: [
      { nom: "The launch ads", icone: "pub", id: "blitz" },
      { nom: "Your Google profile", icone: "google", href: "/en/platform/google-visibility" },
      { nom: "Our inserts in every bag", icone: "cartons" },
      { nom: "Referrals", icone: "cadeau", id: "parrainage" },
    ],
  },
  {
    titre: "They order from you",
    texte: "On your own branded app, with a menu that suggests extras at the right time. Not on a platform.",
    pieces: [
      { nom: "Your own branded app", icone: "app", id: "app-a-ton-nom" },
      { nom: "The Menu That Sells", icone: "menu", id: "menu-qui-vend" },
      { nom: "Online ordering", icone: "panier", href: "/en/platform/online-ordering" },
    ],
  },
  {
    titre: "The order comes out on its own",
    texte: "It prints in the kitchen. The delivery goes out, or the customer picks it up.",
    pieces: [
      { nom: "The kitchen printer", icone: "imprimante", id: "zero-double-saisie" },
      { nom: "Delivery", icone: "livraison", id: "livraison-incluse" },
      { nom: "The Platform Price Tune-Up", icone: "reglage", id: "reglage-plateformes" },
    ],
  },
  {
    titre: "They come back",
    texte: "Their points, rewards and a well-timed text bring them back to you.",
    pieces: [
      { nom: "Points and rewards", icone: "points", id: "clients-fideles" },
      { nom: "Text reminders", icone: "texto", href: "/en/platform/customer-winback" },
      { nom: "Gift cards", icone: "cadeau", id: "cartes-cadeaux" },
    ],
  },
  {
    titre: "You see everything, without managing anything",
    texte: "A text every evening your first week, the Monday Text after that, and a team that speaks your language.",
    pieces: [
      { nom: "The Monday Text", icone: "lundi", id: "texto-lundi" },
      { nom: "Your Online Department", icone: "equipe", id: "departement-en-ligne" },
      { nom: "Your customers belong to you", icone: "clientele", id: "clientele-appartient" },
    ],
  },
];

export const COUCHES: Couche[] = COUCHES_BRUTES.map((c) => ({
  ...c,
  pieces: c.pieces
    .filter((p) => !p.id || pret(p.id))
    .map((p) => ({ ...p, href: p.href ?? (p.id ? PAGE_DE_PIECE[p.id] : undefined) })),
}));

// ───────────────────────── Visuals (examples) ─────────────────────────
// Every name and every number is an example. No real customer.

export const NOM_RESTO_EXEMPLE = "Your Restaurant";
export const MENTION_EXEMPLE = "example";

export const VISUELS = {
  menu: [
    ["Classic poutine", "$9.50"],
    ["12-inch pizza", "$18"],
    ["Lunch combo", "$14"],
    ["12-inch sub", "$13"],
    ["Caesar salad", "$11"],
  ],
  ficheBouton: "Order",
  ficheNote: "4.8",
  calendrierMois: ["January", "February", "March"],
  blitzPub: "$300 paid by us",
  blitzItems: ["Counter signs", "Poster", "Inserts"],
  fideliteTexto: "Missing your pizza? Double points tonight.",
  fidelitePoints: FR.VISUELS.fidelitePoints,
  fidelitePointsMax: FR.VISUELS.fidelitePointsMax,
  avisTexte: "Really good, fast delivery.",
  avisEtoiles: FR.VISUELS.avisEtoiles,
  avisReponseProposee: "Thanks! See you next time.",
  avisOk: "OK",
  textoSoir: "Tonight: 7 direct orders.",
  textoLundi: "This week: 31 orders, 12 new customers, $486 brought in.",
  livraisonTexto: "Your order is on its way.",
};

// ───────────────────────── End of page ─────────────────────────

export const FIN = {
  texte:
    "We bring you new customers, we bring them back, and your app pays for its subscription every month, or you don't pay it. Everything is done for you, locally.",
  titre: `${NOM_OFFRE}: your spot in the next cohort`,
  boutons: {
    calcul: "Calculate what you'd have kept",
    reserver: "Reserve your spot",
    appel: "Talk to Guillaume for 15 minutes",
  },
  barreCollante: "Calculate your number",
};

// ───────────────────────── Calculator ─────────────────────────

export const CALCULATEUR = {
  surtitre: "The calculator",
  titre: "Your statement, read by AI in 30 seconds",
  sousTitre: "Upload your platform statement. AI reads your numbers and shows you the sales your app can go after, and what's left for you on top.",
  apercuBadge: "What you'll see",
  apercuNote: "Example of our offer: restaurant doing $5,000 a month on a 25% platform, $3,000 moving to your app, 40 orders from new customers, prices +10% on the platform if your agreement allows it. Your own numbers come from your statement.",
  ventesTitre: "Your sales on your app",
  ventesSuffixe: "a month, on your own branded app",
  ventesDont: "including {n} from new customers",
  resteTitre: "Extra left for you, subscription paid",
  scoreTitre: "Platform score",
  deposerTitre: "Drop your statement here",
  deposerAide: "or click to choose it. On your phone, you can take a photo of it.",
  deposerFormats: "PDF, JPG or PNG · 10 MB max",
  deposerChanger: "Change file",
  plateformes: FR.CALCULATEUR.plateformes,
  etapes: ["Upload", "AI reading", "Check", "Result"],
  televerserTitre: "Upload your platform statement",
  televerserAide:
    "DoorDash, Uber Eats or Skip. PDF or photo, in French or English.",
  /** Text to be validated by the lawyer (as with the French version). */
  consentement:
    "I agree that Resto Action analyzes my statement with an artificial intelligence tool (Anthropic, hosted outside Québec) to calculate my estimate. The file is deleted as soon as it's analyzed. The extracted numbers are kept in our follow-up tool to contact me again, never sold or given to other companies.",
  boutonAnalyser: "Analyze my statement",
  boutonManuel: "Enter my numbers by hand",
  lectureEnCours: "Reading your statement…",
  lectureEchec:
    "We couldn't read your statement. Enter your numbers by hand.",
  verifierTitre: "Check your numbers",
  verifierAide: "Fix anything that doesn't match your statement, then calculate.",
  boutonCalculer: "Calculate my estimate",
  resultatPrefixe: "your estimate: about",
  scenarioNote: "Scenario chosen: {n} orders from new customers a month. Change it below.",
  resultatSuffixe: "a month",
  commentOnCalcule: "How we calculate",
  partApp: "Share of your customers moving to your app",
  prixAjustes: "Prices +10% on what stays on the platform",
  siEntente: "if your agreement allows it",
  scenario: "New orders per month",
  scenarios: FR.CALCULATEUR.scenarios,
  aliments: "Food cost",
  seuilPrefixe: "Your app pays for itself with",
  seuilSuffixe: "orders from new customers a month.",
  economieNegative:
    "At your rate, the platform savings are small. Your gain will come from new customers.",
  avertissement:
    "Estimate based on your statement and assumptions you can change. It's not a promise of results.",
  dossierTitre: "The Partner File",
  dossierAide:
    "One page with your numbers, easy to forward to your partner or your accountant.",
  dossierBouton: "See my file",
  consentementTextos: "I agree to receive text messages from Resto Action.",
  boutonReserver: `Reserve your spot in ${NOM_OFFRE}`,
  boutonAppel: "Talk to Guillaume for 15 minutes",
  champs: {
    plateforme: "Platform",
    periodeJours: "Statement period (days)",
    nbLivraison: "Delivery orders",
    nbCueillette: "Pickup orders",
    ventes: "Food and drink sales",
    commissions: "Commissions taken by the platform",
    autresFrais: "Other fees",
    tauxLivraison: "Platform delivery rate",
    tauxCueillette: "Platform pickup rate",
    partLivraison: "Delivery share",
    prenom: "First name",
    resto: "Restaurant",
    ville: "City",
    cellulaire: "Cell phone",
    courriel: "Email",
  },
  moteurs: {
    recupere: "Money recovered from the platforms",
    ajustes: "Prices adjusted on the platform",
    nouvelles: "New sales",
    abonnement: "The subscription",
  },
};

// ───────────────────────── Nav ─────────────────────────

export const NAV = {
  liens: [
    { label: "How it works", href: ANCRES.commentCaMarche },
    { label: "Calculator", href: ANCRES.calculateur },
    { label: "Pricing", href: ANCRES.prix },
    { label: "FAQ", href: ANCRES.faq },
  ],
  bouton: "Reserve your spot",
};

export const PIED = {
  entreprise: "Resto Action, a Studio LT product, Trois-Rivières, Québec.",
  liens: [
    { label: "Terms", href: "/en/founder-terms" },
    { label: "Privacy", href: "/en/privacy" },
  ],
};

// ───────────────────────── Helpers ─────────────────────────

const INDEX_PIECES: Record<string, Piece> = Object.fromEntries(
  [...GROUPES.flatMap((g) => g.pieces), ...BONUS].map((p) => [p.id, p]),
);

/** True if every listed piece is available (or if none is listed). */
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

/** A value shows only with 2 real submissions. */
export function valeurAffichable(p: Piece): number | null {
  return p.soumissions === 2 && p.valeur != null ? p.valeur : null;
}

/** Total shown only when every displayed piece and bonus has a value. */
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

/** Number of available pieces (for the checklist grid). */
export function nombrePieces(): number {
  return piecesDisponibles().reduce((n, g) => n + g.pieces.length, 0);
}
