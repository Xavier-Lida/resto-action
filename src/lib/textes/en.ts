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
    appelle: "Call us",
    contacter: "Contact us",
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
    titre: "Our approach",
    sousTitre: "We really do adapt to every restaurant!",
    etapes: [
      {
        titre: "We listen",
        texte: "A 30-minute call, you tell us about your restaurant.",
        alt: "The Resto Action mascot listening on the phone",
      },
      {
        titre: "We dig in with you",
        texte: "Together we find what's eating your margins.",
        alt: "The Resto Action mascot examining an invoice with a magnifying glass",
      },
      {
        titre: "We fix the problem",
        texte: "A solution built for you, not a recipe off the shelf.",
        alt: "The Resto Action mascot giving a thumbs up, problem solved",
      },
    ],
  },

  mission: {
    surTitre: "Our mission",
    titre: "Think of the last independent restaurant you ate at.",
    p1a: "The owner is up at 5 to take deliveries. He knows his regulars by name. The recipe might be his mother's. He works 70 hours a week to keep a margin of 3 to 9%",
    p1b: ".",
    p2a: "And meanwhile everything climbs: rent, food, equipment, insurance.",
    p2fort: "Every week, another fire to put out.",
    p2b: "He doesn't have a minute to sit down and look at what's really eating his restaurant.",
    p3a: "If nothing changes, those restaurants close one by one, and we trade our variety for multinationals. In 10 years, what's left?",
    p3fort: "Chains and franchises.",
    chute:
      "We refuse to accept that. Our mission: that the work of Quebec restaurant owners pays them back, for everyone's good.",
    sourceAvant: "Source: 1.",
    sourceLien: "Restaurants Canada",
    sourceApres: ", data on pre-tax profit margins in foodservice.",
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
        titre: "The margins are thin",
        texte:
          "Justin lived it working in restaurants: every loss counts, every dollar handed to a middleman hurts.",
        alt: "Justin Bouillon, co-founder of Resto Action",
        legende: "Justin",
      },
      {
        titre: "Young people in Action",
        texte:
          "They met at the École d'entrepreneurship de Beauce. Guillaume pitched the idea, Justin was in on the spot. They won the CEED Challenge and decided to act.",
        alt: "CEED Challenge 2026 certificate, 1st place, awarded to Guillaume Therrien for Resto Action",
        legende: "1st place, CEED Challenge 2026",
      },
    ],
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
    mission: "Our mission",
    histoire: "Our story",
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
