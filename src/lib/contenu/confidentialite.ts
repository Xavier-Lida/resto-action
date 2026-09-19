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
export const POLITIQUE_MAJ = "2026-09-19";

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
      "Pas de compte à créer, pas de profil publicitaire, aucune donnée revendue à qui que ce soit. Le site dépose des témoins (cookies) de mesure d'audience, décrits juste en dessous. Le seul endroit où vous nous donnez des renseignements personnels, c'est la prise de rendez-vous, décrite dans la section suivante. Si vous nous appelez ou nous écrivez, on utilise vos coordonnées uniquement pour vous répondre.",
  },

  /* Suit src/app/api/agenda/route.ts et src/lib/crm.ts : ce qui est demandé au
     formulaire, où ça va, combien de temps ça reste. Si le formulaire gagne un
     champ ou si le CRM change d'hébergement, ce paragraphe devient faux. */
  rendezVous: {
    titre: "Quand vous prenez rendez-vous",
    texte:
      "Pour réserver un appel, on vous demande votre nom, votre courriel, votre téléphone et, si vous le voulez, le nom de votre restaurant et un message. Ces renseignements servent à une seule chose : préparer l'appel et y donner suite. Ils sont inscrits dans notre agenda (Google Agenda, qui vous envoie l'invitation) et dans notre outil de suivi des clients, hébergé au Canada et accessible à nos deux cofondateurs seulement. On y joint le lien par lequel vous êtes arrivé sur le site (par exemple une vidéo YouTube), retenu le temps de votre visite, pour savoir d'où viennent nos clients. On ne les vend pas, on ne les loue pas, et on ne s'en sert pas pour de la publicité. On les supprime sur simple demande : écrivez-nous à l'adresse ci-dessous.",
  },

  statistiques: {
    titre: "Statistiques de fréquentation",
    texte:
      "On mesure l'achalandage avec deux outils. Vercel Analytics produit des statistiques anonymes, sans témoins. Google Analytics, lui, dépose des témoins (cookies) qui attribuent à votre navigateur un identifiant aléatoire, et transmet ces données à Google : ça nous sert à savoir combien de personnes visitent le site et par quel chemin elles arrivent, jamais à vous identifier nommément. Vous pouvez le refuser en bloquant les témoins dans votre navigateur, ou en installant le module de désactivation publié par Google.",
  },

  /* Suit LecteurVideo.tsx : si le lecteur cesse d'attendre le clic, ou quitte
     youtube-nocookie.com, ce paragraphe devient faux. */
  video: {
    titre: "La vidéo de la page d'accueil",
    texte:
      "La vidéo de notre page d'accueil est hébergée par YouTube. Tant que vous n'appuyez pas sur lecture, elle n'est qu'une image servie par notre site : rien n'est demandé à YouTube et aucun témoin n'est déposé. Quand vous la lancez, le lecteur de YouTube se charge en mode de confidentialité renforcée (youtube-nocookie.com), et YouTube, donc Google, peut alors recueillir des données de visionnement selon sa propre politique. De notre côté, on compte la lecture dans nos statistiques, et on retient le temps de votre visite que vous avez regardé la vidéo : si vous prenez rendez-vous, cette information accompagne la demande.",
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
      "No account to create, no advertising profile, no data sold to anyone. The site sets audience-measurement cookies, described just below. The only place you give us personal information is when you book a call, described in the next section. If you call or write to us, we use your contact details for one thing only: getting back to you.",
  },

  rendezVous: {
    titre: "When you book a call",
    texte:
      "To book a call, we ask for your name, email and phone number and, if you like, your restaurant's name and a message. That information is used for one thing: preparing the call and following up on it. It is recorded in our calendar (Google Calendar, which sends you the invitation) and in our client follow-up tool, hosted in Canada and accessible to our two co-founders only. We attach the link that brought you to the site (a YouTube video, for instance), remembered for the duration of your visit, so we know where our clients come from. We do not sell it, rent it, or use it for advertising. We delete it on request: write to us at the address below.",
  },

  statistiques: {
    titre: "Traffic statistics",
    texte:
      "We measure traffic with two tools. Vercel Analytics produces anonymous statistics and sets no cookies. Google Analytics does set cookies, which assign your browser a random identifier, and sends that data to Google: we use it to know how many people visit the site and how they got here, never to identify you by name. You can refuse it by blocking cookies in your browser, or by installing the opt-out add-on Google publishes.",
  },

  video: {
    titre: "The video on the home page",
    texte:
      "The video on our home page is hosted by YouTube. Until you press play, it is only an image served by our own site: nothing is requested from YouTube and no cookie is set. When you start it, YouTube's player loads in privacy-enhanced mode (youtube-nocookie.com), and YouTube, meaning Google, may then collect viewing data under its own policy. On our side, we count the play in our statistics, and we remember for the duration of your visit that you watched the video: if you book a call, that information goes along with the request.",
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
