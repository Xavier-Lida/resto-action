import { connect } from "node:tls";
import { ErreurAgenda, jetonAcces, PORTEE_COURRIEL, requis } from "./auth";

/* L'ENVOI DE COURRIELS, PAR GMAIL, AU NOM DE GUILLAUME.

   Même compte de service que l'agenda, même délégation Workspace : on agit
   comme GOOGLE_SUJET, donc le courriel part de sa vraie adresse, apparaît dans
   ses Messages envoyés, et la réponse du resto atterrit dans sa boîte.

   À COCHER UNE FOIS dans la console d'admin Workspace (Sécurité → Contrôles
   des API → Délégation à l'échelle du domaine → modifier le client du compte
   de service) : ajouter la portée https://www.googleapis.com/auth/gmail.send à
   côté de celle de l'agenda. Sans elle, Google refuse le jeton et rien ne part.

   LA 2e VOIE (23 nov. 2026), SANS COMPTE DE SERVICE : si COURRIEL_SMTP_UTILISATEUR
   et COURRIEL_SMTP_MDP sont posées (une adresse Gmail et son « mot de passe
   d'application », créé dans myaccount.google.com → Sécurité), le courriel part
   par smtp.gmail.com avec ce compte-là, et le compte de service n'est pas
   touché. Guillaume l'installe seul, sans console d'admin Workspace.

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

// Une ligne de courriel ne dépasse pas 998 caractères : le base64 est coupé à 76.
function base64Lignes(valeur: string): string {
  return (Buffer.from(valeur, "utf8").toString("base64").match(/.{1,76}/g) ?? []).join("\r\n");
}

function smtp(): { utilisateur: string; mdp: string } | null {
  const utilisateur = process.env.COURRIEL_SMTP_UTILISATEUR?.trim();
  const mdp = process.env.COURRIEL_SMTP_MDP?.replace(/\s+/g, "");
  return utilisateur && mdp ? { utilisateur, mdp } : null;
}

/** Vrai si un courriel peut partir d'ici : la 2e voie, ou le compte de service. */
export function courrielBranche(): boolean {
  return Boolean(smtp() || (process.env.GOOGLE_SA_COURRIEL && process.env.GOOGLE_SA_CLE && process.env.GOOGLE_SUJET));
}

/* Un envoi par smtp.gmail.com (port 465, TLS dès la connexion). Le dialogue est
   court et fait à la main, pour ne pas ajouter de dépendance. */
function envoyerParSmtp(compte: { utilisateur: string; mdp: string }, a: string, mime: string): Promise<void> {
  const b64 = (v: string) => Buffer.from(v, "utf8").toString("base64");
  // Une ligne qui commence par un point est doublée (RFC 5321).
  const corps = mime.replace(/\r\n\./g, "\r\n..");
  const etapes: { envoi?: string; attendu: number }[] = [
    { attendu: 220 },
    { envoi: "EHLO restoaction.ca", attendu: 250 },
    { envoi: "AUTH LOGIN", attendu: 334 },
    { envoi: b64(compte.utilisateur), attendu: 334 },
    { envoi: b64(compte.mdp), attendu: 235 },
    { envoi: `MAIL FROM:<${compte.utilisateur}>`, attendu: 250 },
    { envoi: `RCPT TO:<${a}>`, attendu: 250 },
    { envoi: "DATA", attendu: 354 },
    { envoi: `${corps}\r\n.`, attendu: 250 },
    { envoi: "QUIT", attendu: 221 },
  ];

  return new Promise((resolve, reject) => {
    const prise = connect({ host: "smtp.gmail.com", port: 465, servername: "smtp.gmail.com" });
    let rendu = 0;
    let tampon = "";
    let fini = false;
    const finir = (erreur?: Error) => {
      if (fini) return;
      fini = true;
      prise.destroy();
      if (erreur) reject(erreur);
      else resolve();
    };
    prise.setTimeout(15_000, () => finir(new ErreurAgenda("google", "Courriel : smtp.gmail.com ne répond pas")));
    prise.on("error", (e) => finir(new ErreurAgenda("google", `Courriel : ${e.message}`)));
    prise.on("close", () => finir(new ErreurAgenda("google", "Courriel : connexion fermée avant la fin")));
    prise.on("data", (morceau) => {
      tampon += morceau.toString("utf8");
      // Une réponse finit par une ligne « 250 texte » (les lignes « 250-texte » continuent).
      for (;;) {
        const fin = tampon.match(/^(?:\d{3}-[^\r\n]*\r\n)*(\d{3})(?: [^\r\n]*)?\r\n/);
        if (!fin) return;
        const reponse = fin[0];
        tampon = tampon.slice(reponse.length);
        const etape = etapes[rendu];
        if (Number(fin[1]) !== etape.attendu) {
          // L'étape 4 est le mot de passe : il ne va jamais dans un message d'erreur.
          return finir(new ErreurAgenda("google", `Courriel refusé à l'étape ${rendu} (${reponse.trim().slice(0, 200)})`));
        }
        rendu += 1;
        // La réponse au DATA final (250) suffit : le courriel est accepté.
        if (rendu >= etapes.length - 1) {
          prise.write("QUIT\r\n");
          return finir();
        }
        prise.write(`${etapes[rendu].envoi}\r\n`);
      }
    });
  });
}

export async function envoyerCourriel(c: Courriel): Promise<void> {
  if (!ADRESSE.test(c.a)) throw new ErreurAgenda("invalide", `Adresse refusée : ${c.a}`);
  const compte = smtp();
  const de = compte ? compte.utilisateur : requis("GOOGLE_SUJET");
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
    base64Lignes(c.texte),
    `--${frontiere}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    base64Lignes(c.html),
    `--${frontiere}--`,
    "",
  ].join("\r\n");

  if (compte) return envoyerParSmtp(compte, c.a, mime);

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
