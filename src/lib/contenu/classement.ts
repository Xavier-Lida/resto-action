import { PHONE_DISPLAY } from "../site.ts";

/* TON RANG SUR GOOGLE (18 nov.) : les textes et la table des types.

   Textes de Guillaume, mot pour mot. Les `{…}` sont remplis par le composant
   (src/components/lancement/ClassementGoogle.tsx). Le calcul du rang est dans
   src/lib/classement.ts ; les appels à Google, dans src/lib/classement-google.ts.

   CE QU'ON NE DIT JAMAIS ICI : qu'on fera monter ses avis ou son rang, et ce
   que le bouton « Commander en ligne » lui coûte. Pas de compte à rebours ni
   de compteur de places dans cette section. */
export const CLASSEMENT = {
  ancre: "rang-google",
  titre: "T'es rendu où sur Google?",
  sousTitre: "Tape le nom de ton resto. Tu vois ton rang dans ta ville, tout de suite.",

  // ── L'entrée : la recherche de « Trouve ton resto » ──
  champLibelle: "Le nom de ton resto",
  champExemple: "Trouve ton resto (ex. Casse-croûte Chez Paul)",
  boutonChercher: "Voir mon rang",
  choisir: "C'est lequel?",
  recherche: "On cherche ta fiche Google…",
  calcul: "On compte les avis des restos de ta ville…",
  introuvable: "On ne trouve pas ce resto sur Google. Vérifie le nom, ou ajoute ta ville.",
  trop: "Tu as fait plusieurs recherches. Réessaie dans quelques minutes.",
  panne: `Le classement n'est pas disponible en ce moment. Réessaie, ou appelle-nous au ${PHONE_DISPLAY}.`,
  autreResto: "Chercher un autre resto",

  // ── Ce qu'il voit ──
  /** {resto}, {rang}, {total}, {types}, {ville}. */
  phrase: "{resto} : {rang} sur {total} {types} à {ville}, pour le nombre d'avis Google.",
  /** La liste est incomplète : on l'écrit, on ne la présente jamais comme celle de toute la ville. */
  phrasePartielle:
    "{resto} : {rang} parmi les {total} premiers {types} que Google nous donne à {ville}, pour le nombre d'avis Google.",
  /** Moins de 5 restos du même type : on a élargi au type voisin, et on dit lequel. */
  elargi: "Moins de 5 {types} à {ville} : on a ajouté les {voisins}.",
  avis: "avis",
  note: "note",
  sansNote: "pas encore de note",
  toi: "toi",
  devantTitre: "Juste devant toi",
  /** {x} avis, {rang} = le rang d'en avant. */
  manque: "Il te manque {x} avis pour passer {rang}.",
  premier: "T'es premier.",
  /** S'il y a un 2e. {x} avis. */
  premierAvance: "Le 2e est à {x} avis derrière toi.",
  premiersTitre: "Les 3 premiers",
  /** La règle, toujours visible. {date}. */
  regle: "Classé selon le nombre d'avis Google, en date du {date}.",
  /** L'attribution exigée par Google : ces deux mots, jamais traduits ni coupés. */
  attribution: "Google Maps",
  gesteTitre: "Un geste à faire cette semaine",
  geste: "Réponds à tes 5 derniers avis.",

  // ── Le problème suivant ──
  test: "Fais le test : tape ton nom dans Google et clique sur Commander en ligne. Tu tombes où?",
  testReponses: [
    { id: "plateforme", libelle: "Sur une plateforme" },
    { id: "chez-moi", libelle: "Chez moi" },
    { id: "pas-de-bouton", libelle: "J'ai pas ce bouton" },
  ],

  // ── Après ──
  formulaireTitre: "Reçois ton classement complet par texto",
  champs: { prenom: "Prénom", cellulaire: "Cellulaire" },
  consentement:
    "J'accepte de recevoir des textos de Resto Action au sujet de mon classement. Je peux me désabonner en tout temps.",
  lienConfidentialite: { label: "Confidentialité", href: "/confidentialite" },
  /** Le bouton n'est jamais éteint : s'il manque quelque chose, on le dit à côté du champ. */
  boutonEnvoyer: "Envoie-moi mon classement",
  /** Textes utilitaires, pas de vente. */
  prenomManquant: "Écris ton prénom.",
  cellulaireManquant: "Écris ton cellulaire, avec l'indicatif régional.",
  caseManquante: "Coche la case pour recevoir ton classement par texto.",
  erreurEnvoi: `L'envoi n'a pas fonctionné. Réessaie, ou appelle-nous au ${PHONE_DISPLAY}.`,
  /** {prenom}. */
  apresEnvoi: "C'est noté, {prenom}! Ton classement s'en vient par texto.",
  suite:
    "La suite : les clients qui te trouvent sur Google, on les fait commander chez toi, sur ton site et ton app à ton nom. C'est là que tu fais le plus d'argent par commande, pas sur une plateforme qui garde 25 à 30 %.",
  /** Remplie avec miseEnService() (grand-lancement.ts) par la page : elle
      disparaît toute seule dès le 19 décembre à 0 h. {date}, {montant}, {ensuite}. */
  ligneMise: "Jusqu'au {date}, la mise en service est à {montant}. Après, elle double : {ensuite}.",
  boutonReserver: "Réserve ta place",
  boutonAppel: "Parle 15 minutes avec Guillaume",
} as const;

