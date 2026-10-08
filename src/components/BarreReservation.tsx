"use client";

import { useEffect, useState } from "react";
import BoutonReserver from "@/components/BoutonReserver";

/* LA BARRE « RÉSERVER » QUI SUIT LE VISITEUR.

   Elle apparaît dès que le héro (et son bouton) sort de l'écran, et se retire
   quand l'offre fondateur est à l'écran : celle-ci a déjà son gros bouton,
   deux boutons côte à côte se feraient concurrence. Le bouton est donc
   toujours à un pouce, sans jamais se doubler.

   En bas à droite sur ordinateur (la bannière des témoins occupe le bas à
   gauche), pleine largeur au téléphone. */
export default function BarreReservation({
  href,
  libelle,
  places,
}: {
  href: string;
  libelle: string;
  /** La phrase « Il reste X places… », déjà remplie. */
  places: string;
}) {
  const [heroVisible, setHeroVisible] = useState(true);
  const [offreVisible, setOffreVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const offre = document.getElementById("offre");
    const obs = new IntersectionObserver((entrees) => {
      for (const e of entrees) {
        if (e.target === hero) setHeroVisible(e.isIntersecting);
        if (e.target === offre) setOffreVisible(e.isIntersecting);
      }
    });
    if (hero) obs.observe(hero);
    if (offre) obs.observe(offre);
    return () => obs.disconnect();
  }, []);

  const visible = !heroVisible && !offreVisible;

  return (
    <div
      inert={!visible}
      className={`fixed inset-x-3 bottom-3 z-30 flex items-center justify-between gap-4 rounded-full bg-ink p-2 pl-5 text-white shadow-2xl ring-1 ring-white/10 transition duration-300 sm:inset-x-auto sm:right-4 sm:bottom-4 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <span className="flex items-center gap-2 text-sm font-black">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-brand" />
        </span>
        <span className="hidden sm:inline">{places}</span>
      </span>
      <BoutonReserver href={href} libelle={libelle} taille="md" />
    </div>
  );
}
