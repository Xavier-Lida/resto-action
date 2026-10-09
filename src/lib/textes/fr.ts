import { CITY, PHONE_DISPLAY, POSTAL_CODE, STREET } from "@/lib/site";

/* Tous les textes de la page d'accueil, en français.

   CE FICHIER DÉFINIT LA FORME. `Textes` est déduit de cet objet, et le
   dictionnaire anglais doit le satisfaire : oublier une clé casse la
   compilation au lieu de laisser un trou en production. Ajouter une clé ici,
   c'est donc s'obliger à la traduire — c'est voulu.

   Ce qui N'EST PAS ici : les coordonnées (site.ts, elles ne se traduisent pas)
   et les pages /confidentialite et 404, qui restent françaises. */

/* Un paragraphe de produit se lit comme une suite de morceaux : du texte, et
   des statuts de commande qu'on met en évidence. Ce sont des étiquettes
   d'interface, pas des citations — d'où des puces plutôt que des guillemets.

   La liste sort en const ANNOTÉE plutôt qu'écrite à même l'objet : sans ça,
   `typeof FR` déduirait une union de trois formes d'objets — l'une avec `alt`,
   l'autre avec des statuts dans `texte` — et un `.map` sur cette union se
   plaindrait côté composant. */
type Bout = string | { statut: string };

const APPS: {
  demo: string;
  etiquette: string;
  titre: string;
  texte: Bout[];
  alt?: string;
}[] = [
  {
    demo: "client",
    etiquette: "L'app de tes clients",
    titre: "Une app à ton nom, pas à celui d'un intermédiaire",
    texte: [
      "Ton menu, tes photos, tes couleurs, ton programme de points. Le client choisit, commande en livraison ou en cueillette, et retrouve ses commandes passées. Sur son écran d'accueil, c'est ton nom qui reste.",
    ],
    alt: "Démonstration de l'application de commande Bistro Habibi",
  },
  {
    demo: "cuisine",
    etiquette: "L'app de ta cuisine",
    titre: "Resto Action",
    texte: [
      "Les commandes arrivent, sonnent, et se suivent du ",
      { statut: "nouveau" },
      " jusqu'au ",
      { statut: "livrée" },
      // Aucune puce ne termine une phrase : le point tomberait après le
      // rembourrage de la pastille, et se lirait comme une espace avant point.
      " dans la même file. Un plat en rupture se retire en un geste. Les heures, la pause du service, les frais de livraison se règlent de la même place.",
    ],
  },
  {
    demo: "livreur",
    etiquette: "L'app de tes livreurs",
    titre: "Resto Go",
    texte: [
      "Tes livreurs voient les courses arriver et en prennent une. L'adresse s'ouvre dans Plans, le client est à un appel. Toi, tu sais où en est chaque livraison sans avoir à appeler personne.",
    ],
    alt: "Démonstration de l'application des livreurs Resto Go",
  },
];

