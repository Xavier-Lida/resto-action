import type { Provenance } from "@/lib/provenance";
import type { ReferencePourCrm } from "@/lib/references/lien";

/* PRÉVENIR LE CRM QU'UNE RÉSERVATION VIENT D'ÊTRE PRISE.

   Le CRM (dashboard.restoaction.ca, dépôt resto-action-crm) est la source de
   vérité des prospects ; l'agenda reste l'agenda. Ce module est le seul lien
   entre les deux côté site : un POST, signé d'un secret partagé.

   CETTE FONCTION NE LÈVE JAMAIS ET NE FAIT JAMAIS ATTENDRE. Elle est appelée
   après la réponse au visiteur (`after()` dans la route), avec un délai maximal
   court : quand elle tourne, la réservation EXISTE déjà dans l'agenda et
   l'invitation est partie. Rien de ce qui arrive ici ne doit pouvoir la
   remettre en cause. Un envoi perdu n'est pas perdu pour autant — le CRM relit
   l'agenda chaque matin et retrouve ce qui lui a échappé.

   SANS CONFIGURATION, ELLE NE FAIT RIEN, et c'est voulu : les deux variables ne
   sont posées qu'en PRODUCTION. Un aperçu Vercel ou un poste de développement
   ne doit pas écrire de prospects dans le vrai CRM. */

/* Dix secondes, et ça ne coûte rien au visiteur : l'appel part APRÈS sa réponse.
   Le délai ne sert qu'à borner une instance qui attendrait un CRM muet. Il est
   large exprès — une instance froide du CRM doit ouvrir sa connexion à la base
   avant d'écrire, et un délai trop court abandonnerait un envoi qui allait
   aboutir. */
const DELAI_MS = 10_000;

export type ReservationPourCrm = {
  googleEventId: string;
  nom: string;
  courriel: string;
  telephone: string;
  restaurant: string;
  message: string;
  langue: "fr" | "en";
  provenance?: Provenance;
  /** « Réfère un resto » : qui nous a présenté ce resto (témoin de 30 jours). */
  reference?: ReferencePourCrm;
  meet: string | null;
  debut: string;
  fin: string;
};

export async function signalerReservation(r: ReservationPourCrm): Promise<void> {
  const url = process.env.CRM_INGESTION_URL;
  const secret = process.env.CRM_INGESTION_SECRET;
  if (!url || !secret) return;

  try {
    const reponse = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prospect: {
          nom: r.nom,
          courriel: r.courriel,
          telephone: r.telephone,
          restaurant: r.restaurant,
          langue: r.langue,
        },
        rendez_vous: {
          google_event_id: r.googleEventId,
          debut: r.debut,
          fin: r.fin,
          meet: r.meet,
        },
        message: r.message,
        provenance: r.provenance,
        reference: r.reference,
      }),
      signal: AbortSignal.timeout(DELAI_MS),
      cache: "no-store",
    });
    if (!reponse.ok) {
      console.error("[crm] réservation refusée :", reponse.status);
    }
  } catch (erreur) {
    // Ni le corps ni le secret dans les journaux : seulement la nature de la panne.
    console.error(
      "[crm] réservation non transmise :",
      erreur instanceof Error ? erreur.name : "erreur inconnue",
    );
  }
}

/* ─── Les restos fondateurs ───

   Les moments annoncés au CRM :
     « prospect » dès l'étape 1 du formulaire /reserver (le resto a laissé son
       nom et son téléphone : c'est un lead chaud à rappeler) ;
     « reservation » à l'étape 4 : la réservation gratuite, avec ses réponses
       et la case des textos. Si le CRM ne l'accepte pas, /api/fondateur
       l'envoie aussi par courriel à l'équipe : une réservation ne se perd pas ;
     « paye » quand Stripe confirme le paiement de la mise en service (webhook).

   MÊMES RÈGLES QUE signalerReservation : ne lève jamais, appelée dans
   `after()`, et ne fait rien sans configuration. L'adresse est distincte
   (CRM_FONDATEUR_URL) parce que le CRM n'a pas encore de route pour ça : tant
   que Xavier ne l'a pas ajoutée, la variable reste vide et rien ne casse. Les
   paiements, eux, restent toujours visibles dans Stripe. */
export type EvenementFondateur = {
  /** « maquette » : demande de maquette gratuite depuis le héro (ancien parcours).
      « dossier » : Le Dossier pour ton associé, demandé après le calculateur. */
  etape: "prospect" | "reservation" | "maquette" | "paye" | "dossier";
  prospect: {
    nom: string;
    courriel: string;
    telephone: string;
    restaurant: string;
    ville: string;
    langue: "fr" | "en";
  };
  app?: { menu: string; service: string };
  qualification?: { plateformes: string; commandes: string };
  /** `dossier` : le lien privé de sa page de suivi, à lui envoyer. */
  paiement?: { session: string; montant: number | null; devise: string; dossier: string };
  maquette?: { menu: string };
  /** « reservation » : la case des textos (non cochée par défaut) et la version des conditions. */
  reservation?: { consentementTextos: boolean; conditions: string };
  /** Les chiffres du relevé et les hypothèses du calcul (src/lib/calcul.ts). */
  dossier?: unknown;
  provenance?: Provenance;
  /** « Réfère un resto » : qui nous a présenté ce resto (témoin de 30 jours). */
  reference?: ReferencePourCrm;
};

/** Vrai si le CRM a accepté l'événement. Ne lance jamais d'erreur. */
export async function signalerFondateur(e: EvenementFondateur): Promise<boolean> {
  const url = process.env.CRM_FONDATEUR_URL;
  const secret = process.env.CRM_INGESTION_SECRET;
  if (!url || !secret) return false;

  try {
    const reponse = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "fondateur", ...e }),
      signal: AbortSignal.timeout(DELAI_MS),
      cache: "no-store",
    });
    if (!reponse.ok) {
      console.error("[crm] fondateur refusé :", reponse.status);
    }
    return reponse.ok;
  } catch (erreur) {
    console.error(
      "[crm] fondateur non transmis :",
      erreur instanceof Error ? erreur.name : "erreur inconnue",
    );
    return false;
  }
}
