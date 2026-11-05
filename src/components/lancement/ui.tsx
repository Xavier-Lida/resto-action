import type { ReactNode } from "react";

/* Petites pièces d'interface du Grand Lancement, dans le trait du site. */

/** Mention « exemple » apposée sur chaque chiffre ou nom d'exemple. */
export function Exemple({ children = "exemple" }: { children?: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-current/25 px-2 py-0.5 text-[0.65rem] font-black uppercase tracking-widest opacity-60">
      {children}
    </span>
  );
}

/** Un texte qui reste à écrire : surligné, impossible à manquer. */
export function AEcrire({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-yellow-200 px-1 font-bold text-ink" title="Texte à écrire">
      {children}
    </span>
  );
}

/** Le surtitre d'une section : la pilule rouge sur fond sombre, le gris sur fond clair. */
export function Surtitre({ children, ton = "clair" }: { children: ReactNode; ton?: "clair" | "sombre" }) {
  return ton === "sombre" ? (
    <p className="inline-flex rounded-full bg-brand px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white">
      {children}
    </p>
  ) : (
    <p className="text-xs font-black uppercase tracking-widest text-ink/50">{children}</p>
  );
}

/** Le bouton secondaire : une pilule au contour, à côté du gros bouton rouge. */
export function BoutonContour({
  href,
  children,
  ton = "sombre",
  className = "",
}: {
  href: string;
  children: ReactNode;
  ton?: "sombre" | "clair";
  className?: string;
}) {
  const couleurs =
    ton === "sombre"
      ? "border-ink text-ink hover:bg-ink hover:text-white"
      : "border-white text-white hover:bg-white hover:text-ink";
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full border-2 px-6 py-3 text-base font-black transition ${couleurs} ${className}`}
    >
      {children}
    </a>
  );
}

/** La pastille cochée des listes « inclus ». */
export function Coche({ sombre = false }: { sombre?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${sombre ? "bg-brand text-white" : "bg-brand text-white"}`}
    >
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}
