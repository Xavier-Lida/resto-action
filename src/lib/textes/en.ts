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
    titre: "Resto Action | Web and mobile app for independent restaurants",
    description: `Your own web and mobile ordering app. Without the platforms' 30%, found on Google, with customers who come back. For Quebec's independent restaurants. ${PHONE_DISPLAY}.`,
    ogTitre:
      "Resto Action | We fix what's actually hurting independent restaurants",
    ogDescription:
      "Your customers order from you, not from Uber. Your web and mobile app, local drivers, and a customer list that belongs to you.",
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
      "sell online without giving up 30%.",
      "get their customers coming back.",
      "get an app of their own.",
    ],
  },

  hero: {
    promesses: [
      "Found on Google",
      "Orders without the 30%",
      "Customers who come back",
      "An app of your own",
    ],
    carteTitre: "Talk to Guillaume",
    carteSousTitre: "A quick call.",
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
      bouton: "My free mockup",
    },
    condition: "$500 reservation, refundable until launch",
    maquette: {
      titre: "A mockup for {nom}, made by hand.",
      titreGenerique: "Your free mockup, made by hand.",
      restaurant: "Your restaurant's name",
      texte:
        "We build a real mockup of your app, not a template: your logo, your menu, your photos. Free, no commitment, and sent to your email within 48 hours.",
      inclus: ["Your logo and colours", "Your real menu, with your prices", "Your photos, not stock pictures"],
      nom: "Your name",
      courriel: "Your email",
      cell: "Your cell",
      ville: "City",
      menu: "Link to your menu or website",
      facultatif: "optional",
      bouton: "Get my mockup",
      envoi: "Sending…",
      exemple: "The one we built for Bistro Habibi",
      exempleAlt: "Bistro Habibi's app scrolling: home, menu, account and cart",
      attente: "Bistro Habibi's app",
      decide: "Already decided?",
      reserver: "Reserve my founder spot",
      merciTitre: "Got it, {prenom}!",
      merciTexte:
        "The mockup for {nom} will be sent to {courriel} within 48 hours. If we have a question about your menu, we'll call.",
      merciReserver: "Reserve my spot while they last",
      erreurs: {
        invalide: "Your name, email, cell or city is missing.",
        trop: "Too many tries at once. Try again in a few minutes.",
        autre: "That didn't go through. Call or text us at {tel} and we'll take care of it.",
      },
    },
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
    pasPret: "Not ready yet?",
    hesite: {
      titre: "Not ready yet? No problem.",
      texte: "Two ways to move forward at your own pace, no commitment.",
      maquette: {
        titre: "Get your free mockup",
        texte: "Your app with your logo and menu, by email within 48 hours.",
      },
      appel: {
        titre: "Talk to Guillaume",
        texte: "Pick a time, he'll call you.",
      },
      appelTitre: "Pick a time, Guillaume will call you.",
      retour: "Back",
      fermer: "Close",
    },
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
        surTitre: "Orders without the platforms' 30%",
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
        "Your customer is yours, and the app brings them back on its own",
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
    titre: "New customers from the first month. Not just savings.",
    sousTitre: "We don't give you a discount. We invest in your growth.",
    pub: {
      montant: "$300",
      titre: "of advertising, paid by us",
      texte:
        "For your first 3 months, we run your Facebook and Instagram ads, right before mealtimes. Every new customer is yours.",
    },
    inclusTitre: "What's included",
    inclus: [
      "Your web and mobile app, in your name",
      "Your Google profile, optimized",
      "Text and email reminders",
      "Delivery by our drivers",
      "$300 of ads, run by us",
    ],
    garantie: {
      titre: "90-day guarantee",
      texte: "If you don't get back what it cost you, we refund you.",
      note: "Subscription and commissions refunded, if you followed our steps.",
    },
    coutsTitre: "The price, in full",
    couts: [
      { quand: "Today", quoi: "$500", barre: "$1,000", detail: "Setup, founder price" },
      { quand: "At installation", quoi: "$495", detail: "Tablet, stand and inserts" },
      { quand: "Every month", quoi: "$200", detail: "Subscription" },
      { quand: "Per order", quoi: "5% · 10%", detail: "Pickup · delivery (Uber: up to 30%)" },
    ],
    taxes: "Taxes and card fees extra.",
    reserver: "Reserve my founder spot",
    condition: "$500 reservation, refundable before launch.",
  },
  reservation: {
    metaTitre: "Reserve your founder spot | Resto Action",
    metaDescription:
      "Reserve your Resto Action founder spot in 4 steps: your restaurant, your app, the offer, then payment. $500, refundable until launch.",
    retour: "Back to site",
    etape: "Step {n} of 4",
    etapes: ["Your restaurant", "Your app", "The offer", "Reservation"],
    suivant: "Continue",
    precedent: "Back",
    resto: {
      titre: "Tell us about your restaurant",
      texte: "We build an app with your name on it. Takes 2 minutes.",
      restaurant: "Restaurant name",
      exempleResto: "E.g. Corner Pizzeria",
      ville: "City",
      exempleVille: "E.g. Trois-Rivières",
      nom: "Your name",
      courriel: "Email",
      telephone: "Phone",
    },
    app: {
      titre: "Your app, made by hand",
      texte: "We build it with your logo, your menu and your photos. Give us something to start from, we handle the rest.",
      menu: "Link to your menu or website",
      facultatif: "optional",
      exempleMenu: "E.g. facebook.com/yourrestaurant or your site",
      menuAide: "No link? No problem: we'll find your menu and have you approve it.",
      livraisonMaquette: "Your mockup is sent to {courriel} within 48 hours.",
      service: "What you offer",
      services: {
        livraison: "Delivery and pickup",
        cueillette: "Pickup only",
      },
      plateformes: "Which platforms are you on right now?",
      listePlateformes: ["Uber Eats", "DoorDash", "SkipTheDishes", "None"],
      commandes: "How many orders a week go through those platforms?",
      listeCommandes: ["Under 50", "50 to 150", "150 to 300", "Over 300", "Not sure"],
    },
    offre: {
      titre: "Your founder spot",
      texte: "$500 today: your founder price, plus $300 of ads paid by us for 3 months. Here is everything you will pay, no surprises.",
      accord:
        "I've read everything I will pay. I understand my $500 is refundable until my app launches.",
    },
    paiement: {
      titre: "Let's reserve your spot",
      texte: "You'll go to Stripe's secure checkout. Your invoice, with GST and QST, arrives by email.",
      recap: "Your reservation",
      ligne: "Founder spot",
      tps: "GST (5%)",
      tvq: "QST (9.975%)",
      total: "Total today",
      bouton: "Pay {total} and reserve",
      envoi: "Opening checkout…",
      securite: "Secure payment by Stripe. We never see your card number.",
      annule: "Payment was cancelled: your spot isn't reserved yet. Try again whenever you're ready.",
    },
    erreurs: {
      invalide: "Something's missing, or the email isn't valid.",
      accord: "Check the box to continue.",
      trop: "Too many tries at once. Try again in a few minutes.",
      config: "Online payment isn't open yet. Call us at {tel} and we'll reserve your spot by phone.",
      stripe: "Checkout couldn't open. Try again, or call us at {tel}.",
    },
    apercuDefaut: "your restaurant",
    apercu: {
      titre: "{nom}'s app, made by hand",
      texte: "Like Bistro Habibi's: your logo, your menu, your photos. Not a template.",
    },
    merci: {
      metaTitre: "Your spot is reserved | Resto Action",
      titre: "You're in, {nom}!",
      titreGenerique: "Thank you!",
      texte: "Your founder spot for {resto} is yours. Your invoice was sent to {courriel}.",
      texteGenerique: "If your payment went through, your invoice is in your inbox. Not sure? Call us at {tel}.",
      suiteTitre: "What's next",
      suite: [
        "Your mockup arrives by email within 48 hours.",
        "We call you to plan your installation.",
        "We build your app with your menu, photos and colours.",
        "We install the tablet and train your team.",
        "You launch, and we start your Facebook and Instagram ads, paid by us.",
      ],
      retour: "Back to home",
    },
  },

  histoire: {
    titre: "Our story",
    linkedinDe: "{nom}'s LinkedIn profile",
    ceed: {
      titre: "1st place, CEED Challenge 2026",
      texte: "The team came together at the École d'entrepreneurship de Beauce. We won, and we decided to act.",
      alt: "CEED Challenge 2026 certificate, 1st place, awarded to Guillaume Therrien for Resto Action",
    },
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
        a: "Your own web and mobile ordering app, under your name, for Quebec's independent restaurants. Built in Trois-Rivières. Your customers order from you instead of Uber Eats or DoorDash, and we handle the rest: your Google listing, text reminders that bring them back, and delivery by local drivers.",
      },
      {
        q: "Is it a mobile app or a website?",
        a: "Both. Customers order on your site, right in the browser, nothing to download: that's your web app. Your regulars download your mobile app under your name, on iPhone and Android. Same menu, same account, same points.",
      },
      {
        q: "Do you take a commission?",
        a: "Yes, a small one: 5% on pickup and 10% on delivery, on food only. The platforms take up to 30%.",
      },
      {
        q: "How much does it cost?",
        a: "For founding restaurants: $500 setup instead of $1,000, $495 for equipment at installation (tablet, stand, counter sign and inserts), and a $200 monthly subscription. Plus 5% on pickup and 10% on delivery. Taxes extra. On top of that, we pay for $300 of Facebook and Instagram ads for you during your first 3 months. The $500 is refundable until launch.",
      },
      {
        q: "Why no discount?",
        a: "A discount saves you $300 once. $300 of well-placed ads brings you new customers who order again for months. We'd rather put that money where it pays you back.",
      },
      {
        q: "And after the 3 months?",
        a: "You can keep the ads going with your own budget. We run them for you and take nothing from your ad budget: we make money when you sell more.",
      },
      {
        q: "Who keeps the customers?",
        a: "You do. Every customer who orders through your app is in your database. You reach out whenever you want. On the platforms, your customers belong to them.",
      },
      {
        q: "Where are you? Who do you serve?",
        a: "We're based in Trois-Rivières, in the Mauricie region, and we work with independent restaurants all across Quebec.",
      },
      {
        q: "How do we start?",
        a: `Reserve your founder spot online: 4 steps, 2 minutes, $500 refundable until launch. We call you within 24 hours to plan your installation. Not ready? Call us at ${PHONE_DISPLAY} or book a quick call with Guillaume.`,
      },
    ],
  },

  contact: {
    titre: "Let's talk about your restaurant.",
    texte:
      "A quick call is enough to see what Resto Action can do for your restaurant.",
    signature: "Guillaume Therrien · Resto Action",
  },

  agenda: {
    chargement: "One moment, opening the calendar…",
    duree: "A quick call: Guillaume calls you at the time you pick.",
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
      "The invite just went out to {courriel}. Guillaume will call you at that time.",
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
      "Two ways to reach Resto Action: book a quick call with Guillaume, or call us directly at 819 944-4661.",
    surtitre: "We answer fast",
    titre: "Let's talk about your restaurant.",
    rdv: {
      titre: "Book a call",
      texte:
        "Pick your time in the calendar. A quick call with Guillaume, no pressure and no commitment.",
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
      "Resto Action is the web and mobile ordering app for Quebec's independent restaurants: under your own name, without the platforms' 30%, with Google visibility, follow-ups that bring customers back, and delivery by local drivers.",
    zoneServie: "Quebec, Canada",
  },
};
