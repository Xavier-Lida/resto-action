import type { NextRequest } from "next/server";
import { CALCUL_60 } from "@/lib/contenu/grand-lancement";
import { argent, fr } from "@/lib/format";
import { signalerLead } from "@/lib/leads/envoi";
import { idValide } from "@/lib/leads/lead";
import { carnetPret, noterArrivee } from "@/lib/mini-crm/carnet";
import { assainirProvenance } from "@/lib/provenance";
import { borner60, calculer60, lienDossier60 } from "@/lib/calcul60";
import { pageDeLaRequete, referenceDeLaRequete } from "@/lib/references/lien";
import { SITE_URL } from "@/lib/site";
import { hacher } from "@/lib/studio/stockage";
import { dixChiffres, telephoneNormalise } from "@/lib/telephone";

/* LE CALCUL 60 SECONDES : « Reçois ton dossier par texto ».

   Le resto laisse son prénom, son resto (avec sa ville, et l'identifiant
   Google s'il a choisi sa fiche) et son cellulaire, et coche la case des textos
   (obligatoire : sans elle, rien ne part). La fiche garde les 3 chiffres
   entrés, la réponse et le lien de sa page de dossier. La réponse est
   RECALCULÉE ici : on ne garde pas un chiffre que le navigateur aurait pu
   changer.

   Le cellulaire s'écrit dans n'importe quel format : on le valide à 10 chiffres
   et il part dans un seul format, « (819) 555-0100 ».

   LE MINI CRM DU SITE D'ABORD (23 nov., demande de Guillaume) : la demande est
   rangée dans le mini CRM (src/lib/mini-crm/, /tableau/leads), celui du Studio
   Photo et du Classement. La fiche porte la même clé, l'empreinte du
   cellulaire : un resto qui fait le Studio puis le Calcul garde UNE fiche, avec
   son statut et sa note. Elle reçoit ses 3 chiffres, la réponse et le lien de
   son dossier : dans le tableau, « Texter » ouvre le texto du dossier déjà
   écrit. Il ne dépend ni de la base Supabase, ni du CRM de Xavier.

   LA PORTE UNIQUE DES LEADS (18 nov.) ENSUITE, À CHAQUE ENVOI : signalerLead,
   source « calcul-60 », range le lead dans la base si elle est branchée et
   envoie l'alerte [Lead] à l'équipe, avec le lien du dossier et celui de la
   fiche. Tant que le courriel n'est pas configuré, la porte écrit le lead
   entier au journal du serveur (« LEAD NON TRANSMIS ») : c'est voulu. Dans le
   lead, le cellulaire est en 10 chiffres.

   LE FORMULAIRE EST « ENVOYÉ » dès qu'UN des deux a pris la demande. Sinon on
   répond une erreur, et le formulaire le dit.

   AUCUN TEXTO NE PART D'ICI : c'est Guillaume qui écrit au resto. */
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
    return Response.json({ erreur: "invalide" }, { status: 400, headers: SANS_CACHE });
  }
  if (texte(corps.piege, 100)) return Response.json({ ok: true }, { headers: SANS_CACHE });

  const ip = requete.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
  if (tropDeTentatives(ip)) return Response.json({ erreur: "trop" }, { status: 429, headers: SANS_CACHE });

  // La case des textos est obligatoire : seul un vrai `true` vaut consentement.
  if (corps.consentementTextos !== true) {
    return Response.json({ erreur: "consentement" }, { status: 400, headers: SANS_CACHE });
  }

  const telephone = telephoneNormalise(texte(corps.cellulaire, 40));
  if (!telephone) {
    return Response.json({ erreur: "cellulaire" }, { status: 400, headers: SANS_CACHE });
  }

  const prospect = {
    nom: texte(corps.prenom, 120),
    courriel: "",
    telephone,
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
  // Un identifiant de lieu Google, et rien d'autre.
  const lieu = texte(corps.placeId, 300);
  const placeId = /^[A-Za-z0-9_-]{10,300}$/.test(lieu) ? lieu : null;

  const lienDossier = `${SITE_URL}${lienDossier60(entrees)}`;

  // 1. Le mini CRM du site : une fiche par cellulaire, la même que celle du Studio et du Classement.
  const dix = dixChiffres(telephone);
  const cle = dix ? hacher(dix) : null;
  let range = dejaRange(corps.idLead);
  if (!range && carnetPret() && cle) {
    try {
      await noterArrivee({
        cle,
        source: "calcul-60",
        prenom: prospect.nom,
        cellulaire: telephone,
        resto: prospect.restaurant,
        ville: prospect.ville,
        plateformes: "",
        commandes: "",
        // Le texte de la case vient du serveur, jamais du navigateur.
        consentementTexte: CALCUL_60.consentement,
        calcul: {
          commandes: entrees.commandes,
          panier: entrees.panier,
          taux: entrees.taux,
          parSemaine: reponse.parSemaine,
          parAnnee: reponse.parAnnee,
          lienDossier,
        },
        quoi: fr(`Dossier demandé au Calcul 60 secondes : ${argent(reponse.parAnnee)} par année`),
      });
      retenirRange(corps.idLead);
      range = true;
    } catch (erreur) {
      // Ni le lead ni la clé dans les journaux : seulement la nature de la panne.
      console.error("[calcul-60] mini CRM :", erreur instanceof Error ? erreur.name : "erreur inconnue");
    }
  }

  // 2. La porte des leads, à chaque envoi : la base si elle est branchée, et l'alerte à l'équipe.
  const resultat = await signalerLead({
    id: corps.idLead,
    source: "calcul-60",
    langue: "fr",
    contact: { prenom: prospect.nom, cellulaire: prospect.telephone },
    resto: { nom: prospect.restaurant, ville: prospect.ville, googlePlaceId: placeId },
    donnees: {
      commandes_par_semaine: entrees.commandes,
      commande_moyenne: entrees.panier,
      taux_commission: entrees.taux,
      par_semaine: reponse.parSemaine,
      par_annee: reponse.parAnnee,
      lien_dossier: lienDossier,
    },
    // Le texte de la case vient du serveur, jamais du navigateur.
    consentement: { texte: CALCUL_60.consentement, coche: true },
    page: pageDeLaRequete(requete, "/"),
    provenance,
    attribution: referenceDeLaRequete(requete),
    // Le bouton « Ouvrir la fiche » de l'alerte mène à sa fiche du mini CRM.
    ...(range && cle ? { lienFiche: `${SITE_URL}/tableau/leads#${cle}` } : {}),
  });
  // Le succès : le mini CRM OU la porte (« base » ou « courriel ») a pris la demande.
  if (!range && resultat === "echec") return Response.json({ erreur: "envoi" }, { status: 502, headers: SANS_CACHE });
  return Response.json({ ok: true }, { headers: SANS_CACHE });
}
