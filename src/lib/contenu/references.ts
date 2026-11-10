import { RESTOS_PAR_MOIS } from "@/lib/contenu/grand-lancement";

/* LE PROGRAMME DE RÉFÉRENCES (/references), VERSION SIMPLE.

   Pas de base de données ni de compte pour l'instant : la personne lit
   comment ça marche, laisse ses coordonnées, et on la rappelle. Le formulaire
   part par courriel à l'équipe (/api/reference).

   À DISTINGUER de la pièce « Le Parrainage » de grand-lancement.ts, qui est
   le parrainage entre les CLIENTS d'un resto, dans son app.

   LES MONTANTS SONT DES PROPOSITIONS [À CONFIRMER] (prompt du 9 nov.). Ils ne
   s'affichent pas tant que AFFICHER_MONTANTS est faux : la page dit alors que
   la récompense est confirmée par écrit avec chaque personne. */

export const AFFICHER_MONTANTS = false;

export const MONTANTS = {
  /** [À CONFIRMER] Crédit sur l'abonnement du resto client, 1er et 2e resto signés. */
  parrainCredit: 300,
  /** [À CONFIRMER] À partir du 3e resto signé. */
  parrainCredit3Plus: 400,
  /** [À CONFIRMER] Pub de plus dans le Blitz du resto référé (400 $ au lieu de 300 $). */
  refereBonusPub: 100,
  /** [À CONFIRMER] Commission fixe d'un fournisseur ou d'un pro, sur facture. */
  fournisseurCommission: 250,
  /** [À CONFIRMER] Récompense libérée après ce nombre d'abonnements mensuels payés par le référé. */
  abonnementsAvantRecompense: 2,
};

export type Profil = "resto" | "fournisseur" | "pro" | "autre";

export const REFERENCES = {
  surtitre: "Programme de références",
  titre: "Tu connais un resto qui laisse trop d'argent aux plateformes? Présente-le-nous.",
  sousTitre:
    "Resto client, fournisseur, comptable ou conseiller : tu nous présentes un resto, on s'occupe de tout, et tu es récompensé quand il est en ligne.",
  bouton: "Je veux référer un resto",

  etapesTitre: "Comment ça marche",
  etapes: [
    { titre: "Tu laisses tes coordonnées", texte: "Deux minutes, avec le formulaire plus bas." },
    { titre: "On t'appelle", texte: "On t'explique le programme et on s'entend sur ta récompense, par écrit." },
    { titre: "Tu nous présentes un resto", texte: "Avec son accord. On l'appelle, on fait la rencontre, on s'occupe de tout." },
    { titre: "Il est en ligne : tu es récompensé", texte: "Quand il a payé ses premiers mois d'abonnement." },
  ],

  pourQuiTitre: "Ce que tu reçois",
  pourQui: [
    {
      profil: "Tu es un resto client",
      texte: "Un crédit sur ton abonnement pour chaque resto qui signe.",
      montant: (m: typeof MONTANTS) => `${m.parrainCredit} $ de crédit par resto, ${m.parrainCredit3Plus} $ à partir du 3e.`,
    },
    {
      profil: "Tu es un fournisseur de restos",
      texte: "Équipement, distribution, emballages, caisses, assurances… Une commission sur facture, ou on te présente à nos restos en retour.",
      montant: (m: typeof MONTANTS) => `${m.fournisseurCommission} $ par resto en ligne, sur ta facture.`,
    },
    {
      profil: "Tu es comptable, conseiller ou une association",
      texte: "Une commission sur facture, et un service de plus à offrir à tes clients restaurateurs.",
      montant: (m: typeof MONTANTS) => `${m.fournisseurCommission} $ par resto en ligne, sur ta facture.`,
    },
  ],
  confirmeParEcrit: "Le montant est confirmé avec toi, par écrit, avant ta première référence.",
  refere: "Le resto que tu présentes a aussi un petit plus à son lancement.",
  refereMontant: (m: typeof MONTANTS) => `Le resto que tu présentes reçoit ${m.refereBonusPub} $ de pub de plus à son lancement.`,

  reglesTitre: "Les règles, simplement",
  regles: [
    "Le resto doit être d'accord pour qu'on le contacte.",
    `Il part avec une cohorte comme tout le monde : on lance ${RESTOS_PAR_MOIS} restos par mois.`,
    "Un resto déjà en discussion avec nous ne compte pas.",
    "Un seul référent par resto : le premier qui nous le présente.",
    "Aucun paiement à faire sur le site, jamais.",
  ],
  conditionsNote: "Les conditions complètes te sont remises avec l'entente.",

  formulaireTitre: "Laisse-nous tes coordonnées",
  formulaireAide: "On te rappelle sous peu pour t'expliquer le reste.",
  profils: [
    { id: "resto", nom: "Resto client" },
    { id: "fournisseur", nom: "Fournisseur de restos" },
    { id: "pro", nom: "Comptable ou conseiller" },
    { id: "autre", nom: "Autre" },
  ] as { id: Profil; nom: string }[],
  champs: {
    profil: "Tu es…",
    nom: "Ton nom",
    entreprise: "Ton resto ou ton entreprise",
    courriel: "Courriel",
    telephone: "Téléphone",
    region: "Ville ou région",
    restoEnTete: "As-tu déjà un resto en tête? (optionnel)",
    restoEnTeteAide: "Le nom du resto et sa ville.",
  },
  consentementRefere: "Ce resto m'a dit qu'il voulait en savoir plus, et je l'ai prévenu que quelqu'un de Resto Action allait le contacter.",
  consentementContact: "J'accepte que Resto Action me contacte au sujet du programme de références.",
  boutonEnvoyer: "Envoyer",
  merciTitre: "Merci! On te contacte sous peu.",
  merciTexte: "On a bien reçu ta demande. Tu vas aussi recevoir un courriel de confirmation.",
  erreur: "Ça n'a pas marché. Réessaie, ou appelle-nous au {tel}.",

  /** Courriel d'accusé de réception. À RELIRE. */
  courriel: {
    sujet: "On a bien reçu ta demande",
    salut: "Bonjour {prenom},",
    corps: "Merci de vouloir nous présenter des restos. On te rappelle sous peu pour t'expliquer le programme et s'entendre sur ta récompense, par écrit.",
    question: "Une question d'ici là? Réponds à ce courriel ou appelle-nous au {tel}.",
  },
};

