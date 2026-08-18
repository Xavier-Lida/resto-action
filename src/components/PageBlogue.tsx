import { ArrowRight } from "lucide-react";
import Link from "next/link";
import BarreNav from "@/components/BarreNav";
import DonneesStructurees from "@/components/DonneesStructurees";
import FilAriane from "@/components/FilAriane";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { FONDATEURS, SITE_URL } from "@/lib/site";
import { filArianne, refOrganisation } from "@/lib/schema";
import { minutesDeLecture } from "@/lib/contenu/blogue";
import type { IndexBlogue } from "@/lib/contenu/blogue";
import type { Article } from "@/lib/contenu/blogue/types";
import type { Textes } from "@/lib/textes/fr";

/* L'index du blogue.

   Le nœud `Blog` déclare la collection ; chaque article garde son propre
   `BlogPosting` sur sa page. On ne recopie pas les articles entiers ici — un
   `blogPost` réduit à des références suffit, et deux descriptions concurrentes
   du même article dans le graphe seraient une occasion de les désaccorder. */
export default function PageBlogue({
  t,
  index,
  articles,
}: {
  t: Textes;
  index: IndexBlogue;
  articles: Article[];
}) {
  const url = `${SITE_URL}${index.slug}`;
  const accueil = t.racine || "/";
  const fil = [
    { nom: t.nav.accueil, chemin: accueil },
    { nom: index.filNom, chemin: index.slug },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${url}#blogue`,
        name: index.metaTitre,
        description: index.metaDescription,
        inLanguage: t.htmlLang,
        url,
        publisher: refOrganisation(t.racine),
        blogPost: articles.map((a) => ({
          "@type": "BlogPosting",
          "@id": `${SITE_URL}${a.slug}#article`,
        })),
      },
      filArianne(url, fil),
    ],
  };

  return (
    <>
      <BarreNav t={t} />
      <main className="flex-1" lang={t.htmlLang}>
        <section className="bg-bone">
          <div className="mx-auto max-w-4xl px-5 py-14 md:py-20">
            <FilAriane elements={fil} />
            <Reveal>
              <p className="mt-8 text-xs font-black uppercase tracking-widest text-brand">
                {index.surTitre}
              </p>
              <h1 className="mt-3 font-display text-4xl font-black leading-tight tracking-tight md:text-6xl">
                {index.titre}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/75">
                {index.intro}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-4xl px-5 py-16 md:py-20">
            <ul className="grid list-none gap-5">
              {articles.map((a, i) => {
                const auteur = FONDATEURS[a.auteur];
                const date = new Date(
                  `${a.publieLe}T12:00:00Z`
                ).toLocaleDateString(t.htmlLang, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
                return (
                  <li key={a.slug}>
                    <Reveal delay={(i % 3) as 0 | 1 | 2}>
                      <Link
                        href={a.slug}
                        className="group block rounded-3xl border-2 border-bone p-7 transition-colors hover:border-brand md:p-9"
                      >
                        {/* `time` porte la date lisible par une machine ; le
                            texte affiché reste dans la langue de la page. */}
                        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                          <time dateTime={a.publieLe}>{date}</time>
                          <span aria-hidden="true">·</span>
                          <span>
                            {index.parAuteur.replace("{auteur}", auteur.nom)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {index.lecture.replace(
                              "{n}",
                              String(minutesDeLecture(a))
                            )}
                          </span>
                        </p>
                        <h2 className="mt-4 font-display text-2xl font-black leading-snug tracking-tight md:text-3xl">
                          {a.titre}
                        </h2>
                        <p className="mt-3 leading-relaxed text-ink/75">
                          {a.extrait}
                        </p>
                        <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand">
                          {index.lire}
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Link>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <DonneesStructurees json={jsonLd} />
      </main>
      <Footer t={t} />
    </>
  );
}
