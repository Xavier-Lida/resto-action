import type { Bloc } from "@/lib/contenu/blocs";

/* Les quatre pages de fonctionnalité, sous la page plateforme.

   Elles existent parce que le site n'avait aucune page de service : les quatre
   promesses de l'accueil vivaient dans un carrousel d'onglets, c'est-à-dire
   nulle part pour un moteur. Une promesse sans URL ne peut pas se positionner.

   CHAQUE PAGE EST ÉCRITE SUR LE SYMPTÔME, pas sur le produit. Un restaurateur
   ne cherche pas « plateforme de commande en ligne » : il cherche pourquoi il
   paie tant de commissions, ou pourquoi son resto n'apparaît pas quand on
   tape « pizza près de moi ». Le titre de chaque page part de là.

   LES SLUGS DIFFÈRENT D'UNE LANGUE À L'AUTRE, et c'est voulu : l'URL est lue
   par les moteurs et par les gens. Un anglophone ne tape pas « referencement ».
   C'est la seule raison pour laquelle le chemin voyage avec le contenu au lieu
   d'être déduit d'une clé.

   CE QU'ON N'Y TROUVE PAS : aucun prix (l'offre est en cours de
   finalisation), aucune mention du système de caisse maison tant que Revenu
   Québec ne l'a pas certifié, aucun résultat client tant qu'il n'y a pas de
   mandat livré. */

export const CLES = [
  "referencement",
  "commandes",
  "relances",
  "application",
] as const;

export type Cle = (typeof CLES)[number];

export type Fonctionnalite = {
  slug: string;
  filNom: string;
  metaTitre: string;
  metaDescription: string;
  surTitre: string;
  titre: string;
  intro: string;
  // Le résumé qui s'affiche sur la carte, page plateforme.
  resume: string;
  typeService: string;
  blocs: Bloc[];
  faq: { titre: string; items: { q: string; a: string }[] };
  cta: { titre: string; texte: string };
};

/* Le dernier segment d'un chemin — « referencement-google » dans
   « /plateforme/referencement-google ». C'est ce que la route dynamique reçoit
   dans ses `params`, et il faut pouvoir remonter de là jusqu'à la clé. */
export const segment = (slug: string) => slug.split("/").pop() as string;

export const cleParSegment = (dico: Record<Cle, Fonctionnalite>) =>
  new Map(CLES.map((cle) => [segment(dico[cle].slug), cle] as const));