export const REFERENCES_EN: typeof REFERENCES = {
  surtitre: "Referral program",
  titre: "Know a restaurant that leaves too much money to the platforms? Introduce us.",
  sousTitre:
    "Restaurant client, supplier, accountant or advisor: you introduce us to a restaurant, we handle everything, and you're rewarded once it's live.",
  bouton: "I want to refer a restaurant",

  etapesTitre: "How it works",
  etapes: [
    { titre: "You leave your details", texte: "Two minutes, with the form below." },
    { titre: "We call you", texte: "We explain the program and agree on your reward, in writing." },
    { titre: "You introduce us to a restaurant", texte: "With their OK. We call them, we meet them, we handle everything." },
    { titre: "They're live: you're rewarded", texte: "Once they've paid their first months of subscription." },
  ],

  pourQuiTitre: "What you get",
  pourQui: [
    {
      profil: "You're a restaurant client",
      texte: "A credit on your subscription for every restaurant that signs.",
      montant: (m: typeof MONTANTS) => `$${m.parrainCredit} credit per restaurant, $${m.parrainCredit3Plus} from the 3rd one.`,
    },
    {
      profil: "You're a restaurant supplier",
      texte: "Equipment, distribution, packaging, point of sale, insurance… A commission on invoice, or we introduce you to our restaurants in return.",
      montant: (m: typeof MONTANTS) => `$${m.fournisseurCommission} per restaurant live, on your invoice.`,
    },
    {
      profil: "You're an accountant, an advisor or an association",
      texte: "A commission on invoice, and one more service to offer your restaurant clients.",
      montant: (m: typeof MONTANTS) => `$${m.fournisseurCommission} per restaurant live, on your invoice.`,
    },
  ],
  confirmeParEcrit: "The amount is confirmed with you, in writing, before your first referral.",
  refere: "The restaurant you introduce also gets a little extra at launch.",
  refereMontant: (m: typeof MONTANTS) => `The restaurant you introduce gets $${m.refereBonusPub} more in ads at launch.`,

  reglesTitre: "The rules, simply",
  regles: [
    "The restaurant has to agree to be contacted.",
    `They launch with a cohort like everyone else: we launch ${RESTOS_PAR_MOIS} restaurants a month.`,
    "A restaurant already in talks with us doesn't count.",
    "One referrer per restaurant: the first one to introduce them.",
    "No payment to make on the site, ever.",
  ],
  conditionsNote: "The full terms are given to you with the agreement.",

  formulaireTitre: "Leave us your details",
  formulaireAide: "We'll call you back shortly to explain the rest.",
  profils: [
    { id: "resto", nom: "Restaurant client" },
    { id: "fournisseur", nom: "Restaurant supplier" },
    { id: "pro", nom: "Accountant or advisor" },
    { id: "autre", nom: "Other" },
  ],
  champs: {
    profil: "You are…",
    nom: "Your name",
    entreprise: "Your restaurant or your business",
    courriel: "Email",
    telephone: "Phone",
    region: "City or region",
    restoEnTete: "Do you already have a restaurant in mind? (optional)",
    restoEnTeteAide: "The restaurant's name and city.",
  },
  consentementRefere: "This restaurant told me they wanted to know more, and I let them know someone from Resto Action would contact them.",
  consentementContact: "I agree that Resto Action may contact me about the referral program.",
  boutonEnvoyer: "Send",
  merciTitre: "Thanks! We'll be in touch shortly.",
  merciTexte: "We got your request. You'll also receive a confirmation email.",
  erreur: "That didn't work. Try again, or call us at {tel}.",

  courriel: {
    sujet: "We got your request",
    salut: "Hi {prenom},",
    corps: "Thanks for wanting to introduce us to restaurants. We'll call you back shortly to explain the program and agree on your reward, in writing.",
    question: "A question before then? Reply to this email or call us at {tel}.",
  },
};
