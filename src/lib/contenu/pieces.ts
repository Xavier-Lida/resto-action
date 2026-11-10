import type { Fonctionnalite } from "@/lib/contenu/fonctionnalites";
import { FONCTIONNALITES_EN, FONCTIONNALITES_FR } from "@/lib/contenu/fonctionnalites";
import {
  ABONNEMENT,
  COMMANDES_VISEES_7_JOURS,
  PUB_GARANTIE_SEMAINE,
  PUB_LANCEMENT,
  disponible,
} from "@/lib/contenu/grand-lancement";

/* LES PAGES DES PIÈCES, dans les deux langues (PIECES_FR, PIECES_EN).

   Chaque pièce du Système Nouveaux Clients qu'on fait pour vrai a sa page sous
   /plateforme/<slug>, avec le même gabarit que les quatre pages de
   fonctionnalité : une illustration (les vrais écrans de l'app de Bistro
   Habibi, ou un visuel animé), les étapes « comment ça marche », le détail,
   une courte FAQ.

   `dependDe` : une page n'existe que si ses pièces sont prêtes au lancement
   (champ `disponible` de grand-lancement.ts). À faux, la page répond 404 et
   son lien disparaît du pied de page et de /plateforme.

   Aucun chiffre de résultat client ici tant qu'il n'y a pas de resto lancé :
   seulement ce qu'on fait, et comment. */

export type PagePiece = Fonctionnalite & { dependDe?: string[] };

const ECRAN = {
  accueil: { src: "/demo-app/client/accueil.webp", alt: "L'accueil de l'app de Bistro Habibi" },
  menu: { src: "/demo-app/client/menu.webp", alt: "Le menu de l'app de Bistro Habibi" },
  panier: { src: "/demo-app/client/panier.webp", alt: "Le panier de l'app de Bistro Habibi" },
  compte: { src: "/demo-app/client/compte.webp", alt: "Le compte client, avec ses points de fidélité" },
  offre: { src: "/demo-app/livreur/offre.webp", alt: "La course offerte au livreur, avec l'adresse du resto et du client" },
  porte: { src: "/demo-app/livreur/livree.webp", alt: "Le livreur dépose le sac à la porte et prend une photo" },
  itineraire: { src: "/demo-app/livreur/itineraire.webp", alt: "Le livreur ouvre l'itinéraire dans son application de cartes" },
};

const CTA = {
  titre: "Calcule ce que ça te rapporterait, avec ton propre relevé.",
  texte: "Le calculateur lit ton relevé de plateforme et te montre ce que tu aurais gardé. Ou appelle-nous : on t'explique tout au téléphone.",
};

