import { after, type NextRequest } from "next/server";
import { STUDIO_TEXTES } from "@/lib/contenu/studio";
import { signalerLead } from "@/lib/leads/envoi";
import { noterArrivee } from "@/lib/mini-crm/carnet";
import { assainirProvenance } from "@/lib/provenance";
import { pageDeLaRequete, referenceDeLaRequete } from "@/lib/references/lien";
import { SITE_URL, STUDIO } from "@/lib/site";
import { ficheDuVisiteur, frein, introuvable, ipDe, refus, SANS_CACHE, studioPret, texte } from "@/lib/studio/acces";
import { ecrireFiche, garderCommeExemple, hacher, noterCellulaire, photosDuCellulaire } from "@/lib/studio/stockage";
import { dixChiffres, telephoneNormalise } from "@/lib/telephone";

/* LE STUDIO PHOTO : « Reçois tes 2 formats en haute qualité et ta publication prête ».

   Le proprio laisse son prénom et son cellulaire, et coche la case des textos
   (obligatoire : sans elle, rien ne part). C'est cet envoi qui ouvre les
   2 formats en haute qualité et la publication.

   DEUX CHOSES, DANS CET ORDRE :
     1. LE MINI CRM DU SITE (src/lib/mini-crm/, /tableau/leads) : une fiche par
        resto, dans le magasin privé.
     2. LA PORTE UNIQUE DES LEADS (signalerLead, src/lib/leads/envoi.ts), source
        « studio », TOUJOURS : l'alerte [Lead] à Guillaume, avec les liens de
        l'originale, de la retouche et de la fiche du mini CRM.
   LE FORMULAIRE EST « ENVOYÉ » SI L'UN DES DEUX A PRIS LE CONTACT. Le mini CRM
   l'a : la porte part après la réponse, le proprio a ses photos sans attendre
   un courriel. Le mini CRM ne l'a pas : on attend la porte, et si elle échoue
   aussi, rien n'est marqué envoyé et le proprio peut réessayer. C'est ce qui
   fait qu'aucun lead ne se perd.
   Un seul courriel par lead : celui de la porte. Le courriel propre au Studio
   (src/lib/studio/courriel.ts, l'avant et l'après dans le message) n'est plus
   envoyé; son module reste en place.

   La fiche de la PHOTO ne garde que l'empreinte du cellulaire, pour compter
   les 5 photos par resto : le numéro est dans le mini CRM.

   AUCUN TEXTO NE PART D'ICI : c'est Guillaume qui écrit au resto. */
export const runtime = "nodejs";

const tropVite = frein(8);

const VERDICTS = ["oui", "non", "incertain"] as const;

