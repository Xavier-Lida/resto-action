#!/usr/bin/env node
// Prépare les assets des démos animées de la section « Nos produits ».
//
// Les captures brutes sont des écrans iPhone @3x (1170 × 2532). Trois bandes :
//
//     y    0 →  141   status bar, identique partout
//     y  141 → 2190   contenu utile, c'est ça qu'on assemble
//     y 2190 → 2532   tab bar flottante
//
// Le composant translate une image longue par écran ; assembler ces images ici
// plutôt que dans le navigateur évite de charger neuf captures pleines et de
// recaler quoi que ce soit à l'exécution.
//
//     node scripts/preparer-demo-app.mjs
//     SOURCE=/chemin node scripts/preparer-demo-app.mjs
//     QUALITE=70 node scripts/preparer-demo-app.mjs
//
import sharp from "sharp";
import { mkdir, writeFile, readdir } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

const SOURCE = process.env.SOURCE || path.join(homedir(), "Downloads");
const SORTIE = path.resolve(import.meta.dirname, "../public/demo-app");
const VERIF = path.resolve(import.meta.dirname, ".demo-verif");
const GEOMETRIE = path.resolve(import.meta.dirname, "../src/lib/demo-app-geometrie.ts");

const LARGEUR = 1170;
const HAUTEUR = 2532;
const STATUS_BAS = 141;     // fin de la status bar
const CONTENU_BAS = 2190;   // début de la tab bar flottante
const LARGEUR_SORTIE = 780; // 2× la taille CSS max du mockup

/* ─── LES DÉMOS ───

   Une entrée par application. Tout ce qui a été MESURÉ sur les captures vit ici
   et nulle part ailleurs : le jour où une nouvelle app arrive, c'est le seul
   bloc à écrire.

   `ecrans` — un écran = une ou plusieurs captures consécutives d'un même
   défilement, dans l'ordre. `tabbar` nomme la capture d'où sort la variante de
   barre pour cet écran, ou `null` quand l'écran n'a pas de barre : sa bande va
   alors de 141 à 2532, toute la hauteur sous la status bar.

   `pilule` — la boîte de la barre flottante, à mesurer sur la capture dont le
   fond DERRIÈRE la barre est uni : c'est la seule où la silhouette est
   calculable. Mettre `null` si l'app n'a pas de barre flottante du tout.

   `qualites` — surcharge de qualité WebP par écran. Ne sert qu'aux images
   longues chargées de photos, qui pèsent à elles seules plus que tout le reste. */
const DEMOS = {
  client: {
    ecrans: {
      accueil: { captures: ["IMG_6740.PNG", "IMG_6741.PNG"], tabbar: "IMG_6740.PNG" },
      menu: {
        captures: ["IMG_6742.PNG", "IMG_6743.PNG", "IMG_6744.PNG", "IMG_6745.PNG"],
        tabbar: "IMG_6742.PNG",
      },
      compte: { captures: ["IMG_6746.PNG", "IMG_6747.PNG"], tabbar: "IMG_6746.PNG" },
      // Le panier a une flèche retour et un pied de page fixe, pas de barre.
      panier: { captures: ["IMG_6748.PNG"], tabbar: null },
    },
    fondTabbar: "IMG_6746.PNG",
    pilule: { haut: 2198, bas: 2435, gauche: 51, droite: 1121 },
    statusbar: "IMG_6740.PNG",
    logo: { source: "IMG_6740.PNG", gauche: 50, haut: 167, droite: 318, bas: 294 },
    qualites: { menu: 70, accueil: 76 },
  },

  /* Resto Action et Resto Go n'ont pas encore de captures. Le composant montre
     un cadre d'attente pour toute démo absente d'ici, et la mention s'efface
     d'elle-même le jour où le script produit les assets. Le gabarit :

  cuisine: {
    ecrans: {
      commandes: { captures: ["…"], tabbar: "…" },
      menu:      { captures: ["…"], tabbar: "…" },
      stats:     { captures: ["…"], tabbar: "…" },
    },
    fondTabbar: "…",   // la capture au fond uni derrière la barre
    pilule: { haut: 0, bas: 0, gauche: 0, droite: 0 },  // ou null, si pas de barre
    statusbar: "…",
    logo: null,        // ou { source, gauche, haut, droite, bas } pour le splash
    qualites: {},
  },
  */
};