export const PIECES_FR: Record<string, PagePiece> = {
  "pub-du-lancement": {
    slug: "/plateforme/pub-du-lancement",
    filNom: "La pub du lancement",
    metaTitre: "La pub du lancement : 300 $ payés par nous",
    metaDescription:
      "Tes 7 premiers jours : 300 $ de pub Facebook et Instagram payés par nous, tes affiches, tes plaques et nos cartons dans tes sacs.",
    surTitre: "Le Blitz 7 jours",
    titre: "On va chercher tes premiers clients, à nos frais",
    intro: `Ton app ne sert à rien si personne ne la connaît. Tes 7 premiers jours, on lance ${PUB_LANCEMENT} $ de pub payés par nous, et on met ton app sous les yeux de tous ceux qui passent chez toi.`,
    resume: `${PUB_LANCEMENT} $ de pub payés par nous, tes affiches, tes plaques et nos cartons dans tes sacs.`,
    typeService: "Publicité de lancement pour restaurants",
    illustration: { type: "visuel", visuel: "blitz" },
    etapes: {
      titre: "Comment ça marche",
      items: [
        { titre: "On monte ta pub", texte: `Facebook et Instagram, autour de ton resto, avec ${PUB_LANCEMENT} $ payés par nous. Tu n'as rien à écrire.`, visuel: "blitz" },
        { titre: "Ton resto parle de ton app", texte: "Tes plaques et ton affiche en place, nos cartons dans chaque sac de livraison : tes clients des plateformes découvrent ton app." },
        { titre: "Un texto chaque soir", texte: "Tes 7 premiers jours, tu reçois chaque soir tes commandes du jour. Tu vois ce que la pub donne, en vrai.", visuel: "textos" },
        { titre: "Pas assez de commandes? On continue", texte: `Moins de ${COMMANDES_VISEES_7_JOURS} commandes dans tes 7 premiers jours : on remet ${PUB_GARANTIE_SEMAINE} $ de pub chaque semaine, à nos frais, jusqu'à ce que tu les aies (L'Imprimante qui chauffe).` },
      ],
    },
    blocs: [
      { t: "h2", texte: "Pourquoi on paie ta pub" },
      { t: "p", texte: "Un rabais te fait sauver de l'argent une fois. Des clients qui découvrent ton app commandent encore le mois suivant. On aime mieux investir dans ta croissance que dans un rabais." },
      { t: "encadre", titre: "Ce que tu fais, toi", texte: "Tu laisses tes plaques et ton affiche en place, et tu glisses nos cartons dans tes sacs. C'est aussi la condition des garanties." },
    ],
    faq: {
      titre: "Questions sur la pub du lancement",
      items: [
        { q: "Est-ce que je dois fournir un budget de pub?", a: `Non. Les ${PUB_LANCEMENT} $ de ton lancement sont payés par nous.` },
        { q: "Et si ça ne donne pas de commandes?", a: `Si ton app ne reçoit pas ${COMMANDES_VISEES_7_JOURS} commandes dans tes 7 premiers jours, on remet ${PUB_GARANTIE_SEMAINE} $ de pub chaque semaine, à nos frais, jusqu'à ce que tu les aies.` },
      ],
    },
    cta: CTA,
    dependDe: ["blitz"],
  },

  "menu-qui-vend": {
    slug: "/plateforme/menu-qui-vend",
    filNom: "Le Menu qui Vend",
    metaTitre: "Un menu en ligne qui fait monter la facture",
    metaDescription:
      "Ton menu en ligne monté pour vendre : combos, extras et suggestions au bon moment, sans personne au téléphone.",
    surTitre: "Plus de ventes en ligne",
    titre: "Un menu en ligne qui fait monter la facture",
    intro: "Au téléphone, personne n'a le temps de proposer la sauce, le format plus grand ou le dessert. En ligne, ton menu le fait à chaque commande, sans jamais oublier.",
    resume: "Combos, extras et suggestions au bon moment, à chaque commande.",
    typeService: "Menu en ligne pour restaurants",
    illustration: { type: "ecran", ...ECRAN.menu },
    etapes: {
      titre: "Comment ça marche",
      items: [
        { titre: "On monte ton menu", texte: "Tes plats, tes photos, tes prix de salle. Tu nous envoies ton menu, on s'occupe du reste, et tu valides.", ecran: ECRAN.menu },
        { titre: "Les extras au bon moment", texte: "La sauce, le supplément, le format plus grand : proposés quand le client choisit son plat, pas après.", ecran: ECRAN.accueil },
        { titre: "Le plat qui va avec", texte: "Avant de payer, le panier suggère ce qui va bien avec la commande.", ecran: ECRAN.panier },
      ],
    },
    blocs: [
      { t: "h2", texte: "Tes prix, pas ceux d'une plateforme" },
      { t: "p", texte: "Sur ton app, ton menu est à tes prix de salle. Pas besoin de gonfler tes prix pour payer une commission de 30 %." },
    ],
    faq: {
      titre: "Questions sur le menu",
      items: [
        { q: "Qui monte mon menu?", a: "Nous. Tu nous envoies ton menu, tes photos et tes accès, et ton app est prête en 48 h. Tu valides avant la mise en ligne." },
        { q: "Je peux changer un prix moi-même?", a: "Oui, ou tu nous le demandes : un seul numéro, en français, pour tout ce qui est en ligne." },
      ],
    },
    cta: CTA,
    dependDe: ["menu-qui-vend"],
  },

  livraison: {
    slug: "/plateforme/livraison",
    filNom: "La livraison",
    metaTitre: "La livraison, sans un seul livreur à gérer",
    metaDescription:
      "Ton client paie 4,99 $ de livraison. Toi, 10 % des aliments et boissons plus la course au prix coûtant. Les livreurs et les plaintes, c'est nous.",
    surTitre: "La Livraison Incluse",
    titre: "La livraison, sans un seul livreur à gérer",
    intro: "Tu offres la livraison sur ton app comme sur une plateforme, sans engager personne. On s'occupe des livreurs, des courses et des plaintes.",
    resume: "Ton client paie 4,99 $. Toi, la course au prix coûtant. Les plaintes, c'est nous.",
    typeService: "Livraison pour restaurants",
    illustration: { type: "ecran", ...ECRAN.offre },
    etapes: {
      titre: "Comment ça marche",
      items: [
        { titre: "Le client commande sur ton app", texte: "Il choisit la livraison et paie 4,99 $, rien d'autre.", ecran: ECRAN.accueil },
        { titre: "Un livreur prend la course", texte: "La course part dans notre app de livreurs, avec l'adresse de ton resto et celle du client.", ecran: ECRAN.offre },
        { titre: "Il se rend chez le client", texte: "L'itinéraire s'ouvre dans son application de cartes.", ecran: ECRAN.itineraire },
        { titre: "Déposé à la porte, avec une photo", texte: "Le livreur prend une photo du sac livré. En cas de plainte, c'est nous qui la réglons.", ecran: ECRAN.porte },
      ],
    },
    blocs: [
      { t: "h2", texte: "Ce que ça coûte, tout compris" },
      {
        t: "tableau",
        entetes: ["", "Qui paie", "Combien"],
        lignes: [
          ["Livraison", "Ton client", "4,99 $"],
          ["Nos frais", "Toi", "10 % des aliments et boissons + la course au prix coûtant (3,51 $ aujourd'hui)"],
          ["Frais de carte", "Inclus", "0 $ de plus"],
        ],
      },
      { t: "h2", texte: "La cueillette, mise de l'avant" },
      { t: "p", texte: "Sur ton app, la cueillette est mise de l'avant, avec des points doublés. C'est 5 % + 0,30 $ par commande, et le client vient chercher son repas chez toi." },
    ],
    faq: {
      titre: "Questions sur la livraison",
      items: [
        { q: "Est-ce que je dois engager des livreurs?", a: "Non. On s'occupe de la livraison et des plaintes. Tu n'as aucun livreur à gérer." },
        { q: "Je fais seulement de la cueillette, c'est correct?", a: "Oui. En cueillette seulement, c'est 5 % + 0,30 $ par commande, frais de carte inclus." },
      ],
    },
    cta: CTA,
    dependDe: ["livraison-incluse"],
  },

  "points-recompenses": {
    slug: "/plateforme/points-recompenses",
    filNom: "Points et récompenses",
    metaTitre: "Points et récompenses : tes clients reviennent tout seuls",
    metaDescription:
      "Le Moteur Clients Fidèles : des points, des offres et des textos qui font revenir tes clients, sans que tu aies à y penser.",
    surTitre: "Le Moteur Clients Fidèles",
    titre: "Tes clients reviennent tout seuls",
    intro: "Un client qui commande une fois, c'est bien. Un client qui revient chaque mois, c'est ce qui fait vivre un resto. Ton app s'en occupe pendant que tu cuisines.",
    resume: "Des points, des offres et des textos qui font revenir tes clients.",
    typeService: "Programme de fidélité pour restaurants",
    illustration: { type: "visuel", visuel: "fidelite" },
    etapes: {
      titre: "Comment ça marche",
      items: [
        { titre: "Chaque commande donne des points", texte: "Le client voit ses points dans son compte, sur ton app.", ecran: ECRAN.compte },
        { titre: "Un client qui disparaît reçoit un texto", texte: "Après 30 jours sans commande, une offre part toute seule. Un panier laissé en plan reçoit un rappel.", visuel: "textos" },
        { titre: "Il revient commander chez toi", texte: "Pas sur une plateforme : sur ton app, à tes prix.", visuel: "fidelite" },
      ],
    },
    blocs: [
      { t: "h2", texte: "Seulement aux clients qui ont accepté" },
      { t: "p", texte: "Les textos et les courriels partent aux clients qui ont accepté d'en recevoir, avec une façon simple de se désabonner. Pas de liste achetée, jamais." },
    ],
    faq: {
      titre: "Questions sur la fidélité",
      items: [
        { q: "Est-ce que je dois écrire les messages?", a: "Non. On les écrit avec toi une fois, dans ta voix, et ils partent ensuite tout seuls." },
        { q: "Les points me coûtent combien?", a: `C'est inclus dans ton abonnement de ${ABONNEMENT} $ par mois. Tu choisis la récompense avec nous.` },
      ],
    },
    cta: CTA,
    dependDe: ["clients-fideles"],
  },

  "parrainage-cartes-cadeaux": {
    slug: "/plateforme/parrainage-cartes-cadeaux",
    filNom: "Parrainage et cartes-cadeaux",
    metaTitre: "Parrainage et cartes-cadeaux : tes clients en amènent d'autres",
    metaDescription:
      "Un lien pour inviter un ami, des cartes-cadeaux vendues sur ton app : tes clients deviennent ta meilleure pub.",
    surTitre: "Des nouvelles ventes",
    titre: "Tes clients en amènent d'autres",
    intro: "Le meilleur client, c'est celui qu'un ami t'envoie. Ton app donne à chaque client une raison d'en parler.",
    resume: "Un lien pour inviter un ami, et des cartes-cadeaux vendues d'avance.",
    typeService: "Parrainage et cartes-cadeaux pour restaurants",
    illustration: { type: "ecran", ...ECRAN.compte },
    etapes: {
      titre: "Comment ça marche",
      items: [
        { titre: "Chaque client a son lien", texte: "Il l'envoie à un ami. L'ami a un rabais sur sa première commande, ton client des points." },
        { titre: "Des cartes-cadeaux sur ton app", texte: "L'argent entre d'avance, et ceux qui les reçoivent deviennent tes clients." },
      ],
    },
    blocs: [
      { t: "p", texte: "Tout passe par ton app : le nouveau client est à toi, avec son nom et son numéro, pas à une plateforme." },
    ],
    faq: {
      titre: "Questions sur le parrainage",
      items: [{ q: "Qui fixe le rabais?", a: "Toi, avec nous. On te propose un montant qui reste rentable pour ton resto." }],
    },
    cta: CTA,
    dependDe: ["parrainage", "cartes-cadeaux"],
  },

  "reglage-plateformes": {
    slug: "/plateforme/reglage-plateformes",
    filNom: "Le Réglage Plateformes",
    metaTitre: "Garder plus sur les plateformes, dès le jour 1",
    metaDescription:
      "On lit tes ententes avec les plateformes de livraison et on ajuste tes prix, si ton entente le permet. Tu gardes plus sur chaque commande qui y reste.",
    surTitre: "L'argent récupéré sur les plateformes",
    titre: "Tu gardes plus sur ce qui reste sur les plateformes",
    intro: "Tu ne lâches pas les plateformes du jour au lendemain. Mais tu peux arrêter d'y perdre de l'argent : on ajuste tes prix, si ton entente le permet.",
    resume: "Tes prix ajustés de 10 à 15 % sur les plateformes, si ton entente le permet.",
    typeService: "Optimisation des prix sur les plateformes de livraison",
    etapes: {
      titre: "Comment ça marche",
      items: [
        { titre: "On lit tes ententes", texte: "Ce que ton entente permet, et ce qu'elle interdit. Rien n'est changé sans ton OK." },
        { titre: "On monte tes prix de 10 à 15 %", texte: "Dès le jour 1, sur les plateformes, si ton entente le permet. Tu gardes plus sur chaque commande qui y reste." },
        { titre: "Les clients qui trouvent ça cher viennent chez toi", texte: "Sur ton app, ton menu est à tes prix de salle. C'est une raison de plus de commander directement." },
      ],
    },
    blocs: [
      {
        t: "encadre",
        titre: "Sur Uber Eats, on vérifie avec toi",
        texte: "Des prix plus hauts qu'en salle font passer la commission de cueillette de 10 à 15 %. On fait le calcul avec toi avant de toucher à quoi que ce soit.",
      },
    ],
    faq: {
      titre: "Questions sur le Réglage Plateformes",
      items: [
        { q: "Je vais perdre des ventes sur les plateformes?", a: "Ceux qui trouvent ça cher viennent commander chez toi. On monte tes prix seulement si ton entente le permet." },
      ],
    },
    cta: CTA,
    dependDe: ["reglage-plateformes"],
  },

  "imprimante-cuisine": {
    slug: "/plateforme/imprimante-cuisine",
    filNom: "L'imprimante de cuisine",
    metaTitre: "Ton imprimante de cuisine, offerte",
    metaDescription:
      "Chaque commande en ligne sort toute seule sur ton imprimante de cuisine offerte. Pas de tablette sur le comptoir, ta caisse ne change pas.",
    surTitre: "Zéro Double Saisie",
    titre: "La commande sort toute seule en cuisine",
    intro: "Pas de tablette de plus sur le comptoir, rien à retaper dans ta caisse. La commande sort sur ton imprimante de cuisine offerte, et tu suis tout sur ton cell.",
    resume: "Chaque commande sort sur ton imprimante offerte. Ta caisse ne change pas.",
    typeService: "Impression des commandes en ligne pour restaurants",
    illustration: { type: "visuel", visuel: "imprimante" },
    etapes: {
      titre: "Comment ça marche",
      items: [
        { titre: "Branchée en 10 minutes", texte: "Le jour de ton lancement, on branche ton imprimante sur place.", visuel: "imprimante" },
        { titre: "La commande sort toute seule", texte: "Dans ta caisse si elle est compatible, sinon sur ton imprimante. Personne ne retape rien." },
        { titre: "Tu suis tout sur ton cell", texte: "Les commandes du jour, et chaque soir de ta première semaine, un texto avec ton résumé." },
      ],
    },
    blocs: [
      { t: "p", texte: "L'imprimante est offerte et elle t'appartient. Si tu pars un jour, tu la gardes." },
    ],
    faq: {
      titre: "Questions sur l'imprimante",
      items: [
        { q: "Est-ce que je dois changer ma caisse?", a: "Non. Ta caisse ne change pas. Si elle est compatible, les commandes y entrent; sinon, elles sortent sur ton imprimante." },
      ],
    },
    cta: CTA,
    dependDe: ["zero-double-saisie"],
  },

  "texto-du-lundi": {
    slug: "/plateforme/texto-du-lundi",
    filNom: "Le Texto du Lundi",
    metaTitre: "Le Texto du Lundi : ce que ton app t'a rapporté",
    metaDescription:
      "Chaque lundi, en un texto : tes commandes directes, tes nouvelles ventes et l'argent rapporté. La preuve, chaque semaine.",
    surTitre: "Chaque semaine",
    titre: "Chaque lundi, la preuve en un texto",
    intro: "Tu n'as pas à te connecter à un tableau de bord ni à faire des calculs. Chaque lundi, un texto te dit ce que ton app t'a rapporté.",
    resume: "Tes commandes directes, tes nouvelles ventes et l'argent rapporté, chaque lundi.",
    typeService: "Rapport hebdomadaire pour restaurants",
    illustration: { type: "visuel", visuel: "textos" },
    etapes: {
      titre: "Comment ça marche",
      items: [
        { titre: "Ta première semaine : un texto chaque soir", texte: "Tes commandes du jour, pour voir ton lancement en direct." },
        { titre: "Ensuite, chaque lundi", texte: "Tes commandes directes, tes nouvelles ventes et l'argent rapporté.", visuel: "textos" },
        { titre: "Les grandes étapes", texte: "Un texto à ta 1re, ta 10e, ta 50e et ta 100e commande." },
      ],
    },
    blocs: [
      { t: "p", texte: "C'est aussi avec ces chiffres qu'on calcule nos garanties : tu vois chaque semaine si ton app paie son abonnement." },
    ],
    faq: {
      titre: "Questions sur le Texto du Lundi",
      items: [{ q: "Je peux le recevoir par courriel?", a: "Dis-le-nous : un seul numéro, en français, pour tout ce qui est en ligne." }],
    },
    cta: CTA,
    dependDe: ["texto-lundi"],
  },

  "departement-en-ligne": {
    slug: "/plateforme/departement-en-ligne",
    filNom: "Ton Département en ligne",
    metaTitre: "Ton Département en ligne : un seul numéro, en français",
    metaDescription:
      "Ton app, ta fiche Google, tes réseaux et ta pub : un seul numéro, en français, avec des humains d'ici. Tes réseaux programmés 3 mois d'avance.",
    surTitre: "Des humains, en français, ici",
    titre: "Un seul numéro pour tout ce qui est en ligne",
    intro: "Ton app, ta fiche Google, tes réseaux, ta pub : tu n'as pas quatre fournisseurs à appeler. Tu as un numéro, en français, et quelqu'un qui connaît ton resto.",
    resume: "Un seul numéro, en français, pour tout ce qui est en ligne.",
    typeService: "Gestion de la présence en ligne pour restaurants",
    illustration: { type: "visuel", visuel: "calendrier" },
    etapes: {
      titre: "Comment ça marche",
      items: [
        { titre: "L'installation et la formation en personne", texte: "On vient chez toi : ton imprimante branchée en 10 minutes, et une heure de formation privée." },
        { titre: "Ton staff formé en 15 minutes", texte: "Une vidéo et un guide au poste. Ils savent recevoir une commande et parler de l'app." },
        { titre: "Tes réseaux et ta fiche Google actifs", texte: "3 mois programmés d'avance. Tu n'as rien à publier toi-même.", visuel: "calendrier" },
        { titre: "Un numéro pour tout", texte: "Un prix à changer, un plat en rupture, une question : tu appelles ou tu textes, en français." },
      ],
    },
    blocs: [],
    faq: {
      titre: "Questions sur le Département en ligne",
      items: [{ q: "C'est inclus?", a: `Oui, dans ton abonnement de ${ABONNEMENT} $ par mois.` }],
    },
    cta: CTA,
    dependDe: ["departement-en-ligne"],
  },
};

