"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/* UNE FENÊTRE PAR-DESSUS LA PAGE, RENDUE DIRECTEMENT DANS <body>.

   Le portail n'est pas un détail : un `position: fixed` placé dans un parent
   animé (les `animate-hero` du héro bougent par `transform`) se positionne
   par rapport à CE parent, plus par rapport à l'écran. C'est ce qui faisait
   apparaître l'agenda coincé dans le héro. Rendue dans <body>, la fenêtre
   couvre toujours l'écran, peu importe d'où on l'ouvre.

   Échap ferme, un clic sur le fond ferme, le focus va au bouton de fermeture
   et la page derrière ne défile plus. */
export default function Modale({
  ouvert,
  onFermer,
  etiquetteFermer,
  titreId,
  className = "max-w-3xl",
  children,
}: {
  ouvert: boolean;
  onFermer: () => void;
  etiquetteFermer: string;
  /** L'id du titre de la fenêtre, pour aria-labelledby. */
  titreId: string;
  className?: string;
  children: ReactNode;
}) {
  const fermer = useRef<HTMLButtonElement>(null);
  const rappel = useRef(onFermer);
  useEffect(() => {
    rappel.current = onFermer;
  });

  useEffect(() => {
    if (!ouvert) return;
    fermer.current?.focus();
    const echap = (e: KeyboardEvent) => {
      if (e.key === "Escape") rappel.current();
    };
    window.addEventListener("keydown", echap);
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", echap);
      document.body.style.overflow = avant;
    };
  }, [ouvert]);

  if (!ouvert) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm md:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onFermer();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titreId}
        className={`calc-entre relative w-full rounded-[2rem] bg-white p-6 text-left text-ink shadow-2xl md:p-10 ${className}`}
      >
        <button
          ref={fermer}
          type="button"
          onClick={onFermer}
          aria-label={etiquetteFermer}
          className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-bone transition hover:bg-ink hover:text-white"
        >
          <X className="size-5" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
