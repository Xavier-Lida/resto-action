import { after, type NextRequest } from "next/server";
import { signalerFondateur } from "@/lib/crm";
import { courrielReservation, courrielReservationEquipe } from "@/lib/courriels-fondateur";
import { CONDITIONS_VERSION } from "@/lib/contenu/conditions-fondateur";
import { envoyerCourriel } from "@/lib/google/courriel";
import { assainirProvenance, decrireProvenance } from "@/lib/provenance";
import { pageDeLaRequete, referenceDeLaRequete, referencePourCrm, signalerAttribution } from "@/lib/references/lien";

/* LA RÉSERVATION GRATUITE (/reserver).

   Un seul POST, deux actions :
     « prospect » : l'étape 1 est remplie. On répond tout de suite et on
       prévient le CRM après coup. Le visiteur n'attend jamais le CRM.
     « reservation » : l'étape 4. Plus aucun paiement : la place est réservée
       gratuitement, et la mise en service se paie à la signature du bon
       d'accord. La réservation part au CRM (comme les demandes de maquette).

   UNE RÉSERVATION NE DOIT PAS SE PERDRE. Si le CRM ne répond pas ou n'est pas
   configuré, elle part aussi par courriel à l'équipe (GOOGLE_SUJET). Si les
   deux échouent, le visiteur voit une erreur avec notre numéro.

   Le code Stripe (src/lib/stripe.ts) et le webhook restent en place : ils
   serviront à encaisser la mise en service à la signature. */
export const runtime = "nodejs";

const SANS_CACHE = { "Cache-Control": "no-store" };
const COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function texte(valeur: unknown, max: number): string {
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

function refus(code: string, statut = 400): Response {
  return Response.json({ erreur: code }, { status: statut, headers: SANS_CACHE });
}

/* Le limiteur par IP, partiel comme celui de l'agenda (chaque instance a son
   compteur). Il amortit les robots. */
const tentatives = new Map<string, number[]>();
function tropDeTentatives(ip: string): boolean {
  const maintenant = Date.now();
  const recentes = (tentatives.get(ip) ?? []).filter((t) => maintenant - t < 10 * 60_000);
  recentes.push(maintenant);
  if (tentatives.size > 500) tentatives.clear();
  tentatives.set(ip, recentes);
  return recentes.length > 10;
}

async function essayerCourriel(envoi: () => Promise<void>, quoi: string): Promise<boolean> {
  try {
    await envoi();
    return true;
  } catch (erreur) {
    console.error(`[fondateur] courriel ${quoi} refusé :`, erreur instanceof Error ? erreur.message : erreur);
    return false;
  }
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
  /* « Réfère un resto » : le témoin de 30 jours, lu ici par le serveur. Le
     formulaire n'a rien à envoyer. Un code désactivé depuis ne compte plus. */
  const attribution = referenceDeLaRequete(requete);
  const reference = referencePourCrm(attribution);

  if (corps.action === "prospect") {
    after(() => signalerFondateur({ etape: "prospect", prospect, provenance, reference }));
    return Response.json({ ok: true }, { headers: SANS_CACHE });
  }

  if (corps.action !== "reservation") return refus("invalide");

  // L'étape 3 : sans la case cochée, pas de réservation.
  if (corps.accord !== true) return refus("accord");

  const menu = texte(corps.menu, 300);
  const service = corps.service === "cueillette" ? "cueillette" : "livraison+cueillette";
  const plateformes = Array.isArray(corps.plateformes)
    ? corps.plateformes.map((p) => texte(p, 30)).filter(Boolean).slice(0, 6).join(", ")
    : "";
  const commandes = texte(corps.commandes, 30);
  // Non cochée par défaut : seul un vrai `true` vaut consentement.
  const consentementTextos = corps.textos === true;

  const recu = await signalerFondateur({
    etape: "reservation",
    prospect,
    app: { menu, service },
    qualification: { plateformes, commandes },
    reservation: { consentementTextos, conditions: CONDITIONS_VERSION },
    provenance,
    reference,
  });

  // Le filet : l'équipe reçoit la réservation par courriel, CRM ou pas.
  const equipe = await essayerCourriel(
    () =>
      envoyerCourriel(
        courrielReservationEquipe({
          ...prospect,
          menu,
          service,
          plateformes,
          commandes,
          consentementTextos,
          source: decrireProvenance(provenance),
          referePar: reference ? `${reference.nom} (code ${reference.code})` : undefined,
          crm: recu,
        }),
      ),
    "à l'équipe",
  );

  if (!recu && !equipe) return refus("autre", 502);

  /* Le journal du programme : la référence part aussi à part (CRM, sinon
     courriel REFERENCES_COURRIEL_EQUIPE). La réservation, elle, est déjà
     sauvée plus haut avec son code : rien n'attend ce deuxième envoi. */
  if (attribution) {
    after(() =>
      signalerAttribution(attribution, {
        langue,
        page: pageDeLaRequete(requete, "/reserver"),
        provenance,
        etape: "reservation",
        conditions: CONDITIONS_VERSION,
        restaurant: prospect.restaurant,
        nom: prospect.nom,
        telephone: prospect.telephone,
        courriel: prospect.courriel,
        ville: prospect.ville,
      }),
    );
  }

  // La confirmation au resto part après la réponse : il n'attend pas Gmail.
  after(() =>
    essayerCourriel(
      () => envoyerCourriel(courrielReservation({ a: prospect.courriel, nom: prospect.nom, restaurant: prospect.restaurant, langue })),
      "de réservation",
    ),
  );
  return Response.json({ ok: true }, { headers: SANS_CACHE });
}
