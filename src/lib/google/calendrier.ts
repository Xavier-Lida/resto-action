import { randomUUID } from "node:crypto";
import type { Intervalle } from "@/lib/agenda";
import { DUREE_MIN } from "@/lib/agenda";
import type { Provenance } from "@/lib/provenance";
import { decrireProvenance } from "@/lib/provenance";
import { ErreurAgenda, jetonAcces, requis } from "./auth";

/* LES QUATRE SEULS APPELS QU'ON FAIT À GOOGLE.

   Lire les plages offertes, lire ce qui occupe déjà Guillaume, poser le
   rendez-vous, et relire nos propres rendez-vous pour le tableau de bord.
   Tout le reste de l'API Calendar ne nous concerne pas.

   LE MODÈLE À DEUX CALENDRIERS, en une phrase : un calendrier secondaire
   « Resto Action — Disponibilités » DÉFINIT ce qui est offert, les calendriers
   ordinaires de Guillaume RETRANCHENT ce qui ne l'est plus. Ajouter une plage,
   c'est créer un événement ; en retirer une, c'est l'effacer ou poser un
   rendez-vous par-dessus. Rien de tout ça ne passe par le code. */

const BASE = "https://www.googleapis.com/calendar/v3";

async function appeler<T>(chemin: string, init?: RequestInit): Promise<T> {
  const jeton = await jetonAcces();
  const reponse = await fetch(`${BASE}${chemin}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${jeton}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    // Une disponibilité mise en cache est une disponibilité fausse.
    cache: "no-store",
  });
  if (!reponse.ok) {
    throw new ErreurAgenda(
      "google",
      `${init?.method ?? "GET"} ${chemin} → ${reponse.status} ${await reponse.text()}`,
    );
  }
  return (await reponse.json()) as T;
}

/** Le calendrier où atterrissent les rendez-vous. `primary` = celui de Guillaume. */
function calendrierRdv(): string {
  return process.env.GOOGLE_CAL_RDV || "primary";
}

type EvenementGoogle = {
  status?: string;
  start?: { dateTime?: string };
  end?: { dateTime?: string };
};

/* Les plages OFFERTES.

   `singleEvents=true` est indispensable : sans lui, une récurrence « Dispo,
   tous les mardis » revient comme UN seul événement portant sa règle de
   répétition, qu'il faudrait développer soi-même. Avec lui, Google rend chaque
   occurrence à sa date, décalage horaire compris.

   Les événements SUR LA JOURNÉE ENTIÈRE sont ignorés (ils ont un `date` et pas
   un `dateTime`) : « disponible toute la journée du 3 » ne dit pas à quelle
   heure, et on ne va pas décider à sa place qu'il travaille de minuit à
   minuit. Pour offrir une journée, il pose une plage horaire. */
export async function listerFenetres(
  debut: Date,
  fin: Date,
): Promise<Intervalle[]> {
  const id = requis("GOOGLE_CAL_DISPO");
  const parametres = new URLSearchParams({
    timeMin: debut.toISOString(),
    timeMax: fin.toISOString(),
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "2500",
  });
  const donnees = await appeler<{ items?: EvenementGoogle[] }>(
    `/calendars/${encodeURIComponent(id)}/events?${parametres}`,
  );
  return (donnees.items ?? [])
    .filter((e) => e.status !== "cancelled" && e.start?.dateTime && e.end?.dateTime)
    .map((e) => ({
      debut: Date.parse(e.start!.dateTime!),
      fin: Date.parse(e.end!.dateTime!),
    }));
}

/* Ce qui le RETIENT déjà.

   `freeBusy` plutôt que la liste des événements : on n'a besoin que des heures
   occupées, pas des titres. Google ne nous rend donc rien du contenu de son
   agenda — c'est la requête la moins indiscrète pour le résultat voulu. */
export async function listerOccupations(
  debut: Date,
  fin: Date,
): Promise<Intervalle[]> {
  const ids = (process.env.GOOGLE_CAL_OCCUPE || "primary")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const donnees = await appeler<{
    calendars?: Record<string, { busy?: { start: string; end: string }[] }>;
  }>("/freeBusy", {
    method: "POST",
    body: JSON.stringify({
      timeMin: debut.toISOString(),
      timeMax: fin.toISOString(),
      items: ids.map((id) => ({ id })),
    }),
  });

  const occupations: Intervalle[] = [];
  for (const calendrier of Object.values(donnees.calendars ?? {})) {
    for (const plage of calendrier.busy ?? []) {
      occupations.push({
        debut: Date.parse(plage.start),
        fin: Date.parse(plage.end),
      });
    }
  }
  return occupations;
}

/* A-t-on déjà un rendez-vous à venir avec cette adresse ?

   Le marqueur `courriel` est posé en propriété privée à la création, ce qui
   rend la question exacte : on interroge nos propres réservations, pas le
   texte des événements de Guillaume. Sans ce garde-fou, un robot — ou un
   visiteur nerveux — remplit l'agenda de la semaine en dix requêtes. */
export async function rendezVousExistant(
  courriel: string,
  fin: Date,
): Promise<boolean> {
  const parametres = new URLSearchParams({
    privateExtendedProperty: `courriel=${courriel}`,
    timeMin: new Date().toISOString(),
    timeMax: fin.toISOString(),
    singleEvents: "true",
    maxResults: "1",
  });
  const donnees = await appeler<{ items?: EvenementGoogle[] }>(
    `/calendars/${encodeURIComponent(calendrierRdv())}/events?${parametres}`,
  );
  return (donnees.items ?? []).some((e) => e.status !== "cancelled");
}

export type Reservation = {
  debut: string;
  nom: string;
  courriel: string;
  telephone: string;
  restaurant: string;
  message: string;
  langue: "fr" | "en";
  /** Par quel lien le visiteur est arrivé. Facultatif : absent, on l'écrit. */
  provenance?: Provenance;
};

/* LA PROVENANCE VIT DANS L'ÉVÉNEMENT, À DEUX ENDROITS.

   En clair dans la description, pour Guillaume. Et en propriétés privées,
   pour le tableau de bord (`listerRendezVous`) : c'est la seule façon de
   relire une réservation par sa provenance sans analyser du texte. Google
   n'accepte que des chaînes non vides en valeur ; un champ absent reste
   absent plutôt que de devenir `""`. Le nom des clés reprend les UTM, pour
   qu'on les reconnaisse en ouvrant l'événement à la main dans l'API. */
const CLES_PRIVEES: ReadonlyArray<[keyof Provenance, string]> = [
  ["source", "utm_source"],
  ["medium", "utm_medium"],
  ["campaign", "utm_campaign"],
  ["content", "utm_content"],
  ["term", "utm_term"],
  ["referent", "referent"],
  ["page", "page"],
];

function proprietesProvenance(p: Provenance | undefined): Record<string, string> {
  const resultat: Record<string, string> = {};
  if (!p) return resultat;
  for (const [champ, cle] of CLES_PRIVEES) {
    if (p[champ]) resultat[cle] = p[champ];
  }
  return resultat;
}

function provenanceDepuis(
  privees: Record<string, string> | undefined,
): Provenance | undefined {
  if (!privees) return undefined;
  const resultat: Provenance = {};
  for (const [champ, cle] of CLES_PRIVEES) {
    if (privees[cle]) resultat[champ] = privees[cle];
  }
  return Object.keys(resultat).length > 0 ? resultat : undefined;
}

/* La création. Deux paramètres d'URL font tout le travail invisible :

   `conferenceDataVersion=1` autorise Google à honorer notre demande de salle —
   sans lui, le bloc `conferenceData` est ignoré en silence et il n'y a pas de
   lien Meet.

   `sendUpdates=all` fait envoyer l'invitation par Google. C'est ce qui permet
   à ce site de confirmer un rendez-vous par courriel SANS service d'envoi,
   sans domaine à authentifier et sans facture : le message part de Google, avec
   le bouton « ajouter à mon agenda » et le rappel automatique.

   La description est en FRANÇAIS quelle que soit la langue du visiteur : elle
   est lue par Guillaume, pas par le client. Elle nomme en revanche la langue du
   client, pour qu'il sache dans quelle langue décrocher. */
export async function creerRendezVous(
  reservation: Reservation,
): Promise<{ meet: string | null; debut: string; fin: string }> {
  const debut = new Date(reservation.debut);
  const fin = new Date(debut.getTime() + DUREE_MIN * 60_000);

  const titre = reservation.restaurant
    ? `Appel Resto Action — ${reservation.nom} (${reservation.restaurant})`
    : `Appel Resto Action — ${reservation.nom}`;

  const lignes = [
    `Demandé depuis le site, ${reservation.langue === "en" ? "en anglais" : "en français"}.`,
    // Toujours présente, même « inconnue » : c'est en la voyant à chaque
    // fois que Guillaume prend l'habitude de la lire.
    `Provenance : ${decrireProvenance(reservation.provenance)}`,
    "",
    `Nom : ${reservation.nom}`,
    reservation.restaurant ? `Restaurant : ${reservation.restaurant}` : null,
    `Courriel : ${reservation.courriel}`,
    `Téléphone : ${reservation.telephone}`,
    reservation.message ? "" : null,
    reservation.message ? `Son message :\n${reservation.message}` : null,
  ].filter((l) => l !== null);

  const donnees = await appeler<{ hangoutLink?: string }>(
    `/calendars/${encodeURIComponent(calendrierRdv())}/events?conferenceDataVersion=1&sendUpdates=all`,
    {
      method: "POST",
      body: JSON.stringify({
        summary: titre,
        description: lignes.join("\n"),
        start: { dateTime: debut.toISOString() },
        end: { dateTime: fin.toISOString() },
        attendees: [
          { email: reservation.courriel, displayName: reservation.nom },
        ],
        conferenceData: {
          createRequest: {
            requestId: randomUUID(),
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
        // Un invité venu d'un formulaire public n'a rien à pouvoir déplacer,
        // ni à voir qui d'autre est dans l'agenda.
        guestsCanModify: false,
        guestsCanInviteOthers: false,
        guestsCanSeeOtherGuests: false,
        extendedProperties: {
          private: {
            // `source: "site"` distingue nos réservations de ce que Guillaume
            // pose lui-même ; c'est la clé sur laquelle `listerRendezVous`
            // filtre. Ne pas la confondre avec `utm_source`.
            source: "site",
            courriel: reservation.courriel,
            ...proprietesProvenance(reservation.provenance),
          },
        },
      }),
    },
  );

  return {
    meet: donnees.hangoutLink ?? null,
    debut: debut.toISOString(),
    fin: fin.toISOString(),
  };
}

/* ─── La relecture, pour le tableau de bord ─── */

export type RendezVousListe = {
  id: string;
  /** Début du rendez-vous, ISO. */
  debut: string;
  titre: string;
  /** Moment où la réservation a été prise, ISO. C'est lui qu'on compte. */
  cree: string;
  provenance?: Provenance;
};

type EvenementListe = EvenementGoogle & {
  id?: string;
  summary?: string;
  created?: string;
  extendedProperties?: { private?: Record<string, string> };
};

/* Nos rendez-vous entre deux dates, provenance comprise.

   `privateExtendedProperty=source=site` ne rend que ce que ce site a créé :
   les rendez-vous que Guillaume pose à la main n'ont pas de provenance à
   compter, et on n'a pas à lire son agenda au-delà.

   Le filtre de Google porte sur la DATE DU RENDEZ-VOUS, pas sur celle de la
   réservation ; c'est l'appelant qui fait le tri sur `cree`. D'où une fenêtre
   large ici, et le vrai découpage dans la page.

   `fields` ne demande que ce qu'on lit — les descriptions contiennent des
   téléphones et des courriels qui n'ont pas à transiter pour un comptage.
   La boucle sur `nextPageToken` est là pour le jour où 2500 rendez-vous ne
   suffiront plus dans une page ; ce jour-là, on ne veut pas d'un tableau qui
   tronque en silence. */
export async function listerRendezVous(
  debut: Date,
  fin: Date,
): Promise<RendezVousListe[]> {
  const resultat: RendezVousListe[] = [];
  let pageToken: string | undefined;
  do {
    const parametres = new URLSearchParams({
      privateExtendedProperty: "source=site",
      timeMin: debut.toISOString(),
      timeMax: fin.toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "2500",
      fields:
        "nextPageToken,items(id,status,summary,created,start,extendedProperties)",
    });
    if (pageToken) parametres.set("pageToken", pageToken);
    const donnees = await appeler<{
      items?: EvenementListe[];
      nextPageToken?: string;
    }>(`/calendars/${encodeURIComponent(calendrierRdv())}/events?${parametres}`);
    for (const e of donnees.items ?? []) {
      if (e.status === "cancelled" || !e.id || !e.start?.dateTime || !e.created) {
        continue;
      }
      resultat.push({
        id: e.id,
        debut: e.start.dateTime,
        titre: e.summary ?? "",
        cree: e.created,
        provenance: provenanceDepuis(e.extendedProperties?.private),
      });
    }
    pageToken = donnees.nextPageToken;
  } while (pageToken);
  return resultat;
}
