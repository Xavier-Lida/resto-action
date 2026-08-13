"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, Phone, X } from "lucide-react";
import { PHONE_HREF } from "@/lib/site";

const LIENS: [string, string][] = [
  ["#top", "Accueil"],
  ["#approche", "Notre approche"],
  ["#mission", "Notre mission"],
  ["#histoire", "Notre histoire"],
  ["#faq", "FAQ"],
  ["#contact", "Contact"],
];

// Menu plein écran mobile : reprend le langage de la hero (fond rouge,
// cadre blanc arrondi). Visible uniquement sous md.
export default function MenuMobile() {
  const [ouvert, setOuvert] = useState(false);

  // Pas de défilement de la page derrière le menu ouvert.
  useEffect(() => {
    document.body.style.overflow = ouvert ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ouvert]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOuvert(true)}
        aria-label="Ouvrir le menu"
        aria-expanded={ouvert}
        className="grid size-11 place-items-center rounded-full border-2 border-white text-white transition-colors hover:bg-white hover:text-brand"
      >
        <Menu className="size-5" />
      </button>

      {/* Portail vers body : la nav garde un transform résiduel d'animation,
          qui ferait d'elle le référent d'un position fixed. */}
      {ouvert &&
        createPortal(
        <div className="fixed inset-0 z-50 bg-hero p-2 text-white">
          <div className="flex h-full flex-col overflow-y-auto rounded-[2rem] border-[10px] border-white p-5">
            <button
              type="button"
              onClick={() => setOuvert(false)}
              aria-label="Fermer le menu"
              className="grid size-11 shrink-0 place-items-center self-end rounded-full bg-white text-brand"
            >
              <X className="size-5" />
            </button>
            <nav aria-label="Menu mobile" className="mt-4 flex flex-col gap-1">
              {LIENS.map(([href, etiquette]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOuvert(false)}
                  className="rounded-2xl px-4 py-3 text-2xl font-black transition-colors hover:bg-white/15"
                >
                  {etiquette}
                </a>
              ))}
            </nav>
            <a
              href={PHONE_HREF}
              className="mt-auto inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-4 font-black text-brand"
            >
              <Phone className="size-5" />
              Appelle-nous
            </a>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
