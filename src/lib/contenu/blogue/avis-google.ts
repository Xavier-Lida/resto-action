import type { PaireArticle } from "@/lib/contenu/blogue/types";

/* Sur les avis, une prudence particulière : Google interdit explicitement les
   avis obtenus contre une contrepartie. L'article le dit clairement plutôt que
   de suggérer un contournement — c'est la position honnête, et c'est aussi la
   seule qui protège le restaurateur, puisque la sanction retombe sur SA fiche. */

export const AVIS_GOOGLE: PaireArticle = {
  fr: {
    slug: "/blogue/avoir-plus-avis-google-restaurant",
    metaTitre: "Avoir plus d'avis Google, sans en acheter un seul",
    metaDescription:
      "Comment un resto obtient des avis Google honnêtement : le bon moment pour demander, le chemin le plus court, et pourquoi offrir un rabais en échange se retourne contre toi.",
    filNom: "Les avis Google",
    titre: "Avoir plus d'avis Google, sans en acheter un seul",
    extrait:
      "Le bon moment pour demander, le chemin le plus court, et pourquoi un rabais en échange d'un avis se retourne contre toi.",
    publieLe: "2026-08-18",
    modifieLe: "2026-08-18",
    auteur: "guillaume",
    blocs: [
      {
        t: "p",
        texte:
          "Entre deux restos qui servent la même chose au même prix, celui qui a quarante avis à 4,6 gagne contre celui qui en a six à 5,0. Le nombre compte autant que la note, et la fraîcheur compte autant que le nombre : un avis d'il y a trois ans ne rassure personne sur la cuisine de ce soir.",
      },
      {
        t: "p",
        texte:
          "La bonne nouvelle, c'est que la plupart de tes clients contents seraient prêts à en laisser un. Ils n'y pensent pas, tout simplement.",
      },

      { t: "h2", texte: "Commençons par ce qu'il ne faut pas faire" },
      {
        t: "p",
        texte:
          "Google interdit les avis obtenus contre une contrepartie. Pas seulement les faux avis achetés à l'étranger : **un dessert offert en échange d'une étoile tombe dans la même catégorie**, même quand le repas était vraiment bon et le client vraiment content.",
      },
      {
        t: "p",
        texte:
          "Les sanctions vont du retrait des avis à la suspension de la fiche. Et elles retombent sur ton resto — pas sur l'agence qui t'a suggéré l'idée.",
      },
      {
        t: "ul",
        items: [
          "Pas de rabais, de gratuité ni de tirage en échange d'un avis.",
          "Pas de filtrage : demander seulement aux clients contents et détourner les autres vers un formulaire privé est également proscrit.",
          "Pas de faux avis de la part de la famille et des amis. Google recoupe les appareils et les habitudes ; les grappes se repèrent.",
        ],
      },

      { t: "h2", texte: "Ce qui marche : demander au bon moment" },
      {
        t: "p",
        texte:
          "Le moment décide de presque tout. Quelqu'un qui vient de finir une assiette qu'il a aimée est dans la seule fenêtre où il le fera. Une heure plus tard, il est passé à autre chose.",
      },
      {
        t: "ul",
        items: [
          "**En salle, au moment de payer**, quand le service a bien été. C'est de loin ce qui fonctionne le mieux, et ça ne coûte rien.",
          "**Sur la facture ou le sac de commande**, avec un QR qui ouvre directement la fenêtre d'avis.",
          "**Par courriel après une commande en ligne**, une fois, le lendemain — jamais deux.",
        ],
      },

      { t: "h2", texte: "Raccourcis le chemin" },
      {
        t: "p",
        texte:
          "Chaque étape entre l'envie et l'avis publié fait perdre du monde. Chercher le resto dans Google, faire défiler la fiche, trouver le bouton : trois occasions d'abandonner.",
      },
      {
        t: "p",
        texte:
          "Google fournit un lien court qui ouvre la fenêtre d'avis directement, depuis ton compte Business Profile. C'est ce lien qui va sur le QR de la table, dans le courriel, sur le sac. Le geste passe de trente secondes à cinq.",
      },

      { t: "h2", texte: "Répondre, surtout aux mauvais" },
      {
        t: "p",
        texte:
          "Un futur client ne lit pas les avis pour compter les étoiles : il lit pour voir comment tu réagis quand ça va mal. Une réponse posée à un avis fâché vaut plus que dix « Merci beaucoup! » sous des avis parfaits.",
      },
      {
        t: "ol",
        items: [
          "**Remercie, sans ironie.** Le ton condescendant se lit à des kilomètres.",
          "**Reconnais le fait**, quand il est réel. « Le service a été long ce soir-là, tu as raison » désamorce plus que n'importe quelle explication.",
          "**Dis ce que tu changes**, si tu changes quelque chose.",
          "**Sors de la place publique.** Un numéro, un courriel, et la suite se règle ailleurs.",
        ],
      },
      {
        t: "encadre",
        titre: "Un avis franchement faux",
        texte:
          "Ça arrive : un client qui n'est jamais venu, un concurrent, une confusion avec un autre resto. Google permet de signaler un avis pour violation de ses règles. Le traitement est lent et le résultat incertain, mais une réponse publique et posée en attendant protège déjà ta réputation.",
      },

      { t: "h2", texte: "Ce que ça donne, honnêtement" },
      {
        t: "p",
        texte:
          "Ce n'est pas une manœuvre à faire une fois. C'est une habitude — cinq minutes par semaine pour répondre, une phrase du personnel au moment de payer. Les avis arrivent lentement, et c'est justement ce qui les rend crédibles : une fiche qui passe de six à soixante avis en un mois éveille les soupçons de Google avant ceux des clients.",
      },
      {
        t: "p",
        texte:
          "Si tu veux qu'on regarde ta fiche et qu'on te monte le lien court avec le QR, [ça se fait en trente minutes](/contact).",
      },
    ],
  },

  en: {
    slug: "/en/blog/get-more-google-reviews-restaurant",
    metaTitre: "Getting more Google reviews, without buying a single one",
    metaDescription:
      "How a restaurant earns Google reviews honestly: the right moment to ask, the shortest path, and why offering a discount in exchange backfires on you.",
    filNom: "Google reviews",
    titre: "Getting more Google reviews, without buying a single one",
    extrait:
      "The right moment to ask, the shortest path, and why a discount in exchange for a review backfires on you.",
    publieLe: "2026-08-18",
    modifieLe: "2026-08-18",
    auteur: "guillaume",
    blocs: [
      {
        t: "p",
        texte:
          "Between two restaurants serving the same thing at the same price, the one with forty reviews at 4.6 beats the one with six at 5.0. Volume counts as much as the rating, and freshness counts as much as volume: a review from three years ago reassures nobody about tonight's kitchen.",
      },
      {
        t: "p",
        texte:
          "The good news is that most of your happy customers would be glad to leave one. They simply don't think of it.",
      },

      { t: "h2", texte: "Start with what not to do" },
      {
        t: "p",
        texte:
          "Google prohibits reviews obtained in exchange for something. Not just fake reviews bought overseas: **a free dessert traded for a star falls in the same category**, even when the meal was genuinely good and the customer genuinely happy.",
      },
      {
        t: "p",
        texte:
          "Penalties range from removing the reviews to suspending the listing. And they land on your restaurant — not on the agency that suggested the idea.",
      },
      {
        t: "ul",
        items: [
          "No discounts, freebies or draws in exchange for a review.",
          "No filtering: asking only happy customers and routing the others to a private form is equally against the rules.",
          "No fake reviews from family and friends. Google cross-references devices and patterns; clusters get spotted.",
        ],
      },

      { t: "h2", texte: "What works: asking at the right moment" },
      {
        t: "p",
        texte:
          "Timing decides almost everything. Someone who has just finished a plate they enjoyed is in the only window where they'll actually do it. An hour later, they've moved on.",
      },
      {
        t: "ul",
        items: [
          "**In the dining room, at checkout**, when service went well. By far the most effective, and it costs nothing.",
          "**On the receipt or the takeout bag**, with a QR code that opens the review window directly.",
          "**By email after an online order**, once, the next day — never twice.",
        ],
      },

      { t: "h2", texte: "Shorten the path" },
      {
        t: "p",
        texte:
          "Every step between the impulse and the published review loses people. Searching for the restaurant on Google, scrolling the listing, finding the button: three chances to give up.",
      },
      {
        t: "p",
        texte:
          "Google provides a short link that opens the review window directly, from your Business Profile account. That link is what goes on the table's QR code, in the email, on the bag. The gesture drops from thirty seconds to five.",
      },

      { t: "h2", texte: "Reply, especially to the bad ones" },
      {
        t: "p",
        texte:
          "A future customer doesn't read reviews to count stars: they read to see how you react when things go wrong. One calm reply to an angry review is worth more than ten “Thanks so much!” under perfect ratings.",
      },
      {
        t: "ol",
        items: [
          "**Thank them, without irony.** A condescending tone reads from a mile away.",
          "**Acknowledge the fact** when it's real. “Service was slow that night, you're right” defuses more than any explanation.",
          "**Say what you're changing**, if you're changing something.",
          "**Get off the public square.** A number, an email, and the rest gets settled elsewhere.",
        ],
      },
      {
        t: "encadre",
        titre: "A flatly false review",
        texte:
          "It happens: a customer who never came, a competitor, a mix-up with another restaurant. Google lets you flag a review for violating its policies. Processing is slow and the outcome uncertain, but a calm public reply in the meantime already protects your reputation.",
      },

      { t: "h2", texte: "What it gives you, honestly" },
      {
        t: "p",
        texte:
          "This isn't a one-time push. It's a habit — five minutes a week to reply, one sentence from staff at checkout. Reviews arrive slowly, and that's exactly what makes them credible: a listing jumping from six to sixty reviews in a month raises Google's suspicions before it raises a customer's.",
      },
      {
        t: "p",
        texte:
          "If you'd like us to look at your listing and set up the short link with a QR code, [it takes thirty minutes](/en/contact).",
      },
    ],
  },
};
