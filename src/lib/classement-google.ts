import {
  classer,
  contient,
  decouper,
  fusionner,
  memeVille,
  rectangleAutour,
  type Point,
  type Rectangle,
  type RestoClasse,
} from "@/lib/classement";
import { requeteType, typeVoisin } from "@/lib/contenu/classement";
import { PlacesNonConfigure, villeDepuisAdresse } from "@/lib/places";

/* TON RANG SUR GOOGLE : LES APPELS À PLACES API (NEW).

   SERVEUR SEULEMENT, avec la même clé que « Trouve ton resto »
   (GOOGLE_PLACES_CLE). Trois sortes d'appels :

     1. LE CHOIX DU RESTO. La recherche de « Trouve ton resto » (même API,
        mêmes réglages : 3 fiches, restos seulement, le Québec d'abord), avec
        le type principal, la ville et la position au lieu des photos. Sans
        note ni nombre d'avis : palier Pro.
     2. LE RECTANGLE DE LA VILLE. Une recherche sur le nom de la ville. Palier
        Pro. C'est une position : la seule chose, avec l'identifiant de lieu,
        que Google permet de garder (30 jours).
     3. LES RESTOS DU MÊME TYPE. Une recherche par texte limitée à ce
        rectangle, filtrée sur le type, 20 fiches par page, 60 au plus. La note
        et le nombre d'avis sont du palier Enterprise : c'est l'appel qui coûte.
        À 60, la ville est coupée en 4 zones et les fiches sont fusionnées par
        identifiant de lieu.

   Google ne trie pas par nombre d'avis : le tri se fait chez nous
   (src/lib/classement.ts).

   CE QU'ON GARDE EN MÉMOIRE : le rectangle des villes, 30 jours. Rien d'autre.
   Aucun nom, aucune note, aucun nombre d'avis ne survit à la réponse : les
   règles de Google l'interdisent, et chaque classement est donc refait à neuf. */

const API = "https://places.googleapis.com/v1";
const DELAI_MS = 8_000;

/** Le plafond d'un classement : 15 pages de résultats (3 pour la ville, 12 pour
    ses 4 zones), plus au besoin la fiche du resto. C'est ce qui borne la
    facture d'une recherche, peu importe la taille de la ville. */
const PAGES_MAX = 15;
const PAGES_PAR_REQUETE = 3;
const FICHES_PAR_PAGE = 20;
/** Sous ce nombre, on élargit au type voisin. */
const MINIMUM = 5;

/** Le disjoncteur : au-delà, cette instance n'appelle plus Google de la
    journée. Partiel (chaque instance a son compteur) : le vrai plafond se règle
    dans la console Google Cloud, en quota par jour. */
const APPELS_MAX_PAR_JOUR = 1_500;
const compteur = { jour: "", appels: 0 };

export class ClassementPlafond extends Error {}
export class ClassementIntrouvable extends Error {}

function compter(): void {
  const jour = new Date().toISOString().slice(0, 10);
  if (compteur.jour !== jour) {
    compteur.jour = jour;
    compteur.appels = 0;
  }
  compteur.appels += 1;
  if (compteur.appels > APPELS_MAX_PAR_JOUR) throw new ClassementPlafond("plafond du jour atteint");
}

function cle(): string {
  const valeur = process.env.GOOGLE_PLACES_CLE;
  if (!valeur) throw new PlacesNonConfigure("GOOGLE_PLACES_CLE manquante");
  return valeur;
}

type LatLng = { latitude?: number; longitude?: number };
type LieuGoogle = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  primaryType?: string;
  types?: string[];
  postalAddress?: { locality?: string; administrativeArea?: string };
  location?: LatLng;
  viewport?: { low?: LatLng; high?: LatLng };
  rating?: number;
  userRatingCount?: number;
  businessStatus?: string;
  attributions?: { provider?: string }[];
};
type ReponseRecherche = { places?: LieuGoogle[]; nextPageToken?: string };

