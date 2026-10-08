import { after, type NextRequest } from "next/server";
import { signalerFondateur } from "@/lib/crm";
import { ErreurAgenda } from "@/lib/google/auth";
import { creerDemandeMaquette } from "@/lib/google/calendrier";
import { assainirProvenance } from "@/lib/provenance";

/* LA DEMANDE DE MAQUETTE GRATUITE (« Trouve ton resto », dans le héro).

   Le resto laisse son nom, son cell, sa ville et, s'il veut, le lien de son
   menu. On pose un bloc dans l'agenda de Guillaume à l'échéance des 24 h
   (voir creerDemandeMaquette), et le CRM est prévenu après coup s'il est
   branché. Aucun service de plus, aucun coût de plus. */
export const runtime = "nodejs";

const SANS_CACHE = { "Cache-Control": "no-store" };

function texte(valeur: unknown, max: number): string {
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

function refus(code: string, statut = 400): Response {
  return Response.json({ erreur: code }, { status: statut, headers: SANS_CACHE });
}

// Même limiteur partiel que l'agenda : il amortit les robots, sans plus.
const tentatives = new Map<string, number[]>();
function tropDeTentatives(ip: string): boolean {
  const maintenant = Date.now();
  const recentes = (tentatives.get(ip) ?? []).filter((t) => maintenant - t < 10 * 60_000);
  recentes.push(maintenant);
  if (tentatives.size > 500) tentatives.clear();
  tentatives.set(ip, recentes);
  return recentes.length > 4;
}

export async function POST(requete: NextRequest): Promise<Response> {
  let corps: Record<string, unknown>;
  try {
    corps = (await requete.json()) as Record<string, unknown>;
  } catch {
    return refus("invalide");
  }
  if (texte(corps.piege, 100)) return Response.json({ ok: true }, { headers: SANS_CACHE });

  const demande = {
    restaurant: texte(corps.restaurant, 120),
    nom: texte(corps.nom, 120),
    telephone: texte(corps.telephone, 40),
    ville: texte(corps.ville, 80),
    menu: texte(corps.menu, 300),
    langue: corps.langue === "en" ? ("en" as const) : ("fr" as const),
    provenance: assainirProvenance(corps.provenance),
  };
  // Un cell, c'est au moins 10 chiffres : c'est là qu'on livre la maquette.
  if (
    !demande.restaurant ||
    !demande.nom ||
    !demande.ville ||
    demande.telephone.replace(/\D/g, "").length < 10
  ) {
    return refus("invalide");
  }

  const ip = requete.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
  if (tropDeTentatives(ip)) return refus("trop", 429);

  try {
    await creerDemandeMaquette(demande);
  } catch (erreur) {
    const config = erreur instanceof ErreurAgenda && erreur.code === "config";
    console.error("[maquette]", erreur instanceof Error ? erreur.message : erreur);
    return refus(config ? "config" : "google", config ? 503 : 502);
  }

  after(() =>
    signalerFondateur({
      etape: "maquette",
      prospect: {
        nom: demande.nom,
        courriel: "",
        telephone: demande.telephone,
        restaurant: demande.restaurant,
        ville: demande.ville,
        langue: demande.langue,
      },
      maquette: { menu: demande.menu },
      provenance: demande.provenance,
    }),
  );
  return Response.json({ ok: true }, { headers: SANS_CACHE });
}
