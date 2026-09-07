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
import { mkdir, writeFile, readFile, readdir } from "node:fs/promises";
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

  /* Resto Go — captures prises sur l'iPhone de Xavier le 7 septembre 2026,
     compte livreur de démo, environnement de test Bistro Habibi. Elles vivent
     dans `source`, gitignoré, pas dans ~/Downloads.

     Trois différences avec l'app cliente, et chacune a sa clé :

     - la barre flottante porte un CERCLE surélevé qui change de place selon
       l'onglet (Stats à gauche, Accueil au centre, Compte à droite). La
       silhouette de la pilule vient toujours de `fondTabbar`, mais le cercle
       est un disque de rayon `cercle.rayon` dont le centre se lit sur chaque
       capture — c'est lui qui donne la variante ;
     - le cercle dépasse la barre de 42 px : `contenuBas` remonte la coupe pour
       le garder entier, là où le défaut de 2190 le décapiterait ;
     - les fonds de page diffèrent — blanc sur Stats, gris sur Compte, carte sur
       l'accueil. La bande de barre d'un écran se peint donc de SON `fond`, en
       gardant l'ombre portée lue sur `fondTabbar` (dont la page est `fondUni`).
       Et la barre d'état se prend par écran (`statusbar` d'écran) plutôt qu'une
       fois pour toutes, pour la même raison.

     Les états de l'accueil ne défilent pas (une carte) : ils sont des captures
     entières, barre comprise (`tabbar: null`), et la timeline passe de l'un à
     l'autre par `etat`. */
  livreur: {
    source: "scripts/captures/livreur",
    contenuBas: 2170,
    ecrans: {
      accueil: { captures: ["IMG_6859.PNG"], tabbar: null, statusbar: "IMG_6859.PNG" },
      attente: { captures: ["IMG_6870.PNG"], tabbar: null, statusbar: "IMG_6859.PNG" },
      // Offre et bandeau reprennent une commande de 70 $ avec 15 % de pourboire
      // (--panier=famille --pourboire=15 du seeder) : 14 $ au livreur, pas 3,50 $.
      offre: { captures: ["IMG_6871.PNG"], tabbar: null, statusbar: "IMG_6859.PNG" },
      itineraire: { captures: ["IMG_6866.PNG"], tabbar: null, statusbar: "IMG_6859.PNG" },
      enroute: { captures: ["IMG_6868.PNG"], tabbar: null, statusbar: "IMG_6859.PNG" },
      livree: { captures: ["IMG_6874.PNG"], tabbar: null, statusbar: "IMG_6859.PNG" },
      stats: {
        captures: ["IMG_6862.PNG", "IMG_6863.PNG"],
        tabbar: "IMG_6862.PNG",
        statusbar: "IMG_6862.PNG",
        fond: [255, 255, 255],
      },
      compte: {
        captures: ["IMG_6860.PNG", "IMG_6861.PNG"],
        tabbar: "IMG_6860.PNG",
        statusbar: "IMG_6860.PNG",
        fond: [240, 240, 237],
      },
    },
    // Stats défilé jusqu'en bas : page blanche et rien sous la barre.
    fondTabbar: "IMG_6863.PNG",
    fondUni: [255, 255, 255],
    // La pilule seule ; le cercle est décrit à part. `bas` va jusqu'au bord de
    // l'écran pour embarquer l'indicateur d'accueil dans la silhouette.
    pilule: { haut: 2226, bas: 2532, gauche: 48, droite: 1121 },
    cercle: { rayon: 84, sommet: 2185, teinte: [255, 48, 8] },
    statusbar: "IMG_6859.PNG",
    // La mascotte de l'écran de connexion, prise dans le dépôt de l'app plutôt
    // que découpée : son fond blanc passe en transparence sur le crème du splash.
    logo: { fichier: "../resto-action-livraison/assets/images/mascotte-livreur.webp", fondBlanc: true },
    // Les états de l'accueil sont sept captures entières, chargées de carte :
    // c'est là que pèse la démo.
    qualites: { accueil: 72, attente: 72, offre: 72, itineraire: 72, enroute: 72, livree: 72 },
  },

  /* Resto Action n'a pas encore de captures. Le composant montre un cadre
     d'attente pour toute démo absente d'ici, et la mention s'efface d'elle-même
     le jour où le script produit les assets. `livreur` sert de gabarit — pour
     une app sans barre flottante, mettre `pilule: null`. */
};

