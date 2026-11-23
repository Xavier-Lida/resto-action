import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { copy, del, get, list, put } from "@vercel/blob";
import { STUDIO } from "@/lib/site";
import { jourMontreal, lireDepense, nomDepense } from "@/lib/studio/cadrage";
import { CHEMINS, type Fiche, type Vue } from "@/lib/studio/types";

/* LE STUDIO PHOTO : où vivent les photos, les fiches et les compteurs.

   UN SEUL ENDROIT : un magasin Vercel Blob PRIVÉ. Aucun fichier n'a d'adresse
   publique : tout se lit par nos routes, qui vérifient d'abord le jeton du
   visiteur ou le mot de passe de l'équipe.

   TOUT S'EFFACE TOUT SEUL après STUDIO.gardeJours (l'option `ttlDays` du
   magasin), sans tâche planifiée : photos, fiches et compteurs. Seule exception,
   la copie « exemple » (studio/exemples/), faite quand le resto a coché la
   2e case : elle n'a pas de date d'effacement.

   LES COMPTEURS SONT DES LISTES. Pas de base de données sur ce site : compter
   les photos d'un visiteur, d'un cellulaire ou les dépenses du jour, c'est
   lister un dossier de petits fichiers témoins. À ce volume, c'est quelques
   millièmes de cent par photo.

   Serveur seulement. La clé (BLOB_READ_WRITE_TOKEN) ne quitte jamais le serveur. */

const PRIVE = { access: "private" as const };

