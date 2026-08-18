import type { NextRequest } from "next/server";
import { HORIZON_JOURS, decouperCreneaux } from "@/lib/agenda";
import { ErreurAgenda } from "@/lib/google/auth";
import {
  creerRendezVous,
  listerFenetres,
  listerOccupations,
  rendezVousExistant,
} from "@/lib/google/calendrier";

/* LA SEULE ROUTE D'API DU SITE.

   `GET` rend les créneaux libres, `POST` en réserve un. Deux verbes dans un
   fichier plutôt que deux routes : c'est la même ressource, et la lecture est
   littéralement l'étape 2 de l'écriture (voir plus bas).

   `runtime = "nodejs"` est explicite parce que la signature du JWT passe par
   `node:crypto`. C'est déjà le défaut, mais un défaut qui change casserait ici
   sans prévenir. */
export const runtime = "nodejs";

const JOUR = 86_400_000;

async function creneauxLibres(): Promise<string[]> {
  const maintenant = Date.now();
  const debut = new Date(maintenant);
  const fin = new Date(maintenant + HORIZON_JOURS * JOUR);
  // Les deux lectures sont indépendantes : les enchaîner doublerait l'attente.
  const [fenetres, occupations] = await Promise.all([
    listerFenetres(debut, fin),
    listerOccupations(debut, fin),
  ]);
  return decouperCreneaux(fenetres, occupations, maintenant);
}

/* Une panne d'agenda n'est pas une panne de site : on répond un code que le
   composant sait traduire, et il montre le téléphone. Le détail part dans les
   journaux du serveur, jamais dans la réponse — un message d'erreur Google
   contient des identifiants de calendrier. */
function echec(erreur: unknown): Response {
  const connue = erreur instanceof ErreurAgenda;
  console.error("[agenda]", erreur);
  return Response.json(
    { erreur: connue ? erreur.code : "google" },
    { status: connue && erreur.code === "config" ? 503 : 502 },
  );
}

const SANS_CACHE = { "Cache-Control": "no-store" };

export async function GET(): Promise<Response> {
  try {
    return Response.json(
      { creneaux: await creneauxLibres() },
      { headers: SANS_CACHE },
    );
  } catch (erreur) {
    return echec(erreur);
  }
}

/* ─── L'écriture ─── */

const COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function texte(valeur: unknown, max: number): string {
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

/* Le limiteur par IP.

   IL EST PARTIEL, ET C'EST ASSUMÉ : en sans-serveur, chaque instance a son
   propre compteur, donc quelqu'un de déterminé passe entre les mailles. Ce
   n'est pas lui qui protège l'agenda — c'est la revérification du créneau, qui
   rend mathématiquement impossible de réserver deux fois la même heure, et le
   garde-fou par courriel. Celui-ci ne fait qu'amortir le bruit de fond. */
const tentatives = new Map<string, number[]>();

function tropDeTentatives(ip: string): boolean {
  const maintenant = Date.now();
  const recentes = (tentatives.get(ip) ?? []).filter(
    (t) => maintenant - t < 10 * 60_000,
  );
  recentes.push(maintenant);
  // Garde-fou mémoire : une instance qui vit longtemps ne doit pas accumuler
  // une entrée par visiteur jusqu'à la fin des temps.
  if (tentatives.size > 500) tentatives.clear();
  tentatives.set(ip, recentes);
  return recentes.length > 3;
}

function refus(code: string, statut = 400): Response {
  return Response.json({ erreur: code }, { status: statut, headers: SANS_CACHE });
}

export async function POST(requete: NextRequest): Promise<Response> {
  let corps: Record<string, unknown>;
  try {
    corps = (await requete.json()) as Record<string, unknown>;
  } catch {
    return refus("invalide");
  }

  /* 1. Le piège à robots. Le champ est invisible et hors du parcours au
     clavier : un humain ne peut pas le remplir. On répond « c'est fait » sans
     rien faire — dire au robot qu'il a été repéré, c'est lui apprendre à
     mieux s'y prendre la fois suivante. */
  if (texte(corps.piege, 100)) {
    return Response.json({ ok: true }, { headers: SANS_CACHE });
  }

  const nom = texte(corps.nom, 120);
  const courriel = texte(corps.courriel, 160).toLowerCase();
  const telephone = texte(corps.telephone, 40);
  const restaurant = texte(corps.restaurant, 120);
  const message = texte(corps.message, 1000);
  const langue = corps.langue === "en" ? "en" : "fr";
  const debut = texte(corps.debut, 40);

  if (
    !nom ||
    !telephone ||
    !COURRIEL.test(courriel) ||
    !debut ||
    Number.isNaN(Date.parse(debut))
  ) {
    return refus("invalide");
  }

  const ip =
    requete.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
  if (tropDeTentatives(ip)) return refus("trop", 429);

  try {
    /* 2. LA REVÉRIFICATION, et c'est la pièce maîtresse.

       On ne fait pas confiance au créneau envoyé : on recalcule la liste
       complète et on refuse tout ce qui n'y figure plus. Ça couvre d'un coup
       la double réservation (deux onglets ouverts sur la même heure), l'onglet
       resté ouvert depuis ce matin, la plage que Guillaume vient d'effacer, et
       toute tentative de poster une heure fabriquée à la main. La fenêtre de
       course qui reste se compte en centaines de millisecondes. */
    const libres = await creneauxLibres();
    const choisi = new Date(debut).toISOString();
    if (!libres.includes(choisi)) return refus("pris", 409);

    // 3. Un rendez-vous à venir par adresse, pas davantage.
    const horizon = new Date(Date.now() + HORIZON_JOURS * JOUR);
    if (await rendezVousExistant(courriel, horizon)) {
      return refus("double", 409);
    }

    const resultat = await creerRendezVous({
      debut: choisi,
      nom,
      courriel,
      telephone,
      restaurant,
      message,
      langue,
    });

    return Response.json({ ok: true, ...resultat }, { headers: SANS_CACHE });
  } catch (erreur) {
    return echec(erreur);
  }
}
