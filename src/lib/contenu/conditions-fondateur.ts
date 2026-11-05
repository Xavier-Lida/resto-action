/* LES CONDITIONS DE LA PLACE FONDATEUR, dans les deux langues.

   C'est ce que le resto accepte en cochant la case de /reserver avant de
   payer 500 $. La version (CONDITIONS_VERSION) part dans les métadonnées de la
   session Stripe : on sait ainsi quelle version chaque resto a acceptée.

   À VALIDER PAR L'AVOCAT. Le contrat de service v3.2 doit reprendre ces
   conditions mot pour mot sur les points communs (remboursement des 500 $,
   300 $ de publicité, garantie de 90 jours). Toute modification de fond :
   changer CONDITIONS_VERSION, ne jamais réécrire une version déjà acceptée
   sans la dater de nouveau.

   Les montants doivent rester identiques à `offre` et `lancement` dans
   src/lib/textes/fr.ts et en.ts. */
export const CONDITIONS_VERSION = "2026-11-05";

export const CONDITIONS_FR = {
  metaTitre: "Conditions du Grand Lancement d'hiver",
  metaDescription:
    "Ce que comprend ta place dans le Grand Lancement d'hiver : dépôt de 500 $ crédité sur la mise en service, abonnement de 200 $ par mois dès la mise en ligne, et 3 garanties sur tes résultats.",
  surTitre: "Grand Lancement d'hiver",
  titre: "Conditions du Grand Lancement d'hiver",
  intro:
    "Voici, en clair, ce que tu acceptes en réservant ta place. Resto Action est une marque de Studios LT inc. (Trois-Rivières, Québec), désignée ici par « nous ». À valider par l'avocat avant la mise en ligne.",
  sections: [
    {
      titre: "1. Ce que tu réserves",
      texte:
        "Une place dans la prochaine cohorte du Grand Lancement d'hiver (janvier 2027) pour un établissement. On lance au plus 16 restos par mois au Québec, 4 par semaine. Pour en faire partie, réserve avant le vendredi 18 décembre 2026; après, tu pars avec la cohorte suivante, un mois plus tard.",
    },
    {
      titre: "2. Le dépôt et la mise en service",
      texte:
        "Ta place est réservée avec un dépôt de 500 $ plus TPS et TVQ, payé en ligne par Stripe et crédité sur ta mise en service. La mise en service est de 750 $ pour le Grand Lancement d'hiver, puis de 1 500 $, une hausse annoncée d'avance. Ta facture, avec nos numéros de taxes, t'est envoyée par courriel. [À ÉCRIRE : conditions de remboursement du dépôt, après validation de l'avocat.]",
    },
    {
      titre: "3. Le prix, tout compris",
      texte:
        "Abonnement : 200 $ par mois, dès ta mise en ligne. Livraison : 10 % des aliments et boissons + 3,51 $ par livraison (la course au prix coûtant : ce qu'elle nous coûte, moins les 4,99 $ que paie ton client). Cueillette : 5 % + 0,30 $ par commande. Frais de carte inclus. Aucun minimum de commande. L'imprimante est offerte. Taxes en sus.",
    },
    {
      titre: "4. Les 3 garanties",
      texte:
        "48 h top chrono : « Envoie-nous ton menu, tes photos et tes accès dans les 5 jours : ton app est prête en 48 h et tu es en ligne à ta date. Sinon, ton premier mois est gratuit. » L'Imprimante qui chauffe : « Si ton app ne reçoit pas 10 commandes dans tes 7 premiers jours, on remet 100 $ de pub chaque semaine, à nos frais, jusqu'à ce que tu les aies. » Ça se paie ou c'est gratuit : « Ton app paie son abonnement chaque mois, en économies ou en nouvelles ventes. Sinon, tu ne le paies pas. » Pour les 3 garanties : tes plaques et ton affiche en place, et nos cartons dans tes sacs. La 1re demande aussi ton menu, tes photos et tes accès dans les 5 jours. Un même mois n'est jamais crédité deux fois.",
    },
    {
      titre: "5. Comment on calcule la 3e garantie",
      texte:
        "Chaque mois, on additionne ce que tu as sauvé sur les commandes venues des plateformes (au taux de ton relevé) et 10 $ par commande d'un nouveau client arrivé par un de nos canaux (pub, tournée des bureaux, parrainage, carte-cadeau, fiche Google). Si le total ne couvre pas ton abonnement, tu ne le paies pas ce mois-là.",
    },
    {
      titre: "6. Ce qui expire à la date limite",
      texte:
        "Si tu signes avant le vendredi 18 décembre 2026 : la pénalité de ton fournisseur actuel est créditée jusqu'à 400 $ sur preuve (Le Crédit de sortie), et ton abonnement de 200 $ par mois est gelé 24 mois (Ton Prix gelé).",
    },
    {
      titre: "7. Le Réglage Plateformes",
      texte:
        "On lit tes ententes et on monte tes prix de 10 à 15 % sur les plateformes dès le jour 1, si ton entente le permet. Sur Uber Eats, des prix plus hauts qu'en salle font passer la cueillette de 10 à 15 % : on le vérifie avec toi.",
    },
    {
      titre: "8. Ta clientèle t'appartient",
      texte:
        "Ta liste de clients, ton domaine et ta fiche Google sont à ton nom. Si tu pars, tu les gardes.",
    },
    {
      titre: "9. Le contrat de service",
      texte:
        "Avant la mise en ligne, tu reçois par courriel le contrat de service complet et son annexe à signer. Il reprend les conditions de cette page. Ta mise en ligne se fait seulement une fois le contrat signé.",
    },
    {
      titre: "10. Ton dossier",
      texte:
        "Après ton dépôt, tu reçois par courriel le lien de ton dossier privé : tu y vois en tout temps où en est ton app, le prochain point avec nous et ta date de lancement. On t'écrit chaque fois qu'il avance.",
    },
  ],
  questions: "Une question sur ces conditions? Écris-nous à {courriel} ou appelle-nous au {tel}.",
  version: "Version du {date}",
};

