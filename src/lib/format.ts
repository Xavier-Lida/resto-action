/** Aides de mise en forme en français d'ici. */

const NBSP = " ";

/** Espaces insécables avant $, %, :, ;, ?, ! pour éviter les retours de ligne malheureux. */
export function fr(s: string): string {
  return s
    .replace(/ \$/g, `${NBSP}$`)
    .replace(/ %/g, `${NBSP}%`)
    .replace(/ :/g, `${NBSP}:`)
    .replace(/ ;/g, `${NBSP};`)
    .replace(/ \?/g, `${NBSP}?`)
    .replace(/ !/g, `${NBSP}!`)
    .replace(/(\d) (\d{3})/g, `$1${NBSP}$2`);
}

/** 629 → « 629 $ », 1500 → « 1 500 $ », 3.51 (2) → « 3,51 $ ». */
export function argent(n: number, decimales = 0): string {
  const abs = Math.abs(n);
  const s = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(abs);
  return n < 0 ? `−${s}` : s;
}

/** Comme argent(), avec le signe + devant les montants positifs. */
export function argentSigne(n: number, decimales = 0): string {
  return n > 0 ? `+${argent(n, decimales)}` : argent(n, decimales);
}

export function pourcent(p: number, decimales = 0): string {
  return new Intl.NumberFormat("fr-CA", {
    style: "percent",
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(p);
}

export function entier(n: number): string {
  return new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 0 }).format(n);
}

/* LES MÊMES AIDES, EN ANGLAIS. formats(langue) donne la typographie et les
   montants de la bonne langue : « 1 335 $ » en français, « $1,335 » en
   anglais. La typographie anglaise ne touche à rien. */
export type LangueFormat = "fr" | "en";

function argentEn(n: number, decimales = 0): string {
  const s = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(Math.abs(n));
  return n < 0 ? `−${s}` : s;
}

export function formats(langue: LangueFormat = "fr") {
  if (langue === "fr") return { typo: fr, argent, argentSigne, pourcent, entier };
  return {
    typo: (s: string) => s,
    argent: argentEn,
    argentSigne: (n: number, d = 0) => (n > 0 ? `+${argentEn(n, d)}` : argentEn(n, d)),
    pourcent: (p: number, d = 0) =>
      new Intl.NumberFormat("en-CA", { style: "percent", minimumFractionDigits: d, maximumFractionDigits: d }).format(p),
    entier: (n: number) => new Intl.NumberFormat("en-CA", { maximumFractionDigits: 0 }).format(n),
  };
}
