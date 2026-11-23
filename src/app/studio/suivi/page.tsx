import type { Metadata } from "next";
import { STUDIO } from "@/lib/site";
import { depensesDuJour, dernieresFiches, stockagePret } from "@/lib/studio/stockage";
import type { Fiche } from "@/lib/studio/types";

/* LE SUIVI DU STUDIO PHOTO (/studio/suivi) : la page de l'équipe.

   Personne ne valide une retouche avant qu'elle parte : c'est ICI qu'on
   vérifie après coup. Les dernières retouches, avec l'originale, le résultat,
   le verdict du contrôle, le moteur, le temps et le coût.

   PROTÉGÉE par src/proxy.ts (le mot de passe du tableau de bord, TABLEAU_MDP),
   comme les images qu'elle affiche. Hors du plan du site, fermée aux robots.
   Ouverte même quand le Studio est caché au public. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Suivi du Studio Photo",
  robots: { index: false, follow: false },
};

const NOMBRE = 60;

const quand = (iso: string) =>
  new Date(iso).toLocaleString("fr-CA", { timeZone: "America/Toronto", dateStyle: "medium", timeStyle: "short" });

const image = (id: string, vue: string) => `/api/studio/suivi/image?id=${id}&vue=${vue}`;

const REPLIS = { controle: "2 échecs au contrôle", panne: "moteur d'IA en panne", plafond: "plafond du jour atteint" } as const;

function resume(f: Fiche): { titre: string; ton: string } {
  if (f.etat === "en-cours") return { titre: "En cours", ton: "bg-bone text-ink" };
  if (f.etat === "erreur") return { titre: "Panne", ton: "bg-ink text-white" };
  if (f.etat === "refusee") return { titre: `Refusée : ${f.refus ?? "?"}`, ton: "bg-ink text-white" };
  if (f.moteur === "ia") return { titre: "Retouche par IA", ton: "bg-brand text-white" };
  return { titre: `Correction sans génération (${f.repli ? REPLIS[f.repli] : "?"})`, ton: "bg-yellow-200 text-ink" };
}

export default async function SuiviStudio() {
  if (!stockagePret()) {
    return (
      <main className="mx-auto max-w-3xl p-6" lang="fr-CA">
        <h1 className="font-display text-2xl font-black">Suivi du Studio Photo</h1>
        <p className="mt-4">Le magasin des photos n&apos;est pas branché (BLOB_READ_WRITE_TOKEN).</p>
      </main>
    );
  }

  const [fiches, depenses] = await Promise.all([dernieresFiches(NOMBRE), depensesDuJour()]);
  const pretes = fiches.filter((f) => f.etat === "pret");
  const moyenne = (valeurs: number[]) => (valeurs.length ? valeurs.reduce((a, b) => a + b, 0) / valeurs.length : 0);
  const tempsMoyen = moyenne(pretes.map((f) => (f.dureeMs ?? 0) / 1000));
  const coutMoyen = moyenne(pretes.map((f) => f.coutUsd ?? 0));
  const parIA = pretes.filter((f) => f.moteur === "ia").length;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8" lang="fr-CA">
      <h1 className="font-display text-2xl font-black md:text-3xl">Suivi du Studio Photo</h1>
      <p className="mt-2 text-sm text-ink/70">
        Les {NOMBRE} dernières retouches. Les photos s&apos;effacent après {STUDIO.gardeJours} jours, sauf les exemples permis.
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Temps moyen", pretes.length ? `${tempsMoyen.toFixed(0)} s` : "…"],
          ["Coût moyen", pretes.length ? `${coutMoyen.toFixed(3)} $ US` : "…"],
          ["Livrées par IA", pretes.length ? `${parIA} sur ${pretes.length}` : "…"],
          ["Dépensé aujourd'hui", `${depenses.toFixed(2)} $ sur ${STUDIO.plafondDepensesJour} $ CA`],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-bone px-4 py-3">
            <dt className="text-xs font-bold text-ink/60">{k}</dt>
            <dd className="mt-1 font-display text-lg font-black tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      {tempsMoyen > 60 && (
        <p className="mt-4 rounded-2xl bg-yellow-200 px-4 py-3 text-sm font-bold">
          La moyenne dépasse 60 secondes : la promesse du titre (« en {STUDIO.delaiPromis} ») est à revoir.
        </p>
      )}

      {fiches.length === 0 && <p className="mt-8">Aucune retouche pour l&apos;instant.</p>}

      <ul className="mt-8 space-y-6">
        {fiches.map((f) => {
          const r = resume(f);
          const vue = f.etat === "pret";
          return (
            <li key={f.id} id={f.id} className="scroll-mt-6 rounded-[1.5rem] border border-ink/10 p-4 md:p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="font-display text-lg font-black">
                  {f.resto} <span className="font-sans text-sm font-bold text-ink/60">({f.ville})</span>
                </h2>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${r.ton}`}>{r.titre}</span>
                {f.contact?.exemple && <span className="rounded-full bg-bone px-3 py-1 text-xs font-black">Exemple permis</span>}
              </div>
              <p className="mt-1 text-sm text-ink/60 tabular-nums">
                {quand(f.creeLe)} · {f.dureeMs ? `${(f.dureeMs / 1000).toFixed(0)} s` : "temps ?"} ·{" "}
                {f.coutUsd !== undefined ? `${f.coutUsd.toFixed(3)} $ US` : "coût ?"} · {f.essais} essai{f.essais > 1 ? "s" : ""} d&apos;IA ·{" "}
                {f.contact ? `formulaire envoyé (${f.contact.prenom})` : "pas de formulaire"}
              </p>
              {f.contact && (
                <p className="mt-2 text-sm">
                  <a href={`/tableau/leads#${f.contact.cellHache}`} className="font-black underline underline-offset-4">
                    Voir le contact dans le mini CRM
                  </a>
                </p>
              )}

              {f.etat !== "en-cours" && (
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {/* Des images privées, servies par notre route protégée : pas d'optimiseur d'images ici. */}
                  {(vue ? (["originale", "apres", "carre", "vertical"] as const) : (["avant"] as const)).map((v) => (
                    <a key={v} href={image(f.id, v)} target="_blank" rel="noreferrer" className="block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image(f.id, v === "originale" ? "avant" : v)} alt="" loading="lazy" className="block h-auto w-full rounded-xl bg-bone" />
                      <span className="mt-1 block text-xs font-bold text-ink/60">
                        {{ originale: "Originale", avant: "Originale", apres: "Résultat", carre: "Carré", vertical: "Vertical" }[v]}
                      </span>
                    </a>
                  ))}
                </div>
              )}

              {f.verdicts.length > 0 && (
                <ol className="mt-4 space-y-2 text-sm">
                  {f.verdicts.map((v, i) => (
                    <li key={i} className="rounded-xl bg-bone px-4 py-3">
                      <p className="font-black">
                        Contrôle, essai {i + 1} : même plat? {v.meme_plat}
                      </p>
                      <p className="mt-1 text-ink/70">
                        Aliments {v.memes_aliments ? "oui" : "NON"} · portions {v.memes_portions ? "oui" : "NON"} · assiette{" "}
                        {v.meme_assiette ? "oui" : "NON"} · rien d&apos;ajouté {v.rien_ajoute ? "oui" : "NON"} · rien d&apos;enlevé{" "}
                        {v.rien_enleve ? "oui" : "NON"}
                      </p>
                      {v.differences.length > 0 && (
                        <ul className="mt-1 list-disc pl-5 text-ink/70">
                          {v.differences.map((d, j) => (
                            <li key={j}>{d}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>
              )}
              {f.motif && <p className="mt-3 text-sm text-ink/70">Premier contrôle : {f.motif}</p>}
              {f.publication && <p className="mt-2 text-sm text-ink/70">Publication : {f.publication}</p>}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
