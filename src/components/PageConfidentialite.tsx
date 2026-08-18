import BarreNav from "@/components/BarreNav";
import DonneesStructurees from "@/components/DonneesStructurees";
import Footer from "@/components/Footer";
import { EMAIL, PHONE_DISPLAY, PHONE_HREF, SITE_URL } from "@/lib/site";
import { POLITIQUE_MAJ, type Confidentialite } from "@/lib/contenu/confidentialite";
import type { Textes } from "@/lib/textes/fr";

/* La politique de confidentialité, partagée par les deux langues.

   Elle n'existait qu'en français, et le pied de page anglais y menait quand
   même : un anglophone qui cliquait « Privacy policy » tombait sur du texte
   français. Le balisage vit donc ici une fois, et les deux routes ne portent
   plus que leur contenu et leurs métadonnées — même forme que PageContact.

   Deux dictionnaires arrivent ensemble : `t` pour la barre et le pied (qui
   parlent la langue de la page), `c` pour le texte légal lui-même. */
export default function PageConfidentialite({
  t,
  c,
}: {
  t: Textes;
  c: Confidentialite;
}) {
  /* Le nœud renvoie à l'Organization déclarée par l'accueil au lieu de la
     redéclarer, comme le fait déjà /contact : une seule fiche d'entreprise
     dans tout le graphe. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}${t.pied.confidentialiteHref}#page`,
    url: `${SITE_URL}${t.pied.confidentialiteHref}`,
    name: c.metaTitre,
    description: c.metaDescription,
    inLanguage: t.htmlLang,
    dateModified: POLITIQUE_MAJ,
    about: { "@id": `${SITE_URL}${t.racine}/#organization` },
  };

  // Mois et année suffisent pour une politique : le jour ne dit rien de plus.
  const maj = new Date(`${POLITIQUE_MAJ}T12:00:00Z`).toLocaleDateString(
    t.htmlLang,
    { year: "numeric", month: "long" }
  );

  const sections = [c.recueillis, c.statistiques];
  const suite = [c.droits, c.qui];

  return (
    <>
      <BarreNav t={t} />
      <main className="flex-1" lang={t.htmlLang}>
        <div className="mx-auto max-w-2xl px-5 py-20 md:py-28">
          <p className="text-xs font-black uppercase tracking-widest text-brand">
            {c.surTitre}
          </p>
          <h1 className="mt-3 text-3xl md:text-5xl font-black leading-tight tracking-tight">
            {c.titre}
          </h1>
          <p className="mt-7 text-lg leading-relaxed text-ink/75">{c.intro}</p>

          <div className="mt-12 space-y-10 leading-relaxed text-ink/75">
            {sections.map(({ titre, texte }) => (
              <section key={titre}>
                <h2 className="text-xl font-black text-ink">{titre}</h2>
                <p className="mt-3">{texte}</p>
              </section>
            ))}

            {/* La seule section que des liens traversent. */}
            <section>
              <h2 className="text-xl font-black text-ink">
                {c.responsable.titre}
              </h2>
              <p className="mt-3">
                {c.responsable.avant}
                <a
                  href={`mailto:${EMAIL}`}
                  className="font-bold text-ink underline hover:text-brand"
                >
                  {EMAIL}
                </a>
                {c.responsable.entre}
                <a
                  href={PHONE_HREF}
                  className="font-bold text-ink underline hover:text-brand"
                >
                  {PHONE_DISPLAY}
                </a>
                {c.responsable.apres}
              </p>
            </section>

            {suite.map(({ titre, texte }) => (
              <section key={titre}>
                <h2 className="text-xl font-black text-ink">{titre}</h2>
                <p className="mt-3">{texte}</p>
              </section>
            ))}

            <p className="text-sm text-ink/50">
              {c.derniereMaj.replace("{date}", maj)}
            </p>
          </div>
        </div>

        <DonneesStructurees json={jsonLd} />
      </main>
      <Footer t={t} />
    </>
  );
}