export async function POST(requete: NextRequest): Promise<Response> {
  if (!studioPret()) return introuvable();

  let corps: Record<string, unknown>;
  try {
    corps = (await requete.json()) as Record<string, unknown>;
  } catch {
    return refus("invalide");
  }
  if (texte(corps.piege, 100)) return refus("invalide");
  if (tropVite(ipDe(requete))) return refus("trop", 429);

  const fiche = await ficheDuVisiteur(corps.id, corps.jeton);
  if (!fiche || fiche.etat !== "pret") return refus("invalide");

  const restantes = async (cellHache: string) =>
    Math.max(0, STUDIO.photosParResto - (await photosDuCellulaire(cellHache)));

  // Un double clic ou un rechargement : la même réponse, sans rien renvoyer.
  if (fiche.contact) {
    return Response.json(
      { ok: true, publication: fiche.publication ?? "", restantes: await restantes(fiche.contact.cellHache) },
      { headers: SANS_CACHE },
    );
  }

  // La case des textos est obligatoire : seul un vrai `true` vaut consentement.
  if (corps.consentementTextos !== true) return refus("consentement");
  const prenom = texte(corps.prenom, 120);
  const saisi = texte(corps.cellulaire, 40);
  const dix = dixChiffres(saisi);
  const cellulaire = telephoneNormalise(saisi);
  if (!prenom) return refus("prenom");
  if (!dix || !cellulaire) return refus("cellulaire");

  const cellHache = hacher(dix);
  if ((await photosDuCellulaire(cellHache)) >= STUDIO.photosParResto) return refus("limite", 429);

  const exemple = corps.consentementExemple === true;
  // Les 2 réponses facultatives : seulement des choix de la liste.
  const plateformes = (Array.isArray(corps.plateformes) ? corps.plateformes : [])
    .filter((p): p is string => typeof p === "string" && STUDIO_TEXTES.listePlateformes.includes(p))
    .join(", ");
  const commandes =
    typeof corps.commandes === "string" && STUDIO_TEXTES.listeCommandes.includes(corps.commandes) ? corps.commandes : "";

  // 1. LE MINI CRM D'ABORD. S'il ne répond pas, la porte des leads devra avoir pris le contact (plus bas).
  let range = false;
  try {
    await noterArrivee({
      cle: cellHache,
      source: "studio",
      prenom,
      cellulaire,
      resto: fiche.resto,
      ville: fiche.ville,
      plateformes,
      commandes,
      consentementTexte: STUDIO_TEXTES.consentementTextos,
      photo: fiche.id,
      exemple,
      quoi: fiche.moteur === "ia" ? "Photo retouchée par IA au Studio" : "Photo corrigée au Studio (sans génération)",
    });
    range = true;
  } catch (erreur) {
    // Ni le contact ni la clé dans les journaux : seulement la nature de la panne.
    console.error("[studio] mini CRM :", erreur instanceof Error ? erreur.name : "erreur inconnue");
  }

  const dernier = fiche.verdicts.at(-1)?.meme_plat;
  const verdict = dernier && VERDICTS.includes(dernier) ? dernier : ("sans objet" as const);
  const moteur = fiche.moteur ?? "correction";
  const lien = (vue: string) => `${SITE_URL}/api/studio/suivi/image?id=${fiche.id}&vue=${vue}`;
  const originale = lien("originale");
  const retouche = lien("vertical");
  const lieu = texte(corps.placeId, 300);
  const placeId = /^[A-Za-z0-9_-]{10,300}$/.test(lieu) ? lieu : null;
  const provenance = assainirProvenance(corps.provenance);
  const page = pageDeLaRequete(requete, "/studio");
  const attribution = referenceDeLaRequete(requete);

  /* 2. LA PORTE UNIQUE DES LEADS, TOUJOURS : c'est elle qui envoie l'alerte
     [Lead] à Guillaume (et range le lead dans la base, quand elle est branchée).

     LE SUCCÈS MONTRÉ AU PROPRIO : le mini CRM OU la porte a pris son contact.
       - Le mini CRM l'a : la porte part APRÈS la réponse. Il n'attend pas un
         courriel pour avoir ses photos, et une alerte qui ne part pas ne lui
         coûte rien.
       - Le mini CRM ne l'a pas : on ATTEND la porte. Si elle échoue aussi, il
         voit un message honnête et peut réessayer; rien n'est marqué envoyé.
     La porte écrit elle-même au journal du serveur ce qu'elle n'a pas transmis. */
  const versLaPorte = () =>
    signalerLead({
      id: corps.idLead,
      source: "studio",
      langue: "fr",
      contact: { prenom, cellulaire },
      resto: { nom: fiche.resto, ville: fiche.ville, googlePlaceId: placeId },
      donnees: {
        originale,
        retouche,
        moteur,
        verdict_controle: verdict,
        reponse_1: plateformes || null,
        reponse_2: commandes || null,
        exemple_permis: exemple,
        publication: fiche.publication ?? "",
      },
      // Le texte de la case vient du serveur, jamais du navigateur.
      consentement: { texte: STUDIO_TEXTES.consentementTextos, coche: true },
      page,
      provenance,
      attribution,
      ...(range ? { lienFiche: `${SITE_URL}/tableau/leads#${cellHache}` } : {}),
    });
  if (range) {
    after(() =>
      versLaPorte().then((resultat) => {
        if (resultat === "echec") console.error("[studio] alerte non partie pour la photo", fiche.id, "(le contact est dans le mini CRM)");
      }),
    );
  } else if ((await versLaPorte()) === "echec") {
    return refus("envoi", 502);
  }

  // 3. Le contact est pris : la fiche de la photo le note, ce qui ouvre les 2 formats.
  fiche.contact = { prenom, cellHache, exemple, envoyeLe: new Date().toISOString() };
  try {
    await Promise.all([ecrireFiche(fiche), noterCellulaire(cellHache, fiche.id)]);
  } catch (erreur) {
    console.error("[studio] contact :", erreur instanceof Error ? erreur.name : "erreur inconnue");
    return refus("panne", 503);
  }

  // 2e case cochée : l'avant et l'après sortent de la date d'effacement. Après la réponse.
  if (exemple) {
    after(() =>
      garderCommeExemple(fiche, STUDIO_TEXTES.consentementExemple).catch((erreur: unknown) =>
        console.error("[studio] suite du contact :", erreur instanceof Error ? erreur.name : "erreur inconnue"),
      ),
    );
  }

  return Response.json(
    { ok: true, publication: fiche.publication ?? "", restantes: STUDIO.photosParResto - (await photosDuCellulaire(cellHache)) },
    { headers: SANS_CACHE },
  );
}
