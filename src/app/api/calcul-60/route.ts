import { after, type NextRequest } from "next/server";
import { signalerFondateur } from "@/lib/crm";
import { assainirProvenance } from "@/lib/provenance";
import { borner60, calculer60 } from "@/lib/calcul60";

/* LE CALCUL 60 SECONDES : « Reçois ton dossier complet par texto ».

   Le resto laisse son prénom, son resto, sa ville et son cellulaire, et coche
   la case des textos (obligatoire : sans elle, rien ne part). On répond tout de
   suite, et le CRM est prévenu après coup, par le même canal que le Dossier
   pour ton associé (étape « dossier »), avec la source « calcul-60 », les
   3 chiffres entrés et la réponse. La réponse est RECALCULÉE ici : on n'écrit
   pas dans le CRM un chiffre que le navigateur aurait pu changer.

   AUCUN TEXTO NE PART D'ICI : c'est Guillaume qui écrit au resto. Sans CRM
   configuré, rien ne part et rien n'est gardé. */
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

  // La case des textos est obligatoire : seul un vrai `true` vaut consentement.
  if (corps.consentementTextos !== true) {
    return Response.json({ erreur: "consentement" }, { status: 400, headers: SANS_CACHE });
  }

  const prospect = {
    nom: texte(corps.prenom, 120),
    courriel: "",
    telephone: texte(corps.cellulaire, 40),
    restaurant: texte(corps.resto, 120),
    ville: texte(corps.ville, 80),
    langue: "fr" as const,
  };
  if (!prospect.nom || !prospect.restaurant || !prospect.ville || !prospect.telephone) {
    return Response.json({ erreur: "invalide" }, { status: 400, headers: SANS_CACHE });
  }

  const entrees = borner60({
    commandes: Number(corps.commandes),
    panier: Number(corps.panier),
    taux: Number(corps.taux),
  });
  const reponse = calculer60(entrees);
  const provenance = assainirProvenance(corps.provenance);

  after(() =>
    signalerFondateur({
      etape: "dossier",
      source: "calcul-60",
      prospect,
      calcul: {
        commandesParSemaine: entrees.commandes,
        commandeMoyenne: entrees.panier,
        tauxCommission: entrees.taux,
        parSemaine: reponse.parSemaine,
        parAnnee: reponse.parAnnee,
        consentementTextos: true,
      },
      provenance,
    }),
  );
  return Response.json({ ok: true }, { headers: SANS_CACHE });
}
