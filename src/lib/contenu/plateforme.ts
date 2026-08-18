import type { Bloc } from "@/lib/contenu/blocs";

/* La page produit : ce que Resto Action vend, dit à plat.

   C'est la réponse au reproche central de l'audit — « le site ne dit jamais
   explicitement ce qui est vendu ». Un moteur génératif ne résume pas une
   offre implicite, et ce qu'il ne peut pas résumer, il ne le recommande pas.

   CE QUI N'EST PAS ÉCRIT ICI, ET POURQUOI :

   - Aucun prix. L'offre est en cours de finalisation. Le MODÈLE, lui, est
     nommé (pas de commission au pourcentage) : c'est l'argument commercial, et
     il ne réclame aucun montant.
   - Aucune mention du système de caisse maison en cours de certification. Un
     système d'enregistrement des ventes s'annonce QUAND Revenu Québec l'a
     certifié, pas avant. La section « Ça se branche sur ce que tu as déjà »
     est écrite pour accueillir la phrase le jour venu, sans rien réécrire
     autour.
   - Aucun résultat client, aucun témoignage, aucun chiffre de performance :
     il n'y a pas encore de mandat livré. Inventer une preuve sociale est la
     seule chose qui puisse coûter plus cher que de ne pas en avoir. */

export const PLATEFORME_FR = {
  slug: "/plateforme",
  metaTitre: "La plateforme pour restaurants indépendants",
  metaDescription:
    "Visibilité Google, commandes en ligne sans commission, relances de tes clients et app à ton nom. Les quatre morceaux de la plateforme Resto Action, et comment ils se branchent sur ce que tu as déjà.",

  filNom: "La plateforme",
  surTitre: "Ce qu'on vend, à plat",
  titre: "La plateforme des restos indépendants du Québec",
  intro:
    "Quatre morceaux qui travaillent ensemble : ta visibilité dans Google, tes commandes en ligne sans commission, les relances qui font revenir tes clients, et ton application à ton nom. Une seule plateforme, branchée sur ce que tu as déjà.",

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
        "**Ta caisse ne change pas.** Tu gardes le système que ton monde connaît, avec les habitudes qui vont avec. Les commandes en ligne arrivent sans que personne ait à réapprendre son métier un mardi soir de rush.",
    },
    {
      t: "p",
      texte:
        "**Ton site aussi, si tu y tiens.** Si tu en as un qui fait la job, on y greffe la commande en ligne. S'il date, s'il est lent ou s'il n'existe pas, on t'en bâtit un — c'est souvent ce qui débloque le référencement, parce qu'un site lent ne sort pas dans Google, peu importe le reste.",
    },
    {
      t: "encadre",
      titre: "On regarde ça avant de te vendre quoi que ce soit",
      texte:
        "L'appel de trente minutes sert exactement à ça : voir ce que tu as, ce qui marche, et ce qui ne vaut pas la peine d'être remplacé. Il arrive qu'on conseille de ne rien changer à un morceau.",
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
        ["Commission par commande", "Un pourcentage de chaque vente", "Aucune"],
        ["Le client", "Appartient à l'application", "Est le tien"],
        ["Son courriel, son historique", "Tu ne les as pas", "Dans tes données"],
        [
          "Tes prix",
          "Souvent gonflés pour absorber la commission",
          "Les tiens, tels quels",
        ],
        ["Si tu arrêtes demain", "Tu repars de zéro", "Tu gardes tout"],
      ],
    },
    {
      t: "p",
      texte:
        "On ne te dira pas de fermer tes comptes de livraison. Pour bien du monde, ça reste une source de commandes. On te dit qu'elle ne devrait pas être **la seule**, et que chaque commande qui passe par chez toi plutôt que par eux est une commande à pleine marge.",
    },

    { t: "h2", texte: "Comment ça commence" },
    {
      t: "ol",
      items: [
        "**On t'écoute.** Trente minutes au téléphone, tu nous racontes ton resto : ce qui roule, ce qui accroche, ce que tu paies déjà.",
        "**On creuse avec toi.** On regarde tes chiffres, tes commissions, ta présence dans Google. On te dit ce qu'on voit, même quand c'est que le problème est ailleurs.",
        "**On règle le problème.** On met en place ce qui manque, dans l'ordre qui te rapporte le plus vite. Pas les quatre morceaux d'un coup si un seul suffit.",
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
    titre: "Les quatre morceaux",
    texte: "Chacun a sa page : ce qu'il règle, comment il marche, et ce qu'il ne fait pas.",
    lire: "Lire la suite",
  },

  faq: {
    titre: "Questions sur la plateforme",
    items: [
      {
        q: "Est-ce que je dois tout prendre?",
        a: "Non. Bien des restos commencent par un seul morceau — souvent la visibilité dans Google ou les commandes en ligne — et ajoutent le reste quand ça rapporte. On te dira lequel vient en premier chez toi.",
      },
      {
        q: "Est-ce que je dois changer ma caisse?",
        a: "Non. Tu gardes le système que ton équipe connaît. La plateforme s'ajoute à ce que tu as déjà plutôt que de remplacer ce qui fonctionne.",
      },
      {
        q: "Et si j'ai déjà un site web?",
        a: "On regarde s'il fait la job. S'il est correct, on y greffe la commande en ligne. S'il est lent ou introuvable dans Google, on t'en bâtit un — un site lent ne sort pas, peu importe le reste.",
      },
      {
        q: "Ça prend combien de temps avant de voir des résultats?",
        a: "Ton site et tes commandes en ligne partent en quelques semaines. La visibilité dans Google, elle, se bâtit sur quelques mois — méfie-toi de quiconque te promet la première position pour la semaine prochaine.",
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
      "Trente minutes au téléphone avec Guillaume. Tu repars avec ce qu'on a vu, que tu embarques ou non.",
  },
};

export type Plateforme = typeof PLATEFORME_FR;

export const PLATEFORME_EN: Plateforme = {
  slug: "/en/platform",
  metaTitre: "The platform for independent restaurants",
  metaDescription:
    "Google visibility, online ordering with no commission, customer follow-ups and an app under your own name. The four pieces of the Resto Action platform, and how they plug into what you already have.",

  filNom: "The platform",
  surTitre: "What we sell, plainly",
  titre: "The platform for Quebec's independent restaurants",
  intro:
    "Four pieces working together: your visibility on Google, your online orders with no commission, the follow-ups that bring customers back, and your own app under your own name. One platform, plugged into what you already have.",

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
        "**Your point of sale doesn't change.** You keep the system your staff knows, with the habits that come with it. Online orders come in without anyone having to relearn their job on a busy Tuesday night.",
    },
    {
      t: "p",
      texte:
        "**Your website too, if you want.** If you have one that does the job, we graft online ordering onto it. If it's dated, slow or nonexistent, we build you one — that's often what unlocks search, because a slow site doesn't show up on Google no matter what else you do.",
    },
    {
      t: "encadre",
      titre: "We look before we sell you anything",
      texte:
        "The thirty-minute call is exactly for that: seeing what you have, what works, and what isn't worth replacing. Sometimes we tell you to leave a piece alone.",
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
        ["Commission per order", "A cut of every sale", "None"],
        ["The customer", "Belongs to the app", "Is yours"],
        ["Their email, their history", "You don't have them", "In your data"],
        ["Your prices", "Often inflated to absorb the commission", "Yours, as they are"],
        ["If you stop tomorrow", "You start from zero", "You keep everything"],
      ],
    },
    {
      t: "p",
      texte:
        "We won't tell you to close your delivery accounts. For plenty of restaurants they're a real source of orders. We're telling you they shouldn't be **the only one**, and that every order coming through your own channel is an order at full margin.",
    },

    { t: "h2", texte: "How it starts" },
    {
      t: "ol",
      items: [
        "**We listen.** Thirty minutes on the phone, you tell us about your restaurant: what runs, what sticks, what you're already paying for.",
        "**We dig in with you.** We look at your numbers, your commissions, your presence on Google. We tell you what we see, even when what we see is that the problem is somewhere else.",
        "**We fix the problem.** We put in what's missing, in the order that pays you back fastest. Not all four pieces at once if one is enough.",
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
    titre: "The four pieces",
    texte: "Each has its own page: what it fixes, how it works, and what it doesn't do.",
    lire: "Read more",
  },

  faq: {
    titre: "Questions about the platform",
    items: [
      {
        q: "Do I have to take all of it?",
        a: "No. Plenty of restaurants start with a single piece — usually Google visibility or online ordering — and add the rest once it pays off. We'll tell you which one comes first for you.",
      },
      {
        q: "Do I have to change my point of sale?",
        a: "No. You keep the system your team knows. The platform adds to what you already have instead of replacing what works.",
      },
      {
        q: "What if I already have a website?",
        a: "We look at whether it does the job. If it's fine, we graft online ordering onto it. If it's slow or invisible on Google, we build you one — a slow site doesn't rank, no matter what else you do.",
      },
      {
        q: "How long before I see results?",
        a: "Your site and your online ordering go live within a few weeks. Google visibility builds over a few months — be wary of anyone promising you the top spot by next week.",
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
      "Thirty minutes on the phone with Guillaume. You leave with what we saw, whether you sign or not.",
  },
};
