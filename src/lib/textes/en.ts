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
    ogTitre: "Resto Action | Your own web and mobile ordering app, under your name",
    ogDescription:
      "More online sales. More money at the end of the month. Your app under your name, new customers, and less money left to the platforms.",
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
    titre: ["Your app.", "Your sales.", "Your customers."],
    appHabibi: "Bistro Habibi's app, built by us",
    puces: [
      "Web + mobile app in your name",
      "Delivery, with no drivers to manage",
      "We install everything, you have nothing to do",
    ],
    recherche: {
      libelle: "Your restaurant's name",
      exemple: "Find your restaurant (e.g. Chez Paul diner)",
      bouton: "My free mockup",
    },
    condition: "Free. We'll call you to set your date.",
    maquette: {
      titre: "A mockup for {nom}, made by hand.",
      titreGenerique: "Your free mockup, made by hand.",
      restaurant: "Your restaurant's name",
      texte:
        "We build a real mockup of your app, not a template: your logo, your menu, your photos. Free, no commitment, and sent to your email address.",
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
      vieprivee: "Your details are used only to build your mockup and reach you.",
      reserver: "Reserve my spot",
      merciTitre: "Got it, {prenom}!",
      merciTexte:
        "The mockup for {nom} is being sent to {courriel}. If we have a question about your menu, we'll call.",
      merciReserver: "Reserve my spot",
      erreurs: {
        invalide: "Your name, email, cell or city is missing.",
        trop: "Too many tries at once. Try again in a few minutes.",
        autre: "That didn't go through. Call or text us at {tel} and we'll take care of it.",
      },
    },
    apercu: {
      etiquette: "Automatic preview",
      chargement: "Looking up your Google listing…",
      choisir: "Which one is it?",
      note: "Built automatically from your Google listing. Your real app, with your menu and your photos, is ready 48 hours after you send us your access.",
      aucun: "We couldn't find your Google listing. Here's the app we built for Bistro Habibi:",
      couleur: "Try a colour",
      avis: "Google reviews",
      commander: "Order",
      vedette: "Featured",
      points: "Your loyalty points",
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
    places: "16 restaurants a month, no more",
    placesPrix: "Next cohort: January 2027",
    reserver: "Reserve your spot",
    pasPret: "Not ready yet?",
    hesite: {
      titre: "Not ready yet? No problem.",
      texte: "Two ways to move forward at your own pace, no commitment.",
      maquette: {
        titre: "See what you would have kept",
        texte: "Your platform statement, your estimate. Your real number, no commitment.",
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
        onglet: "More Google customers",
        surTitre: "Your search ranking, fixed",
        titre: "Your restaurant finally shows up on Google",
      },
      {
        onglet: "More online sales",
        surTitre: "Orders without the platforms' 30%",
        titre: "Online ordering that makes people want to add one more",
      },
      {
        onglet: "More loyal customers",
        surTitre: "Follow-ups that work for you",
        titre: "Your customers come back without you lifting a finger",
      },
      {
        onglet: "More app downloads",
        surTitre: "Your app, under your name",
        titre: "Reward your customers in your own app",
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
    // Le signe passe DEVANT le montant en anglais : « Cart · $87.96 ».
    montant: { avant: "Cart · $", separateur: ".", apres: "" },
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
        texte: "Free. We'll call you to set your date.",
        alt: "The Resto Action mascot listening on the phone",
      },
      {
        titre: "We prepare your app with you",
        texte: "Your menu, your photos, your colours.",
        alt: "The Resto Action mascot examining an invoice with a magnifying glass",
      },
      {
        titre: "Your customers order from you",
        texte: "After testing, we install and train your team.",
        alt: "The Resto Action mascot giving a thumbs up, problem solved",
      },
    ],
  },

  plateformes: {
    titre: "On the platforms, your customer isn't yours.",
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
        "A local team, the money stays in Quebec",
      ],
    },
    reserver: "Reserve my spot",
    sous: "Free. We'll call you to set your date.",
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
    hypothesesVoir: "An estimate, not a guarantee. See the assumptions",
    hypotheses:
      "An estimate, not a guarantee. Money kept: typical 30% platform fees, compared with our $200 monthly subscription and our 10% delivery commission (pickup is 5%, so you keep even more). Extra sales (revenue, no added fee on suggestions): orders 5% bigger thanks to suggestions, 1 more order in 20 from reminders and recovered carts, 1 more in 20 from Google. Reviews: 1 order in 20. The names and reviews shown are examples. Before taxes and card fees.",
    reserver: "Reserve my spot",
  },

  produits: {
    titre: "Three apps, one system.",
    attente: "Preview coming",
    tablette: {
      alt: "Kitchen tablet demo: a new order comes in, gets accepted, moves to preparation, then to the driver",
      resto: "Bistro Habibi",
      ouvert: "Open",
      onglets: ["Orders", "Menu", "Settings"],
      colonnes: { nouvelles: "New", preparation: "Preparing", pretes: "Ready" },
      nouvelle: "New order",
      livraison: "Delivery",
      cueillette: "Pickup",
      articles: "items",
      accepter: "Accept",
      prete: "Ready",
      tempsPrep: "Prep time",
      minutes: "min",
      pretDans: "Ready in {n} min",
      livreurArrive: "Ali arrives in 2 min",
      remis: "Handed to driver",
      jour: "Today: {n} orders · {montant}",
      commande: {
        numero: "#1043",
        client: "Marie-Ève L.",
        total: "$46.48",
        plats: [
          { qte: 2, nom: "Panuozzo Habibi", note: "Spicy sauce" },
          { qte: 1, nom: "House fries", note: "" },
          { qte: 1, nom: "Coca-Cola", note: "" },
        ],
      },
      autres: [
        { numero: "#1042", client: "Sophie T.", mode: "livraison", articles: 2 },
        { numero: "#1041", client: "Jean-François B.", mode: "cueillette", articles: 3 },
      ],
      prete1: { numero: "#1039", client: "Karim D." },
    },

    apps: [
      {
        demo: "client",
        court: "Customers",
        etiquette: "Your customers' app",
        titre: "An app under your name, not a middleman's",
        texte: [
          "Your menu, your colours, your points. On your customer's screen, your name stays.",
        ],
        alt: "Demonstration of the Bistro Habibi ordering app",
      },
      {
        demo: "cuisine",
        court: "Kitchen",
        etiquette: "Your kitchen's app",
        titre: "Resto Action",
        texte: [
          "Orders come in and move from ",
          { statut: "new" },
          " through to ",
          { statut: "delivered" },
          " in one queue.",
        ],
      },
      {
        demo: "livreur",
        court: "Drivers",
        etiquette: "Your drivers' app",
        titre: "Resto Go",
        texte: [
          "Your drivers claim runs. You know where every delivery stands.",
        ],
        alt: "Demonstration of the Resto Go drivers' app",
      },
    ],
  },

  lancement: {
    titre: "The Big Winter Launch",
    accroche: "Next cohort: January 2027. We launch at most 16 restaurants a month in Quebec.",
    resume: "Next cohort: January 2027, sign-ups until Friday, December 18, 2026. Your reservation is free; the setup fee is paid at signing. Your subscription starts when you go live.",
    texte: "We launch at most 16 restaurants a month in Quebec, 4 a week: that's our limit, so we can launch every restaurant properly. To be part of the January 2027 cohort, sign before Friday, December 18, 2026.",
    date: "It takes 2 weeks for your menu, your photos, your app, the printing and the installation. After the deadline, you launch with the next cohort, one month later.",
    abonnement: "Your $200 monthly subscription starts when your app goes live, with your 4 guarantees.",
    remboursement: "The $750 setup fee is paid at signing. Not ready yet? Sign up for free: we'll keep you posted.",
  },

  offre: {
    surTitre: "The Big Winter Launch",
    titre: "Let's prepare your launch.",
    sousTitre: "We don't give you a discount. We invest in your growth.",
    pub: {
      montant: "$300",
      titre: "of advertising, paid by us",
      texte:
        "Your first 7 days live, we run your Facebook and Instagram ads.",
    },
    inclusTitre: "What's included",
    inclus: [
      "Your web and mobile app, under your name",
      "Your Google listing, optimized",
      "Text and email reminders",
      "Delivery, with no drivers to manage",
      "$300 of ads, run by us",
    ],
    garantie: {
      titre: "4 guarantees on your results",
      texte: "48 Hours Flat, The Busy Printer, It Pays Off or It's Free, and Boomerang Money: if your app hasn't brought you at least your setup fee in your first 90 days, we refund it.",
      note: "For all 4 guarantees: your plaques and your sign in place, and our cards in your bags. The 1st also requires your menu, your photos and your access within 5 days. The same month is never credited twice.",
    },
    coutsTitre: "The price, all in",
    couts: [
      { quand: "At signing", quoi: "$750", detail: "Big Winter Launch price, then $1,500" },
      { quand: "Every month, from go-live", quoi: "$200", detail: "Subscription. The printer is included at no cost." },
      { quand: "Per order", quoi: "5% + $0.30 · 10% + $3.51", detail: "Pickup · delivery, card fees included" },
    ],
    taxes: "Taxes extra.",
    reserver: "Reserve your spot",
    reserverCourt: "Reserve your spot",
    condition: "Free. We'll call you to set your date.",
  },
  reservation: {
    metaTitre: "Reserve your spot in The Big Winter Launch | Resto Action",
    metaDescription:
      "Reserve your spot for free in the January 2027 cohort. We launch at most 16 restaurants a month in Quebec.",
    retour: "Back to site",
    etape: "Step {n} of 4",
    etapes: ["Your restaurant", "Your app", "The offer", "Reservation"],
    suivant: "Continue",
    precedent: "Back",
    resto: {
      titre: "Tell us about your restaurant",
      texte: "Get your app under your name ready. Reserving takes 2 minutes.",
      restaurant: "Restaurant name",
      exempleResto: "E.g. Corner Pizzeria",
      ville: "City",
      exempleVille: "E.g. Trois-Rivières",
      nom: "Your name",
      courriel: "Email",
      telephone: "Phone",
    },
    app: {
      titre: "Your app, under your name",
      texte: "We build it with your logo, your menu and your photos. Give us something to start from, we handle the rest.",
      menu: "Link to your menu or website",
      facultatif: "optional",
      exempleMenu: "E.g. facebook.com/yourrestaurant or your site",
      menuAide: "No link? No problem: we'll find your menu and have you approve it.",
      livraisonMaquette: "After you sign, you send us your menu, your photos and your access within 5 days: your app is ready in 48 hours.",
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
      titre: "Your spot in The Big Winter Launch",
      texte: "Reserve for free. The setup fee is paid at signing, and your subscription starts when you go live. Here is the price, all in.",
      conditions: "Read the terms",
      // Même chemin que CONDITIONS dans src/lib/routes.ts.
      conditionsHref: "/en/founder-terms",
      accord:
        "I've read the all-in price. My reservation is free: my spot is confirmed when I sign my agreement, and the setup fee is paid at that time.",
    },
    paiement: {
      titre: "Let's reserve your spot",
      texte: "It's free, no payment. We'll call you within 24 hours to set your date and sign your agreement.",
      recap: "Your reservation",
      gratuit: "Free",
      ligne: "Spot reservation",
      textos: "I agree to receive text messages from Resto Action about my launch. I can unsubscribe at any time.",
      bouton: "Reserve my spot",
      envoi: "Sending…",
      vieprivee: "Your details are used only to build your app and reach you.",
    },
    erreurs: {
      invalide: "Something's missing, or the email isn't valid.",
      accord: "Check the box to continue.",
      trop: "Too many tries at once. Try again in a few minutes.",
      autre: "That didn't go through. Try again, or call us at {tel} and we'll reserve your spot by phone.",
    },
    apercuDefaut: "your restaurant",
    apercu: {
      titre: "Start selling more online.",
      points: ["More customers.", "You save on every order."],
      exemple: "Bistro Habibi's app, built by us",
    },
    dossier: {
      metaTitre: "Your file | Resto Action",
      surTitre: "Your file",
      progression: "{n} of {total} steps",
      etapes: [
        { titre: "Agreement signed", texte: "Your agreement is signed and your setup fee is paid." },
        { titre: "Your menu, your photos and your access", texte: "You send them to us within 5 days." },
        { titre: "Your app is ready", texte: "48 hours after your access. You approve it." },
        { titre: "Your launch date", texte: "Your printer plugged in within 10 minutes, and your one-hour private training, in person." },
        { titre: "Your first 7 days", texte: "$300 of ads paid by us, our cards in your bags, and a text every evening with the day's orders." },
        { titre: "Every Monday", texte: "The Monday Text: your orders, your new sales and the money brought in." },
      ],
      enCours: "In progress",
      prochainPoint: "Next check-in with us",
      aConfirmer: "To be confirmed",
      dateLancement: "Go-live",
      message: "A word from the team",
      misAJour: "Updated {date}",
      actions: "Need something?",
      envoyerMenu: "Send my menu and photos",
      appeler: "Call Guillaume",
      introuvable: "We couldn't find this file. Check the link in your email, or call us at {tel}.",
      sujetMenu: "Menu and photos: {resto}",
      voir: "See my file",
      voirTexte: "Keep this link: it shows where your app is at, any time.",
    },
    merci: {
      metaTitre: "Got it | Resto Action",
      titre: "Got it, {prenom}!",
      titreSansPrenom: "Got it!",
      etiquette: "The Big Winter Launch · {resto}",
      etiquetteSansResto: "The Big Winter Launch",
      texte: "We'll call you within 24 hours to set your date and sign your agreement.",
      suiteTitre: "What's next",
      suite: [
        "You send us your menu, your photos and your access: 5 days.",
        "Your app is ready: 48 hours.",
        "Your launch date: your printer plugged in within 10 minutes, and your one-hour private training, in person.",
        "Your first 7 days: $300 of ads paid by us, our cards in your bags, and a text every evening with the day's orders.",
      ],
      suiviTitre: "Check in with Guillaume",
      suiviTexte: "You can pick a time to talk about your reservation, what to prepare and how the launch is coming along.",
      suiviBouton: "Choose my follow-up call",
      retour: "Back to home",
      question: "A question before then? Call us at",
    },
  },

  histoire: {
    titre: "Our story",
    linkedinDe: "{nom}'s LinkedIn profile",
    ceed: {
      titre: "1st place, CEED Challenge 2026",
      texte: "École d'entrepreneurship de Beauce.",
      alt: "CEED Challenge 2026 certificate, 1st place, awarded to Guillaume Therrien for Resto Action",
    },
    convictions: {
      titre: "What we believe",
      origine: "Two guys from Trois-Rivières, building for local restaurants.",
      fondateurs: [
        {
          nom: "Guillaume",
          role: "Co-founder · Sales and business development",
          alt: "Guillaume Therrien, co-founder of Resto Action",
          points: [
            { titre: "Your margins first.", texte: "Every dollar a platform takes from you, we want to give back." },
            { titre: "Happy customers who come back.", texte: "A satisfied customer orders again. That is what keeps a restaurant alive." },
            { titre: "Real people in the field.", texte: "We come to you, we speak French, and you have a real number to call." },
            { titre: "Sales you wouldn't have had.", texte: "Google, texts, points: we go after new orders, not just the ones from the platforms." },
          ],
        },
        {
          nom: "Xavier",
          role: "Co-founder · Technology, design and maintenance",
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
      "Why Resto Action exists, in 5 minutes.",
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
        a: "Your own web and mobile ordering app, under your name, for Quebec's independent restaurants. Built in Trois-Rivières. Your customers order from you instead of on the platforms, and we handle the rest: your Google listing, the text reminders that bring them back, and delivery with no drivers to manage.",
      },
      {
        q: "Is it a mobile app or a website?",
        a: "Both. Customers order on your site, right in the browser, nothing to download: that's your web app. Your regulars download your mobile app under your name, on iPhone and Android. Same menu, same account, same points.",
      },
      {
        q: "Do you take a commission?",
        a: "Yes, a small one: 5% on pickup and 10% on delivery, calculated on food and drinks only. The platforms take up to 30%.",
      },
      {
        q: "How much does it cost?",
        a: "The setup fee is $750 for The Big Winter Launch, then $1,500. It's paid at signing; no deposit. Your printer is included at no cost. After that, a $200 monthly subscription from go-live, plus 5% + $0.30 on pickup and 10% + $3.51 per delivery (the run at cost), card fees included. Taxes extra.",
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
        q: "Will my app be active as soon as I reserve?",
        a: "No. We're preparing for launch with two restaurant partners. Ordering, point-of-sale compatibility and mandatory billing tests still need to be completed and validated before paid orders can open. Your reservation lets us prepare your app at the founder price. We'll confirm your restaurant's launch date with you after the necessary validations; no firm date is guaranteed yet.",
      },
      {
        q: "How do we start?",
        a: `Reserve your spot online for free: 4 steps, 2 minutes. We call you within 24 hours to set your date and sign your agreement. Not ready? Call us at ${PHONE_DISPLAY} or book a quick call with Guillaume.`,
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
      "Resto Action is the web and mobile ordering app for Quebec's independent restaurants: under your own name, without the platforms' 30%, with Google visibility, follow-ups that bring customers back, and delivery with no drivers to manage.",
    zoneServie: "Quebec, Canada",
  },
};
