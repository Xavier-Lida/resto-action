"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import SelecteurLangue from "@/components/SelecteurLangue";
import type { Textes } from "@/lib/textes/fr";

// Menu mobile : carte blanche compacte ancrée en haut, ouverte et fermée
// en douceur (fondu + glissement). Visible uniquement sous md.
export default function MenuMobile({ t }: { t: Textes }) {
  const [monte, setMonte] = useState(false); // le panneau est dans le DOM
  const [visible, setVisible] = useState(false); // l'état de la transition
  const minuterie = useRef<number | null>(null);

  const ouvrir = () => {
    if (minuterie.current) window.clearTimeout(minuterie.current);
    setMonte(true);
  };
  const fermer = () => {
    setVisible(false);
    minuterie.current = window.setTimeout(() => setMonte(false), 300);
  };

  // La transition d'entrée doit partir de l'état caché : on monte caché,
  // puis on bascule visible à la frame suivante.
  useEffect(() => {
    if (monte) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
  }, [monte]);

  // Pas de défilement de la page derrière le menu ouvert.
  useEffect(() => {
    document.body.style.overflow = monte ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [monte]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={ouvrir}
        aria-label={t.nav.ouvrirMenu}
        aria-expanded={monte}
        // La barre est blanche désormais : un bouton blanc sur blanc
        // serait invisible.
        className="grid size-11 place-items-center rounded-full border-2 border-ink/15 text-ink transition-colors hover:bg-ink hover:text-white"
      >
        <Menu className="size-5" />
      </button>

      {/* Portail vers body : la nav garde un transform résiduel d'animation,
          qui ferait d'elle le référent d'un position fixed. */}
      {monte &&
        createPortal(
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              onClick={fermer}
              aria-label={t.nav.fermerMenu}
              className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 motion-reduce:transition-none ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`absolute inset-x-3 top-3 origin-top-right rounded-3xl bg-white p-5 text-ink shadow-2xl transition-all duration-300 ease-out motion-reduce:transition-none ${
                visible
                  ? "translate-y-0 scale-100 opacity-100"
                  : "-translate-y-3 scale-95 opacity-0"
              }`}
            >
              <div className="flex items-center justify-between">
                <Image
                  draggable={false}
                  src="/logo-marque.png"
                  alt={t.nav.logoAlt}
                  width={1012}
                  height={128}
                  className="h-6 w-auto"
                />
                <button
                  type="button"
                  onClick={fermer}
                  aria-label={t.nav.fermerMenu}
                  className="grid size-10 place-items-center rounded-full bg-bone text-ink transition-colors hover:bg-brand hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>
              {/* Les ancres du dictionnaire sont nues (`#approche`) : il faut
                  les préfixer par la racine de la langue ET par l'accueil.
                  Sans ça, depuis /contact ou la 404 — où cette barre vit
                  maintenant aussi — un fragment sans page cible ne mène nulle
                  part. Ça marchait tant que le menu n'existait que sur
                  l'accueil. */}
              <nav aria-label={t.nav.mobileAria} className="mt-3 flex flex-col">
                {t.nav.mobile.map(([ancre, etiquette]) => (
                  <a
                    key={ancre}
                    href={`${t.racine}/${ancre}`}
                    onClick={fermer}
                    className="rounded-xl px-3 py-2.5 text-lg font-black transition-colors hover:bg-bone"
                  >
                    {etiquette}
                  </a>
                ))}
              </nav>
              <div className="mt-4 flex justify-center">
                <SelecteurLangue t={t} ton="menu" />
              </div>
              {/* Ce bouton EST l'entrée « Contact » du menu : c'est pour ça
                  qu'elle ne figure plus dans la liste des sections au-dessus. */}
              <a
                href={`${t.racine}/contact`}
                onClick={fermer}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-brand px-6 py-3.5 font-black text-white transition-colors hover:bg-ink"
              >
                {t.nav.contacter}
              </a>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
