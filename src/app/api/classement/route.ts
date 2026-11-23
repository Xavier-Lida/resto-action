import type { NextRequest } from "next/server";
import {
  ClassementIntrouvable,
  ClassementPlafond,
  chercherCandidats,
  etablirClassement,
} from "@/lib/classement-google";
import { PlacesNonConfigure } from "@/lib/places";

/* TON RANG SUR GOOGLE. Un seul POST, deux actions :

     « chercher » : le nom tapé → au plus 3 fiches Google, pour que le proprio
       choisisse la sienne (la recherche de « Trouve ton resto ») ;
     « classer »  : la fiche choisie → son rang parmi les restos du même type
       dans la même ville, pour le nombre d'avis Google.

   LE CLASSEMENT NE S'AFFICHE QU'À CELUI QUI CHERCHE. Tout passe en POST : rien
   dans l'adresse, donc pas de lien par resto à partager ni à indexer. La
   réponse n'est jamais mise en cache et porte « noindex ». Il n'y a pas de page
   de palmarès.

   RIEN N'EST GARDÉ : ni la recherche, ni le classement. Chaque demande
   réinterroge Google (voir src/lib/classement-google.ts), d'où la limite par
   visiteur, qui protège la facture. */
export const runtime = "nodejs";
// Jusqu'à 15 pages de résultats chez Google, les unes après les autres.
export const maxDuration = 30;

const ENTETES = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

function reponse(corps: unknown, statut = 200): Response {
  return Response.json(corps, { status: statut, headers: ENTETES });
}

function texte(valeur: unknown, max: number): string {
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

/* LA LIMITE PAR VISITEUR. Partielle, comme ailleurs sur le site : chaque
   instance a son compteur. Elle amortit un curieux ou un robot ; le vrai
   plafond de la facture est le quota par jour, dans la console Google Cloud.
     recherches de fiche : 12 par 10 minutes ;
     classements : 3 par 10 minutes ET 8 par 24 heures. */
const DIX_MINUTES = 10 * 60_000;
const UN_JOUR = 24 * 3_600_000;
const recherches = new Map<string, number[]>();
const classements = new Map<string, number[]>();

function depasse(registre: Map<string, number[]>, ip: string, limites: [duree: number, max: number][]): boolean {
  const maintenant = Date.now();
  const plusLongue = Math.max(...limites.map(([duree]) => duree));
  const recentes = (registre.get(ip) ?? []).filter((t) => maintenant - t < plusLongue);
  const trop = limites.some(([duree, max]) => recentes.filter((t) => maintenant - t < duree).length >= max);
  // Une demande refusée ne compte pas : seules celles qui partent chez Google usent la limite.
  if (!trop) recentes.push(maintenant);
  if (registre.size > 1_000) registre.clear();
  registre.set(ip, recentes);
  return trop;
}

export async function POST(requete: NextRequest): Promise<Response> {
  let corps: Record<string, unknown>;
  try {
    corps = (await requete.json()) as Record<string, unknown>;
  } catch {
    return reponse({ erreur: "invalide" }, 400);
  }
  const ip = requete.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";

  try {
    if (corps.action === "chercher") {
      const q = texte(corps.q, 120);
      if (q.length < 2) return reponse({ candidats: [] });
      if (depasse(recherches, ip, [[DIX_MINUTES, 12]])) return reponse({ erreur: "trop" }, 429);
      return reponse({ candidats: await chercherCandidats(q) });
    }

    if (corps.action === "classer") {
      const id = texte(corps.id, 300);
      const type = texte(corps.type, 60);
      const ville = texte(corps.ville, 80);
      const province = texte(corps.province, 40) || "QC";
      const lat = Number(corps.lat);
      const lng = Number(corps.lng);
      // Le navigateur ne renvoie que ce que « chercher » lui a donné ; on vérifie quand même la forme.
      if (
        !/^[A-Za-z0-9_-]{10,300}$/.test(id) ||
        !/^[a-z_]{3,60}$/.test(type) ||
        !ville ||
        !(lat > 41 && lat < 84) ||
        !(lng > -142 && lng < -52)
      ) {
        return reponse({ erreur: "invalide" }, 400);
      }
      if (depasse(classements, ip, [[DIX_MINUTES, 3], [UN_JOUR, 8]])) return reponse({ erreur: "trop" }, 429);
      return reponse({ classement: await etablirClassement({ id, type, ville, province, position: { lat, lng } }) });
    }

    return reponse({ erreur: "invalide" }, 400);
  } catch (erreur) {
    if (erreur instanceof PlacesNonConfigure) return reponse({ erreur: "config" }, 503);
    if (erreur instanceof ClassementPlafond) return reponse({ erreur: "trop" }, 429);
    if (erreur instanceof ClassementIntrouvable) return reponse({ erreur: "introuvable" }, 404);
    console.error("[classement]", erreur instanceof Error ? erreur.message : erreur);
    return reponse({ erreur: "google" }, 502);
  }
}
