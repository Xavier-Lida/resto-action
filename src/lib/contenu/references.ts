import { DATE_LIMITE, PUB_LANCEMENT, RESTOS_PAR_MOIS } from "@/lib/contenu/grand-lancement";
import { TEMOIN_REFERENCE_JOURS } from "@/lib/provenance";

/* RÉFÈRE UN RESTO : tout le contenu du programme de références.

   Trois volets (prompt claude/prompt-parrainage-site.md, décisions du 10 nov.) :
     A. un resto CLIENT réfère un autre resto (crédit sur son abonnement);
     B. un PARTENAIRE référent (fournisseur, comptable, conseiller, association,
        agence) nous envoie ses clients restos (commission sur facture ou
        échange, jamais un crédit d'abonnement);
     C. nous, on présente nos restos à des fournisseurs (avantages partenaires).

   À DISTINGUER de la pièce « Le Parrainage » de grand-lancement.ts : c'est le
   parrainage entre les CLIENTS d'un resto, dans son app. On n'y touche pas.

   RÈGLES DE CE FICHIER
   - Montants et délais : tranchés par Guillaume le 10 nov. [CONFIRMÉ].
     Ils ne s'affichent quand même nulle part tant que AFFICHER_MONTANTS est
     faux (on attend l'entente de l'avocat).
   - Tout texte marqué [À RELIRE] attend la relecture de Guillaume.
   - Tout texte marqué [À VALIDER PAR L'AVOCAT] attend l'avocat.
   - Pas de base de données dans le site : les événements partent par
     src/lib/references/envoi.ts (CRM si CRM_REFERENCES_URL, sinon courriel).
   - Pas de paiement ni de dépôt sur le site, jamais. */

// ───────────────────────── Le nom et les adresses ─────────────────────────

export const NOM_PROGRAMME = "Réfère un resto";
export const NOM_PROGRAMME_EN = "Refer a Restaurant";

export const ROUTES_REFERENCES = {
  page: "/refere-un-resto",
  /** Non publiée tant que SUIVI_ACTIF est faux (hors plan du site, hors liens). */
  suivi: "/refere-un-resto/suivi",
  /** Non publiée tant que CONDITIONS_PRETES est faux. */
  conditions: "/conditions-refere-un-resto",
  /** Le lien court d'un resto client : /p/CODE. */
  lienClient: "/p/",
  /** Le lien court d'un partenaire (fournisseur ou professionnel) : /f/CODE. */
  lienPartenaire: "/f/",
} as const;

// ───────────────────────── Les interrupteurs ─────────────────────────

/** Les montants (crédits, bonus, commissions) s'affichent sur les pages. */
export const AFFICHER_MONTANTS = true; // 12 nov. : Guillaume veut les montants sur la page (confirmés le 10 nov.)
/** L'entente type des partenaires référents est prête (avocat). Sans elle, aucune formule ni commission ne s'affiche. */
export const ENTENTE_TYPE_PRETE = false;
/** L'espace /refere-un-resto/suivi est branché sur le CRM. Sinon : page « bientôt », non publiée. */
export const SUIVI_ACTIF = false;
/** Le texte de l'avocat a remplacé le gabarit des conditions. Sinon : page non publiée. */
export const CONDITIONS_PRETES = false;

// ───────────────────────── Les montants et les délais ─────────────────────────

export const MONTANTS = {
  /** [CONFIRMÉ] Crédit sur l'abonnement du parrain client, 1er et 2e resto signés. */
  parrainCredit: 300,
  /** [CONFIRMÉ] Crédit à partir du 3e resto signé. Pas de plafond. */
  parrainCredit3Plus: 400,
  /** [CONFIRMÉ] Pub de plus dans le lancement du resto référé. */
  refereBonusPub: 100,
  /** [CONFIRMÉ] Commission fixe d'un partenaire (formule « commission »), sur sa facture. */
  fournisseurCommission: 250,
  /** [CONFIRMÉ] Formule « mixte » : moins d'argent (150 $ au lieu de 250 $), mais on présente
      aussi le partenaire à nos restos. Utile pour un fournisseur qui veut surtout des clients. */
  fournisseurCommissionMixte: 150,
  /** [CONFIRMÉ] Récompense libérée après ce nombre d'abonnements mensuels payés par le référé. */
  abonnementsAvantRecompense: 2,
};

