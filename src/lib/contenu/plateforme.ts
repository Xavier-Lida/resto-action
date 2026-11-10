import type { Bloc } from "@/lib/contenu/blocs";

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
    "Ton app web et mobile à ton nom, commandes en ligne sans les 30 % des plateformes, visibilité Google et relances de tes clients. Les quatre morceaux de la plateforme Resto Action, et comment ils se branchent sur ce que tu as déjà.",

  filNom: "La plateforme",
  surTitre: "Ce qu'on vend, à plat",
  titre: "La plateforme des restos indépendants du Québec",
  intro:
    "Quatre morceaux qui travaillent ensemble : ta visibilité dans Google, tes commandes en ligne sans les 30 % des plateformes, les relances qui font revenir tes clients, et ton app web et mobile à ton nom. Une seule plateforme, branchée sur ce que tu as déjà.",

  // Le nom du service tel que déclaré aux moteurs (JSON-LD).
  typeService: "Plateforme web et marketing pour restaurants",

  blocs: [
    {
      t: "h2",
      texte: "Quatre morceaux, une seule plateforme",
    },
    {
      t: "p",
      texte:
        "Chaque morceau règle un problème que tu as déjà. Pris séparément, ce sont quatre chantiers que personne n'a le temps de mener. Ensemble, ils se nourrissent : le client qui te trouve dans Google commande sur ton site, son courriel entre dans tes données, la relance le fait revenir, et l'app le garde.",
    },
    {
      t: "p",
      texte:
        "C'est la différence entre payer quatre fournisseurs qui ne se parlent pas et avoir **une plateforme où le client reste le tien du début à la fin**.",
    },

    { t: "h2", texte: "Ça se branche sur ce que tu as déjà" },
    {
      t: "p",
      texte:
        "**Ta caisse ne change pas.** Tu gardes le système que ton monde connaît, avec les habitudes qui vont avec. Les commandes en ligne arrivent sans que personne ait à réapprendre son métier en plein service.",
    },
    {
      t: "p",
      texte:
        "**Ton site aussi, si tu y tiens.** Si tu en as un qui fait la job, on y greffe la commande en ligne. S'il date, s'il est lent ou s'il n'existe pas, on t'en bâtit un : c'est souvent ce qui débloque le référencement, parce qu'un site lent ne sort pas dans Google, peu importe le reste.",
    },
    {
      t: "encadre",
      titre: "On regarde ça avant de te vendre quoi que ce soit",
      texte:
        "L'appel sert exactement à ça : voir ce que tu as, ce qui marche, et ce qui ne vaut pas la peine d'être remplacé. Il arrive qu'on conseille de ne rien changer à un morceau.",
    },

    { t: "h2", texte: "Pourquoi pas juste une app de livraison?" },
    {
      t: "p",
      texte:
        "Les apps de livraison t'apportent des commandes, et c'est vrai. Ce qu'elles ne t'apportent pas, c'est le client. Il reste le leur : son courriel, son historique, sa fréquence, tout est de leur côté. Le jour où tu arrêtes de payer, tu repars de zéro.",
    },
    {
      t: "tableau",
      entetes: ["", "Par une app de livraison", "Sur ta plateforme"],
      lignes: [
        [
          "Commission par commande",
          "Jusqu'à 30 %",
          "5 % + 0,30 $ en cueillette, 10 % + 3,51 $ par livraison (la course au prix coûtant), frais de carte inclus",
        ],
        ["Abonnement", "Selon ton forfait", "Abonnement : 200 $ par mois"],
        ["Le client", "Appartient à l'application", "Est le tien"],
        ["Son courriel, son historique", "Tu ne les as pas", "Dans tes données"],
        [
          "Tes prix",
          "Souvent gonflés pour absorber la commission",
          "Les tiens, tels quels",
        ],
        ["Si tu arrêtes demain", "Tu repars de zéro", "Tu gardes ta liste de clients"],
      ],
    },
    {
      t: "p",
      texte:
        "On ne te dira pas de fermer tes comptes de livraison. Pour bien du monde, ça reste une source de commandes. On te dit qu'elle ne devrait pas être **la seule**, et que chaque commande qui passe par chez toi plutôt que par eux est une commande où tu gardes presque toute ta marge, et le client.",
    },

    { t: "h2", texte: "Comment ça commence" },
    {
      t: "ol",
      items: [
        "**On t'écoute.** Un court appel, tu nous racontes ton resto : ce qui roule, ce qui accroche, ce que tu paies déjà.",
        "**On creuse avec toi.** On regarde tes chiffres, tes commissions, ta présence dans Google. On te dit ce qu'on voit, même quand c'est que le problème est ailleurs.",
        "**On règle le problème.** On met tout en place, dans l'ordre qui te rapporte le plus vite.",
      ],
    },

    { t: "h2", texte: "Ce qu'on ne te promettra pas" },
    {
      t: "p",
      texte:
        "**La première position dans Google la semaine prochaine.** Personne ne peut la promettre, et qui te la promet te ment. La visibilité se bâtit sur quelques mois.",
    },
    {
      t: "p",
      texte:
        "**Des avis à cinq étoiles achetés.** Google les repère, et la sanction retombe sur ton resto, pas sur le fournisseur qui te les a vendus.",
    },
    {
      t: "p",
      texte:
        "**Un contrat de quarante pages.** Si ce qu'on fait ne te rapporte pas, tu dois pouvoir partir. C'est le contraire d'un argument de vente : c'est ce qui nous force à être utiles.",
    },
  ] as Bloc[],

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
        a: "On regarde s'il fait la job. S'il est correct, on y greffe la commande en ligne. S'il est lent ou introuvable dans Google, on t'en bâtit un : un site lent ne sort pas, peu importe le reste.",
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
    "Your own web and mobile app, online ordering without the platforms' 30%, Google visibility and customer follow-ups. The four pieces of the Resto Action platform, and how they plug into what you already have.",

  filNom: "The platform",
  surTitre: "What we sell, plainly",
  titre: "The platform for Quebec's independent restaurants",
  intro:
    "Four pieces working together: your visibility on Google, your online orders without the platforms' 30%, the follow-ups that bring customers back, and your own web and mobile app. One platform, plugged into what you already have.",

  typeService: "Web and marketing platform for restaurants",

  blocs: [
    { t: "h2", texte: "Four pieces, one platform" },
    {
      t: "p",
      texte:
        "Each piece fixes a problem you already have. Taken separately, they're four projects nobody has time to run. Together, they feed each other: the customer who finds you on Google orders from your site, their email lands in your data, the follow-up brings them back, and the app keeps them.",
    },
    {
      t: "p",
      texte:
        "That's the difference between paying four suppliers who don't talk to each other and running **one platform where the customer stays yours from beginning to end**.",
    },

    { t: "h2", texte: "It plugs into what you already have" },
    {
      t: "p",
      texte:
        "**Your point of sale doesn't change.** You keep the system your staff knows, with the habits that come with it. Online orders come in without anyone having to relearn their job in the middle of service.",
    },
    {
      t: "p",
      texte:
        "**Your website too, if you want.** If you have one that does the job, we graft online ordering onto it. If it's dated, slow or nonexistent, we build you one: that's often what unlocks search, because a slow site doesn't show up on Google no matter what else you do.",
    },
    {
      t: "encadre",
      titre: "We look before we sell you anything",
      texte:
        "The short call is exactly for that: seeing what you have, what works, and what isn't worth replacing. Sometimes we tell you to leave a piece alone.",
    },

    { t: "h2", texte: "Why not just use a delivery app?" },
    {
      t: "p",
      texte:
        "Delivery apps bring you orders, and that's true. What they don't bring you is the customer. That customer stays theirs: the email, the order history, the frequency, all of it sits on their side. The day you stop paying, you start from zero.",
    },
    {
      t: "tableau",
      entetes: ["", "Through a delivery app", "On your platform"],
      lignes: [
        [
          "Commission per order",
          "Up to 30%",
          "5% + $0.30 on pickup, 10% + $3.51 per delivery (the run at cost), card fees included",
        ],
        ["Subscription", "Depends on your plan", "Subscription: $200 per month"],
        ["The customer", "Belongs to the app", "Is yours"],
        ["Their email, their history", "You don't have them", "In your data"],
        ["Your prices", "Often inflated to absorb the commission", "Yours, as they are"],
        ["If you stop tomorrow", "You start from zero", "You keep your customer list"],
      ],
    },
    {
      t: "p",
      texte:
        "We won't tell you to close your delivery accounts. For plenty of restaurants they're a real source of orders. We're telling you they shouldn't be **the only one**, and that every order coming through your own channel is an order where you keep nearly all your margin, and the customer.",
    },

    { t: "h2", texte: "How it starts" },
    {
      t: "ol",
      items: [
        "**We listen.** A quick call, you tell us about your restaurant: what runs, what sticks, what you're already paying for.",
        "**We dig in with you.** We look at your numbers, your commissions, your presence on Google. We tell you what we see, even when what we see is that the problem is somewhere else.",
        "**We fix the problem.** We set everything up, in the order that pays you back fastest.",
      ],
    },

    { t: "h2", texte: "What we won't promise you" },
    {
      t: "p",
      texte:
        "**The top spot on Google by next week.** Nobody can promise that, and anyone who does is lying to you. Visibility builds over months.",
    },
    {
      t: "p",
      texte:
        "**Bought five-star reviews.** Google catches them, and the penalty lands on your restaurant, not on the supplier who sold them to you.",
    },
    {
      t: "p",
      texte:
        "**A forty-page contract.** If what we do doesn't pay you back, you have to be able to walk. That's the opposite of a sales pitch: it's what forces us to be useful.",
    },
  ] as Bloc[],

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
        a: "We look at whether it does the job. If it's fine, we graft online ordering onto it. If it's slow or invisible on Google, we build you one: a slow site doesn't rank, no matter what else you do.",
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
