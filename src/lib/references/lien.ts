import { after, NextResponse, type NextRequest } from "next/server";
import type { CodeReference } from "@/lib/contenu/references-codes";
import {
  encoderTemoinReference,
  lireTemoinReference,
  TEMOIN_BANDEAU,
  TEMOIN_BANDEAU_HEURES,
  TEMOIN_REFERENCE,
  TEMOIN_REFERENCE_JOURS,
  type SourceReference,
  type TemoinReference,
} from "@/lib/provenance";
import { studioOuvert } from "@/lib/site";
import { trouverReferent } from "./codes";
import { referentDe, signalerReference } from "./envoi";

/* LES LIENS COURTS /p/CODE (resto client) ET /f/CODE (partenaire).

   Ce qu'ils font, dans l'ordre :
     1. Code inconnu ou désactivé : on renvoie sur l'accueil, en silence.
     2. Code connu : on pose le témoin d'attribution de 30 jours, SEULEMENT
        s'il n'y en a pas déjà un (le premier contact gagne).
     3. On pose un petit témoin de 2 h pour le bandeau « X t'a recommandé ».
     4. On renvoie sur l'accueil (ou /en). La provenance de la visite est
        captée là, comme d'habitude.
     5. Si le CRM est branché, on lui signale la visite (sans donnée perso).

   Un ?s=carte (code QR de la carte imprimée) ou ?s=rep (lien d'un
   représentant) dit comment le resto est arrivé. Sinon : « lien ».

   DROIT À UN OUTIL (18 nov.) : /p/CODE?vers=calcul, ?vers=classement ou
   ?vers=studio (pareil pour /f/CODE). On pose le code, puis on mène à l'outil :
   sa page à lui si elle existe, sinon sa section de l'accueil. Sans « vers »,
   rien ne change. Un « vers » inconnu est ignoré. Un code inconnu est ignoré en
   silence, et le visiteur arrive quand même à l'outil demandé. Le code voyage
   ensuite avec tous les leads, peu importe l'outil (src/lib/leads/envoi.ts). */

/* Où mène chaque outil. Une seule ligne à changer le jour où un outil gagne
   sa page à lui. Les outils sont en français seulement : en anglais, seul le
   calculateur du relevé existe (à la même ancre), le reste mène à /en. */
function cheminOutil(vers: string | null, anglais: boolean): string | undefined {
  switch (vers) {
    case "calcul":
      // Le Calcul 60 secondes a sa page : /calcul (src/app/calcul/page.tsx).
      return anglais ? "/en#calculateur" : "/calcul";
    case "classement":
      // Pas de page à lui : sa section de l'accueil (CLASSEMENT.ancre, contenu/classement.ts).
      return anglais ? "/en" : "/#rang-google";
    case "studio":
      // /studio répond 404 tant que STUDIO_ACTIF est faux (src/lib/site.ts) : d'ici là, l'accueil.
      return anglais ? "/en" : studioOuvert() ? "/studio" : "/";
    default:
      return undefined;
  }
}

function destinationDe(requete: NextRequest, anglais: boolean): URL {
  const chemin = cheminOutil(requete.nextUrl.searchParams.get("vers"), anglais) ?? (anglais ? "/en" : "/");
  return new URL(chemin, requete.url);
}

function sourceDe(requete: NextRequest): SourceReference {
  const s = requete.nextUrl.searchParams.get("s");
  if (s === "carte") return "carte";
  if (s === "rep") return "representant";
  return "lien";
}

export function traiterLienReference(requete: NextRequest, brut: string): NextResponse {
  const anglais = requete.nextUrl.searchParams.get("l") === "en";
  const destination = destinationDe(requete, anglais);
  const reponse = NextResponse.redirect(destination, 307);
  reponse.headers.set("X-Robots-Tag", "noindex, nofollow");
  reponse.headers.set("Cache-Control", "no-store");

  const referent = trouverReferent(brut);
  if (!referent) return reponse;

  const securise = destination.protocol === "https:";
  const existant = lireTemoinReference(requete.cookies.get(TEMOIN_REFERENCE)?.value);
  // Le témoin existant ne compte que si son code est encore actif.
  const garde = existant && trouverReferent(existant.code) ? existant : undefined;
  const source = sourceDe(requete);

  if (!garde) {
    reponse.cookies.set(TEMOIN_REFERENCE, encoderTemoinReference({ code: referent.code, premierContact: Date.now(), source }), {
      httpOnly: true,
      sameSite: "lax",
      secure: securise,
      path: "/",
      maxAge: TEMOIN_REFERENCE_JOURS * 86_400,
    });
  }

  // Le bandeau nomme celui qui a l'attribution, pas forcément ce lien-ci.
  const attribue = garde ? (trouverReferent(garde.code) ?? referent) : referent;
  // Next encode lui-même la valeur (le client la décode une fois).
  reponse.cookies.set(TEMOIN_BANDEAU, JSON.stringify({ t: attribue.type, n: attribue.nom }), {
    httpOnly: false,
    sameSite: "lax",
    secure: securise,
    path: "/",
    maxAge: TEMOIN_BANDEAU_HEURES * 3_600,
  });

  after(() =>
    signalerReference({
      type: "reference.visite",
      langue: anglais ? "en" : "fr",
      page: requete.nextUrl.pathname,
      source: source,
      referent: referentDe(referent),
    }),
  );

  return reponse;
}

/* ─── Pour les routes de réservation ─── */

export type ReferenceAttribuee = {
  referent: CodeReference;
  temoin: TemoinReference;
};

/** Le référent qui a l'attribution de ce visiteur, s'il y en a un (et s'il est encore actif). */
export function referenceDeLaRequete(requete: NextRequest): ReferenceAttribuee | undefined {
  const temoin = lireTemoinReference(requete.cookies.get(TEMOIN_REFERENCE)?.value);
  if (!temoin) return undefined;
  const referent = trouverReferent(temoin.code);
  return referent ? { referent, temoin } : undefined;
}

/** Ce qui voyage dans les deux POST existants (signalerReservation, signalerFondateur), clé `reference`, et dans chaque lead (provenance.reference). */
export type ReferencePourCrm = {
  code: string;
  type: CodeReference["type"];
  nom: string;
  representant: string | null;
  source: SourceReference;
  premier_contact: string;
};

export function referencePourCrm(r: ReferenceAttribuee | undefined): ReferencePourCrm | undefined {
  if (!r) return undefined;
  return {
    code: r.referent.code,
    type: r.referent.type,
    nom: r.referent.nom,
    representant: r.referent.representant ?? null,
    source: r.temoin.source,
    premier_contact: new Date(r.temoin.premierContact).toISOString(),
  };
}

/* `reference.attribuee` (un resto arrive avec un code) n'est plus émis d'ici :
   depuis le 18 nov. 2026, c'est la porte unique des leads qui le fait, pour
   tous les formulaires, une seule fois par resto (src/lib/leads/envoi.ts). */

/** La page d'où vient l'envoi (en-tête Referer), ou la valeur par défaut. */
export function pageDeLaRequete(requete: NextRequest, defaut: string): string {
  try {
    const r = requete.headers.get("referer");
    return r ? new URL(r).pathname.slice(0, 100) : defaut;
  } catch {
    return defaut;
  }
}
