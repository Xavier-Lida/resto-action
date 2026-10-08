import { PHONE_DISPLAY, POSTAL_CODE, STREET } from "@/lib/site";
import type { Textes } from "./fr";

/* La page d'accueil en anglais.

   LE TYPE VIENT DU FRANÇAIS : oublier une clé ici casse la compilation. C'est
   le garde-fou de tout ce fichier.

   Sur le ton : le site tutoie, directement, sans jargon. L'équivalent anglais
   n'est pas un « you » corporate mais le même ton parlé. Les tournures très
   québécoises (« ce qui gruge ton resto », « pis on le règle avec toi ») sont
   rendues par équivalence, pas par calque — « what's eating your margins »
   plutôt qu'un mot-à-mot qui ne voudrait rien dire. */

export const EN: Textes = {
  code: "en",
  htmlLang: "en-CA",
  racine: "/en",

  /* Même partage qu'en français : le title vise le moteur, l'og-titre garde la
     voix. L'ancien title faisait 68 signes et se faisait couper en SERP ;
     celui-ci en fait 54 et dit enfin « platform ». */
  meta: {
    titre: "Resto Action | Web platform for independent restaurants",
    description: `Google visibility, online ordering with no commission, customers who come back. The platform for Quebec's independent restaurants. ${PHONE_DISPLAY}.`,
    ogTitre:
      "Resto Action | We fix what's actually hurting independent restaurants",
    ogDescription:
      "We start by listening. We find what's eating your restaurant, and we fix it with you.",
    ogLocale: "en_CA",
  },

  nav: {
    aria: "Main navigation",
    accueil: "Home",
    faq: "FAQ",
    groupes: {
      plateforme: "Platform",
      entreprise: "Company",
      ressources: "Resources",
    },
    vueDensemble: "Overview",
    plateformeHref: "/en/platform",
    blogueHref: "/en/blog",
    descendre: "Skip to the next section",
    linkedin: "Resto Action on LinkedIn",
    youtube: "Resto Action on YouTube",
    appelle: "Call us",
    contacter: "Contact us",
    produits: "See our products",
    logoAlt: "Resto Action",
    mobileAria: "Mobile menu",
    ouvrirMenu: "Open the menu",
    fermerMenu: "Close the menu",
  },

  langue: { aria: "Language", courante: "English" },

  h1: {
    fixe: "Quebec's independent restaurants call us to",
    variantes: [
      "finally show up on Google.",
      "sell online without the commission.",
      "get their customers coming back.",
      "get an app of their own.",
    ],
  },

  hero: {
    promesses: [
      "Found on Google",
      "Orders without commission",
      "Customers who come back",
      "An app of your own",
    ],
    carteTitre: "Talk to Guillaume",
    carteSousTitre: "A 30-minute call.",
    guillaumeAlt: "Guillaume Therrien, co-founder of Resto Action",
    badge: "Made in Trois-Rivières, for local restaurants",
    titre: ["Your customers.", "Your sales.", "Your app."],
    puces: [
      "Web + mobile app in your name",
      "Delivery by our local drivers",
      "We install everything, you do nothing",
    ],
    recherche: {
      libelle: "Your restaurant's name",
      exemple: "Find your restaurant (e.g. Chez Paul diner)",
      bouton: "See my app",
    },
    condition: "$500 reservation, refundable until launch",
    generateur: {
      etapes: ["Your name and colours", "Your menu", "Your loyalty points"],
      enCours: "Building {nom}'s app…",
      titre: "Here is {nom}'s app.",
      texte: "Your menu, your photos and your colours: we set it up with you after your reservation. Your customers keep it on their home screen.",
      couleur: "Pick your colour",
      livrerA: "Deliver to",
      adresse: "Choose an address",
      ouvert: "Open until 9 pm",
      delai: "Delivery · 25–35 min",
      livraison: "Delivery",
      cueillette: "Pickup",
      promo: {
        etiquette: "Every day",
        titre: "Poutine + drink",
        texte: "Add a drink for only $2.50",
        bouton: "Order",
      },
      categories: ["Pizzas", "Poutines", "Wings", "Salads", "Sides"],
      populaires: "Popular",
      toutVoir: "See all",
      points: "Your points: 120",
      pointsDetail: "30 more points for free fries",
      plats: [
        { nom: "Pepperoni pizza", prix: "$18.99" },
        { nom: "Classic poutine", prix: "$13.95" },
        { nom: "BBQ wings", prix: "$15.99" },
        { nom: "Caesar salad", prix: "$11.99" },
        { nom: "Garlic bread", prix: "$6.99" },
      ],
      onglets: ["Home", "Menu", "Points", "Account"],
      note: "Sample preview: your real menu and photos replace these.",
      reserver: "Reserve {nom}'s app",
      fermer: "Close the preview",
    },
    places: "Only {reste} spots left in your city",
    reserver: "Reserve my founder spot",
    pasPret: "Not ready? Free 30-min call",
    video: {
      titre: "Resto Action: your own ordering app, your customers belong to you",
      lire: "Play the video “Your own ordering app” (in French)",
    },
  },

  resultats: {
    titre:
      "With Resto Action, you get more traffic, more sales, more customers coming back.",
    tablistAria: "What Resto Action changes for your restaurant",
    precedent: "Previous tab",
    suivant: "Next tab",
    lire: "Learn more",
    onglets: [
      {
        onglet: "More Google traffic",
        surTitre: "Your search ranking, fixed",
        titre: "Your restaurant finally shows up on Google",
      },
      {
        onglet: "More online sales",
        surTitre: "Orders without the commission",
        titre: "Online ordering that makes people want to add one more",
      },
      {
        onglet: "More repeat orders",
        surTitre: "Follow-ups that work for you",
        titre: "Your customers come back without you lifting a finger",
      },
      {
        onglet: "More app downloads",
        surTitre: "Your app, under your name",
        titre: "Reward your regulars in an app that's yours",
      },
    ],
    photoAlt:
      "A customer orders from the restaurant's app, sitting at a table in front of pizzas",
  },

  maquettes: {
    // Un signe de moins qu'en français : la frappe dure donc 70 ms de moins,
    // et c'est très bien — la partition est calculée sur la longueur réelle.
    recherche: "Pizza near me",
    tonResto: "Your restaurant",
    plats: [
      { nom: "Caesar Salad", prix: "$11.99" },
      { nom: "Garlic Bread", prix: "$13.99" },
      { nom: "Poutine", prix: "$12.99" },
      { nom: "Chicken Wings", prix: "$14.99" },
      { nom: "The Gotham", prix: "$34.00" },
    ],
    panier: "Your cart",
    // Le signe passe DEVANT le montant en anglais : « You keep $87.96 ».
    montant: { avant: "You keep $", separateur: ".", apres: "" },
    nouvelleCliente: "New customer",
    cliente: "Marie-Ève",
    etapes: [
      "1 day later",
      "Special offer sent",
      "Suggested dishes email",
      "Marie-Ève orders again",
      "1 day later",
      "Holiday special sent",
      "Marie-Ève becomes a regular",
    ],
    avatarAlt: "",
  },

  approche: {
    titre: "How it works",
    sousTitre: "Three steps, and we handle everything.",
    etapes: [
      {
        titre: "You reserve your spot",
        texte: "$500, refundable until the contract is signed.",
        alt: "The Resto Action mascot listening on the phone",
      },
      {
        titre: "We build your app and install it",
        texte: "Your web and mobile app in your colours, the kitchen tablet, and we train your team.",
        alt: "The Resto Action mascot examining an invoice with a magnifying glass",
      },
      {
        titre: "Your customers order from you",
        texte: "Pickup or delivery by our drivers. Your customer list grows with every order.",
        alt: "The Resto Action mascot giving a thumbs up, problem solved",
      },
    ],
  },

  plateformes: {
    titre: "On Uber, your customer isn't yours.",
    eux: {
      titre: "On the platforms",
      points: [
        "Up to 30% of every order",
        "Your customer belongs to them",
        "Your competitor shown right next to you",
      ],
    },
    toi: {
      titre: "With your app",
      points: [
        "You keep your margin",
        "Your customer is yours to bring back",
        "Local drivers, the money stays in Québec",
      ],
    },
    reserver: "Reserve my founder spot",
    sous: "$500, refundable until launch",
  },

  calcul: {
    titre: "What your app would do for you in a year",
    sousTitre: "Enter your real numbers. Watch what happens.",
    commandes: "Online orders per month",
    facture: "Average order",
    rejouer: "Replay the animation",
    liste: {
      titre: "Your customer list",
      unite: "orders per year with the customer's contact info",
      noms: ["Julie T.", "Marc L.", "Sophie B.", "Kevin R."],
      ajoute: "1st order",
      mois: "Your list growing, month after month",
    },
    ventes: {
      titre: "Sales you would never have had",
      unite: "in extra sales per year",
      parAn: "/ yr",
      leviers: [
        { titre: "Cart suggestions", detail: "“Add a drink?”: orders get 5% bigger" },
        { titre: "Text reminders and recovered carts", detail: "1 more order in 20" },
        { titre: "New customers found on Google", detail: "1 more order in 20" },
      ],
    },
    avis: {
      titre: "Your Google reviews",
      unite: "new reviews per year",
      texto: "Automatic text",
      sms: "Thanks Kevin! Would you leave us a review?",
      auteurs: ["Kevin R.", "Annie P.", "Luc M."],
      extraits: ["Arrived hot, perfect!", "Best poutine around", "So easy to order"],
      quand: "1 day ago",
    },
    garde: "kept per year instead of going to the platforms",
    hypotheses:
      "An estimate, not a guarantee. Money kept: typical 30% platform fees, compared with our $200 monthly subscription and our 10% delivery commission (pickup is 5%, so you keep even more). Extra sales (revenue, no added fee on suggestions): orders 5% bigger thanks to suggestions, 1 more order in 20 from reminders and recovered carts, 1 more in 20 from Google. Reviews: 1 order in 20. The names and reviews shown are examples. Before taxes and card fees.",
    reserver: "Reserve my founder spot",
  },

  produits: {
    titre: "Three apps, one system.",
    attente: "Preview coming",

    apps: [
      {
        demo: "client",
        etiquette: "Your customers' app",
        titre: "An app under your name, not a middleman's",
        texte: [
          "Your menu, your photos, your colours, your points programme. Customers browse, order for delivery or pickup, and find their past orders. On their home screen, it's your name that stays.",
        ],
        alt: "Demonstration of the Bistro Habibi ordering app",
      },
      {
        demo: "cuisine",
        etiquette: "Your kitchen's app",
        titre: "Resto Action",
        texte: [
          "Orders come in, ring, and move from ",
          { statut: "new" },
          " through to ",
          { statut: "delivered" },
          " in one queue. A sold-out dish comes off the menu in one tap. Hours, service pauses and delivery fees are set from the same place.",
        ],
      },
      {
        demo: "livreur",
        etiquette: "Your drivers' app",
        titre: "Resto Go",
        texte: [
          "Your drivers watch runs come in and claim one. The address opens in Maps, the customer is one call away. And you know where every delivery stands without calling anyone.",
        ],
        alt: "Demonstration of the Resto Go drivers' app",
      },
    ],
  },

  offre: {
    surTitre: "Founder offer",
    titre: "Your setup for $500. The only time it will be this price.",
    apresAvant: "After the founder spots:",
    apresPrix: "$1,000",
    inclusTitre: "Everything included",
    inclus: [
      "Your web and mobile app, in your name",
      "Delivery by our local drivers",
      "Your points and text reminders",
      "Your customer list, which belongs to you",
      "Your Google profile, optimized",
      "We install and train your team",
    ],
    garantie: {
      titre: "90-day guarantee",
      texte:
        "If the orders on your app haven't saved you at least what you paid us, compared with your real platform fees, we refund your subscription and our commissions.",
      note: "One condition: you completed the redirection steps we give you. Setup and equipment excluded.",
    },
    coutsTitre: "What you pay, in full",
    couts: [
      { quand: "Today", quoi: "$500", detail: "Refundable until the contract is signed" },
      { quand: "At installation", quoi: "$495", detail: "Tablet, stand, counter sign and 500 inserts" },
      { quand: "First 3 months", quoi: "$100 / month", detail: "50% off the subscription" },
      { quand: "After that", quoi: "$200 / month", detail: "The monthly subscription" },
      { quand: "On orders", quoi: "5% · 10%", detail: "Pickup · delivery, on food only" },
    ],
    taxes: "Taxes and card fees extra.",
    reserver: "Reserve my founder spot",
  },

  histoire: {
    titre: "Our story",
    linkedinDe: "{nom}'s LinkedIn profile",
    jalons: [
      {
        titre: "Restaurants are closing",
        texte:
          "Every birthday in Guillaume's family was celebrated at the same restaurant. Same table, same owner. In 2020 it closed, like hundreds of others in Quebec.",
        alt: "Guillaume Therrien, co-founder of Resto Action",
        legende: "Guillaume",
      },
      {
        titre: "Tech leaves them out",
        texte:
          "The same tools that power the big chains stay out of reach for the shop around the corner: too expensive, too complicated, never built for it. Xavier is building to change that.",
        alt: "Xavier Lida, co-founder of Resto Action",
        legende: "Xavier",
      },
      {
        titre: "Young people in Action",
        texte:
          "They met at the École d'entrepreneurship de Beauce. Guillaume pitched the idea and the team came together on the spot. They won the CEED Challenge and decided to act.",
        alt: "CEED Challenge 2026 certificate, 1st place, awarded to Guillaume Therrien for Resto Action",
        legende: "1st place, CEED Challenge 2026",
      },
    ],
    convictions: {
      titre: "What we believe",
      fondateurs: [
        {
          nom: "Guillaume",
          role: "Co-founder · sales and field",
          alt: "Guillaume Therrien, co-founder of Resto Action",
          points: [
            { titre: "Your margins first.", texte: "Every dollar a platform takes from you, we want to give back." },
            { titre: "Happy customers who come back.", texte: "A satisfied customer orders again. That is what keeps a restaurant alive." },
            { titre: "Real people in the field.", texte: "We come to you, we speak French, and you have a real number to call." },
            { titre: "Sales you wouldn't have had.", texte: "Google, texts, points: we go after new orders, not just the ones from Uber." },
          ],
        },
        {
          nom: "Xavier",
          role: "Co-founder · technology",
          alt: "Xavier Lida, co-founder of Resto Action",
          points: [
            { titre: "Everything optimized.", texte: "Every screen and every ordering step is built to be fast and to sell more." },
            { titre: "Reliable systems.", texte: "The order comes in, your kitchen sees it, the driver picks it up. No stress." },
            { titre: "Always improving.", texte: "We keep refining your tools, based on what we see in our restaurants." },
          ],
        },
      ],
    },
  },

  chaine: {
    surTitre: "Our YouTube channel",
    titre: "The story continues on YouTube",
    texte:
      "It's where we tell why Resto Action exists, and how an independent restaurant takes back control of its orders, its margins and its customers. Start with our story, then subscribe so you don't miss what comes next.",
    abonner: "Subscribe to the channel",
    video: {
      titre:
        "Our story: more profit, more customers, more control for restaurants",
      description:
        "What if restaurants could bring in more orders, win back their margins and, above all, take back control of their customers? That is exactly why we built Resto Action: to help restaurant owners grow their own digital ecosystem and depend less on the big platforms.",
      lire: "Play the video “Our story” (5 min 32 s, in French)",
      // Says only what is certain. The player ASKS YouTube for English
      // captions, but whether they exist is up to YouTube, not to us.
      mention: "Video in French.",
    },
  },

  faq: {
    titre: "Frequently asked questions",
    items: [
      {
        q: "What is Resto Action?",
        a: "Resto Action is a web platform for Quebec's independent restaurants, built in Trois-Rivières: Google visibility, online ordering with no commission, customer follow-ups, and an app under your own name.",
      },
      {
        q: "What kinds of problems do you fix?",
        a: "Commissions eating your margins, customers you can't reach, visibility, tools that cost you too much. Whatever the problem, we start by listening.",
      },
      {
        q: "How much does it cost?",
        a: `It depends on your restaurant and your problem. Call us at ${PHONE_DISPLAY}, we'll look at it together in 30 minutes, numbers in hand.`,
      },
      {
        q: "Where are you? Who do you serve?",
        a: "We're based in Trois-Rivières, in the Mauricie region, and we work with independent restaurants all across Quebec.",
      },
      {
        q: "How do we start?",
        a: `You call us at ${PHONE_DISPLAY}, you write to us, or you book your call right here on the site. Thirty minutes to look together at what's eating your restaurant. No pressure, no 40-page contract.`,
      },
    ],
  },

  contact: {
    titre: "Let's talk about your restaurant.",
    texte:
      "A 30-minute call is enough to see what Resto Action can do for your restaurant.",
    signature: "Guillaume Therrien · Resto Action",
  },

  agenda: {
    chargement: "One moment, opening the calendar…",
    duree: "30 minutes with Guillaume, over Google Meet.",
    fuseau: "Eastern time",
    choisirJour: "Which day?",
    choisirHeure: "What time?",
    matin: "Morning",
    apresMidi: "Afternoon",
    soiree: "Evening",
    moisPrecedent: "Previous month",
    moisSuivant: "Next month",
    aucun:
      "No open slots right now. Give us a call and we'll find you a time.",
    panneTitre: "The calendar isn't answering",
    panneTexte: "It happens. Call us and we'll book it by hand.",
    coordonnees: "Your details",
    retour: "Pick another time",
    nom: "Your name",
    restaurant: "Your restaurant",
    courriel: "Your email",
    telephone: "Your phone",
    sujet: "What you'd like to talk about",
    facultatif: "optional",
    envoyer: "Confirm my call",
    envoi: "Booking…",
    confirmeTitre: "You're booked.",
    confirmeTexte:
      "The invite just went out to {courriel}. It has the link for the call.",
    meet: "Open the Google Meet",
    erreurs: {
      invalide: "Something's missing. Double-check your details.",
      pris: "Someone just took that time. Pick another one.",
      double:
        "You already have a call coming up with us. Call us to move it.",
      trop: "Too many tries at once. Give it a few minutes.",
      google: `The calendar isn't answering. Call us at ${PHONE_DISPLAY}.`,
      config: `The calendar isn't answering. Call us at ${PHONE_DISPLAY}.`,
      reseau: "The connection dropped. Try again.",
    },
  },

  pageContact: {
    metaTitre: "Contact us",
    metaDescription:
      "Two ways to reach Resto Action: book a 30-minute call with Guillaume, or call us directly at 819 944-4661.",
    surtitre: "We answer fast",
    titre: "Let's talk about your restaurant.",
    rdv: {
      titre: "Book a call",
      texte:
        "Pick your time in the calendar. Thirty minutes with Guillaume, no pressure and no commitment.",
      bouton: "Pick my time",
    },
    tel: {
      titre: "Call right now",
      texte:
        "If you'd rather talk to someone today, the phone rings at our office, not in a call centre.",
      bouton: "Call us",
    },
    agendaTitre: "Pick your time",
    retour: "Back to home",
  },

  pied: {
    aria: "Footer",
    tagline:
      "A Trois-Rivières company working for Quebec's independent restaurants.",
    plateforme: "The platform",
    approche: "Our approach",
    produits: "Our products",
    histoire: "Our story",
    youtube: "YouTube channel",
    faq: "FAQ",
    blogue: "The blog",
    confidentialite: "Privacy policy",
    confidentialiteHref: "/en/privacy",
    ceduler: "Book a call",
    adresse: `${STREET}, Trois-Rivières (Quebec) ${POSTAL_CODE.replace(" ", "\u00A0")}`,
    miseAJour: "Site updated {date}",
    droits: "© {annee} Resto Action, a product of",
    droitsFin: ", Trois-Rivières, Quebec.",
  },

  donnees: {
    definition:
      "Resto Action is a Quebec platform for independent restaurants: we get you found on Google, we take your online orders without the commission, we bring your customers back, and we give you an app under your own name.",
    zoneServie: "Quebec, Canada",
  },
};