// ─── Chargement ───

const cache = new Map();
async function brut(fichier) {
  if (!cache.has(fichier)) {
    const { data, info } = await sharp(path.join(SOURCE, fichier))
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    if (info.width !== LARGEUR || info.height !== HAUTEUR) {
      throw new Error(
        `${fichier} fait ${info.width}×${info.height}, attendu ${LARGEUR}×${HAUTEUR}`,
      );
    }
    cache.set(fichier, data);
  }
  return cache.get(fichier);
}

// Niveaux de gris d'une bande, pour la corrélation.
async function gris(fichier, haut, bas) {
  const px = await brut(fichier);
  const g = new Float32Array((bas - haut) * LARGEUR);
  for (let y = haut; y < bas; y++) {
    for (let x = 0; x < LARGEUR; x++) {
      const i = (y * LARGEUR + x) * 3;
      g[(y - haut) * LARGEUR + x] =
        0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
    }
  }
  return g;
}

// ─── Corrélation ───

// Combien de pixels B a-t-elle défilé par rapport à A ? On fait glisser une
// sonde prise en haut de B le long de A et on garde l'écart absolu moyen le plus
// faible.
//
// La sonde fait 300 lignes et pas 500 : au-delà, les décalages supérieurs à
// (hauteur − sonde) ne sont même plus testés, et les vrais décalages du menu
// tournent autour de 1600. C'est ce qui fait qu'une sonde trop haute tombe sur
// un faux minimum — les fiches du menu répètent toutes « 2 sauces au choix,
// laitue, tomate, oignons… », donc les faux minima ne manquent pas.
const SONDE = 300;

function decalage(a, b, hauteur) {
  const scores = [];
  for (let d = 1; d < hauteur - SONDE; d++) {
    let somme = 0;
    for (let y = 0; y < SONDE; y++) {
      const la = (d + y) * LARGEUR;
      const lb = y * LARGEUR;
      for (let x = 0; x < LARGEUR; x++) somme += Math.abs(a[la + x] - b[lb + x]);
    }
    scores.push([somme / (SONDE * LARGEUR), d]);
  }
  scores.sort((u, v) => u[0] - v[0]);
  const [erreur, d] = scores[0];
  // Le second minimum, en écartant le voisinage immédiat du premier.
  const second = scores.find(([, e]) => Math.abs(e - d) > 30);
  return { d, erreur, secondErreur: second ? second[0] : Infinity, second: second?.[1] };
}

// ─── Assemblage ───

async function assembler(captures, bas) {
  const hauteurBande = bas - STATUS_BAS;
  const decalages = [];

  for (let i = 0; i < captures.length - 1; i++) {
    const a = await gris(captures[i], STATUS_BAS, bas);
    const b = await gris(captures[i + 1], STATUS_BAS, bas);
    const r = decalage(a, b, hauteurBande);

    // Un bon raccord est quasi parfait : les deux captures montrent les mêmes
    // pixels. Si l'erreur est haute, ou si un autre décalage fait presque aussi
    // bien, c'est qu'on est tombé sur du texte répété — on s'arrête plutôt que
    // d'écrire en silence une image où un plat est dupliqué ou tronqué.
    if (r.erreur > 3) {
      throw new Error(
        `${captures[i]} → ${captures[i + 1]} : meilleur raccord à ${r.d} px, ` +
          `mais l'erreur est de ${r.erreur.toFixed(2)} (seuil 3). Raccord douteux.`,
      );
    }
    if (r.secondErreur < r.erreur * 3) {
      throw new Error(
        `${captures[i]} → ${captures[i + 1]} : ${r.d} px (erreur ${r.erreur.toFixed(2)}) ` +
          `talonné par ${r.second} px (erreur ${r.secondErreur.toFixed(2)}). Ambigu.`,
      );
    }
    console.log(
      `    ${captures[i]} → ${captures[i + 1]} : ${r.d} px ` +
        `(erreur ${r.erreur.toFixed(2)}, second ${r.secondErreur.toFixed(2)})`,
    );
    decalages.push(r.d);
  }

  const hauteur = decalages.reduce((s, d) => s + d, 0) + hauteurBande;
  const toile = Buffer.alloc(hauteur * LARGEUR * 3);
  let y = 0;
  for (let i = 0; i < captures.length; i++) {
    const px = await brut(captures[i]);
    const debut = STATUS_BAS * LARGEUR * 3;
    px.copy(toile, y * LARGEUR * 3, debut, debut + hauteurBande * LARGEUR * 3);
    if (i < decalages.length) y += decalages[i];
  }
  return { data: toile, hauteur };
}

