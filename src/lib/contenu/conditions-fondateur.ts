import {
  FAQ,
  GARANTIES,
  GARANTIES_CONDITION,
  MISE_EN_SERVICE_ACTUELLE,
  MISE_EN_SERVICE_ENSUITE,
  disponible,
} from "@/lib/contenu/grand-lancement";

/* LES CONDITIONS DU GRAND LANCEMENT D'HIVER, dans les deux langues.

   C'est ce que le resto accepte en cochant la case de /reserver. La réservation
   est gratuite (6 nov. 2026) : plus de dépôt, la mise en service se paie à la
   signature du bon d'accord. La version (CONDITIONS_VERSION) part au CRM avec
   la réservation : on sait quelle version chaque resto a acceptée.

   À VALIDER PAR L'AVOCAT. Le contrat de service doit reprendre ces conditions
   mot pour mot sur les points communs. Les 4 garanties et le calcul viennent
   de grand-lancement.ts : le texte est identique à celui de l'accueil. Toute
   modification de fond : changer CONDITIONS_VERSION, ne jamais réécrire une
   version déjà acceptée sans la dater de nouveau.

   Les montants doivent rester identiques à `offre` et `lancement` dans
   src/lib/textes/fr.ts et en.ts. */
export const CONDITIONS_VERSION = "2026-11-07";

const GARANTIES_TEXTE = `${GARANTIES.map((g) => `${g.nom} : « ${g.texte} »`).join(" ")} ${GARANTIES_CONDITION}`;
const CALCUL_TEXTE = FAQ.questions.find((q) => q.id === "faq-calcul-garantie")?.reponse ?? "";
const MES = (n: number) => n.toLocaleString("fr-CA");

export const CONDITIONS_FR = {
  metaTitre: "Conditions du Grand Lancement d'hiver",
  metaDescription:
    "Ce que comprend ta place dans le Grand Lancement d'hiver : réservation gratuite, mise en service payée à la signature, abonnement de 200 $ par mois dès la mise en ligne, et 4 garanties sur tes résultats.",
  surTitre: "Grand Lancement d'hiver",
  titre: "Conditions du Grand Lancement d'hiver",
  intro:
    "Voici, en clair, ce que tu acceptes en réservant ta place. Resto Action est une marque de Studios LT inc. (Trois-Rivières, Québec), désignée ici par « nous ». À valider par l'avocat avant la mise en ligne.",
  sections: [
    {
      titre: "1. Ce que tu réserves",
      texte:
        "Une place dans la prochaine cohorte du Grand Lancement d'hiver (janvier 2027) pour un établissement. On lance au plus 16 restos par mois au Québec, 4 par semaine. Ta réservation est gratuite : ta place est confirmée à la signature de ton bon d'accord. Pour en faire partie, signe avant le vendredi 18 décembre 2026; après, tu pars avec la cohorte suivante, un mois plus tard.",
    },
    {
      titre: "2. La mise en service",
      texte: `Aucun dépôt. La mise en service est de ${MES(MISE_EN_SERVICE_ACTUELLE)} $ pour le Grand Lancement d'hiver, puis de ${MES(MISE_EN_SERVICE_ENSUITE)} $, une hausse annoncée d'avance. Elle se paie à la signature de ton bon d'accord, plus TPS et TVQ, et couvre ton installation, ta formation privée et ta Boîte de lancement. Ton imprimante est offerte et t'appartient. Ta facture, avec nos numéros de taxes, t'est envoyée par courriel. [À valider par l'avocat]`,
    },
    {
      titre: "3. Le prix, tout compris",
      texte:
        "Abonnement : 200 $ par mois, dès ta mise en ligne. Livraison : 10 % des aliments et boissons + 3,51 $ par livraison (la course au prix coûtant : ce qu'elle nous coûte, moins les 4,99 $ que paie ton client). Cueillette : 5 % + 0,30 $ par commande. Frais de carte inclus. Aucun minimum de commande. L'imprimante est offerte. Taxes en sus.",
    },
    {
      titre: "4. Les 4 garanties",
      texte: `${GARANTIES_TEXTE} [À valider par l'avocat]`,
    },
    {
      titre: "5. Comment on calcule les garanties 3 et 4",
      texte: CALCUL_TEXTE,
    },
    {
      titre: "6. Ce qui expire à la date limite",
      texte:
        "Si tu signes avant le vendredi 18 décembre 2026 : la pénalité de ton fournisseur actuel est créditée jusqu'à 400 $ sur preuve (Le Crédit de sortie), et ton abonnement de 200 $ par mois est gelé 24 mois (Ton Prix gelé).",
    },
    {
      titre: "7. Le Réglage Plateformes",
      texte:
        "On lit tes ententes et on monte tes prix de 10 à 15 % sur les plateformes dès le jour 1, si ton entente le permet. Sur Uber Eats, des prix plus hauts qu'en salle font passer la cueillette de 10 à 15 % : on le vérifie avec toi.",
    },
    {
      titre: "8. Ta clientèle t'appartient",
      texte:
        "Ta liste de clients, ton domaine et ta fiche Google sont à ton nom. Si tu pars, tu les gardes.",
    },
    {
      titre: "9. Le contrat de service",
      texte:
        "À la signature, tu reçois ton bon d'accord et le contrat de service complet, avec son annexe. Ils reprennent les conditions de cette page. Ta mise en ligne se fait seulement une fois le contrat signé et la mise en service payée.",
    },
    {
      titre: "10. Ton dossier",
      texte:
        "Après ta signature, tu reçois par courriel le lien de ton dossier privé : tu y vois en tout temps où en est ton app, le prochain point avec nous et ta date de lancement. On t'écrit chaque fois qu'il avance.",
    },
  ],
  questions: "Une question sur ces conditions? Écris-nous à {courriel} ou appelle-nous au {tel}.",
  version: "Version du {date}",
};