/* LES PAGES EN ANGLAIS. Mêmes clés que PIECES_FR (la clé reste le segment
   français : c'est elle que lisent `dependDe`, le pied de page et la route),
   mais le slug est anglais, sous /en/platform/. Les écrans, les visuels et
   `dependDe` sont identiques; seuls les textes (et les `alt`) changent. */
const SCREEN = {
  accueil: { src: ECRAN.accueil.src, alt: "The home screen of Bistro Habibi's app" },
  menu: { src: ECRAN.menu.src, alt: "The menu in Bistro Habibi's app" },
  panier: { src: ECRAN.panier.src, alt: "The cart in Bistro Habibi's app" },
  compte: { src: ECRAN.compte.src, alt: "The customer account, with loyalty points" },
  offre: { src: ECRAN.offre.src, alt: "The run offered to the driver, with the restaurant's and the customer's addresses" },
  porte: { src: ECRAN.porte.src, alt: "The driver leaves the bag at the door and takes a photo" },
  itineraire: { src: ECRAN.itineraire.src, alt: "The driver opens the route in their maps app" },
};

const CTA_EN = {
  titre: "See what it would bring you, with your own statement.",
  texte: "The calculator reads your platform statement and shows you what you would have kept. Or call us: we'll walk you through everything on the phone.",
};

