import type { NextRequest } from "next/server";
import { ordinal } from "@/lib/classement";
import { CLASSEMENT, libelleTest, libelleType, reponseTestValide } from "@/lib/contenu/classement";
import { signalerLead } from "@/lib/leads/envoi";
import { idValide } from "@/lib/leads/lead";
import { carnetPret, noterArrivee } from "@/lib/mini-crm/carnet";
import { assainirProvenance } from "@/lib/provenance";
import { pageDeLaRequete, referenceDeLaRequete } from "@/lib/references/lien";
import { hacher } from "@/lib/studio/stockage";
import { dixChiffres, telephoneNormalise } from "@/lib/telephone";

/* TON RANG SUR GOOGLE : « Reçois ton classement complet par texto ».

   Le proprio laisse son prénom et son cellulaire, et coche la case des textos
   (obligatoire : sans elle, rien ne part).

   CE QUI EST GARDÉ, ET CE QUI NE L'EST PAS. Les règles de Google permettent
   de garder l'identifiant de lieu, pas ses données : le nombre d'avis et la
   note ne sont donc PAS gardés. La fiche reçoit l'identifiant de lieu et un
   lien vers la fiche Google, le nom tel que le proprio l'a tapé, sa ville, son
   type, sa réponse au test du bouton, et le rang et le total tels qu'il les a
   vus (notre calcul, dont le texto de Guillaume a besoin). Ces 2 chiffres
   viennent du navigateur : refaire le calcul ici réinterrogerait Google jusqu'à
   15 fois. Ils valent pour le jour de la demande.

   LE MINI CRM DU SITE D'ABORD (23 nov., demande de Guillaume) : la demande est
   rangée dans le mini CRM (src/lib/mini-crm/, /tableau/leads), celui du Studio
   Photo. La fiche porte la même clé, l'empreinte du cellulaire : un resto qui
   fait le Studio puis le Classement garde UNE fiche, avec son statut et sa
   note. Il ne dépend ni de la base Supabase, ni du CRM de Xavier.

   LA PORTE UNIQUE DES LEADS (18 nov.) ENSUITE, À CHAQUE ENVOI (décision du
   chef, 23 nov.) : signalerLead, source « classement », range le lead dans la
   base si elle est branchée et envoie l'alerte [Lead] à l'équipe. Tant que le
   courriel n'est pas configuré, elle écrit le lead entier au journal du
   serveur (« LEAD NON TRANSMIS ») : c'est voulu.

   LE FORMULAIRE EST « ENVOYÉ » dès qu'UN des deux a pris la demande. Sinon on
   répond une erreur, et le formulaire le dit avec notre numéro.

   L'identifiant Google est celui du lead : le Calcul et le Studio envoient le
   même.

   AUCUN TEXTO NE PART D'ICI : c'est Guillaume qui écrit au resto. */
export const runtime = "nodejs";

const SANS_CACHE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

