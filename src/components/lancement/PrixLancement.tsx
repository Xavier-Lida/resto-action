import { Check } from "lucide-react";
import BoutonReserver from "@/components/BoutonReserver";
import Reveal from "@/components/Reveal";
import { Exemple, Surtitre } from "@/components/lancement/ui";
import { ANCRES, DEPOT, PRIX, lienReservation } from "@/lib/contenu/grand-lancement";
import { argent, argentSigne, fr } from "@/lib/format";

/* LE PRIX, TOUT COMPRIS. La même carte sombre que l'ancienne offre fondateur :
   à gauche la liste du prix, à droite une carte blanche avec l'exemple et le
   bouton. Tout est affiché d'avance, taxes en sus. */
export default function PrixLancement() {
  const lignes = [
    PRIX.lignes.abonnement,
    PRIX.lignes.miseEnService,
    PRIX.lignes.miseEnServiceFin,
    PRIX.lignes.livraison,
    PRIX.lignes.cueillette,
    PRIX.lignes.inclus,
  ].filter(Boolean);
  return (
    <section id={ANCRES.prix.slice(1)} className="bg-white px-3 pb-3 md:px-5 md:pb-5 lg:px-6 lg:pb-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white lg:rounded-[3rem]">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 -bottom-24 size-96 rounded-full bg-brand/25 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-20 md:py-28 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-14">
          <Reveal>
            <Surtitre ton="sombre">Le prix</Surtitre>
            <h2 className="mt-6 font-display text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">
              {PRIX.titre}
            </h2>
            <p className="mt-3 text-sm font-bold uppercase tracking-widest text-white/50">{PRIX.taxes}</p>
            <ul className="mt-8 grid list-none gap-4">
              {lignes.map((l) => (
                <li key={l} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="leading-relaxed text-white/90">{fr(l)}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={1}>
            <div className="rounded-[2rem] bg-white p-7 text-ink shadow-2xl md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-widest text-ink/50">Un exemple</p>
                <Exemple>{PRIX.exempleMention}</Exemple>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">{fr(PRIX.exempleHypotheses)}</p>
              <table className="mt-5 w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-ink">
                    {PRIX.exempleEntetes.map((e, k) => (
                      <th key={e} scope="col" className={`py-2 font-black ${k > 0 ? "text-right" : ""}`}>
                        {fr(e)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PRIX.exempleLignes.map(([l, v]) => (
                    <tr key={l} className="border-b border-bone">
                      <th scope="row" className="py-2.5 pr-3 text-left font-semibold text-ink/80">{fr(l)}</th>
                      <td className="py-2.5 text-right font-bold tabular-nums">{argentSigne(v)}</td>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" className="py-3 text-left font-display text-base font-black">{PRIX.exempleTotalLibelle}</th>
                    <td className="py-3 text-right font-display text-2xl font-black tabular-nums text-brand">{argentSigne(PRIX.exempleTotal)}</td>
                  </tr>
                </tbody>
              </table>
              <BoutonReserver
                href={lienReservation()}
                libelle="Réserve ta place"
                pleineLargeur
                sous={fr(`Dépôt de ${argent(DEPOT)}, crédité sur ta mise en service`)}
                className="mt-7 text-ink"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
