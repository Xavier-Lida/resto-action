import { echapper, enveloppe, para } from "@/lib/courriels-fondateur";
import { jetonAcces, PORTEE_COURRIEL } from "@/lib/google/auth";
import { SITE_URL } from "@/lib/site";

/* LE STUDIO PHOTO : le courriel à Guillaume, à chaque nouveau contact, avec
   l'avant et l'après DANS le message.

   Même envoi que les autres courriels du site (Gmail, au nom de GOOGLE_SUJET,
   voir src/lib/google/courriel.ts), mais ce message-ci porte 2 images : il est
   donc monté ici, en multipart/related, sans toucher à l'envoi des autres. Les
   images sont les aperçus réduits (pas les fichiers en haute qualité).

   Il part à Guillaume seulement (GOOGLE_SUJET), jamais au resto : aucun message
   automatique ne va au resto. Sans configuration Google (poste de
   développement), rien ne part. NE LÈVE JAMAIS. */

export type ContactStudio = {
  id: string;
  prenom: string;
  cellulaire: string;
  resto: string;
  ville: string;
  plateformes: string;
  commandes: string;
  moteur: string;
  verdict: string;
  exemple: boolean;
  publication: string;
  dureeMs?: number;
  coutUsd?: number;
};

const enteteUtf8 = (v: string) => `=?UTF-8?B?${Buffer.from(v, "utf8").toString("base64")}?=`;
const lignes76 = (b64: string) => b64.replace(/(.{76})/g, "$1\r\n");

export async function prevenirGuillaume(c: ContactStudio, avant: Buffer | null, apres: Buffer | null): Promise<void> {
  const a = process.env.GOOGLE_SUJET;
  if (!a || !process.env.GOOGLE_SA_COURRIEL || !process.env.GOOGLE_SA_CLE) return;

  const faits: [string, string][] = [
    ["Resto", `${c.resto} (${c.ville})`],
    ["Prénom", c.prenom],
    ["Cellulaire", c.cellulaire],
    ["Plateformes", c.plateformes || "pas répondu"],
    ["Commandes en ligne par semaine", c.commandes || "pas répondu"],
    ["Moteur", c.moteur],
    ["Verdict du contrôle", c.verdict],
    ["Exemple permis (2e case)", c.exemple ? "oui" : "non"],
    ["Temps", c.dureeMs ? `${Math.round(c.dureeMs / 1000)} s` : "?"],
    ["Coût", c.coutUsd !== undefined ? `${c.coutUsd.toFixed(3)} $ US` : "?"],
  ];
  const suivi = `${SITE_URL}/studio/suivi#${c.id}`;
  const sujet = `Studio Photo : ${c.resto} (${c.ville})`;
  const texte = [
    ...faits.map(([k, v]) => `${k} : ${v}`),
    "",
    `Sa publication : ${c.publication}`,
    "",
    `Le suivi : ${suivi}`,
    "Aucun texto n'est parti : c'est à toi de lui écrire.",
  ].join("\n");
  const html = enveloppe(
    [
      para(`${c.prenom}, de ${c.resto} (${c.ville}), vient de faire retoucher une photo au Studio. Aucun texto n'est parti : c'est à toi de lui écrire.`),
      `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 14px;"><tr>${
        avant ? `<td style="padding-right:8px;"><p style="margin:0 0 4px;font-weight:bold;">Avant</p><img src="cid:avant" width="270" alt="Avant" style="display:block;border-radius:8px;"></td>` : ""
      }${
        apres ? `<td><p style="margin:0 0 4px;font-weight:bold;">Après</p><img src="cid:apres" width="270" alt="Après" style="display:block;border-radius:8px;"></td>` : ""
      }</tr></table>`,
      ...faits.map(([k, v]) => `<p style="margin:0 0 6px;"><strong>${echapper(k)} :</strong> ${echapper(v)}</p>`),
      para(""),
      para(`Sa publication : ${c.publication}`),
      `<p style="margin:0 0 14px;"><a href="${suivi}">Voir dans le suivi</a></p>`,
    ].join(""),
  );

  const R = `ra-studio-r-${Date.now().toString(36)}`;
  const A = `ra-studio-a-${Date.now().toString(36)}`;
  const piece = (nom: string, jpeg: Buffer) => [
    `--${R}`,
    `Content-Type: image/jpeg; name="${nom}.jpg"`,
    "Content-Transfer-Encoding: base64",
    `Content-ID: <${nom}>`,
    `Content-Disposition: inline; filename="${nom}.jpg"`,
    "",
    lignes76(jpeg.toString("base64")),
  ];
  const mime = [
    `From: Resto Action <${a}>`,
    `To: ${a}`,
    `Subject: ${enteteUtf8(sujet.replace(/[\r\n]+/g, " "))}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/related; boundary="${R}"`,
    "",
    `--${R}`,
    `Content-Type: multipart/alternative; boundary="${A}"`,
    "",
    `--${A}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    lignes76(Buffer.from(texte, "utf8").toString("base64")),
    `--${A}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    lignes76(Buffer.from(html, "utf8").toString("base64")),
    `--${A}--`,
    ...(avant ? piece("avant", avant) : []),
    ...(apres ? piece("apres", apres) : []),
    `--${R}--`,
    "",
  ].join("\r\n");

  try {
    const jeton = await jetonAcces(PORTEE_COURRIEL);
    const reponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${jeton}`, "Content-Type": "application/json" },
      body: JSON.stringify({ raw: Buffer.from(mime, "utf8").toString("base64url") }),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    if (!reponse.ok) console.error("[studio] courriel refusé :", reponse.status);
  } catch (erreur) {
    console.error("[studio] courriel non envoyé :", erreur instanceof Error ? erreur.name : "erreur inconnue");
  }
}
