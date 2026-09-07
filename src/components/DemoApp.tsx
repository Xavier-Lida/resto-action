"use client";

import { useEffect, useMemo, useRef } from "react";
import { GEOMETRIE, type Demo } from "@/lib/demo-app-geometrie";

/* ─── Les timelines ───

   Une par démo, déclarative, et c'est le seul endroit à toucher pour régler le
   déroulé : le moteur plus bas ne connaît que trois formes d'étape.

   `de` et `a` sont des fractions de la course de l'écran — 0 en haut, 1 en bas.
   `pause` est le temps d'arrêt APRÈS le mouvement, en millisecondes. Elles ont
   l'air longues écrites ici ; à l'écran elles ne le sont pas, c'est ce qui laisse
   le temps de lire.

   `fondu` change d'écran comme un changement d'onglet : le sortant s'efface,
   l'entrant arrive en s'agrandissant. `etat` est le même écran dans un autre
   état — une feuille qui change au bas d'une carte — et se contente d'un fondu
   croisé, sans zoom : rien n'a bougé, seule la feuille a changé.

   Les noms d'écran et d'onglet sont ceux des clés `ecrans` de la config du
   script — ils sont vérifiés contre la géométrie au montage, et une étape qui
   nomme un écran inconnu fait basculer tout le mockup sur le cadre d'attente
   plutôt que d'afficher un téléphone vide. */
type Etape =
  | { ecran: string; tab: string | null; de: number; a: number; pause: number }
  | { fondu: string }
  | { etat: string }
  | { splash: true };

const TIMELINES: Record<string, Etape[]> = {
  client: [
    { ecran: "accueil", tab: "accueil", de: 0, a: 0, pause: 1600 },
    { ecran: "accueil", tab: "accueil", de: 0, a: 1, pause: 2400 },
    { fondu: "menu" },
    { ecran: "menu", tab: "menu", de: 0, a: 0, pause: 1600 },
    { ecran: "menu", tab: "menu", de: 0, a: 0.34, pause: 2000 },
    { ecran: "menu", tab: "menu", de: 0.34, a: 0.67, pause: 2000 },
    { ecran: "menu", tab: "menu", de: 0.67, a: 1, pause: 2000 },
    { fondu: "compte" },
    { ecran: "compte", tab: "compte", de: 0, a: 0, pause: 1800 },
    { ecran: "compte", tab: "compte", de: 0, a: 1, pause: 2200 },
    { fondu: "panier" },
    { ecran: "panier", tab: null, de: 0, a: 0, pause: 3000 },
    { splash: true },
  ],

  /* Resto Go raconte une course : l'accueil ne défile pas — c'est une carte —
     il change d'état, et chaque état est une capture entière. On enchaîne par
     `etat`, sans zoom, comme la feuille du bas le fait dans l'app. Stats et
     Compte, eux, sont de vrais onglets et défilent. */
  livreur: [
    { ecran: "accueil", tab: null, de: 0, a: 0, pause: 1800 },
    { etat: "attente" },
    { ecran: "attente", tab: null, de: 0, a: 0, pause: 1500 },
    { etat: "offre" },
    { ecran: "offre", tab: null, de: 0, a: 0, pause: 2800 },
    { etat: "itineraire" },
    { ecran: "itineraire", tab: null, de: 0, a: 0, pause: 1800 },
    { etat: "enroute" },
    { ecran: "enroute", tab: null, de: 0, a: 0, pause: 2200 },
    { etat: "livree" },
    { ecran: "livree", tab: null, de: 0, a: 0, pause: 2400 },
    { fondu: "stats" },
    { ecran: "stats", tab: "stats", de: 0, a: 0, pause: 1600 },
    { ecran: "stats", tab: "stats", de: 0, a: 1, pause: 2000 },
    { fondu: "compte" },
    { ecran: "compte", tab: "compte", de: 0, a: 0, pause: 1400 },
    { ecran: "compte", tab: "compte", de: 0, a: 1, pause: 2000 },
    { splash: true },
  ],

  // Resto Action attend ses captures. Ajouter son entrée ici en même temps que
  // celle du script suffit à la faire tourner.
};

