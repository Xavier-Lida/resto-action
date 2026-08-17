import Image from "next/image";
import { Phone, Mail } from "lucide-react";
import Buoy from "@/components/Buoy";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Resultats from "@/components/Resultats";
import Reveal from "@/components/Reveal";
import CalendarEmbed from "@/components/CalendarEmbed";
import type { Textes } from "@/lib/textes/fr";
import { EMAIL, LINKEDIN_URL, PHONE_DISPLAY, PHONE_E164, PHONE_HREF, SITE_URL } from "@/lib/site";

/* La page d'accueil, une seule fois pour les deux langues. Les routes
   (src/app/page.tsx et src/app/en/page.tsx) ne font que lui passer leur
   dictionnaire ; tout ce qui suit est de la structure.

   `lang` est posé sur le <main> : la mise en page racine ne rend qu'un seul
   <html lang="fr-CA">, et c'est ici qu'on rétablit la vérité pour la page
   anglaise. Un attribut lang sur n'importe quel élément vaut pour tout son
   sous-arbre — c'est ce que suivent les lecteurs d'écran pour changer de voix. */

/* Les vignettes ne se traduisent pas ; elles s'apparient par rang aux étapes
   et aux jalons du dictionnaire. */
const IMAGES_APPROCHE = [
  "/mascotte-ecoute.webp",
  "/mascotte-creuse.webp",
  "/mascotte-regle.webp",
];

const IMAGES_HISTOIRE = [
  {
    src: "/guillaume.jpg",
    width: 675,
    height: 900,
    lien: "https://www.linkedin.com/in/guillaume-therrien-776a653b3/",
  },
  {
    src: "/justin.jpg",
    width: 602,
    height: 900,
    lien: "https://www.linkedin.com/in/justin-bouillon-58a667421/",
  },
  { src: "/ceed.jpeg", width: 1086, height: 1018, lien: null },
];