export const DELAIS = {
  /** [CONFIRMÉ] Un resto déjà dans le CRM dans ces jours-là est un doublon. */
  fenetreDoublonJours: 60,
  /** [CONFIRMÉ] Protection d'une présentation faite par un partenaire. */
  protectionPartenaireJours: 60,
  /** [CONFIRMÉ] Durée du témoin d'attribution (premier contact gagne). */
  temoinAttributionJours: TEMOIN_REFERENCE_JOURS, // 30, défini dans provenance.ts
  /** [CONFIRMÉ] Durée de conservation des données transmises à un fournisseur (volet C). */
  conservationFournisseurMois: 12,
};

/** Le total de pub du référé (300 $ + 100 $). */
export const PUB_REFERE = PUB_LANCEMENT + MONTANTS.refereBonusPub;

// ───────────────────────── Les textes du programme ─────────────────────────

export const REFERE_UN_RESTO = {
  /* La page /refere-un-resto, dans l'ordre. [À RELIRE] */
  page: {
    surtitre: NOM_PROGRAMME,
    titre: "Tu connais un resto qui laisse trop d'argent aux plateformes? Présente-le-nous.",
    sousTitre:
      "Tu nous présentes un resto, on s'occupe de tout, et tu es récompensé quand il est en ligne. Le resto que tu présentes a lui aussi un plus à son lancement.",
    boutonClient: "Je veux mon lien",
    boutonResto: "J'ai un resto",
    boutonPro: "Je suis un pro",
    boutonClientConnecte: "Je suis déjà client, envoie-moi mon lien",
    boutonPartenaire: "Devenir partenaire référent",

    etapesTitre: "Comment ça marche",
    etapes: [
      { titre: "Tu partages ton lien", texte: "Par texto ou par courriel, à un proprio que tu connais." },
      { titre: "Ton ami réserve sa place", texte: "On l'appelle, on fait la rencontre, on s'occupe de tout." },
      { titre: `Il est en ligne et il paie ses ${MONTANTS.abonnementsAvantRecompense} premiers mois`, texte: `Ses ${MONTANTS.abonnementsAvantRecompense} premiers abonnements sont payés.` },
      { titre: "On applique ton crédit", texte: "Sur ta prochaine facture d'abonnement." },
    ],

    gainsTitre: "Ce que gagne chacun",
    gains: {
      parrainTitre: "Toi, le parrain",
      parrain: "Un crédit sur ton abonnement pour chaque resto qui signe.",
      parrainMontant: (m: typeof MONTANTS) => `${m.parrainCredit} $ de crédit par resto, ${m.parrainCredit3Plus} $ à partir du 3e.`,
      refereTitre: "Ton ami, le resto référé",
      refere: "Plus de pub à son lancement.",
      refereMontant: (m: typeof MONTANTS) => `${PUB_LANCEMENT + m.refereBonusPub} $ de pub à son lancement au lieu de ${PUB_LANCEMENT} $.`,
      confirmeParEcrit: "Les montants te sont confirmés par écrit.",
      liberation: "Après 2 abonnements payés par ton ami, on applique ton crédit.",
      mention: "exemple, pas une promesse",
    },

    cohorte: `On lance ${RESTOS_PAR_MOIS} restos par mois. Ton ami part avec la cohorte à laquelle il est prêt, comme tout le monde.`,
    dateLimite: `Pour la cohorte de janvier, les inscriptions se terminent le ${DATE_LIMITE}.`,
    suivi: "Tu vois où en est chaque resto que tu as référé.",

    reglesTitre: "Les règles, simplement",
    regles: [
      "Pour parrainer, ton resto est déjà client, en ligne et à jour dans ses paiements.",
      "Le resto doit être d'accord pour qu'on le contacte.",
      `Un resto déjà en discussion avec nous dans les ${DELAIS.fenetreDoublonJours} derniers jours ne compte pas.`,
      "Un seul parrain par resto : le premier qui nous le présente.",
      "Ton propre resto, ou un 2e établissement à toi, ne compte pas.",
      "Aucun paiement à faire sur le site, jamais.",
    ],
    conditionsLien: "Les conditions du programme",
  },

  /* La FAQ. Les réponses sont tirées des règles ci-dessus. [À VALIDER] */
  faq: [
    { q: "Qui peut parrainer?", r: "Un resto client de Resto Action, en ligne et à jour dans ses paiements." },
    { q: "Combien de restos je peux référer?", r: "Autant que tu veux, il n'y a pas de limite." },
    { q: "Quand est-ce que je reçois mon crédit?", r: "Après 2 abonnements payés par le resto que tu as référé. On l'applique à ta prochaine facture d'abonnement." },
    { q: "Que se passe-t-il si mon ami utilise la garantie?", r: "S'il se fait rembourser avant ses 2 premiers abonnements payés, il n'y a pas de crédit." },
    { q: "Mon ami était déjà en discussion avec vous.", r: `S'il était dans nos dossiers dans les ${DELAIS.fenetreDoublonJours} derniers jours, il ne compte pas. On te le dit par courriel.` },
    { q: "Je peux référer un resto d'une autre ville?", r: "Oui, partout où on lance. Il suit la même cohorte que tout le monde." },
    { q: "Est-ce que mon ami sait que c'est moi?", r: "Oui. Quand on le contacte, on lui dit que c'est toi qui nous as parlé de lui." },
    { q: "Qu'est-ce que vous faites de ses coordonnées?", r: "On s'en sert seulement pour le contacter une fois au sujet de Resto Action. S'il ne répond pas, on s'arrête là." },
  ],

  /* Le formulaire « Présente-nous quelqu'un » (voie secondaire du volet A, et
     formulaire mobile des représentants du volet B). [À RELIRE] */
  presenteNous: {
    titre: "Présente-nous quelqu'un",
    aide: "Un seul moyen de contact suffit : le téléphone ou le courriel.",
    /* Ajouté à l'étape 4 : qui présente. [À RELIRE] */
    toiTitre: "Toi",
    toi: {
      nom: "Ton nom",
      entreprise: "Ton resto ou ton entreprise",
      courriel: "Ton courriel",
      telephone: "Ton téléphone",
      code: "Ton code, si tu en as un",
    },
    luiTitre: "Le resto que tu nous présentes",
    champs: {
      restoNom: "Le nom du resto",
      prenom: "Prénom du proprio",
      nom: "Nom du proprio",
      telephone: "Téléphone",
      courriel: "Courriel",
      ville: "Ville",
      representant: "Ton nom (représentant)",
    },
    /** Le texte EXACT de la case obligatoire. Il est copié tel quel dans l'événement envoyé. [À VALIDER PAR L'AVOCAT] */
    consentement:
      "Cette personne m'a dit qu'elle voulait en savoir plus sur Resto Action, et je l'ai prévenue que quelqu'un de l'équipe allait la contacter.",
    bouton: "Envoyer",
    merci: "Merci! On contacte ce resto une seule fois, et on te tient au courant.",
    erreur: "Ça n'a pas marché. Réessaie, ou appelle-nous au {tel}.",
  },

  /* Le choix du profil, juste sous le titre (12 nov.) : deux grandes cartes
     côte à côte, on en choisit une et sa partie de la page s'ouvre. [À RELIRE] */
  choix: {
    titre: "Choisis ton profil",
    resto: {
      etiquette: "J'ai un resto",
      qui: "Ton resto est déjà client de Resto Action",
      montant: (m: typeof MONTANTS) => `${m.parrainCredit} $`,
      sousMontant: "de rabais sur ton abonnement",
      texte: (m: typeof MONTANTS) => `Pour chaque resto que tu nous réfères. ${m.parrainCredit3Plus} $ dès le 3e, sans limite.`,
      sansMontant: "Un rabais sur ton abonnement",
      texteSansMontant: "Pour chaque resto que tu nous réfères, sans limite.",
    },
    pro: {
      etiquette: "Je suis un pro",
      qui: "Travailleur autonome, comptable, fournisseur, conseiller, agence",
      montant: (m: typeof MONTANTS) => `${m.fournisseurCommission} $`,
      sousMontant: "pour chaque resto que tu nous présentes",
      texte: `Payé quand le resto est en ligne et qu'il a payé ses 2 premiers mois.`,
      sansMontant: "Un montant pour chaque resto",
      texteSansMontant: "Payé quand le resto est en ligne et qu'il a payé ses 2 premiers mois.",
    },
    choisir: "Choisir",
    choisi: "Choisi",
  },

  /* « Je veux mon lien » : un resto client demande son lien. En mode pilote,
     l'équipe vérifie le dossier, ajoute le code dans references-codes.ts et
     répond avec le courriel « lienCree ». Ajouté à l'étape 4. [À RELIRE] */
  monLien: {
    titre: "Ton lien à toi",
    aide: "Pour les restos déjà clients. On vérifie ton dossier et on t'envoie ton lien par courriel.",
    champs: { nom: "Ton nom", resto: "Ton resto", courriel: "Courriel", telephone: "Téléphone" },
    bouton: "Envoie-moi mon lien",
    merci: "Merci! On vérifie ton dossier et on t'envoie ton lien par courriel.",
  },

  /* La page d'atterrissage /p/CODE et /f/CODE. [À RELIRE] */
  atterrissage: {
    bandeauClient: "{referent} t'a recommandé Resto Action",
    bandeauPartenaire: "Tes clients de {referent} : une offre pour eux",
    bonus: "Comme tu viens de la part de {referent}, tu as plus de pub à ton lancement.",
    bonusMontant: (m: typeof MONTANTS) => `Comme tu viens de la part de {referent}, tu as ${PUB_LANCEMENT + m.refereBonusPub} $ de pub à ton lancement au lieu de ${PUB_LANCEMENT} $.`,
    fermer: "Fermer",
    /* La même chose en anglais, pour /en. Traduction des lignes ci-dessus. [À RELIRE] */
    en: {
      bandeau: "{referent} recommended Resto Action to you",
      bonus: "Because {referent} sent you, you get more advertising at your launch.",
      bonusMontant: (m: typeof MONTANTS) =>
        `Because {referent} sent you, you get $${PUB_LANCEMENT + m.refereBonusPub} of advertising at your launch instead of $${PUB_LANCEMENT}.`,
      fermer: "Close",
    },
  },

  /* L'espace /refere-un-resto/suivi, tant qu'il n'est pas branché. */
  suiviBientot: {
    titre: "Ton espace de suivi arrive bientôt",
    texte: "En attendant, on te donne des nouvelles de chaque resto que tu nous as présenté, par courriel.",
  },

  /** Les statuts affichés au référent, en mots simples. Les raisons d'un refus ne s'affichent jamais. */
  statuts: {
    recu: "Reçu",
    contacte: "On l'a contacté",
    rdv_fait: "Rendez-vous fait",
    reserve: "Réservé",
    en_ligne: "En ligne",
    paye_1: "En ligne",
    paye_2: "En ligne",
    credit_libere: "Crédit appliqué bientôt",
    credit_applique: "Crédit appliqué",
    doublon: "Pas cette fois",
    auto_parrainage: "Pas cette fois",
    perdu: "Pas cette fois",
    rembourse_garantie: "Pas cette fois",
  },

  /** Le gabarit des conditions. La page ne se publie pas tant que ce marqueur est là. */
  conditionsGabarit: "À REMPLACER PAR LE TEXTE DE L'AVOCAT",
};