export function stockagePret(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

// ─── Identifiants et empreintes ───

/** « 20261118-143012-a1b2c3d4e5 » : triable par date, impossible à deviner. */
export function nouvelId(quand: Date = new Date()): string {
  const heure = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Toronto",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(quand)
    .replace(/:/g, "");
  return `${jourMontreal(quand)}-${heure}-${randomBytes(5).toString("hex")}`;
}

export const nouveauJeton = () => randomBytes(24).toString("hex");

export function hacher(valeur: string): string {
  return createHash("sha256").update(`studio:${valeur}`).digest("hex").slice(0, 32);
}

export function memeJeton(jeton: string, hache: string): boolean {
  const a = Buffer.from(hacher(jeton));
  const b = Buffer.from(hache);
  return a.length === b.length && timingSafeEqual(a, b);
}

// ─── Lire et écrire ───

async function enTampon(flux: ReadableStream<Uint8Array>): Promise<Buffer> {
  return Buffer.from(await new Response(flux).arrayBuffer());
}

export async function ecrire(
  chemin: string,
  contenu: Buffer | string,
  type: string,
  options: { garde?: boolean } = {},
): Promise<void> {
  /* Une copie dans une mémoire neuve : sous le serveur de Next, les images qui
     sortent de `sharp` peuvent reposer sur une mémoire partagée
     (SharedArrayBuffer), que l'envoi refuse (« SharedArrayBuffer is not allowed »). */
  const corps = typeof contenu === "string" ? contenu : Buffer.from(Uint8Array.from(contenu).buffer);
  await put(chemin, corps, {
    ...PRIVE,
    contentType: type,
    addRandomSuffix: false,
    allowOverwrite: true,
    ...(options.garde === false ? {} : { ttlDays: STUDIO.gardeJours }),
  });
}

/** `frais` : lit le magasin lui-même, pas son cache (une fiche qu'on vient de réécrire). */
export async function lire(chemin: string, frais = false): Promise<Buffer | null> {
  const r = await get(chemin, { ...PRIVE, useCache: !frais });
  if (!r || r.statusCode !== 200) return null;
  return enTampon(r.stream);
}

/** Pour servir une image sans la charger en mémoire. */
export async function lireFlux(chemin: string): Promise<{ flux: ReadableStream<Uint8Array>; type: string; taille: number } | null> {
  const r = await get(chemin, PRIVE);
  if (!r || r.statusCode !== 200) return null;
  return { flux: r.stream, type: r.blob.contentType, taille: r.blob.size };
}

export async function supprimer(chemin: string): Promise<void> {
  try {
    await del(chemin);
  } catch {
    // Un fichier déjà parti, ou qui partira avec sa date d'effacement : rien à faire.
  }
}

/** Les chemins des fichiers d'un dossier du magasin. */
export async function lister(prefixe: string, max = 3000): Promise<string[]> {
  return chemins(prefixe, max);
}

async function chemins(prefixe: string, max = 3000): Promise<string[]> {
  const trouves: string[] = [];
  let curseur: string | undefined;
  do {
    const page = await list({ prefix: prefixe, cursor: curseur, limit: 1000 });
    trouves.push(...page.blobs.map((b) => b.pathname));
    curseur = page.hasMore ? page.cursor : undefined;
  } while (curseur && trouves.length < max);
  return trouves;
}

// ─── Les fiches ───

export async function ecrireFiche(fiche: Fiche): Promise<void> {
  await ecrire(CHEMINS.fiche(fiche.id), JSON.stringify(fiche), "application/json");
}

export async function lireFiche(id: string): Promise<Fiche | null> {
  const brut = await lire(CHEMINS.fiche(id), true);
  if (!brut) return null;
  try {
    return JSON.parse(brut.toString("utf8")) as Fiche;
  } catch {
    return null;
  }
}

/** Les dernières fiches, les plus récentes d'abord (pour /studio/suivi). */
export async function dernieresFiches(nombre: number): Promise<Fiche[]> {
  const noms = (await chemins(CHEMINS.fiches)).sort().reverse().slice(0, nombre);
  const fiches = await Promise.all(
    noms.map((n) => lireFiche(n.slice(CHEMINS.fiches.length).replace(/\.json$/, ""))),
  );
  return fiches.filter((f): f is Fiche => f !== null);
}

export async function ecrirePhoto(id: string, vue: Vue, jpeg: Buffer): Promise<void> {
  await ecrire(CHEMINS.photo(id, vue), jpeg, "image/jpeg");
}

// ─── Les compteurs ───

export async function photosDuVisiteur(ipHache: string, jour = jourMontreal()): Promise<number> {
  return (await chemins(CHEMINS.visiteur(jour, ipHache), 100)).length;
}

export async function noterVisiteur(ipHache: string, id: string, jour = jourMontreal()): Promise<void> {
  await ecrire(`${CHEMINS.visiteur(jour, ipHache)}${id}`, "1", "text/plain");
}

export async function photosDuCellulaire(cellHache: string): Promise<number> {
  return (await chemins(CHEMINS.cellulaire(cellHache), 100)).length;
}

export async function noterCellulaire(cellHache: string, id: string): Promise<void> {
  await ecrire(`${CHEMINS.cellulaire(cellHache)}${id}`, "1", "text/plain");
}

/** Ce que l'IA a coûté aujourd'hui, en dollars canadiens. */
export async function depensesDuJour(jour = jourMontreal()): Promise<number> {
  const usd = (await chemins(CHEMINS.depenses(jour))).reduce((somme, nom) => somme + lireDepense(nom), 0);
  return usd * STUDIO.tauxUsdCad;
}

export async function noterDepense(id: string, usd: number, jour = jourMontreal()): Promise<void> {
  if (usd <= 0) return;
  await ecrire(`${CHEMINS.depenses(jour)}${nomDepense(id, usd)}`, "1", "text/plain");
}

export async function plafondAtteint(): Promise<boolean> {
  return (await depensesDuJour()) >= STUDIO.plafondDepensesJour;
}

// ─── L'exemple (2e case cochée) ───

/** Copie l'avant et l'après hors de la date d'effacement, avec la preuve du consentement. */
export async function garderCommeExemple(fiche: Fiche, texteConsentement: string): Promise<void> {
  await Promise.all([
    copy(CHEMINS.photo(fiche.id, "originale"), CHEMINS.exemple(fiche.id, "avant"), { ...PRIVE, allowOverwrite: true }),
    copy(CHEMINS.photo(fiche.id, "vertical"), CHEMINS.exemple(fiche.id, "apres"), { ...PRIVE, allowOverwrite: true }),
    ecrire(
      CHEMINS.noteExemple(fiche.id),
      JSON.stringify({
        id: fiche.id,
        resto: fiche.resto,
        ville: fiche.ville,
        moteur: fiche.moteur,
        consentement: { texte: texteConsentement, horodatage: new Date().toISOString() },
      }),
      "application/json",
      { garde: false },
    ),
  ]);
}
