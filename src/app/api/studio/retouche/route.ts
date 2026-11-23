import { after, type NextRequest } from "next/server";
import { ajouterPhoto } from "@/lib/mini-crm/carnet";
import { STUDIO } from "@/lib/site";
import { ficheDuVisiteur, frein, introuvable, ipDe, refus, SANS_CACHE, studioPret, texte } from "@/lib/studio/acces";
import { executer } from "@/lib/studio/pipeline";
import {
  ecrireFiche,
  hacher,
  noterCellulaire,
  noterVisiteur,
  nouveauJeton,
  nouvelId,
  photosDuCellulaire,
  photosDuVisiteur,
} from "@/lib/studio/stockage";
import type { Fiche } from "@/lib/studio/types";

/* LE STUDIO PHOTO : lancer une retouche (POST) et suivre où elle en est (GET).

   POST répond tout de suite, avec un identifiant et un jeton. La retouche
   tourne APRÈS la réponse (`after()`), dans la marge de temps de la fonction
   (300 secondes, bien plus que la minute promise). La page interroge GET
   toutes les 2 secondes pour sa barre de progression.

   LES LIMITES SE COMPTENT ICI, avant de dépenser quoi que ce soit :
     - par visiteur et par jour (STUDIO.photosParVisiteurParJour) ;
     - par resto, c'est-à-dire par cellulaire (STUDIO.photosParResto). Le
       cellulaire n'est connu qu'après le formulaire : la 1re photo ne compte
       donc que par visiteur. « Fais-en 4 autres » renvoie l'identifiant et le
       jeton de la photo précédente, et c'est son cellulaire qu'on compte. */
export const runtime = "nodejs";
export const maxDuration = 300;

const tropVite = frein(8);

/** Une retouche qui n'a pas bougé depuis 6 minutes ne finira pas. */
const ABANDON_MS = 6 * 60_000;

export async function POST(requete: NextRequest): Promise<Response> {
  if (!studioPret()) return introuvable();

  let corps: Record<string, unknown>;
  try {
    corps = (await requete.json()) as Record<string, unknown>;
  } catch {
    return refus("invalide");
  }
  if (texte(corps.piege, 100)) return refus("invalide");

  const ip = ipDe(requete);
  if (tropVite(ip)) return refus("trop", 429);

  const resto = texte(corps.resto, 120);
  const ville = texte(corps.ville, 80);
  const chemin = texte(corps.chemin, 200);
  if (!resto || !ville || !/^studio\/televersements\/photo[-A-Za-z0-9_]*\.(jpg|png|heic)$/.test(chemin)) {
    return refus("invalide");
  }

  const ipHache = hacher(ip);
  if ((await photosDuVisiteur(ipHache)) >= STUDIO.photosParVisiteurParJour) return refus("trop", 429);

  // « Fais-en 4 autres » : la photo précédente, déjà suivie du formulaire.
  let contact: Fiche["contact"];
  const suite = corps.suite as { id?: unknown; jeton?: unknown } | undefined;
  if (suite) {
    const precedente = await ficheDuVisiteur(suite.id, suite.jeton);
    if (!precedente?.contact) return refus("invalide");
    if ((await photosDuCellulaire(precedente.contact.cellHache)) >= STUDIO.photosParResto) return refus("limite", 429);
    // L'accord pour servir d'exemple vaut pour la photo où la case a été cochée, pas pour les suivantes.
    contact = { ...precedente.contact, exemple: false, envoyeLe: new Date().toISOString() };
  }

  const id = nouvelId();
  const jeton = nouveauJeton();
  const fiche: Fiche = {
    id,
    jetonHache: hacher(jeton),
    creeLe: new Date().toISOString(),
    resto,
    ville,
    ipHache,
    televersement: chemin,
    etat: "en-cours",
    etape: "reception",
    verdicts: [],
    essais: 0,
    contact,
  };
  try {
    await Promise.all([
      ecrireFiche(fiche),
      noterVisiteur(ipHache, id),
      contact ? noterCellulaire(contact.cellHache, id) : Promise.resolve(),
    ]);
  } catch (erreur) {
    console.error("[studio] départ :", erreur instanceof Error ? erreur.name : "erreur inconnue");
    return refus("panne", 503);
  }

  after(() => executer(id));
  // Une photo de plus pour un resto déjà connu : elle s'ajoute à sa fiche du mini CRM.
  if (contact) after(() => ajouterPhoto(contact.cellHache, id));
  return Response.json({ id, jeton }, { headers: SANS_CACHE });
}

export async function GET(requete: NextRequest): Promise<Response> {
  if (!studioPret()) return introuvable();
  const p = requete.nextUrl.searchParams;
  const fiche = await ficheDuVisiteur(p.get("id"), p.get("jeton"));
  if (!fiche) return introuvable();

  const abandonnee = fiche.etat === "en-cours" && Date.now() - Date.parse(fiche.creeLe) > ABANDON_MS;
  const contact = Boolean(fiche.contact);
  return Response.json(
    {
      etat: abandonnee ? "erreur" : fiche.etat,
      etape: fiche.etape,
      refus: fiche.refus ?? null,
      /** Vrai quand on a livré la correction sans génération : la page affiche le message prévu. */
      repli: fiche.etat === "pret" && fiche.moteur === "correction",
      contact,
      // La publication et le compte des photos restantes viennent avec les 2 formats : après le formulaire.
      publication: contact && fiche.etat === "pret" ? (fiche.publication ?? "") : null,
      restantes:
        contact && fiche.contact
          ? Math.max(0, STUDIO.photosParResto - (await photosDuCellulaire(fiche.contact.cellHache)))
          : null,
    },
    { headers: SANS_CACHE },
  );
}