const DUREE_DEFILEMENT = 1900; // quelle que soit la distance parcourue
const DUREE_FONDU = 420;
const DUREE_ETAT = 380;
const PART_SORTIE = 0.3; // le calque sortant s'efface sur les 30 premiers %
const DUREE_TABBAR = 300;
const SPLASH_ENTREE = 340;
const SPLASH_MAINTIEN = 900;

/* Courbe SYMÉTRIQUE. Surtout pas un easeOut : la symétrie est ce qui rend le
   mouvement calme au lieu de nerveux — un doigt qui lance une liste accélère
   autant qu'il ralentit. */
const adoucir = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

type Jeu = (typeof GEOMETRIE)[Demo];

/* Une démo est jouable si ses assets existent ET si sa timeline ne nomme que des
   écrans qu'ils contiennent. Les deux peuvent diverger — on ajoute une timeline
   avant de relancer le script, ou on renomme un écran dans la config — et le
   symptôme serait un téléphone vide, difficile à relier à sa cause. */
function jouable(demo: string): { jeu: Jeu; timeline: Etape[] } | null {
  const jeu = (GEOMETRIE as Record<string, Jeu>)[demo];
  const timeline = TIMELINES[demo];
  if (!jeu || !timeline) return null;

  const connus = new Set(Object.keys(jeu.ecrans));
  const inconnu = timeline.find(
    (e) =>
      ("ecran" in e && !connus.has(e.ecran)) ||
      ("fondu" in e && !connus.has(e.fondu)) ||
      ("etat" in e && !connus.has(e.etat)),
  );
  if (inconnu) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `DemoApp : la timeline « ${demo} » nomme un écran absent des assets`,
        inconnu,
      );
    }
    return null;
  }
  return { jeu, timeline };
}

/* La course d'un écran, en pixels de l'image. La fenêtre visible s'arrête au
   haut de la tab bar quand il y en a une ; un écran sans barre — le panier —
   occupe toute la hauteur sous la status bar et ne défile donc pas. */
function course(jeu: Jeu, ecran: string) {
  const e = (jeu.ecrans as Record<string, { hauteur: number; tabbar: boolean }>)[ecran];
  const fenetre = e.tabbar ? jeu.contenu : jeu.contenu + jeu.tabbar;
  return Math.max(0, e.hauteur - fenetre);
}