export const PIECES_EN: Record<string, PagePiece> = {
  "pub-du-lancement": {
    slug: "/en/platform/launch-ads",
    filNom: "The launch ads",
    metaTitre: `The launch ads: $${PUB_LANCEMENT} paid by us`,
    metaDescription:
      `Your first 7 days: $${PUB_LANCEMENT} of Facebook and Instagram ads paid by us, your signs, your plaques and our cards in your bags.`,
    surTitre: "The 7-Day Blitz",
    titre: "We go get your first customers, on our dime",
    intro: `Your app is useless if nobody knows about it. In your first 7 days, we run $${PUB_LANCEMENT} of ads paid by us, and we put your app in front of everyone who walks into your place.`,
    resume: `$${PUB_LANCEMENT} of ads paid by us, your signs, your plaques and our cards in your bags.`,
    typeService: "Launch advertising for restaurants",
    illustration: { type: "visuel", visuel: "blitz" },
    etapes: {
      titre: "How it works",
      items: [
        { titre: "We set up your ads", texte: `Facebook and Instagram, around your restaurant, with $${PUB_LANCEMENT} paid by us. You don't have to write a thing.`, visuel: "blitz" },
        { titre: "Your restaurant talks about your app", texte: "Your plaques and your sign in place, our cards in every delivery bag: your platform customers discover your app." },
        { titre: "A text every evening", texte: "In your first 7 days, you get the day's orders every evening. You see what the ads actually bring in.", visuel: "textos" },
        { titre: "Not enough orders? We keep going", texte: `Fewer than ${COMMANDES_VISEES_7_JOURS} orders in your first 7 days: we add $${PUB_GARANTIE_SEMAINE} of ads every week, on our dime, until you get them (The Busy Printer).` },
      ],
    },
    blocs: [
      { t: "h2", texte: "Why we pay for your ads" },
      { t: "p", texte: "A discount saves you money once. Customers who discover your app order again the next month. We'd rather invest in your growth than in a discount." },
      { t: "encadre", titre: "What you do", texte: "You keep your plaques and your sign in place, and you slip our cards into your bags. That's also the condition for the guarantees." },
    ],
    faq: {
      titre: "Questions about the launch ads",
      items: [
        { q: "Do I have to put up an ad budget?", a: `No. The $${PUB_LANCEMENT} for your launch is paid by us.` },
        { q: "What if it doesn't bring in orders?", a: `If your app doesn't get ${COMMANDES_VISEES_7_JOURS} orders in your first 7 days, we add $${PUB_GARANTIE_SEMAINE} of ads every week, on our dime, until you get them.` },
      ],
    },
    cta: CTA_EN,
    dependDe: ["blitz"],
  },

  "menu-qui-vend": {
    slug: "/en/platform/menu-that-sells",
    filNom: "The Menu That Sells",
    metaTitre: "An online menu that raises the bill",
    metaDescription:
      "Your online menu built to sell: combos, extras and suggestions at the right moment, with nobody on the phone.",
    surTitre: "More online sales",
    titre: "An online menu that raises the bill",
    intro: "On the phone, nobody has time to offer the sauce, the bigger size or dessert. Online, your menu does it on every order, and never forgets.",
    resume: "Combos, extras and suggestions at the right moment, on every order.",
    typeService: "Online menus for restaurants",
    illustration: { type: "ecran", ...SCREEN.menu },
    etapes: {
      titre: "How it works",
      items: [
        { titre: "We build your menu", texte: "Your dishes, your photos, your dine-in prices. You send us your menu, we handle the rest, and you approve it.", ecran: SCREEN.menu },
        { titre: "Extras at the right moment", texte: "The sauce, the add-on, the bigger size: offered when the customer picks their dish, not after.", ecran: SCREEN.accueil },
        { titre: "The dish that goes with it", texte: "Before checkout, the cart suggests what goes well with the order.", ecran: SCREEN.panier },
      ],
    },
    blocs: [
      { t: "h2", texte: "Your prices, not a platform's" },
      { t: "p", texte: "On your app, your menu is at your dine-in prices. No need to inflate your prices to cover a 30% commission." },
    ],
    faq: {
      titre: "Questions about the menu",
      items: [
        { q: "Who builds my menu?", a: "We do. You send us your menu, your photos and your access, and your app is ready in 48 hours. You approve it before it goes live." },
        { q: "Can I change a price myself?", a: "Yes, or just ask us: one number for everything online." },
      ],
    },
    cta: CTA_EN,
    dependDe: ["menu-qui-vend"],
  },

  livraison: {
    slug: "/en/platform/delivery",
    filNom: "Delivery",
    metaTitre: "Delivery, without a single driver to manage",
    metaDescription:
      "Your customer pays $4.99 for delivery. You pay 10% of food and drinks plus the run at cost. The drivers and the complaints are on us.",
    surTitre: "Delivery Included",
    titre: "Delivery, without a single driver to manage",
    intro: "You offer delivery on your app just like on a platform, without hiring anyone. We handle the drivers, the runs and the complaints.",
    resume: "Your customer pays $4.99. You pay the run at cost. Complaints are on us.",
    typeService: "Delivery for restaurants",
    illustration: { type: "ecran", ...SCREEN.offre },
    etapes: {
      titre: "How it works",
      items: [
        { titre: "The customer orders on your app", texte: "They choose delivery and pay $4.99, nothing else.", ecran: SCREEN.accueil },
        { titre: "A driver takes the run", texte: "The run goes out in our drivers' app, with your restaurant's address and the customer's.", ecran: SCREEN.offre },
        { titre: "They head to the customer", texte: "The route opens in their maps app.", ecran: SCREEN.itineraire },
        { titre: "Left at the door, with a photo", texte: "The driver takes a photo of the delivered bag. If there's a complaint, we're the ones who handle it.", ecran: SCREEN.porte },
      ],
    },
    blocs: [
      { t: "h2", texte: "What it costs, all in" },
      {
        t: "tableau",
        entetes: ["", "Who pays", "How much"],
        lignes: [
          ["Delivery", "Your customer", "$4.99"],
          ["Our fees", "You", "10% of food and drinks + the run at cost ($3.51 today)"],
          ["Card fees", "Included", "$0 extra"],
        ],
      },
      { t: "h2", texte: "Pickup, front and centre" },
      { t: "p", texte: "On your app, pickup is front and centre, with double points. It's 5% + $0.30 per order, and the customer comes to your place for their meal." },
    ],
    faq: {
      titre: "Questions about delivery",
      items: [
        { q: "Do I have to hire drivers?", a: "No. We handle delivery and complaints. You have no drivers to manage." },
        { q: "I only do pickup. Is that OK?", a: "Yes. Pickup only is 5% + $0.30 per order, card fees included." },
      ],
    },
    cta: CTA_EN,
    dependDe: ["livraison-incluse"],
  },

  "points-recompenses": {
    slug: "/en/platform/points-rewards",
    filNom: "Points and rewards",
    metaTitre: "Points and rewards: your customers come back on their own",
    metaDescription:
      "The Loyal Customer Engine: points, offers and texts that bring your customers back, without you having to think about it.",
    surTitre: "The Loyal Customer Engine",
    titre: "Your customers come back on their own",
    intro: "A customer who orders once is nice. A customer who comes back every month is what keeps a restaurant alive. Your app takes care of it while you cook.",
    resume: "Points, offers and texts that bring your customers back.",
    typeService: "Loyalty program for restaurants",
    illustration: { type: "visuel", visuel: "fidelite" },
    etapes: {
      titre: "How it works",
      items: [
        { titre: "Every order earns points", texte: "The customer sees their points in their account, on your app.", ecran: SCREEN.compte },
        { titre: "A customer who disappears gets a text", texte: "After 30 days without an order, an offer goes out on its own. An abandoned cart gets a reminder.", visuel: "textos" },
        { titre: "They come back to order from you", texte: "Not on a platform: on your app, at your prices.", visuel: "fidelite" },
      ],
    },
    blocs: [
      { t: "h2", texte: "Only to customers who said yes" },
      { t: "p", texte: "Texts and emails go to customers who agreed to receive them, with a simple way to unsubscribe. No purchased lists, ever." },
    ],
    faq: {
      titre: "Questions about loyalty",
      items: [
        { q: "Do I have to write the messages?", a: "No. We write them with you once, in your voice, and then they go out on their own." },
        { q: "How much do the points cost me?", a: `They're included in your $${ABONNEMENT} monthly subscription. You choose the reward with us.` },
      ],
    },
    cta: CTA_EN,
    dependDe: ["clients-fideles"],
  },

  "parrainage-cartes-cadeaux": {
    slug: "/en/platform/referrals-gift-cards",
    filNom: "Referrals and gift cards",
    metaTitre: "Referrals and gift cards: your customers bring in others",
    metaDescription:
      "A link to invite a friend, gift cards sold on your app: your customers become your best advertising.",
    surTitre: "New sales",
    titre: "Your customers bring in others",
    intro: "The best customer is the one a friend sends you. Your app gives every customer a reason to talk about you.",
    resume: "A link to invite a friend, and gift cards sold in advance.",
    typeService: "Referrals and gift cards for restaurants",
    illustration: { type: "ecran", ...SCREEN.compte },
    etapes: {
      titre: "How it works",
      items: [
        { titre: "Every customer has their own link", texte: "They send it to a friend. The friend gets a discount on their first order, your customer gets points." },
        { titre: "Gift cards on your app", texte: "The money comes in up front, and the people who receive them become your customers." },
      ],
    },
    blocs: [
      { t: "p", texte: "Everything goes through your app: the new customer is yours, with their name and number, not a platform's." },
    ],
    faq: {
      titre: "Questions about referrals",
      items: [{ q: "Who sets the discount?", a: "You, with us. We suggest an amount that stays profitable for your restaurant." }],
    },
    cta: CTA_EN,
    dependDe: ["parrainage", "cartes-cadeaux"],
  },

  "reglage-plateformes": {
    slug: "/en/platform/platform-pricing",
    filNom: "The Platform Pricing Tune-Up",
    metaTitre: "Keep more on the platforms, from day 1",
    metaDescription:
      "We read your agreements with the delivery platforms and adjust your prices, if your agreement allows it. You keep more on every order that stays there.",
    surTitre: "Money recovered on the platforms",
    titre: "You keep more on what stays on the platforms",
    intro: "You won't drop the platforms overnight. But you can stop losing money there: we adjust your prices, if your agreement allows it.",
    resume: "Your platform prices adjusted by 10 to 15%, if your agreement allows it.",
    typeService: "Delivery platform price optimization",
    etapes: {
      titre: "How it works",
      items: [
        { titre: "We read your agreements", texte: "What your agreement allows, and what it forbids. Nothing changes without your OK." },
        { titre: "We raise your prices by 10 to 15%", texte: "From day 1, on the platforms, if your agreement allows it. You keep more on every order that stays there." },
        { titre: "Customers who find it pricey come to you", texte: "On your app, your menu is at your dine-in prices. One more reason to order direct." },
      ],
    },
    blocs: [
      {
        t: "encadre",
        titre: "On Uber Eats, we check with you",
        texte: "Prices higher than dine-in move the pickup commission from 10 to 15%. We run the numbers with you before touching anything.",
      },
    ],
    faq: {
      titre: "Questions about the Platform Pricing Tune-Up",
      items: [
        { q: "Will I lose sales on the platforms?", a: "The ones who find it pricey come order from you. We only raise your prices if your agreement allows it." },
      ],
    },
    cta: CTA_EN,
    dependDe: ["reglage-plateformes"],
  },

  "imprimante-cuisine": {
    slug: "/en/platform/kitchen-printer",
    filNom: "The kitchen printer",
    metaTitre: "Your kitchen printer, included at no cost",
    metaDescription:
      "Every online order prints on its own on the kitchen printer we give you. No tablet on the counter, your point of sale doesn't change.",
    surTitre: "Zero Double Entry",
    titre: "The order prints on its own in the kitchen",
    intro: "No extra tablet on the counter, nothing to retype into your point of sale. The order prints on the kitchen printer we give you, and you follow everything on your phone.",
    resume: "Every order prints on the printer we give you. Your point of sale doesn't change.",
    typeService: "Online order printing for restaurants",
    illustration: { type: "visuel", visuel: "imprimante" },
    etapes: {
      titre: "How it works",
      items: [
        { titre: "Plugged in within 10 minutes", texte: "On your launch day, we plug in your printer on site.", visuel: "imprimante" },
        { titre: "The order prints on its own", texte: "Into your point of sale if it's compatible, otherwise on your printer. Nobody retypes anything." },
        { titre: "You follow everything on your phone", texte: "The day's orders, and every evening of your first week, a text with your summary." },
      ],
    },
    blocs: [
      { t: "p", texte: "The printer is a gift and it belongs to you. If you leave one day, you keep it." },
    ],
    faq: {
      titre: "Questions about the printer",
      items: [
        { q: "Do I have to change my point of sale?", a: "No. Your point of sale doesn't change. If it's compatible, orders go straight into it; if not, they print on your printer." },
      ],
    },
    cta: CTA_EN,
    dependDe: ["zero-double-saisie"],
  },

  "texto-du-lundi": {
    slug: "/en/platform/monday-text",
    filNom: "The Monday Text",
    metaTitre: "The Monday Text: what your app brought in",
    metaDescription:
      "Every Monday, in one text: your direct orders, your new sales and the money brought in. The proof, every week.",
    surTitre: "Every week",
    titre: "Every Monday, the proof in one text",
    intro: "No dashboard to log into, no math to do. Every Monday, a text tells you what your app brought in.",
    resume: "Your direct orders, your new sales and the money brought in, every Monday.",
    typeService: "Weekly report for restaurants",
    illustration: { type: "visuel", visuel: "textos" },
    etapes: {
      titre: "How it works",
      items: [
        { titre: "Your first week: a text every evening", texte: "The day's orders, so you can watch your launch live." },
        { titre: "Then, every Monday", texte: "Your direct orders, your new sales and the money brought in.", visuel: "textos" },
        { titre: "The milestones", texte: "A text at your 1st, 10th, 50th and 100th order." },
      ],
    },
    blocs: [
      { t: "p", texte: "These are also the numbers we use to calculate our guarantees: every week, you see whether your app pays for its subscription." },
    ],
    faq: {
      titre: "Questions about The Monday Text",
      items: [{ q: "Can I get it by email?", a: "Just tell us: one number for everything online." }],
    },
    cta: CTA_EN,
    dependDe: ["texto-lundi"],
  },

  "departement-en-ligne": {
    slug: "/en/platform/online-department",
    filNom: "Your Online Department",
    metaTitre: "Your Online Department: one number, real people",
    metaDescription:
      "Your app, your Google listing, your social media and your ads: one number, with real people from here. Your social media scheduled 3 months ahead.",
    surTitre: "Real people, right here",
    titre: "One number for everything online",
    intro: "Your app, your Google listing, your social media, your ads: you don't have four suppliers to call. You have one number, and someone who knows your restaurant.",
    resume: "One number for everything online, with real people from here.",
    typeService: "Online presence management for restaurants",
    illustration: { type: "visuel", visuel: "calendrier" },
    etapes: {
      titre: "How it works",
      items: [
        { titre: "Installation and training, in person", texte: "We come to you: your printer plugged in within 10 minutes, and a one-hour private training." },
        { titre: "Your staff trained in 15 minutes", texte: "A video and a guide at the station. They know how to take an order and talk about the app." },
        { titre: "Your social media and Google listing kept active", texte: "3 months scheduled ahead. You don't have to post anything yourself.", visuel: "calendrier" },
        { titre: "One number for everything", texte: "A price to change, a dish sold out, a question: you call or text, and someone from here answers." },
      ],
    },
    blocs: [],
    faq: {
      titre: "Questions about the Online Department",
      items: [{ q: "Is it included?", a: `Yes, in your $${ABONNEMENT} monthly subscription.` }],
    },
    cta: CTA_EN,
    dependDe: ["departement-en-ligne"],
  },
};