export const FR = {
  code: "fr",
  htmlLang: "fr-CA",
  // Racine de la version : sert à préfixer TOUS les liens de section, sinon un
  // anglophone qui clique « Approche » retombe sur la page française.
  racine: "",
  /* `autre` a été retiré d'ici. Il tenait le lien vers l'autre langue sous
     la forme d'un chemin FIGÉ (« /en »), ce qui renvoyait tout le monde à
     l'accueil quelle que soit la page lue. Le chemin équivalent se déduit
     maintenant du registre des routes (`equivalentLangue`), qui apparie
     réellement les pages. Ses trois autres champs — code, etiquette, titre —
     n'étaient lus nulle part. */

  /* LE TITLE ET L'OG-TITRE NE DISENT PLUS LA MÊME CHOSE, ET C'EST VOULU.

     Le title est lu par un moteur, dans une liste de dix résultats bleus : il
     doit dire à quoi sert le site avec les mots que les gens tapent. L'ancien
     — « On règle les vrais problèmes des restos indépendants » — était une
     bonne phrase de marque et un mauvais titre : rien n'y indiquait qu'on parle
     de plateforme, de site web ou de commandes en ligne.

     L'og-titre, lui, est lu par un humain dans son fil : il garde la voix. */
  meta: {
    titre: "Resto Action | App web et mobile pour restaurants indépendants",
    description: `Ton app de commande web et mobile, à ton nom. Sans les 30 % des plateformes, visible dans Google, avec des clients qui reviennent. Pour les restos indépendants du Québec. ${PHONE_DISPLAY}.`,
    ogTitre: "Resto Action | Ton app de commande web et mobile, à ton nom",
    ogDescription:
      "Tes clients commandent chez toi, pas sur Uber. Ton app web et mobile, des livreurs d'ici, et ta liste de clients qui t'appartient.",
    ogLocale: "fr_CA",
  },

  /* LA NAVIGATION EST REGROUPÉE, PLUS À PLAT.

     Elle avait grossi jusqu'à six liens parce que chaque page nouvelle y était
     branchée une à une, sans jamais reprendre l'ensemble. Six libellés côte à
     côte, c'est six décisions à prendre pour un visiteur qui n'en a qu'une :
     savoir ce que vous vendez.

     Trois groupes déroulants les remplacent. Ce dictionnaire ne porte QUE les
     titres des groupes : leur contenu est composé par src/lib/navigation.ts à
     partir des sources qui le détiennent déjà — les chemins et les noms des
     quatre fonctionnalités viennent de contenu/fonctionnalites.ts, les
     libellés de sections de `pied`. Recopier ici cinq chemins déjà écrits
     ailleurs aurait été se donner cinq occasions de les désaccorder. */
  nav: {
    aria: "Navigation principale",
    // Toujours utilisé : c'est le premier maillon des fils d'Ariane.
    accueil: "Accueil",
    faq: "FAQ",
    groupes: {
      plateforme: "Plateforme",
      entreprise: "Entreprise",
      ressources: "Ressources",
    },
    // L'entrée qui mène à la page plateforme elle-même, en tête de son groupe.
    vueDensemble: "Vue d'ensemble",
    /* Les chemins voyagent avec la langue. Les préfixer de `racine` comme une
       ancre donnerait « /en/plateforme » côté anglais — une page qui n'existe
       pas, l'adresse anglaise étant « /en/platform ». */
    plateformeHref: "/plateforme",
    blogueHref: "/blogue",
    descendre: "Descendre vers la suite",
    linkedin: "Resto Action sur LinkedIn",
    youtube: "Resto Action sur YouTube",
    // « Appelle-nous » ne survit qu'à un seul endroit : la carte de Guillaume
    // du héro, où l'action EST un appel. Partout ailleurs, le bouton mène à la
    // page /contact, qui offre le choix — donc « Nous contacter ».
    appelle: "Appelle-nous",
    contacter: "Nous contacter",
    produits: "Voir nos produits",
    logoAlt: "Resto Action",
    mobileAria: "Menu mobile",
    ouvrirMenu: "Ouvrir le menu",
    fermerMenu: "Fermer le menu",
  },

  langue: { aria: "Langue", courante: "Français" },

  /* LE H1. Une partie fixe en gris, une partie qui tourne en noir plein.
     SEULE LA PREMIÈRE VARIANTE EST RENDUE DANS LE DOM — les autres arrivent par
     le JavaScript. C'est ce que fait la référence, et c'est ce qui compte pour
     le référencement : le robot lit un H1 propre et unique au lieu des quatre
     phrases concaténées. Sans JavaScript, la première reste affichée et la
     phrase est complète.

     Les quatre variantes reprennent les quatre onglets de la section
     Résultats : c'est la même promesse, dite deux fois. */
  h1: {
    fixe: "Les restos indépendants du Québec nous appellent pour",
    variantes: [
      "sortir enfin dans Google.",
      "vendre en ligne sans donner 30 %.",
      "faire revenir leurs clients.",
      "avoir leur propre app.",
    ],
  },

  hero: {
    /* CE QU'ON VEND, EN QUATRE MOTS-CLÉS PLUTÔT QU'EN PARAGRAPHE.

       C'était une phrase de trois lignes pleine largeur, centrée sous le
       titre : elle disait la bonne chose et elle la disait mal, en faisant
       concurrence au H1 au lieu de le prolonger.

       Quatre promesses courtes se lisent d'un coup d'œil, tiennent sur une
       ligne, et gardent les quatre mots que les gens tapent. C'est aussi une
       vraie liste dans le HTML, pas un bloc de prose.

       L'ordre suit les quatre onglets de la section Résultats et les quatre
       pages de fonctionnalité : la même promesse, dite trois fois, dans le
       même ordre à chaque fois. */
    promesses: [
      "Visible dans Google",
      "Commandes sans les 30 %",
      "Clients qui reviennent",
      "Ton app à ton nom",
    ],
    carteTitre: "Parle à Guillaume",
    carteSousTitre: "Un court appel.",
    guillaumeAlt: "Guillaume Therrien, cofondateur de Resto Action",
    badge: "Fait à Trois-Rivières, pour les restos d'ici",
    titre: ["Tes clients.", "Tes ventes.", "Ton app."],
    puces: [
      "App web + mobile à ton nom",
      "Livraison par nos livreurs d'ici",
      "On installe tout, tu n'as rien à faire",
    ],
    recherche: {
      libelle: "Nom de ton resto",
      exemple: "Trouve ton resto (ex. Casse-croûte Chez Paul)",
      bouton: "Ma maquette gratuite",
    },
    condition: "Réservation 500 $ remboursable jusqu'au lancement",
    // La demande de maquette gratuite, faite à la main, qui s'ouvre du champ.
    maquette: {
      titre: "La maquette de {nom}, faite à la main.",
      titreGenerique: "Ta maquette gratuite, faite à la main.",
      restaurant: "Nom de ton resto",
      texte:
        "On te monte une vraie maquette de ton app, pas un modèle : ton logo, ton menu, tes photos. Gratuite, sans engagement, et envoyée à ton adresse courriel dans les 48 h.",
      inclus: ["Ton logo et tes couleurs", "Ton vrai menu, avec tes prix", "Tes photos, pas des photos d'exemple"],
      nom: "Ton nom",
      courriel: "Ton courriel",
      cell: "Ton cell",
      ville: "Ville",
      menu: "Lien de ton menu ou de ton site",
      facultatif: "facultatif",
      bouton: "Recevoir ma maquette",
      envoi: "Envoi…",
      exemple: "Celle qu'on a faite pour Bistro Habibi",
      exempleAlt: "L'app de Bistro Habibi qui défile : accueil, menu, compte et panier",
      attente: "L'app de Bistro Habibi",
      decide: "Déjà décidé?",
      vieprivee: "Tes coordonnées servent seulement à te faire ta maquette et à te joindre.",
      reserver: "Réserver ma place fondateur",
      merciTitre: "C'est noté, {prenom}!",
      merciTexte:
        "La maquette de {nom} t'est envoyée à {courriel} dans les 48 h. Si on a une question sur ton menu, on t'appelle.",
      merciReserver: "Réserver ma place pendant qu'il en reste",
      erreurs: {
        invalide: "Il manque ton nom, ton courriel, ton cell ou ta ville.",
        trop: "Trop d'essais d'un coup. Réessaie dans quelques minutes.",
        autre: "Ça n'a pas passé. Appelle-nous ou texte-nous au {tel}, on s'en occupe.",
      },
    },
    // L'aperçu automatique, fait avec la fiche Google du resto (ApercuResto).
    apercu: {
      etiquette: "Aperçu automatique",
      chargement: "On cherche ta fiche Google…",
      choisir: "C'est lequel?",
      note: "Fait tout seul avec ta fiche Google. Ta vraie maquette, avec ton menu et tes prix, est faite à la main et t'arrive en 48 h.",
      aucun: "On n'a pas trouvé ta fiche Google. Voici l'app qu'on a faite pour Bistro Habibi :",
      couleur: "Essaie une couleur",
      avis: "avis Google",
      commander: "Commander",
      vedette: "En vedette",
      points: "Tes points de fidélité",
    },
    // L'aperçu d'app généré à partir du nom tapé dans le champ.
    generateur: {
      etapes: ["Ton nom et tes couleurs", "Ton menu", "Ton programme de points"],
      enCours: "On bâtit l'app de {nom}…",
      titre: "Voici l'app de {nom}.",
      texte: "Ton menu, tes photos et tes couleurs : on la monte avec toi après ta réservation. Tes clients la gardent sur leur écran d'accueil.",
      couleur: "Choisis ta couleur",
      livrerA: "Livrer à",
      adresse: "Choisir une adresse",
      ouvert: "Ouvert jusqu'à 21 h",
      delai: "Livraison · 25–35 min",
      livraison: "Livraison",
      cueillette: "À emporter",
      promo: {
        etiquette: "Tous les jours",
        titre: "Poutine + boisson",
        texte: "Ajoute une boisson pour seulement 2,50 $",
        bouton: "Commander",
      },
      categories: ["Pizzas", "Poutines", "Ailes", "Salades", "Entrées"],
      populaires: "Populaires",
      toutVoir: "Tout voir",
      points: "Tes points : 120",
      pointsDetail: "Encore 30 points pour une frite gratuite",
      plats: [
        { nom: "Pizza pepperoni", prix: "18,99 $" },
        { nom: "Poutine classique", prix: "13,95 $" },
        { nom: "Ailes BBQ", prix: "15,99 $" },
        { nom: "Salade César", prix: "11,99 $" },
        { nom: "Pain à l'ail", prix: "6,99 $" },
      ],
      onglets: ["Accueil", "Menu", "Points", "Compte"],
      note: "Exemple d'aperçu : ton vrai menu et tes photos remplacent ceux-ci.",
      reserver: "Réserver l'app de {nom}",
      fermer: "Fermer l'aperçu",
    },
    // {prises} et {total} viennent de PLACES_FONDATEURS (site.ts).
    // {reste} et {total} viennent de PLACES_FONDATEURS (site.ts).
    places: "Il reste {reste} places dans ta ville",
    reserver: "Réserver ma place fondateur",
    pasPret: "Pas encore prêt?",
    // La fenêtre qui s'ouvre de « Pas encore prêt? » : l'agenda de Guillaume.
    // La fenêtre « Pas encore prêt? » : deux portes pour ceux qui hésitent.
    hesite: {
      titre: "Pas encore prêt? Pas de problème.",
      texte: "Deux façons d'avancer à ton rythme, sans engagement.",
      maquette: {
        titre: "Reçois ta maquette gratuite",
        texte: "Ton app avec ton logo et ton menu, par courriel dans les 48 h.",
      },
      appel: {
        titre: "Parle à Guillaume",
        texte: "Choisis ton heure, il t'appelle.",
      },
      appelTitre: "Choisis ton heure, Guillaume t'appelle.",
      retour: "Retour",
      fermer: "Fermer",
    },
    video: {
      titre: "Resto Action : ta propre app de commande, ta clientèle t'appartient",
      lire: "Lire la vidéo « Ta propre app de commande, ta clientèle t'appartient »",
    },
  },

  resultats: {
    titre:
      "Avec Resto Action, tu as plus de trafic, plus de ventes, plus de clients qui reviennent.",
    tablistAria: "Ce que Resto Action change pour ton resto",
    precedent: "Onglet précédent",
    suivant: "Onglet suivant",
    /* Le libellé du lien qui part du panneau vers la page de la
       fonctionnalité. Les quatre onglets disent ce que la plateforme change ;
       sans ce lien, l'accueil ne menait à aucune des quatre pages qui
       l'expliquent. */
    lire: "En savoir plus",
    onglets: [
      {
        onglet: "Plus de trafic Google",
        surTitre: "Ton référencement, réglé",
        titre: "Ton resto sort enfin dans Google",
      },
      {
        onglet: "Plus de ventes en ligne",
        surTitre: "Des commandes sans les 30 % des plateformes",
        titre: "Une commande en ligne qui donne le goût d'ajouter",
      },
      {
        onglet: "Plus de commandes répétées",
        surTitre: "Des relances qui travaillent pour toi",
        titre: "Tes clients reviennent sans que tu aies à y penser",
      },
      {
        onglet: "Plus de téléchargements",
        surTitre: "Ton app, à ton nom",
        titre: "Récompense tes clients dans ta propre app",
      },
    ],
    photoAlt:
      "Un client commande dans l'application du restaurant, attablé devant des pizzas",
  },

  /* Les fausses interfaces. Elles se traduisent comme le reste : un anglophone
     qui voit une interface en français se dit que le produit n'est pas pour
     lui. Attention, DEUX pièges de minutage :
     - `recherche` change de longueur d'une langue à l'autre, donc la durée de
       la frappe aussi (70 ms par signe) ;
     - `etapes` DOIT garder ses huit entrées : le tableau PASSAGES qui allume
       les icônes est calculé pour huit jalons. */
  maquettes: {
    recherche: "Pizza près de moi",
    tonResto: "Ton restaurant",
    plats: [
      { nom: "Salade César", prix: "11,99 $" },
      { nom: "Pain à l'ail", prix: "13,99 $" },
      { nom: "Poutine", prix: "12,99 $" },
      { nom: "Ailes de poulet", prix: "14,99 $" },
      { nom: "La Gotham", prix: "34,00 $" },
    ],
    panier: "Ton panier",
    // Le montant est composé autour des colonnes de l'odomètre : « Tu gardes
    // 87,96 $ » en français, « You keep $87.96 » en anglais — le signe change
    // de côté, d'où ces trois morceaux plutôt qu'une seule chaîne.
    montant: { avant: "Tu gardes ", separateur: ",", apres: " $" },
    nouvelleCliente: "Nouvelle cliente",
    cliente: "Marie-Ève",
    etapes: [
      "on attend 1 jour",
      "Offre spéciale envoyée",
      "Courriel de suggestions",
      "Marie-Ève recommande",
      "on attend 1 jour",
      "Spécial des fêtes envoyé",
      "Marie-Ève devient une habituée",
    ],
    avatarAlt: "",
  },

  approche: {
    titre: "Comment ça marche",
    sousTitre: "Trois étapes, et on s'occupe de tout.",
    etapes: [
      {
        titre: "Tu réserves ta place",
        texte: "500 $, remboursables jusqu'au lancement de ton app.",
        alt: "La mascotte Resto Action écoute au téléphone",
      },
      {
        titre: "On prépare ton app avec toi",
        texte: "Ton menu, tes photos et tes couleurs pendant la préparation du lancement. Les tests de commande et de facturation restent à valider.",
        alt: "La mascotte Resto Action examine une facture à la loupe",
      },
      {
        titre: "Tes clients commandent chez toi",
        texte: "Après les validations et la confirmation de ta date de mise en service, on installe, on forme ton équipe et on active les commandes.",
        alt: "La mascotte Resto Action lève le pouce, problème réglé",
      },
    ],
  },

  /* LA COMPARAISON, EN DIX MOTS PAR COLONNE. Peu de texte, gros caractères :
     elle se lit d'un coup d'œil et mène au gros bouton de réservation. */
  plateformes: {
    titre: "Sur Uber, ton client n'est pas à toi.",
    eux: {
      titre: "Sur les plateformes",
      points: [
        "Jusqu'à 30 % de chaque commande",
        "Ton client leur appartient",
        "Ton concurrent affiché juste à côté",
      ],
    },
    toi: {
      titre: "Avec ton app",
      points: [
        "Tu gardes ta marge",
        "Ton client est à toi, l'app le fait revenir toute seule",
        "Des livreurs d'ici, l'argent reste au Québec",
      ],
    },
    reserver: "Réserver ma place fondateur",
    sous: "500 $ remboursable jusqu'au lancement",
  },

  /* LE CALCULATEUR ANIMÉ. Les noms, montants et avis de l'animation sont des
     EXEMPLES : la mention « hypotheses » le dit, sous les chiffres. */
  calcul: {
    titre: "Ce que ton app ferait pour toi en un an",
    sousTitre: "Entre tes vrais chiffres. Regarde ce qui se passe.",
    commandes: "Commandes en ligne par mois",
    facture: "Facture moyenne",
    rejouer: "Rejouer l'animation",
    liste: {
      titre: "Ta liste de clients",
      unite: "commandes par année avec les coordonnées du client",
      noms: ["Julie T.", "Marc L.", "Sophie B.", "Kevin R."],
      ajoute: "1re commande",
      mois: "Ta liste qui grandit, mois après mois",
    },
    ventes: {
      titre: "Des ventes que tu n'aurais jamais eues",
      unite: "de ventes en plus par année",
      parAn: "/ an",
      leviers: [
        { titre: "Suggestions au panier", detail: "« Ajoute un breuvage? » : la facture monte de 5 %" },
        { titre: "Rappels par texto et paniers récupérés", detail: "1 commande sur 20 de plus" },
        { titre: "Nouveaux clients trouvés sur Google", detail: "1 commande sur 20 de plus" },
      ],
    },
    avis: {
      titre: "Tes avis Google",
      unite: "nouveaux avis par année",
      texto: "Texto automatique",
      sms: "Merci Kevin! Ça te tente de nous laisser un avis?",
      auteurs: ["Kevin R.", "Annie P.", "Luc M."],
      extraits: ["Livré chaud, parfait!", "Meilleure poutine du coin", "Commande super facile"],
      quand: "il y a 1 jour",
    },
    garde: "gardés par année au lieu de les donner aux plateformes",
    hypotheses:
      "Estimation, pas une garantie. Argent gardé : 30 % de frais de plateforme typiques, comparés à notre abonnement à 200 $ par mois et à notre commission en livraison, 10 % (en cueillette, c'est 5 %, donc tu gardes encore plus). Ventes en plus (chiffre d'affaires, aucun frais ajouté sur les suggestions) : 5 % de plus par facture grâce aux suggestions, 1 commande sur 20 de plus grâce aux rappels et aux paniers récupérés, 1 sur 20 de plus grâce à Google. Avis : 1 commande sur 20. Les noms et les avis qui défilent sont des exemples. Avant taxes et frais de carte.",
    reserver: "Réserver ma place fondateur",
  },

  /* LE CATALOGUE. Trois apps, dont une seule est montrée à l'écran — les deux
     autres se décrivent, faute d'avoir des captures à leur nom.

     Le texte parle de CE QUE LES APPS FONT, jamais de ce qui est en
     exploitation : rien n'est publié sur les magasins, aucun resto ne tourne
     encore en production, et l'encaissement n'est pas bouclé. Chaque phrase
     doit rester vraie en regardant l'écran. */
  produits: {
    titre: "Trois applications, un seul système.",
    // Tant qu'une démo n'a pas ses captures, son cadre affiche ça.
    attente: "Aperçu à venir",
    apps: APPS,
    // La démo animée de la tablette de cuisine (DemoTablette). Les noms, les
    // plats et les montants sont des exemples tirés du menu de Bistro Habibi.
    tablette: {
      alt: "Démonstration de la tablette de cuisine : une nouvelle commande arrive, on l'accepte, elle passe en préparation puis au livreur",
      resto: "Bistro Habibi",
      ouvert: "Ouvert",
      onglets: ["Commandes", "Menu", "Réglages"],
      colonnes: { nouvelles: "Nouvelles", preparation: "En préparation", pretes: "Prêtes" },
      nouvelle: "Nouvelle commande",
      livraison: "Livraison",
      cueillette: "Cueillette",
      articles: "articles",
      accepter: "Accepter",
      prete: "Prête",
      tempsPrep: "Temps de préparation",
      minutes: "min",
      pretDans: "Prête dans {n} min",
      livreurArrive: "Ali arrive dans 2 min",
      remis: "Remise au livreur",
      jour: "Aujourd'hui : {n} commandes · {montant}",
      commande: {
        numero: "#1043",
        client: "Marie-Ève L.",
        total: "46,48 $",
        plats: [
          { qte: 2, nom: "Panuozzo Habibi", note: "Sauce piquante" },
          { qte: 1, nom: "Frites maison", note: "" },
          { qte: 1, nom: "Coca-Cola", note: "" },
        ],
      },
      autres: [
        { numero: "#1042", client: "Sophie T.", mode: "livraison", articles: 2 },
        { numero: "#1041", client: "Jean-François B.", mode: "cueillette", articles: 3 },
      ],
      prete1: { numero: "#1039", client: "Karim D." },
    },
  },

  lancement: {
    titre: "Pré-lancement · offre fondateur",
    accroche: "Pré-lancement avec deux restaurants partenaires. Les tests restent à valider avant la mise en service.",
    resume: "Tu réserves pendant la préparation du lancement avec deux restaurants partenaires. La date de mise en service reste à confirmer après les tests. Aucun abonnement pendant l'attente.",
    texte: "Nous préparons le lancement de Resto Action avec deux restaurants partenaires. Le parcours de commande et la facturation doivent encore être testés et validés avant l'ouverture des commandes payantes.",
    date: "Ta réservation permet de préparer ton app au tarif fondateur. La date de mise en service sera confirmée avec toi après les validations nécessaires.",
    abonnement: "Ton abonnement, tes trois mois de publicité et ta garantie de 90 jours commencent à la mise en ligne de ton app.",
    remboursement: "Les 500 $ de mise en service, plus taxes, sont remboursables sur demande écrite jusqu'à la mise en ligne.",
  },

  /* L'OFFRE FONDATEUR. Les montants et la garantie doivent rester identiques au
     contrat et au bon d'accord ; la garantie est à valider par l'avocat. */
  offre: {
    surTitre: "Offre fondateur",
    titre: "Offre fondateur : préparons ton lancement.",
    sousTitre: "On ne te fait pas de rabais. On investit dans ta croissance.",
    // L'avantage fondateur : 300 $ de pub payée par nous, au lieu d'un rabais.
    pub: {
      montant: "300 $",
      titre: "de publicité payée par nous",
      texte:
        "Pendant tes 3 premiers mois après la mise en ligne, on gère tes pubs Facebook et Instagram, juste avant les repas. Chaque nouveau client est à toi.",
    },
    inclusTitre: "Ce qui est inclus",
    inclus: [
      "Ton app web et mobile, à ton nom",
      "Ta fiche Google optimisée",
      "Rappels SMS et courriel",
      "Livraison par nos livreurs",
      "300 $ de pub, gérée par nous",
    ],
    garantie: {
      titre: "Garantie 90 jours",
      texte: "Si tes économies ne couvrent pas ton abonnement, on te rembourse ton abonnement et nos commissions.",
      note: "Sur tes 90 premiers jours en ligne, si tu restes les 90 jours et que tu as suivi nos étapes. Mise en service et équipement exclus.",
    },
    coutsTitre: "Le prix, au complet",
    couts: [
      { quand: "Aujourd'hui", quoi: "500 $", barre: "1 000 $", detail: "Mise en service, prix fondateur" },
      { quand: "À l'installation", quoi: "495 $", detail: "Tablette, support et encarts" },
      { quand: "Chaque mois, dès la mise en ligne", quoi: "200 $", detail: "Abonnement, rien pendant l'attente" },
      { quand: "Par commande", quoi: "5 % · 10 %", detail: "Cueillette · livraison (Uber : jusqu'à 30 %)" },
    ],
    taxes: "Taxes et frais de carte en sus.",
    reserver: "Réserver ma place fondateur",
    condition: "Pré-réservation de 500 $, remboursable jusqu'à la mise en ligne. Date de lancement à confirmer.",
  },
  // Le formulaire de réservation fondateur (/reserver) et sa page de merci.
  reservation: {
    metaTitre: "Réserve ta place fondateur | Resto Action",
    metaDescription:
      "Prépare le lancement de ton app au tarif fondateur. Tests avec deux restaurants partenaires, date à confirmer et 500 $ remboursables jusqu'à la mise en ligne.",
    retour: "Retour au site",
    etape: "Étape {n} sur 4",
    etapes: ["Ton resto", "Ton app", "L'offre", "Réservation"],
    suivant: "Continuer",
    precedent: "Retour",
    resto: {
      titre: "Parle-nous de ton resto",
      texte: "Prépare ton app à ton nom. La réservation prend 2 minutes; la mise en service suivra la validation des tests.",
      restaurant: "Nom du resto",
      exempleResto: "Ex. : Pizzeria du Coin",
      ville: "Ville",
      exempleVille: "Ex. : Trois-Rivières",
      nom: "Ton nom",
      courriel: "Courriel",
      telephone: "Téléphone",
    },
    app: {
      titre: "Ton app, faite à la main",
      texte: "On la monte avec ton logo, ton menu et tes photos. Donne-nous de quoi partir, on s'occupe du reste.",
      menu: "Lien de ton menu ou de ton site",
      facultatif: "facultatif",
      exempleMenu: "Ex. : facebook.com/tonresto ou ton site",
      menuAide: "Pas de lien? Pas grave : on trouve ton menu et on te le fait valider.",
      livraisonMaquette: "Ta maquette t'est envoyée dans les 48 h à {courriel}.",
      service: "Ce que tu offres",
      services: {
        livraison: "Livraison et cueillette",
        cueillette: "Cueillette seulement",
      },
      plateformes: "Tu es sur quelles plateformes en ce moment ?",
      listePlateformes: ["Uber Eats", "DoorDash", "SkipTheDishes", "Aucune"],
      commandes: "Combien de commandes par semaine passent par ces plateformes ?",
      listeCommandes: ["Moins de 50", "50 à 150", "150 à 300", "Plus de 300", "Je ne sais pas"],
    },
    offre: {
      titre: "Ta place fondateur",
      texte: "500 $ aujourd'hui pour préparer ton app au tarif fondateur. Tes 300 $ de publicité et ton abonnement commencent à la mise en ligne. Voici le prix au complet.",
      accord:
        "J'ai lu le prix au complet. Je comprends que le lancement dépend encore de la validation des tests, sans date ferme confirmée, et que ma réservation n'active pas les commandes. Mes 500 $ sont remboursables sur demande écrite jusqu'à la mise en ligne; aucun abonnement n'est facturé pendant l'attente.",
    },
    paiement: {
      titre: "On réserve ta place",
      texte: "Tu passes au paiement sécurisé de Stripe. Ta facture, avec la TPS et la TVQ, arrive par courriel.",
      recap: "Ta réservation",
      ligne: "Place fondateur",
      tps: "TPS (5 %)",
      tvq: "TVQ (9,975 %)",
      total: "Total aujourd'hui",
      bouton: "Payer {total} et réserver",
      envoi: "Ouverture du paiement…",
      securite: "Paiement sécurisé par Stripe. On ne voit jamais ton numéro de carte.",
      vieprivee: "Tes coordonnées servent seulement à monter ton app et à te joindre.",
      annule:
        "Le paiement a été annulé : ta place n'est pas encore réservée. Tu peux réessayer quand tu veux.",
    },
    erreurs: {
      invalide: "Il manque une info, ou le courriel n'est pas valide.",
      accord: "Coche la case pour continuer.",
      trop: "Trop d'essais d'un coup. Réessaie dans quelques minutes.",
      config: "Le paiement en ligne n'est pas encore ouvert. Appelle-nous au {tel}, on réserve ta place au téléphone.",
      stripe: "Le paiement n'a pas pu s'ouvrir. Réessaie, ou appelle-nous au {tel}.",
    },
    apercuDefaut: "ton resto",
    apercu: {
      titre: "L'app de {nom}, faite à la main",
      texte: "Comme celle de Bistro Habibi : ton logo, ton menu, tes photos. Pas un modèle.",
    },
    // La page de suivi privée du resto après son paiement (/dossier/[session]).
    dossier: {
      metaTitre: "Ton dossier | Resto Action",
      surTitre: "Ton dossier",
      progression: "{n} étapes sur {total}",
      etapes: [
        { titre: "Place réservée", texte: "Ton paiement de 500 $ est reçu." },
        { titre: "Appel de démarrage", texte: "On fait le point sur ton resto et sur ce qu'il faut préparer." },
        { titre: "Ta maquette", texte: "Ton app avec ton logo, ton menu et tes photos, à valider avec toi." },
        { titre: "Ton menu et tes photos", texte: "On a tout ce qu'il faut pour bâtir ton app." },
        { titre: "Tests avec nos restos partenaires", texte: "Commande, paiement et facturation validés avant d'ouvrir les commandes." },
        { titre: "Date de mise en service confirmée", texte: "On fixe avec toi l'installation et la formation." },
        { titre: "En ligne", texte: "Tes clients commandent chez toi. L'abonnement, la pub et la garantie commencent." },
      ],
      enCours: "En cours",
      prochainPoint: "Prochain point avec nous",
      aConfirmer: "À confirmer",
      dateLancement: "Mise en service",
      message: "Le mot de l'équipe",
      misAJour: "Mis à jour le {date}",
      actions: "Besoin de quelque chose?",
      envoyerMenu: "Envoyer mon menu et mes photos",
      appeler: "Appeler Guillaume",
      rembourser: "Demander un remboursement",
      rembourserNote: "Tes 500 $ sont remboursables sur demande écrite jusqu'à la mise en ligne.",
      introuvable: "Ce dossier est introuvable. Vérifie le lien dans ton courriel, ou appelle-nous au {tel}.",
      sujetMenu: "Menu et photos : {resto}",
      sujetRemboursement: "Demande de remboursement : {resto}",
      voir: "Voir mon dossier",
      voirTexte: "Garde ce lien : tu y vois où en est ton app, en tout temps.",
    },
    merci: {
      metaTitre: "Ta place est réservée | Resto Action",
      titre: "Ta place est réservée.",
      etiquette: "Place fondateur · {resto}",
      titreGenerique: "Merci !",
      texte: "Merci {prenom}! Ta facture est partie à {courriel}.",
      texteGenerique:
        "Si ton paiement est passé, ta facture est dans ta boîte courriel. Un doute ? Appelle-nous au {tel}.",
      suiteTitre: "La suite",
      suite: [
        "On t'appelle dans les 24 h pour faire le point sur ton restaurant et préparer la suite.",
        "Ta maquette arrive par courriel dans les 48 h.",
        "On bâtit ton app avec ton menu, tes photos et tes couleurs.",
        "Après validation des tests de commande et de facturation, on confirme avec toi la date de mise en service et l'installation.",
        "À la mise en ligne, ton abonnement commence, avec tes trois mois de publicité et ta garantie de 90 jours.",
      ],
      suiviTitre: "Fais le point avec Guillaume",
      suiviTexte: "Tu peux choisir un créneau pour parler de ta réservation, des éléments à préparer et de l'avancement du lancement.",
      suiviBouton: "Choisir mon appel de suivi",
      retour: "Retour à l'accueil",
      paye: "Payé aujourd'hui",
      question: "Une question d'ici là? Appelle-nous au",
    },
  },

  histoire: {
    titre: "Notre histoire",
    // Gabarit, pas fonction : le dictionnaire traverse des composants
    // clients, qui n'acceptent que des données sérialisables.
    linkedinDe: "Profil LinkedIn de {nom}",
    // La reconnaissance, en une ligne, à côté des deux cofondateurs.
    ceed: {
      titre: "1re position au Défi CEED 2026",
      texte: "L'équipe s'est formée à l'École d'entrepreneurship de Beauce. On a gagné, et on a décidé d'agir.",
      alt: "Certificat du Défi CEED 2026, 1re position, remis à Guillaume Therrien pour Resto Action",
    },
    convictions: {
      titre: "Ce en quoi on croit",
      fondateurs: [
        {
          nom: "Guillaume",
          role: "Cofondateur · ventes et terrain",
          alt: "Guillaume Therrien, cofondateur de Resto Action",
          points: [
            {
              titre: "Tes marges d'abord.",
              texte: "Chaque dollar qu'une plateforme te prend, on veut te le rendre.",
            },
            {
              titre: "Des clients contents qui reviennent.",
              texte: "Un client satisfait commande encore. C'est ça qui fait vivre un resto.",
            },
            {
              titre: "Des humains sur le terrain.",
              texte: "On vient chez vous, on parle français, et tu as un vrai numéro à appeler.",
            },
            {
              titre: "Des ventes que tu n'aurais pas eues.",
              texte: "Google, textos, points : on va chercher des commandes nouvelles, pas juste celles d'Uber.",
            },
          ],
        },
        {
          nom: "Xavier",
          role: "Cofondateur · technologie",
          alt: "Xavier Lida, cofondateur de Resto Action",
          points: [
            {
              titre: "Tout est optimisé.",
              texte: "Chaque écran et chaque étape de commande sont pensés pour aller vite et vendre plus.",
            },
            {
              titre: "Des systèmes fiables.",
              texte: "La commande arrive, ta cuisine la voit, le livreur la prend. Sans stress.",
            },
            {
              titre: "Toujours en amélioration.",
              texte: "On perfectionne tes outils en continu, à partir de ce qu'on voit dans nos restos.",
            },
          ],
        },
      ],
    },
  },

  /* LA SECTION DE LA CHAÎNE YOUTUBE. Elle ne montre pas une vidéo, elle vend un
     abonnement : la vidéo est la preuve, le bouton est le but.

     Le texte ne promet RIEN que la chaîne n'ait pas déjà publié — pas de
     « chaque semaine », pas de liste de sujets à venir. Il dit ce qu'on y
     trouve aujourd'hui et invite à suivre la suite.

     `video.titre` et `video.description` sont CEUX DE YOUTUBE, à l'émoji près :
     ils partent dans le VideoObject du JSON-LD, et un moteur qui compare les
     deux fiches doit y reconnaître la même vidéo. `lire` est le nom accessible
     du lien de lecture — la miniature, elle, ne dit rien à un lecteur d'écran.
     `mention` est vide ici et remplie en anglais : elle prévient que la vidéo
     est en français. */
  chaine: {
    surTitre: "Notre chaîne YouTube",
    titre: "La suite se passe sur YouTube",
    texte:
      "On y raconte pourquoi Resto Action existe, et comment un resto indépendant reprend le contrôle de ses commandes, de ses marges et de ses clients. Commence par notre histoire, puis abonne-toi pour ne pas manquer la suite.",
    abonner: "S'abonner à la chaîne",
    video: {
      titre:
        "Notre histoire : plus de profits, plus de clients, plus de contrôle pour les restaurants",
      description:
        "Et si les restaurants pouvaient générer plus de commandes, récupérer leurs marges et surtout reprendre le contrôle de leurs clients ? C'est exactement la raison pour laquelle nous avons créé Resto Action : aider les restaurateurs à développer leur propre écosystème numérique et à réduire leur dépendance envers les grandes plateformes.",
      lire: "Lire la vidéo « Notre histoire » (5 min 32 s)",
      mention: "",
    },
  },

  /* Les réponses sont reprises MOT POUR MOT dans le JSON-LD FAQPage : Google
     exige que le balisage corresponde au contenu visible. Traduire une réponse
     ici la traduit donc aussi dans le balisage. */
  faq: {
    titre: "Questions fréquentes",
    items: [
      {
        q: "C'est quoi, Resto Action?",
        a: "Ton app de commande web et mobile, à ton nom, pour les restos indépendants du Québec. Bâtie à Trois-Rivières. Tes clients commandent chez toi plutôt que sur Uber Eats ou DoorDash, et on s'occupe du reste : ta fiche Google, les relances par texto qui les font revenir, et la livraison par des livreurs d'ici.",
      },
      {
        q: "C'est une app mobile ou un site web?",
        a: "Les deux. Tes clients commandent sur ton site, directement dans le navigateur, sans rien télécharger : c'est ton app web. Tes habitués, eux, téléchargent ton app mobile à ton nom, sur iPhone et Android. Même menu, même compte, mêmes points.",
      },
      {
        q: "Vous prenez une commission?",
        a: "Oui, mais petite : 5 % sur la cueillette et 10 % sur la livraison, calculés sur les aliments et boissons seulement. Les plateformes, elles, prennent jusqu'à 30 %.",
      },
      {
        q: "Combien ça coûte?",
        a: "Pour les restos fondateurs : 500 $ de mise en service au lieu de 1 000 $, 495 $ d'équipement à l'installation (tablette, support, chevalet et encarts), et 200 $ par mois d'abonnement à partir de la mise en ligne. Plus 5 % en cueillette et 10 % en livraison. Taxes en sus. Aucun abonnement pendant l'attente. Les 300 $ de pub Facebook et Instagram sont dépensés pendant les trois premiers mois après la mise en ligne. Les 500 $ sont remboursables sur demande écrite jusqu'à la mise en ligne.",
      },
      {
        q: "Pourquoi pas de rabais?",
        a: "Un rabais te fait sauver 300 $ une fois. 300 $ de pub bien placée t'amène des nouveaux clients qui recommandent pendant des mois. On aime mieux mettre cet argent là où il te rapporte.",
      },
      {
        q: "Et après les 3 mois?",
        a: "Tu peux continuer la pub avec ton propre budget. On la gère pour toi et on ne prend rien sur ton budget de pub : on gagne quand tu vends plus.",
      },
      {
        q: "Qui garde les clients?",
        a: "Toi. Chaque client qui commande par ton app est dans ta base de données. Tu les relances quand tu veux. Sur les plateformes, tes clients leur appartiennent.",
      },
      {
        q: "Vous êtes où? Vous servez qui?",
        a: "On est basés à Trois-Rivières, en Mauricie, et on travaille avec des restaurants indépendants partout au Québec.",
      },
      {
        q: "Est-ce que mon app sera active dès ma réservation?",
        a: "Non. Nous préparons le lancement avec deux restaurants partenaires. Les tests de commande, de fonctionnement avec les caisses et de facturation obligatoire doivent encore être terminés et validés avant l'ouverture des commandes payantes. Ta réservation permet de préparer ton app au tarif fondateur. La date de mise en service de ton restaurant sera confirmée avec toi après les validations nécessaires; aucune date ferme n'est encore garantie.",
      },
      {
        q: "Qu'est-ce qui se passe après mon paiement?",
        a: "Tu arrives sur une confirmation avec les prochaines étapes et un lien pour choisir un appel de suivi avec Guillaume. On t'appelle dans les 24 h pour faire le point; ta maquette est prévue par courriel dans les 48 h. On prépare ton menu, tes photos et tes couleurs avec toi. L'installation et l'activation seront planifiées après validation des tests. Aucun abonnement n'est facturé pendant l'attente; tu peux demander par écrit le remboursement des 500 $ jusqu'à la mise en ligne.",
      },
      {
        q: "Comment on commence?",
        a: `Tu réserves ta place fondateur en ligne : 4 étapes, 2 minutes, 500 $ remboursables jusqu'à la mise en ligne. On t'appelle dans les 24 h pour préparer ton app et faire le point sur les tests avant de confirmer une date de lancement. Pas prêt? Appelle-nous au ${PHONE_DISPLAY} ou prends un court appel avec Guillaume.`,
      },
      /* LES QUATRE QUESTIONS DE LONGUE TRAÎNE ONT DÉMÉNAGÉ. Elles étaient ici
         — commissions de livraison, fiche Google, avis, délais — et portaient
         la FAQ de l'accueil à neuf questions, soit un mur d'accordéons que
         personne ne déroule. Chacune vit maintenant sur la page qui traite
         déjà son sujet :

           DoorDash / Uber Eats  → /plateforme/commandes-en-ligne
           fiche Google          → /plateforme/referencement-google
           avis Google           → /plateforme/referencement-google
           délais                → /plateforme

         DÉPLACÉES, PAS COPIÉES : la même paire question-réponse sur deux pages
         produirait deux nœuds FAQPage concurrents pour une seule question, et
         Google ne saurait pas laquelle fait foi. L'accueil garde les cinq
         questions qui parlent de l'entreprise. */
    ],
  },

  contact: {
    titre: "Parlons de ton resto.",
    texte:
      "Un court appel suffit pour voir ce que Resto Action peut faire pour ton resto.",
    signature: "Guillaume Therrien · Resto Action",
  },

  /* LE WIDGET D'AGENDA.

     Il avait deux clés quand c'était une iframe de Google : le site n'avait
     qu'un titre et un « ça charge » à traduire, tout le reste était en
     Google-anglais dans un cadre qu'on ne contrôlait pas. Maintenant que la
     prise de rendez-vous est à nous, chaque mot l'est aussi — et le garde-fou
     de ce fichier oblige à les traduire tous. */
  agenda: {
    chargement: "Un instant, on ouvre l'agenda…",
    duree: "Un court appel : Guillaume t'appelle à l'heure que tu choisis.",
    fuseau: "Heure de l'Est",
    choisirJour: "Quel jour ?",
    choisirHeure: "Quelle heure ?",
    /* Les groupes d'heures. Vingt créneaux d'affilée, c'est un mur ; en trois
       paquets, ça se lit. Les seuils sont dans le composant (midi et 17 h). */
    matin: "Matin",
    apresMidi: "Après-midi",
    soiree: "Soirée",
    // Lus par les lecteurs d'écran seulement : les flèches n'ont qu'un chevron.
    moisPrecedent: "Mois précédent",
    moisSuivant: "Mois suivant",
    aucun:
      "Aucune plage libre pour l'instant. Appelle-nous, on va te trouver un moment.",
    panneTitre: "L'agenda ne répond pas",
    panneTexte: "Ça arrive. Appelle-nous, on prend le rendez-vous à la main.",
    coordonnees: "Tes coordonnées",
    retour: "Changer d'heure",
    nom: "Ton nom",
    restaurant: "Ton restaurant",
    courriel: "Ton courriel",
    telephone: "Ton téléphone",
    sujet: "Ce dont tu veux parler",
    facultatif: "facultatif",
    envoyer: "Confirmer mon rendez-vous",
    envoi: "On réserve…",
    confirmeTitre: "C'est réservé.",
    // Gabarit : le composant y insère l'adresse donnée par le visiteur.
    confirmeTexte:
      "L'invitation vient de partir à {courriel}. Guillaume t'appelle à l'heure prévue.",
    erreurs: {
      invalide: "Il manque quelque chose. Revérifie tes coordonnées.",
      pris: "Quelqu'un vient de prendre cette heure. Choisis-en une autre.",
      double:
        "Tu as déjà un rendez-vous à venir avec nous. Appelle-nous pour le déplacer.",
      trop: "Trop d'essais d'un coup. Attends quelques minutes.",
      google: `L'agenda ne répond pas. Appelle-nous au ${PHONE_DISPLAY}.`,
      config: `L'agenda ne répond pas. Appelle-nous au ${PHONE_DISPLAY}.`,
      reseau: "La connexion a flanché. Réessaie.",
    },
  },

  /* La page /contact. Elle ne remplace pas la section #contact de l'accueil :
     celle-ci reste l'aboutissement du one-pager. La page, elle, est la
     destination des boutons « Nous contacter » — elle pose le choix à plat au
     lieu de faire défiler quelqu'un à travers tout le site. */
  pageContact: {
    metaTitre: "Nous contacter",
    metaDescription:
      "Deux façons de joindre Resto Action : céduler un court appel avec Guillaume, ou nous appeler directement au 819 944-4661.",
    surtitre: "On répond vite",
    titre: "Parlons de ton resto.",
    rdv: {
      titre: "Céduler un appel",
      texte:
        "Choisis ton heure dans l'agenda. Un court appel avec Guillaume, sans pression et sans engagement.",
      bouton: "Choisir mon heure",
    },
    tel: {
      titre: "Appeler tout de suite",
      texte:
        "Si tu préfères parler à quelqu'un maintenant, le téléphone sonne chez nous, pas dans un centre d'appels.",
      bouton: "Appeler",
    },
    agendaTitre: "Choisis ton heure",
    retour: "Retour à l'accueil",
  },

  pied: {
    aria: "Pied de page",
    tagline:
      "Une entreprise de Trois-Rivières au service des restaurants indépendants du Québec.",
    plateforme: "La plateforme",
    approche: "Notre approche",
    produits: "Nos produits",
    histoire: "Notre histoire",
    youtube: "Chaîne YouTube",
    faq: "FAQ",
    blogue: "Le blogue",
    confidentialite: "Politique de confidentialité",
    // La politique existe maintenant dans les deux langues, à deux adresses
    // qui ne se déduisent pas l'une de l'autre (/confidentialite et
    // /en/privacy) : le chemin voyage donc avec le libellé.
    confidentialiteHref: "/confidentialite",
    ceduler: "Céduler un appel",
    // `ville` a disparu d'ici : le pied de page affiche maintenant l'adresse
    // complète, qui contient déjà la ville, et la mention du bas la répète une
    // troisième fois. Une seule ligne suffisait.
    // Le A du NAP. Il manquait : le site nommait la ville, jamais l'adresse.
    /* Espace INSÉCABLE dans le code postal : « G8W 2P7 » se coupait en fin de
       ligne, laissant « 2P7 » seul en dessous. POSTAL_CODE garde son espace
       normale — c'est lui qui part dans le PostalAddress du JSON-LD, où une
       insécable n'aurait rien à faire. */
    adresse: `${STREET}, Trois-Rivières (Québec) ${POSTAL_CODE.replace(" ", "\u00A0")}`,
    // Gabarit : le pied de page y insère la date formatée dans SA langue.
    miseAJour: "Site mis à jour le {date}",
    droits: "© {annee} Resto Action, un produit de",
    droitsFin: `, ${CITY}.`,
  },

  /* Ce qui part dans le JSON-LD et n'apparaît nulle part à l'écran. */
  donnees: {
    // La description déclarée aux moteurs. Elle NOMME l'offre — c'est le
    // reproche central de l'audit — et elle dit la même chose que la ligne
    // visible sous le H1 : un balisage qui promet autre chose que la page est
    // pire que pas de balisage du tout.
    definition:
      "Resto Action, c'est l'app de commande web et mobile des restos indépendants du Québec : à ton nom, sans les 30 % des plateformes, avec ta visibilité dans Google, des relances qui font revenir tes clients et la livraison par des livreurs d'ici.",
    zoneServie: "Québec, Canada",
  },
};

export type Textes = typeof FR;