/* LE TEXTO DU MINI CRM (/tableau/leads), pour un resto qui a demandé son
   classement. À RELIRE : c'est le gabarit « Le classement » de Guillaume
   (18 nov.), avec le rang écrit en entier (« 1er », « 4e »). Le bouton
   « Texter » ouvre l'app Messages de celui qui lit, avec ce texte déjà écrit :
   RIEN NE PART TOUT SEUL. Si Guillaume écrit le sien dans
   src/lib/contenu/leads.ts (TEXTOS_LEADS.classement), c'est le sien qui sert.
   {prenom}, {resto}, {ville}, {rang}, {total} et {type} sont remplis. */
export const TEXTO_SUIVI_CLASSEMENT =
  "Salut {prenom}, c'est Guillaume de Resto Action. {resto} est {rang} sur {total} {type} à {ville}, pour le nombre d'avis Google. Réponds STOP pour ne plus recevoir de textos.";

export type ReponseTest = (typeof CLASSEMENT.testReponses)[number]["id"];

export function reponseTestValide(v: unknown): v is ReponseTest {
  return CLASSEMENT.testReponses.some((r) => r.id === v);
}

/** « plateforme » → « Sur une plateforme ». Vide s'il n'a pas répondu au test. */
export function libelleTest(v: unknown): string {
  return CLASSEMENT.testReponses.find((r) => r.id === v)?.libelle ?? "";
}

/** « {a} et {b} » → le texte rempli. Une clé absente reste telle quelle : ça se voit à la relecture. */
export function remplir(modele: string, valeurs: Record<string, string | number>): string {
  return modele.replace(/\{(\w+)\}/g, (tout, cle: string) => (cle in valeurs ? String(valeurs[cle]) : tout));
}

// ───────────────────────── La table des types ─────────────────────────

/* LE TYPE PRINCIPAL QUE GOOGLE DONNE AU RESTO (`primaryType`, Table A de Places
   API), en français d'ici.
     `pluriel` : ce qu'on écrit à l'écran (« 4e sur 31 pizzerias »).
     `requete` : le mot qu'on envoie à Google avec le nom de la ville.
     `voisin`  : le type le plus proche, ajouté quand on trouve moins de 5 restos.
   Un type absent de la table s'écrit « restos » et s'élargit à « restaurant ».
   Google ajoute des types de temps en temps (la dernière fois en février 2026) :
   la table n'a pas besoin de les suivre pour que la section fonctionne. */
type TypeResto = { pluriel: string; requete: string; voisin: string | null };

const GENERIQUE: TypeResto = { pluriel: "restos", requete: "restaurant", voisin: "restaurant" };

