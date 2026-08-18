import { ArrowRight, Phone } from "lucide-react";
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
import type { Plateforme } from "@/lib/contenu/plateforme";
import type { Cle, Fonctionnalite } from "@/lib/contenu/fonctionnalites";
import { CLES } from "@/lib/contenu/fonctionnalites";
import type { Textes } from "@/lib/textes/fr";

/* La page produit, partagée par les deux langues.

   Elle est la RÉPONSE au reproche central de l'audit : le site ne disait
   jamais ce qu'il vend. Elle est aussi le sommet d'une petite hiérarchie —
   accueil › plateforme › fonctionnalité — qui est ce qui rend le fil d'Ariane
   pertinent pour la première fois.

   Trois dictionnaires arrivent ensemble : `t` pour la barre et le pied (qui
   suivent la langue), `p` pour le contenu de la page, `fonctionnalites` pour
   les quatre cartes. */
export default function PagePlateforme({
  t,
  p,
  fonctionnalites,
}: {
  t: Textes;
  p: Plateforme;
  fonctionnalites: Record<Cle, Fonctionnalite>;
}) {
  const url = `${SITE_URL}${p.slug}`;
  const accueil = t.racine || "/";

  const fil = [
    { nom: t.nav.accueil, chemin: accueil },
    { nom: p.filNom, chemin: p.slug },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      /* Le catalogue des quatre fonctionnalités vit ICI et sur aucune autre
         page : c'est celle-ci qui les chapeaute. Une page de fonctionnalité
         qui listerait ses sœurs se déclarerait comme leur parent à toutes. */
      noeudService({
        url,
        racine: t.racine,
        nom: p.titre,
        description: p.metaDescription,
        typeService: p.typeService,
        langue: t.htmlLang,
        zoneServie: t.donnees.zoneServie,
        fonctionnalites: CLES.map((cle) => ({
          nom: fonctionnalites[cle].titre,
          description: fonctionnalites[cle].resume,
          url: `${SITE_URL}${fonctionnalites[cle].slug}`,
        })),
      }),
      filArianne(url, fil),
      noeudFaq({
        id: `${url}#faq`,
        langue: t.htmlLang,
        items: p.faq.items,
      }),
    ],
  };

  return (
    <>
      <BarreNav t={t} />
      <main className="flex-1" lang={t.htmlLang}>
        {/* L'en-tête, sur le rouge de la maison. */}
        <section className="bg-white p-3 md:p-5 lg:p-6">
          <div className="rounded-[2rem] bg-hero px-5 py-16 text-white md:py-20 lg:rounded-[3rem] lg:px-10">
            <div className="mx-auto max-w-4xl">
              <FilAriane elements={fil} clair />
              <Reveal>
                <p className="mt-8 text-xs font-black uppercase tracking-widest text-white/70">
                  {p.surTitre}
                </p>
                <h1 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
                  {p.titre}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
                  {p.intro}
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Le corps du texte. */}
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
            <Blocs blocs={p.blocs} />
          </div>
        </section>

        {/* Les quatre cartes vers les pages de fonctionnalité. C'est le
            maillage interne qui manquait complètement au site : jusqu'ici,
            aucune page ne menait à une autre page. */}
        <section className="bg-bone">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
            <Reveal>
              <h2 className="font-display text-2xl font-black tracking-tight md:text-3xl">
                {p.cartes.titre}
              </h2>
              <p className="mt-3 text-ink/70">{p.cartes.texte}</p>
            </Reveal>

            <ul className="mt-10 grid list-none gap-5 md:grid-cols-2">
              {CLES.map((cle, i) => {
                const f = fonctionnalites[cle];
                return (
                  <li key={cle}>
                    <Reveal delay={(i % 2) as 0 | 1}>
                      <Link
                        href={f.slug}
                        className="group flex h-full flex-col rounded-3xl bg-white p-7 transition-colors hover:bg-ink hover:text-white"
                      >
                        <p className="text-xs font-black uppercase tracking-widest text-brand">
                          {f.surTitre}
                        </p>
                        <h3 className="mt-3 font-display text-xl font-black leading-snug tracking-tight">
                          {f.titre}
                        </h3>
                        <p className="mt-3 leading-relaxed text-ink/70 group-hover:text-white/75">
                          {f.resume}
                        </p>
                        <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand">
                          {p.cartes.lire}
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

        <SectionFaq titre={p.faq.titre} items={p.faq.items} />

        {/* Le CTA, même fond rouge que la section contact de l'accueil. */}
        <section className="bg-hero text-white">
          <div className="mx-auto max-w-4xl px-5 py-16 text-center md:py-20">
            <Reveal>
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-black leading-tight tracking-tight md:text-4xl">
                {p.cta.titre}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
                {p.cta.texte}
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
