import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import BarreNav from "@/components/BarreNav";
import Blocs from "@/components/Blocs";
import DonneesStructurees from "@/components/DonneesStructurees";
import FilAriane from "@/components/FilAriane";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { FONDATEURS, PHONE_DISPLAY, PHONE_HREF, SITE_URL } from "@/lib/site";
import { filArianne, noeudArticle } from "@/lib/schema";
import { minutesDeLecture } from "@/lib/contenu/blogue";
import type { IndexBlogue } from "@/lib/contenu/blogue";
import type { Article } from "@/lib/contenu/blogue/types";
import type { Textes } from "@/lib/textes/fr";

/* Un article.

   L'AUTEUR EST UNE PERSONNE NOMMÉE, pas la marque. C'est le signal E-E-A-T que
   cherchent les moteurs — qui parle, et qu'est-ce qui l'autorise à parler — et
   son `sameAs` LinkedIn est le même que celui déclaré en `founder` de
   l'entreprise sur l'accueil : c'est ce qui permet de recoller l'auteur de
   l'article au dirigeant de la boîte plutôt que d'en faire deux inconnus. */
export default function PageArticle({
  t,
  article,
  index,
  autres,
}: {
  t: Textes;
  article: Article;
  index: IndexBlogue;
  autres: Article[];
}) {
  const url = `${SITE_URL}${article.slug}`;
  const accueil = t.racine || "/";
  const auteur = FONDATEURS[article.auteur];

  const fil = [
    { nom: t.nav.accueil, chemin: accueil },
    { nom: index.filNom, chemin: index.slug },
    { nom: article.filNom, chemin: article.slug },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      noeudArticle({
        url,
        racine: t.racine,
        titre: article.titre,
        description: article.extrait,
        langue: t.htmlLang,
        publieLe: article.publieLe,
        modifieLe: article.modifieLe,
        auteur: { nom: auteur.nom, sameAs: auteur.linkedin },
      }),
      filArianne(url, fil),
    ],
  };

  const dateLisible = (iso: string) =>
    new Date(`${iso}T12:00:00Z`).toLocaleDateString(t.htmlLang, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <>
      <BarreNav t={t} />
      <main className="flex-1" lang={t.htmlLang}>
        <article>
          <section className="bg-bone">
            <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
              <FilAriane elements={fil} />
              <Reveal>
                <h1 className="mt-8 font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
                  {article.titre}
                </h1>
                <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-widest text-ink/50">
                  <time dateTime={article.publieLe}>
                    {dateLisible(article.publieLe)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <a
                    href={auteur.linkedin}
                    target="_blank"
                    rel="noopener author"
                    className="transition-colors hover:text-ink"
                  >
                    {index.parAuteur.replace("{auteur}", auteur.nom)}
                  </a>
                  <span aria-hidden="true">·</span>
                  <span>
                    {index.lecture.replace(
                      "{n}",
                      String(minutesDeLecture(article))
                    )}
                  </span>
                </p>
              </Reveal>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
              <Blocs blocs={article.blocs} />

              <p className="mt-14 border-t border-bone pt-8">
                <Link
                  href={index.slug}
                  className="inline-flex items-center gap-2 text-sm font-bold text-ink/60 transition-colors hover:text-ink"
                >
                  <ArrowLeft className="size-4" />
                  {index.retour}
                </Link>
              </p>
            </div>
          </section>
        </article>

        {/* Les autres articles : c'est ce qui empêche un article d'être un
            cul-de-sac, pour un lecteur comme pour un robot qui explore. */}
        {autres.length > 0 && (
          <section className="bg-bone">
            <div className="mx-auto max-w-4xl px-5 py-16">
              <h2 className="font-display text-2xl font-black tracking-tight">
                {index.titre}
              </h2>
              <ul className="mt-8 grid list-none gap-4 md:grid-cols-2">
                {autres.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={a.slug}
                      className="group flex h-full flex-col rounded-2xl bg-white p-6 transition-colors hover:bg-ink hover:text-white"
                    >
                      <h3 className="font-display text-lg font-black leading-snug">
                        {a.titre}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink/70 group-hover:text-white/75">
                        {a.extrait}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="bg-hero text-white">
          <div className="mx-auto max-w-4xl px-5 py-16 text-center">
            <h2 className="mx-auto max-w-2xl font-display text-2xl font-black leading-tight tracking-tight md:text-3xl">
              {t.contact.titre}
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href={`${t.racine}/contact`}
                className="inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-black text-ink transition hover:bg-ink hover:text-white"
              >
                {t.nav.contacter}
                <ArrowRight className="size-5" />
              </Link>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center gap-3 rounded-2xl border-2 border-white/40 px-8 py-4 font-black transition hover:border-white"
              >
                <Phone className="size-5" />
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>

        <DonneesStructurees json={jsonLd} />
      </main>
      <Footer t={t} />
    </>
  );
}
