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
/* LA TOUCHE CYAN : toujours petite, toujours à la même place (le point devant
   chaque surtitre, le mot clé surligné, l'icône de l'IA). Jamais en gros. */
export function PointCiel() {
  return <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-ciel shadow-[0_0_0_3px_rgba(25,211,240,0.25)]" />;
}

/* Les petites étiquettes au-dessus des titres (« LE CALCULATEUR · IA »…) :
   retirées partout le 12 nov. à la demande de Guillaume. Le composant reste,
   et ne rend plus rien, pour ne pas toucher chaque page qui l'appelle. */
export function Surtitre(props: { children: ReactNode; ton?: "clair" | "sombre" }) {
  void props;
  return null;
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