export const TYPES: Record<string, TypeResto> = {
  restaurant: { pluriel: "restos", requete: "restaurant", voisin: null },

  // Pizza, burgers, casse-croûtes
  pizza_restaurant: { pluriel: "pizzerias", requete: "pizzeria", voisin: "italian_restaurant" },
  pizza_delivery: { pluriel: "pizzerias en livraison", requete: "pizza livraison", voisin: "pizza_restaurant" },
  hamburger_restaurant: { pluriel: "restos de burgers", requete: "burger", voisin: "fast_food_restaurant" },
  fast_food_restaurant: { pluriel: "restos de restauration rapide", requete: "restauration rapide", voisin: "hamburger_restaurant" },
  snack_bar: { pluriel: "casse-croûtes", requete: "casse-croûte", voisin: "fast_food_restaurant" },
  diner: { pluriel: "diners", requete: "diner", voisin: "family_restaurant" },
  hot_dog_restaurant: { pluriel: "restos de hot-dogs", requete: "hot-dog", voisin: "fast_food_restaurant" },
  hot_dog_stand: { pluriel: "comptoirs à hot-dogs", requete: "hot-dog", voisin: "hot_dog_restaurant" },
  chicken_restaurant: { pluriel: "restos de poulet", requete: "poulet", voisin: "fast_food_restaurant" },
  chicken_wings_restaurant: { pluriel: "restos d'ailes de poulet", requete: "ailes de poulet", voisin: "chicken_restaurant" },
  sandwich_shop: { pluriel: "sandwicheries", requete: "sandwich", voisin: "fast_food_restaurant" },
  deli: { pluriel: "delicatessens", requete: "deli", voisin: "sandwich_shop" },
  salad_shop: { pluriel: "comptoirs à salades", requete: "salade", voisin: "sandwich_shop" },
  meal_takeaway: { pluriel: "comptoirs pour emporter", requete: "pour emporter", voisin: "fast_food_restaurant" },
  meal_delivery: { pluriel: "restos en livraison", requete: "livraison de repas", voisin: "meal_takeaway" },

  // Restos de table
  family_restaurant: { pluriel: "restos familiaux", requete: "restaurant familial", voisin: "restaurant" },
  breakfast_restaurant: { pluriel: "restos de déjeuners", requete: "déjeuner", voisin: "brunch_restaurant" },
  brunch_restaurant: { pluriel: "restos de brunchs", requete: "brunch", voisin: "breakfast_restaurant" },
  american_restaurant: { pluriel: "restos américains", requete: "restaurant américain", voisin: "hamburger_restaurant" },
  steak_house: { pluriel: "grilladeries", requete: "steakhouse", voisin: "bar_and_grill" },
  bar_and_grill: { pluriel: "resto-bars", requete: "resto-bar", voisin: "pub" },
  barbecue_restaurant: { pluriel: "restos de barbecue", requete: "barbecue", voisin: "steak_house" },
  seafood_restaurant: { pluriel: "restos de fruits de mer", requete: "fruits de mer", voisin: "restaurant" },
  fish_and_chips_restaurant: { pluriel: "restos de fish and chips", requete: "fish and chips", voisin: "seafood_restaurant" },
  fine_dining_restaurant: { pluriel: "restos gastronomiques", requete: "restaurant gastronomique", voisin: "restaurant" },
  buffet_restaurant: { pluriel: "buffets", requete: "buffet", voisin: "restaurant" },
  bistro: { pluriel: "bistros", requete: "bistro", voisin: "french_restaurant" },
  vegan_restaurant: { pluriel: "restos véganes", requete: "restaurant végane", voisin: "vegetarian_restaurant" },
  vegetarian_restaurant: { pluriel: "restos végétariens", requete: "restaurant végétarien", voisin: "vegan_restaurant" },

  // Cuisines du monde
  italian_restaurant: { pluriel: "restos italiens", requete: "restaurant italien", voisin: "pizza_restaurant" },
  french_restaurant: { pluriel: "restos français", requete: "restaurant français", voisin: "bistro" },
  greek_restaurant: { pluriel: "restos grecs", requete: "restaurant grec", voisin: "mediterranean_restaurant" },
  mediterranean_restaurant: { pluriel: "restos méditerranéens", requete: "restaurant méditerranéen", voisin: "greek_restaurant" },
  lebanese_restaurant: { pluriel: "restos libanais", requete: "restaurant libanais", voisin: "middle_eastern_restaurant" },
  middle_eastern_restaurant: { pluriel: "restos du Moyen-Orient", requete: "restaurant moyen-oriental", voisin: "lebanese_restaurant" },
  shawarma_restaurant: { pluriel: "restos de shawarma", requete: "shawarma", voisin: "lebanese_restaurant" },
  kebab_shop: { pluriel: "restos de kebabs", requete: "kebab", voisin: "shawarma_restaurant" },
  falafel_restaurant: { pluriel: "restos de falafels", requete: "falafel", voisin: "middle_eastern_restaurant" },
  turkish_restaurant: { pluriel: "restos turcs", requete: "restaurant turc", voisin: "middle_eastern_restaurant" },
  mexican_restaurant: { pluriel: "restos mexicains", requete: "restaurant mexicain", voisin: "taco_restaurant" },
  taco_restaurant: { pluriel: "restos de tacos", requete: "tacos", voisin: "mexican_restaurant" },
  burrito_restaurant: { pluriel: "restos de burritos", requete: "burrito", voisin: "mexican_restaurant" },
  chinese_restaurant: { pluriel: "restos chinois", requete: "restaurant chinois", voisin: "asian_restaurant" },
  asian_restaurant: { pluriel: "restos asiatiques", requete: "restaurant asiatique", voisin: "chinese_restaurant" },
  japanese_restaurant: { pluriel: "restos japonais", requete: "restaurant japonais", voisin: "sushi_restaurant" },
  sushi_restaurant: { pluriel: "restos de sushis", requete: "sushi", voisin: "japanese_restaurant" },
  ramen_restaurant: { pluriel: "restos de ramen", requete: "ramen", voisin: "japanese_restaurant" },
  noodle_shop: { pluriel: "restos de nouilles", requete: "nouilles", voisin: "asian_restaurant" },
  thai_restaurant: { pluriel: "restos thaïlandais", requete: "restaurant thaï", voisin: "asian_restaurant" },
  vietnamese_restaurant: { pluriel: "restos vietnamiens", requete: "restaurant vietnamien", voisin: "asian_restaurant" },
  korean_restaurant: { pluriel: "restos coréens", requete: "restaurant coréen", voisin: "asian_restaurant" },
  indian_restaurant: { pluriel: "restos indiens", requete: "restaurant indien", voisin: "asian_restaurant" },
  portuguese_restaurant: { pluriel: "restos portugais", requete: "restaurant portugais", voisin: "chicken_restaurant" },
  spanish_restaurant: { pluriel: "restos espagnols", requete: "restaurant espagnol", voisin: "mediterranean_restaurant" },
  caribbean_restaurant: { pluriel: "restos des Caraïbes", requete: "restaurant caribéen", voisin: "restaurant" },
  african_restaurant: { pluriel: "restos africains", requete: "restaurant africain", voisin: "restaurant" },

  // Cafés, desserts, bars
  cafe: { pluriel: "cafés", requete: "café", voisin: "coffee_shop" },
  coffee_shop: { pluriel: "cafés", requete: "café", voisin: "cafe" },
  tea_house: { pluriel: "salons de thé", requete: "salon de thé", voisin: "cafe" },
  bakery: { pluriel: "boulangeries", requete: "boulangerie", voisin: "pastry_shop" },
  pastry_shop: { pluriel: "pâtisseries", requete: "pâtisserie", voisin: "bakery" },
  donut_shop: { pluriel: "beigneries", requete: "beignes", voisin: "bakery" },
  bagel_shop: { pluriel: "comptoirs à bagels", requete: "bagel", voisin: "bakery" },
  dessert_shop: { pluriel: "comptoirs à desserts", requete: "dessert", voisin: "ice_cream_shop" },
  dessert_restaurant: { pluriel: "restos de desserts", requete: "dessert", voisin: "dessert_shop" },
  ice_cream_shop: { pluriel: "bars laitiers", requete: "crèmerie", voisin: "dessert_shop" },
  juice_shop: { pluriel: "bars à jus", requete: "bar à jus", voisin: "cafe" },
  pub: { pluriel: "pubs", requete: "pub", voisin: "bar_and_grill" },
  gastropub: { pluriel: "gastropubs", requete: "gastropub", voisin: "pub" },
  brewpub: { pluriel: "broue-pubs", requete: "broue-pub", voisin: "pub" },
  bar: { pluriel: "bars", requete: "bar", voisin: "pub" },
  sports_bar: { pluriel: "bars sportifs", requete: "bar sportif", voisin: "bar" },
  wine_bar: { pluriel: "bars à vin", requete: "bar à vin", voisin: "bar" },
};

function typeDe(type: string): TypeResto {
  return Object.hasOwn(TYPES, type) ? TYPES[type] : GENERIQUE;
}

/** « pizzerias », « restos de burgers »… et « restos » pour un type inconnu. */
export function libelleType(type: string): string {
  return typeDe(type).pluriel;
}

/** Le mot envoyé à Google avec la ville (« pizzeria Trois-Rivières »). */
export function requeteType(type: string): string {
  return typeDe(type).requete;
}

/** Le type le plus proche. `null` pour « restaurant », qui n'a rien de plus large. */
export function typeVoisin(type: string): string | null {
  return typeDe(type).voisin;
}

/** « pizzerias », ou « pizzerias et restos italiens » si on a élargi. */
export function libelleTypes(type: string, voisin: string | null): string {
  return voisin ? `${libelleType(type)} et ${libelleType(voisin)}` : libelleType(type);
}