export const FONCTIONNALITES_FR: Record<Cle, Fonctionnalite> = {
  referencement: {
    slug: "/plateforme/referencement-google",
    filNom: "Référencement Google",
    metaTitre: "Référencement Google pour restaurants",
    metaDescription:
      "Fiche Google Business, avis, site lisible par une machine : ce qui fait sortir un resto indépendant dans Google, et en combien de temps. Sans promesse de première position.",
    surTitre: "Plus de trafic Google",
    titre: "Ton resto sort enfin dans Google",
    intro:
      "Quand quelqu'un tape « pizza près de moi » à six heures un vendredi, trois restos apparaissent avant les autres. Voici comment on te fait entrer dans les trois — et pourquoi ça prend quelques mois plutôt qu'une semaine.",
    resume:
      "La fiche Google Business, les avis, et un site qu'une machine peut lire.",
    typeService: "Référencement local pour restaurants",
    blocs: [
      { t: "h2", texte: "Un resto se fait trouver à trois endroits" },
      {
        t: "p",
        texte:
          "On dit « sortir dans Google » comme s'il n'y avait qu'un seul écran. Il y en a trois, ils n'obéissent pas aux mêmes règles, et un resto peut très bien dominer l'un en étant absent des deux autres.",
      },
      {
        t: "ul",
        items: [
          "**La carte**, en haut des résultats : trois fiches avec des étoiles et un bouton d'itinéraire. C'est là que se joue « près de moi », et c'est ta fiche Google Business qui décide, pas ton site.",
          "**Les résultats bleus**, en dessous : c'est ton site. Il faut qu'il existe, qu'il charge vite et qu'une machine puisse lire ce qu'il y a dedans.",
          "**Les moteurs qui répondent** — ChatGPT, Perplexity, les aperçus IA de Google. Ils ne renvoient pas une liste, ils rédigent une réponse et citent quelques sources. Un resto dont l'offre est claire et les faits vérifiables s'y fait citer ; les autres n'existent pas.",
        ],
      },

      { t: "h2", texte: "Ta fiche Google Business passe en premier" },
      {
        t: "p",
        texte:
          "C'est le morceau qui rapporte le plus vite, et c'est presque toujours celui qui est à moitié rempli. Une fiche complète bat une fiche vide même quand le site derrière est moins bon.",
      },
      {
        t: "ul",
        items: [
          "La réclamer si elle existe déjà — la plupart des restos ont une fiche créée automatiquement qu'ils n'ont jamais revendiquée.",
          "Les bonnes catégories, celles que Google fait correspondre aux recherches. « Restaurant » tout court te met en compétition avec la province au complet.",
          "Les heures, y compris les heures des jours fériés. Une fiche qui dit « ouvert » un lundi de congé quand c'est fermé récolte un avis à une étoile.",
          "Des photos récentes, prises chez toi. Pas des images de banque.",
          "Le menu et le lien de commande qui pointe chez toi, pas vers une app de livraison.",
        ],
      },

      { t: "h2", texte: "Les avis, sans en acheter un seul" },
      {
        t: "p",
        texte:
          "Les avis pèsent lourd sur la carte, et c'est exactement pour ça que des fournisseurs t'en vendront. Google les repère, et la sanction retombe sur ta fiche — pas sur le fournisseur.",
      },
      {
        t: "p",
        texte:
          "Ce qui marche est plus ennuyeux et plus durable : demander au bon moment, à des clients contents, avec un chemin qui prend dix secondes. Et répondre à tous, même aux mauvais. Une réponse posée à un avis fâché en dit plus long à un futur client que dix avis parfaits.",
      },

      { t: "h2", texte: "Ton site doit être lisible par une machine" },
      {
        t: "p",
        texte:
          "C'est ici que la plupart des sites de resto perdent. Pas parce qu'ils sont laids — parce qu'un robot n'y trouve rien.",
      },
      {
        t: "encadre",
        titre: "Le piège du menu en PDF ou en image",
        texte:
          "C'est le cas le plus fréquent, et le plus coûteux. Un menu affiché comme une image ou un PDF est du texte que Google ne lit pas. Tes plats, tes prix, tes spécialités : invisibles. Le menu doit être du texte dans la page.",
      },
      {
        t: "ul",
        items: [
          "Un site qui charge vite sur un téléphone en 4G, pas sur la fibre de ton designer.",
          "Les horaires, l'adresse et le téléphone en texte, identiques à ceux de ta fiche — quand les deux se contredisent, Google fait moins confiance aux deux.",
          "Les données structurées de restaurant : le balisage invisible qui déclare à Google que cette page est un resto, avec sa cuisine, ses heures et son menu.",
          "Une page par sujet réel. Un site d'une seule page ne peut se positionner que sur une seule chose.",
        ],
      },

      { t: "h2", texte: "En combien de temps, honnêtement" },
      {
        t: "p",
        texte:
          "**La fiche : quelques semaines.** C'est le morceau le plus rapide, et souvent le plus payant.",
      },
      {
        t: "p",
        texte:
          "**Le site : quelques mois.** Google doit revenir, relire, comparer. Aucun réglage ne raccourcit ça, et quiconque te promet la première position pour la semaine prochaine vend autre chose que du référencement.",
      },
    ],
    faq: {
      titre: "Questions sur le référencement",
      items: [
        {
          q: "Vous garantissez la première position dans Google?",
          a: "Non, et personne ne le peut. Google ne vend pas de position dans les résultats naturels. Ce qu'on garantit, c'est le travail : la fiche complète, le site lisible, les avis demandés comme il faut.",
        },
        {
          q: "J'ai déjà une fiche Google, est-ce que ça suffit?",
          a: "Rarement. La plupart des fiches existent sans avoir été réclamées : catégories approximatives, heures fausses, photos d'il y a cinq ans, et un lien de commande qui mène à une app de livraison.",
        },
        /* Ces deux-là viennent de la FAQ de l'accueil, qui en portait neuf.
           Elles traitent de la fiche et des avis : leur place est ici. */
        {
          q: "Vous vous occupez de ma fiche Google?",
          a: "Oui. Ta fiche Google Business, c'est souvent le premier endroit où un client te trouve. On la crée si elle n'existe pas, on la remplit au complet, et on la garde à jour avec tes heures et tes photos.",
        },
        {
          q: "Et les avis Google, vous gérez ça?",
          a: "On met en place ce qui donne envie à tes clients contents d'en laisser un, et on t'aide à répondre à ceux qui arrivent. On n'achète jamais d'avis : Google les repère, et ça se retourne contre le resto.",
        },
        {
          q: "Est-ce que ça marche si mon resto est en région?",
          a: "Souvent mieux qu'en ville. Il y a moins de restos à départager sur une recherche locale, donc une fiche bien tenue se fait remarquer plus vite.",
        },
      ],
    },
    cta: {
      titre: "On regarde ta fiche et ton site en trente minutes.",
      texte:
        "Tu repars avec ce qu'on a vu, et l'ordre dans lequel le régler. Que tu embarques ou non.",
    },
  },

  commandes: {
    slug: "/plateforme/commandes-en-ligne",
    filNom: "Commandes en ligne",
    metaTitre: "Commandes en ligne sans commission",
    metaDescription:
      "Prendre tes commandes en ligne sans donner un pourcentage de chaque vente, sans changer ta caisse, et en gardant les clients qui commandent. Comment ça marche, et ce que ça demande de ton côté.",
    surTitre: "Plus de ventes en ligne",
    titre: "Des commandes en ligne qui ne te coûtent pas de commission",
    intro:
      "Chaque commande qui passe par une app de livraison te laisse une part de la vente et garde le client. Voici à quoi ressemble l'autre chemin : la commande arrive chez toi, à pleine marge, et le client devient le tien.",
    resume:
      "La commande passe par toi. Aucune commission, et le client reste le tien.",
    typeService: "Commande en ligne pour restaurants",
    blocs: [
      { t: "h2", texte: "Ce que coûte vraiment une commande d'app" },
      {
        t: "p",
        texte:
          "La commission est la partie visible, et ce n'est pas la plus chère. Le vrai coût, c'est que tu paies pour servir un client que tu ne pourras jamais rejoindre toi-même. Tu loues l'accès à ta propre clientèle, commande par commande, pour toujours.",
      },
      {
        t: "tableau",
        entetes: ["", "Commande d'app", "Commande directe"],
        lignes: [
          ["Ce qui te reste", "La vente moins la commission", "La vente"],
          ["Qui a le courriel du client", "L'application", "Toi"],
          ["Qui décide des prix affichés", "Toi, sous pression de la commission", "Toi"],
          ["Qui peut le faire revenir", "L'application", "Toi"],
          ["Qui il pense avoir choisi", "L'application", "Ton resto"],
        ],
      },
      {
        t: "p",
        texte:
          "La dernière ligne est celle qu'on oublie. Un client fidèle à une app de livraison n'est pas fidèle à ton resto : il est fidèle à l'app, qui lui proposera ton voisin la semaine prochaine.",
      },

      { t: "h2", texte: "Comment la commande arrive chez toi" },
      {
        t: "p",
        texte:
          "**Sans toucher à ta caisse.** C'est la contrainte qu'on s'est donnée : personne ne réapprend un système un vendredi soir. La commande arrive sur un écran dédié, s'imprime si tu veux du papier, et sonne pour qu'elle ne dorme pas cinq minutes.",
      },
      {
        t: "p",
        texte:
          "Le client, lui, ne télécharge rien : il commande depuis ton site, sur son téléphone, et paie en ligne. Ceux qui reviennent souvent finiront par installer ton app — c'est l'autre morceau de la plateforme.",
      },

      { t: "h2", texte: "Le panier qui fait monter la facture" },
      {
        t: "p",
        texte:
          "Une commande en ligne bien faite vend plus qu'un téléphone, et ce n'est pas de la magie : l'écran propose ce que personne n'a le temps de proposer au téléphone quand il y a trois appels en attente.",
      },
      {
        t: "ul",
        items: [
          "Les extras au bon moment — la sauce, le supplément, le format plus grand.",
          "Le plat qui va avec, suggéré avant le paiement plutôt qu'après.",
          "La commande précédente rappelée en un tap : c'est le raccourci qui fait revenir les habitués.",
        ],
      },

      { t: "h2", texte: "Ce que tu récupères, et que les apps gardent" },
      {
        t: "p",
        texte:
          "Chaque commande directe te laisse quelque chose qu'aucune app ne te donnera : **qui a commandé, quoi, et quand**. C'est cette liste qui alimente les relances, et c'est elle qui vaut le plus cher à long terme. Sans elle, tu recommences à zéro à chaque service.",
      },

      { t: "h2", texte: "Ce que ça demande de ton côté" },
      {
        t: "p",
        texte:
          "Autant le dire tout de suite, parce que c'est là que ça déraille quand ça déraille.",
      },
      {
        t: "ul",
        items: [
          "**Quelqu'un regarde l'écran.** Une commande en ligne qui reste dix minutes sans être acceptée fait plus de tort qu'un menu mal écrit.",
          "**Les heures et les ruptures à jour.** Vendre un plat qui n'existe plus ce soir-là coûte un client, pas seulement une commande.",
          "**Un peu de patience au début.** Tes habitués ont l'habitude du téléphone. Le basculement se fait sur des semaines, avec une affiche, un mot sur la facture, un QR sur la table.",
        ],
      },
    ],
    faq: {
      titre: "Questions sur les commandes en ligne",
      items: [
        {
          q: "Est-ce que je dois fermer mes comptes de livraison?",
          a: "Non, et on ne te le conseillera pas d'emblée. Ils restent une source de commandes. Le but, c'est qu'ils cessent d'être la seule, et que tes habitués passent par chez toi.",
        },
        {
          q: "Est-ce que ça change quelque chose en cuisine?",
          a: "Un écran de plus, et c'est tout. Ta caisse ne change pas, tes façons de faire non plus. La commande arrive imprimée si c'est ce que ton monde préfère.",
        },
        {
          q: "C'est quoi la différence avec DoorDash ou Uber Eats?",
          a: "Sur ces plateformes-là, une part de chaque commande s'en va en commission et le client appartient à l'application. Chez nous, la commande passe par ton site et ton app : le client est à toi, le montant aussi.",
        },
        {
          q: "Et la livraison, vous la faites?",
          a: "On branche la commande, pas les livreurs. Bien des restos gardent leur propre livraison ou n'offrent que la cueillette — c'est souvent là que la marge est la meilleure.",
        },
      ],
    },
    cta: {
      titre: "Combien te coûtent tes commissions cette année?",
      texte:
        "Trente minutes, tes chiffres en main, et on regarde ensemble ce que la commande directe changerait.",
    },
  },

  relances: {
    slug: "/plateforme/relances-clients",
    filNom: "Relances clients",
    metaTitre: "Relances clients pour restaurants",
    metaDescription:
      "Faire revenir un client qui a déjà commandé coûte moins cher que d'en trouver un nouveau. Comment les relances marchent, ce qu'on envoie, et ce que la loi canadienne anti-pourriel exige.",
    surTitre: "Plus de commandes répétées",
    titre: "Tes clients reviennent sans que tu aies à y penser",
    intro:
      "Quelqu'un a commandé chez toi une fois, il a aimé ça, et il ne revient pas — pas parce qu'il a trouvé mieux, mais parce qu'il a oublié. La relance règle exactement ce problème-là, et rien d'autre.",
    resume: "Le client qui a déjà commandé revient, sans que tu y penses.",
    typeService: "Fidélisation et relances clients pour restaurants",
    blocs: [
      { t: "h2", texte: "Le client le moins cher est celui que tu as déjà" },
      {
        t: "p",
        texte:
          "Pour en trouver un nouveau, il faut payer : de la publicité, une commission, du temps. Pour faire revenir celui qui a déjà commandé et qui a ton plat en mémoire, il faut un rappel au bon moment. C'est la même vente, sans le coût d'acquisition.",
      },
      {
        t: "p",
        texte:
          "C'est aussi la partie du travail qu'aucun restaurateur n'a le temps de faire à la main. Personne ne va écrire à quatre-vingts clients un mardi après-midi.",
      },

      { t: "h2", texte: "Ce qu'on envoie, et quand" },
      {
        t: "p",
        texte:
          "Une séquence courte, déclenchée par ce que le client a fait, pas par le calendrier.",
      },
      {
        t: "ol",
        items: [
          "**Après la première commande** — un mot de remerciement, et l'occasion de laisser un avis pendant que le repas est encore frais en mémoire.",
          "**Quand il ne revient pas** — une offre, une seule, sur un plat proche de ce qu'il avait pris.",
          "**Quand il revient** — des suggestions basées sur ses commandes, pas sur ton plat le plus rentable.",
          "**Aux moments qui comptent** — la Saint-Valentin, la fête des Mères, le temps des fêtes. Ce sont les soirs où un resto se remplit ou se vide.",
        ],
      },

      { t: "h2", texte: "La loi passe avant tout le reste" },
      {
        t: "p",
        texte:
          "Envoyer un courriel commercial au Canada n'est pas libre : la Loi canadienne anti-pourriel encadre qui tu peux écrire, ce que le message doit contenir, et à quelle vitesse tu dois cesser quand quelqu'un se désabonne. Les amendes ne sont pas symboliques.",
      },
      {
        t: "ul",
        items: [
          "**Le consentement d'abord.** On écrit à des gens qui ont commandé chez toi et qui ont accepté d'avoir des nouvelles. Aucune liste achetée, jamais.",
          "**Ton resto identifié**, avec une vraie adresse et un vrai contact dans chaque message.",
          "**Un désabonnement qui marche**, en un clic, traité tout de suite.",
        ],
      },
      {
        t: "p",
        texte:
          "Ce n'est pas seulement une question légale. Un resto qui envoie trois courriels par semaine se fait bloquer par ses meilleurs clients, et personne ne peut annuler ça.",
      },

      { t: "h2", texte: "Comment on sait que ça marche" },
      {
        t: "p",
        texte:
          "Le taux d'ouverture est la mesure la plus citée et la moins utile : un courriel ouvert qui ne fait venir personne n'a rien rapporté. On regarde deux choses, et elles se comptent en piasses.",
      },
      {
        t: "ul",
        items: [
          "**Combien de clients ont recommandé** dans les trente jours suivant une relance, comparé à ceux qui n'en ont pas reçu.",
          "**La part de tes commandes qui vient d'un client déjà connu.** C'est le chiffre qui monte quand la mécanique fonctionne, et celui qui dit que tu dépends moins des apps.",
        ],
      },
      {
        t: "p",
        texte:
          "Ces deux chiffres se lisent dans tes propres commandes, pas dans un tableau de bord de fournisseur. Tu peux les vérifier toi-même, et c'est voulu.",
      },

      { t: "h2", texte: "Ce qu'on n'envoie pas" },
      {
        t: "ul",
        items: [
          "Pas d'infolettre hebdomadaire que personne n'a demandée.",
          "Pas de rabais permanent : un client qui n'achète plus qu'en promotion coûte plus cher qu'il ne rapporte.",
          "Pas de message à quelqu'un qui vient de commander hier.",
        ],
      },
    ],
    faq: {
      titre: "Questions sur les relances",
      items: [
        {
          q: "D'où viennent les adresses?",
          a: "De tes propres commandes en ligne, avec le consentement du client. C'est pour ça que les deux morceaux vont ensemble : sans commandes directes, il n'y a pas de liste, et sans liste il n'y a pas de relance.",
        },
        {
          q: "Est-ce que je dois écrire les messages?",
          a: "Non. On les écrit avec toi une fois, dans ta voix, et ils tournent ensuite tout seuls. Tu peux en changer un quand ton menu change.",
        },
        {
          q: "Est-ce que ça marche par texto aussi?",
          a: "Le texto se lit davantage, et se pardonne beaucoup moins. Les mêmes règles de consentement s'appliquent, en plus strict dans les faits — on commence par le courriel.",
        },
      ],
    },
    cta: {
      titre: "Combien de clients ont commandé une seule fois?",
      texte:
        "C'est la question qu'on regarde ensemble en trente minutes. La réponse surprend presque tout le monde.",
    },
  },

  application: {
    slug: "/plateforme/application-mobile",
    filNom: "Application mobile",
    metaTitre: "Application mobile pour restaurant",
    metaDescription:
      "Une application à ton nom, sur l'App Store et Google Play, avec la commande en deux tapes et les points de fidélité. Ce qu'elle apporte, et ce qu'elle demande pour marcher.",
    surTitre: "Plus de téléchargements",
    titre: "Ton app, à ton nom, sur l'App Store",
    intro:
      "Pas un onglet dans l'application de quelqu'un d'autre : ta propre app, avec ton nom et ton icône, que ton client installe sur son téléphone et retrouve entre ses autres icônes.",
    resume: "Une vraie app à ton nom, sur les magasins, avec la fidélité dedans.",
    typeService: "Application mobile de commande pour restaurants",
    blocs: [
      { t: "h2", texte: "À ton nom, pas au nôtre" },
      {
        t: "p",
        texte:
          "L'app se publie sur l'App Store et sur Google Play sous le nom de ton restaurant. Son icône, c'est ton logo. Sa fiche de magasin parle de ton resto, avec tes photos. Quelqu'un qui cherche ton nom sur son téléphone la trouve.",
      },
      {
        t: "p",
        texte:
          "C'est la différence de fond avec une app de livraison : là-bas, tu es une ligne dans une liste, entre deux concurrents, sous le logo de quelqu'un d'autre.",
      },

      { t: "h2", texte: "Pourquoi une app quand tu as déjà un site" },
      {
        t: "ul",
        items: [
          "**La commande en deux tapes.** L'app se souvient du client, de son adresse et de sa dernière commande. Le site doit tout redemander.",
          "**Une icône sur son écran.** Elle rappelle ton resto chaque fois qu'il cherche autre chose sur son téléphone. Aucune publicité ne fait ça pour ce prix-là.",
          "**Les notifications**, le seul canal qui n'a pas besoin d'être ouvert pour être vu.",
          "**La fidélité**, qui vit là où il commande plutôt que sur une carte de carton au fond d'un portefeuille.",
        ],
      },

      { t: "h2", texte: "Les points, sans carte à tamponner" },
      {
        t: "p",
        texte:
          "Le client accumule en commandant, voit son avancement dans l'app, et échange quand il veut. Rien à tamponner, rien à perdre, et tu vois de ton côté qui approche de sa récompense.",
      },
      {
        t: "p",
        texte:
          "La récompense reste ton choix. Un dessert offert coûte peu et se remarque ; un rabais permanent entraîne des clients qui n'achètent plus qu'en solde.",
      },

      { t: "h2", texte: "Les notifications, avec parcimonie" },
      {
        t: "p",
        texte:
          "C'est le canal le plus puissant et le plus facile à gâcher. Une notification par semaine, envoyée quand ça peut servir — le vendredi vers cinq heures, le jour d'un spécial —, se lit. Une par jour se fait désactiver, et une notification désactivée ne se rallume jamais.",
      },

      { t: "h2", texte: "Le délai des magasins" },
      {
        t: "p",
        texte:
          "Une app ne se publie pas comme un site. Apple et Google examinent chaque application avant de l'accepter, et chaque mise à jour ensuite. C'est quelques jours à chaque fois, parfois plus si un examinateur demande une précision.",
      },
      {
        t: "p",
        texte:
          "Il faut aussi un compte de développeur à ton nom, chez Apple comme chez Google — c'est ce qui fait que l'app t'appartient vraiment, et que tu la gardes le jour où tu ne travailles plus avec nous. On s'occupe des démarches, mais les comptes restent les tiens.",
      },

      { t: "h2", texte: "Ce que ça demande pour marcher" },
      {
        t: "p",
        texte:
          "Une app ne se remplit pas toute seule : personne ne télécharge l'app d'un resto sans raison. C'est le seul morceau de la plateforme qui demande un geste de ta part, en salle.",
      },
      {
        t: "ul",
        items: [
          "Un QR sur les tables et sur les sacs de commande à emporter.",
          "Un mot du personnel au moment de payer — c'est ce qui marche le mieux, et de loin.",
          "Une raison d'installer : les points qui commencent à compter dès la première commande.",
        ],
      },
    ],
    faq: {
      titre: "Questions sur l'application",
      items: [
        {
          q: "Est-ce que c'est vraiment une app, ou un site déguisé?",
          a: "Une vraie application, publiée sur l'App Store et sur Google Play sous le nom de ton restaurant, qui s'installe et vit sur l'écran d'accueil du téléphone.",
        },
        {
          q: "Mes clients vont-ils vraiment la télécharger?",
          a: "Les habitués, oui, quand on leur donne une raison — les points, et la commande en deux tapes. Les clients d'un soir, non, et c'est correct : eux commandent depuis ton site.",
        },
        {
          q: "Est-ce que je peux avoir l'app sans le reste?",
          a: "L'app s'appuie sur les commandes en ligne : c'est ce qui lui donne un menu, un paiement et un historique. Les deux vont ensemble, contrairement aux autres morceaux.",
        },
      ],
    },
    cta: {
      titre: "Une app à ton nom, ça se regarde en trente minutes.",
      texte:
        "On te montre à quoi elle ressemblerait chez toi, et ce que ça prend pour la remplir.",
    },
  },
};