// ─── Tab bars ───

// Une variante par onglet actif. La barre est une pilule opaque qui flotte
// au-dessus du contenu : sur la plupart des captures il y a donc du contenu
// derrière elle, et découper la bande telle quelle l'importerait dans l'asset.
//
// D'où la composition : le fond et l'ombre portée viennent de la capture au fond
// uni, la pilule seule vient de chaque capture, à travers une silhouette
// calculée sur ce même fond uni.
async function tabbars(demo) {
  const { pilule } = demo;
  const hauteur = HAUTEUR - CONTENU_BAS;
  const fond = Buffer.from((await brut(demo.fondTabbar)).subarray(CONTENU_BAS * LARGEUR * 3));

  // Les premières lignes de la bande portent encore du contenu sur toutes les
  // captures, celle au fond uni comprise : on les remplit du crème d'un peu
  // plus bas.
  const propre = pilule.haut - CONTENU_BAS + 2;
  for (let y = 0; y < propre; y++) {
    fond.copy(fond, y * LARGEUR * 3, propre * LARGEUR * 3, (propre + 1) * LARGEUR * 3);
  }

  // Silhouette. Le masque est BINAIRE et borné à la boîte de la pilule : un
  // alpha en rampe sur l'écart au fond laisse passer l'ombre portée, qui
  // franchit le seuil et laisse transparaître ~35 % de l'image source sous la
  // barre.
  const alpha = new Float32Array(hauteur * LARGEUR);
  const h0 = pilule.haut - CONTENU_BAS;
  const h1 = pilule.bas - CONTENU_BAS;
  // Test de luminance ABSOLUE, et pas d'écart au fond. La pilule est brun très
  // sombre (~30) et le bouton panier rouge (~90) ; le crème est à ~247 et son
  // ombre portée ne descend pas sous ~225. Un test d'écart, lui, attrape l'ombre
  // près des coins arrondis, l'étendue se remplit jusqu'au bord de la boîte, et
  // l'image source ressort dans le creux du coin.
  const SOMBRE = 140;
  for (let y = h0; y < h1; y++) {
    let min = Infinity;
    let max = -Infinity;
    for (let x = pilule.gauche; x < pilule.droite; x++) {
      const i = (y * LARGEUR + x) * 3;
      const lum = 0.299 * fond[i] + 0.587 * fond[i + 1] + 0.114 * fond[i + 2];
      if (lum < SOMBRE) {
        if (x < min) min = x;
        if (x > max) max = x;
      }
    }
    // Remplissage de l'étendue : sans lui, les libellés crème sur la pilule
    // brune deviendraient des trous, puisqu'ils ressemblent au fond.
    if (max - min < 8) continue;
    for (let x = min; x <= max; x++) alpha[y * LARGEUR + x] = 1;
    // Anticrénelage : une pente d'1,5 px sur le seul contour.
    for (let k = 1; k <= 2; k++) {
      const v = 1 - k / 3;
      const g = y * LARGEUR + min - k;
      const d = y * LARGEUR + max + k;
      if (min - k >= 0) alpha[g] = Math.max(alpha[g], v);
      if (max + k < LARGEUR) alpha[d] = Math.max(alpha[d], v);
    }
  }

  // Une variante par capture nommée dans `tabbar`, sans doublon.
  const sources = [...new Set(Object.values(demo.ecrans).map((e) => e.tabbar).filter(Boolean))];
  const parCapture = new Map();
  for (const source of sources) {
    const px = (await brut(source)).subarray(CONTENU_BAS * LARGEUR * 3);
    const out = Buffer.alloc(hauteur * LARGEUR * 3);
    for (let p = 0; p < hauteur * LARGEUR; p++) {
      const a = alpha[p];
      for (let c = 0; c < 3; c++) {
        out[p * 3 + c] =
          a === 0 ? fond[p * 3 + c] : px[p * 3 + c] * a + fond[p * 3 + c] * (1 - a);
      }
    }
    parCapture.set(source, { data: out, hauteur });
  }
  return parCapture;
}

