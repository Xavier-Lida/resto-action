import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import BarreNav from "@/components/BarreNav";
import Blocs from "@/components/Blocs";
import DonneesStructurees from "@/components/DonneesStructurees";
import FilAriane from "@/components/FilAriane";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SectionFaq from "@/components/SectionFaq";
import { PHONE_DISPLAY, PHONE_HREF, SITE_URL } from "@/lib/site";
import { filArianne, noeudFaq, noeudService } from "@/lib/schema";
import type { Fonctionnalite } from "@/lib/contenu/fonctionnalites";
import type { Plateforme } from "@/lib/contenu/plateforme";
import type { Textes } from "@/lib/textes/fr";

/* Une page de fonctionnalité, partagée par les quatre et par les deux langues.

   Elle NE DÉCLARE PAS de catalogue : le nœud `hasOfferCatalog` appartient à la
   page plateforme, qui chapeaute les quatre. Ici, un simple `Service` rattaché
   à l'entreprise par `@id`.

   Le fil d'Ariane compte trois maillons — accueil › plateforme › celle-ci —
   et c'est ce qui remplace l'URL brute sous le titre dans les résultats. */
export default function PageFonctionnalite({
  t,
  f,
  plateforme,
}: {
  t: Textes;
  f: Fonctionnalite;
  plateforme: Plateforme;
}) {
  const url = `${SITE_URL}${f.slug}`;
  const accueil = t.racine || "/";

  const fil = [
    { nom: t.nav.accueil, chemin: accueil },
    { nom: plateforme.filNom, chemin: plateforme.slug },
    { nom: f.filNom, chemin: f.slug },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      noeudService({
        url,
        racine: t.racine,
        nom: f.titre,
        description: f.metaDescription,
        typeService: f.typeService,
        langue: t.htmlLang,
        zoneServie: t.donnees.zoneServie,
      }),
      filArianne(url, fil),
      noeudFaq({ id: `${url}#faq`, langue: t.htmlLang, items: f.faq.items }),
    ],
  };

  return (
    <>
      <BarreNav t={t} />
      <main className="flex-1" lang={t.htmlLang}>
        <section className="bg-bone">
          <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
            <FilAriane elements={fil} />
            <Reveal>
              <p className="mt-8 text-xs font-black uppercase tracking-widest text-brand">
                {f.surTitre}
              </p>
              <h1 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
                {f.titre}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-ink/75">
                {f.intro}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
            <Blocs blocs={f.blocs} />

            {/* Le retour vers la page qui chapeaute : le maillage doit
                remonter autant qu'il descend, sinon une page de
                fonctionnalité est un cul-de-sac. */}
            <p className="mt-14 border-t border-bone pt-8">
              <Link
                href={plateforme.slug}
                className="inline-flex items-center gap-2 text-sm font-bold text-ink/60 transition-colors hover:text-ink"
              >
                <ArrowLeft className="size-4" />
                {plateforme.filNom}
              </Link>
            </p>
          </div>
        </section>

        <SectionFaq titre={f.faq.titre} items={f.faq.items} />

        <section className="bg-hero text-white">
          <div className="mx-auto max-w-4xl px-5 py-16 text-center md:py-20">
            <Reveal>
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-black leading-tight tracking-tight md:text-4xl">
                {f.cta.titre}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
                {f.cta.texte}
              </p>
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
            </Reveal>
          </div>
        </section>

        <DonneesStructurees json={jsonLd} />
      </main>
      <Footer t={t} />
    </>
  );
}