export default function Accueil({ t }: { t: Textes }) {
  /* Le JSON-LD. Ses @id sont ancrés sur la racine de la version : sans ça, les
     deux langues déclareraient les mêmes entités et entreraient en collision.
     Les réponses de FAQ y sont reprises MOT POUR MOT — Google exige que le
     balisage corresponde au contenu visible. */
  const racine = `${SITE_URL}${t.racine}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        /* ProfessionalService, pas Organization : c'est un sous-type de
           LocalBusiness, et Resto Action EST une entreprise locale — à
           Trois-Rivières, au service du Québec. C'est ce type-là qui alimente
           les résultats locaux et les réponses d'IA à « qui aide les restos à
           Trois-Rivières » ; Organization tout court ne dit rien de l'ancrage
           géographique. Le nœud garde son @id : c'est la même entité, mieux
           déclarée. */
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${racine}/#organization`,
        name: "Resto Action",
        url: racine,
        logo: `${SITE_URL}/logo-marque.png`,
        image: `${SITE_URL}/logo-marque.png`,
        description: t.donnees.definition,
        /* sameAs rattache la marque au graphe d'entités : c'est le signal que
           les moteurs génératifs suivent pour reconnaître une entreprise et la
           relier à ce qui se dit d'elle ailleurs. Les fondateurs en avaient un,
           l'entreprise non. */
        sameAs: [LINKEDIN_URL],
        priceRange: "$$",
        telephone: PHONE_E164,
        email: EMAIL,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Trois-Rivières",
          addressRegion: "QC",
          addressCountry: "CA",
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: t.donnees.zoneServie,
        },
        parentOrganization: { "@type": "Organization", name: "Studios LT" },
        founder: [
          {
            "@type": "Person",
            name: "Guillaume Therrien",
            sameAs: "https://www.linkedin.com/in/guillaume-therrien-776a653b3/",
          },
          {
            "@type": "Person",
            name: "Justin Bouillon",
            sameAs: "https://www.linkedin.com/in/justin-bouillon-58a667421/",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${racine}/#faq`,
        inLanguage: t.htmlLang,
        mainEntity: t.faq.items.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };

  return (
    <>
      <main className="flex-1" lang={t.htmlLang}>
        {/* ─── Héro — carte encadrée, marque géante, bouée 3D ─── */}
        <Hero t={t} />

        {/* ─── Résultats — onglets à minuterie et maquettes animées ─── */}
        <Resultats t={t} />

        {/* ─── Notre approche ─── */}
        <section id="approche" className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
            <Reveal>
              <h2 className="max-w-3xl font-display text-3xl md:text-5xl font-black leading-tight tracking-tight">
                {t.approche.titre}
              </h2>
              <p className="mt-3 text-ink/60">{t.approche.sousTitre}</p>
            </Reveal>

            {/* Trois étapes portées par la mascotte : cercles reliés par un
                pointillé, pastille numérotée, une seule phrase chacune. */}
            <div className="relative mt-16">
              <div
                aria-hidden="true"
                className="absolute left-[17%] right-[17%] top-20 hidden border-t-2 border-dashed border-brand/40 md:block"
              />
              <div className="grid gap-12 md:grid-cols-3 md:gap-8">
                {t.approche.etapes.map(({ titre, texte, alt }, i) => (
                  <Reveal key={titre} delay={i as 0 | 1 | 2}>
                    <div className="flex flex-col items-center text-center">
                      <div className="relative z-10">
                        <div className="size-40 overflow-hidden rounded-full border-2 border-ink bg-bone">
                          <Image
                            draggable={false}
                            src={IMAGES_APPROCHE[i]}
                            alt={alt}
                            width={1024}
                            height={1024}
                            unoptimized
                            className="size-full object-cover"
                          />
                        </div>
                        <span className="absolute -bottom-3 left-1/2 z-20 grid size-8 -translate-x-1/2 place-items-center rounded-full bg-brand text-sm font-black text-white">
                          {i + 1}
                        </span>
                      </div>
                      <h3 className="mt-7 font-display text-lg font-bold md:text-xl">
                        {titre}
                      </h3>
                      <p className="mt-2 max-w-[38ch] leading-relaxed text-ink/75">
                        {texte}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Notre mission ─── */}
        {/* La section arrive comme une carte sombre aux coins arrondis posée
            sur le blanc de la page : même langage visuel que la carte de la
            hero. */}
        <section id="mission" className="bg-white p-3 md:p-5 lg:p-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white lg:rounded-[3rem]">
            <Image
              draggable={false}
              src="/faillite.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-ink/85" />
            <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
              <Reveal>
                <p className="text-xs font-black uppercase tracking-widest text-brand">
                  {t.mission.surTitre}
                </p>
                <h2 className="mt-3 max-w-3xl text-3xl md:text-5xl font-black leading-tight tracking-tight">
                  {t.mission.titre}
                </h2>
              </Reveal>

              <Reveal delay={1}>
                <div className="mt-10 max-w-2xl space-y-6 text-lg leading-relaxed text-white/80">
                  {/* Le premier paragraphe est coupé par l'appel de note, les
                      deux suivants par un <strong> : d'où le découpage en
                      morceaux du dictionnaire plutôt qu'en paragraphes. */}
                  <p>
                    {t.mission.p1a}
                    <sup>
                      <a href="#sources" className="text-brand hover:underline">
                        1
                      </a>
                    </sup>
                    {t.mission.p1b}
                  </p>
                  <p>
                    {t.mission.p2a}{" "}
                    <strong className="text-white">{t.mission.p2fort}</strong>{" "}
                    {t.mission.p2b}
                  </p>
                  <p>
                    {t.mission.p3a}{" "}
                    <strong className="text-white">{t.mission.p3fort}</strong>
                  </p>
                  <p className="border-l-4 border-brand pl-5 text-xl md:text-2xl font-black leading-snug text-white">
                    {t.mission.chute}
                  </p>
                </div>
              </Reveal>

              {/* TODO avant déploiement : vérifier que cette page affiche toujours ces chiffres */}
              <div
                id="sources"
                className="mt-12 max-w-2xl text-xs leading-relaxed text-white/50"
              >
                <p>
                  {t.mission.sourceAvant}{" "}
                  <a
                    href="https://www.restaurantscanada.org/research/"
                    target="_blank"
                    rel="noopener"
                    className="underline hover:text-white/80"
                  >
                    {t.mission.sourceLien}
                  </a>
                  {t.mission.sourceApres}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Notre histoire ─── */}
        {/* Trois jalons en colonnes bordées de rouge, photos noir et blanc,
            légendes manuscrites. */}
        <section
          id="histoire"
          className="bg-white px-3 pb-3 md:px-5 md:pb-5 lg:px-6 lg:pb-6"
        >
          <div className="rounded-[2rem] bg-ink text-white lg:rounded-[3rem]">
            <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
              <Reveal>
                <h2 className="max-w-3xl font-display text-3xl md:text-5xl font-black leading-tight tracking-tight">
                  {t.histoire.titre}
                </h2>
              </Reveal>

              <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
                {t.histoire.jalons.map(({ titre, texte, alt, legende }, i) => {
                  const image = IMAGES_HISTOIRE[i];
                  const figure = (
                    <figure>
                      <div className="w-fit overflow-hidden rounded-lg">
                        <Image
                          draggable={false}
                          src={image.src}
                          alt={alt}
                          width={image.width}
                          height={image.height}
                          className={`object-cover transition duration-500 ${
                            image.lien
                              ? "aspect-[3/4] w-40 grayscale group-hover:grayscale-0"
                              : "w-52"
                          }`}
                        />
                      </div>
                      <figcaption className="mt-3 font-script text-xl text-white transition-colors group-hover:text-brand">
                        {legende}
                      </figcaption>
                    </figure>
                  );
                  return (
                    <Reveal key={titre} delay={i as 0 | 1 | 2}>
                      <div className="h-full border-l-2 border-brand pl-6">
                        <h3 className="font-display text-lg font-bold md:text-xl">
                          {titre}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-white/70">
                          {texte}
                        </p>
                        <div className="mt-6">
                          {image.lien ? (
                            <a
                              href={image.lien}
                              target="_blank"
                              rel="noopener"
                              aria-label={t.histoire.linkedinDe.replace("{nom}", legende)}
                              className="group inline-block"
                            >
                              {figure}
                            </a>
                          ) : (
                            figure
                          )}
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        {/* Accordéon : la question ouverte devient une pilule beige arrondie,
            une seule ouverte à la fois (details name), hauteur animée en CSS. */}
        <section id="faq" className="bg-white">
          <div className="mx-auto max-w-4xl px-5 py-20 md:py-28">
            <Reveal>
              <h2 className="text-center font-display text-3xl md:text-5xl font-black leading-tight tracking-tight">
                {t.faq.titre}
              </h2>
            </Reveal>

            <Reveal delay={1}>
              <div className="mt-12 space-y-2">
                {t.faq.items.map(({ q, a }) => (
                  <details
                    key={q}
                    name="faq"
                    className="faq-item group rounded-3xl transition-colors duration-300 open:bg-bone"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-lg font-black md:px-8 [&::-webkit-details-marker]:hidden">
                      {q}
                      <span
                        aria-hidden="true"
                        className="text-2xl leading-none transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="max-w-3xl px-6 pb-6 leading-relaxed text-ink/75 md:px-8">
                      {a}
                    </p>
                  </details>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── CTA final / Contact ─── */}
        {/* Le rouge de la hero, le pitch à gauche, l'agenda compact à droite. */}
        <section id="contact" className="bg-hero text-white">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <Reveal>
                <div>
                  <Buoy className="mb-6 w-16" />
                  <h2 className="max-w-md font-display text-3xl md:text-5xl font-black leading-tight tracking-tight">
                    {t.contact.titre}
                  </h2>
                  <p className="mt-4 max-w-md text-lg text-white/85">
                    {t.contact.texte}
                  </p>
                  <a
                    href={PHONE_HREF}
                    className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-black text-ink transition hover:bg-ink hover:text-white active:scale-95"
                  >
                    <Phone className="size-5" />
                    {PHONE_DISPLAY}
                  </a>
                  <p className="mt-6 text-sm text-white/70">
                    {t.contact.signature}
                  </p>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-white/85 transition hover:text-white"
                  >
                    <Mail className="size-4" />
                    {EMAIL}
                  </a>
                </div>
              </Reveal>

              <Reveal delay={1}>
                <CalendarEmbed t={t} />
              </Reveal>
            </div>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </main>
      <Footer t={t} />
    </>
  );
}