// ─── Écriture ───

const QUALITE = Number(process.env.QUALITE || 80);

function image({ data, hauteur }) {
  return sharp(data, { raw: { width: LARGEUR, height: hauteur, channels: 3 } });
}

async function ecrire(dossier, nom, img, qualite) {
  const info = await img
    .resize({ width: LARGEUR_SORTIE })
    .webp({ quality: qualite })
    .toFile(path.join(dossier, `${nom}.webp`));
  return { nom, largeur: info.width, hauteur: info.height, octets: info.size };
}

// ─── Une démo ───

async function preparer(cle, demo, presents) {
  const requis = [
    ...Object.values(demo.ecrans).flatMap((e) => [...e.captures, e.tabbar]),
    demo.fondTabbar,
    demo.statusbar,
    demo.logo?.source,
  ].filter(Boolean);
  const manquants = [...new Set(requis)].filter((f) => !presents.has(f));
  if (manquants.length) {
    console.log(
      `\n${cle} : sautée — ${manquants.length} capture(s) absente(s) de ${SOURCE} ` +
        `(${manquants.slice(0, 3).join(", ")}${manquants.length > 3 ? ", …" : ""})`,
    );
    return null;
  }

  console.log(`\n${cle} :`);
  const dossier = path.join(SORTIE, cle);
  const verif = path.join(VERIF, cle);
  await mkdir(dossier, { recursive: true });
  await mkdir(verif, { recursive: true });

  const ecrits = [];
  const geometrie = { largeur: LARGEUR_SORTIE, ecrans: {} };
  const qualite = (nom) => demo.qualites?.[nom] ?? QUALITE;

  for (const [nom, ecran] of Object.entries(demo.ecrans)) {
    // Un écran sans barre occupe toute la hauteur sous la status bar ; les
    // autres s'arrêtent au haut de la pilule, sous laquelle il n'y a de toute
    // façon aucun pixel de contenu à montrer.
    const bas = ecran.tabbar && demo.pilule ? CONTENU_BAS : HAUTEUR;
    const assemble =
      ecran.captures.length > 1
        ? await assembler(ecran.captures, bas)
        : {
            data: (await brut(ecran.captures[0])).subarray(
              STATUS_BAS * LARGEUR * 3,
              bas * LARGEUR * 3,
            ),
            hauteur: bas - STATUS_BAS,
          };

    // Le PNG pleine résolution sert à relire l'assemblage à l'œil : c'est là
    // qu'on vérifie qu'aucun contenu n'est dupliqué ni tronqué.
    if (ecran.captures.length > 1) {
      await image(assemble).png().toFile(path.join(verif, `${nom}.png`));
    }
    const r = await ecrire(dossier, nom, image(assemble), qualite(nom));
    ecrits.push(r);
    geometrie.ecrans[nom] = { hauteur: r.hauteur, tabbar: Boolean(ecran.tabbar && demo.pilule) };
    console.log(`    ${nom} assemblé : ${LARGEUR} × ${assemble.hauteur}`);
  }

  if (demo.pilule) {
    const barres = await tabbars(demo);
    // Le nom de fichier d'une barre est celui de l'ÉCRAN où elle s'affiche, pas
    // celui de la capture : c'est l'écran que le composant connaît.
    for (const [nom, ecran] of Object.entries(demo.ecrans)) {
      if (!ecran.tabbar) continue;
      ecrits.push(await ecrire(dossier, `tabbar-${nom}`, image(barres.get(ecran.tabbar)), QUALITE));
    }
    geometrie.tabbar = Math.round(((HAUTEUR - CONTENU_BAS) * LARGEUR_SORTIE) / LARGEUR);
  } else {
    geometrie.tabbar = 0;
  }

  {
    const px = (await brut(demo.statusbar)).subarray(0, STATUS_BAS * LARGEUR * 3);
    ecrits.push(
      await ecrire(dossier, "statusbar", image({ data: px, hauteur: STATUS_BAS }), QUALITE),
    );
    geometrie.statusbar = Math.round((STATUS_BAS * LARGEUR_SORTIE) / LARGEUR);
  }
  // La fenêtre de contenu : elle s'arrête au haut de la barre quand il y en a
  // une, et va jusqu'en bas de l'écran sinon. C'est elle qui donne la course de
  // défilement, côté composant.
  const basContenu = demo.pilule ? CONTENU_BAS : HAUTEUR;
  geometrie.contenu = Math.round(((basContenu - STATUS_BAS) * LARGEUR_SORTIE) / LARGEUR);

  geometrie.logo = Boolean(demo.logo);
  if (demo.logo) {
    const px = await brut(demo.logo.source);
    const info = await sharp(px, { raw: { width: LARGEUR, height: HAUTEUR, channels: 3 } })
      .extract({
        left: demo.logo.gauche,
        top: demo.logo.haut,
        width: demo.logo.droite - demo.logo.gauche,
        height: demo.logo.bas - demo.logo.haut,
      })
      .resize({ width: 356 })
      .webp({ quality: 90 })
      .toFile(path.join(dossier, "logo.webp"));
    ecrits.push({ nom: "logo", largeur: info.width, hauteur: info.height, octets: info.size });
  }

  return { geometrie, ecrits };
}

