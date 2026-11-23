import convertirHeic from "heic-convert";
import sharp from "sharp";
import { cadrer, type Boite } from "@/lib/studio/cadrage";

/* LE STUDIO PHOTO : tout ce qui se fait CHEZ NOUS, sans génération.

   `sharp` ne sait que transformer des pixels qui existent : il ne peut rien
   inventer. Il sert à trois choses :
     1. ranger la photo reçue (HEIC d'iPhone → JPEG, bon sens, taille raisonnable) ;
     2. LA CORRECTION SANS GÉNÉRATION (lumière, blancs, couleurs, netteté),
        livrée quand la retouche par IA échoue 2 fois au contrôle, quand le
        moteur d'IA est en panne ou quand le plafond du jour est atteint ;
     3. les 2 formats livrés et les aperçus.

   Tout ce qui sort d'ici est SANS MÉTADONNÉES : `sharp` n'écrit ni le lieu, ni
   l'appareil, ni la date de la photo, à moins qu'on le lui demande (on ne le
   demande jamais), et ramène les couleurs en sRGB. */

const JPEG = { quality: 90, mozjpeg: true } as const;

/** Les photos d'iPhone : un conteneur HEIF que `sharp` ne lit pas (brevets HEVC). */
function estHeic(brut: Buffer): boolean {
  if (brut.length < 12 || brut.toString("latin1", 4, 8) !== "ftyp") return false;
  return ["heic", "heix", "hevc", "hevx", "heim", "heis", "mif1", "msf1"].includes(brut.toString("latin1", 8, 12));
}

/** La photo reçue, rangée : JPEG, à l'endroit, 3000 px au plus, sans métadonnées.
    Lance une erreur si le fichier n'est pas une image lisible. */
export async function normaliser(brut: Buffer): Promise<Buffer> {
  const source = estHeic(brut)
    ? Buffer.from(await convertirHeic({ buffer: brut, format: "JPEG", quality: 0.95 }))
    : brut;
  return sharp(source, { failOn: "error" })
    .rotate()
    .resize({ width: 3000, height: 3000, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();
}

export async function dimensions(jpeg: Buffer): Promise<{ largeur: number; hauteur: number }> {
  const m = await sharp(jpeg).metadata();
  return { largeur: m.width ?? 0, hauteur: m.height ?? 0 };
}

/** Une copie réduite (plus grand côté), pour un modèle de vision, le moteur d'IA ou un aperçu. */
export async function reduire(jpeg: Buffer, cote: number, qualite = 85): Promise<Buffer> {
  return sharp(jpeg)
    .resize({ width: cote, height: cote, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: qualite, mozjpeg: true })
    .toBuffer();
}

const borner = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/* LA CORRECTION SANS GÉNÉRATION.

   Balance des blancs : la moitié du chemin vers un gris moyen (« monde gris »),
   bornée à ±12 % par couleur, pour corriger une dominante jaune ou bleue sans
   dénaturer un plat qui EST rouge ou vert.
   Lumière : la moitié du chemin vers une exposition moyenne, bornée, puis un
   étirement doux du contraste. Couleurs : +10 % de saturation. Netteté : légère. */
export async function corriger(jpeg: Buffer): Promise<Buffer> {
  const { channels } = await sharp(jpeg).stats();
  const [r, v, b] = channels.slice(0, 3).map((c) => Math.max(1, c.mean));
  const gris = (r + v + b) / 3;
  const blanc = (m: number) => borner(1 + 0.5 * (gris / m - 1), 0.88, 1.12);
  const lumiere = borner(1 + 0.5 * (122 / gris - 1), 0.9, 1.35);

  return sharp(jpeg)
    .linear([blanc(r) * lumiere, blanc(v) * lumiere, blanc(b) * lumiere], [0, 0, 0])
    .normalise({ lower: 0.5, upper: 99.5 })
    .modulate({ saturation: 1.1 })
    .sharpen({ sigma: 0.8 })
    .jpeg(JPEG)
    .toBuffer();
}

/* UN FORMAT LIVRÉ (1080 × 1080 ou 1080 × 1350), SANS COUPER LE PLAT.

   Le calcul est dans cadrage.ts. Quand le plat ne tient pas dans le format, on
   garde la zone entière et on la pose sur elle-même, agrandie et floutée : les
   bords sont faits de l'arrière-plan de la photo, rien n'est généré. */
export async function format(
  jpeg: Buffer,
  boite: Boite | null | undefined,
  cible: { largeur: number; hauteur: number },
): Promise<Buffer> {
  const d = await dimensions(jpeg);
  const { zone, mode } = cadrer(d.largeur, d.hauteur, boite, cible.largeur, cible.hauteur);
  const extrait = await sharp(jpeg)
    .extract({ left: zone.gauche, top: zone.haut, width: zone.largeur, height: zone.hauteur })
    .toBuffer();

  if (mode === "rogner") {
    return sharp(extrait).resize(cible.largeur, cible.hauteur, { fit: "cover" }).jpeg(JPEG).toBuffer();
  }
  const [fond, devant] = await Promise.all([
    sharp(extrait).resize(cible.largeur, cible.hauteur, { fit: "cover" }).blur(40).toBuffer(),
    sharp(extrait).resize(cible.largeur, cible.hauteur, { fit: "inside" }).toBuffer(),
  ]);
  return sharp(fond).composite([{ input: devant, gravity: "centre" }]).jpeg(JPEG).toBuffer();
}
