import type { PaireArticle } from "@/lib/contenu/blogue/types";

/* ATTENTION AUX CHIFFRES. Cet article ne cite AUCUN taux de commission.

   Ce n'est pas de la timidité : les taux varient selon la plateforme, le forfait
   et l'entente négociée, et un pourcentage écrit ici serait faux pour la moitié
   des lecteurs — sur un site qui cite Restaurants Canada en note numérotée, un
   chiffre non sourcé détonne et abîme le reste.

   L'article donne donc une MÉTHODE : le restaurateur sort ses propres relevés et
   fait le calcul avec ses vrais chiffres. C'est plus utile qu'une moyenne, et
   c'est vérifiable. Le seul exemple chiffré est explicitement présenté comme un
   exemple arithmétique, avec des nombres ronds qui ne prétendent rien. */

export const COMMISSIONS: PaireArticle = {
  fr: {
    slug: "/blogue/ce-que-coutent-les-apps-de-livraison",
    metaTitre: "Ce que te coûtent vraiment les apps de livraison",
    metaDescription:
      "La commission n'est que la partie visible. Voici comment calculer ce qu'une commande d'app te laisse pour vrai, avec tes propres chiffres, et ce que tu perds en plus de l'argent.",
    filNom: "Le coût des apps de livraison",
    titre: "Ce que te coûtent vraiment les apps de livraison",
    extrait:
      "La commission n'est que la partie visible. Le calcul complet, avec tes chiffres, et ce que tu perds en plus de l'argent.",
    publieLe: "2026-08-18",
    modifieLe: "2026-08-18",
    auteur: "guillaume",
    blocs: [
      {
        t: "p",
        texte:
          "Quand on demande à un restaurateur ce que lui coûtent les apps de livraison, il répond presque toujours par un pourcentage. C'est le chiffre qu'il a en tête, c'est celui qui est écrit dans l'entente, et c'est le plus petit des trois coûts qu'il paie.",
      },

      { t: "h2", texte: "Fais le calcul avec tes chiffres, pas avec une moyenne" },
      {
        t: "p",
        texte:
          "Les taux changent d'une plateforme à l'autre, d'un forfait à l'autre, et d'une entente à l'autre. Une moyenne trouvée en ligne ne te dit rien sur ton resto. Sors plutôt tes relevés des douze derniers mois et fais ceci.",
      },
      {
        t: "ol",
        items: [
          "**Le total encaissé par les apps** pour l'année : c'est le chiffre d'affaires brut qu'elles ont traité.",
          "**Le total qu'elles t'ont versé.** La différence entre les deux, c'est ce qu'elles ont gardé. Pas seulement la commission : les frais de traitement, les frais de service, les promotions auxquelles tu as participé.",
          "**Divise cette différence par ta marge nette habituelle.** Le résultat te donne le chiffre d'affaires qu'il t'aurait fallu faire, en salle, pour dégager la même somme.",
        ],
      },
      {
        t: "encadre",
        titre: "Un exemple d'arithmétique, pas une statistique",
        texte:
          "Des nombres ronds pour montrer la mécanique : si les apps ont gardé 20 000 $ dans l'année et que ta marge nette tourne autour de 5 %, il aurait fallu vendre 400 000 $ de plus en salle pour aboutir au même endroit. Remplace par tes vrais chiffres — c'est là que la conversation devient concrète.",
      },

      { t: "h2", texte: "Le deuxième coût : le client que tu ne connais pas" },
      {
        t: "p",
        texte:
          "Celui-là ne figure sur aucune facture, et c'est le plus cher à long terme. Quand une commande passe par une app, la personne qui a commandé ne devient pas ta cliente. Son courriel, son adresse, ce qu'elle a pris, à quelle fréquence elle revient : tout reste du côté de la plateforme.",
      },
      {
        t: "p",
        texte:
          "Concrètement, tu ne peux pas lui écrire. Tu ne peux pas savoir qu'elle a commandé quatre fois en mars et plus rien depuis. Tu ne peux pas lui offrir quoi que ce soit pour la faire revenir. Tu paies pour la servir, et tu n'as pas le droit de lui parler.",
      },
      {
        t: "p",
        texte:
          "L'application, elle, sait tout ça. Et elle s'en sert — pour lui proposer le resto d'à côté la semaine prochaine.",
      },

      { t: "h2", texte: "Le troisième coût : tes prix" },
      {
        t: "p",
        texte:
          "Beaucoup de restos montent leurs prix sur les apps pour absorber la commission. C'est logique, et ça se retourne de deux façons.",
      },
      {
        t: "ul",
        items: [
          "Le client qui compare ton menu en ligne et ton menu en salle voit deux prix. Celui qu'il retient est le plus élevé.",
          "Ton plat paraît cher à côté d'un concurrent qui n'a pas encore fait le calcul. Tu perds la commande sans jamais savoir pourquoi.",
        ],
      },

      { t: "h2", texte: "Ça ne veut pas dire qu'il faut tout fermer" },
      {
        t: "p",
        texte:
          "Les apps apportent des commandes que tu n'aurais pas eues, surtout au début, surtout dans un quartier passant. Elles font découvrir un resto à des gens qui ne l'auraient jamais cherché. Ça a une valeur, et personne de sérieux ne te dira de fermer tes comptes demain matin.",
      },
      {
        t: "p",
        texte:
          "La question n'est pas « app ou pas app ». Elle est : **quelle part de tes commandes passe par un intermédiaire qui garde ton client?** Si la réponse est « presque toutes », ton resto est locataire de sa propre clientèle.",
      },

      { t: "h2", texte: "Par où commencer" },
      {
        t: "ol",
        items: [
          "**Fais le calcul de la première section.** Un après-midi, tes relevés, une calculatrice. La plupart des restaurateurs ne l'ont jamais fait au complet.",
          "**Donne un chemin direct à tes habitués.** Ceux qui commandent chaque semaine n'ont aucune raison de passer par un intermédiaire — ils le font parce que c'est le chemin qu'on leur a montré.",
          "**Garde les adresses des clients qui commandent directement.** C'est ce qui te permet de leur reparler, et c'est exactement ce qu'aucune plateforme ne te donnera.",
        ],
      },
      {
        t: "p",
        texte:
          "Si tu veux qu'on fasse le calcul ensemble, [appelle-nous](/contact). Trente minutes, tes chiffres en main. On te dit ce qu'on voit, même quand ce qu'on voit c'est que le problème est ailleurs.",
      },
    ],
  },

  en: {
    slug: "/en/blog/what-delivery-apps-really-cost",
    metaTitre: "What delivery apps actually cost you",
    metaDescription:
      "The commission is only the visible part. Here's how to work out what an app order really leaves you, using your own numbers, and what you lose beyond the money.",
    filNom: "What delivery apps cost",
    titre: "What delivery apps actually cost you",
    extrait:
      "The commission is only the visible part. The full calculation, with your numbers, and what you lose beyond the money.",
    publieLe: "2026-08-18",
    modifieLe: "2026-08-18",
    auteur: "guillaume",
    blocs: [
      {
        t: "p",
        texte:
          "Ask a restaurant owner what delivery apps cost them and the answer is almost always a percentage. It's the number in their head, it's the one written in the agreement, and it's the smallest of the three costs they're paying.",
      },

      { t: "h2", texte: "Run the numbers with yours, not with an average" },
      {
        t: "p",
        texte:
          "Rates change from one platform to another, one plan to another, one negotiated agreement to another. An average you found online tells you nothing about your restaurant. Pull your last twelve months of statements instead and do this.",
      },
      {
        t: "ol",
        items: [
          "**The total the apps collected** for the year: that's the gross revenue they processed.",
          "**The total they paid you.** The gap between the two is what they kept. Not just commission: processing fees, service fees, the promotions you opted into.",
          "**Divide that gap by your usual net margin.** The result is the revenue you would have had to do in your dining room to end up in the same place.",
        ],
      },
      {
        t: "encadre",
        titre: "An arithmetic example, not a statistic",
        texte:
          "Round numbers to show the mechanism: if the apps kept $20,000 over the year and your net margin runs around 5%, you'd have had to sell $400,000 more in the dining room to land in the same spot. Swap in your real numbers — that's where the conversation gets concrete.",
      },

      { t: "h2", texte: "The second cost: the customer you don't know" },
      {
        t: "p",
        texte:
          "That one appears on no invoice, and it's the most expensive over time. When an order goes through an app, the person who ordered doesn't become your customer. Their email, their address, what they ordered, how often they come back: all of it stays on the platform's side.",
      },
      {
        t: "p",
        texte:
          "In practice, you can't write to them. You can't know they ordered four times in March and nothing since. You can't offer them anything to come back. You pay to serve them, and you're not allowed to talk to them.",
      },
      {
        t: "p",
        texte:
          "The app knows all of it. And it uses it — to suggest the restaurant next door to them next week.",
      },

      { t: "h2", texte: "The third cost: your prices" },
      {
        t: "p",
        texte:
          "Plenty of restaurants raise their prices on the apps to absorb the commission. It's logical, and it comes back at you two ways.",
      },
      {
        t: "ul",
        items: [
          "A customer comparing your online menu with your dining-room menu sees two prices. The one they remember is the higher one.",
          "Your dish looks expensive next to a competitor who hasn't done the math yet. You lose the order without ever knowing why.",
        ],
      },

      { t: "h2", texte: "This doesn't mean shutting it all down" },
      {
        t: "p",
        texte:
          "Apps bring orders you wouldn't have had, especially early on, especially in a busy neighbourhood. They put a restaurant in front of people who would never have looked for it. That has value, and nobody serious will tell you to close your accounts tomorrow morning.",
      },
      {
        t: "p",
        texte:
          "The question isn't “app or no app.” It's: **what share of your orders goes through a middleman who keeps your customer?** If the answer is “nearly all of them,” your restaurant is renting its own clientele.",
      },

      { t: "h2", texte: "Where to start" },
      {
        t: "ol",
        items: [
          "**Do the calculation from the first section.** One afternoon, your statements, a calculator. Most owners have never done it all the way through.",
          "**Give your regulars a direct path.** People ordering every week have no reason to go through a middleman — they do it because that's the path they were shown.",
          "**Keep the addresses of customers who order directly.** That's what lets you talk to them again, and it's exactly what no platform will hand you.",
        ],
      },
      {
        t: "p",
        texte:
          "If you want us to run the numbers with you, [give us a call](/en/contact). Thirty minutes, your figures in hand. We'll tell you what we see, even when what we see is that the problem is somewhere else.",
      },
    ],
  },
};
