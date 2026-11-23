import { after, type NextRequest } from "next/server";
import { courrielReservation } from "@/lib/courriels-fondateur";
import { CONDITIONS_VERSION } from "@/lib/contenu/conditions-fondateur";
import { envoyerCourriel } from "@/lib/google/courriel";
import { signalerLead } from "@/lib/leads/envoi";
import { assainirProvenance } from "@/lib/provenance";
import { pageDeLaRequete, referenceDeLaRequete } from "@/lib/references/lien";
import { EN } from "@/lib/textes/en";
import { FR } from "@/lib/textes/fr";

/* LA RÉSERVATION GRATUITE (/reserver).

   Un seul POST, deux actions :
     « prospect » : l'étape 1 est remplie. On répond tout de suite, et le
       lead part après coup. Le visiteur n'attend jamais.
     « reservation » : l'étape 4. Plus aucun paiement : la place est réservée
       gratuitement, et la mise en service se paie à la signature du bon
       d'accord.

   TOUT PASSE PAR LA PORTE UNIQUE DES LEADS (signalerLead, source
   « reserve-ta-place ») : la base, puis UN courriel à l'équipe, au format
   [Lead], que la base ait répondu ou non. Le code de référence (témoin de 30
   jours) voyage avec.

   UNE RÉSERVATION NE DOIT PAS SE PERDRE. Si ni la base ni le courriel ne
   passent, le visiteur voit une erreur avec notre numéro.

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
  const commun = {
    langue,
    contact: { nomComplet: prospect.nom, cellulaire: prospect.telephone, courriel: prospect.courriel },
    resto: { nom: prospect.restaurant, ville: prospect.ville },
    page: pageDeLaRequete(requete, "/reserver"),
    provenance,
    attribution,
  } as const;

  if (corps.action === "prospect") {
    /* L'étape 1 : un lead chaud à rappeler s'il décroche avant la fin. Il part
       après la réponse, pour ne pas faire attendre le resto. Son identifiant
       n'est pas celui de l'étape 4 : ce sont 2 alertes, avec la même clé de resto. */
    after(() =>
      signalerLead({
        ...commun,
        id: corps.idProspect,
        source: "reserve-ta-place",
        precision: "étape 1",
        donnees: { etape: "prospect" },
        consentement: null,
      }),
    );
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

  /* Les textes des 2 cases viennent du serveur, jamais du navigateur : le
     formulaire n'envoie qu'un oui ou un non. */
  const t = (langue === "en" ? EN : FR).reservation;

  // La base, puis UN courriel à l'équipe au format [Lead] : le filet.
  const resultat = await signalerLead({
    ...commun,
    id: corps.idLead,
    source: "reserve-ta-place",
    donnees: {
      etape: "reservation",
      menu,
      service,
      plateformes,
      commandes,
      conditions: CONDITIONS_VERSION,
      accord_coche: true,
      accord_texte: t.offre.accord,
    },
    consentement: { texte: t.paiement.textos, coche: consentementTextos },
  });

  if (resultat === "echec") return refus("autre", 502);

  // La confirmation au resto part après la réponse : il n'attend pas Gmail.
  after(() =>
    essayerCourriel(
      () => envoyerCourriel(courrielReservation({ a: prospect.courriel, nom: prospect.nom, restaurant: prospect.restaurant, langue })),
      "de réservation",
    ),
  );
  return Response.json({ ok: true }, { headers: SANS_CACHE });
}
