import Image from "next/image";
import { Phone, Mail } from "lucide-react";
import Buoy from "@/components/Buoy";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import CalendarEmbed from "@/components/CalendarEmbed";
import {
  DEFINITION,
  EMAIL,
  PHONE_DISPLAY,
  PHONE_E164,
  PHONE_HREF,
  SITE_URL,
} from "@/lib/site";

// Les réponses sont reprises mot pour mot dans le JSON-LD FAQPage (exigence
// Google : le balisage doit correspondre au contenu visible).
const FAQ = [
  {
    q: "C'est quoi, Resto Action?",
    a: "Resto Action, c'est une entreprise de Trois-Rivières au service des restaurants indépendants du Québec. On commence par t'écouter, on trouve ce qui gruge ton resto, et on règle le problème avec toi.",
  },
  {
    q: "Quels genres de problèmes vous réglez?",
    a: "Des commissions qui grugent tes marges, des clients que t'arrives pas à rejoindre, de la visibilité, des outils qui te coûtent trop cher. Peu importe le problème, on commence par t'écouter.",
  },
  {
    q: "Combien ça coûte?",
    a: "Ça dépend de ton resto et de ton problème. Appelle-nous au 819 944-4661, on regarde ça ensemble en 30 minutes, chiffres en main.",
  },
  {
    q: "Vous êtes où? Vous servez qui?",
    a: "On est basés à Trois-Rivières, en Mauricie, et on travaille avec des restaurants indépendants partout au Québec.",
  },
  {
    q: "Comment on commence?",
    a: "Tu nous appelles au 819 944-4661, tu nous écris, ou tu cédules ton appel directement sur le site. Trente minutes pour regarder ensemble ce qui gruge ton resto. Pas de pression, pas de contrat de 40 pages.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Resto Action",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.svg`,
      description: DEFINITION,
      telephone: PHONE_E164,
      email: EMAIL,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Trois-Rivières",
        addressRegion: "QC",
        addressCountry: "CA",
      },
      areaServed: { "@type": "AdministrativeArea", name: "Québec, Canada" },
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
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQ.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <main className="flex-1">
      {/* ─── Héro — carte encadrée, marque géante, bouée 3D ─── */}
      <Hero />

      {/* ─── Notre approche ─── */}
      <section id="approche" className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <Reveal>
            <h2 className="max-w-3xl font-display text-3xl md:text-5xl font-black leading-tight tracking-tight">
              Notre approche
            </h2>
            <p className="mt-3 text-ink/60">
              On s&apos;adapte vraiment à chaque restaurant!
            </p>
          </Reveal>

          {/* Trois étapes portées par la mascotte : cercles reliés par un
              pointillé, pastille numérotée, une seule phrase chacune. */}
          <div className="relative mt-16">
            <div
              aria-hidden="true"
              className="absolute left-[17%] right-[17%] top-20 hidden border-t-2 border-dashed border-brand/40 md:block"
            />
            <div className="grid gap-12 md:grid-cols-3 md:gap-8">
              {[
                {
                  n: "1",
                  title: "On t'écoute",
                  text: "Un appel de 30 minutes, tu nous parles de ton resto.",
                  image: "/mascotte-ecoute.webp",
                  alt: "La mascotte Resto Action écoute au téléphone",
                },
                {
                  n: "2",
                  title: "On creuse avec toi",
                  text: "On trouve ensemble ce qui gruge tes marges.",
                  image: "/mascotte-creuse.webp",
                  alt: "La mascotte Resto Action examine une facture à la loupe",
                },
                {
                  n: "3",
                  title: "On règle le problème",
                  text: "Une solution adaptée, pas une recette toute faite.",
                  image: "/mascotte-regle.webp",
                  alt: "La mascotte Resto Action lève le pouce, problème réglé",
                },
              ].map(({ n, title, text, image, alt }, i) => (
                <Reveal key={n} delay={i as 0 | 1 | 2}>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative z-10">
                      <div className="size-40 overflow-hidden rounded-full border-2 border-ink bg-bone">
                        <Image
                          src={image}
                          alt={alt}
                          width={1024}
                          height={1024}
                          unoptimized
                          className="size-full object-cover"
                        />
                      </div>
                      <span className="absolute -bottom-3 left-1/2 z-20 grid size-8 -translate-x-1/2 place-items-center rounded-full bg-brand text-sm font-black text-white">
                        {n}
                      </span>
                    </div>
                    <h3 className="mt-7 font-display text-lg font-bold md:text-xl">
                      {title}
                    </h3>
                    <p className="mt-2 max-w-[38ch] leading-relaxed text-ink/75">
                      {text}
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
      <section id="mission" className="bg-white">
        <div className="relative overflow-hidden rounded-t-[2rem] bg-ink text-white lg:rounded-t-[3rem]">
        <Image
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
              Notre mission
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl md:text-5xl font-black leading-tight tracking-tight">
              Pensez au dernier resto indépendant où vous avez mangé.
            </h2>
          </Reveal>

          <Reveal delay={1}>
            <div className="mt-10 max-w-2xl space-y-6 text-lg leading-relaxed text-white/80">
              <p>
                Le proprio, il se lève à 5 heures pour recevoir ses livraisons.
                Il connaît le nom de ses habitués. Sa recette, c&apos;est
                peut-être celle de sa mère. Lui, il travaille 70 heures par
                semaine pour se garder 3 à 9 % de marge
                <sup>
                  <a href="#sources" className="text-brand hover:underline">
                    1
                  </a>
                </sup>
                .
              </p>
              <p>
                Pis pendant ce temps-là, tout monte : le loyer, la bouffe,
                l&apos;équipement, les assurances.{" "}
                <strong className="text-white">
                  Chaque semaine, un nouveau feu à éteindre.
                </strong>{" "}
                Lui, il a pas une minute pour s&apos;asseoir et regarder ce
                qui gruge son resto pour vrai.
              </p>
              <p>
                Si rien ne change, ces restos-là ferment un par un, et on perd
                notre variété au profit des multinationales. Dans 10 ans, il va
                rester quoi?{" "}
                <strong className="text-white">
                  Des chaînes pis des franchises.
                </strong>
              </p>
              <p className="border-l-4 border-brand pl-5 text-xl md:text-2xl font-black leading-snug text-white">
                Nous, on refuse ça. Notre mission : que le fruit du travail des
                restaurateurs québécois leur revienne, pour le bien collectif.
              </p>
            </div>
          </Reveal>

          {/* TODO avant déploiement : vérifier que cette page affiche toujours ces chiffres */}
          <div id="sources" className="mt-12 max-w-2xl text-xs leading-relaxed text-white/50">
            <p>
              Source : 1.{" "}
              <a
                href="https://www.restaurantscanada.org/research/"
                target="_blank"
                rel="noopener"
                className="underline hover:text-white/80"
              >
                Restaurants Canada
              </a>
              , données sur les marges bénéficiaires avant impôt en
              restauration.
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* ─── Notre histoire ─── */}
      <section id="histoire" className="bg-bone">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-widest text-brand">
              Notre histoire
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl md:text-5xl font-black leading-tight tracking-tight">
              Un resto qui ferme, c&apos;est un morceau de nos vies qui part
              avec.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-12 md:grid-cols-[1fr_auto] md:items-center">
            <Reveal delay={1}>
              <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-ink/75">
                <p>
                  Chaque anniversaire de la famille de Guillaume se fêtait au
                  même restaurant. Même table, même propriétaire qui les
                  accueillait par leur prénom. En 2020, le restaurant a fermé,
                  comme des centaines d&apos;autres au Québec. Ce jour-là,
                  Guillaume a compris qu&apos;un resto qui ferme, c&apos;est
                  pas juste un commerce qui disparaît :{" "}
                  <strong className="text-ink">
                    c&apos;est un morceau de nos vies qui part avec.
                  </strong>
                </p>
                <p>
                  Justin, lui, l&apos;a vécu de l&apos;intérieur. En
                  travaillant en restauration, il a vu à quel point les marges
                  sont minces. Chaque perte compte, chaque dollar donné à un
                  intermédiaire fait mal.
                </p>
                <p>
                  Leurs chemins se sont croisés à l&apos;École
                  d&apos;entrepreneurship de Beauce. Guillaume a présenté son
                  idée; Justin a embarqué sur-le-champ. Ils ont gagné le
                  concours. Mais la vraie victoire, ç&apos;a été la décision
                  prise ce soir-là :{" "}
                  <strong className="text-ink">
                    arrêter d&apos;en parler, pis agir.
                  </strong>
                </p>

                {/*
                  TODO_USER: confirmer le lien entre le concours mentionné
                  (École d'entrepreneurship de Beauce) et le certificat
                  « Défi CEED » — ajuster le paragraphe ci-dessus ou la légende
                  si nécessaire, pis ajouter un lien vers l'article s'il existe.
                */}
                <figure className="rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md md:max-w-md">
                  <div className="overflow-hidden rounded-xl">
                    <Image
                      src="/ceed.jpeg"
                      alt="Certificat du Défi CEED 2026, 1re position, remis à Guillaume Therrien pour Resto Action"
                      width={1086}
                      height={1018}
                      className="w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-center font-script text-2xl text-ink">
                    1<sup>re</sup> position au Défi CEED 2026
                  </figcaption>
                </figure>

                <p className="border-l-4 border-brand pl-5 text-xl md:text-2xl font-black leading-snug text-ink">
                  Aujourd&apos;hui, Resto Action existe pour une seule raison :
                  sauver les restaurants indépendants du Québec, pour le bien
                  de tout le monde. Parce que le fruit de leur travail doit
                  leur revenir, pour le bien collectif.
                </p>
              </div>
            </Reveal>

            <div className="flex flex-row gap-6 md:flex-col md:w-52">
              {[
                {
                  src: "/guillaume.jpg",
                  name: "Guillaume",
                  alt: "Guillaume Therrien, cofondateur de Resto Action",
                  linkedin:
                    "https://www.linkedin.com/in/guillaume-therrien-776a653b3/",
                  width: 675,
                  height: 900,
                },
                {
                  src: "/justin.jpg",
                  name: "Justin",
                  alt: "Justin Bouillon, cofondateur de Resto Action",
                  linkedin:
                    "https://www.linkedin.com/in/justin-bouillon-58a667421/",
                  width: 602,
                  height: 900,
                },
              ].map(({ src, name, alt, linkedin, width, height }, i) => (
                <Reveal
                  key={name}
                  delay={(i + 1) as 1 | 2}
                  className="flex-1 md:flex-none"
                >
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener"
                    aria-label={`Profil LinkedIn de ${alt.split(",")[0]}`}
                    className="group block"
                  >
                    <figure>
                      <div className="overflow-hidden rounded-2xl shadow-sm transition group-hover:shadow-md">
                        <Image
                          src={src}
                          alt={alt}
                          width={width}
                          height={height}
                          className="aspect-[3/4] w-full object-cover grayscale transition duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]"
                        />
                      </div>
                      <figcaption className="mt-2 text-center font-script text-3xl text-ink transition-colors group-hover:text-brand">
                        {name}
                      </figcaption>
                    </figure>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-widest text-brand">
              FAQ
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl md:text-5xl font-black leading-tight tracking-tight">
              Questions fréquentes
            </h2>
          </Reveal>

          <Reveal delay={1}>
            <div className="mt-10 max-w-3xl divide-y divide-bone border-y border-bone">
              {FAQ.map(({ q, a }, i) => (
                <details key={q} open={i === 0} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black [&::-webkit-details-marker]:hidden">
                    {q}
                    <span
                      aria-hidden="true"
                      className="text-brand transition-transform group-open:rotate-45 text-2xl leading-none"
                    >
                      +
                    </span>
                  </summary>
                  <p className="faq-answer mt-4 max-w-2xl leading-relaxed text-ink/75">
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── CTA final / Contact ─── */}
      <section id="contact" className="bg-brand text-white">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28 text-center">
          <Reveal>
            <Buoy className="mx-auto mb-8 w-24" />
            <h2 className="mx-auto max-w-2xl text-3xl md:text-5xl font-black leading-tight tracking-tight">
              Parlons de ton resto.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">
              Un appel de 30 minutes suffit pour voir ce que Resto Action peut
              faire pour ton resto, et combien les commissions te coûtent
              vraiment.
            </p>
            <a
              href={PHONE_HREF}
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-black text-ink transition hover:bg-ink hover:text-white active:scale-95"
            >
              <Phone className="size-5" />
              {PHONE_DISPLAY}
            </a>
            <p className="mt-6 text-sm text-white/70">
              Guillaume Therrien · Resto Action
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-white/85 transition hover:text-white"
            >
              <Mail className="size-4" />
              {EMAIL}
            </a>
          </Reveal>

          <Reveal delay={1}>
            <div className="mx-auto mt-14 max-w-3xl text-left">
              <p className="mb-4 text-center text-lg font-black">
                Ou cédule ton appel directement ici :
              </p>
              <CalendarEmbed />
            </div>
          </Reveal>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
