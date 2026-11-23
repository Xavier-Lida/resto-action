import type { NextRequest } from "next/server";
import { PlacesNonConfigure, chercherRestos, chercherRestosChamp } from "@/lib/places";

/* GET /api/places?q=Pizzeria du Coin&langue=fr : les fiches Google qui
   correspondent (au plus 3), pour l'aperçu automatique de « Trouve ton resto ». */
/* Avec &champ=1 : la même recherche, pour le champ « Ton resto » du Calcul
   60 secondes. Elle rend le nom, la ville et l'identifiant de lieu, sans note
   ni photos (palier moins cher). */
export const runtime = "nodejs";

// Limiteur partiel par IP, comme ailleurs : chaque recherche coûte quelques cents.
const tentatives = new Map<string, number[]>();
function tropDeTentatives(ip: string): boolean {
  const maintenant = Date.now();
  const recentes = (tentatives.get(ip) ?? []).filter((t) => maintenant - t < 10 * 60_000);
  recentes.push(maintenant);
  if (tentatives.size > 500) tentatives.clear();
  tentatives.set(ip, recentes);
  return recentes.length > 15;
}

// Le champ cherche pendant qu'on tape : il a son propre compteur, plus large.
const tentativesChamp = new Map<string, number[]>();
function tropDeTentativesChamp(ip: string): boolean {
  const maintenant = Date.now();
  const recentes = (tentativesChamp.get(ip) ?? []).filter((t) => maintenant - t < 10 * 60_000);
  recentes.push(maintenant);
  if (tentativesChamp.size > 500) tentativesChamp.clear();
  tentativesChamp.set(ip, recentes);
  return recentes.length > 30;
}

export async function GET(requete: NextRequest): Promise<Response> {
  const q = (requete.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 120);
  const langue = requete.nextUrl.searchParams.get("langue") === "en" ? "en" : "fr";
  if (q.length < 2) return Response.json({ lieux: [] });

  const champ = requete.nextUrl.searchParams.get("champ") === "1";
  const ip = requete.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
  if (champ ? tropDeTentativesChamp(ip) : tropDeTentatives(ip)) return Response.json({ erreur: "trop" }, { status: 429 });

  try {
    const lieux = champ ? await chercherRestosChamp(q) : await chercherRestos(q, langue);
    return Response.json({ lieux }, { headers: { "Cache-Control": "no-store" } });
  } catch (erreur) {
    if (erreur instanceof PlacesNonConfigure) {
      return Response.json({ erreur: "config" }, { status: 503 });
    }
    console.error("[places]", erreur instanceof Error ? erreur.message : erreur);
    return Response.json({ erreur: "google" }, { status: 502 });
  }
}
