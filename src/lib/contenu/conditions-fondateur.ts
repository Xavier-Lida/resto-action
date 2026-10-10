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
export const CONDITIONS_VERSION = "2026-10-10";

export const CONDITIONS_FR = {
  metaTitre: "Conditions de la place fondateur | Resto Action",
  metaDescription:
    "Ce que comprend la place fondateur Resto Action : 500 $ remboursables jusqu'à la mise en ligne, aucun abonnement pendant l'attente, 300 $ de publicité et garantie de 90 jours.",
  surTitre: "Place fondateur",
  titre: "Conditions de la place fondateur",
  intro:
    "Voici, en clair, ce que tu acceptes en réservant ta place fondateur. Resto Action est une marque de Studios LT inc. (Trois-Rivières, Québec), désignée ici par « nous ».",
  sections: [
    {
      titre: "1. Ce que tu réserves",
      texte:
        "Une place fondateur pour un établissement : on prépare ton app web et mobile à ton nom (logo, menu, photos) au tarif fondateur, pendant le pré-lancement. Ta réservation n'active pas les commandes.",
    },
    {
      titre: "2. Le montant",
      texte:
        "500 $ plus TPS et TVQ, payés en ligne par Stripe. Ce montant correspond aux frais de mise en service au prix fondateur (prix courant : 1 000 $). Ta facture, avec nos numéros de taxes, t'est envoyée par courriel.",
    },
    {
      titre: "3. Pré-lancement et date de mise en service",
      texte:
        "Nous préparons le lancement avec deux restaurants partenaires. Le parcours de commande, le paiement et la facturation doivent encore être testés et validés avant l'ouverture des commandes payantes. Aucune date ferme n'est garantie : ta date de mise en service est confirmée avec toi après ces validations.",
    },
    {
      titre: "4. Aucun abonnement pendant l'attente",
      texte:
        "Rien d'autre n'est facturé avant la mise en ligne de ton app. À la mise en ligne : abonnement de 200 $ par mois et commission de 5 % en cueillette et de 10 % en livraison, sur les aliments et boissons, hors taxes, pourboires et frais de livraison. Équipement (tablette, support, encarts) : 495 $ à l'installation. Taxes et frais de carte Stripe en sus.",
    },
    {
      titre: "5. Remboursement des 500 $",
      texte:
        "Tes 500 $ et les taxes payées sont remboursables en entier, sur simple demande écrite (courriel), en tout temps jusqu'à la mise en ligne de ton app. Le remboursement est fait sur le moyen de paiement utilisé, dans les 10 jours ouvrables suivant ta demande. Une fois ton app en ligne, ces frais de mise en service ne sont plus remboursables.",
    },
    {
      titre: "6. Si le lancement n'a pas lieu",
      texte:
        "Si nous décidons de ne pas lancer le service, ou si ta mise en service devient impossible de notre côté, on te rembourse tes 500 $ et les taxes en entier, sans que tu aies à le demander.",
    },
    {
      titre: "7. Tes 300 $ de publicité",
      texte:
        "Nous payons et gérons 300 $ de publicité Facebook et Instagram pour ton resto, dépensés sur tes 3 premiers mois après la mise en ligne. Ce budget n'est pas remis en argent, ni crédité sur ta facture, ni reporté : si tu mets fin au service avant la fin des 3 mois, la partie non dépensée est simplement annulée.",
    },
    {
      titre: "8. La garantie de 90 jours",
      texte:
        "Si, sur tes 90 premiers jours en ligne, les économies réalisées grâce à ton app ne couvrent pas ton abonnement, on te rembourse ton abonnement et nos commissions de cette période. Conditions : rester client les 90 jours complets et avoir suivi les étapes de lancement convenues avec toi à l'appel de démarrage. Le calcul se fait avec toi à la fin des 90 jours, à partir des commandes passées par ton app. La mise en service (500 $) et l'équipement (495 $) ne sont pas couverts. Si tu mets fin au service avant 90 jours, la garantie ne s'applique pas.",
    },
    {
      titre: "9. Le contrat de service",
      texte:
        "Avant la mise en ligne, tu reçois par courriel le contrat de service complet et son annexe (adresse, zone et plages de livraison) à signer. Il reprend les conditions de cette page pour ta place fondateur. Ta mise en ligne se fait seulement une fois le contrat signé.",
    },
    {
      titre: "10. Ton dossier",
      texte:
        "Après ton paiement, tu reçois par courriel le lien de ton dossier privé : tu y vois en tout temps où en est ton app, le prochain point avec nous et ta date de mise en service. On t'écrit chaque fois qu'il avance.",
    },
  ],
  questions: "Une question sur ces conditions? Écris-nous à {courriel} ou appelle-nous au {tel}.",
  version: "Version du {date}",
};

export type ConditionsFondateur = typeof CONDITIONS_FR;

export const CONDITIONS_EN: ConditionsFondateur = {
  metaTitre: "Founder spot terms | Resto Action",
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
        "Your $500 and the taxes paid are fully refundable on simple written request (email), at any time until your app goes live. The refund goes back to the payment method used, within 10 business days of your request. Once your app is live, this setup fee is no longer refundable.",
    },
    {
      titre: "6. If the launch does not happen",
      texte:
        "If we decide not to launch the service, or if your go-live becomes impossible on our side, we refund your $500 and the taxes in full, without you having to ask.",
    },
    {
      titre: "7. Your $300 in ads",
      texte:
        "We pay for and manage $300 of Facebook and Instagram ads for your restaurant, spent over your first 3 months after go-live. This budget is not paid out in cash, credited on your invoice or carried over: if you end the service before the 3 months are up, the unspent part is simply cancelled.",
    },
    {
      titre: "8. The 90-day guarantee",
      texte:
        "If, over your first 90 days live, the savings made through your app do not cover your subscription, we refund your subscription and our commissions for that period. Conditions: stay a customer for the full 90 days and follow the launch steps agreed with you at the kickoff call. The calculation is done with you at the end of the 90 days, based on orders placed through your app. The setup fee ($500) and equipment ($495) are not covered. If you end the service before 90 days, the guarantee does not apply.",
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
