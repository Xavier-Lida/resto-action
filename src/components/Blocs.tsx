import Link from "next/link";
import type { ReactNode } from "react";
import type { Bloc } from "@/lib/contenu/blocs";

/* Le rendu des blocs de contenu. Un seul composant pour les pages de
   plateforme et les articles : le style de la prose se décide ici et nulle
   part ailleurs.

   Les titres sont des `h2`/`h3` : la page fournit le `h1`, et le fil des
   titres doit rester continu — c'est ce que suit un moteur pour comprendre le
   plan d'un texte, et un lecteur d'écran pour le parcourir. */

/* Le balisage en ligne : `**gras**` et `[libellé](url)`.

   Une seule expression régulière pour les deux, sinon il faudrait parser deux
   fois le même texte et recoller les morceaux. Les liens externes partent dans
   un onglet neuf avec `rel="noopener"`, comme partout ailleurs sur le site ;
   les liens internes restent dans la page. */
const MOTIF = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

export function enLigne(texte: string): ReactNode[] {
  const morceaux: ReactNode[] = [];
  let curseur = 0;
  let m: RegExpExecArray | null;
  MOTIF.lastIndex = 0;

  while ((m = MOTIF.exec(texte)) !== null) {
    if (m.index > curseur) morceaux.push(texte.slice(curseur, m.index));

    if (m[1] !== undefined) {
      morceaux.push(
        <strong key={m.index} className="font-black text-ink">
          {m[1]}
        </strong>
      );
    } else {
      const href = m[3];
      const externe = href.startsWith("http");
      const style =
        "font-bold text-ink underline decoration-brand decoration-2 underline-offset-2 transition-colors hover:text-brand";
      /* LE SEUL LIEN DU SITE QUI NE SAIT QU'À L'EXÉCUTION OÙ IL MÈNE : il vient
         d'un `[libellé](url)` écrit dans un article. Un lien externe reste un
         `a` — `Link` n'a rien à précharger hors du site, et ouvrir un onglet
         neuf est ce qu'on attend d'une source citée. Un lien interne passe par
         `Link`, comme partout ailleurs. */
      morceaux.push(
        externe ? (
          <a
            key={m.index}
            href={href}
            target="_blank"
            rel="noopener"
            className={style}
          >
            {m[2]}
          </a>
        ) : (
          <Link key={m.index} href={href} className={style}>
            {m[2]}
          </Link>
        )
      );
    }
    curseur = m.index + m[0].length;
  }

  if (curseur < texte.length) morceaux.push(texte.slice(curseur));
  return morceaux;
}

export default function Blocs({ blocs }: { blocs: Bloc[] }) {
  return (
    <div className="space-y-6 leading-relaxed text-ink/75">
      {blocs.map((bloc, i) => {
        switch (bloc.t) {
          case "h2":
            return (
              <h2
                key={i}
                className="pt-6 font-display text-2xl font-black leading-tight tracking-tight text-ink md:text-3xl"
              >
                {bloc.texte}
              </h2>
            );

          case "h3":
            return (
              <h3
                key={i}
                className="pt-2 font-display text-lg font-bold text-ink md:text-xl"
              >
                {bloc.texte}
              </h3>
            );

          case "p":
            return <p key={i}>{enLigne(bloc.texte)}</p>;

          case "ul":
            return (
              <ul key={i} className="space-y-2 pl-1">
                {bloc.items.map((item, j) => (
                  <li key={j} className="flex gap-3">
                    {/* La puce est décorative : c'est la liste qui porte le
                        sens, pas le carré rouge. */}
                    <span
                      aria-hidden="true"
                      className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand"
                    />
                    <span>{enLigne(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol key={i} className="space-y-3 pl-1">
                {bloc.items.map((item, j) => (
                  <li key={j} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-black text-white"
                    >
                      {j + 1}
                    </span>
                    <span>{enLigne(item)}</span>
                  </li>
                ))}
              </ol>
            );

          case "citation":
            return (
              <figure key={i} className="border-l-4 border-brand pl-5">
                <blockquote className="text-lg font-bold leading-snug text-ink">
                  {enLigne(bloc.texte)}
                </blockquote>
                {bloc.source && (
                  <figcaption className="mt-2 text-sm text-ink/60">
                    {enLigne(bloc.source)}
                  </figcaption>
                )}
              </figure>
            );

          case "tableau":
            return (
              /* LE TABLEAU DÉFILE DANS SA PROPRE BOÎTE. Sans ce conteneur, un
                 tableau à trois colonnes fait déborder la PAGE sur téléphone :
                 c'est la mise en page entière qui se met à glisser
                 horizontalement, pas seulement le tableau. */
              <div key={i} className="overflow-x-auto">
                <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-ink">
                      {bloc.entetes.map((e, j) => (
                        <th key={j} scope="col" className="py-3 pr-4 font-black text-ink">
                          {e}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bloc.lignes.map((ligne, j) => (
                      <tr key={j} className="border-b border-bone">
                        {ligne.map((cellule, k) => (
                          /* La première colonne est un en-tête de ligne :
                             c'est elle qui nomme ce que les autres mesurent,
                             et `scope` est ce qui permet à un lecteur d'écran
                             d'annoncer « Commissions : 0 $ ». */
                          k === 0 ? (
                            <th key={k} scope="row" className="py-3 pr-4 font-bold text-ink">
                              {enLigne(cellule)}
                            </th>
                          ) : (
                            <td key={k} className="py-3 pr-4">
                              {enLigne(cellule)}
                            </td>
                          )
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "encadre":
            return (
              <aside key={i} className="rounded-2xl bg-bone p-6">
                <p className="font-black text-ink">{bloc.titre}</p>
                <p className="mt-2">{enLigne(bloc.texte)}</p>
              </aside>
            );
        }
      })}
    </div>
  );
}
