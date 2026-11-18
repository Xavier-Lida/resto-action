import { ArrowRight, Check, Monitor, Phone, ShoppingBag, Smartphone, Users, X, Zap } from "lucide-react";
import Link from "next/link";
import BarreNav from "@/components/BarreNav";
import CommentOnFait from "@/components/CommentOnFait";
import DonneesStructurees from "@/components/DonneesStructurees";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SectionFaq from "@/components/SectionFaq";
import { PHONE_DISPLAY, PHONE_HREF, SITE_URL } from "@/lib/site";
import { filArianne, noeudFaq, noeudService } from "@/lib/schema";
import type { Plateforme } from "@/lib/contenu/plateforme";
import type { Cle, Fonctionnalite } from "@/lib/contenu/fonctionnalites";
import { CLES } from "@/lib/contenu/fonctionnalites";
import { piecesPretes } from "@/lib/contenu/pieces";
import type { Textes } from "@/lib/textes/fr";

/* La page produit, partagée par les deux langues.

   Elle est la RÉPONSE au reproche central de l'audit : le site ne disait
   jamais ce qu'il vend. Elle est aussi le sommet d'une petite hiérarchie —
   accueil › plateforme › fonctionnalité — qui est ce qui rend le fil d'Ariane
   pertinent pour la première fois.

   Trois dictionnaires arrivent ensemble : `t` pour la barre et le pied (qui
   suivent la langue), `p` pour le contenu de la page, `fonctionnalites` pour
   les quatre cartes. */
