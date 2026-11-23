/* GOOGLE PLACES : LES VRAIES INFOS DU RESTO, POUR L'APERÇU AUTOMATIQUE.

   Quand un resto tape son nom dans « Trouve ton resto », on cherche sa fiche
   Google (nom, adresse, note, photos) pour lui montrer tout de suite un aperçu
   de SON app. La maquette faite à la main suit en 48 h.

   SERVEUR SEULEMENT. La clé (GOOGLE_PLACES_CLE) ne quitte jamais le serveur :
   même les photos passent par /api/places/photo, qui les relaie.

   Ce que ça coûte : une recherche « Text Search » par resto qui ouvre la
   fenêtre (quelques cents), plus une requête par photo affichée. Les résultats
   sont gardés une heure en mémoire pour ne pas repayer un même nom tapé deux
   fois. Sans clé, tout ça répond « non configuré » et la fenêtre montre
   l'exemple de Bistro Habibi à la place. */

const API = "https://places.googleapis.com/v1";
const UNE_HEURE = 3_600_000;

export type LieuResto = {
  id: string;
  nom: string;
  adresse: string;
  note: number | null;
  avis: number | null;
  /** Les noms de photos Google (places/…/photos/…), à servir par /api/places/photo. */
  photos: string[];
};

type ReponseGoogle = {
  places?: {
    id: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    rating?: number;
    userRatingCount?: number;
    photos?: { name: string }[];
  }[];
};

const cache = new Map<string, { quand: number; lieux: LieuResto[] }>();

export class PlacesNonConfigure extends Error {}

export async function chercherRestos(requete: string, langue: "fr" | "en"): Promise<LieuResto[]> {
  const cle = process.env.GOOGLE_PLACES_CLE;
  if (!cle) throw new PlacesNonConfigure("GOOGLE_PLACES_CLE manquante");

  const cleCache = `${langue}:${requete.toLowerCase()}`;
  const deja = cache.get(cleCache);
  if (deja && Date.now() - deja.quand < UNE_HEURE) return deja.lieux;

  const reponse = await fetch(`${API}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": cle,
      // On ne demande QUE ce qu'on affiche : le prix de la requête en dépend.
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.photos",
    },
    body: JSON.stringify({
      textQuery: requete,
      includedType: "restaurant",
      languageCode: langue,
      regionCode: "CA",
      pageSize: 3,
      // Le Québec d'abord : un cercle large autour du centre de la province.
      locationBias: {
        circle: { center: { latitude: 46.8, longitude: -71.9 }, radius: 50_000 },
      },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  if (!reponse.ok) {
    throw new Error(`Places ${reponse.status} ${await reponse.text()}`);
  }
  const donnees = (await reponse.json()) as ReponseGoogle;
  const lieux: LieuResto[] = (donnees.places ?? []).map((p) => ({
    id: p.id,
    nom: p.displayName?.text ?? requete,
    adresse: p.formattedAddress ?? "",
    note: p.rating ?? null,
    avis: p.userRatingCount ?? null,
    photos: (p.photos ?? []).slice(0, 4).map((ph) => ph.name),
  }));

  if (cache.size > 300) cache.clear();
  cache.set(cleCache, { quand: Date.now(), lieux });
  return lieux;
}

/* LA MÊME RECHERCHE, COMME CHAMP DE FORMULAIRE (« Ton resto », Calcul 60 secondes).

   Le resto tape son nom, choisit sa fiche : on a d'un coup le nom, la ville et
   l'identifiant de lieu. Mêmes réglages que « Trouve ton resto » (3 fiches,
   restos seulement, le Québec d'abord), mais SANS note, nombre d'avis ni
   photos : ces champs-là font passer la requête au palier le plus cher. Ici,
   c'est le palier Pro. Gardé une heure en mémoire, comme l'autre. */
export type LieuChamp = { id: string; nom: string; ville: string; adresse: string };

type ReponseChamp = {
  places?: {
    id: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    postalAddress?: { locality?: string };
  }[];
};

const cacheChamp = new Map<string, { quand: number; lieux: LieuChamp[] }>();

/** « 123 rue X, Trois-Rivières, QC G8T 1A1, Canada » → « Trois-Rivières ». Vide si l'adresse n'a pas cette forme. */
export function villeDepuisAdresse(adresse: string): string {
  const morceaux = adresse.split(",").map((m) => m.trim()).filter(Boolean);
  return morceaux.length >= 4 ? morceaux[morceaux.length - 3] : "";
}

export async function chercherRestosChamp(requete: string): Promise<LieuChamp[]> {
  const cle = process.env.GOOGLE_PLACES_CLE;
  if (!cle) throw new PlacesNonConfigure("GOOGLE_PLACES_CLE manquante");

  const cleCache = requete.toLowerCase();
  const deja = cacheChamp.get(cleCache);
  if (deja && Date.now() - deja.quand < UNE_HEURE) return deja.lieux;

  const reponse = await fetch(`${API}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": cle,
      // Rien du palier Enterprise (note, avis) : le prix de la requête en dépend.
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.postalAddress",
    },
    body: JSON.stringify({
      textQuery: requete,
      includedType: "restaurant",
      languageCode: "fr",
      regionCode: "CA",
      pageSize: 3,
      locationBias: {
        circle: { center: { latitude: 46.8, longitude: -71.9 }, radius: 50_000 },
      },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  if (!reponse.ok) {
    throw new Error(`Places ${reponse.status} ${await reponse.text()}`);
  }
  const donnees = (await reponse.json()) as ReponseChamp;
  const lieux: LieuChamp[] = (donnees.places ?? []).map((p) => {
    const adresse = p.formattedAddress ?? "";
    return {
      id: p.id,
      nom: p.displayName?.text ?? requete,
      ville: p.postalAddress?.locality?.trim() || villeDepuisAdresse(adresse),
      adresse,
    };
  });

  if (cacheChamp.size > 300) cacheChamp.clear();
  cacheChamp.set(cleCache, { quand: Date.now(), lieux });
  return lieux;
}

/** Un nom de photo Google valide, et rien d'autre : on ne relaie pas n'importe quoi. */
export function nomPhotoValide(nom: string): boolean {
  return /^places\/[A-Za-z0-9_-]{5,300}\/photos\/[A-Za-z0-9_-]{5,1000}$/.test(nom);
}

export async function lirePhoto(nom: string, largeur: number): Promise<Response> {
  const cle = process.env.GOOGLE_PLACES_CLE;
  if (!cle) throw new PlacesNonConfigure("GOOGLE_PLACES_CLE manquante");
  return fetch(`${API}/${nom}/media?maxWidthPx=${largeur}&key=${encodeURIComponent(cle)}`, {
    signal: AbortSignal.timeout(8_000),
  });
}
