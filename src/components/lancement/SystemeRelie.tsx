"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { PointCiel } from "@/components/lancement/ui";
import {
  Package,
  Gift,
  Megaphone,
  MapPin,
  Printer,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Heart,
} from "lucide-react";
import {
  MOTEURS,
  PROBLEME,
  SCENE,
  NOM_RESTO_EXEMPLE,
  disponible,
} from "@/lib/contenu/grand-lancement";
import { fr } from "@/lib/format";

/* LE SYSTÈME, RELIÉ : la pièce maîtresse de la page.

   Hormozi : on ne décrit pas l'infrastructure, on la montre au travail. Une
   carte vivante où chaque morceau est branché sur l'app du resto, et où l'on
   voit une commande traverser tout le système : un canal amène le client,
   l'app prend la commande, l'imprimante la sort, la livraison part, le client
   est fidélisé (points, avis Google, réponse proposée par l'IA et approuvée
   par le proprio), puis le proprio reçoit son texto. Les compteurs montent
   à chaque tour : ce sont les frais de plateforme évités (environ 30 % de la commande) qui s'accumulent.

   Chaque nom et chaque chiffre est un EXEMPLE (mention affichée). Un nœud
   dont la pièce n'est pas « disponible » dans grand-lancement.ts disparaît,
   avec ses tours et ses lignes. Rien ne bouge hors écran, ni si l'appareil
   demande moins de mouvement : tout s'affiche alors allumé, sans boucle. */

type IdNoeud =
  | "pub"
  | "cartons"
  | "google"
  | "parrainage"
  | "app"
  | "imprimante"
  | "livraison"
  | "fidelite"
  | "avis"
  | "proprio";

type Pos = { x: number; y: number };

// Deux plans : large (viewBox 1000 × 660) et étroit (viewBox 400 × 1120).
const LARGE: Record<IdNoeud, Pos> = {
  pub: { x: 125, y: 95 },
  cartons: { x: 125, y: 245 },
  google: { x: 125, y: 395 },
  parrainage: { x: 125, y: 545 },
  app: { x: 500, y: 300 },
  imprimante: { x: 875, y: 95 },
  livraison: { x: 875, y: 260 },
  proprio: { x: 875, y: 470 },
  fidelite: { x: 395, y: 585 },
  avis: { x: 640, y: 585 },
};
const ETROIT: Record<IdNoeud, Pos> = {
  pub: { x: 105, y: 62 },
  cartons: { x: 295, y: 62 },
  google: { x: 105, y: 178 },
  parrainage: { x: 295, y: 178 },
  app: { x: 200, y: 425 },
  imprimante: { x: 105, y: 680 },
  livraison: { x: 295, y: 680 },
  fidelite: { x: 105, y: 830 },
  avis: { x: 295, y: 830 },
  proprio: { x: 200, y: 1010 },
};

type Scenario = {
  source: Exclude<
    IdNoeud,
    "app" | "imprimante" | "livraison" | "fidelite" | "avis" | "proprio"
  >;
  client: string;
  montant: string;
  argent: number;
  livraison: boolean;
};

// Exemples seulement : prénoms et montants inventés pour l'illustration.
const SCENARIOS: Scenario[] = [
  {
    source: "pub",
    client: "Julie",
    montant: "34,50 $",
    argent: 10,
    livraison: true,
  },
  {
    source: "cartons",
    client: "Karine",
    montant: "52,00 $",
    argent: 16,
    livraison: true,
  },
  {
    source: "google",
    client: "Marc",
    montant: "27,25 $",
    argent: 8,
    livraison: false,
  },
  {
    source: "parrainage",
    client: "Sophie",
    montant: "41,75 $",
    argent: 13,
    livraison: true,
  },
];

// Les étapes d'un tour, dans l'ordre de la scène du contenu.
type Etape = 0 | 1 | 2 | 3 | 4 | 5;
const DUREES: Record<Etape, number> = {
  0: 1500,
  1: 1300,
  2: 1500,
  3: 1500,
  4: 2600,
  5: 1900,
};

function useReduit() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia("(prefers-reduced-motion: reduce)");
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function useEtroit() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia("(max-width: 767px)");
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false,
  );
}

/* Une courbe douce entre deux points (cubique, poignées horizontales au
   large, verticales à l'étroit). */
