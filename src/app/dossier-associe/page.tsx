import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
import BarreNav from "@/components/BarreNav";
import BoutonReserver from "@/components/BoutonReserver";
import Footer from "@/components/Footer";
import { BoutonImprimer } from "@/components/lancement/BoutonImprimer";
import { BoutonContour, Exemple, Surtitre } from "@/components/lancement/ui";
import { PLATEFORMES, calculer, decoderDossier } from "@/lib/calcul";
import { CALCULATEUR as C, NOM_OFFRE, PRIX, garantiesDisponibles, lienAppel, lienReservation } from "@/lib/contenu/grand-lancement";
import { argent, argentSigne, entier, fr, pourcent } from "@/lib/format";
import { PHONE_DISPLAY } from "@/lib/site";
import { FR } from "@/lib/textes/fr";

/* LE DOSSIER POUR TON ASSOCIÉ.

   Une page avec les chiffres du resto, à montrer à son associé ou à son
   comptable. Les chiffres voyagent dans l'adresse (encodés) : rien n'est
   enregistré chez nous, seules les personnes qui ont le lien la voient. Elle
   s'imprime proprement et n'est pas indexée. */
export const metadata: Metadata = {
  title: "Le Dossier pour ton associé",
  robots: { index: false, follow: false },
};

function Tableau({ lignes }: { lignes: [string, string][] }) {
  return (
    <table className="mt-5 w-full border-collapse text-sm">
      <tbody className="divide-y divide-bone">
        {lignes.map(([l, v]) => (
          <tr key={l}>
            <th scope="row" className="py-2.5 pr-4 text-left font-semibold text-ink/80">{l}</th>
            <td className="py-2.5 text-right font-bold tabular-nums">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default async function DossierAssocie({ searchParams }: { searchParams: Promise<{ d?: string }> }) {
  const { d } = await searchParams;
  const dossier = decoderDossier(d);
  const garanties = garantiesDisponibles();

  return (
    <>
      <BarreNav t={FR} />
      <main className="flex-1 bg-white">
        <article className="mx-auto max-w-3xl px-5 py-14 md:py-20">
          <Surtitre>Le Dossier pour ton associé</Surtitre>
          {!dossier ? (
            <>
              <h1 className="mt-4 font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">Ce dossier n&apos;existe pas.</h1>
              <p className="mt-6 text-lg text-ink/70">Refais ton calcul sur la page d&apos;accueil : ton dossier s&apos;ouvrira à la fin.</p>
              <Link href="/#calculateur" className="mt-8 inline-flex rounded-full bg-brand px-7 py-3.5 font-black text-white hover:bg-ink">
                Aller au calculateur
              </Link>
            </>
          ) : (
            <Contenu dossier={dossier} garanties={garanties} />
          )}
        </article>
      </main>
      <Footer t={FR} />
    </>
  );
}

function Contenu({ dossier, garanties }: { dossier: NonNullable<ReturnType<typeof decoderDossier>>; garanties: ReturnType<typeof garantiesDisponibles> }) {
  const { releve, hypotheses: h } = dossier;
  const r = calculer(releve, h);
  const plateforme = PLATEFORMES.find((p) => p.id === releve.plateforme)?.nom ?? "la plateforme";
  return (
    <>
      <h1 className="mt-4 font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
        {dossier.resto ? fr(`Les chiffres de ${dossier.resto}`) : "Tes chiffres"}
      </h1>
      <p className="mt-4 text-sm text-ink/60">
        {dossier.prenom ? `Préparé pour ${dossier.prenom}` : "Préparé"}
        {dossier.ville ? `, ${dossier.ville}` : ""}. {fr(C.avertissement)}
      </p>

      <div className="relative mt-8 overflow-hidden rounded-[2rem] bg-ink p-7 text-white md:p-9">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-brand/30 blur-3xl" />
        <p className="relative text-xs font-black uppercase tracking-widest text-white/60">{fr(C.resultatPrefixe)}</p>
        <p className="relative mt-2 font-display text-5xl font-black tabular-nums md:text-6xl">{argentSigne(Math.round(r.total))}</p>
        <p className="relative mt-1 text-lg font-bold text-white/70">{C.resultatSuffixe}</p>
        {r.economieNegative && <p className="relative mt-5 border-l-4 border-brand pl-4 font-bold">{fr(C.economieNegative)}</p>}
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-black leading-tight">Ce que dit le relevé ({plateforme}), ramené sur 30 jours</h2>
        <Tableau
          lignes={[
            ["Ventes d'aliments et boissons", argent(r.mois.ventes)],
            ["Commandes (livraison / cueillette)", `${entier(r.mois.nbLivraison)} / ${entier(r.mois.nbCueillette)}`],
            ["Panier moyen", argent(r.panier, 2)],
            ["Ce que la plateforme prend (commissions et frais)", `${argent(r.mois.prisParPlateforme)} (${pourcent(r.tauxEffectif, 1)})`],
            ["Les mêmes commandes chez Resto Action, frais de carte inclus", argent(r.mois.coutChezNous)],
          ]}
        />
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-black leading-tight">D&apos;où vient l&apos;estimation</h2>
        <Tableau
          lignes={[
            [`${C.moteurs.recupere} (${pourcent(h.partApp)} des clients passent à l'app)`, argentSigne(Math.round(r.recupere))],
            [`${C.moteurs.ajustes} ${h.prixAjustes ? `(+10 %, ${C.siEntente})` : "(non cochés)"}`, argentSigne(Math.round(r.ajustes))],
            [`${C.moteurs.nouvelles} (${h.nouvellesCommandes ?? 0} par mois, aliments à ${pourcent(h.aliments)}, ${argent(r.profitParNouvelleCommande, 2)} chacune)`, argentSigne(Math.round(r.nouvelles))],
            [C.moteurs.abonnement, argentSigne(-r.abonnement)],
            ["Estimation par mois", argentSigne(Math.round(r.total))],
          ]}
        />
        {Number.isFinite(r.seuil) && (
          <p className="mt-4 text-sm text-ink/70">
            {C.seuilPrefixe} <strong className="text-ink">{entier(r.seuil)}</strong> {C.seuilSuffixe}
          </p>
        )}
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-black leading-tight">{PRIX.titre}</h2>
          <Exemple>{PRIX.taxes}</Exemple>
        </div>
        <ul className="mt-5 grid list-none gap-3 text-ink/80">
          {[PRIX.lignes.abonnement, PRIX.lignes.miseEnService, PRIX.lignes.livraison, PRIX.lignes.cueillette, PRIX.lignes.inclus].map((l) => (
            <li key={l} className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand" />
              <span>{fr(l)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-black leading-tight">Les {garanties.length} garanties</h2>
        <ol className="liste-numerotee mt-5 grid list-none gap-4">
          {garanties.map((g) => (
            <li key={g.id} className="flex gap-3">
              <span className="puce-numero mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-black text-white" />
              <p className="text-ink/80">
                <strong className="text-ink">{fr(g.nom)}</strong> « {fr(g.texte)} »
              </p>
            </li>
          ))}
        </ol>
      </section>

      <div className="no-print mt-12 flex flex-col gap-4 border-t border-bone pt-8 sm:flex-row sm:flex-wrap sm:items-center">
        <BoutonReserver href={lienReservation()} libelle={fr(`Réserve ta place dans ${NOM_OFFRE}`)} taille="md" />
        <BoutonContour href={lienAppel()}>
          <Phone className="size-4" aria-hidden="true" />
          {C.boutonAppel}
        </BoutonContour>
        <BoutonImprimer />
      </div>
      <p className="mt-6 text-sm text-ink/50">Resto Action · {PHONE_DISPLAY}</p>
    </>
  );
}