// ─── Chargement ───

/* Le dossier des captures d'une démo : le sien s'il en déclare un, sinon le
   dossier commun. La clé du cache porte le chemin complet, deux démos peuvent
   donc nommer leurs fichiers pareil sans se marcher dessus. */
let dossierSource = SOURCE;
const cache = new Map();
async function brut(fichier) {
  const chemin = path.join(dossierSource, fichier);
  if (!cache.has(chemin)) {
    const { data, info } = await sharp(chemin)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    if (info.width !== LARGEUR || info.height !== HAUTEUR) {
      throw new Error(
        `${fichier} fait ${info.width}×${info.height}, attendu ${LARGEUR}×${HAUTEUR}`,
      );
    }
    cache.set(chemin, data);
  }
  return cache.get(chemin);
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

// Une variante par écran à barre. La barre est une pilule opaque qui flotte
// au-dessus du contenu : sur la plupart des captures il y a donc du contenu
// derrière elle, et découper la bande telle quelle l'importerait dans l'asset.
//
// D'où la composition : le fond et l'ombre portée viennent de la capture au fond
// uni, la pilule seule vient de chaque capture, à travers une silhouette
// calculée sur ce même fond uni.
//
// Silhouette. Le masque est BINAIRE et borné à la boîte de la pilule : un
// alpha en rampe sur l'écart au fond laisse passer l'ombre portée, qui
// franchit le seuil et laisse transparaître ~35 % de l'image source sous la
// barre. Test de luminance ABSOLUE, et pas d'écart au fond. La pilule est
// sombre (~25 à 30) et le bouton rouge (~90 à 105) ; le crème est à ~247 et son
// ombre portée ne descend pas sous ~225. Un test d'écart, lui, attrape l'ombre
// près des coins arrondis, l'étendue se remplit jusqu'au bord de la boîte, et
// l'image source ressort dans le creux du coin.
const SOMBRE = 140;

function silhouette(px, hauteur, pilule, contenuBas) {
  const alpha = new Float32Array(hauteur * LARGEUR);
  const h0 = pilule.haut - contenuBas;
  const h1 = pilule.bas - contenuBas;
  for (let y = h0; y < h1; y++) {
    let min = Infinity;
    let max = -Infinity;
    for (let x = pilule.gauche; x < pilule.droite; x++) {
      const i = (y * LARGEUR + x) * 3;
      const lum = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
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
  return alpha;
}

// Le cercle surélevé d'une variante : son centre se lit sur la calotte, les
// premières rangées sous `sommet` — un segment d'au moins 24 px de SA COULEUR
// (`cercle.teinte`), pas simplement sombre : une carte de statistiques noire
// passe sous la barre à cette hauteur, et le rouge, lui, n'y est jamais. Le
// disque s'ajoute au masque avec la même pente d'1,5 px que la pilule.
function ajouterCercle(alpha, px, hauteur, demo, contenuBas, nom) {
  const { rayon, sommet, teinte } = demo.cercle;
  const { gauche, droite } = demo.pilule;
  let cx = null;
  for (let y = sommet - contenuBas; y < sommet - contenuBas + 14 && cx === null; y++) {
    let debut = -1;
    let meilleur = [0, -1];
    for (let x = gauche; x <= droite; x++) {
      const i = (y * LARGEUR + x) * 3;
      const sombre =
        x < droite &&
        Math.abs(px[i] - teinte[0]) + Math.abs(px[i + 1] - teinte[1]) + Math.abs(px[i + 2] - teinte[2]) < 90;
      if (sombre && debut < 0) debut = x;
      if (!sombre && debut >= 0) {
        if (x - debut > meilleur[1] - meilleur[0]) meilleur = [debut, x];
        debut = -1;
      }
    }
    if (meilleur[1] - meilleur[0] >= 24) cx = (meilleur[0] + meilleur[1] - 1) / 2;
  }
  if (cx === null) throw new Error(`${nom} : pas de cercle de cette teinte sous y=${sommet}.`);
  const cy = sommet - contenuBas + rayon;
  const y0 = Math.max(0, Math.floor(cy - rayon - 2));
  const y1 = Math.min(hauteur - 1, Math.ceil(cy + rayon + 2));
  for (let y = y0; y <= y1; y++) {
    for (let x = Math.floor(cx - rayon - 2); x <= Math.ceil(cx + rayon + 2); x++) {
      if (x < 0 || x >= LARGEUR) continue;
      const dist = Math.hypot(x - cx, y - cy);
      const a = Math.min(1, Math.max(0, (rayon + 0.75 - dist) / 1.5));
      const i = y * LARGEUR + x;
      if (a > alpha[i]) alpha[i] = a;
    }
  }
  console.log(`    cercle de ${nom} centré en x=${cx}`);
}

async function tabbars(demo, contenuBas) {
  const { pilule } = demo;
  const hauteur = HAUTEUR - contenuBas;
  const fond = Buffer.from((await brut(demo.fondTabbar)).subarray(contenuBas * LARGEUR * 3));

  // Les premières lignes de la bande portent encore du contenu sur toutes les
  // captures, celle au fond uni comprise : on les remplit d'une rangée propre —
  // celle du haut de la bande quand un cercle dépasse la barre (c'est à ça que
  // sert `contenuBas`), celle d'un peu plus bas sinon.
  const propre = demo.cercle ? 0 : pilule.haut - contenuBas + 2;
  const limite = demo.cercle ? pilule.haut - contenuBas : propre;
  for (let y = 0; y < limite; y++) {
    fond.copy(fond, y * LARGEUR * 3, propre * LARGEUR * 3, (propre + 1) * LARGEUR * 3);
  }

  const base = silhouette(fond, hauteur, pilule, contenuBas);

  // Une variante par écran à barre. Son fond : la capture au fond uni telle
  // quelle, ou — quand l'écran déclare un `fond` — cette couleur, assombrie
  // pixel à pixel comme le fond uni l'est par l'ombre de la barre.
  const parEcran = new Map();
  for (const [nom, ecran] of Object.entries(demo.ecrans)) {
    if (!ecran.tabbar) continue;
    const px = (await brut(ecran.tabbar)).subarray(contenuBas * LARGEUR * 3);
    const alpha = demo.cercle ? Float32Array.from(base) : base;
    if (demo.cercle) ajouterCercle(alpha, px, hauteur, demo, contenuBas, nom);

    const uni = demo.fondUni ?? [255, 255, 255];
    const teinte = ecran.fond;
    const out = Buffer.alloc(hauteur * LARGEUR * 3);
    for (let p = 0; p < hauteur * LARGEUR; p++) {
      const a = alpha[p];
      for (let c = 0; c < 3; c++) {
        const f = teinte ? (teinte[c] * fond[p * 3 + c]) / uni[c] : fond[p * 3 + c];
        out[p * 3 + c] = a === 0 ? f : px[p * 3 + c] * a + f * (1 - a);
      }
    }
    parEcran.set(nom, { data: out, hauteur });
  }
  return parEcran;
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

// ─── Logo du splash ───

// Découpé dans une capture, ou lu tel quel dans un fichier — l'asset de l'app,
// quand on l'a sous la main. `fondBlanc` rend le blanc pur transparent : le
// splash est crème, un carré blanc s'y verrait.
async function logo(config) {
  if (!config.fichier) {
    const px = await brut(config.source);
    return sharp(px, { raw: { width: LARGEUR, height: HAUTEUR, channels: 3 } })
      .extract({
        left: config.gauche,
        top: config.haut,
        width: config.droite - config.gauche,
        height: config.bas - config.haut,
      })
      .resize({ width: 356 });
  }
  const fichier = path.resolve(import.meta.dirname, "..", config.fichier);
  if (!config.fondBlanc) return sharp(fichier).resize({ width: 356 });
  const { data, info } = await sharp(fichier).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] >= 250 && data[i + 1] >= 250 && data[i + 2] >= 250) data[i + 3] = 0;
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).resize({
    width: 356,
  });
}

// ─── Une démo ───

async function preparer(cle, demo) {
  dossierSource = demo.source ? path.resolve(import.meta.dirname, "..", demo.source) : SOURCE;
  const presents = new Set(await readdir(dossierSource).catch(() => []));
  const requis = [
    ...Object.values(demo.ecrans).flatMap((e) => [...e.captures, e.tabbar, e.statusbar]),
    demo.fondTabbar,
    demo.statusbar,
    demo.logo?.source,
  ].filter(Boolean);
  const manquants = [...new Set(requis)].filter((f) => !presents.has(f));
  if (manquants.length) {
    console.log(
      `\n${cle} : sautée — ${manquants.length} capture(s) absente(s) de ${dossierSource} ` +
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
  const contenuBas = demo.contenuBas ?? CONTENU_BAS;

  for (const [nom, ecran] of Object.entries(demo.ecrans)) {
    // Un écran sans barre occupe toute la hauteur sous la status bar ; les
    // autres s'arrêtent au haut de la pilule, sous laquelle il n'y a de toute
    // façon aucun pixel de contenu à montrer.
    const bas = ecran.tabbar && demo.pilule ? contenuBas : HAUTEUR;
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
    // Le nom de fichier d'une barre est celui de l'ÉCRAN où elle s'affiche, pas
    // celui de la capture : c'est l'écran que le composant connaît.
    const barres = await tabbars(demo, contenuBas);
    for (const [nom, barre] of barres) {
      ecrits.push(await ecrire(dossier, `tabbar-${nom}`, image(barre), QUALITE));
    }
    geometrie.tabbar = Math.round(((HAUTEUR - contenuBas) * LARGEUR_SORTIE) / LARGEUR);
  } else {
    geometrie.tabbar = 0;
  }

  // La barre d'état : une pour tous, ou une par écran dès qu'un écran nomme la
  // sienne — le cas des apps dont les pages n'ont pas toutes le même fond.
  const statusbars = new Map();
  const parEcran = Object.values(demo.ecrans).some((e) => e.statusbar);
  for (const [nom, ecran] of Object.entries(demo.ecrans)) {
    const source = ecran.statusbar ?? demo.statusbar;
    if (!parEcran && statusbars.size) break;
    const px = (await brut(source)).subarray(0, STATUS_BAS * LARGEUR * 3);
    const fichier = parEcran ? `statusbar-${nom}` : "statusbar";
    ecrits.push(await ecrire(dossier, fichier, image({ data: px, hauteur: STATUS_BAS }), QUALITE));
    statusbars.set(nom, fichier);
  }
  geometrie.statusbar = Math.round((STATUS_BAS * LARGEUR_SORTIE) / LARGEUR);
  geometrie.statusbarParEcran = parEcran;

  // La fenêtre de contenu : elle s'arrête au haut de la barre quand il y en a
  // une, et va jusqu'en bas de l'écran sinon. C'est elle qui donne la course de
  // défilement, côté composant.
  const basContenu = demo.pilule ? contenuBas : HAUTEUR;
  geometrie.contenu = Math.round(((basContenu - STATUS_BAS) * LARGEUR_SORTIE) / LARGEUR);

  geometrie.logo = Boolean(demo.logo);
  if (demo.logo) {
    const info = await (await logo(demo.logo)).webp({ quality: 90 }).toFile(path.join(dossier, "logo.webp"));
    ecrits.push({ nom: "logo", largeur: info.width, hauteur: info.height, octets: info.size });
  }

  return { geometrie, ecrits };
}

// ─── Entrée ───

/* La géométrie déjà écrite : une démo sautée faute de captures garde son entrée
   telle quelle, sinon relancer le script pour une seule app effacerait les
   autres du site. Le module est du TypeScript, mais le seul objet qu'il porte
   est du JSON tel quel. */
async function geometrieExistante() {
  try {
    const texte = await readFile(GEOMETRIE, "utf8");
    const m = texte.match(/export const GEOMETRIE = ([\s\S]*?) as const;/);
    return m ? JSON.parse(m[1]) : {};
  } catch {
    return {};
  }
}

async function main() {
  await mkdir(SORTIE, { recursive: true });

  const geometries = await geometrieExistante();
  const ecrits = [];
  let preparees = 0;
  for (const [cle, demo] of Object.entries(DEMOS)) {
    const r = await preparer(cle, demo);
    if (!r) continue;
    preparees++;
    geometries[cle] = r.geometrie;
    ecrits.push(...r.ecrits.map((e) => ({ ...e, nom: `${cle}/${e.nom}` })));
  }

  if (!preparees) {
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
