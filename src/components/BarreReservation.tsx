"use client";

import { useEffect, useState } from "react";
import BoutonReserver from "@/components/BoutonReserver";

/* LA BARRE « RÉSERVER » QUI SUIT LE VISITEUR.

   Elle n'apparaît que quand AUCUN autre bouton Réserver n'est à l'écran (le
   héro, la bande des plateformes, le calculateur, l'offre : tous portent
   `data-cta-reserver`). Deux boutons à la fois se feraient concurrence ; avec
   elle, il y en a toujours un à un pouce, jamais deux.

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
  // Les boutons Réserver de la page qui sont à l'écran, en ce moment.
  const [enVue, setEnVue] = useState<Set<Element>>(new Set());
  const [pret, setPret] = useState(false);

  useEffect(() => {
    const boutons = document.querySelectorAll("[data-cta-reserver]");
    const obs = new IntersectionObserver((entrees) => {
      setEnVue((avant) => {
        const apres = new Set(avant);
        for (const e of entrees) {
          if (e.isIntersecting) apres.add(e.target);
          else apres.delete(e.target);
        }
        return apres;
      });
      setPret(true);
    });
    boutons.forEach((b) => obs.observe(b));
    return () => obs.disconnect();
  }, []);

  const visible = pret && enVue.size === 0;

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
      <BoutonReserver href={href} libelle={libelle} taille="md" flottant />
    </div>
  );
}
