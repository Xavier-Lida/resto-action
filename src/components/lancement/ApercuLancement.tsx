import { Check } from "lucide-react";
import BoutonReserver from "@/components/BoutonReserver";
import { BoutonContour } from "@/components/lancement/ui";
import { ANCRES, GROUPES, lienReservation } from "@/lib/contenu/grand-lancement";
import { fr } from "@/lib/format";

/* LE PANNEAU DE GAUCHE DE « TROUVE TON RESTO », version Grand Lancement.

   L'aperçu automatique de l'app (à droite, fait avec la fiche Google) reste.
   La maquette faite à la main en 48 h, elle, n'est plus promise : à sa place,
   le calculateur du relevé et la réservation. Les textes sont ceux des pièces
   « Avant de signer, gratuit » du fichier de contenu. */
export default function ApercuLancement({ nom, titreId, onFermer }: { nom: string; titreId: string; onFermer: () => void }) {
  const avant = GROUPES.find((g) => g.id === "avant")?.pieces.filter((p) => p.disponible) ?? [];
  const apercu = avant.find((p) => p.id === "apercu-app");
  return (
    <div>
      <h2 id={titreId} className="pr-10 font-display text-3xl font-black leading-tight tracking-tight md:text-4xl">
        {nom ? fr(`L'aperçu de l'app de ${nom}`) : fr(apercu?.nom ?? "L'aperçu de ton app")}
      </h2>
      {apercu && <p className="mt-4 leading-relaxed text-ink/70">{fr(apercu.ligne)}</p>}
      <ul className="mt-6 grid list-none gap-3">
        {avant
          .filter((p) => p.id !== "apercu-app")
          .map((p) => (
            <li key={p.id} className="flex items-start gap-3">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-white">
                <Check className="size-3.5" aria-hidden="true" />
              </span>
              <span>
                <span className="font-black">{fr(p.nom)}</span>
                <span className="block text-sm text-ink/65">{fr(p.ligne)}</span>
              </span>
            </li>
          ))}
      </ul>
      <div className="mt-8 flex flex-col items-start gap-4">
        <BoutonReserver href={ANCRES.calculateur} libelle="Calcule ce que tu aurais gardé" className="[&_a]:w-full" />
        <BoutonContour href={`${lienReservation()}${nom ? `?resto=${encodeURIComponent(nom)}` : ""}`}>Réserve ta place</BoutonContour>
        <button type="button" onClick={onFermer} className="text-sm font-bold text-ink/60 underline underline-offset-4 hover:text-ink">
          Fermer
        </button>
      </div>
    </div>
  );
}
