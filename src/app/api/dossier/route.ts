import type { NextRequest } from "next/server";
import { encoderDossier, type Dossier } from "@/lib/calcul";
import { contenuLancement } from "@/lib/contenu/lancement";
import { signalerLead } from "@/lib/leads/envoi";
import { assainirProvenance } from "@/lib/provenance";
import { pageDeLaRequete, referenceDeLaRequete } from "@/lib/references/lien";
import { SITE_URL } from "@/lib/site";

/* LE DOSSIER POUR TON ASSOCIÉ (après le calculateur).

   Le resto laisse son prénom, son resto, sa ville, son cell ou son courriel.
   Il passe par la porte unique des leads (signalerLead, source
   « dossier-releve ») : la base, avec les chiffres extraits de son relevé et
   ses hypothèses, et l'alerte [Lead] à l'équipe avec le lien de son dossier.
   Si ni l'un ni l'autre ne passe, on répond une erreur : le formulaire le dit,
   et la page du dossier s'ouvre quand même (ses chiffres voyagent dans son
   adresse). */
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
    langue: corps.langue === "en" ? ("en" as const) : ("fr" as const),
  };
  if (!prospect.nom || !prospect.restaurant || (!prospect.telephone && !prospect.courriel)) {
    return Response.json({ erreur: "invalide" }, { status: 400, headers: SANS_CACHE });
  }

  const brut = corps.dossier as Dossier | undefined;
  const dossier = brut?.releve && brut?.hypotheses ? { releve: brut.releve, hypotheses: brut.hypotheses } : undefined;
  // La case des textos est facultative ici : seul un vrai `true` vaut consentement.
  const textos = corps.consentementTextos === true;
  // Le même lien que celui qui s'ouvre pour le resto (ses chiffres sont dans l'adresse).
  const lienDossier = dossier
    ? `${SITE_URL}/dossier-associe?d=${encoderDossier({ ...dossier, prenom: prospect.nom, resto: prospect.restaurant, ville: prospect.ville })}`
    : null;

  // On attend le résultat : si rien n'est passé, le formulaire doit le dire.
  const resultat = await signalerLead({
    id: corps.idLead,
    source: "dossier-releve",
    langue: prospect.langue,
    contact: { prenom: prospect.nom, cellulaire: prospect.telephone, courriel: prospect.courriel },
    resto: { nom: prospect.restaurant, ville: prospect.ville },
    donnees: { lien_dossier: lienDossier, releve: dossier?.releve ?? null, hypotheses: dossier?.hypotheses ?? null },
    // Le texte de la case vient du serveur, jamais du navigateur.
    consentement: { texte: contenuLancement(prospect.langue).CALCULATEUR.consentementTextos, coche: textos },
    page: pageDeLaRequete(requete, "/"),
    provenance: assainirProvenance(corps.provenance),
    attribution: referenceDeLaRequete(requete),
  });
  if (resultat === "echec") return Response.json({ erreur: "envoi" }, { status: 502, headers: SANS_CACHE });
  return Response.json({ ok: true }, { headers: SANS_CACHE });
}
