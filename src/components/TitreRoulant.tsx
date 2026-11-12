"use client";

import { useEffect, useRef, useState } from "react";

/* LE H1 DU HÉRO : « Ton app. Tes ventes. Tes clients. », une phrase à la fois.

   Le H1 complet est dans le HTML (en sr-only) : un robot et un lecteur d'écran
   lisent les trois phrases d'un coup. La fente visible, elle, est aria-hidden
   et fait rouler les phrases comme le titre d'owner.com : la sortante monte
   pendant que l'entrante arrive par le bas (titre-sort / titre-entre dans
   globals.css). Rendu serveur : la première phrase, immobile. Rien ne tourne
   hors écran ni si le visiteur demande moins de mouvement. */

const POSE = 2200;
const ROULEAU = 520;

/* `retour` : les phrases peuvent passer sur deux lignes (gros titre au
   cellulaire); la plus longue, invisible, fixe alors la hauteur. */
/* `avant` / `apres` : seul UN MOT roule, entre deux lignes fixes
   (« Plus de / ventes / en ligne. »). Le mot tient toujours sur une ligne,
   donc la fente ne change jamais de hauteur, même au cellulaire. */
export default function TitreRoulant({
  lignes,
  className = "",
  retour = false,
  avant,
  apres,
  classeMot = "",
}: {
  lignes: string[];
  className?: string;
  retour?: boolean;
  avant?: string;
  /** Une seule ligne pour tous, ou une par mot (elle roule seulement quand elle change). */
  apres?: string | string[];
  classeMot?: string;
}) {
  const [i, setI] = useState(0);
  const [sortante, setSortante] = useState<number | null>(null);
  const [actif, setActif] = useState(false);
  const titre = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titre.current;
    if (!el) return;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)");
    let enVue = false;
    const maj = () => setActif(enVue && !reduit.matches);
    const obs = new IntersectionObserver(([e]) => {
      enVue = e.isIntersecting;
      maj();
    });
    obs.observe(el);
    reduit.addEventListener("change", maj);
    return () => {
      obs.disconnect();
      reduit.removeEventListener("change", maj);
    };
  }, []);

  useEffect(() => {
    if (!actif) return;
    const t = setTimeout(() => {
      setSortante(i);
      setI((k) => (k + 1) % lignes.length);
    }, POSE);
    return () => clearTimeout(t);
  }, [actif, i, lignes.length]);

  useEffect(() => {
    if (sortante === null) return;
    const t = setTimeout(() => setSortante(null), ROULEAU);
    return () => clearTimeout(t);
  }, [sortante]);

  const blanc = retour && !avant ? "text-balance" : "whitespace-nowrap";
  const plusLongue = lignes.reduce((a, b) => (b.length > a.length ? b : a));

  if (avant !== undefined) {
    const ap = (k: number) => (Array.isArray(apres) ? apres[k] : apres) ?? "";
    const complet = (m: string, k: number) => [avant, m, ap(k)].filter(Boolean).join(" ");
    const apresPlusLong = lignes.map((_, k) => ap(k)).reduce((a, b) => (b.length > a.length ? b : a), "");
    const roulApres = sortante !== null && ap(sortante) !== ap(i);
    return (
      <h1 ref={titre} className={className}>
        <span className="sr-only">{lignes.map(complet).join(". ").replace(/\.\./g, ".")}</span>
        <span aria-hidden="true" className="block">
          <span className="block">{avant}</span>
          {/* Le dégradé va sur CHAQUE mot, pas sur la fente : avec
              background-clip:text sur le parent, Chrome peint les mots qui
              roulent à leur place de départ, et ils se superposaient. */}
          <span className="relative block overflow-hidden pb-[0.12em] [clip-path:inset(0)]">
            <span className="invisible block whitespace-nowrap">{plusLongue}</span>
            {sortante !== null && (
              <span key={`s-${sortante}`} className="titre-sort absolute inset-x-0 top-0 block whitespace-nowrap">
                <span className={classeMot}>{lignes[sortante]}</span>
              </span>
            )}
            <span key={i} className={`absolute inset-x-0 top-0 block whitespace-nowrap ${sortante !== null ? "titre-entre" : ""}`}>
              <span className={classeMot}>{lignes[i]}</span>
            </span>
          </span>
          {apresPlusLong && (
            <span className="relative block overflow-hidden pb-[0.12em]">
              <span className="invisible block whitespace-nowrap">{apresPlusLong}</span>
              {roulApres && (
                <span key={`as-${sortante}`} className="apres-sort absolute inset-x-0 top-0 block whitespace-nowrap">
                  {ap(sortante)}
                </span>
              )}
              {/* La fin de ligne ne roule pas : collée sous le mot, son rouleau
                  passait par-dessus. Elle s'efface, puis la nouvelle apparaît. */}
              <span key={roulApres ? `a-${i}` : "a"} className={`absolute inset-x-0 top-0 block whitespace-nowrap ${roulApres ? "apres-entre" : ""}`}>
                {ap(i)}
              </span>
            </span>
          )}
        </span>
      </h1>
    );
  }

  return (
    <h1 ref={titre} className={className}>
      <span className="sr-only">{lignes.join(" ")}</span>
      <span aria-hidden="true" className="relative block overflow-hidden pb-[0.12em]">
        {/* Le réservoir : la phrase la plus longue, invisible, fixe la largeur
            et la hauteur de la fente pour que rien ne saute. */}
        <span className={`invisible block ${blanc}`}>{plusLongue}</span>
        {sortante !== null && (
          <span key={`s-${sortante}`} className={`titre-sort absolute inset-x-0 top-0 block ${blanc}`}>
            {lignes[sortante]}
          </span>
        )}
        <span
          key={i}
          className={`absolute inset-x-0 top-0 block ${blanc} ${sortante !== null ? "titre-entre" : ""}`}
        >
          {lignes[i]}
        </span>
      </span>
    </h1>
  );
}