export type ConditionsFondateur = typeof CONDITIONS_FR;

export const CONDITIONS_EN: ConditionsFondateur = {
  metaTitre: "Founder spot terms",
  metaDescription:
    "What the Resto Action founder spot includes: $500 refundable until launch, no subscription while you wait, $300 in ads and a 90-day guarantee.",
  surTitre: "Founder spot",
  titre: "Founder spot terms",
  intro:
    "Here, in plain words, is what you agree to when you reserve your founder spot. Resto Action is a brand of Studios LT inc. (Trois-Rivières, Québec), referred to here as \"we\".",
  sections: [
    {
      titre: "1. What you reserve",
      texte:
        "A founder spot for one location: we prepare your web and mobile app under your name (logo, menu, photos) at the founder price, during pre-launch. Your reservation does not activate ordering.",
    },
    {
      titre: "2. The amount",
      texte:
        "$500 plus GST and QST, paid online through Stripe. This is the setup fee at the founder price (regular price: $1,000). Your invoice, with our tax numbers, is sent to you by email.",
    },
    {
      titre: "3. Pre-launch and go-live date",
      texte:
        "We are preparing the launch with two partner restaurants. Ordering, payment and billing must still be tested and validated before paid orders open. No firm date is guaranteed: your go-live date is confirmed with you after these validations.",
    },
    {
      titre: "4. No subscription while you wait",
      texte:
        "Nothing else is billed before your app goes live. At go-live: $200 per month subscription and a commission of 5% on pickup and 10% on delivery, on food and drinks, excluding taxes, tips and delivery fees. Equipment (tablet, stand, inserts): $495 at installation. Taxes and Stripe card fees extra.",
    },
    {
      titre: "5. Refund of the $500",
      texte:
        "Your $500 and the taxes paid are fully refundable on simple written request (email), at any time until your app goes live. The refund goes back to the payment method used, within 15 days of your request, with no fees withheld. Once your app is live, this setup fee is no longer refundable.",
    },
    {
      titre: "6. If the launch does not happen",
      texte:
        "If we decide not to launch the service, or if your go-live becomes impossible on our side, we refund your $500 and the taxes in full, without you having to ask.",
    },
    {
      titre: "7. Your $300 in ads",
      texte:
        "We pay for and manage $300 of Facebook and Instagram ads for your restaurant, spent over your first 3 months after go-live. This budget is not paid out in cash, credited on your invoice or carried over. If you end the service before these 3 months are up, the advertising actually spent for your restaurant up to your departure is billed to you, up to a maximum of $300, and the unspent part is cancelled, unless you leave because of a failure on our part or the 90-day guarantee is granted: then nothing is billed. A breakdown of the spending is available on request.",
    },
    {
      titre: "8. The 90-day guarantee",
      texte:
        "At the end of your first 90 days live, we calculate the fees the delivery platforms would have charged you on all actual orders placed through your app, new and redirected, at your real rates on those platforms. If that amount is lower than the subscriptions you paid us during those 90 days, we refund those subscriptions. Resto Action commissions are neither deducted from this calculation nor refunded. Conditions: stay a customer for the full 90 days and, within 7 days of go-live, make the NFC stand and inserts visible and put your app link on your Google profile and social media. No minimum sales or delivery share required. The setup fee ($500), equipment ($495) and our commissions are not covered. If you end the service before 90 days, the guarantee does not apply.",
    },
    {
      titre: "9. The service agreement",
      texte:
        "Before go-live, you receive the full service agreement and its schedule (address, delivery zone and hours) by email to sign. It carries over the terms on this page for your founder spot. Your app goes live only once the agreement is signed.",
    },
    {
      titre: "10. Your file",
      texte:
        "After your payment, you receive by email the link to your private file: it shows at any time where your app is at, your next check-in with us and your go-live date. We email you each time it moves forward.",
    },
  ],
  questions: "A question about these terms? Email us at {courriel} or call us at {tel}.",
  version: "Version of {date}",
};
