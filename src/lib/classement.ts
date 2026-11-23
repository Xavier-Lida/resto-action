/* TON RANG SUR GOOGLE : LE CALCUL, SANS GOOGLE.

   Tout ce qui se vérifie à la main vit ici, sans réseau ni clé : fusionner les
   listes par identifiant de lieu, trier par nombre d'avis, trouver le rang,
   l'écart avec celui d'en avant, découper une ville en zones. Les appels à
   Google sont dans src/lib/classement-google.ts ; les textes et la table des
   types, dans src/lib/contenu/classement.ts.

   LA RÈGLE DU TRI, écrite à l'écran : le nombre d'avis Google, du plus grand au
   plus petit. À égalité d'avis, la meilleure note passe devant ; à égalité de
   note, l'ordre alphabétique, pour que deux recherches donnent le même rang.
   Le tri se fait CHEZ NOUS : Google ne trie pas par nombre d'avis. */

export type RestoClasse = {
  id: string;
  nom: string;
  avis: number;
  note: number | null;
};

export type RestoRange = RestoClasse & { rang: number };

export type Classement = {
  rang: number;
  total: number;
  moi: RestoRange;
  /** Les 2 restos juste devant, du plus proche au plus loin. Vide s'il est premier. */
  devant: RestoRange[];
  /** Les 3 premiers (moins s'il y a moins de 3 restos). */
  premiers: RestoRange[];
  /** Les avis qui manquent pour passer au rang d'en avant. `null` s'il est premier. */
  manque: number | null;
  /** S'il est premier : l'avance sur le 2e, en avis. `null` sinon, ou s'il est seul. */
  avance: number | null;
};

/** Une seule fiche par identifiant de lieu : les zones se recoupent, les restos ne se comptent pas deux fois. */
export function fusionner(listes: RestoClasse[][]): RestoClasse[] {
  const parId = new Map<string, RestoClasse>();
  for (const liste of listes) {
    for (const r of liste) {
      if (!parId.has(r.id)) parId.set(r.id, r);
    }
  }
  return [...parId.values()];
}

export function trier(restos: RestoClasse[]): RestoClasse[] {
  return [...restos].sort(
    (a, b) =>
      b.avis - a.avis ||
      (b.note ?? 0) - (a.note ?? 0) ||
      a.nom.localeCompare(b.nom, "fr-CA") ||
      a.id.localeCompare(b.id),
  );
}

/** Le rang d'un resto dans une liste. `null` s'il n'est pas dans la liste. */
export function classer(restos: RestoClasse[], monId: string): Classement | null {
  const ranges: RestoRange[] = trier(fusionner([restos])).map((r, k) => ({ ...r, rang: k + 1 }));
  const position = ranges.findIndex((r) => r.id === monId);
  if (position < 0) return null;

  const moi = ranges[position];
  // Du plus proche au plus loin : celui qu'il doit passer en premier, puis le suivant.
  const devant = ranges.slice(Math.max(0, position - 2), position).reverse();
  const suivant = ranges[position + 1];

  return {
    rang: moi.rang,
    total: ranges.length,
    moi,
    devant,
    premiers: ranges.slice(0, 3),
    // Pour PASSER devant, il en faut un de plus que lui : à égalité, il manque 1 avis.
    manque: devant.length > 0 ? devant[0].avis - moi.avis + 1 : null,
    avance: position === 0 && suivant ? moi.avis - suivant.avis : null,
  };
}

/** 1 → « 1er », 2 → « 2e », 14 → « 14e ». */
export function ordinal(n: number): string {
  return n === 1 ? "1er" : `${n}e`;
}

// ───────────────────────── Les zones ─────────────────────────

export type Point = { lat: number; lng: number };
/** Un rectangle : le coin sud-ouest (`bas`) et le coin nord-est (`haut`). */
export type Rectangle = { bas: Point; haut: Point };

/** Une ville coupée en 4 : quand une requête atteint la limite de Google, on
    repose la question dans chaque quart et on fusionne par identifiant. */
export function decouper(r: Rectangle): Rectangle[] {
  const milieu = { lat: (r.bas.lat + r.haut.lat) / 2, lng: (r.bas.lng + r.haut.lng) / 2 };
  return [
    { bas: r.bas, haut: milieu },
    { bas: { lat: r.bas.lat, lng: milieu.lng }, haut: { lat: milieu.lat, lng: r.haut.lng } },
    { bas: { lat: milieu.lat, lng: r.bas.lng }, haut: { lat: r.haut.lat, lng: milieu.lng } },
    { bas: milieu, haut: r.haut },
  ];
}

/** Le rectangle de secours, quand Google ne donne pas celui de la ville :
    environ 17 km de chaque côté du resto. */
export function rectangleAutour(p: Point): Rectangle {
  const dLat = 0.15;
  const dLng = 0.22;
  return { bas: { lat: p.lat - dLat, lng: p.lng - dLng }, haut: { lat: p.lat + dLat, lng: p.lng + dLng } };
}

export function contient(r: Rectangle, p: Point): boolean {
  return p.lat >= r.bas.lat && p.lat <= r.haut.lat && p.lng >= r.bas.lng && p.lng <= r.haut.lng;
}

/** « Trois-Rivières » et « trois rivieres » sont la même ville. */
export function memeVille(a: string, b: string): boolean {
  const net = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  return net(a) !== "" && net(a) === net(b);
}
