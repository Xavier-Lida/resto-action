"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  DUREE_APP,
  DUREE_RELANCES,
  DUREE_TRAFIC,
  DUREE_VENTES,
  MaquetteRelances,
  MaquetteTrafic,
  MaquetteVentes,
} from "./ResultatsMaquettes";
import type { Textes } from "@/lib/textes/fr";

/* Section « Résultats » : quatre onglets qui s'enchaînent tout seuls, une
   barre de progression qui sert de minuterie visible, et un panneau qui
   bascule d'un onglet à l'autre.

   CHAQUE ONGLET A SA PROPRE DURÉE. Elle vaut le temps qu'il faut pour regarder
   ce que l'onglet montre : 10,2 s pour la commande qui empile cinq plats,
   5,0 s pour la photo de l'app qui ne bouge pas. Une durée unique ferait
   traîner l'une et bousculerait l'autre — c'est le réglage qui compte le plus
   dans toute cette section.

   Le mouvement est en CSS pur (globals.css, bloc « Section Résultats ») : le
   site n'embarque aucune librairie d'animation et n'a pas besoin d'en
   embarquer une. React ne fait que choisir l'onglet, remonter le panneau pour
   relancer ses animations, et arrêter la minuterie hors écran. */

// La bascule, en deux temps : le contenu sortant s'efface, un court creux
// laisse le fond changer sans qu'on le voie, puis le nouveau contenu monte.
// Valeurs nominales légèrement en deçà des temps relevés : un rendu React et
// l'échantillonnage du navigateur ajoutent une vingtaine de millisecondes, et
// c'est le résultat À L'ÉCRAN qu'on veut voir tomber sur la référence.
const SORTIE = 100;
const CREUX = 55;
const ENTREE = 170;

type Onglet = {
  cle: string;
  onglet: string;
  surTitre: string;
  titre: string;
  duree: number;
  panneau: string; // classes de fond du panneau
  clair?: boolean; // texte blanc sur fond foncé
  photo?: { src: string; alt: string };
  maquette?: ReactNode;
};

/* La structure des onglets — durées, fonds, maquettes — vit ici ; leurs mots
   viennent du dictionnaire. Les deux tableaux se lisent dans le même ordre. */
const onglets = (t: Textes): Onglet[] => {
  const [trafic, ventes, repetees, app] = t.resultats.onglets;
  return [
    {
      cle: "trafic",
      ...trafic,
      duree: DUREE_TRAFIC,
      panneau: "bg-bone",
      maquette: <MaquetteTrafic t={t} />,
    },
    {
      cle: "ventes",
      ...ventes,
      duree: DUREE_VENTES,
      panneau: "bg-bone",
      maquette: <MaquetteVentes t={t} />,
    },
    {
      cle: "repetees",
      ...repetees,
      duree: DUREE_RELANCES,
      panneau: "bg-gradient-to-br from-hero to-brand",
      clair: true,
      maquette: <MaquetteRelances t={t} />,
    },
    {
      cle: "telechargements",
      ...app,
      duree: DUREE_APP,
      panneau: "bg-ink",
      clair: true,
      photo: { src: "/resultats-app.webp", alt: t.resultats.photoAlt },
    },
  ];
};

