import { after, type NextRequest } from "next/server";
import { ErreurAgenda } from "@/lib/google/auth";
import { creerDemandeMaquette } from "@/lib/google/calendrier";
import { signalerLead } from "@/lib/leads/envoi";
import { assainirProvenance } from "@/lib/provenance";
import { pageDeLaRequete, referenceDeLaRequete } from "@/lib/references/lien";

/* LA DEMANDE DE MAQUETTE GRATUITE (« Trouve ton resto », dans le héro).

   Le resto laisse son nom, son courriel, son cell, sa ville et, s'il veut,
   le lien de son menu. On pose un bloc dans l'agenda de Guillaume à
   l'échéance des 48 h
   (voir creerDemandeMaquette), puis la demande passe par la porte unique des
   leads (signalerLead, source « contact », demande « maquette ») : la base,
   puis l'alerte [Lead] à l'équipe. Le bloc à l'agenda existe déjà quand elle
   part : elle ne fait pas attendre le resto.
   Aucun service de plus, aucun coût de plus. */
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
    courriel: texte(corps.courriel, 160).toLowerCase(),
    telephone: texte(corps.telephone, 40),
    ville: texte(corps.ville, 80),
    menu: texte(corps.menu, 300),
    // La fiche Google choisie dans l'aperçu automatique : facultative.
    lieuId: /^[A-Za-z0-9_-]{5,300}$/.test(texte(corps.lieuId, 300)) ? texte(corps.lieuId, 300) : "",
    adresse: texte(corps.adresse, 200),
    langue: corps.langue === "en" ? ("en" as const) : ("fr" as const),
    provenance: assainirProvenance(corps.provenance),
  };
  // Un cell, c'est au moins 10 chiffres : c'est là qu'on livre la maquette.
  if (
    !demande.restaurant ||
    !demande.nom ||
    !demande.ville ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(demande.courriel) ||
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

  const attribution = referenceDeLaRequete(requete);
  const page = pageDeLaRequete(requete, "/reserver");
  after(() =>
    signalerLead({
      id: corps.idLead,
      source: "contact",
      langue: demande.langue,
      contact: { nomComplet: demande.nom, cellulaire: demande.telephone, courriel: demande.courriel },
      resto: { nom: demande.restaurant, ville: demande.ville, googlePlaceId: demande.lieuId || null },
      donnees: { demande: "maquette", menu: demande.menu, adresse: demande.adresse },
      consentement: null,
      page,
      provenance: demande.provenance,
      attribution,
    }),
  );
  return Response.json({ ok: true }, { headers: SANS_CACHE });
}
