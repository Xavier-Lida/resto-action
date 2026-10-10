import { Clock3 } from "lucide-react";
import type { Textes } from "@/lib/textes/fr";

/** Même information avant la réservation, avant le paiement et après celui-ci. */
export default function InfoLancement({
  t,
  compact = false,
  className = "",
}: {
  t: Textes;
  compact?: boolean;
  className?: string;
}) {
  const l = t.lancement;
  return (
    <aside aria-label={l.titre} className={`rounded-2xl border border-brand/20 bg-brand/5 p-5 text-ink ${className}`}>
      <p className="flex items-start gap-2 text-sm font-black">
        <Clock3 className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
        {l.titre}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink/80">{compact ? l.resume : l.texte}</p>
      {!compact && (
        <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm leading-relaxed text-ink/80">
          <li>{l.date}</li>
          <li>{l.abonnement}</li>
          <li>{l.remboursement}</li>
        </ul>
      )}
    </aside>
  );
}
