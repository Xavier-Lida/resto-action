import { PLACES_FONDATEURS } from "@/lib/site";

/* « Il reste X places sur Y », avec une barre des places qui restent : elle
   raccourcit à chaque réservation, l'élan se voit avant de se lire. Le modèle accepte {reste}, {prises} et {total}. Les chiffres viennent de PLACES_FONDATEURS (site.ts), tenus
   à jour à la main. `ton` choisit les couleurs selon le fond : blanc sur le
   rouge du héro, encre sur un fond clair. */
export default function BarrePlaces({
  modele,
  ton = "clair",
  className = "",
}: {
  /** La phrase du dictionnaire, avec {prises} et {total}. */
  modele: string;
  ton?: "clair" | "sombre";
  className?: string;
}) {
  const { total, prises } = PLACES_FONDATEURS;
  const reste = Math.max(0, total - prises);
  // La barre montre ce qui RESTE : elle raccourcit à chaque réservation.
  const pct = Math.min(100, Math.round((reste / total) * 100));
  const texte = modele
    .replace("{reste}", String(reste))
    .replace("{prises}", String(prises))
    .replace("{total}", String(total));
  const fond = ton === "clair" ? "bg-white/25" : "bg-ink/10";
  const plein = ton === "clair" ? "bg-white" : "bg-brand";

  return (
    <div className={`flex items-center gap-3 text-sm font-black ${className}`}>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={reste}
        aria-label={texte}
        className={`h-2.5 w-32 shrink-0 overflow-hidden rounded-full ${fond}`}
      >
        <div className={`h-full rounded-full ${plein}`} style={{ width: `${pct}%` }} />
      </div>
      <span>{texte}</span>
    </div>
  );
}
