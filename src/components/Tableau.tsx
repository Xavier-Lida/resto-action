import type { RendezVousListe } from "@/lib/google/calendrier";
import { decrireProvenance, sourceDe } from "@/lib/provenance";

/* LE TABLEAU DE BORD DE LA PROVENANCE. Rendu côté serveur, sans un octet de
   JavaScript : trois compteurs et une liste, la page n'a rien à animer.

   TOUT SE COMPTE PAR DATE DE RÉSERVATION (`cree`), pas par date du rendez-vous.
   « Les 30 derniers jours », c'est « ce que mes vidéos ont rapporté ce
   mois-ci », pas « les appels que j'ai à l'agenda ce mois-ci ».

   Une seule couleur pour les barres : c'est une grandeur (combien), pas une
   identité (qui), et le nom de la source est écrit à gauche. Une couleur par
   source aurait forcé une légende pour dire ce que le texte dit déjà. */

export const PERIODES = [30, 90, 365] as const;
export type Periode = (typeof PERIODES)[number];

const NOMS: Record<string, string> = {
  youtube: "YouTube",
  linkedin: "LinkedIn",
  google: "Google",
  meta: "Facebook / Instagram",
  tiktok: "TikTok",
  direct: "Direct (adresse tapée)",
  inconnue: "Inconnue (avant le suivi)",
};

function nomSource(source: string): string {
  return NOMS[source] ?? source;
}

function compter<T>(items: T[], cle: (item: T) => string): [string, number][] {
  const carte = new Map<string, number>();
  for (const item of items) {
    const k = cle(item);
    carte.set(k, (carte.get(k) ?? 0) + 1);
  }
  return [...carte].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

const DATE = new Intl.DateTimeFormat("fr-CA", {
  timeZone: "America/Toronto",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

/* Une rangée de barre : étiquette, piste, valeur. La largeur est relative au
   maximum, pas au total, pour que la première barre remplisse toujours la
   piste et que les autres se lisent par rapport à elle. */
function Barres({ lignes, vide }: { lignes: [string, number][]; vide: string }) {
  if (lignes.length === 0) {
    return <p className="text-sm text-ink/50">{vide}</p>;
  }
  const max = lignes[0][1];
  return (
    <ul className="flex flex-col gap-2.5">
      {lignes.map(([nom, n]) => (
        <li key={nom} className="grid grid-cols-[minmax(0,11rem)_1fr_2.5rem] items-center gap-3 text-sm">
          <span className="truncate font-bold" title={nom}>
            {nom}
          </span>
          <span className="h-3 overflow-hidden rounded-sm bg-bone">
            <span
              className="block h-full rounded-sm bg-ink"
              style={{ width: `${Math.max(2, (n / max) * 100)}%` }}
            />
          </span>
          <span className="text-right tabular-nums text-ink/70">{n}</span>
        </li>
      ))}
    </ul>
  );
}

function Carte({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border-2 border-bone bg-white p-6 md:p-8">
      <h2 className="font-display text-lg font-black tracking-tight">{titre}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function Tableau({
  rendezVous,
  periode,
  erreur,
}: {
  rendezVous: RendezVousListe[];
  periode: Periode;
  erreur: string | null;
}) {
  const parSource = compter(rendezVous, (r) => nomSource(sourceDe(r.provenance)));
  const youtube = rendezVous.filter((r) => sourceDe(r.provenance) === "youtube");
  const parVideo = compter(youtube, (r) => r.provenance?.content ?? "chaîne (sans vidéo)");
  /* La vidéo de l'accueil se compte À PART des sources : l'avoir regardée ne
     dit pas d'où on vient, et quelqu'un arrivé de YouTube peut très bien
     l'avoir regardée aussi. Les deux barres se lisent l'une contre l'autre —
     c'est leur rapport qui dit si la vidéo aide à réserver. */
  const parVisionnement = compter(rendezVous, (r) =>
    r.provenance?.video ? "Ont regardé la vidéo" : "Ne l'ont pas regardée",
  );
  const recents = [...rendezVous]
    .sort((a, b) => Date.parse(b.cree) - Date.parse(a.cree))
    .slice(0, 25);

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-6 px-4 py-10 md:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-ink/50">Resto Action</p>
          <h1 className="font-display text-3xl font-black leading-tight tracking-tight md:text-4xl">
            D&apos;où viennent les rendez-vous
          </h1>
        </div>
        <nav aria-label="Période" className="flex gap-1 rounded-full bg-bone p-1 text-sm font-bold">
          {PERIODES.map((p) => (
            <a
              key={p}
              href={`?jours=${p}`}
              aria-current={p === periode ? "page" : undefined}
              className={`rounded-full px-4 py-1.5 transition-colors ${
                p === periode ? "bg-ink text-white" : "text-ink/60 hover:text-ink"
              }`}
            >
              {p} j
            </a>
          ))}
        </nav>
      </header>

      {erreur ? (
        <p className="rounded-3xl border-2 border-brand/30 bg-brand/5 p-6 font-bold">{erreur}</p>
      ) : (
        <>
          <section className="rounded-3xl bg-ink p-6 text-white md:p-8">
            <p className="text-sm font-bold text-white/60">
              Rendez-vous pris depuis {periode} jours
            </p>
            <p className="mt-1 font-display text-6xl font-black tabular-nums leading-none">
              {rendezVous.length}
            </p>
          </section>

          <Carte titre="Par source">
            <Barres lignes={parSource} vide="Aucun rendez-vous sur cette période." />
          </Carte>

          <Carte titre="YouTube, par vidéo">
            <Barres
              lignes={parVideo}
              vide="Aucun rendez-vous venu de YouTube sur cette période."
            />
          </Carte>

          <Carte titre="La vidéo de l'accueil, avant de réserver">
            <Barres lignes={parVisionnement} vide="Aucun rendez-vous sur cette période." />
          </Carte>

          <Carte titre="Les derniers">
            {recents.length === 0 ? (
              <p className="text-sm text-ink/50">Rien à montrer.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-left text-xs font-bold uppercase tracking-wide text-ink/50">
                  <tr>
                    <th className="pb-2 pr-3 font-bold">Réservé le</th>
                    <th className="pb-2 pr-3 font-bold">Qui</th>
                    <th className="pb-2 font-bold">Provenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bone">
                  {recents.map((r) => (
                    <tr key={r.id} className="align-top">
                      <td className="whitespace-nowrap py-2 pr-3 tabular-nums text-ink/70">
                        {DATE.format(new Date(r.cree))}
                      </td>
                      <td className="py-2 pr-3 font-bold">
                        {r.titre.replace(/^Appel Resto Action — /, "")}
                      </td>
                      <td className="py-2 text-ink/70">{decrireProvenance(r.provenance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Carte>
        </>
      )}

      <p className="text-xs text-ink/40">
        Liens à coller : restoaction.ca/yt (chaîne), restoaction.ca/yt/nom-de-la-video
        (une vidéo), restoaction.ca/li (LinkedIn).
      </p>
    </main>
  );
}