/* La ville d'une fiche : celle de son adresse postale (`postalAddress.locality`).
   Si Google ne la donne pas, on la lit dans l'adresse écrite (« …, Trois-Rivières,
   QC G8T 1A1, Canada »), comme le champ « Ton resto » le fait déjà. */
function villeDe(p: LieuGoogle): string {
  return p.postalAddress?.locality?.trim() || villeDepuisAdresse(p.formattedAddress ?? "");
}

async function rechercher(masque: string, corps: Record<string, unknown>): Promise<ReponseRecherche> {
  const valeur = cle();
  compter();
  const reponse = await fetch(`${API}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": valeur,
      // On ne demande QUE ce qui sert : le palier facturé en dépend.
      "X-Goog-FieldMask": masque,
    },
    body: JSON.stringify(corps),
    cache: "no-store",
    signal: AbortSignal.timeout(DELAI_MS),
  });
  if (!reponse.ok) throw new Error(`Places ${reponse.status} ${(await reponse.text()).slice(0, 300)}`);
  return (await reponse.json()) as ReponseRecherche;
}

// ───────────────────────── 1. Le choix du resto ─────────────────────────

export type Candidat = {
  id: string;
  nom: string;
  adresse: string;
  /** Le type principal que Google lui donne. « restaurant » s'il n'en a pas. */
  type: string;
  ville: string;
  province: string;
  lat: number;
  lng: number;
};

export async function chercherCandidats(requete: string): Promise<Candidat[]> {
  const donnees = await rechercher(
    "places.id,places.displayName,places.formattedAddress,places.primaryType,places.postalAddress,places.location",
    {
      textQuery: requete,
      includedType: "restaurant",
      languageCode: "fr",
      regionCode: "CA",
      pageSize: 3,
      // Le Québec d'abord, comme « Trouve ton resto ».
      locationBias: { circle: { center: { latitude: 46.8, longitude: -71.9 }, radius: 50_000 } },
    },
  );
  const candidats: Candidat[] = [];
  for (const p of donnees.places ?? []) {
    const ville = villeDe(p);
    const lat = p.location?.latitude;
    const lng = p.location?.longitude;
    // Sans ville ni position, pas de classement possible : on ne propose pas la fiche.
    if (!p.id || !ville || typeof lat !== "number" || typeof lng !== "number") continue;
    candidats.push({
      id: p.id,
      nom: p.displayName?.text ?? requete,
      adresse: p.formattedAddress ?? "",
      type: p.primaryType || "restaurant",
      ville,
      province: p.postalAddress?.administrativeArea?.trim() || "QC",
      lat,
      lng,
    });
  }
  return candidats;
}

// ───────────────────────── 2. Le rectangle de la ville ─────────────────────────

const TRENTE_JOURS = 30 * 24 * 3_600_000;
const rectangles = new Map<string, { quand: number; rectangle: Rectangle }>();

function versRectangle(v: LieuGoogle["viewport"]): Rectangle | null {
  const { low, high } = v ?? {};
  if (
    typeof low?.latitude !== "number" ||
    typeof low.longitude !== "number" ||
    typeof high?.latitude !== "number" ||
    typeof high.longitude !== "number"
  ) {
    return null;
  }
  return { bas: { lat: low.latitude, lng: low.longitude }, haut: { lat: high.latitude, lng: high.longitude } };
}

/* Le rectangle que Google donne à la ville sert à borner la recherche, pas à
   dire qui est dans la ville : ça, c'est la ville écrite dans l'adresse de
   chaque resto qui le dit (voir `garder`). Si Google ne donne rien d'utilisable,
   on prend 17 km autour du resto. */
async function rectangleVille(ville: string, province: string, resto: Point): Promise<Rectangle> {
  const cleCache = `${ville}|${province}`.toLowerCase();
  const deja = rectangles.get(cleCache);
  if (deja && Date.now() - deja.quand < TRENTE_JOURS && contient(deja.rectangle, resto)) return deja.rectangle;

  let rectangle: Rectangle | null = null;
  try {
    const donnees = await rechercher("places.types,places.viewport", {
      textQuery: `${ville}, ${province}, Canada`,
      languageCode: "fr",
      regionCode: "CA",
      pageSize: 3,
      locationBias: { circle: { center: { latitude: resto.lat, longitude: resto.lng }, radius: 50_000 } },
    });
    for (const p of donnees.places ?? []) {
      const r = p.types?.includes("locality") ? versRectangle(p.viewport) : null;
      if (r && contient(r, resto)) {
        rectangle = r;
        break;
      }
    }
  } catch (erreur) {
    if (erreur instanceof PlacesNonConfigure || erreur instanceof ClassementPlafond) throw erreur;
    console.error("[classement] rectangle de la ville :", erreur instanceof Error ? erreur.message : erreur);
  }
  if (!rectangle) return rectangleAutour(resto);

  if (rectangles.size > 200) rectangles.clear();
  rectangles.set(cleCache, { quand: Date.now(), rectangle });
  return rectangle;
}

// ───────────────────────── 3. Les restos du même type ─────────────────────────

const MASQUE_CONCURRENTS =
  "places.id,places.displayName,places.formattedAddress,places.primaryType,places.postalAddress,places.rating,places.userRatingCount,places.businessStatus,places.attributions,nextPageToken";

type Budget = { pages: number };
type Recolte = { lieux: LieuGoogle[]; plafonne: boolean };

/** Une requête, page par page : 20 fiches par page, 60 au plus. `plafonne` : il en restait. */
async function pages(type: string, ville: string, zone: Rectangle, budget: Budget): Promise<Recolte> {
  const corps = {
    textQuery: `${requeteType(type)} ${ville}`,
    includedType: type,
    strictTypeFiltering: true,
    languageCode: "fr",
    regionCode: "CA",
    pageSize: FICHES_PAR_PAGE,
    locationRestriction: {
      rectangle: {
        low: { latitude: zone.bas.lat, longitude: zone.bas.lng },
        high: { latitude: zone.haut.lat, longitude: zone.haut.lng },
      },
    },
  };
  const lieux: LieuGoogle[] = [];
  let jeton: string | undefined;
  for (let page = 0; page < PAGES_PAR_REQUETE; page += 1) {
    if (budget.pages <= 0) return { lieux, plafonne: true };
    budget.pages -= 1;
    const donnees = await rechercher(MASQUE_CONCURRENTS, jeton ? { ...corps, pageToken: jeton } : corps);
    lieux.push(...(donnees.places ?? []));
    jeton = donnees.nextPageToken;
    if (!jeton) return { lieux, plafonne: false };
  }
  return { lieux, plafonne: true };
}

/** Toute la ville ; si la requête plafonne, ses 4 zones, fusionnées plus loin par identifiant. */
async function recolter(type: string, ville: string, rectangle: Rectangle, budget: Budget): Promise<Recolte> {
  const entiere = await pages(type, ville, rectangle, budget);
  if (!entiere.plafonne) return entiere;
  const zones = await Promise.all(decouper(rectangle).map((zone) => pages(type, ville, zone, budget)));
  return {
    lieux: [entiere, ...zones].flatMap((z) => z.lieux),
    plafonne: zones.some((z) => z.plafonne),
  };
}

function versResto(p: LieuGoogle): RestoClasse | null {
  if (!p.id) return null;
  return {
    id: p.id,
    nom: p.displayName?.text ?? "",
    avis: typeof p.userRatingCount === "number" ? p.userRatingCount : 0,
    note: typeof p.rating === "number" ? p.rating : null,
  };
}

/** Même type PRINCIPAL, même ville, encore ouvert. */
function garder(lieux: LieuGoogle[], type: string, ville: string): RestoClasse[] {
  const gardes: RestoClasse[] = [];
  for (const p of lieux) {
    if ((p.primaryType || "restaurant") !== type) continue;
    if (!memeVille(villeDe(p), ville)) continue;
    if (p.businessStatus && p.businessStatus !== "OPERATIONAL") continue;
    const resto = versResto(p);
    if (resto) gardes.push(resto);
  }
  return gardes;
}

/** La fiche du resto lui-même, quand la recherche de sa ville ne l'a pas retourné. */
async function ficheDe(id: string): Promise<RestoClasse | null> {
  const valeur = cle();
  compter();
  const reponse = await fetch(`${API}/places/${encodeURIComponent(id)}?languageCode=fr`, {
    headers: { "X-Goog-Api-Key": valeur, "X-Goog-FieldMask": "id,displayName,rating,userRatingCount" },
    cache: "no-store",
    signal: AbortSignal.timeout(DELAI_MS),
  });
  if (reponse.status === 404 || reponse.status === 400) return null;
  if (!reponse.ok) throw new Error(`Places ${reponse.status} ${(await reponse.text()).slice(0, 300)}`);
  return versResto((await reponse.json()) as LieuGoogle);
}

// ───────────────────────── Le classement ─────────────────────────

type Ligne = { rang: number; nom: string; avis: number; note: number | null };

/** Ce qui part au navigateur : seulement ce qui s'affiche. */
export type ResultatClassement = {
  resto: string;
  rang: number;
  total: number;
  avis: number;
  note: number | null;
  devant: Ligne[];
  premiers: Ligne[];
  manque: number | null;
  avance: number | null;
  type: string;
  /** Le type voisin ajouté parce qu'on trouvait moins de 5 restos. `null` sinon. */
  voisin: string | null;
  ville: string;
  /** La liste est incomplète : l'écran l'écrit. */
  partiel: boolean;
  /** « 18 novembre 2026 », heure de Montréal. */
  date: string;
  /** Les attributions de tiers que Google demande d'afficher, s'il y en a. */
  attributions: string[];
};

const ligne = ({ rang, nom, avis, note }: Ligne): Ligne => ({ rang, nom, avis, note });

export async function etablirClassement(demande: {
  id: string;
  type: string;
  ville: string;
  province: string;
  position: Point;
}): Promise<ResultatClassement> {
  const { id, type, ville, province, position } = demande;
  const budget: Budget = { pages: PAGES_MAX };
  const rectangle = await rectangleVille(ville, province, position);

  const recolte = await recolter(type, ville, rectangle, budget);
  let partiel = recolte.plafonne;
  const bruts = [...recolte.lieux];
  let restos = garder(recolte.lieux, type, ville);

  // Le resto lui-même compte toujours, même si un filtre l'aurait écarté.
  if (!restos.some((r) => r.id === id)) {
    const brut = recolte.lieux.find((p) => p.id === id);
    const moi = brut ? versResto(brut) : await ficheDe(id);
    if (!moi) throw new ClassementIntrouvable(id);
    restos.push(moi);
    // Google n'a pas retourné ce resto dans sa propre ville : sa liste n'est pas complète.
    if (!brut) partiel = true;
  }

  let voisin: string | null = null;
  if (restos.length < MINIMUM) {
    const candidat = typeVoisin(type);
    if (candidat) {
      const elargie = await recolter(candidat, ville, rectangle, budget);
      bruts.push(...elargie.lieux);
      const avant = restos.length;
      restos = fusionner([restos, garder(elargie.lieux, candidat, ville)]);
      if (restos.length > avant) {
        voisin = candidat;
        partiel = partiel || elargie.plafonne;
      }
    }
  }

  const classement = classer(restos, id);
  if (!classement) throw new ClassementIntrouvable(id);

  const attributions = [
    ...new Set(bruts.flatMap((p) => (p.attributions ?? []).map((a) => a.provider?.trim() ?? "")).filter(Boolean)),
  ].slice(0, 5);

  return {
    resto: classement.moi.nom,
    rang: classement.rang,
    total: classement.total,
    avis: classement.moi.avis,
    note: classement.moi.note,
    devant: classement.devant.map(ligne),
    premiers: classement.premiers.map(ligne),
    manque: classement.manque,
    avance: classement.avance,
    type,
    voisin,
    ville,
    partiel,
    date: new Intl.DateTimeFormat("fr-CA", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "America/Toronto",
    }).format(new Date()),
    attributions,
  };
}
