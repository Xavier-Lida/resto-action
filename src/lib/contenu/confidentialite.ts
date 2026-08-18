import { CITY } from "@/lib/site";

/* Le texte de la politique de confidentialité, dans les deux langues.

   Il vivait en clair dans le JSX de src/app/confidentialite/page.tsx, et la
   page n'existait qu'en français : le pied de page anglais envoyait donc les
   anglophones lire du français. Traduire la page revenait à copier son
   balisage ; le texte en est sorti pour que les deux versions partagent un
   seul composant.

   MÊME GARDE-FOU QUE LES DICTIONNAIRES : le français définit la forme, et
   l'anglais doit la satisfaire. Une section ajoutée d'un côté ne peut plus
   manquer de l'autre sans casser la compilation.

   La date est ISO et non écrite en toutes lettres : la page la formate dans sa
   propre langue, comme le pied de page fait pour MISE_A_JOUR. */
export const POLITIQUE_MAJ = "2026-07-01";

export const CONFIDENTIALITE_FR = {
  metaTitre: "Politique de confidentialité",
  metaDescription:
    "Politique de confidentialité de Resto Action (Studios LT), conforme à la Loi 25 du Québec.",
  surTitre: "Loi 25",
  titre: "Politique de confidentialité",
  intro:
    "On vous fait la leçon sur les données des clients. Ce serait mal venu de niaiser avec les vôtres. Voici, sans jargon, ce qu'on fait (et surtout ce qu'on fait pas) avec vos renseignements sur ce site.",

  recueillis: {
    titre: "Renseignements recueillis",
    texte:
      "Ce site ne recueille aucun renseignement personnel. Pas de formulaire, pas de compte, pas de témoins (cookies) publicitaires. Si vous nous appelez ou nous écrivez, on utilise vos coordonnées uniquement pour vous répondre.",
  },

  statistiques: {
    titre: "Statistiques de fréquentation",
    texte:
      "On mesure l'achalandage du site avec Vercel Analytics, un outil de statistiques anonymes qui n'utilise pas de témoins et ne permet pas de vous identifier personnellement.",
  },

  /* La seule section coupée par des liens : le courriel et le téléphone
     s'insèrent dans la phrase, d'où ces trois morceaux plutôt qu'un texte
     entier — même découpage que le bloc « mission » de l'accueil. */
  responsable: {
    titre: "Responsable de la protection des renseignements personnels",
    avant:
      "Conformément à la Loi 25, le responsable de la protection des renseignements personnels est Guillaume Therrien. Pour toute question : ",
    entre: " ou ",
    apres: ".",
  },

  droits: {
    titre: "Vos droits",
    texte:
      "Vous pouvez demander l'accès aux renseignements personnels qu'on détiendrait sur vous, leur rectification ou leur suppression, en écrivant à l'adresse ci-dessus. On vous répond dans les 30 jours.",
  },

  qui: {
    titre: "Qui nous sommes",
    texte: `Resto Action est un produit de Studios LT, ${CITY}.`,
  },

  // Gabarit : la page y insère la date formatée dans sa langue.
  derniereMaj: "Dernière mise à jour : {date}.",
};

export type Confidentialite = typeof CONFIDENTIALITE_FR;

export const CONFIDENTIALITE_EN: Confidentialite = {
  metaTitre: "Privacy policy",
  metaDescription:
    "Resto Action (Studios LT) privacy policy, compliant with Quebec's Law 25.",
  surTitre: "Law 25",
  titre: "Privacy policy",
  intro:
    "We lecture restaurant owners about customer data. It would be rich of us to play games with yours. Here, without the jargon, is what we do (and mostly don't do) with your information on this site.",

  recueillis: {
    titre: "Information we collect",
    texte:
      "This site collects no personal information. No forms, no accounts, no advertising cookies. If you call or write to us, we use your contact details for one thing only: getting back to you.",
  },

  statistiques: {
    titre: "Traffic statistics",
    texte:
      "We measure site traffic with Vercel Analytics, an anonymous statistics tool that uses no cookies and cannot identify you personally.",
  },

  responsable: {
    titre: "Privacy officer",
    avant:
      "Under Law 25, the person responsible for the protection of personal information is Guillaume Therrien. For any question: ",
    entre: " or ",
    apres: ".",
  },

  droits: {
    titre: "Your rights",
    texte:
      "You can ask to access any personal information we might hold about you, to correct it or to delete it, by writing to the address above. We answer within 30 days.",
  },

  qui: {
    titre: "Who we are",
    texte: "Resto Action is a product of Studios LT, Trois-Rivières, Quebec.",
  },

  derniereMaj: "Last updated: {date}.",
};
