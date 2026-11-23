/* LE STUDIO PHOTO : les calculs purs (cadrage, verdict, coût, dates).

   Aucun import du site ici : ce fichier est testé tel quel par
   `node --test` (src/lib/studio.test.ts). */

/** Où est le plat dans l'image, en fractions de 0 à 1 (coin haut gauche, largeur, hauteur). */
export type Boite = { x: number; y: number; l: number; h: number };

/** Un rectangle en pixels. */
export type Zone = { gauche: number; haut: number; largeur: number; hauteur: number };

/** « rogner » : la zone a déjà le bon rapport. « completer » : le plat ne tient
    pas dans le format, on garde la zone entière et on complète les bords avec
    l'arrière-plan flouté (jamais on ne coupe le plat). */
export type Cadrage = { zone: Zone; mode: "rogner" | "completer" };

const borner = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Une boîte lisible, ou le centre de l'image (80 %) si le contrôle n'en a pas donné. */
export function boiteSure(b: Boite | null | undefined): Boite {
  const ok =
    b &&
    [b.x, b.y, b.l, b.h].every((n) => Number.isFinite(n)) &&
    b.l > 0.05 &&
    b.h > 0.05 &&
    b.x >= 0 &&
    b.y >= 0 &&
    b.x + b.l <= 1.001 &&
    b.y + b.h <= 1.001;
  return ok ? b : { x: 0.1, y: 0.1, l: 0.8, h: 0.8 };
}

/* LE CADRAGE D'UN FORMAT, SANS COUPER LE PLAT.

   On cherche le plus grand rectangle au bon rapport qui tient dans l'image. Si
   le plat (avec une petite marge) y entre, on le centre sur le plat et on
   rogne. Sinon on prend la plus petite zone qui contient le plat, et le format
   sera complété. */
export function cadrer(
  largeur: number,
  hauteur: number,
  boite: Boite | null | undefined,
  cibleLargeur: number,
  cibleHauteur: number,
  marge = 0.04,
): Cadrage {
  const b = boiteSure(boite);
  const rapport = cibleLargeur / cibleHauteur;

  // Le plat, en pixels, avec sa marge.
  const x0 = borner((b.x - marge) * largeur, 0, largeur);
  const y0 = borner((b.y - marge) * hauteur, 0, hauteur);
  const x1 = borner((b.x + b.l + marge) * largeur, 0, largeur);
  const y1 = borner((b.y + b.h + marge) * hauteur, 0, hauteur);
  const platL = x1 - x0;
  const platH = y1 - y0;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;

  // Le plus grand rectangle au bon rapport dans l'image.
  const maxL = largeur / hauteur > rapport ? hauteur * rapport : largeur;
  const maxH = largeur / hauteur > rapport ? hauteur : largeur / rapport;

  const arrondir = (z: Zone): Zone => {
    const gauche = borner(Math.round(z.gauche), 0, largeur - 1);
    const haut = borner(Math.round(z.haut), 0, hauteur - 1);
    return {
      gauche,
      haut,
      largeur: borner(Math.round(z.largeur), 1, largeur - gauche),
      hauteur: borner(Math.round(z.hauteur), 1, hauteur - haut),
    };
  };

  if (platL <= maxL + 0.5 && platH <= maxH + 0.5) {
    return {
      mode: "rogner",
      zone: arrondir({
        gauche: borner(cx - maxL / 2, 0, largeur - maxL),
        haut: borner(cy - maxH / 2, 0, hauteur - maxH),
        largeur: maxL,
        hauteur: maxH,
      }),
    };
  }

  // Le plat déborde du format : la plus petite zone au bon rapport qui le
  // contient, ramenée dans l'image là où elle en sort.
  const voulueL = platL / platH > rapport ? platL : platH * rapport;
  const voulueH = platL / platH > rapport ? platL / rapport : platH;
  const zoneL = Math.min(voulueL, largeur);
  const zoneH = Math.min(voulueH, hauteur);
  return {
    mode: "completer",
    zone: arrondir({
      gauche: borner(cx - zoneL / 2, 0, largeur - zoneL),
      haut: borner(cy - zoneH / 2, 0, hauteur - zoneH),
      largeur: zoneL,
      hauteur: zoneH,
    }),
  };
}

/** Les rapports que le moteur d'IA sait rendre. On lui demande celui de la photo
    d'origine, pour qu'il n'ait rien à inventer sur les bords. */
const RAPPORTS = ["1:1", "4:5", "5:4", "3:4", "4:3", "2:3", "3:2", "9:16", "16:9"] as const;
export type Rapport = (typeof RAPPORTS)[number];

export function rapportProche(largeur: number, hauteur: number): Rapport {
  const r = largeur / hauteur;
  let meilleur: Rapport = "1:1";
  let ecart = Infinity;
  for (const nom of RAPPORTS) {
    const [a, b] = nom.split(":").map(Number);
    const e = Math.abs(Math.log(r / (a / b)));
    if (e < ecart) {
      ecart = e;
      meilleur = nom;
    }
  }
  return meilleur;
}

/** Ce que répond le deuxième contrôle (l'originale comparée à la retouche). */
export type Verdict = {
  meme_plat: "oui" | "non" | "incertain";
  memes_aliments: boolean;
  memes_portions: boolean;
  meme_assiette: boolean;
  rien_ajoute: boolean;
  rien_enleve: boolean;
  differences: string[];
};

/** Un oui clair : « oui » ET les 5 points vrais. Tout le reste fait refaire la retouche. */
export function ouiClair(v: Verdict | null | undefined): boolean {
  return Boolean(
    v &&
      v.meme_plat === "oui" &&
      v.memes_aliments === true &&
      v.memes_portions === true &&
      v.meme_assiette === true &&
      v.rien_ajoute === true &&
      v.rien_enleve === true,
  );
}

/** Le coût d'un appel au modèle de vision, en dollars américains. */
export function coutJetonsUsd(entree: number, sortie: number, prixEntreeUsd: number, prixSortieUsd: number): number {
  return (entree * prixEntreeUsd + sortie * prixSortieUsd) / 1_000_000;
}

/** Le jour à Montréal, « 20261118 » : c'est lui qui borne le plafond et la limite par visiteur. */
export function jourMontreal(quand: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(quand)
    .replace(/-/g, "");
}

/** Une dépense s'écrit dans le NOM d'un petit fichier, en millionièmes de dollar :
    additionner la journée ne demande alors qu'une liste, sans rien ouvrir. */
export function nomDepense(id: string, usd: number): string {
  return `${id}-${Math.max(0, Math.round(usd * 1_000_000))}`;
}

export function lireDepense(nom: string): number {
  const m = /-(\d+)$/.exec(nom);
  return m ? Number(m[1]) / 1_000_000 : 0;
}
