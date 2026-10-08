import { ArrowRight } from "lucide-react";
import LienPasPret from "@/components/LienPasPret";

/* LE BOUTON « RÉSERVER MA PLACE FONDATEUR », PARTOUT PAREIL.

   Il était écrit quatre fois à la main, en quatre tailles et deux couleurs.
   Un seul bouton maintenant, reconnaissable d'un coup d'œil : gros, arrondi,
   la flèche dans sa pastille, et un reflet qui passe toutes les quelques
   secondes pour attirer l'œil sans clignoter (coupé si le visiteur demande
   moins d'animations, voir .cta-brille dans globals.css).

   `ton` suit le fond : « blanc » sur le rouge et l'encre, « rouge » sur le
   blanc. `sous` ajoute une ligne rassurante sous le bouton (« 500 $
   remboursables… »), là où on se décide. */
export default function BoutonReserver({
  href,
  libelle,
  ton = "rouge",
  taille = "lg",
  pleineLargeur = false,
  sous,
  pasPret,
  flottant = false,
  className = "",
}: {
  href: string;
  libelle: string;
  ton?: "rouge" | "blanc";
  taille?: "md" | "lg" | "xl";
  pleineLargeur?: boolean;
  sous?: string;
  /** Le libellé « Pas encore prêt? » : un lien sous le bouton qui ouvre la
      fenêtre maquette gratuite / appel (ModalePasPret). */
  pasPret?: string;
  /** Le bouton de la barre qui suit le visiteur (BarreReservation). Les
      autres portent `data-cta-reserver` : quand l'un d'eux est à l'écran,
      la barre se cache, pour ne jamais montrer deux boutons à la fois. */
  flottant?: boolean;
  className?: string;
}) {
  const couleurs =
    ton === "rouge"
      ? "bg-brand text-white [--brille:rgba(255,255,255,0.45)]"
      : "bg-white text-ink [--brille:rgba(255,48,8,0.18)]";
  const pastille = ton === "rouge" ? "bg-white text-brand" : "bg-brand text-white";
  const dimensions = {
    md: "gap-3 py-2.5 pl-5 pr-2.5 text-base",
    lg: "gap-4 py-3 pl-7 pr-3 text-lg md:text-xl",
    xl: "gap-4 py-3.5 pl-8 pr-3.5 text-xl md:text-2xl",
  }[taille];
  const rond = { md: "size-8", lg: "size-10 md:size-11", xl: "size-11 md:size-12" }[taille];

  return (
    <div
      data-cta-reserver={flottant ? undefined : ""}
      className={`${pleineLargeur ? "w-full" : "inline-flex"} flex-col items-center gap-2 ${className}`}
    >
      <a
        href={href}
        className={`cta-brille group relative flex items-center justify-between rounded-full font-black shadow-[0_5px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 hover:shadow-[0_7px_0_0_var(--ombre-cta)] active:translate-y-1 active:shadow-none ${couleurs} ${dimensions} ${pleineLargeur ? "w-full" : ""}`}
      >
        <span className={pleineLargeur ? "flex-1 text-center" : ""}>{libelle}</span>
        <span className={`grid shrink-0 place-items-center rounded-full transition-transform group-hover:translate-x-1 ${pastille} ${rond}`}>
          <ArrowRight className="size-5" aria-hidden="true" />
        </span>
      </a>
      {sous && <p className="text-center text-sm font-bold opacity-75">{sous}</p>}
      {pasPret && (
        <LienPasPret libelle={pasPret} className="text-sm font-bold underline underline-offset-4 opacity-80 transition hover:opacity-100" />
      )}
    </div>
  );
}
