import { after, type NextRequest } from "next/server";
import { signalerFondateur } from "@/lib/crm";
import { assainirProvenance } from "@/lib/provenance";
import type { Dossier } from "@/lib/calcul";

/* LE DOSSIER POUR TON ASSOCIÉ (après le calculateur).

   Le resto laisse son prénom, son resto, sa ville, son cell ou son courriel.
   On répond tout de suite, et le CRM est prévenu après coup avec les chiffres
   extraits de son relevé et ses hypothèses (étape « dossier »), par le même
   canal que les restos fondateurs. Sans CRM configuré, rien ne part et rien
   n'est gardé : la page du dossier s'ouvre quand même, ses chiffres voyagent
   dans son adresse. */
export const runtime = "nodejs";

const SANS_CACHE = { "Cache-Control": "no-store" };

function texte(valeur: unknown, max: number): string {
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

const tentatives = new Map<string, number[]>();
function tropDeTentatives(ip: string): boolean {
  const maintenant = Date.now();
  const recentes = (tentatives.get(ip) ?? []).filter((t) => maintenant - t < 10 * 60_000);
  recentes.push(maintenant);
  if (tentatives.size > 500) tentatives.clear();
  tentatives.set(ip, recentes);
  return recentes.length > 6;
}

export async function POST(requete: NextRequest): Promise<Response> {
  let corps: Record<string, unknown>;
  try {
    corps = (await requete.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ erreur: "invalide" }, { status: 400, headers: SANS_CACHE });
  }
  if (texte(corps.piege, 100)) return Response.json({ ok: true }, { headers: SANS_CACHE });

  const ip = requete.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
  if (tropDeTentatives(ip)) return Response.json({ erreur: "trop" }, { status: 429, headers: SANS_CACHE });

  const prospect = {
    nom: texte(corps.prenom, 120),
    courriel: texte(corps.courriel, 160).toLowerCase(),
    telephone: texte(corps.cellulaire, 40),
    restaurant: texte(corps.resto, 120),
    ville: texte(corps.ville, 80),
    langue: "fr" as const,
  };
  if (!prospect.nom || !prospect.restaurant || (!prospect.telephone && !prospect.courriel)) {
    return Response.json({ erreur: "invalide" }, { status: 400, headers: SANS_CACHE });
  }

  const dossier = corps.dossier as Dossier | undefined;
  const provenance = assainirProvenance(corps.provenance);
  after(() =>
    signalerFondateur({
      etape: "dossier",
      prospect,
      dossier: dossier ? { releve: dossier.releve, hypotheses: dossier.hypotheses, textos: corps.consentementTextos === true } : undefined,
      provenance,
    }),
  );
  return Response.json({ ok: true }, { headers: SANS_CACHE });
}