/* ─── Volet B : les partenaires référents ─── */
export const PARTENAIRES_REFERENTS = {
  /* La page publique (non publiée tant que ENTENTE_TYPE_PRETE est faux). [À RELIRE] */
  page: {
    /* La section du site, version courte (11 nov. : « trop de texte »). [À RELIRE] */
    surtitre: "Partenaires référents",
    titreA: "Tes clients restos gardent plus de leurs ventes.",
    titreB: "Présente-nous-les.",
    sousTitreCourt: "Fournisseur, comptable, conseiller ou association : un service de plus pour tes clients. Ça ne te coûte rien.",
    atouts: [
      { titre: "Rien à vendre", texte: "Ni à installer. On s'occupe de tout." },
      { titre: "Payé au résultat", texte: "Quand le resto est en ligne et a payé ses 2 premiers mois." },
      { titre: "Plus de clients pour toi", texte: "Si on s'entend, on te présente à nos restos." },
    ],
    formulaireTitre: "On te rappelle",
    titre: "Tes clients restos peuvent garder plus de leurs ventes. Présente-nous-les.",
    sousTitre: "Fournisseur, comptable, conseiller ou association : tu offres un service de plus à tes clients, sans rien vendre ni installer. Ça ne te coûte rien.",
    bouton: "Devenir partenaire référent",
    pourquoiTitre: "Pourquoi c'est bon pour toi",
    pourquoi: [
      "Tu offres un service de plus à tes clients, sans rien vendre ni installer.",
      "Tu es payé quand un resto que tu nous présentes est en ligne et qu'il a payé ses 2 premiers abonnements.",
      "Si on s'entend, on te présente aussi à nos restos.",
    ],
    etapesTitre: "Comment ça marche",
    etapes: [
      { titre: "Tu reçois ton lien et ton kit", texte: "Un lien, une carte à remettre et un texte prêt à envoyer." },
      { titre: "Ton client clique, ou tu nous le présentes", texte: "Toujours avec son accord." },
      { titre: "On s'occupe de tout", texte: "Et tu vois où il en est." },
      { titre: "Tu es payé", texte: "Quand il est en ligne et qu'il a payé ses 2 premiers abonnements." },
    ],
    jamaisTitre: "Ce qu'un partenaire ne fait jamais",
    jamais: [
      "Promettre un gain, un volume ou une date de mise en ligne.",
      "Changer un prix ou une condition.",
      "Encaisser de l'argent d'un restaurateur.",
      "Dire du mal d'un concurrent.",
    ],
    gainsSansEntente: "La formule (commission sur facture ou échange de clients) est convenue avec toi, par écrit.",
  },

  /** [CONFIRMÉ] Les trois formules. Une seule par partenaire, inscrite dans son entente. Jamais un crédit d'abonnement. */
  formules: {
    commission: (m: typeof MONTANTS) => `${m.fournisseurCommission} $ par resto en ligne qui a payé ses 2 premiers abonnements, sur ta facture.`,
    echange: () => "On ne te paie rien : on te présente à nos restos, avec un avantage pour eux.",
    mixte: (m: typeof MONTANTS) => `${m.fournisseurCommissionMixte} $ par resto, plus une présentation à nos restos.`,
  },

  /* Le formulaire « Devenir partenaire référent ». [À RELIRE] */
  candidature: {
    champs: {
      entreprise: "Ton entreprise",
      ceQuElleVend: "Ce que tu vends aux restos",
      nom: "Ton nom",
      fonction: "Ta fonction",
      courriel: "Courriel",
      telephone: "Téléphone",
      restosApprox: "Combien de restos clients, environ?",
      regions: "Tes régions",
      facon: "Comment tu veux référer",
    },
    facons: [
      { id: "lien", nom: "Un lien que j'envoie" },
      { id: "carte", nom: "Une carte que je remets au client" },
      { id: "presentation", nom: "Je vous présente le resto directement" },
    ],
    consentement: "J'accepte que Resto Action me contacte au sujet du programme de partenaires référents.",
    /* Ajoutés à l'étape 4. [À RELIRE] */
    titre: "Devenir partenaire référent",
    bouton: "Envoyer ma demande",
    merci: "Merci! On te rappelle sous peu.",
  },

  /** La carte imprimable du kit. [À RELIRE] */
  carte: {
    titre: "Garde plus de tes ventes en ligne",
    texte: "Ton app à ton nom, et on va chercher tes clients. Scanne pour voir comment.",
    marqueur: "À RELIRE",
  },

  /** Le gabarit de courriel qu'un partenaire peut envoyer à ses clients. [À RELIRE] */
  gabaritCourriel: {
    sujet: "Une façon de garder plus de tes ventes en ligne",
    corps: "Bonjour {prenom}, je travaille avec Resto Action, une équipe d'ici qui monte l'app de commande des restos à leur nom. Si tu veux voir ce que ça donnerait pour toi : {lien}",
  },
  /** La phrase à ajouter à une soumission ou une facture. [À RELIRE] */
  phraseSoumission: "Tu veux garder plus de tes ventes en ligne? Notre partenaire Resto Action : {lien}",

  /** Les catégories du pipeline des partenaires (aucun nom inventé : Guillaume les remplit). */
  categories: [
    "Équipement de cuisine",
    "Distributeur alimentaire",
    "Emballages et contenants",
    "Caisses et systèmes de vente",
    "Assurances",
    "Nettoyage et entretien de hottes",
    "Comptables de restos",
    "Associations",
    "Agences marketing",
    "Formateurs",
  ],
};