export default function DemoApp({
  demo,
  alt,
  attente,
  className = "",
  style,
}: {
  demo: string;
  /** Décrit ce que la boucle montre. Inutile pour un cadre d'attente, qui n'est
      pas une image mais un texte. */
  alt?: string;
  /** Le texte du cadre d'attente, tant que la démo n'a pas d'assets. */
  attente: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const scene = useRef<HTMLDivElement>(null);

  /* Mémoïsé, et pas seulement par économie : ces trois valeurs sont dans les
     dépendances de l'effet, qui doit rejouer quand `demo` change et à ce
     moment-là seulement. Recalculées à chaque rendu, elles relanceraient la
     boucle d'animation à chaque rendu du parent. */
  const pret = useMemo(() => jouable(demo), [demo]);
  const jeu = pret?.jeu;
  const ecrans = useMemo(() => (jeu ? Object.keys(jeu.ecrans) : []), [jeu]);
  const onglets = useMemo(
    () =>
      jeu
        ? ecrans.filter((e) => (jeu.ecrans as Record<string, { tabbar: boolean }>)[e].tabbar)
        : [],
    [jeu, ecrans],
  );

  useEffect(() => {
    const racine = scene.current;
    if (!racine || !pret) return;
    const { jeu, timeline } = pret;

    // Mouvement réduit : pas d'animation du tout, et pas de repli plus lent non
    // plus. L'écran Accueil est déjà rendu figé en haut, il n'y a rien à faire.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let arrete = false;
    let raf = 0;
    let reveil: (() => void) | null = null;
    /* Optimiste au départ, et corrigé par l'observateur au premier rapport : si
       on partait de `false`, une livraison tardive — ou absente, ce qui arrive
       en environnement de capture — laisserait la boucle bloquée pour de bon.
       Dans le mauvais sens, l'erreur ne coûte qu'une pause de trop. */
    let visible = true;

    const gele = () => !visible || document.hidden;
    const q = <T extends Element>(sel: string) => racine.querySelector<T>(sel)!;

    const couche = (e: string) => q<HTMLDivElement>(`[data-couche="${e}"]`);
    const contenu = (e: string) => q<HTMLImageElement>(`[data-contenu="${e}"]`);
    const barre = (o: string) => q<HTMLImageElement>(`[data-tabbar="${o}"]`);
    const splash = racine.querySelector<HTMLDivElement>("[data-splash]");

    /* Le contenu se translate en pourcentage de SA PROPRE hauteur : la valeur
       reste juste quelle que soit la taille d'affichage du mockup, donc aucune
       mesure en pixels n'est nécessaire au montage. */
    const hauteurDe = (e: string) =>
      (jeu.ecrans as Record<string, { hauteur: number }>)[e].hauteur;

    const poser = (e: string, fraction: number) => {
      const y = (course(jeu, e) * fraction * 100) / hauteurDe(e);
      contenu(e).style.transform = `translate3d(0, ${-y}%, 0)`;
    };

    const montrer = (e: string) => {
      for (const autre of ecrans) {
        const c = couche(autre);
        c.style.transition = "none";
        c.style.opacity = autre === e ? "1" : "0";
        c.style.transform = "none";
      }
    };

    const onglet = (o: string | null, duree = 0) => {
      for (const autre of onglets) {
        const b = barre(autre);
        b.style.transition = duree ? `opacity ${duree}ms ease-out` : "none";
        b.style.opacity = autre === o ? "1" : "0";
      }
    };

    // Une attente qui ne s'écoule que quand la démo est visible et l'onglet au
    // premier plan : on ne consomme pas de batterie pour une animation que
    // personne ne regarde, et la boucle reprend là où elle en était.
    //
    // Le sommeil est découpé en tranches plutôt que posé d'un bloc : une tranche
    // écoulée pendant que l'onglet passe en arrière-plan coûte au pire 120 ms de
    // dérive, contre toute une pause si on dormait d'un seul tenant.
    let minuteur = 0;
    const attendreActif = () =>
      gele()
        ? new Promise<void>((resoudre) => {
            reveil = resoudre;
          })
        : Promise.resolve();

    const dormir = async (ms: number) => {
      let reste = ms;
      while (reste > 0 && !arrete) {
        await attendreActif();
        if (arrete) return;
        const depart = performance.now();
        await new Promise<void>((resoudre) => {
          minuteur = window.setTimeout(resoudre, Math.min(reste, 120));
        });
        reste -= performance.now() - depart;
      }
    };

    const defiler = (e: string, de: number, a: number) =>
      new Promise<void>((resoudre) => {
        const img = contenu(e);
        const h = hauteurDe(e);
        const max = course(jeu, e);
        let precedent: number | null = null;
        let ecoule = 0;
        const pas = (t: number) => {
          if (arrete) return resoudre();
          // Gelé : on ne cumule pas le temps, donc le mouvement reprend
          // exactement où il s'était arrêté.
          if (gele()) {
            precedent = null;
            raf = requestAnimationFrame(pas);
            return;
          }
          if (precedent !== null) ecoule += t - precedent;
          precedent = t;
          const p = Math.min(1, ecoule / DUREE_DEFILEMENT);
          const v = de + (a - de) * adoucir(p);
          img.style.transform = `translate3d(0, ${-((max * v * 100) / h)}%, 0)`;
          if (p < 1) raf = requestAnimationFrame(pas);
          else resoudre();
        };
        raf = requestAnimationFrame(pas);
      });

    /* Fondu TRAVERSANT, pas croisé : le calque sortant tombe à zéro avant que
       l'entrant commence à paraître. Les deux opacités ne se chevauchent jamais
       — c'est ce qui évite de voir deux interfaces en transparence l'une sur
       l'autre, ce qu'un vrai changement d'onglet ne fait pas. */
    const fondre = async (sortant: string, entrant: string, tab: string | null) => {
      const sortie = DUREE_FONDU * PART_SORTIE;
      const entree = DUREE_FONDU - sortie;
      const a = couche(sortant);
      const b = couche(entrant);

      onglet(tab, DUREE_TABBAR);
      a.style.transition = `opacity ${sortie}ms ease-out`;
      a.style.opacity = "0";
      await dormir(sortie);
      if (arrete) return;

      b.style.transition = "none";
      b.style.transform = "scale(0.94)";
      b.style.opacity = "0";
      void b.offsetHeight; // force le recalcul avant de repartir en transition
      b.style.transition = `opacity ${entree}ms ease-out, transform ${entree}ms ease-out`;
      b.style.transform = "scale(1)";
      b.style.opacity = "1";
      await dormir(entree);
    };

    /* Fondu CROISÉ, lui : l'écran reste le même, seule sa feuille change, et
       les deux calques partagent le même fond — les voir se superposer un
       instant est exactement ce qu'un vrai changement d'état donne. */
    const basculer = async (sortant: string, entrant: string, tab: string | null) => {
      const a = couche(sortant);
      const b = couche(entrant);
      onglet(tab, DUREE_TABBAR);
      b.style.transition = "none";
      b.style.transform = "none";
      b.style.opacity = "0";
      void b.offsetHeight;
      a.style.transition = `opacity ${DUREE_ETAT}ms ease-in-out`;
      b.style.transition = `opacity ${DUREE_ETAT}ms ease-in-out`;
      a.style.opacity = "0";
      b.style.opacity = "1";
      await dormir(DUREE_ETAT);
    };

    /* Le splash masque la couture de la boucle : c'est derrière lui qu'on remet
       tous les calques à zéro, donc le retour au début ne se voit pas. */
    const finBoucle = async () => {
      // Sans logo, pas de splash : on remet tout à zéro sans rien masquer. La
      // couture se voit alors au bouclage — d'où le logo, quand il existe.
      const remettre = () => {
        for (const e of ecrans) poser(e, 0);
        montrer(ecrans[0]);
        onglet(onglets.includes(ecrans[0]) ? ecrans[0] : null);
      };
      if (!splash) return remettre();

      splash.style.transition = `opacity ${SPLASH_ENTREE}ms ease-out`;
      splash.style.opacity = "1";
      await dormir(SPLASH_ENTREE);
      if (arrete) return;
      remettre();
      await dormir(SPLASH_MAINTIEN);
      if (arrete) return;
      splash.style.opacity = "0";
      await dormir(SPLASH_ENTREE);
    };

    async function boucler() {
      // On ne démarre qu'une fois le premier écran réellement décodé : sinon la
      // première transition joue sur une image vide.
      try {
        await contenu(ecrans[0]).decode();
      } catch {
        /* image déjà en cache, ou format refusé : on continue quand même */
      }
      while (!arrete) {
        let actuel = ecrans[0];
        for (const etape of timeline) {
          if (arrete) return;
          if ("fondu" in etape || "etat" in etape) {
            const suivant = "fondu" in etape ? etape.fondu : etape.etat;
            const tab = onglets.includes(suivant) ? suivant : null;
            if ("fondu" in etape) await fondre(actuel, suivant, tab);
            else await basculer(actuel, suivant, tab);
            actuel = suivant;
            continue;
          }
          if ("splash" in etape) {
            await finBoucle();
            actuel = ecrans[0];
            continue;
          }
          actuel = etape.ecran;
          if (etape.de === etape.a) poser(etape.ecran, etape.de);
          else await defiler(etape.ecran, etape.de, etape.a);
          await dormir(etape.pause);
        }
      }
    }

    // La boucle ne tourne que quand le mockup est visible à au moins 10 %.
    const reprendre = () => {
      if (gele() || !reveil) return;
      const r = reveil;
      reveil = null;
      r();
    };

    const observateur = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        reprendre();
      },
      { threshold: 0.1 },
    );
    observateur.observe(racine);

    document.addEventListener("visibilitychange", reprendre);

    /* La barre du premier écran, s'il en a une : un premier écran pris entier,
       barre comprise, n'en veut aucune par-dessus. */
    montrer(ecrans[0]);
    onglet(onglets.includes(ecrans[0]) ? ecrans[0] : null);
    void boucler();

    return () => {
      arrete = true;
      cancelAnimationFrame(raf);
      clearTimeout(minuteur);
      observateur.disconnect();
      document.removeEventListener("visibilitychange", reprendre);
      reveil?.();
    };
  }, [pret, ecrans, onglets]);

  /* Le cadre PAR-DESSUS le contenu : sa Dynamic Island est dessinée en opaque,
     elle doit donc recouvrir l'écran et pas l'inverse. Il est décoratif dans les
     deux cas — c'est ce qu'il y a DEDANS qui porte le sens. */
  const cadre = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/telephone_cadre.avif"
      alt=""
      width={780}
      height={1598}
      draggable={false}
      fetchPriority={pret ? "high" : "low"}
      className="demo-cadre"
    />
  );

  /* Pas encore d'assets pour cette démo : on garde la place, à la taille et au
     rayon exacts du vrai mockup. La mention est du VRAI texte, pas une image —
     le cadre d'attente n'a donc pas de `role="img"`, contrairement à la boucle.

     Ce repli s'efface tout seul le jour où le script produit les assets et où la
     timeline existe : rien à changer ici ni dans la section. */
  if (!pret) {
    return (
      <div className={`demo-stage ${className}`} style={style}>
        <div className="demo-screen demo-attente">
          <p>{attente}</p>
        </div>
        {cadre}
      </div>
    );
  }

  const premier = ecrans[0];
  /* Une barre d'état par écran quand les pages n'ont pas toutes le même fond :
     elle vit alors DANS le calque de l'écran, et s'en va avec lui. */
  const statusbarParEcran = Boolean(
    (jeu as { statusbarParEcran?: boolean }).statusbarParEcran,
  );
  const statusbar = (e: string | null) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/demo-app/${demo}/${e ? `statusbar-${e}` : "statusbar"}.webp`}
      alt=""
      width={jeu!.largeur}
      height={jeu!.statusbar}
      draggable={false}
      className="demo-statusbar"
    />
  );

  return (
    <div
      ref={scene}
      className={`demo-stage ${className}`}
      style={style}
      aria-label={alt}
      role="img"
    >
      <div className="demo-screen">
        {ecrans.map((e) => (
          <div key={e} data-couche={e} className="demo-couche">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-contenu={e}
              src={`/demo-app/${demo}/${e}.webp`}
              alt=""
              width={jeu!.largeur}
              height={(jeu!.ecrans as Record<string, { hauteur: number }>)[e].hauteur}
              draggable={false}
              loading={e === premier ? "eager" : "lazy"}
              fetchPriority={e === premier ? "high" : "low"}
              decoding="async"
              className="demo-contenu"
            />
            {statusbarParEcran && statusbar(e)}
          </div>
        ))}

        {!statusbarParEcran && statusbar(null)}

        {onglets.map((o) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={o}
            data-tabbar={o}
            src={`/demo-app/${demo}/tabbar-${o}.webp`}
            alt=""
            width={jeu!.largeur}
            height={jeu!.tabbar}
            draggable={false}
            className="demo-tabbar"
          />
        ))}

        {jeu!.logo && (
          <div data-splash className="demo-splash">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/demo-app/${demo}/logo.webp`}
              alt=""
              width={356}
              height={169}
              draggable={false}
            />
          </div>
        )}
      </div>

      {cadre}
    </div>
  );
}
