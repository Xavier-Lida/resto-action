import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BarreNav from "@/components/BarreNav";
import Blocs from "@/components/Blocs";
import DonneesStructurees from "@/components/DonneesStructurees";
import FilAriane from "@/components/FilAriane";
import Footer from "@/components/Footer";
import IllustrationPiece, { Telephone, VisuelAnime } from "@/components/IllustrationPiece";
import Reveal from "@/components/Reveal";
import SectionFaq from "@/components/SectionFaq";
import { photoDe } from "@/lib/photos";
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
  autres = [],
}: {
  t: Textes;
  f: Fonctionnalite;
  plateforme: Plateforme;
  /** Les autres pages du Système, pour passer de l'une à l'autre. */
  autres?: { nom: string; href: string; resume: string }[];
}) {
  const url = `${SITE_URL}${f.slug}`;
  const accueil = t.racine || "/";
  const langue = t.htmlLang.startsWith("en") ? "en" : "fr";

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

  const nomPage = f.slug.split("/").pop() as string;
  const photo = photoDe(nomPage);
  const photoMilieu = photoDe(`${nomPage}-2`);
  const aDroite = Boolean(photo || f.illustration);

  return (
    <>
      <BarreNav t={t} />
      <main className="flex-1" lang={t.htmlLang}>
        {/* L'en-tête à la Owner : le titre à gauche, ce que ça donne pour vrai
            à droite (un écran de l'app ou un visuel animé). */}
        <section className="bg-white px-3 pt-3 md:px-5 md:pt-5 lg:px-6 lg:pt-6">
          <div className="overflow-hidden rounded-[2rem] bg-bone lg:rounded-[3rem]">
            <div
              className={`mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 md:py-20 ${
                aDroite ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : ""
              }`}
            >
              <div className={aDroite ? "" : "max-w-3xl"}>
                <FilAriane elements={fil} />
                <Reveal>
                  <p className="mt-8 text-base font-bold text-ink/55">{f.surTitre}</p>
                  <h1 className="mt-3 font-display text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
                    {f.titre}
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/75">{f.intro}</p>
                </Reveal>
              </div>
              {photo ? (
                <Reveal delay={1}>
                  {/* La photo, avec l'écran de l'app par-dessus, comme chez Owner. */}
                  <div className="relative pb-10 pl-10 md:pb-12 md:pl-14">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl shadow-ink/20">
                      <Image src={photo} alt="" fill priority sizes="(max-width: 1024px) 90vw, 460px" className="object-cover" />
                    </div>
                    {f.illustration?.type === "ecran" && (
                      <div className="absolute bottom-0 left-0 w-32 -rotate-6 drop-shadow-[0_30px_30px_rgba(0,0,0,0.35)] md:w-40">
                        <Telephone ecran={f.illustration} />
                      </div>
                    )}
                  </div>
                </Reveal>
              ) : (
                f.illustration && (
                  <Reveal delay={1}>
                    <IllustrationPiece illustration={f.illustration} langue={langue} />
                  </Reveal>
                )
              )}
            </div>
          </div>
        </section>

        {/* COMMENT ÇA MARCHE : 01, 02, 03… avec l'écran ou le visuel de
            chaque étape, comme la page « How it works » d'Owner. */}
        {f.etapes && (
          <section className="bg-white">
            <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
              <h2 className="font-display text-3xl font-black tracking-tight md:text-5xl">{f.etapes.titre}</h2>
              <ol className="mt-12 grid list-none gap-6 md:grid-cols-2 lg:grid-cols-3">
                {f.etapes.items.map((e, i) => (
                  <li key={e.titre}>
                    <Reveal delay={(i % 3) as 0 | 1 | 2}>
                      <div className="flex h-full flex-col rounded-[2rem] bg-bone p-6 md:p-7">
                        <p className="font-display text-4xl font-black tracking-tight text-brand">
                          {String(i + 1).padStart(2, "0")}.
                        </p>
                        <h3 className="mt-3 font-display text-xl font-black leading-tight">{e.titre}</h3>
                        <p className="mt-2 leading-relaxed text-ink/70">{e.texte}</p>
                        {(e.ecran || e.visuel) && (
                          <div className="mt-6 flex flex-1 items-end justify-center">
                            {e.ecran ? (
                              <Telephone ecran={e.ecran} className="w-44" />
                            ) : (
                              e.visuel && <VisuelAnime visuel={e.visuel} className="w-full" langue={langue} />
                            )}
                          </div>
                        )}
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {photoMilieu && (
          <section className="bg-white px-3 md:px-5 lg:px-6">
            <div className="relative mx-auto aspect-[16/9] max-w-6xl overflow-hidden rounded-[2rem] md:aspect-[21/9] lg:rounded-[3rem]">
              <Image src={photoMilieu} alt="" fill sizes="(max-width: 1200px) 100vw, 1152px" className="object-cover" />
            </div>
          </section>
        )}

        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
            {f.blocs.length > 0 && <Blocs blocs={f.blocs} />}

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

        {/* LES AUTRES PIÈCES : tout est relié, on passe de l'une à l'autre. */}
        {autres.length > 0 && (
          <section className="bg-bone">
            <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
              <h2 className="font-display text-2xl font-black tracking-tight md:text-3xl">
                {langue === "en" ? "Works with the rest of the System" : "Ça marche avec le reste du Système"}
              </h2>
              <ul className="mt-8 grid list-none gap-3 md:grid-cols-2 lg:grid-cols-3">
                {autres.map((a) => (
                  <li key={a.href}>
                    <Link
                      href={a.href}
                      className="group flex h-full flex-col rounded-2xl bg-white p-5 transition-colors hover:bg-ink hover:text-white"
                    >
                      <span className="flex items-center justify-between gap-3 font-display text-lg font-black">
                        {a.nom}
                        <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="mt-1 text-sm leading-relaxed text-ink/65 group-hover:text-white/75">{a.resume}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

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
                  href={langue === "en" ? "/en#calculateur" : "/#calculateur"}
                  className="inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-black text-ink transition hover:bg-ink hover:text-white"
                >
                  {langue === "en" ? "Calculate what you would have kept" : "Calcule ce que tu aurais gardé"}
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