export default function Resultats({ t }: { t: Textes }) {
  /* Mémorisé : sans ça, le tableau est recréé à chaque rendu, et la minuterie
     qui le lit se relancerait sans fin — l'onglet ne changerait jamais. `t` est
     une constante de module, la mémoire tient donc pour toute la vie du
     composant. */
  const ONGLETS = useMemo(() => onglets(t), [t]);
  // `cible` est l'onglet demandé, `affiche` celui que le panneau montre
  // encore. Tant que les deux diffèrent, le panneau joue sa sortie.
  const [cible, setCible] = useState(0);
  const [affiche, setAffiche] = useState(0);
  // Incrémenté à chaque bascule : il remonte la maquette, ce qui suffit à
  // relancer ses animations CSS depuis le début.
  const [cycle, setCycle] = useState(0);
  const [enVue, setEnVue] = useState(false);
  const [anime, setAnime] = useState(true);
  const section = useRef<HTMLElement>(null);
  const boutons = useRef<(HTMLButtonElement | null)[]>([]);

  const sort = cible !== affiche;

  // Mouvement réduit : plus d'enchaînement automatique. Les onglets restent
  // cliquables, et le CSS fige les maquettes sur leur état final.
  useEffect(() => {
    const requete = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lire = () => setAnime(!requete.matches);
    lire();
    requete.addEventListener("change", lire);
    return () => requete.removeEventListener("change", lire);
  }, []);

  // Rien ne tourne hors écran : ni la minuterie, ni les maquettes.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const observateur = new IntersectionObserver(
      ([entree]) => setEnVue(entree.isIntersecting),
      { threshold: 0.25 }
    );
    observateur.observe(el);
    return () => observateur.disconnect();
  }, []);

  // La sortie finie, le panneau bascule et ses animations repartent de zéro.
  useEffect(() => {
    if (!sort) return;
    const bascule = setTimeout(() => {
      setAffiche(cible);
      setCycle((c) => c + 1);
    }, SORTIE + CREUX);
    return () => clearTimeout(bascule);
  }, [sort, cible]);

  // La minuterie court à partir du moment où le libellé s'allume, pas du
  // moment où le panneau arrive : c'est ce que mesure la barre, et le temps de
  // bascule fait partie du temps de l'onglet.
  useEffect(() => {
    if (!anime || !enVue) return;
    const minuterie = setTimeout(
      () => setCible((i) => (i + 1) % ONGLETS.length),
      ONGLETS[cible].duree
    );
    return () => clearTimeout(minuterie);
  }, [anime, enVue, cible, ONGLETS]);

  const activer = useCallback((i: number) => setCible(i), []);

  // Flèches gauche/droite entre onglets, comme l'attend un tablist.
  const auClavier = (evenement: React.KeyboardEvent) => {
    const pas =
      evenement.key === "ArrowRight" ? 1 : evenement.key === "ArrowLeft" ? -1 : 0;
    if (!pas) return;
    evenement.preventDefault();
    const suivant = (cible + pas + ONGLETS.length) % ONGLETS.length;
    activer(suivant);
    boutons.current[suivant]?.focus();
  };

  const courant = ONGLETS[affiche];

  return (
    <section
      ref={section}
      id="resultats"
      className="bg-white"
      style={
        {
          "--res-sortie": `${SORTIE}ms`,
          "--res-entree": `${ENTREE}ms`,
          // Retranchée de tous les délais des maquettes : elles sont montées
          // après la bascule, alors que leurs repères sont relevés à partir du
          // moment où l'onglet s'allume.
          "--res-bascule": `${SORTIE + CREUX}ms`,
        } as CSSProperties
      }
    >
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <h2 className="max-w-4xl font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
          {t.resultats.titre}
        </h2>

        {/* Grille 2×2 sur téléphone, rangée de quatre à partir de md. Le rail
            gris occupe toute la colonne, le trait rouge le remplit sur la
            durée de l'onglet : c'est la minuterie rendue visible. */}
        <div
          role="tablist"
          aria-label={t.resultats.tablistAria}
          onKeyDown={auClavier}
          className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 md:mt-14 md:grid-cols-4"
        >
          {ONGLETS.map((o, i) => (
            <button
              key={o.cle}
              ref={(el) => {
                boutons.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`onglet-${o.cle}`}
              aria-selected={i === cible}
              aria-controls={`panneau-${o.cle}`}
              tabIndex={i === cible ? 0 : -1}
              onClick={() => activer(i)}
              className="group text-left"
            >
              <span
                className={`block text-sm font-bold transition-colors md:text-base ${
                  i === cible
                    ? "text-ink"
                    : "text-ink/35 group-hover:text-ink/60"
                }`}
              >
                {o.onglet}
              </span>
              <span className="mt-3 block h-0.5 w-full overflow-hidden rounded-full bg-ink/10">
                {/* La barre démarre avec le libellé, sans attendre que le
                    panneau ait fini de basculer. Sa clé est l'onglet visé : le
                    remontage du panneau, 180 ms plus tard, ne la relance pas. */}
                {i === cible && (
                  <span
                    key={cible}
                    style={{ "--res-duree": `${o.duree}ms` } as CSSProperties}
                    className={`block h-full w-full rounded-full bg-brand ${
                      anime ? "res-barre" : ""
                    }`}
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Un seul panneau rendu à la fois, remonté par sa clé pour que les
            maquettes repartent de zéro. --res-duree est posée ici, pas sur la
            section : chaque maquette lit la durée de SON onglet.

            LE PLANCHER lg VAUT LA HAUTEUR DU PLUS GRAND, la chaîne des
            relances : à partir de lg les quatre onglets font donc exactement
            la même hauteur et rien ne saute à la bascule. En dessous, le
            panneau empile le titre au-dessus de la maquette et sa hauteur
            suit forcément le contenu — l'égaliser là coûterait 200 px de vide
            sur les trois autres. */}
        <div
          key={`${courant.cle}-${cycle}`}
          role="tabpanel"
          id={`panneau-${courant.cle}`}
          aria-labelledby={`onglet-${courant.cle}`}
          tabIndex={0}
          style={{ "--res-duree": `${courant.duree}ms` } as CSSProperties}
          className={`relative mt-8 flex min-h-[32rem] overflow-hidden rounded-[2rem] md:min-h-[30rem] lg:min-h-[34rem] lg:rounded-[3rem] ${courant.panneau} ${
            courant.clair ? "text-white" : "text-ink"
          }`}
        >
          {courant.photo && (
            // La photo s'efface avec le contenu — sur le bg-ink du panneau, la
            // sortie reste douce — mais en fondu seul : la translation du
            // contenu décollerait une image posée en absolu.
            <div className={`absolute inset-0 ${sort ? "res-fond-sortie" : "res-fond"}`}>
              <Image
                draggable={false}
                src={courant.photo.src}
                alt={courant.photo.alt}
                fill
                sizes="(max-width: 1152px) 100vw, 1152px"
                unoptimized
                className="object-cover"
              />
              {/* Le voile creuse le tiers gauche pour que le texte tienne, sans
                  noyer la photo : le bois et les plats restent lisibles. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/45 to-transparent"
              />
            </div>
          )}

          {/* flex-1 + items-center : le contenu est centré verticalement dans
              le panneau quelle que soit la maquette, plutôt que collé en haut. */}
          <div
            className={`relative flex flex-1 flex-col justify-center gap-12 p-8 md:p-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8 lg:p-16 ${
              sort ? "res-contenu-sortie" : "res-contenu"
            }`}
          >
            <div>
              <p
                className={`text-xs font-black uppercase tracking-widest ${
                  courant.clair ? "text-white/70" : "text-brand"
                }`}
              >
                {courant.surTitre}
              </p>
              <h3 className="mt-4 max-w-[16ch] font-display text-2xl font-black leading-tight tracking-tight md:text-3xl">
                {courant.titre}
              </h3>
            </div>

            {courant.maquette && (
              <div className="flex justify-center lg:justify-end">
                {/* enVue garde les maquettes au repos tant que la section
                    n'est pas à l'écran. */}
                {enVue && courant.maquette}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
