import Image from "next/image";
import { Phone, ArrowDown, Mail } from "lucide-react";
import Buoy from "@/components/Buoy";
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
    a: "Resto Action, c'est une solution québécoise de commande en ligne directe : on monte ta propre plateforme de commande, à ton nom. Tes clients commandent chez vous, sans commission de marketplace, pis les données restent à toi. C'est un produit de Studio LT, à Trois-Rivières.",
  },
  {
    q: "Combien ça coûte?",
    a: "Pas de commission de 30 % sur tes ventes — ça, c'est garanti. Le reste dépend de ton resto. Appelle-nous au 819 944-4661 pis on te fait le calcul en 15 minutes, chiffres en main.",
  },
  {
    q: "Qui garde les données de mes clients?",
    a: "Toi. Point final. Les noms, les courriels, l'historique de commandes t'appartiennent — pas à nous, pis surtout pas à une app américaine.",
  },
  {
    q: "C'est quoi la différence avec DoorDash pis Uber Eats?",
    a: "Les marketplaces prennent jusqu'à 30 % de chaque commande pis gardent les données de tes clients. Nous, on te monte ton canal direct : tu gardes tes ventes, tes clients pis tes données.",
  },
  {
    q: "Vous êtes où? Vous servez qui?",
    a: "On est basés à Trois-Rivières, en Mauricie, pis on travaille avec des restaurants indépendants partout au Québec.",
  },
  {
    q: "Comment on commence?",
    a: "Tu nous appelles au 819 944-4661 ou tu nous écris. Un appel de 15 minutes pour regarder combien les commissions te coûtent vraiment. Pas de pression, pas de contrat de 40 pages.",
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
      parentOrganization: { "@type": "Organization", name: "Studio LT" },
      founder: [
        { "@type": "Person", name: "Guillaume Therrien" },
        // TODO_USER: ajouter le nom de famille de Justin
        { "@type": "Person", name: "Justin" },
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
      {/* ─── Héro — le pitch ─── */}
      <section id="top" className="relative overflow-hidden">
        <Buoy className="pointer-events-none absolute -right-24 -top-24 w-[420px] opacity-[0.07] rotate-12" />
        <div className="mx-auto max-w-6xl px-5 pt-20 pb-24 md:pt-28 md:pb-32">
          <p className="mb-6 inline-block rounded-full bg-bone px-4 py-1.5 text-xs font-black uppercase tracking-widest">
            Pour les restaurateurs québécois
          </p>
          <h1 className="max-w-4xl text-5xl md:text-7xl font-black leading-[1.04] tracking-tight">
            Pas normal que ceux qui cuisinent soient{" "}
            <span className="text-brand">ceux qui restent pauvres.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg md:text-xl leading-relaxed text-ink/75">
            Des restaurateurs d&apos;ici travaillent 70 heures par semaine
            pendant que des firmes américaines prennent la plus grosse part de
            chaque commande. Chez Resto Action, on part d&apos;une conviction
            simple :{" "}
            <strong className="text-ink">
              le fruit de leur travail doit leur revenir — pour le bien
              collectif.
            </strong>
          </p>
          <p className="mt-7 max-w-2xl border-l-4 border-brand pl-5 text-base md:text-lg leading-relaxed font-bold text-ink">
            {DEFINITION}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-4 text-base font-black text-white hover:bg-ink transition-colors"
            >
              <Phone className="size-5" />
              Appelle-nous pour découvrir ta solution
            </a>
            <a
              href="#solution"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-7 py-4 text-base font-black hover:bg-ink hover:text-white transition-colors"
            >
              Voir comment ça marche
              <ArrowDown className="size-5" />
            </a>
          </div>
          <p className="mt-6 text-sm text-ink/60">{PHONE_DISPLAY} · Québec</p>
        </div>
      </section>

      {/* ─── Notre mission ─── */}
      <section id="mission" className="relative overflow-hidden bg-ink text-white">
        <Image
          src="/resto-ferme.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/85" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
          <p className="text-xs font-black uppercase tracking-widest text-brand">
            Notre mission
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl md:text-5xl font-black leading-tight tracking-tight">
            Pensez au dernier resto indépendant où vous avez mangé.
          </h2>

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
              Pis pendant ce temps-là, une firme américaine qui n&apos;a jamais
              mis les pieds dans sa cuisine prend{" "}
              <strong className="text-white">
                jusqu&apos;à 30 % de chaque commande
              </strong>
              <sup>
                <a href="#sources" className="text-brand hover:underline">
                  2
                </a>
              </sup>{" "}
              — trois fois plus que lui, sur le fruit de son travail. Et en
              plus, elle garde les données de ses clients : les noms, les
              numéros, les habitudes. Lui, il reçoit juste un ticket.
            </p>
            <p>
              Si rien ne change, ces restos-là ferment un par un — pis on perd
              notre variété au profit des multinationales. Dans 10 ans, il va
              rester quoi?{" "}
              <strong className="text-white">
                Des chaînes pis des franchises.
              </strong>
            </p>
            <p className="border-l-4 border-brand pl-5 text-xl md:text-2xl font-black leading-snug text-white">
              Nous, on refuse ça. Notre mission : que le fruit du travail des
              restaurateurs québécois leur revienne — pour le bien collectif.
            </p>
          </div>

          {/* TODO avant déploiement : vérifier que ces pages affichent toujours ces chiffres */}
          <div id="sources" className="mt-12 max-w-2xl text-xs leading-relaxed text-white/50">
            <p>
              Sources : 1.{" "}
              <a
                href="https://www.restaurantscanada.org/research/"
                target="_blank"
                rel="noopener"
                className="underline hover:text-white/80"
              >
                Restaurants Canada
              </a>
              , données sur les marges bénéficiaires avant impôt en
              restauration. 2. Tarifs publiés par{" "}
              <a
                href="https://get.doordash.com/en-ca/products/marketplace"
                target="_blank"
                rel="noopener"
                className="underline hover:text-white/80"
              >
                DoorDash
              </a>{" "}
              (forfait Premier, jusqu&apos;à 30 % par commande livrée) et{" "}
              <a
                href="https://merchants.ubereats.com/ca/en/pricing/"
                target="_blank"
                rel="noopener"
                className="underline hover:text-white/80"
              >
                Uber Eats
              </a>{" "}
              (forfait Marketplace, 30 %).
            </p>
          </div>
        </div>
      </section>

      {/* ─── La solution ─── */}
      <section id="solution" className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <p className="text-xs font-black uppercase tracking-widest text-brand">
            La solution
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl md:text-5xl font-black leading-tight tracking-tight">
            Ta propre commande en ligne. Tes clients. Tes données.
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink/75">
            On monte ta plateforme de commande en ligne, à ton nom, branchée
            direct sur ton resto. Le client commande chez vous — pas sur une
            app américaine.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                n: "1",
                title: "On monte ta plateforme.",
                text: "Ton menu, tes photos, tes prix. En ligne à ton nom — pas au nom d'une app.",
              },
              {
                n: "2",
                title: "Tes clients commandent direct.",
                text: "Pas d'intermédiaire, pas de 30 % qui part aux États. Chaque dollar de vente s'en va dans ta caisse.",
              },
              {
                n: "3",
                title: "Tu gardes tes données.",
                text: "Les noms, les courriels, les habitudes de tes clients t'appartiennent. Tu peux leur reparler quand tu veux.",
              },
            ].map(({ n, title, text }) => (
              <div key={n} className="rounded-2xl bg-bone p-7">
                <p className="font-script text-5xl text-brand">{n}</p>
                <h3 className="mt-3 text-xl font-black leading-snug">{title}</h3>
                <p className="mt-3 leading-relaxed text-ink/75">{text}</p>
              </div>
            ))}
          </div>

          {/*
            TODO_USER: ajouter 2 captures d'écran du produit dans
            public/screenshots/ (plateforme-1.png, plateforme-2.png) puis les
            afficher ici avec <Image>. On livre la section en texte seul en
            attendant — pas de placeholder qui fait faux.
          */}

          {/* TODO_USER: valider que cette phrase reste exacte tant que la certification n'est pas obtenue */}
          <p className="mt-10 max-w-2xl text-sm text-ink/60">
            Des restos pilotes de chez nous testent la plateforme en ce moment.
            Les premiers partenariats officiels seront annoncés bientôt.
          </p>
        </div>
      </section>

      {/* ─── Notre histoire ─── */}
      <section id="histoire" className="bg-bone">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <p className="text-xs font-black uppercase tracking-widest text-brand">
            Notre histoire
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl md:text-5xl font-black leading-tight tracking-tight">
            Un resto qui ferme, c&apos;est un morceau de nos vies qui part
            avec.
          </h2>

          <div className="mt-10 grid gap-12 md:grid-cols-[1fr_auto] md:items-center">
            <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-ink/75">
              <p>
                Chaque anniversaire de la famille de Guillaume se fêtait au
                même restaurant. Même table, même propriétaire qui les
                accueillait par leur prénom. En 2020, le restaurant a fermé —
                comme des centaines d&apos;autres au Québec. Ce jour-là,
                Guillaume a compris qu&apos;un resto qui ferme, c&apos;est pas
                juste un commerce qui disparaît :{" "}
                <strong className="text-ink">
                  c&apos;est un morceau de nos vies qui part avec.
                </strong>
              </p>
              <p>
                Justin, lui, l&apos;a vécu de l&apos;intérieur. En travaillant
                en restauration, il a vu à quel point les marges sont minces —
                chaque perte compte, chaque dollar donné à un intermédiaire
                fait mal.
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
              <figure className="rounded-2xl bg-white p-4 shadow-sm md:max-w-md">
                <div className="overflow-hidden rounded-xl">
                  <Image
                    src="/ceed.jpeg"
                    alt="Certificat du Défi CEED 2026, 1re position, remis à Guillaume Therrien pour Resto Action"
                    width={1086}
                    height={1448}
                    className="w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-center font-script text-2xl text-ink">
                  1<sup>re</sup> position — Défi CEED 2026
                </figcaption>
              </figure>

              <p className="border-l-4 border-brand pl-5 text-xl md:text-2xl font-black leading-snug text-ink">
                Aujourd&apos;hui, Resto Action existe pour une seule raison :
                sauver les restaurants indépendants du Québec, pour le bien de
                tout le monde. Parce que le fruit de leur travail doit leur
                revenir — pour le bien collectif.
              </p>
            </div>

            <div className="flex flex-row gap-6 md:flex-col md:w-52">
              {[
                {
                  src: "/guillaume.jpg",
                  name: "Guillaume",
                  alt: "Guillaume Therrien, cofondateur de Resto Action",
                  width: 675,
                  height: 900,
                },
                {
                  // TODO_USER: nom de famille de Justin pour l'attribut alt
                  src: "/justin.jpg",
                  name: "Justin",
                  alt: "Justin, cofondateur de Resto Action",
                  width: 602,
                  height: 900,
                },
              ].map(({ src, name, alt, width, height }) => (
                <figure key={name} className="flex-1 md:flex-none">
                  <div className="overflow-hidden rounded-2xl shadow-sm">
                    <Image
                      src={src}
                      alt={alt}
                      width={width}
                      height={height}
                      className="aspect-[3/4] w-full object-cover grayscale"
                    />
                  </div>
                  <figcaption className="mt-2 text-center font-script text-3xl text-ink">
                    {name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <p className="text-xs font-black uppercase tracking-widest text-brand">
            FAQ
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl md:text-5xl font-black leading-tight tracking-tight">
            Questions fréquentes
          </h2>

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
                <p className="mt-4 max-w-2xl leading-relaxed text-ink/75">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA final / Contact ─── */}
      <section id="contact" className="bg-brand text-white">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28 text-center">
          <Buoy className="mx-auto mb-8 w-24" />
          <h2 className="mx-auto max-w-2xl text-3xl md:text-5xl font-black leading-tight tracking-tight">
            Appelle-nous pour découvrir ta solution.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">
            Un appel de 15 minutes suffit pour voir ce que Resto Action peut
            faire pour ton resto — et combien les commissions te coûtent
            vraiment.
          </p>
          <a
            href={PHONE_HREF}
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-black text-ink hover:bg-ink hover:text-white transition-colors"
          >
            <Phone className="size-5" />
            {PHONE_DISPLAY}
          </a>
          <p className="mt-6 text-sm text-white/70">
            Guillaume Therrien · Resto Action
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-white/85 hover:text-white transition-colors"
          >
            <Mail className="size-4" />
            {EMAIL}
          </a>
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
