import { CITY, PHONE_DISPLAY, POSTAL_CODE, STREET } from "@/lib/site";

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
    titre: "Resto Action | Plateforme web pour restaurants indépendants",
    description: `Visibilité Google, commandes en ligne sans commission, clients qui reviennent. La plateforme des restos indépendants du Québec. ${PHONE_DISPLAY}.`,
    ogTitre: "Resto Action | On règle les vrais problèmes des restos indépendants",
    ogDescription:
      "On commence par t'écouter. On trouve ce qui gruge ton resto, pis on le règle avec toi.",
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
    // « Appelle-nous » ne survit qu'à un seul endroit : la carte de Guillaume
    // du héro, où l'action EST un appel. Partout ailleurs, le bouton mène à la
    // page /contact, qui offre le choix — donc « Nous contacter ».
    appelle: "Appelle-nous",
    contacter: "Nous contacter",
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
      "vendre en ligne sans commission.",
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
      "Commandes sans commission",
      "Clients qui reviennent",
      "Ton app à ton nom",
    ],
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
        a: `Resto Action, c'est une plateforme web pour les restaurants indépendants du Québec, bâtie à Trois-Rivières : visibilité dans Google, commandes en ligne sans commission, relances de tes clients et ton app à ton nom.`,
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
      "Un appel de 30 minutes suffit pour voir ce que Resto Action peut faire pour ton resto.",
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
    duree: "30 minutes avec Guillaume, par Google Meet.",
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
      "L'invitation vient de partir à {courriel}. Elle contient le lien de l'appel.",
    meet: "Ouvrir le Google Meet",
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
    plateforme: "La plateforme",
    approche: "Notre approche",
    mission: "Notre mission",
    histoire: "Notre histoire",
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
      "Resto Action, c'est une plateforme québécoise pour les restaurants indépendants : on te rend visible dans Google, on prend tes commandes en ligne sans commission, on fait revenir tes clients, et on te donne ton app à ton nom.",
    zoneServie: "Québec, Canada",
  },
};

export type Textes = typeof FR;