function courbe(a: Pos, b: Pos, etroit: boolean): string {
  if (etroit) {
    const my = (a.y + b.y) / 2;
    return `M${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
  }
  const mx = (a.x + b.x) / 2;
  return `M${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
}

export default function SystemeRelie() {
  const reduit = useReduit();
  const etroit = useEtroit();
  const avisDispo = disponible({ dependDe: ["avis"] });
  /* Sans la pièce Avis, on recentre : à l'ordi, Clients fidèles passe au
     centre sous le téléphone; au cellulaire, le texto du soir prend la place
     des avis et le schéma raccourcit (plus de case seule tout en bas). */
  const plan: Record<IdNoeud, Pos> = avisDispo
    ? etroit
      ? ETROIT
      : LARGE
    : etroit
      ? { ...ETROIT, proprio: { x: 295, y: 830 } }
      : { ...LARGE, fidelite: { x: 500, y: 585 } };
  const vb = etroit
    ? { w: 400, h: avisDispo ? 1120 : 940 }
    : { w: 1000, h: 660 };

  const parrainagePret = disponible({ dependDe: ["parrainage"] });
  const cartesPretes = disponible({ dependDe: ["cartes-cadeaux"] });
  const parrainageDispo = parrainagePret || cartesPretes;
  const titreParrainage =
    parrainagePret && cartesPretes
      ? "Parrainage et cartes-cadeaux"
      : parrainagePret
        ? "Le parrainage"
        : "Les cartes-cadeaux";

  const noeudsVisibles = useMemo(() => {
    const ids: IdNoeud[] = [
      "pub",
      "cartons",
      "google",
      "app",
      "imprimante",
      "livraison",
      "fidelite",
      "proprio",
    ];
    if (parrainageDispo) ids.push("parrainage");
    if (avisDispo) ids.push("avis");
    return new Set(ids);
  }, [avisDispo, parrainageDispo]);

  const scenarios = useMemo(
    () => SCENARIOS.filter((s) => noeudsVisibles.has(s.source)),
    [noeudsVisibles],
  );

  const [tour, setTour] = useState(0);
  const [etape, setEtape] = useState<Etape>(0);
  const [compteurs, setCompteurs] = useState({
    commandes: 0,
    nouveaux: 0,
    argent: 0,
  });
  const [enVue, setEnVue] = useState(false);
  const boite = useRef<HTMLDivElement>(null);
  const paquet = useRef<SVGCircleElement>(null);
  const halo = useRef<SVGCircleElement>(null);
  const chemins = useRef<Partial<Record<string, SVGPathElement | null>>>({});

  const scenario = scenarios[tour % scenarios.length];

  useEffect(() => {
    const el = boite.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setEnVue(e.isIntersecting), {
      threshold: 0.25,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // La minuterie des étapes : seulement à l'écran et sans mouvement réduit.
  useEffect(() => {
    if (reduit || !enVue) return;
    const t = setTimeout(() => {
      if (etape === 5) {
        setCompteurs((c) => ({
          commandes: c.commandes + 1,
          nouveaux: c.nouveaux + 1,
          argent: c.argent + scenario.argent,
        }));
        setTour((n) => n + 1);
        setEtape(0);
      } else {
        setEtape((e) => (e + 1) as Etape);
      }
    }, DUREES[etape]);
    return () => clearTimeout(t);
  }, [etape, enVue, reduit, scenario]);

  // Le trajet du paquet pour l'étape en cours.
  const trajet = useMemo(() => {
    if (!scenario) return null;
    const sens: Record<Etape, [IdNoeud, IdNoeud] | null> = {
      0: [scenario.source, "app"],
      1: null,
      2: ["app", "imprimante"],
      3: ["app", "livraison"],
      4: ["app", avisDispo ? "avis" : "fidelite"],
      5: ["app", "proprio"],
    };
    return sens[etape];
  }, [etape, scenario, avisDispo]);

  // Le paquet glisse le long du chemin actif (rAF, sans re-rendu React).
  useEffect(() => {
    const p = paquet.current;
    const h = halo.current;
    if (!p || !h) return;
    if (!trajet || reduit || !enVue) {
      p.style.opacity = "0";
      h.style.opacity = "0";
      return;
    }
    const cle = trajet.join("-");
    const chemin = chemins.current[cle];
    if (!chemin) return;
    const longueur = chemin.getTotalLength();
    const duree = 900;
    let debut: number | null = null;
    let id = 0;
    const pas = (t: number) => {
      if (debut === null) debut = t;
      const k = Math.min(1, (t - debut) / duree);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const pt = chemin.getPointAtLength(e * longueur);
      for (const c of [p, h]) {
        c.setAttribute("cx", String(pt.x));
        c.setAttribute("cy", String(pt.y));
      }
      p.style.opacity = k < 1 ? "1" : "0";
      h.style.opacity = k < 1 ? "0.35" : "0";
      if (k < 1) id = requestAnimationFrame(pas);
    };
    id = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(id);
  }, [trajet, reduit, enVue, etroit]);

  // Toutes les lignes : chaque canal vers l'app, l'app vers chaque service.
  const lignes = useMemo(() => {
    const paires: [IdNoeud, IdNoeud][] = [];
    for (const s of ["pub", "cartons", "google", "parrainage"] as IdNoeud[]) {
      if (noeudsVisibles.has(s)) paires.push([s, "app"]);
    }
    for (const s of [
      "imprimante",
      "livraison",
      "fidelite",
      "avis",
      "proprio",
    ] as IdNoeud[]) {
      if (noeudsVisibles.has(s)) paires.push(["app", s]);
    }
    return paires;
  }, [noeudsVisibles]);

  const actif = (id: IdNoeud): boolean => {
    if (reduit) return true;
    if (!scenario) return false;
    if (id === "app") return true;
    if (etape === 0) return id === scenario.source;
    if (etape === 2) return id === "imprimante";
    if (etape === 3) return id === "livraison";
    if (etape === 4) return id === "fidelite" || id === "avis";
    if (etape === 5) return id === "proprio";
    return false;
  };

  const etapesScene = SCENE.etapes
    .filter(disponible)
    .map((e) => fr(!avisDispo && e.sansAvis ? e.sansAvis : e.texte));
  const etapeAffichee = reduit ? -1 : etape;

  const pct = (p: Pos) => ({
    left: `${(p.x / vb.w) * 100}%`,
    top: `${(p.y / vb.h) * 100}%`,
  });

  return (
    <section
      id="systeme"
      className="bg-white px-3 pb-3 md:px-5 md:pb-5 lg:px-6 lg:pb-6"
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white lg:rounded-[3rem]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-1/3 size-[28rem] rounded-full bg-brand/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-5 py-16 md:py-24">
          {/* Bloc 2 : le problème en une ligne, puis le Système en images. */}
          <p className="max-w-3xl font-display text-xl font-black leading-snug text-white/60 md:text-2xl">
            {fr(PROBLEME)}
          </p>
          <p className="mt-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest">
            <PointCiel />
            {fr(SCENE.titre)}
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
            Le Système Nouveaux Clients, au complet.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            {fr(SCENE.sousScene)}
          </p>

          {/* Les compteurs : l'argent qui s'accumule à chaque tour. */}
          <div className="mt-8 grid grid-cols-3 items-stretch gap-2 md:flex md:flex-wrap md:items-center md:gap-3">
            {[
              { k: "Commandes directes", v: String(compteurs.commandes) },
              { k: "Nouveaux clients", v: String(compteurs.nouveaux) },
              { k: "Frais évités", v: `${compteurs.argent} $` },
            ].map((c) => (
              <div
                key={c.k}
                className="rounded-2xl bg-white/[0.07] px-3 py-2.5 ring-1 ring-white/10 md:px-4"
              >
                <p className="text-[0.58rem] font-black uppercase leading-tight tracking-wider text-white/50 md:text-[0.7rem] md:tracking-widest">
                  {c.k}
                </p>
                <p
                  key={c.v}
                  className="sys-compte mt-1 font-display text-xl font-black tabular-nums md:text-2xl"
                >
                  {c.v}
                </p>
              </div>
            ))}
            <span className="col-span-3 justify-self-start rounded-full border border-white/25 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-widest text-white/60">
              exemple
            </span>
          </div>

          {/* LA CARTE DU SYSTÈME */}
          <div
            ref={boite}
            className="relative mx-auto mt-10 w-full"
            style={{
              aspectRatio: `${vb.w} / ${vb.h}`,
              maxWidth: etroit ? 420 : undefined,
            }}
          >
            <svg
              viewBox={`0 0 ${vb.w} ${vb.h}`}
              className="absolute inset-0 size-full"
              aria-hidden="true"
            >
              {lignes.map(([a, b]) => {
                const cle = `${a}-${b}`;
                const allume = trajet && trajet[0] === a && trajet[1] === b;
                return (
                  <g key={cle}>
                    <path
                      ref={(el) => {
                        chemins.current[cle] = el;
                      }}
                      d={courbe(plan[a], plan[b], etroit)}
                      fill="none"
                      stroke="rgba(255,255,255,0.14)"
                      strokeWidth={etroit ? 2 : 2.5}
                    />
                    <path
                      d={courbe(plan[a], plan[b], etroit)}
                      fill="none"
                      className={reduit ? "" : "sys-flux"}
                      stroke={allume ? "#ff3008" : "rgba(255,255,255,0.28)"}
                      strokeWidth={
                        allume ? (etroit ? 3.5 : 4) : etroit ? 1.5 : 2
                      }
                      strokeLinecap="round"
                      style={{ transition: "stroke 300ms, stroke-width 300ms" }}
                    />
                  </g>
                );
              })}
              <circle
                ref={halo}
                r={etroit ? 14 : 18}
                fill="#ff3008"
                style={{ opacity: 0 }}
              />
              <circle
                ref={paquet}
                r={etroit ? 6 : 8}
                fill="#fff"
                stroke="#ff3008"
                strokeWidth="3"
                style={{ opacity: 0 }}
              />
            </svg>

            {/* L'APP DU RESTO, au centre */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ ...pct(plan.app), width: etroit ? "34%" : "17%" }}
            >
              <div
                className={`relative rounded-[1.6rem] border-[5px] border-white/90 bg-white p-2 text-ink shadow-2xl transition duration-500 ${etape === 1 && !reduit ? "scale-105 shadow-brand/40" : ""}`}
                style={{ aspectRatio: "9 / 17" }}
              >
                <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-ink/80" />
                <p className="text-center text-[0.7rem] font-black md:text-xs">
                  {NOM_RESTO_EXEMPLE}
                </p>
                <div className="mt-2 grid gap-1.5">
                  {["Poutine classique", "Pizza 12 po", "Combo du midi"].map(
                    (m) => (
                      <div
                        key={m}
                        className="flex items-center justify-between rounded-lg bg-bone px-2 py-1.5 text-[0.55rem] font-bold md:text-[0.62rem]"
                      >
                        <span className="truncate">{m}</span>
                        <span className="text-brand">+</span>
                      </div>
                    ),
                  )}
                </div>
                {scenario && etape >= 1 && etape <= 3 && !reduit && (
                  <div
                    key={`cmd-${tour}`}
                    className="sys-pop absolute inset-x-2 bottom-3 rounded-xl bg-brand px-2 py-2 text-center text-white shadow-lg"
                  >
                    <p className="text-[0.55rem] font-black uppercase tracking-wider md:text-[0.6rem]">
                      Nouvelle commande
                    </p>
                    <p className="whitespace-nowrap font-display text-xs font-black md:text-base">
                      {scenario.montant}
                    </p>
                  </div>
                )}
                {(reduit || etape === 0 || etape >= 4) && (
                  <div className="absolute inset-x-2 bottom-3 rounded-xl bg-ink px-2 py-2 text-center text-white">
                    <p className="text-[0.55rem] font-black uppercase tracking-wider md:text-[0.6rem]">
                      Ton app
                    </p>
                    <p className="text-[0.6rem] font-bold text-white/70 md:text-[0.65rem]">
                      à ton nom
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* LES CANAUX : on va chercher le client */}
            <Noeud
              id="pub"
              visible={noeudsVisibles.has("pub")}
              pos={pct(plan.pub)}
              etroit={etroit}
              actif={actif("pub")}
              icone={<Megaphone className="size-4" />}
              titre="La pub du lancement"
              sous="300 $ payés par nous"
            >
              {scenario?.source === "pub" && etape === 0 && !reduit && (
                <Client nom={scenario.client} />
              )}
            </Noeud>
            <Noeud
              id="cartons"
              visible={noeudsVisibles.has("cartons")}
              pos={pct(plan.cartons)}
              etroit={etroit}
              actif={actif("cartons")}
              icone={<Package className="size-4" />}
              titre="Nos cartons"
              sous="Dans chaque sac"
            >
              {scenario?.source === "cartons" && etape === 0 && !reduit && (
                <Client nom={scenario.client} />
              )}
            </Noeud>
            <Noeud
              id="google"
              visible={noeudsVisibles.has("google")}
              pos={pct(plan.google)}
              etroit={etroit}
              actif={actif("google")}
              icone={<MapPin className="size-4" />}
              titre="Ta fiche Google"
              sous="Bouton « Commander »"
            >
              {scenario?.source === "google" && etape === 0 && !reduit && (
                <Client nom={scenario.client} />
              )}
            </Noeud>
            <Noeud
              id="parrainage"
              visible={noeudsVisibles.has("parrainage")}
              pos={pct(plan.parrainage)}
              etroit={etroit}
              actif={actif("parrainage")}
              icone={<Gift className="size-4" />}
              titre={titreParrainage}
              sous="Tes clients en amènent"
            >
              {scenario?.source === "parrainage" && etape === 0 && !reduit && (
                <Client nom={scenario.client} />
              )}
            </Noeud>

            {/* TA CUISINE ET LA LIVRAISON */}
            <Noeud
              id="imprimante"
              visible
              pos={pct(plan.imprimante)}
              etroit={etroit}
              actif={actif("imprimante")}
              icone={<Printer className="size-4" />}
              titre="Ton imprimante"
              sous="La commande sort toute seule"
            >
              {etape === 2 && !reduit && (
                <div
                  key={`tk-${tour}`}
                  className="sys-ticket mx-auto mt-2 w-3/5 rounded-sm bg-white px-2 py-1.5 text-ink shadow"
                >
                  <div className="h-1 w-full rounded bg-ink/80" />
                  <div className="mt-1 h-1 w-4/5 rounded bg-ink/30" />
                  <div className="mt-1 h-1 w-3/5 rounded bg-ink/30" />
                  <div className="mt-1 h-1.5 w-full rounded bg-brand" />
                </div>
              )}
            </Noeud>
            <Noeud
              id="livraison"
              visible
              pos={pct(plan.livraison)}
              etroit={etroit}
              actif={actif("livraison")}
              icone={<ShoppingBag className="size-4" />}
              titre="Livraison ou cueillette"
              sous="Aucun livreur à gérer"
            >
              {etape === 3 && !reduit && scenario && (
                <p
                  key={`lv-${tour}`}
                  className="sys-pop mt-2 rounded-full bg-white/15 px-2 py-1 text-center text-[0.6rem] font-black md:text-[0.65rem]"
                >
                  {scenario.livraison
                    ? "En route · client paie 4,99 $"
                    : "Prête pour la cueillette"}
                </p>
              )}
            </Noeud>

            {/* ON LE FAIT REVENIR */}
            <Noeud
              id="fidelite"
              visible
              pos={pct(plan.fidelite)}
              etroit={etroit}
              actif={actif("fidelite")}
              icone={<Heart className="size-4" />}
              titre="Clients fidèles"
              sous="Points et textos de retour"
            >
              <div className="mt-2 flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`size-2.5 rounded-full transition-colors duration-500 ${(reduit ? 3 : Math.min(5, (compteurs.commandes % 6) + (etape >= 4 ? 1 : 0))) > i ? "bg-brand" : "bg-white/20"}`}
                  />
                ))}
              </div>
              {etape === 4 && !reduit && (
                <p
                  key={`fd-${tour}`}
                  className="sys-pop mt-2 rounded-xl bg-brand px-2 py-1 text-[0.58rem] font-bold leading-snug md:text-[0.62rem]"
                >
                  « Ta pizza te manque? Points doublés ce soir. »
                </p>
              )}
            </Noeud>
            <Noeud
              id="avis"
              visible={noeudsVisibles.has("avis")}
              pos={pct(plan.avis)}
              etroit={etroit}
              actif={actif("avis")}
              icone={<Star className="size-4" />}
              titre="Avis Google + réponse IA"
              sous="Publiée avec ton OK"
            >
              {etape === 4 && !reduit && scenario && (
                <div key={`av-${tour}`} className="mt-2 grid gap-1">
                  <p className="sys-pop flex justify-center gap-0.5 text-brand">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3 fill-current" />
                    ))}
                  </p>
                  <p className="sys-pop-2 flex items-start gap-1 rounded-xl bg-white px-2 py-1 text-left text-[0.56rem] font-bold leading-snug text-ink md:text-[0.6rem]">
                    <Sparkles className="mt-px size-3 shrink-0 text-brand" />
                    <span>
                      Réponse proposée : « Merci {scenario.client.split(" ")[0]}
                      , au plaisir! »
                    </span>
                  </p>
                  <p className="sys-pop-3 rounded-full bg-emerald-500 px-2 py-0.5 text-center text-[0.56rem] font-black text-white md:text-[0.6rem]">
                    Tu réponds OK · publiée
                  </p>
                </div>
              )}
            </Noeud>

            {/* LE PROPRIO */}
            <Noeud
              id="proprio"
              visible
              pos={pct(plan.proprio)}
              etroit={etroit}
              actif={actif("proprio")}
              icone={<Smartphone className="size-4" />}
              titre="Ton texto du soir"
              sous="Et ton Texto du Lundi"
            >
              {(etape === 5 || reduit) && (
                <p
                  key={`pr-${tour}`}
                  className="sys-pop mt-2 rounded-xl rounded-bl-sm bg-white px-2 py-1.5 text-left text-[0.58rem] font-bold leading-snug text-ink md:text-[0.62rem]"
                >
                  Ce soir : {compteurs.commandes + 1} commande
                  {compteurs.commandes + 1 > 1 ? "s" : ""} directe
                  {compteurs.commandes + 1 > 1 ? "s" : ""},{" "}
                  {compteurs.argent + (scenario?.argent ?? 0)} $ de frais
                  évités.
                </p>
              )}
            </Noeud>
          </div>

          {/* LES ÉTAPES, synchronisées avec la carte */}
          <ol className="mt-10 grid gap-3 md:grid-cols-3">
            {etapesScene.map((texte, i) => (
              <li
                key={i}
                className={`flex gap-3 rounded-2xl p-4 transition duration-500 ${etapeAffichee === i ? "bg-white/[0.1] ring-1 ring-brand" : "bg-white/[0.04] ring-1 ring-white/10"}`}
              >
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full text-sm font-black transition-colors ${etapeAffichee === i ? "bg-brand" : "bg-white/15"}`}
                >
                  {i + 1}
                </span>
                <span
                  className={`text-sm leading-snug ${etapeAffichee === i ? "text-white" : "text-white/65"}`}
                >
                  {texte}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-3xl font-bold leading-relaxed text-white/75">
            {fr(MOTEURS.effort)}
          </p>
        </div>
      </div>
    </section>
  );
}

function Noeud({
  visible,
  pos,
  etroit,
  actif,
  icone,
  titre,
  sous,
  children,
}: {
  id: IdNoeud;
  visible: boolean;
  pos: { left: string; top: string };
  etroit: boolean;
  actif: boolean;
  icone: React.ReactNode;
  titre: string;
  sous: string;
  children?: React.ReactNode;
}) {
  if (!visible) return null;
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ ...pos, width: etroit ? "44%" : "19%" }}
    >
      <div
        className={`rounded-2xl px-3 py-2.5 transition duration-500 md:px-4 md:py-3 ${
          actif
            ? "scale-[1.04] bg-ink ring-2 ring-brand shadow-[0_0_40px_rgba(255,48,8,0.35)]"
            : "bg-[#232323] ring-1 ring-white/12"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`grid size-7 shrink-0 place-items-center rounded-full transition-colors duration-500 ${actif ? "bg-brand text-white" : "bg-white/10 text-white/70"}`}
          >
            {icone}
          </span>
          <div className="min-w-0">
            <p className="text-[0.68rem] font-black leading-tight md:text-[0.8rem]">
              {titre}
            </p>
            <p className="text-[0.58rem] leading-tight text-white/55 md:text-[0.68rem]">
              {sous}
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function Client({ nom }: { nom: string }) {
  return (
    <p className="sys-pop mt-2 rounded-full bg-white px-2 py-1 text-center text-[0.58rem] font-black text-ink md:text-[0.62rem]">
      Nouveau client : {nom}
    </p>
  );
}
