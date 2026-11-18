
/* La page produit : ce que Resto Action vend, dit à plat.

   C'est la réponse au reproche central de l'audit — « le site ne dit jamais
   explicitement ce qui est vendu ». Un moteur génératif ne résume pas une
   offre implicite, et ce qu'il ne peut pas résumer, il ne le recommande pas.

   CE QUI N'EST PAS ÉCRIT ICI, ET POURQUOI :

   - Aucun prix. L'offre est en cours de finalisation. Le MODÈLE, lui, est
     nommé (5 % ou 10 % au lieu des 30 % des plateformes) : c'est l'argument
     commercial. Les montants de l'offre fondateur vivent sur l'accueil.
   - Le lancement reste soumis aux tests de commande et de facturation avec
     deux restaurants partenaires. Ne pas annoncer de certification obtenue
     ni de délai ferme tant que le fonctionnement n'est pas validé.
   - Aucun résultat client, aucun témoignage, aucun chiffre de performance :
     il n'y a pas encore de mandat livré. Inventer une preuve sociale est la
     seule chose qui puisse coûter plus cher que de ne pas en avoir. */

export const PLATEFORME_FR = {
  slug: "/plateforme",
  metaTitre: "La plateforme pour restaurants indépendants",
  metaDescription:
    "Ton site et ton app à ton nom, commandes en ligne sans les 30 % des plateformes, visibilité Google et relances de tes clients. Les quatre morceaux de la plateforme Resto Action, et comment ils se branchent sur ce que tu as déjà.",

  filNom: "La plateforme",
  surTitre: "Ce qu'on vend, à plat",
  titre: "La plateforme des restos indépendants du Québec",
  intro:
    "Quatre morceaux qui travaillent ensemble : ta visibilité dans Google, tes commandes en ligne sans les 30 % des plateformes, les relances qui font revenir tes clients, et ton site et ton app à ton nom. Une seule plateforme, branchée sur ce que tu as déjà.",

  // Le nom du service tel que déclaré aux moteurs (JSON-LD).
  typeService: "Plateforme web et marketing pour restaurants",

  /* 18 nov. : la page est passée de « beaucoup de texte » à des sections
     visuelles. Et on ne greffe plus la commande sur l'ancien site : on
     explique pourquoi on en fait un nouveau. [À RELIRE] */
  visuel: {
    siteTitre: "Pourquoi on te fait un nouveau site",
    siteTexte: "Ton vieux site ne vend pas. Le nouveau, oui.",
    raisons: [
      { icone: "vite", titre: "Rapide, donc trouvé dans Google", texte: "Un site lent ne sort pas dans Google, peu importe le reste." },
      { icone: "commande", titre: "La commande est dedans", texte: "Pas un lien vers une plateforme. Ton client commande chez toi." },
      { icone: "app", titre: "Branché sur ton app", texte: "Même menu, mêmes prix. Un seul système." },
      { icone: "clients", titre: "Tes clients sont à toi", texte: "Leur courriel et leur historique restent dans tes données." },
    ],
    caisse: "Ta caisse ne change pas. Ton équipe garde ses habitudes.",
    domaine: "Ton nom de domaine reste à toi.",
    compareTitre: "Une plateforme de livraison ou ton site et ton app?",
    compareEux: "Plateforme de livraison",
    compareNous: "Ton site et ton app",
    compare: [
      { sujet: "Commission", eux: "Jusqu'à 30 %", nous: "5 % ou 10 %, plus un petit frais fixe" },
      { sujet: "Le client", eux: "Est à eux", nous: "Est à toi" },
      { sujet: "Son courriel", eux: "Tu ne l'as pas", nous: "Dans tes données" },
      { sujet: "Tes prix", eux: "Gonflés pour payer la commission", nous: "Les tiens" },
      { sujet: "Si tu arrêtes", eux: "Tu repars de zéro", nous: "Tu gardes ta liste" },
    ],
    compareNote: "Garde tes plateformes si tu veux. Elles ne devraient juste pas être les seules.",
    debutTitre: "Comment ça commence",
    debut: [
      { titre: "On t'appelle", texte: "Tu nous racontes ton resto." },
      { titre: "On regarde tes chiffres", texte: "Tes commissions, ta place dans Google." },
      { titre: "On met tout en place", texte: "Dans l'ordre qui te rapporte le plus vite." },
    ],
    jamaisTitre: "Ce qu'on ne te promettra jamais",
    jamais: ["Le 1er rang dans Google la semaine prochaine", "Des faux avis 5 étoiles", "Un contrat de 40 pages"],
  },

  /* Les quatre cartes qui mènent aux pages de fonctionnalité. Leur ordre suit
     celui des onglets de la section Résultats de l'accueil : c'est la même
     promesse, dite deux fois, et deux ordres différents la brouilleraient. */
  cartes: {
    titre: "Toutes les pièces du Système",
    texte: "Chacune a sa page : ce qu'elle règle, comment elle marche, et ce qu'elle ne fait pas.",
    lire: "Lire la suite",
  },

  faq: {
    titre: "Questions sur la plateforme",
    items: [
      {
        q: "Est-ce que je dois tout prendre?",
        a: "Oui, et c'est voulu : tout est compris dans le même prix, parce que les morceaux se nourrissent.",
      },
      {
        q: "Est-ce que je dois changer ma caisse?",
        a: "Non. Tu gardes le système que ton équipe connaît. La plateforme s'ajoute à ce que tu as déjà plutôt que de remplacer ce qui fonctionne.",
      },
      {
        q: "Et si j'ai déjà un site web?",
        a: "On te fait un nouveau site, branché sur ton app et ta commande en ligne. Un vieux site lent ne sort pas dans Google et ne vend rien. Ton nom de domaine reste à toi.",
      },
      {
        q: "Ça prend combien de temps avant de voir des résultats?",
        a: "Ta date de lancement est fixée à la signature, dans la cohorte de janvier 2027. Si tu n'es pas en ligne à ta date, ton premier mois est gratuit (48 h top chrono). La visibilité dans Google, elle, se bâtit sur quelques mois.",
      },
      {
        q: "Vous travaillez avec quels restos?",
        a: "Des restaurants indépendants du Québec, de Trois-Rivières à partout ailleurs en province. Pas de chaînes, pas de franchises : ce n'est pas le monde qu'on cherche à aider.",
      },
    ],
  },

  cta: {
    titre: "On regarde ton resto avant de te vendre quoi que ce soit.",
    texte:
      "Un court appel avec Guillaume. Tu repars avec ce qu'on a vu, que tu embarques ou non.",
  },
};

