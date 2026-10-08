import { after, type NextRequest } from "next/server";
import { signalerFondateur } from "@/lib/crm";
import { assainirProvenance, decrireProvenance } from "@/lib/provenance";
import { ErreurStripe, creerSessionFondateur } from "@/lib/stripe";

/* LA RÉSERVATION FONDATEUR (/reserver).

   Un seul POST, deux actions :
     « prospect » : l'étape 1 est remplie. On répond tout de suite et on
       prévient le CRM après coup. Le visiteur n'attend jamais le CRM.
     « paiement » : l'étape 4. On ouvre une session Stripe Checkout et on rend
       son adresse ; le navigateur y part. Le montant est fixé ICI, côté
       serveur : rien de ce que le navigateur envoie ne peut le changer.

   La confirmation du paiement n'arrive PAS par ici, mais par le webhook
   (/api/stripe/webhook) : un visiteur qui ferme l'onglet après avoir payé
   n'atterrit jamais sur la page de remerciement, et son paiement doit quand
   même compter. */
export const runtime = "nodejs";

const SANS_CACHE = { "Cache-Control": "no-store" };
const COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const COULEUR = /^#[0-9a-f]{6}$/i;

function texte(valeur: unknown, max: number): string {
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

function refus(code: string, statut = 400): Response {
  return Response.json({ erreur: code }, { status: statut, headers: SANS_CACHE });
}

/* Le limiteur par IP, partiel comme celui de l'agenda (chaque instance a son
   compteur). Il amortit les robots ; il ne protège pas l'argent — c'est Stripe
   qui encaisse, et une session ouverte sans paiement ne coûte rien. */
const tentatives = new Map<string, number[]>();
function tropDeTentatives(ip: string): boolean {
  const maintenant = Date.now();
  const recentes = (tentatives.get(ip) ?? []).filter((t) => maintenant - t < 10 * 60_000);
  recentes.push(maintenant);
  if (tentatives.size > 500) tentatives.clear();
  tentatives.set(ip, recentes);
  return recentes.length > 10;
}

export async function POST(requete: NextRequest): Promise<Response> {
  let corps: Record<string, unknown>;
  try {
    corps = (await requete.json()) as Record<string, unknown>;
  } catch {
    return refus("invalide");
  }

  // Le piège à robots : on dit « c'est fait » sans rien faire.
  if (texte(corps.piege, 100)) {
    return Response.json({ ok: true }, { headers: SANS_CACHE });
  }

  const ip = requete.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
  if (tropDeTentatives(ip)) return refus("trop", 429);

  const langue = corps.langue === "en" ? "en" : "fr";
  const prospect = {
    nom: texte(corps.nom, 120),
    courriel: texte(corps.courriel, 160).toLowerCase(),
    telephone: texte(corps.telephone, 40),
    restaurant: texte(corps.restaurant, 120),
    ville: texte(corps.ville, 80),
    langue,
  } as const;
  if (
    !prospect.nom ||
    !prospect.telephone ||
    !prospect.restaurant ||
    !prospect.ville ||
    !COURRIEL.test(prospect.courriel)
  ) {
    return refus("invalide");
  }
  const provenance = assainirProvenance(corps.provenance);

  if (corps.action === "prospect") {
    after(() => signalerFondateur({ etape: "prospect", prospect, provenance }));
    return Response.json({ ok: true }, { headers: SANS_CACHE });
  }

  if (corps.action !== "paiement") return refus("invalide");

  // L'étape 3 : sans l'accord sur les conditions, pas de paiement.
  if (corps.accord !== true) return refus("accord");

  const couleur = COULEUR.test(texte(corps.couleur, 7)) ? texte(corps.couleur, 7) : "#b03a2e";
  const service = corps.service === "cueillette" ? "cueillette" : "livraison+cueillette";
  const plateformes = Array.isArray(corps.plateformes)
    ? corps.plateformes.map((p) => texte(p, 30)).filter(Boolean).slice(0, 6).join(", ")
    : "";
  const commandes = texte(corps.commandes, 30);

  try {
    const session = await creerSessionFondateur(
      {
        ...prospect,
        couleur,
        service,
        plateformes,
        commandes,
        source: decrireProvenance(provenance).slice(0, 450),
      },
      new URL(requete.url).origin,
    );
    if (!session.url) throw new ErreurStripe("stripe", "session sans adresse");
    return Response.json({ url: session.url }, { headers: SANS_CACHE });
  } catch (erreur) {
    const config = erreur instanceof ErreurStripe && erreur.code === "config";
    console.error("[fondateur]", erreur instanceof Error ? erreur.message : erreur);
    return refus(config ? "config" : "stripe", config ? 503 : 502);
  }
}