export const FONCTIONNALITES_EN: Record<Cle, Fonctionnalite> = {
  referencement: {
    slug: "/en/platform/google-visibility",
    filNom: "Google visibility",
    metaTitre: "Google visibility for restaurants",
    metaDescription:
      "Google Business Profile, reviews, a site a machine can actually read: what makes an independent restaurant show up on Google, and how long it takes. No promises of a top spot.",
    surTitre: "More Google traffic",
    titre: "Your restaurant finally shows up on Google",
    intro:
      "When someone types “pizza near me” at six on a Friday, three restaurants appear ahead of the rest. Here's how we get you into those three — and why it takes months rather than a week.",
    resume:
      "The Google Business Profile, the reviews, and a site a machine can read.",
    typeService: "Local search optimization for restaurants",
    blocs: [
      { t: "h2", texte: "A restaurant gets found in three places" },
      {
        t: "p",
        texte:
          "People say “show up on Google” as if there were one screen. There are three, they don't follow the same rules, and a restaurant can dominate one while being absent from the other two.",
      },
      {
        t: "ul",
        items: [
          "**The map**, at the top of the results: three listings with stars and a directions button. That's where “near me” is decided, and it's your Google Business Profile that decides it, not your site.",
          "**The blue results**, underneath: that's your site. It has to exist, load fast, and let a machine read what's on it.",
          "**The engines that answer** — ChatGPT, Perplexity, Google's AI overviews. They don't return a list, they write an answer and cite a few sources. A restaurant with a clear offer and checkable facts gets cited; the others don't exist.",
        ],
      },

      { t: "h2", texte: "Your Google Business Profile comes first" },
      {
        t: "p",
        texte:
          "It's the piece that pays back fastest, and it's almost always the one that's half filled in. A complete listing beats an empty one even when the site behind it is weaker.",
      },
      {
        t: "ul",
        items: [
          "Claiming it if it already exists — most restaurants have an auto-created listing they've never claimed.",
          "The right categories, the ones Google matches to searches. Plain “Restaurant” puts you up against the whole province.",
          "Hours, holiday hours included. A listing that says “open” on a holiday Monday when you're closed earns you a one-star review.",
          "Recent photos, taken in your place. Not stock images.",
          "The menu and an order link that points to you, not to a delivery app.",
        ],
      },

      { t: "h2", texte: "Reviews, without buying a single one" },
      {
        t: "p",
        texte:
          "Reviews carry real weight on the map, which is exactly why suppliers will offer to sell you some. Google catches them, and the penalty lands on your listing — not on the supplier.",
      },
      {
        t: "p",
        texte:
          "What works is duller and lasts longer: asking at the right moment, asking happy customers, with a path that takes ten seconds. And answering all of them, the bad ones included. A calm reply to an angry review tells a future customer more than ten perfect ratings.",
      },

      { t: "h2", texte: "Your site has to be readable by a machine" },
      {
        t: "p",
        texte:
          "This is where most restaurant sites lose. Not because they're ugly — because a robot finds nothing in them.",
      },
      {
        t: "encadre",
        titre: "The PDF menu trap",
        texte:
          "It's the most common case, and the most expensive. A menu posted as an image or a PDF is text Google doesn't read. Your dishes, your prices, your specialties: invisible. The menu has to be text on the page.",
      },
      {
        t: "ul",
        items: [
          "A site that loads fast on a phone on 4G, not on your designer's fibre connection.",
          "Hours, address and phone as text, identical to your listing — when the two disagree, Google trusts both a little less.",
          "Restaurant structured data: the invisible markup that tells Google this page is a restaurant, with its cuisine, its hours and its menu.",
          "One page per real subject. A one-page site can only rank for one thing.",
        ],
      },

      { t: "h2", texte: "How long, honestly" },
      {
        t: "p",
        texte:
          "**The listing: a few weeks.** It's the fastest piece, and often the one that pays best.",
      },
      {
        t: "p",
        texte:
          "**The site: a few months.** Google has to come back, re-read, compare. No setting shortens that, and anyone promising you the top spot by next week is selling something other than search.",
      },
    ],
    faq: {
      titre: "Questions about search",
      items: [
        {
          q: "Do you guarantee the top spot on Google?",
          a: "No, and nobody can. Google doesn't sell positions in its organic results. What we guarantee is the work: the complete listing, the readable site, the reviews asked for properly.",
        },
        {
          q: "I already have a Google listing — isn't that enough?",
          a: "Rarely. Most listings exist without ever having been claimed: rough categories, wrong hours, photos from five years ago, and an order link pointing to a delivery app.",
        },
        {
          q: "Do you handle my Google listing?",
          a: "Yes. Your Google Business Profile is often the first place a customer finds you. We create it if it doesn't exist, fill it in completely, and keep it current with your hours and your photos.",
        },
        {
          q: "What about Google reviews?",
          a: "We set up what makes your happy customers want to leave one, and we help you answer the ones that come in. We never buy reviews: Google catches them, and it backfires on the restaurant.",
        },
        {
          q: "Does this work if my restaurant is outside a big city?",
          a: "Often better than in one. There are fewer restaurants competing on a local search, so a well-kept listing gets noticed faster.",
        },
      ],
    },
    cta: {
      titre: "We'll look at your listing and your site in thirty minutes.",
      texte:
        "You leave with what we found and the order to fix it in. Whether you sign or not.",
    },
  },

  commandes: {
    slug: "/en/platform/online-ordering",
    filNom: "Online ordering",
    metaTitre: "Online ordering with no commission",
    metaDescription:
      "Take your orders online without handing over a cut of every sale, without changing your point of sale, and keep the customers who order. How it works, and what it asks of you.",
    surTitre: "More online sales",
    titre: "Online ordering that doesn't cost you a commission",
    intro:
      "Every order through a delivery app leaves part of the sale behind and keeps the customer. Here's what the other road looks like: the order comes to you, at full margin, and the customer becomes yours.",
    resume: "The order comes through you. No commission, and the customer stays yours.",
    typeService: "Online ordering for restaurants",
    blocs: [
      { t: "h2", texte: "What an app order really costs" },
      {
        t: "p",
        texte:
          "The commission is the visible part, and it isn't the expensive one. The real cost is that you're paying to serve a customer you'll never be able to reach yourself. You're renting access to your own clientele, one order at a time, forever.",
      },
      {
        t: "tableau",
        entetes: ["", "App order", "Direct order"],
        lignes: [
          ["What's left for you", "The sale minus the commission", "The sale"],
          ["Who has the customer's email", "The app", "You"],
          ["Who sets the listed prices", "You, under commission pressure", "You"],
          ["Who can bring them back", "The app", "You"],
          ["Who they think they chose", "The app", "Your restaurant"],
        ],
      },
      {
        t: "p",
        texte:
          "That last line is the one people forget. A customer loyal to a delivery app isn't loyal to your restaurant: they're loyal to the app, which will offer them your neighbour next week.",
      },

      { t: "h2", texte: "How the order reaches you" },
      {
        t: "p",
        texte:
          "**Without touching your point of sale.** That's the constraint we set ourselves: nobody relearns a system on a Friday night. The order lands on a dedicated screen, prints if you want paper, and makes a sound so it doesn't sit unseen for five minutes.",
      },
      {
        t: "p",
        texte:
          "The customer downloads nothing: they order from your site, on their phone, and pay online. The ones who come back often will end up installing your app — that's the other piece of the platform.",
      },

      { t: "h2", texte: "The cart that raises the bill" },
      {
        t: "p",
        texte:
          "A well-built online order sells more than a phone call, and it isn't magic: the screen offers what nobody has time to offer on the phone with three calls on hold.",
      },
      {
        t: "ul",
        items: [
          "The extras at the right moment — the sauce, the add-on, the bigger size.",
          "The dish that goes with it, suggested before checkout rather than after.",
          "The previous order brought back in one tap: that's the shortcut that keeps regulars coming.",
        ],
      },

      { t: "h2", texte: "What you get back, and apps keep" },
      {
        t: "p",
        texte:
          "Every direct order leaves you something no app will ever hand over: **who ordered, what, and when**. That list is what feeds the follow-ups, and it's what's worth the most over time. Without it, you start from zero every service.",
      },

      { t: "h2", texte: "What it asks of you" },
      {
        t: "p",
        texte:
          "Worth saying up front, because this is where it goes wrong when it goes wrong.",
      },
      {
        t: "ul",
        items: [
          "**Someone watches the screen.** An online order sitting unaccepted for ten minutes does more damage than a badly written menu.",
          "**Hours and sold-out items kept current.** Selling a dish that ran out tonight costs you a customer, not just an order.",
          "**A little patience at the start.** Your regulars are used to the phone. The switch happens over weeks, with a sign, a note on the receipt, a QR code on the table.",
        ],
      },
    ],
    faq: {
      titre: "Questions about online ordering",
      items: [
        {
          q: "Do I have to close my delivery accounts?",
          a: "No, and we won't tell you to right away. They're still a source of orders. The goal is that they stop being the only one, and that your regulars come through you.",
        },
        {
          q: "Does anything change in the kitchen?",
          a: "One more screen, and that's it. Your point of sale doesn't change, and neither do your habits. The order prints if that's what your staff prefers.",
        },
        {
          q: "How is this different from DoorDash or Uber Eats?",
          a: "On those platforms, a cut of every order goes to commission and the customer belongs to the app. With us, the order goes through your own site and your own app: the customer is yours, and so is the money.",
        },
        {
          q: "Do you handle delivery?",
          a: "We connect the ordering, not the drivers. Plenty of restaurants keep their own delivery or offer pickup only — that's often where the margin is best.",
        },
      ],
    },
    cta: {
      titre: "What are your commissions costing you this year?",
      texte:
        "Thirty minutes, your numbers in hand, and we look together at what direct ordering would change.",
    },
  },

  relances: {
    slug: "/en/platform/customer-winback",
    filNom: "Customer follow-ups",
    metaTitre: "Customer follow-ups for restaurants",
    metaDescription:
      "Bringing back a customer who already ordered costs less than finding a new one. How follow-ups work, what we send, and what Canada's anti-spam law requires.",
    surTitre: "More repeat orders",
    titre: "Your customers come back without you lifting a finger",
    intro:
      "Someone ordered from you once, they liked it, and they don't come back — not because they found better, but because they forgot. Follow-ups fix exactly that problem, and nothing else.",
    resume: "The customer who already ordered comes back, without you thinking about it.",
    typeService: "Customer retention and follow-ups for restaurants",
    blocs: [
      { t: "h2", texte: "The cheapest customer is the one you already have" },
      {
        t: "p",
        texte:
          "Finding a new one costs money: advertising, a commission, time. Bringing back someone who already ordered and still remembers your food takes a reminder at the right moment. Same sale, without the acquisition cost.",
      },
      {
        t: "p",
        texte:
          "It's also the part of the work no restaurant owner has time to do by hand. Nobody is writing to eighty customers on a Tuesday afternoon.",
      },

      { t: "h2", texte: "What we send, and when" },
      {
        t: "p",
        texte:
          "A short sequence, triggered by what the customer did, not by the calendar.",
      },
      {
        t: "ol",
        items: [
          "**After the first order** — a thank-you, and the chance to leave a review while the meal is still fresh in mind.",
          "**When they don't come back** — one offer, just one, on something close to what they ordered.",
          "**When they do come back** — suggestions based on their own orders, not on your highest-margin dish.",
          "**At the moments that matter** — Valentine's Day, Mother's Day, the holidays. Those are the nights a restaurant fills up or sits empty.",
        ],
      },

      { t: "h2", texte: "The law comes before everything else" },
      {
        t: "p",
        texte:
          "Sending commercial email in Canada isn't a free-for-all: the anti-spam legislation governs who you may write to, what the message must contain, and how fast you must stop when someone unsubscribes. The fines are not symbolic.",
      },
      {
        t: "ul",
        items: [
          "**Consent first.** We write to people who ordered from you and agreed to hear from you. No purchased lists, ever.",
          "**Your restaurant identified**, with a real address and a real contact in every message.",
          "**An unsubscribe that works**, in one click, handled immediately.",
        ],
      },
      {
        t: "p",
        texte:
          "It isn't only a legal question. A restaurant that sends three emails a week gets blocked by its best customers, and nobody can undo that.",
      },

      { t: "h2", texte: "How we know it's working" },
      {
        t: "p",
        texte:
          "Open rate is the most quoted measure and the least useful: an email opened that brings nobody in earned nothing. We look at two things, and both are counted in dollars.",
      },
      {
        t: "ul",
        items: [
          "**How many customers ordered again** within thirty days of a follow-up, compared with those who didn't get one.",
          "**The share of your orders coming from a customer you already know.** That's the number that climbs when the machinery works, and the one that says you depend less on the apps.",
        ],
      },
      {
        t: "p",
        texte:
          "Both numbers live in your own orders, not in a supplier's dashboard. You can check them yourself, and that's on purpose.",
      },

      { t: "h2", texte: "What we don't send" },
      {
        t: "ul",
        items: [
          "No weekly newsletter nobody asked for.",
          "No permanent discount: a customer who only buys on promotion costs more than they bring in.",
          "No message to someone who ordered yesterday.",
        ],
      },
    ],
    faq: {
      titre: "Questions about follow-ups",
      items: [
        {
          q: "Where do the addresses come from?",
          a: "From your own online orders, with the customer's consent. That's why the two pieces go together: without direct ordering there's no list, and without a list there are no follow-ups.",
        },
        {
          q: "Do I have to write the messages?",
          a: "No. We write them with you once, in your voice, and they run on their own after that. You can change one when your menu changes.",
        },
        {
          q: "Does it work by text message too?",
          a: "Texts get read more and forgiven far less. The same consent rules apply, stricter in practice — we start with email.",
        },
      ],
    },
    cta: {
      titre: "How many customers ordered exactly once?",
      texte:
        "That's the question we look at together in thirty minutes. The answer surprises almost everyone.",
    },
  },

  application: {
    slug: "/en/platform/mobile-app",
    filNom: "Mobile app",
    metaTitre: "A mobile app for your restaurant",
    metaDescription:
      "An app under your own name, on the App Store and Google Play, with two-tap ordering and loyalty points built in. What it brings, and what it takes to make it work.",
    surTitre: "More app downloads",
    titre: "Your app, under your name, on the App Store",
    intro:
      "Not a tab inside somebody else's application: your own app, with your name and your icon, that your customer installs on their phone and finds among their other icons.",
    resume: "A real app under your name, on the stores, with loyalty built in.",
    typeService: "Mobile ordering app for restaurants",
    blocs: [
      { t: "h2", texte: "Under your name, not ours" },
      {
        t: "p",
        texte:
          "The app is published on the App Store and Google Play under your restaurant's name. Its icon is your logo. Its store listing talks about your restaurant, with your photos. Someone searching your name on their phone finds it.",
      },
      {
        t: "p",
        texte:
          "That's the fundamental difference with a delivery app: over there you're a line in a list, between two competitors, under someone else's logo.",
      },

      { t: "h2", texte: "Why an app when you already have a site" },
      {
        t: "ul",
        items: [
          "**Two-tap ordering.** The app remembers the customer, their address and their last order. A site has to ask for all of it again.",
          "**An icon on their screen.** It reminds them of your restaurant every time they reach for something else on their phone. No advertising does that at this price.",
          "**Notifications**, the only channel that doesn't need to be opened to be seen.",
          "**Loyalty**, living where they order rather than on a cardboard card at the bottom of a wallet.",
        ],
      },

      { t: "h2", texte: "Points, without a card to stamp" },
      {
        t: "p",
        texte:
          "The customer earns by ordering, sees their progress in the app, and redeems when they want. Nothing to stamp, nothing to lose, and on your side you can see who's close to a reward.",
      },
      {
        t: "p",
        texte:
          "The reward stays your call. A free dessert costs little and gets noticed; a permanent discount trains customers who only ever buy on sale.",
      },

      { t: "h2", texte: "Notifications, sparingly" },
      {
        t: "p",
        texte:
          "It's the most powerful channel and the easiest to ruin. One notification a week, sent when it can actually help — Friday around five, the day of a special — gets read. One a day gets switched off, and a notification switched off never comes back on.",
      },

      { t: "h2", texte: "The store review delay" },
      {
        t: "p",
        texte:
          "An app doesn't ship like a website. Apple and Google review every application before accepting it, and every update after that. It's a few days each time, sometimes longer if a reviewer asks for a clarification.",
      },
      {
        t: "p",
        texte:
          "You also need a developer account in your own name, with both Apple and Google — that's what makes the app genuinely yours, and what lets you keep it the day you stop working with us. We handle the paperwork, but the accounts stay yours.",
      },

      { t: "h2", texte: "What it takes to work" },
      {
        t: "p",
        texte:
          "An app doesn't fill itself: nobody downloads a restaurant's app for no reason. It's the one piece of the platform that asks something of you, in the dining room.",
      },
      {
        t: "ul",
        items: [
          "A QR code on the tables and on takeout bags.",
          "A word from staff at checkout — that's what works best, by a wide margin.",
          "A reason to install: points that start counting from the first order.",
        ],
      },
    ],
    faq: {
      titre: "Questions about the app",
      items: [
        {
          q: "Is it a real app, or a website in disguise?",
          a: "A real application, published on the App Store and Google Play under your restaurant's name, that installs and lives on the phone's home screen.",
        },
        {
          q: "Will my customers actually download it?",
          a: "Your regulars will, when you give them a reason — the points, and two-tap ordering. One-time customers won't, and that's fine: they order from your site.",
        },
        {
          q: "Can I get the app without the rest?",
          a: "The app runs on online ordering: that's what gives it a menu, a payment and a history. Those two go together, unlike the other pieces.",
        },
      ],
    },
    cta: {
      titre: "An app under your name is worth thirty minutes.",
      texte:
        "We'll show you what it would look like for your restaurant, and what it takes to fill it.",
    },
  },
};
