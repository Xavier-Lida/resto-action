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

export default function TitreRoulant({ lignes, className = "" }: { lignes: string[]; className?: string }) {
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

  const plusLongue = lignes.reduce((a, b) => (b.length > a.length ? b : a));

  return (
    <h1 ref={titre} className={className}>
      <span className="sr-only">{lignes.join(" ")}</span>
      <span aria-hidden="true" className="relative block overflow-hidden pb-[0.12em]">
        {/* Le réservoir : la phrase la plus longue, invisible, fixe la largeur
            et la hauteur de la fente pour que rien ne saute. */}
        <span className="invisible block whitespace-nowrap">{plusLongue}</span>
        {sortante !== null && (
          <span key={`s-${sortante}`} className="titre-sort absolute inset-x-0 top-0 block whitespace-nowrap">
            {lignes[sortante]}
          </span>
        )}
        <span
          key={i}
          className={`absolute inset-x-0 top-0 block whitespace-nowrap ${sortante !== null ? "titre-entre" : ""}`}
        >
          {lignes[i]}
        </span>
      </span>
    </h1>
  );
}
