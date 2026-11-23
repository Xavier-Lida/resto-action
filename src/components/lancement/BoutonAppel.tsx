"use client";

import type { ReactNode } from "react";
import { BoutonContour } from "@/components/lancement/ui";
import { mesurerMainLevee } from "@/lib/leads/client";

/* « PARLE 15 MINUTES AVEC GUILLAUME », MESURÉ.

   Le même bouton à contour qu'avant (BoutonContour), avec une chose de plus :
   le clic compte comme une main levée (événement « main_levee », geste
   « appel-15-min »). Ce n'est pas un lead : aucun contact n'est laissé, et
   rien de personnel ne part dans la mesure. `ou` dit où est le bouton. */
export default function BoutonAppel({
  href,
  ou,
  className = "",
  children,
}: {
  href: string;
  ou: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className="contents" onClick={() => mesurerMainLevee("appel-15-min", ou)}>
      <BoutonContour href={href} className={className}>
        {children}
      </BoutonContour>
    </span>
  );
}
