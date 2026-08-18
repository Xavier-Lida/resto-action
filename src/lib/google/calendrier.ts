import { randomUUID } from "node:crypto";
import type { Intervalle } from "@/lib/agenda";
import { DUREE_MIN } from "@/lib/agenda";
import { ErreurAgenda, jetonAcces, requis } from "./auth";

/* LES TROIS SEULS APPELS QU'ON FAIT À GOOGLE.

   Lire les plages offertes, lire ce qui occupe déjà Guillaume, poser le
   rendez-vous. Tout le reste de l'API Calendar ne nous concerne pas.

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
};

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
          private: { source: "site", courriel: reservation.courriel },
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
