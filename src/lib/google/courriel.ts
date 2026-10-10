import { ErreurAgenda, jetonAcces, PORTEE_COURRIEL, requis } from "./auth";

/* L'ENVOI DE COURRIELS, PAR GMAIL, AU NOM DE GUILLAUME.

   Même compte de service que l'agenda, même délégation Workspace : on agit
   comme GOOGLE_SUJET, donc le courriel part de sa vraie adresse, apparaît dans
   ses Messages envoyés, et la réponse du resto atterrit dans sa boîte.

   À COCHER UNE FOIS dans la console d'admin Workspace (Sécurité → Contrôles
   des API → Délégation à l'échelle du domaine → modifier le client du compte
   de service) : ajouter la portée https://www.googleapis.com/auth/gmail.send à
   côté de celle de l'agenda. Sans elle, Google refuse le jeton et rien ne part.

   Le message est un MIME multipart/alternative fait à la main : une version
   texte (lue par les filtres et les vieux clients) et une version HTML. */

export type Courriel = {
  a: string;
  sujet: string;
  texte: string;
  html: string;
};

// L'en-tête Subject doit être en ASCII : le sujet accentué passe en base64.
function enteteUtf8(valeur: string): string {
  return `=?UTF-8?B?${Buffer.from(valeur, "utf8").toString("base64")}?=`;
}

// Une adresse avec un saut de ligne permettrait d'injecter des en-têtes.
const ADRESSE = /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]+$/;

export async function envoyerCourriel(c: Courriel): Promise<void> {
  if (!ADRESSE.test(c.a)) throw new ErreurAgenda("invalide", `Adresse refusée : ${c.a}`);
  const de = requis("GOOGLE_SUJET");
  const frontiere = `ra-${Date.now().toString(36)}`;

  const mime = [
    `From: Resto Action <${de}>`,
    `To: ${c.a}`,
    `Reply-To: ${de}`,
    `Subject: ${enteteUtf8(c.sujet.replace(/[\r\n]+/g, " "))}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${frontiere}"`,
    "",
    `--${frontiere}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(c.texte, "utf8").toString("base64"),
    `--${frontiere}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(c.html, "utf8").toString("base64"),
    `--${frontiere}--`,
    "",
  ].join("\r\n");

  const jeton = await jetonAcces(PORTEE_COURRIEL);
  const reponse = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${jeton}`, "Content-Type": "application/json" },
      body: JSON.stringify({ raw: Buffer.from(mime, "utf8").toString("base64url") }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    },
  );
  if (!reponse.ok) {
    throw new ErreurAgenda("google", `Courriel refusé (${reponse.status}) : ${await reponse.text()}`);
  }
}