export type ConditionsFondateur = typeof CONDITIONS_FR;

/* L'ANGLAIS. Les garanties et le calcul sont traduits ici plutôt que lus dans
   grand-lancement.ts (qui est en français). Ils doivent dire exactement la
   même chose que GARANTIES, GARANTIES_CONDITION et la question
   « faq-calcul-garantie » : toute modification de l'un se reporte ici. */
const MES_EN = (n: number) => n.toLocaleString("en-CA");

/** Les canaux qui amènent un nouveau client, comme CANAUX dans grand-lancement.ts. */
const CANAUX_EN = [
  "ads",
  disponible({ dependDe: ["parrainage"] }) && "referrals",
  disponible({ dependDe: ["cartes-cadeaux"] }) && "gift cards",
  "Google listing",
]
  .filter((x): x is string => Boolean(x))
  .join(", ");

const GARANTIES_EN: Record<(typeof GARANTIES)[number]["id"], { nom: string; texte: string }> = {
  chrono: {
    nom: "48 Hours Flat",
    texte:
      "Send us your menu, your photos and your access within 5 days: your app is ready in 48 hours and you're live by your date. Otherwise, your first month is free.",
  },
  imprimante: {
    nom: "The Busy Printer",
    texte:
      "If your app doesn't get 10 orders in your first 7 days, we add $100 of ads every week, on our dime, until you get them.",
  },
  gratuit: {
    nom: "It Pays Off or It's Free",
    texte:
      "Your app pays for its subscription every month, in savings or in new sales. Otherwise, you don't pay it.",
  },
  boomerang: {
    nom: "Boomerang Money",
    texte:
      "If your app hasn't brought you at least your setup fee in your first 90 days, we refund it. You keep your printer, and you stay or you leave: it's your call.",
  },
};

const GARANTIES_CONDITION_EN =
  "For all 4 guarantees: your plaques and your sign in place, and our cards in your bags. The 1st also requires your menu, your photos and your access within 5 days. The same month is never credited twice.";