function texte(valeur: unknown, max: number): string {
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

function refus(code: string, statut = 400): Response {
  return Response.json({ erreur: code }, { status: statut, headers: SANS_CACHE });
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

/* Un double clic ou un nouvel essai porte le même identifiant d'envoi : le
   mini CRM ne l'inscrit qu'une fois (la porte des leads a son propre filtre). */
const dejaRanges = new Map<string, number>();
function dejaRange(id: unknown): boolean {
  if (!idValide(id)) return false;
  const maintenant = Date.now();
  if (dejaRanges.size > 300) dejaRanges.clear();
  const vu = dejaRanges.get(id.toLowerCase());
  return vu !== undefined && maintenant - vu < 10 * 60_000;
}
function retenirRange(id: unknown): void {
  if (idValide(id)) dejaRanges.set(id.toLowerCase(), Date.now());
}

export async function POST(requete: NextRequest): Promise<Response> {
  let corps: Record<string, unknown>;
  try {
    corps = (await requete.json()) as Record<string, unknown>;
  } catch {
    return refus("invalide");
  }
  // Le piège à robots : on dit « c'est fait » sans rien faire.
  if (texte(corps.piege, 100)) return Response.json({ ok: true }, { headers: SANS_CACHE });

  const ip = requete.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
  if (tropDeTentatives(ip)) return refus("trop", 429);

  // La case des textos est obligatoire : seul un vrai `true` vaut consentement.
  if (corps.consentementTextos !== true) return refus("consentement");

  const prospect = {
    nom: texte(corps.prenom, 120),
    courriel: "",
    telephone: texte(corps.cellulaire, 40),
    // Le nom tel que le proprio l'a tapé dans la recherche : ses mots, pas ceux de la fiche.
    restaurant: texte(corps.resto, 120),
    ville: texte(corps.ville, 80),
    langue: "fr" as const,
  };
  const placeId = texte(corps.placeId, 300);
  const type = texte(corps.type, 60);
  if (
    !prospect.nom ||
    !prospect.restaurant ||
    !prospect.ville ||
    prospect.telephone.replace(/\D/g, "").length < 10 ||
    !/^[A-Za-z0-9_-]{10,300}$/.test(placeId) ||
    !/^[a-z_]{3,60}$/.test(type)
  ) {
    return refus("invalide");
  }

  const fiche = `https://www.google.com/maps/place/?q=place_id:${placeId}`;
  const testBouton = reponseTestValide(corps.test) ? corps.test : null;
  // Le rang et le total tels que le visiteur les a vus. Des entiers plausibles, sinon rien.
  const entier = (v: unknown) => (typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 100_000 ? v : null);
  const total = entier(corps.total);
  const rang = total !== null && entier(corps.rang) !== null && (corps.rang as number) <= total ? (corps.rang as number) : null;
  const typeLibelle = libelleType(type);

  // 1. Le mini CRM du site : une fiche par cellulaire, la même que celle du Studio.
  const dix = dixChiffres(prospect.telephone);
  const cellulaire = telephoneNormalise(prospect.telephone);
  let range = dejaRange(corps.idLead);
  if (!range && carnetPret() && dix && cellulaire) {
    try {
      await noterArrivee({
        cle: hacher(dix),
        source: "classement",
        prenom: prospect.nom,
        cellulaire,
        resto: prospect.restaurant,
        ville: prospect.ville,
        plateformes: "",
        commandes: "",
        // Le texte de la case vient du serveur, jamais du navigateur.
        consentementTexte: CLASSEMENT.consentement,
        classement: { type: typeLibelle, rang, total: rang === null ? null : total, testBouton: libelleTest(testBouton), placeId },
        quoi:
          rang !== null && total !== null
            ? `Classement Google demandé : ${ordinal(rang)} sur ${total} ${typeLibelle}`
            : `Classement Google demandé (${typeLibelle})`,
      });
      retenirRange(corps.idLead);
      range = true;
    } catch (erreur) {
      // Ni le lead ni la clé dans les journaux : seulement la nature de la panne.
      console.error("[classement] mini CRM :", erreur instanceof Error ? erreur.name : "erreur inconnue");
    }
  }

  // 2. La porte unique des leads, TOUJOURS : la base si elle est branchée, et l'alerte [Lead] à l'équipe.
  const resultat = await signalerLead({
    id: corps.idLead,
    source: "classement",
    langue: "fr",
    contact: { prenom: prospect.nom, cellulaire: prospect.telephone },
    resto: { nom: prospect.restaurant, ville: prospect.ville, googlePlaceId: placeId },
    // Le rang et le total sont notre calcul. Ni nombre d'avis ni note : ce sont les données de Google.
    donnees: { type_libelle: typeLibelle, type, rang, total: rang === null ? null : total, test_bouton: testBouton, fiche },
    // Le texte de la case vient du serveur, jamais du navigateur.
    consentement: { texte: CLASSEMENT.consentement, coche: true },
    page: pageDeLaRequete(requete, "/"),
    provenance: assainirProvenance(corps.provenance),
    attribution: referenceDeLaRequete(requete),
  });
  if (!range && resultat === "echec") return refus("envoi", 502);
  return Response.json({ ok: true }, { headers: SANS_CACHE });
}
