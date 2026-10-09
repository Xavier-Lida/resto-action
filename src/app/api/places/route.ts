import type { NextRequest } from "next/server";
import { PlacesNonConfigure, chercherRestos } from "@/lib/places";

/* GET /api/places?q=Pizzeria du Coin&langue=fr : les fiches Google qui
   correspondent (au plus 3), pour l'aperçu automatique de « Trouve ton resto ». */
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

export async function GET(requete: NextRequest): Promise<Response> {
  const q = (requete.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 120);
  const langue = requete.nextUrl.searchParams.get("langue") === "en" ? "en" : "fr";
  if (q.length < 2) return Response.json({ lieux: [] });

  const ip = requete.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
  if (tropDeTentatives(ip)) return Response.json({ erreur: "trop" }, { status: 429 });

  try {
    const lieux = await chercherRestos(q, langue);
    return Response.json({ lieux }, { headers: { "Cache-Control": "no-store" } });
  } catch (erreur) {
    if (erreur instanceof PlacesNonConfigure) {
      return Response.json({ erreur: "config" }, { status: 503 });
    }
    console.error("[places]", erreur instanceof Error ? erreur.message : erreur);
    return Response.json({ erreur: "google" }, { status: 502 });
  }
}
