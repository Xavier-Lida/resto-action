/* LA PROVENANCE D'UN RENDEZ-VOUS : par quel lien le visiteur est arrivé.

   Le site n'a qu'une conversion, le rendez-vous. Savoir combien de gens
   visitent ne dit pas quelle vidéo YouTube ou quel message LinkedIn a mené
   quelqu'un jusqu'à réserver. Ce module capte cette réponse à l'arrivée et
   la fait voyager jusqu'à l'événement Google Calendar.

   CE FICHIER TOURNE DES DEUX CÔTÉS : dans le navigateur (capter, lire) et sur
   le serveur (nommer, décrire). Il n'importe donc rien de `node:` ni de
   `@/lib/google`, sinon il embarquerait du code serveur dans le paquet client.

   PREMIER CONTACT, ET SEULEMENT POUR LA VISITE. La provenance se pose une
   fois, au premier chargement d'un onglet, et vit en `sessionStorage` : elle
   meurt quand l'onglet se ferme. Quelqu'un qui clique dans l'app YouTube sur
   son téléphone et réserve trois jours plus tard sur son portable est perdu,
   et c'est assumé : c'est le choix le plus sobre, et c'est ce que la
   politique de confidentialité promet. Passer à `localStorage` avec une date
   de péremption se ferait ici, en une ligne, si le besoin se confirme. */

export const CLE_PROVENANCE = "ra-provenance";

/* Les cinq UTM standard sous leur nom court, plus deux témoins du contexte :
   le domaine d'où le visiteur venait, et la page sur laquelle il a atterri.
   Les deux derniers servent quand il n'y a pas d'UTM : un lien collé dans un
   message ou une recherche Google n'en porte pas, mais le referrer parle. */
export const CHAMPS_PROVENANCE = [
  "source",
  "medium",
  "campaign",
  "content",
  "term",
  "referent",
  "page",
] as const;

export type ChampProvenance = (typeof CHAMPS_PROVENANCE)[number];
export type Provenance = Partial<Record<ChampProvenance, string>>;

const UTM: ReadonlyArray<[ChampProvenance, string]> = [
  ["source", "utm_source"],
  ["medium", "utm_medium"],
  ["campaign", "utm_campaign"],
  ["content", "utm_content"],
  ["term", "utm_term"],
];

/** Une valeur d'URL ou de stockage, propre : trimée, bornée, jamais vide. */
export const LONGUEUR_MAX = 100;

function propre(valeur: unknown): string | undefined {
  if (typeof valeur !== "string") return undefined;
  const v = valeur.trim().slice(0, LONGUEUR_MAX);
  return v || undefined;
}

/** Retire les champs vides ou inconnus ; `undefined` s'il ne reste rien. */
export function assainirProvenance(valeur: unknown): Provenance | undefined {
  if (!valeur || typeof valeur !== "object" || Array.isArray(valeur)) {
    return undefined;
  }
  const brut = valeur as Record<string, unknown>;
  const resultat: Provenance = {};
  for (const champ of CHAMPS_PROVENANCE) {
    const v = propre(brut[champ]);
    if (v) resultat[champ] = v;
  }
  return Object.keys(resultat).length > 0 ? resultat : undefined;
}

/* ─── Côté navigateur ─── */

/* Appelée une fois par chargement complet, depuis instrumentation-client.ts.

   On n'écrase une provenance déjà posée QUE si la nouvelle porte des UTM : un
   visiteur venu d'une vidéo qui recharge la page d'accueil sans paramètres
   reste « venu de la vidéo ». Sans UTM et sans rien en mémoire, on retient au
   moins d'où il venait.

   Tout est sous try/catch : en navigation privée sur Safari, `sessionStorage`
   existe mais refuse d'écrire, et une exception ici casserait l'hydratation
   de toute la page pour une information de confort. */
export function capterProvenance(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const nouvelle: Provenance = {};
    for (const [champ, cle] of UTM) {
      const v = propre(params.get(cle));
      if (v) nouvelle[champ] = v;
    }
    const avecUtm = Object.keys(nouvelle).length > 0;

    const referent = domaineReferent(document.referrer);
    if (referent) nouvelle.referent = referent;
    nouvelle.page = window.location.pathname.slice(0, LONGUEUR_MAX);

    if (!avecUtm && window.sessionStorage.getItem(CLE_PROVENANCE)) return;
    window.sessionStorage.setItem(CLE_PROVENANCE, JSON.stringify(nouvelle));
  } catch {
    // Stockage indisponible : on réserve quand même, sans provenance.
  }
}

/** Le domaine d'où on vient, sans `www.`, ou rien si c'est nous-mêmes. */
function domaineReferent(referrer: string): string | undefined {
  if (!referrer) return undefined;
  try {
    const hote = new URL(referrer).hostname.replace(/^www\./, "");
    const ici = window.location.hostname.replace(/^www\./, "");
    return hote && hote !== ici ? hote.slice(0, LONGUEUR_MAX) : undefined;
  } catch {
    return undefined;
  }
}

/** Ce qu'on joint à la réservation. `null` si rien n'a été capté. */
export function lireProvenance(): Provenance | null {
  try {
    const brut = window.sessionStorage.getItem(CLE_PROVENANCE);
    if (!brut) return null;
    return assainirProvenance(JSON.parse(brut)) ?? null;
  } catch {
    return null;
  }
}

/* ─── Des deux côtés : nommer et décrire ─── */

/* Un referrer ramené à un nom de source, pour que « youtube.com », « m.youtube.com »
   et « youtu.be » comptent ensemble. L'ordre importe : le premier motif qui
   colle gagne. Ce qui n'y figure pas garde son domaine tel quel — c'est déjà
   une réponse (« bing.com », « facebook.com »). */
const DOMAINES: ReadonlyArray<[RegExp, string]> = [
  [/(^|\.)(youtube\.com|youtu\.be)$/, "youtube"],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, "linkedin"],
  [/(^|\.)google\.[a-z.]+$/, "google"],
  [/(^|\.)(facebook\.com|fb\.com|instagram\.com)$/, "meta"],
  [/(^|\.)(tiktok\.com)$/, "tiktok"],
];

/** La source d'un rendez-vous : l'UTM, sinon le referrer, sinon « direct ». */
export function sourceDe(p: Provenance | undefined): string {
  if (!p) return "inconnue";
  if (p.source) return p.source.toLowerCase();
  if (p.referent) {
    for (const [motif, nom] of DOMAINES) {
      if (motif.test(p.referent)) return nom;
    }
    return p.referent;
  }
  return "direct";
}

/* La phrase lue par Guillaume dans l'événement. En français quelle que soit
   la langue du visiteur, comme le reste de la description. */
export function decrireProvenance(p: Provenance | undefined): string {
  if (!p) return "inconnue";
  if (p.source) {
    const parts = [p.source, p.medium, p.campaign].filter(Boolean).join(" / ");
    const video = p.content ? ` — vidéo « ${p.content} »` : "";
    const terme = p.term ? ` (terme : ${p.term})` : "";
    return `${parts}${video}${terme}`;
  }
  if (p.referent) return `inconnue (arrivé de ${p.referent})`;
  return "directe (adresse tapée ou lien sans étiquette)";
}