const GARANTIES_TEXTE_EN = `${GARANTIES.filter((g) => GARANTIES_EN[g.id])
  .map((g) => `${GARANTIES_EN[g.id].nom}: "${GARANTIES_EN[g.id].texte}"`)
  .join(" ")} ${GARANTIES_CONDITION_EN}`;

const CALCUL_TEXTE_EN = `Every month, we add up what you saved on the orders that came from the platforms (at the rate on your statement) and $10 per order from a new customer who came in through one of our channels (${CANAUX_EN}). If the total doesn't cover your subscription, you don't pay it that month. For the 4th: if the total for your first 90 days doesn't cover your setup fee, we refund it.`;

export const CONDITIONS_EN: ConditionsFondateur = {
  metaTitre: "The Big Winter Launch terms",
  metaDescription:
    "What your spot in The Big Winter Launch includes: free reservation, setup fee paid at signing, a $200 monthly subscription from go-live, and 4 guarantees on your results.",
  surTitre: "The Big Winter Launch",
  titre: "The Big Winter Launch terms",
  intro:
    "Here, in plain words, is what you agree to when you reserve your spot. Resto Action is a brand of Studios LT inc. (Trois-Rivières, Québec), referred to here as \"we\". To be validated by the lawyer before going live.",
  sections: [
    {
      titre: "1. What you reserve",
      texte:
        "A spot in the next cohort of The Big Winter Launch (January 2027) for one location. We launch at most 16 restaurants a month in Quebec, 4 a week. Your reservation is free: your spot is confirmed when you sign your agreement. To be part of it, sign before Friday, December 18, 2026; after that, you launch with the next cohort, one month later.",
    },
    {
      titre: "2. The setup fee",
      texte: `No deposit. The setup fee is $${MES_EN(MISE_EN_SERVICE_ACTUELLE)} for The Big Winter Launch, then $${MES_EN(MISE_EN_SERVICE_ENSUITE)}, an increase announced in advance. It is paid when you sign your agreement, plus GST and QST, and covers your installation, your private training and your Launch Box. Your printer is included at no cost and belongs to you. Your invoice, with our tax numbers, is sent to you by email. [To be validated by the lawyer]`,
    },
    {
      titre: "3. The price, all in",
      texte:
        "Subscription: $200 per month, from your go-live. Delivery: 10% of food and drinks + $3.51 per delivery (the run at cost: what it costs us, minus the $4.99 your customer pays). Pickup: 5% + $0.30 per order. Card fees included. No minimum order. The printer is included at no cost. Taxes extra.",
    },
    {
      titre: "4. The 4 guarantees",
      texte: `${GARANTIES_TEXTE_EN} [To be validated by the lawyer]`,
    },
    {
      titre: "5. How we calculate guarantees 3 and 4",
      texte: CALCUL_TEXTE_EN,
    },
    {
      titre: "6. What expires at the deadline",
      texte:
        "If you sign before Friday, December 18, 2026: your current provider's penalty is credited up to $400 with proof (The Exit Credit), and your $200 monthly subscription is frozen for 24 months (Your Frozen Price).",
    },
    {
      titre: "7. The Platform Pricing Tune-Up",
      texte:
        "We read your agreements and raise your prices on the platforms by 10 to 15% from day 1, if your agreement allows it. On Uber Eats, prices higher than dine-in move pickup from 10 to 15%: we check it with you.",
    },
    {
      titre: "8. Your customers belong to you",
      texte:
        "Your customer list, your domain and your Google listing are in your name. If you leave, you keep them.",
    },
    {
      titre: "9. The service agreement",
      texte:
        "At signing, you receive your agreement and the full service agreement, with its schedule. They carry over the terms on this page. Your app goes live only once the agreement is signed and the setup fee is paid.",
    },
    {
      titre: "10. Your file",
      texte:
        "After you sign, you receive by email the link to your private file: it shows at any time where your app is at, your next check-in with us and your launch date. We email you each time it moves forward.",
    },
  ],
  questions: "A question about these terms? Email us at {courriel} or call us at {tel}.",
  version: "Version of {date}",
};
