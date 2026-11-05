"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Pose la classe `.anime` quand le bloc entre à l'écran, une seule fois.
 * Les animations CSS (globals.css) ne jouent que sous `.anime`, et jamais
 * si l'appareil demande moins de mouvement.
 */
export function AnimerAuDefilement({
  children,
  className = "",
  seuil = 0.35,
}: {
  children: ReactNode;
  className?: string;
  seuil?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("anime");
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: seuil },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible, seuil]);

  return (
    <div ref={ref} className={`${visible ? "anime" : ""} ${className}`}>
      {children}
    </div>
  );
}