// ─── Entrée ───

async function main() {
  await mkdir(SORTIE, { recursive: true });
  const presents = new Set(await readdir(SOURCE));

  const geometries = {};
  const ecrits = [];
  for (const [cle, demo] of Object.entries(DEMOS)) {
    const r = await preparer(cle, demo, presents);
    if (!r) continue;
    geometries[cle] = r.geometrie;
    ecrits.push(...r.ecrits.map((e) => ({ ...e, nom: `${cle}/${e.nom}` })));
  }

  if (!Object.keys(geometries).length) {
    throw new Error(`Aucune démo préparée. Captures introuvables dans ${SOURCE}.`);
  }

  // La géométrie sort en module TypeScript et pas en JSON dans public/ : le
  // composant l'importe, donc aucune requête et aucun recalage à l'exécution.
  await writeFile(
    GEOMETRIE,
    `// Généré par scripts/preparer-demo-app.mjs — ne pas éditer à la main.\n` +
      `// Hauteurs en pixels de l'image, dans le repère ${LARGEUR_SORTIE} px de large.\n` +
      `export const GEOMETRIE = ${JSON.stringify(geometries, null, 2)} as const;\n\n` +
      `export type Demo = keyof typeof GEOMETRIE;\n`,
  );

  console.log("\nAssets :");
  let total = 0;
  for (const r of ecrits) {
    total += r.octets;
    console.log(
      `  ${r.nom.padEnd(24)} ${String(r.largeur).padStart(4)} × ${String(r.hauteur).padEnd(5)} ` +
        `${(r.octets / 1024).toFixed(1).padStart(7)} Ko`,
    );
  }
  console.log(`  ${"TOTAL".padEnd(24)} ${" ".repeat(12)} ${(total / 1024).toFixed(1).padStart(7)} Ko`);
  if (total > 400 * 1024) {
    console.log(`\n⚠ Au-dessus des 400 Ko visés. Baisse QUALITE avant de toucher aux dimensions.`);
  }
  console.log(`\nRelis les PNG de ${path.relative(process.cwd(), VERIF)} avant de commiter.`);
}

main().catch((e) => {
  console.error(`\n✗ ${e.message}`);
  process.exit(1);
});