export type Langue = "fr" | "en";

const PIECES: Record<Langue, Record<string, PagePiece>> = { fr: PIECES_FR, en: PIECES_EN };

/** Les pages des pièces prêtes au lancement, dans la langue demandée (français par défaut). */
export const piecesPretes = (langue: Langue = "fr"): PagePiece[] =>
  Object.values(PIECES[langue]).filter((p) => disponible(p));

const pret = (segment: string) => {
  const p = PIECES_FR[segment];
  return p ? disponible(p) : true;
};

/* LE PIED DE PAGE, À LA OWNER : quatre colonnes, chaque pièce mène à sa page.
   Les pages des quatre fonctionnalités d'origine et celles des pièces se
   mêlent; une pièce pas prête disparaît de la liste. */
export type LienProduit = { nom: string; href: string };

/* Les libellés des colonnes, dans les deux langues. La clé d'une pièce est son
   segment français (celui de PIECES_FR); son lien se lit dans le slug de la
   langue demandée. */
const LIBELLES = {
  fr: {
    colonnes: ["Plus de clients Google", "Plus de ventes en ligne", "Plus de clients fidèles", "Ton resto, sans casse-tête"],
    referencement: "Référencement Google",
    commandes: "Commandes en ligne",
    application: "Ton app à ton nom",
    relances: "Relances texto et courriel",
    calculateur: "Le calculateur",
    calculateurHref: "/#calculateur",
    pieces: {
      "pub-du-lancement": "La pub du lancement",
      reseaux: "Tes réseaux, gérés pour toi",
      "menu-qui-vend": "Le Menu qui Vend",
      livraison: "La livraison",
      "reglage-plateformes": "Le Réglage Plateformes",
      "points-recompenses": "Points et récompenses",
      "parrainage-cartes-cadeaux": "Parrainage et cartes-cadeaux",
      "imprimante-cuisine": "L'imprimante de cuisine",
      "texto-du-lundi": "Le Texto du Lundi",
      "departement-en-ligne": "Ton Département en ligne",
    },
  },
  en: {
    colonnes: ["More Google customers", "More online sales", "More loyal customers", "Your restaurant, hassle-free"],
    referencement: "Google visibility",
    commandes: "Online ordering",
    application: "Your app, under your name",
    relances: "Text and email follow-ups",
    calculateur: "The calculator",
    calculateurHref: "/en#calculateur",
    pieces: {
      "pub-du-lancement": "The launch ads",
      reseaux: "Your social media, handled for you",
      "menu-qui-vend": "The Menu That Sells",
      livraison: "Delivery",
      "reglage-plateformes": "The Platform Pricing Tune-Up",
      "points-recompenses": "Points and rewards",
      "parrainage-cartes-cadeaux": "Referrals and gift cards",
      "imprimante-cuisine": "The kitchen printer",
      "texto-du-lundi": "The Monday Text",
      "departement-en-ligne": "Your Online Department",
    },
  },
} as const;

