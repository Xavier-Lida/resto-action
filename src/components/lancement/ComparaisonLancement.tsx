import { Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import { Surtitre } from "@/components/lancement/ui";
import { COMPARAISON, disponible } from "@/lib/contenu/grand-lancement";
import { fr } from "@/lib/format";

/* POURQUOI PERSONNE NE PEUT NOUS COMPARER. Le tableau dans une carte crème
   (il défile dans sa propre boîte au cellulaire), puis « d'un seul coup »
   dans une carte sombre cochée, et les 5 questions du resto d'en face. */
export default function ComparaisonLancement() {
  const seulCoup = COMPARAISON.seulCoup.filter(disponible);
  const test = COMPARAISON.test.filter(disponible);
  const derniere = COMPARAISON.lignes.length - 1;
  return (
    <section id="comparaison" className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Reveal>
          <Surtitre>Pourquoi personne ne peut nous comparer</Surtitre>
          <h2 className="mt-4 max-w-4xl font-display text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">
            {fr(COMPARAISON.titre)}
          </h2>
        </Reveal>

        <Reveal delay={1}>
          <div className="mt-12 overflow-x-auto rounded-[2rem] border-2 border-ink/10 bg-bone p-2">
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <thead>
                <tr>
                  {COMPARAISON.entetes.map((e) => (
                    <th key={e} scope="col" className="px-4 py-3 text-xs font-black uppercase tracking-widest text-ink/50">
                      {fr(e)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARAISON.lignes.map((l, i) => (
                  <tr key={l[0]} className={i === derniere ? "rounded-2xl bg-brand text-white" : ""}>
                    {l.map((c, j) =>
                      j === 0 ? (
                        <th key={j} scope="row" className={`rounded-l-2xl px-4 py-4 align-top font-display font-black ${i === derniere ? "" : "text-ink"}`}>
                          {fr(c)}
                        </th>
                      ) : (
                        <td key={j} className={`px-4 py-4 align-top ${j === l.length - 1 ? "rounded-r-2xl" : ""} ${i === derniere ? "font-bold" : "text-ink/75"}`}>
                          {fr(c)}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 max-w-3xl leading-relaxed text-ink/70">{fr(COMPARAISON.sousTableau)}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-[2rem] bg-ink p-8 text-white md:p-10">
              <h3 className="font-display text-2xl font-black leading-tight md:text-3xl">{fr(COMPARAISON.seulCoupTitre)}</h3>
              <ul className="mt-7 grid list-none gap-4">
                {seulCoup.map((s) => (
                  <li key={s.texte} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="font-semibold leading-snug">{fr(s.texte)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="h-full rounded-[2rem] border-2 border-ink/10 bg-bone p-8 md:p-10">
              <h3 className="font-display text-2xl font-black leading-tight md:text-3xl">{fr(COMPARAISON.testTitre)}</h3>
              <ol className="liste-numerotee mt-7 grid list-none gap-5">
                {test.map((q) => (
                  <li key={q.question} className="flex gap-3">
                    <span className="puce-numero mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-black text-white" />
                    <div>
                      <p className="font-black leading-snug">{fr(q.question)}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink/75">
                        <strong className="text-ink">{COMPARAISON.reponsePrefixe}</strong> {fr(q.reponse)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
