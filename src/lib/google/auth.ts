import { createSign } from "node:crypto";

/* L'ACCÈS À GOOGLE, EN CINQUANTE LIGNES ET SANS UNE DÉPENDANCE.

   Le réflexe serait d'installer `googleapis`. Ce paquet embarque le client de
   TOUTES les API de Google — une centaine de mégaoctets — pour ce qu'on fait
   ici : signer un jeton et appeler trois URL. Le `package.json` de ce site
   tient en cinq dépendances ; il n'allait pas doubler de taille pour ça.

   Ce qu'on fait à la place est le protocole documenté par Google, tel quel :
   un JWT signé RS256 avec la clé du compte de service, échangé contre un
   `access_token` d'une heure. `node:crypto` sait signer, `fetch` sait poster.

   LE `sub` EST LE CŒUR DU DISPOSITIF. Sans lui, on agit comme le compte de
   service — une identité fantôme qui n'a ni calendrier, ni droit d'inviter
   quelqu'un, ni capacité à ouvrir un Google Meet. Avec lui, et grâce à la
   délégation à l'échelle du domaine réglée dans la console d'admin Workspace,
   on agit COMME Guillaume : l'événement est le sien, l'invitation part de sa
   vraie adresse, et le Meet s'ouvre sous sa licence. C'est aussi pour ça que
   ce montage exige Workspace et ne marcherait pas avec un Gmail ordinaire. */

const PORTEE = "https://www.googleapis.com/auth/calendar";
const JETON_URL = "https://oauth2.googleapis.com/token";

/* Les pannes qu'on sait nommer. Le code voyage jusqu'au navigateur, qui
   choisit la phrase à afficher : le visiteur n'a pas à lire « 403 » pour
   comprendre qu'il doit appeler. */
export type CodeErreur =
  | "config"
  | "google"
  | "invalide"
  | "pris"
  | "double"
  | "trop";

export class ErreurAgenda extends Error {
  constructor(
    readonly code: CodeErreur,
    message: string,
  ) {
    super(message);
    this.name = "ErreurAgenda";
  }
}

/** Lit une variable d'environnement obligatoire, ou explique laquelle manque. */
export function requis(nom: string): string {
  const valeur = process.env[nom];
  if (!valeur) {
    throw new ErreurAgenda("config", `Variable d'environnement absente : ${nom}`);
  }
  return valeur;
}

function base64url(valeur: string): string {
  return Buffer.from(valeur).toString("base64url");
}

/* Le jeton vit dans la portée du module, donc dans l'instance sans-serveur.
   Une instance chaude qui enchaîne les visiteurs ne re-signe pas un JWT et ne
   refait pas d'aller-retour vers Google à chaque chargement de page. Une
   instance froide en refait un — c'est un appel, pas un problème. */
let cache: { jeton: string; expire: number } | null = null;

export async function jetonAcces(): Promise<string> {
  const maintenant = Math.floor(Date.now() / 1000);
  // Soixante secondes de marge : un jeton qui expire pendant le vol de la
  // requête donnerait un 401 impossible à reproduire.
  if (cache && cache.expire > maintenant + 60) return cache.jeton;

  const compte = requis("GOOGLE_SA_COURRIEL");
  // Vercel stocke la clé sur une seule ligne : les sauts y sont échappés, il
  // faut les rendre à PEM avant que `crypto` puisse la lire.
  const cle = requis("GOOGLE_SA_CLE").replace(/\\n/g, "\n");
  const sujet = requis("GOOGLE_SUJET");

  const entete = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const charge = base64url(
    JSON.stringify({
      iss: compte,
      sub: sujet,
      scope: PORTEE,
      aud: JETON_URL,
      iat: maintenant,
      exp: maintenant + 3600,
    }),
  );

  const signeur = createSign("RSA-SHA256");
  signeur.update(`${entete}.${charge}`);
  signeur.end();
  const signature = signeur.sign(cle).toString("base64url");

  const reponse = await fetch(JETON_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${entete}.${charge}.${signature}`,
    }),
    cache: "no-store",
  });

  if (!reponse.ok) {
    throw new ErreurAgenda(
      "google",
      `Jeton refusé (${reponse.status}) : ${await reponse.text()}`,
    );
  }

  const donnees = (await reponse.json()) as {
    access_token: string;
    expires_in: number;
  };
  cache = {
    jeton: donnees.access_token,
    expire: maintenant + donnees.expires_in,
  };
  return cache.jeton;
}
