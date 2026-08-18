import { CITY, PHONE_DISPLAY } from "@/lib/site";

/* Tous les textes de la page d'accueil, en français.

   CE FICHIER DÉFINIT LA FORME. `Textes` est déduit de cet objet, et le
   dictionnaire anglais doit le satisfaire : oublier une clé casse la
   compilation au lieu de laisser un trou en production. Ajouter une clé ici,
   c'est donc s'obliger à la traduire — c'est voulu.

   Ce qui N'EST PAS ici : les coordonnées (site.ts, elles ne se traduisent pas)
   et les pages /confidentialite et 404, qui restent françaises. */

export const FR = {
  code: "fr",
  htmlLang: "fr-CA",
  // Racine de la version : sert à préfixer TOUS les liens de section, sinon un
  // anglophone qui clique « Approche » retombe sur la page française.
  racine: "",
  autre: { code: "en", href: "/en", etiquette: "EN", titre: "English" },

  meta: {
    titre: "Resto Action | On règle les vrais problèmes des restos indépendants",
    description: `Une entreprise québécoise à l'écoute des restaurateurs indépendants. On trouve ce qui gruge ton resto pis on le règle avec toi. ${PHONE_DISPLAY}.`,
    ogTitre: "Resto Action | On règle les vrais problèmes des restos indépendants",
    ogDescription:
      "On commence par t'écouter. On trouve ce qui gruge ton resto, pis on le règle avec toi.",
    ogLocale: "fr_CA",
  },

  nav: {
    aria: "Navigation principale",
    accueil: "Accueil",
    approche: "Approche",
    mission: "Mission",
    histoire: "Histoire",
    faq: "FAQ",
    descendre: "Descendre vers la suite",
    linkedin: "Resto Action sur LinkedIn",
    // « Appelle-nous » ne survit qu'à un seul endroit : la carte de Guillaume
    // du héro, où l'action EST un appel. Partout ailleurs, le bouton mène à la
    // page /contact, qui offre le choix — donc « Nous contacter ».
    appelle: "Appelle-nous",
    contacter: "Nous contacter",
    logoAlt: "Resto Action",
    // Menu mobile : étiquettes plus longues que celles du bureau, à dessein.
    mobileAria: "Menu mobile",
    ouvrirMenu: "Ouvrir le menu",
    fermerMenu: "Fermer le menu",
    // Uniquement des SECTIONS de l'accueil : le contact est le bouton plein du
    // bas du panneau, il n'a pas à figurer deux fois.
    mobile: [
      ["#top", "Accueil"],
      ["#approche", "Notre approche"],
      ["#mission", "Notre mission"],
      ["#histoire", "Notre histoire"],
      ["#faq", "FAQ"],
    ] as [string, string][],
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
      "vendre en ligne sans commission.",
      "faire revenir leurs clients.",
      "avoir leur propre app.",
    ],
  },

  hero: {
    carteTitre: "Parle à Guillaume",
    carteSousTitre: "Un appel de 30 minutes.",
    guillaumeAlt: "Guillaume Therrien, cofondateur de Resto Action",
  },

  resultats: {
    titre:
      "Avec Resto Action, tu as plus de trafic, plus de ventes, plus de clients qui reviennent.",
    tablistAria: "Ce que Resto Action change pour ton resto",
    precedent: "Onglet précédent",
    suivant: "Onglet suivant",
    onglets: [
      {
        onglet: "Plus de trafic Google",
        surTitre: "Ton référencement, réglé",
        titre: "Ton resto sort enfin dans Google",
      },
      {
        onglet: "Plus de ventes en ligne",
        surTitre: "Des commandes sans commission",
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
    titre: "Notre approche",
    sousTitre: "On s'adapte vraiment à chaque restaurant!",
    etapes: [
      {
        titre: "On t'écoute",
        texte: "Un appel de 30 minutes, tu nous parles de ton resto.",
        alt: "La mascotte Resto Action écoute au téléphone",
      },
      {
        titre: "On creuse avec toi",
        texte: "On trouve ensemble ce qui gruge tes marges.",
        alt: "La mascotte Resto Action examine une facture à la loupe",
      },
      {
        titre: "On règle le problème",
        texte: "Une solution adaptée, pas une recette toute faite.",
        alt: "La mascotte Resto Action lève le pouce, problème réglé",
      },
    ],
  },

  /* La mission est le seul bloc où le texte n'est pas fait de phrases entières :
     un appel de note coupe le premier paragraphe, des <strong> coupent les deux
     suivants. D'où ce découpage en morceaux plutôt qu'en paragraphes. */
  mission: {
    surTitre: "Notre mission",
    titre: "Pensez au dernier resto indépendant où vous avez mangé.",
    p1a: "Le proprio, il se lève à 5 heures pour recevoir ses livraisons. Il connaît le nom de ses habitués. Sa recette, c'est peut-être celle de sa mère. Lui, il travaille 70 heures par semaine pour se garder 3 à 9 % de marge",
    p1b: ".",
    p2a: "Pis pendant ce temps-là, tout monte : le loyer, la bouffe, l'équipement, les assurances.",
    p2fort: "Chaque semaine, un nouveau feu à éteindre.",
    p2b: "Lui, il a pas une minute pour s'asseoir et regarder ce qui gruge son resto pour vrai.",
    p3a: "Si rien ne change, ces restos-là ferment un par un, et on perd notre variété au profit des multinationales. Dans 10 ans, il va rester quoi?",
    p3fort: "Des chaînes pis des franchises.",
    chute:
      "Nous, on refuse ça. Notre mission : que le fruit du travail des restaurateurs québécois leur revienne, pour le bien collectif.",
    sourceAvant: "Source : 1.",
    sourceLien: "Restaurants Canada",
    sourceApres:
      ", données sur les marges bénéficiaires avant impôt en restauration.",
  },

  histoire: {
    titre: "Notre histoire",
    // Gabarit, pas fonction : le dictionnaire traverse des composants
    // clients, qui n'acceptent que des données sérialisables.
    linkedinDe: "Profil LinkedIn de {nom}",
    jalons: [
      {
        titre: "Les restos ferment",
        texte:
          "Chaque anniversaire de la famille de Guillaume se fêtait au même restaurant. Même table, même propriétaire. En 2020, il a fermé, comme des centaines d'autres au Québec.",
        alt: "Guillaume Therrien, cofondateur de Resto Action",
        legende: "Guillaume",
      },
      {
        titre: "Les marges sont minces",
        texte:
          "Justin l'a vécu en travaillant en restauration : chaque perte compte, chaque dollar donné à un intermédiaire fait mal.",
        alt: "Justin Bouillon, cofondateur de Resto Action",
        legende: "Justin",
      },
      {
        titre: "Des jeunes en Action",
        texte:
          "Rencontre à l'École d'entrepreneurship de Beauce. Guillaume présente l'idée, Justin embarque sur-le-champ. Ils gagnent le Défi CEED et décident d'agir.",
        alt: "Certificat du Défi CEED 2026, 1re position, remis à Guillaume Therrien pour Resto Action",
        legende: "1re position au Défi CEED 2026",
      },
    ],
  },

  /* Les réponses sont reprises MOT POUR MOT dans le JSON-LD FAQPage : Google
     exige que le balisage corresponde au contenu visible. Traduire une réponse
     ici la traduit donc aussi dans le balisage. */
  faq: {
    titre: "Questions fréquentes",
    items: [
      {
        q: "C'est quoi, Resto Action?",
        a: `Resto Action, c'est une entreprise de Trois-Rivières au service des restaurants indépendants du Québec. On commence par t'écouter, on trouve ce qui gruge ton resto, et on règle le problème avec toi.`,
      },
      {
        q: "Quels genres de problèmes vous réglez?",
        a: "Des commissions qui grugent tes marges, des clients que tu n'arrives pas à rejoindre, de la visibilité, des outils qui te coûtent trop cher. Peu importe le problème, on commence par t'écouter.",
      },
      {
        q: "Combien ça coûte?",
        a: `Ça dépend de ton resto et de ton problème. Appelle-nous au ${PHONE_DISPLAY}, on regarde ça ensemble en 30 minutes, chiffres en main.`,
      },
      {
        q: "Vous êtes où? Vous servez qui?",
        a: "On est basés à Trois-Rivières, en Mauricie, et on travaille avec des restaurants indépendants partout au Québec.",
      },
      {
        q: "Comment on commence?",
        a: `Tu nous appelles au ${PHONE_DISPLAY}, tu nous écris, ou tu cédules ton appel directement sur le site. Trente minutes pour regarder ensemble ce qui gruge ton resto. Pas de pression, pas de contrat de 40 pages.`,
      },
    ],
  },

  contact: {
    titre: "Parlons de ton resto.",
    texte:
      "Un appel de 30 minutes suffit pour voir ce que Resto Action peut faire pour ton resto.",
    signature: "Guillaume Therrien · Resto Action",
  },

  agenda: {
    chargement: "Un instant, on ouvre l'agenda…",
    titreIframe: "Céduler un appel avec Resto Action",
  },

  /* La page /contact. Elle ne remplace pas la section #contact de l'accueil :
     celle-ci reste l'aboutissement du one-pager. La page, elle, est la
     destination des boutons « Nous contacter » — elle pose le choix à plat au
     lieu de faire défiler quelqu'un à travers tout le site. */
  pageContact: {
    metaTitre: "Nous contacter",
    metaDescription:
      "Deux façons de joindre Resto Action : céduler un appel de 30 minutes avec Guillaume, ou nous appeler directement au 819 944-4661.",
    surtitre: "On répond vite",
    titre: "Parlons de ton resto.",
    rdv: {
      titre: "Céduler un appel",
      texte:
        "Choisis ton heure dans l'agenda. Trente minutes avec Guillaume, sans pression et sans engagement.",
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
    approche: "Notre approche",
    mission: "Notre mission",
    histoire: "Notre histoire",
    faq: "FAQ",
    confidentialite: "Politique de confidentialité",
    ceduler: "Céduler un appel",
    ville: CITY,
    droits: "© {annee} Resto Action, un produit de",
    droitsFin: `, ${CITY}.`,
  },

  /* Ce qui part dans le JSON-LD et n'apparaît nulle part à l'écran. */
  donnees: {
    definition:
      "Resto Action, c'est une entreprise québécoise au service des restaurateurs indépendants : on commence par écouter, on trouve ce qui gruge ton resto, et on règle le problème avec toi.",
    zoneServie: "Québec, Canada",
  },
};

export type Textes = typeof FR;