/* ─── Volet C : les avantages partenaires (tout masqué au départ) ─── */
export const AVANTAGES = {
  titre: "Les avantages partenaires",
  sousTitre: "Avec Resto Action, tu as accès aux offres de nos partenaires.",
  /** La phrase de transparence, partout où on touche une commission. */
  transparence: "Resto Action reçoit une commission du fournisseur si tu t'inscris par ce lien. Ça ne change rien à ton prix.",
  boutonPresentation: "Je veux qu'on me présente",
  boutonLien: "J'y vais directement",
  /** Le consentement propre à UN fournisseur. Rien n'est transmis sans lui. [À VALIDER PAR L'AVOCAT] */
  consentement: (fournisseur: string) =>
    `J'accepte que Resto Action transmette à ${fournisseur} : le nom de mon resto, mon nom, mon courriel, mon téléphone, ma ville et mon besoin. Mes données sont gardées ${DELAIS.conservationFournisseurMois} mois. Je peux retirer mon accord en tout temps en écrivant à Resto Action.`,
};

/* ─── Les courriels du programme. [À RELIRE] ─── */
export const COURRIELS_REFERENCES = {
  lienCree: { sujet: "Voici ton lien Réfère un resto", corps: "Bonjour {prenom}, voici ton lien : {lien}. Envoie-le à un proprio que tu connais. Après 2 abonnements payés par ton ami, on applique ton crédit." },
  refereRecu: { sujet: "On a bien reçu ta référence", corps: "Bonjour {prenom}, on a bien reçu {resto} ({ville}). On le contacte, et on te tient au courant." },
  presentationRefere: {
    sujet: "{parrain} nous a parlé de toi",
    corps: "Bonjour {prenom}, {parrain} nous a dit que tu voulais en savoir plus sur Resto Action. On monte l'app de commande des restos à leur nom, et on va chercher leurs clients. Si ça t'intéresse, réponds à ce courriel. Si tu ne veux plus qu'on te contacte, dis-le-nous et on ne te réécrira plus.",
  },
  statutChange: { sujet: "Des nouvelles de {resto}", corps: "Bonjour {prenom}, {resto} est maintenant : {statut}." },
  creditLibere: { sujet: "Ton crédit est libéré", corps: "Bonjour {prenom}, {resto} a payé ses 2 premiers abonnements. Ton crédit sera appliqué à ta prochaine facture." },
  creditApplique: { sujet: "Ton crédit est appliqué", corps: "Bonjour {prenom}, ton crédit pour {resto} est appliqué à ta facture." },
  doublon: { sujet: "À propos de {resto}", corps: "Bonjour {prenom}, merci de nous avoir présenté {resto}. Ce resto était déjà en discussion avec nous, donc il ne compte pas cette fois. Merci de penser à nous!" },
  partenaireRecu: { sujet: "On a bien reçu ta demande de partenariat", corps: "Bonjour {prenom}, merci! On te rappelle sous peu pour te présenter le programme." },
  presentationFournisseur: { sujet: "On t'a présenté à {fournisseur}", corps: "Bonjour {prenom}, comme tu l'as demandé, on t'a présenté à {fournisseur}. Voici exactement ce qu'on lui a envoyé : {donnees}." },
};

/* ───────────────────── La page simple actuelle (/references) ─────────────────────
   Version de départ, faite avant ce programme : elle sera remplacée par
   /refere-un-resto à l'étape 4 (redirection 301 de /references). */

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