export type Plateforme = typeof PLATEFORME_FR;

export const PLATEFORME_EN: Plateforme = {
  slug: "/en/platform",
  metaTitre: "The platform for independent restaurants",
  metaDescription:
    "Your own site and app, online ordering without the platforms' 30%, Google visibility and customer follow-ups. The four pieces of the Resto Action platform, and how they plug into what you already have.",

  filNom: "The platform",
  surTitre: "What we sell, plainly",
  titre: "The platform for Quebec's independent restaurants",
  intro:
    "Four pieces working together: your visibility on Google, your online orders without the platforms' 30%, the follow-ups that bring customers back, and your own site and app. One platform, plugged into what you already have.",

  typeService: "Web and marketing platform for restaurants",

  visuel: {
    siteTitre: "Why we build you a new site",
    siteTexte: "Your old site doesn't sell. The new one does.",
    raisons: [
      { icone: "vite", titre: "Fast, so Google finds it", texte: "A slow site doesn't rank, no matter what else you do." },
      { icone: "commande", titre: "Ordering is built in", texte: "Not a link to a platform. Your customer orders from you." },
      { icone: "app", titre: "Connected to your app", texte: "Same menu, same prices. One system." },
      { icone: "clients", titre: "Your customers are yours", texte: "Their email and history stay in your data." },
    ],
    caisse: "Your point of sale doesn't change. Your team keeps its habits.",
    domaine: "Your domain name stays yours.",
    compareTitre: "A delivery platform, or your own site and app?",
    compareEux: "Delivery platform",
    compareNous: "Your site and your app",
    compare: [
      { sujet: "Commission", eux: "Up to 30%", nous: "5% or 10%, plus a small fixed fee" },
      { sujet: "The customer", eux: "Is theirs", nous: "Is yours" },
      { sujet: "Their email", eux: "You don't get it", nous: "In your data" },
      { sujet: "Your prices", eux: "Inflated to cover the commission", nous: "Your own" },
      { sujet: "If you stop", eux: "You start from zero", nous: "You keep your list" },
    ],
    compareNote: "Keep your platforms if you want. They just shouldn't be the only ones.",
    debutTitre: "How it starts",
    debut: [
      { titre: "We call you", texte: "You tell us about your restaurant." },
      { titre: "We look at your numbers", texte: "Your commissions, your spot on Google." },
      { titre: "We set it all up", texte: "In the order that pays you back fastest." },
    ],
    jamaisTitre: "What we'll never promise you",
    jamais: ["The top spot on Google next week", "Fake 5-star reviews", "A 40-page contract"],
  },

  cartes: {
    titre: "Every piece of the System",
    texte: "Each has its own page: what it fixes, how it works, and what it doesn't do.",
    lire: "Read more",
  },

  faq: {
    titre: "Questions about the platform",
    items: [
      {
        q: "Do I have to take all of it?",
        a: "Yes, and that's on purpose: it's all included in the same price, because the pieces feed each other.",
      },
      {
        q: "Do I have to change my point of sale?",
        a: "No. You keep the system your team knows. The platform adds to what you already have instead of replacing what works.",
      },
      {
        q: "What if I already have a website?",
        a: "We build you a new site, connected to your app and your online ordering. An old, slow site doesn't rank on Google and doesn't sell. Your domain name stays yours.",
      },
      {
        q: "How long before I see results?",
        a: "Your launch date is set at signing, in the January 2027 cohort. If you're not live by your date, your first month is free (48 Hours Flat). Google visibility, on the other hand, builds over a few months.",
      },
      {
        q: "What restaurants do you work with?",
        a: "Independent restaurants across Quebec, from Trois-Rivières to anywhere else in the province. No chains, no franchises: that's not who we set out to help.",
      },
    ],
  },

  cta: {
    titre: "We look at your restaurant before we sell you anything.",
    texte:
      "A quick call with Guillaume. You leave with what we saw, whether you sign or not.",
  },
};