const ICONES = { vite: Zap, commande: ShoppingBag, app: Smartphone, clients: Users };

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
  const francais = t.htmlLang.startsWith("fr");
  // Les cartes : les quatre fonctionnalités, puis (en français) les pièces prêtes.
  const cartes = [
    ...CLES.map((cle) => fonctionnalites[cle]),
    ...(francais ? piecesPretes() : []),
  ];
  const accueil = t.racine || "/";
  const v = p.visuel;

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
        {/* La page « comment on fait », à la Owner, dans les deux langues. */}
        <CommentOnFait fil={fil} langue={francais ? "fr" : "en"} />

        {/* 18 nov. : moins de texte, plus d'images. Quatre sections courtes. */}

        {/* 1. POURQUOI UN NOUVEAU SITE */}
        <section className="bg-white px-3 md:px-5 lg:px-6">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <h2 className="font-display text-3xl font-black leading-[1.05] tracking-tight md:text-5xl">{v.siteTitre}</h2>
                  <p className="mt-3 text-lg font-bold text-ink/60 md:text-xl">{v.siteTexte}</p>
                </div>
                <span aria-hidden="true" className="hidden size-16 place-items-center rounded-3xl bg-brand text-white md:grid">
                  <Monitor className="size-8" />
                </span>
              </div>
            </Reveal>
            <ul className="mt-10 grid list-none grid-cols-2 gap-3 lg:grid-cols-4">
              {v.raisons.map((r, i) => {
                const Icone = ICONES[r.icone as keyof typeof ICONES] ?? Check;
                return (
                  <li key={r.titre} className="min-w-0">
                    <Reveal delay={Math.min(i, 3) as 0 | 1 | 2 | 3} className="h-full">
                      <div className={`flex h-full flex-col rounded-[1.75rem] p-4 sm:p-6 ${i === 0 ? "bg-gradient-to-br from-hero to-brand text-white" : i === 3 ? "bg-gradient-to-br from-ciel via-[#3d8bf0] to-[#5b5ff0] text-white" : "bg-bone text-ink"}`}>
                        <span className={`grid size-11 place-items-center rounded-2xl ${i === 0 || i === 3 ? "bg-white/15" : "bg-white text-brand"}`}>
                          <Icone className="size-5" aria-hidden="true" />
                        </span>
                        <p className="mt-4 font-display text-base font-black leading-tight sm:mt-6 sm:text-xl">{r.titre}</p>
                        <p className={`mt-2 text-xs leading-relaxed sm:text-sm ${i === 0 || i === 3 ? "text-white/80" : "text-ink/60"}`}>{r.texte}</p>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <p className="flex items-center gap-3 rounded-2xl bg-ink px-5 py-4 font-black text-white">
                <Check className="size-5 shrink-0 text-ciel" aria-hidden="true" />
                {v.caisse}
              </p>
              <p className="flex items-center gap-3 rounded-2xl bg-ink px-5 py-4 font-black text-white">
                <Check className="size-5 shrink-0 text-ciel" aria-hidden="true" />
                {v.domaine}
              </p>
            </div>
          </div>
        </section>

        {/* 2. PLATEFORME DE LIVRAISON OU TON SITE ET TON APP */}
        <section className="bg-white px-3 md:px-5 lg:px-6">
          <div className="rounded-[2rem] bg-bone lg:rounded-[3rem]">
            <div className="mx-auto max-w-5xl px-5 py-16 md:py-24">
              <Reveal>
                <h2 className="text-center font-display text-3xl font-black leading-[1.05] tracking-tight md:text-5xl">{v.compareTitre}</h2>
              </Reveal>
              <div className="mt-10 grid gap-3 md:grid-cols-2">
                <div className="rounded-[1.75rem] bg-white p-6 md:p-8">
                  <p className="font-display text-xl font-black text-ink/50">{v.compareEux}</p>
                  <ul className="mt-5 grid list-none gap-4">
                    {v.compare.map((c) => (
                      <li key={c.sujet} className="flex gap-3">
                        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ink/10 text-ink/50">
                          <X className="size-3.5" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-xs font-bold text-ink/40">{c.sujet}</span>
                          <span className="block font-bold text-ink/60">{c.eux}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[1.75rem] bg-gradient-to-br from-hero to-brand p-6 text-white md:p-8">
                  <p className="font-display text-xl font-black">{v.compareNous}</p>
                  <ul className="mt-5 grid list-none gap-4">
                    {v.compare.map((c) => (
                      <li key={c.sujet} className="flex gap-3">
                        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white text-brand">
                          <Check className="size-3.5" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-xs font-bold text-white/70">{c.sujet}</span>
                          <span className="block font-black">{c.nous}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-6 text-center font-bold text-ink/60">{v.compareNote}</p>
            </div>
          </div>
        </section>

        {/* 3. COMMENT ÇA COMMENCE, et 4. CE QU'ON NE PROMET JAMAIS */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
            <Reveal>
              <h2 className="font-display text-3xl font-black tracking-tight md:text-5xl">{v.debutTitre}</h2>
            </Reveal>
            <ol className="mt-10 grid list-none gap-3 md:grid-cols-3">
              {v.debut.map((e, i) => (
                <li key={e.titre} className="flex items-center gap-4 rounded-[1.75rem] bg-bone p-5 md:block md:p-7">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ink font-display text-xl font-black text-white">{i + 1}</span>
                  <span className="block md:mt-6">
                    <span className="block font-display text-xl font-black leading-tight">{e.titre}</span>
                    <span className="mt-1 block text-sm text-ink/60">{e.texte}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-12 rounded-[1.75rem] border-2 border-dashed border-ink/15 p-6 md:p-8">
              <p className="font-display text-xl font-black">{v.jamaisTitre}</p>
              <ul className="mt-4 flex list-none flex-wrap gap-2">
                {v.jamais.map((j) => (
                  <li key={j} className="inline-flex items-center gap-2 rounded-full bg-bone px-4 py-2 text-sm font-bold text-ink/70">
                    <X className="size-4 text-brand" aria-hidden="true" />
                    {j}
                  </li>
                ))}
              </ul>
            </div>
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

            <ul className="mt-10 grid list-none gap-5 md:grid-cols-2 lg:grid-cols-3">
              {cartes.map((f, i) => {
                return (
                  <li key={f.slug}>
                    <Reveal delay={(i % 2) as 0 | 1}>
                      <Link
                        href={f.slug}
                        className="group flex h-full flex-col rounded-3xl bg-white p-7 transition-colors hover:bg-ink hover:text-white"
                      >
                        <p className="text-sm font-bold text-brand">
                          {f.surTitre}
                        </p>
                        <h3 className="mt-3 font-display text-xl font-black leading-snug tracking-tight">
                          {f.titre}
                        </h3>
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