export function colonnesProduit(langue: Langue = "fr"): { titre: string; liens: LienProduit[] }[] {
  const f = langue === "en" ? FONCTIONNALITES_EN : FONCTIONNALITES_FR;
  const l = LIBELLES[langue];
  const pieces = PIECES[langue];
  const p = (segment: string, nom: string): LienProduit | null =>
    pret(segment) && pieces[segment] ? { nom, href: pieces[segment].slug } : null;
  const garde = (liste: (LienProduit | null)[]) => liste.filter((x): x is LienProduit => x !== null);
  return [
    {
      titre: l.colonnes[0],
      liens: garde([
        { nom: l.referencement, href: f.referencement.slug },
        p("pub-du-lancement", l.pieces["pub-du-lancement"]),
        p("departement-en-ligne", l.pieces.reseaux),
      ]),
    },
    {
      titre: l.colonnes[1],
      liens: garde([
        { nom: l.commandes, href: f.commandes.slug },
        p("menu-qui-vend", l.pieces["menu-qui-vend"]),
        p("livraison", l.pieces.livraison),
        p("reglage-plateformes", l.pieces["reglage-plateformes"]),
      ]),
    },
    {
      titre: l.colonnes[2],
      liens: garde([
        { nom: l.application, href: f.application.slug },
        { nom: l.relances, href: f.relances.slug },
        p("points-recompenses", l.pieces["points-recompenses"]),
        p("parrainage-cartes-cadeaux", l.pieces["parrainage-cartes-cadeaux"]),
      ]),
    },
    {
      titre: l.colonnes[3],
      liens: garde([
        p("imprimante-cuisine", l.pieces["imprimante-cuisine"]),
        p("texto-du-lundi", l.pieces["texto-du-lundi"]),
        p("departement-en-ligne", l.pieces["departement-en-ligne"]),
        { nom: l.calculateur, href: l.calculateurHref },
      ]),
    },
  ];
}
