import Image from "next/image";
import BarreNav from "@/components/BarreNav";
import BarreReservation from "@/components/BarreReservation";
import BoutonAbonnement from "@/components/BoutonAbonnement";
import Calculateur from "@/components/Calculateur";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import IconeYoutube from "@/components/IconeYoutube";
import Resultats from "@/components/Resultats";
import Reveal from "@/components/Reveal";
import SectionFaq from "@/components/SectionFaq";
import SectionOffre from "@/components/SectionOffre";
import SectionProduits from "@/components/SectionProduits";
import SectionPlateformes from "@/components/SectionPlateformes";
import DonneesStructurees from "@/components/DonneesStructurees";
import LecteurVideo from "@/components/LecteurVideo";
import { noeudFaq, noeudVideo } from "@/lib/schema";
import type { Textes } from "@/lib/textes/fr";
import type { Cle, Fonctionnalite } from "@/lib/contenu/fonctionnalites";

import {
  EMAIL,
  FONDATEURS,
  LINKEDIN_URL,
  PHONE_E164,
  PLACES_FONDATEURS,
  POSTAL_CODE,
  SITE_URL,
  STREET,
  VIDEO_HISTOIRE,
  YOUTUBE_URL,
  cheminReservation,
} from "@/lib/site";

/* La page d'accueil, une seule fois pour les deux langues. Les routes
   (src/app/page.tsx et src/app/en/page.tsx) ne font que lui passer leur
   dictionnaire ; tout ce qui suit est de la structure.

   `lang` est posé sur le <main> : la mise en page racine ne rend qu'un seul
   <html lang="fr-CA">, et c'est ici qu'on rétablit la vérité pour la page
   anglaise. Un attribut lang sur n'importe quel élément vaut pour tout son
   sous-arbre — c'est ce que suivent les lecteurs d'écran pour changer de voix. */

/* Les vignettes ne se traduisent pas ; elles s'apparient par rang aux étapes
   et aux cofondateurs du dictionnaire. */
const IMAGES_APPROCHE = [
  "/mascotte-ecoute.webp",
  "/mascotte-creuse.webp",
  "/mascotte-regle.webp",
];

// Glyphe LinkedIn (lucide-react ne fournit plus d'icônes de marques).
function IconeLinkedIn({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452z" />
    </svg>
  );
}

/* Les deux cofondateurs, puis le certificat du Défi CEED. */
const IMAGES_HISTOIRE = [
  {
    src: "/guillaume.jpg",
    width: 675,
    height: 900,
    lien: FONDATEURS.guillaume.linkedin,
  },
  {
    src: "/xavier.webp",
    width: 512,
    height: 683,
    lien: FONDATEURS.xavier.linkedin,
  },
  { src: "/ceed.jpeg", width: 1086, height: 1018, lien: null },
];

/* `fonctionnalites` arrive du fichier de route, comme pour PagePlateforme : la
   mise en page suit la langue par `t`, et le contenu des quatre pages par son
   propre dictionnaire. Seule la section Résultats s'en sert — pour lier chaque
   onglet à la page qui le développe. */
export default function Accueil({
  t,
  fonctionnalites,
}: {
  t: Textes;
  fonctionnalites: Record<Cle, Fonctionnalite>;
}) {
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
        sameAs: [LINKEDIN_URL, YOUTUBE_URL],
        priceRange: "$$",
        telephone: PHONE_E164,
        email: EMAIL,
        /* Le NAP complet. Il lui manquait le A : sans rue ni code postal, une
           fiche d'entreprise locale reste à deux tiers, et c'est le tiers
           manquant qui rattache l'entreprise à un point sur la carte. */
        address: {
          "@type": "PostalAddress",
          streetAddress: STREET,
          addressLocality: "Trois-Rivières",
          addressRegion: "QC",
          postalCode: POSTAL_CODE,
          addressCountry: "CA",
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: t.donnees.zoneServie,
        },
        parentOrganization: { "@type": "Organization", name: "Studios LT" },
        founder: Object.values(FONDATEURS).map(({ nom, linkedin }) => ({
          "@type": "Person",
          name: nom,
          sameAs: linkedin,
        })),
      },
      noeudFaq({
        id: `${racine}/#faq`,
        langue: t.htmlLang,
        items: t.faq.items,
      }),
      /* `fr-CA` en dur, dans les deux versions : c'est la langue de la vidéo,
         pas celle de la page qui la montre. */
      noeudVideo({
        id: `${racine}/#video`,
        racine: t.racine,
        idYoutube: VIDEO_HISTOIRE.id,
        nom: t.chaine.video.titre,
        description: t.chaine.video.description,
        langue: "fr-CA",
        publieLe: VIDEO_HISTOIRE.publieLe,
        duree: VIDEO_HISTOIRE.duree,
        miniature: VIDEO_HISTOIRE.miniature,
      }),
    ],
  };

  return (
    <>
      <BarreNav t={t} />
      <main className="flex-1" lang={t.htmlLang}>
        {/* ─── Héro — carte encadrée, marque géante, bouée 3D ─── */}
        <Hero t={t} />

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
              {/* UNE VRAIE LISTE ORDONNÉE. Les trois étapes se lisaient comme
                  une suite grâce au pointillé et aux pastilles numérotées —
                  c'est-à-dire à l'œil seulement. Pour un robot comme pour un
                  lecteur d'écran, c'étaient trois blocs sans ordre. Le `ol`
                  dit la séquence dans le HTML ; la mise en page ne bouge pas,
                  la grille est simplement portée par la liste.

                  Le `li` est POSÉ AUTOUR de Reveal, pas dedans : Reveal rend
                  un `div`, et `ol > div` serait invalide. */}
              <ol className="liste-numerotee grid list-none gap-12 md:grid-cols-3 md:gap-8">
                {t.approche.etapes.map(({ titre, texte, alt }, i) => (
                  <li key={titre}>
                  <Reveal delay={i as 0 | 1 | 2}>
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
                        {/* La pastille est décorative : la liste ordonnée
                            annonce déjà « 1 sur 3 », l'entendre deux fois
                            n'apprend rien.

                            Son chiffre vient d'un compteur CSS et non d'un
                            {i + 1} rendu ici : dans le document, il se
                            retrouvait une seconde fois dans le texte extrait —
                            « 1. 1On t'écoute ». Voir globals.css. */}
                        <span className="puce-numero absolute -bottom-3 left-1/2 z-20 grid size-8 -translate-x-1/2 place-items-center rounded-full bg-brand text-sm font-black text-white" />
                      </div>
                      <h3 className="mt-7 font-display text-lg font-bold md:text-xl">
                        {titre}
                      </h3>
                      <p className="mt-2 max-w-[38ch] leading-relaxed text-ink/75">
                        {texte}
                      </p>
                    </div>
                  </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ─── Plateformes contre ton app, et le gros bouton ─── */}
        <SectionPlateformes t={t} />

        {/* ─── Le calculateur animé ─── */}
        <Calculateur t={t} />

        {/* ─── Résultats — onglets à minuterie et maquettes animées ─── */}
        <Resultats t={t} fonctionnalites={fonctionnalites} />

        {/* ─── Nos produits : onglets qui tournent seuls (SectionProduits) ─── */}
        <SectionProduits t={t} />

        {/* ─── L'offre fondateur ─── */}
        <SectionOffre t={t} />

        {/* ─── Ce en quoi on croit ─── */}
        {/* Court, exprès : les deux cofondateurs (photo cliquable vers leur
            LinkedIn) et leurs convictions en une ligne chacune, puis le Défi
            CEED à côté. L'ancien récit en trois jalons faisait trop de texte. */}
        <section
          id="histoire"
          className="bg-white px-3 pb-3 md:px-5 md:pb-5 lg:px-6 lg:pb-6"
        >
          <div className="rounded-[2rem] bg-ink text-white lg:rounded-[3rem]">
            <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
              <Reveal>
                <h2 className="font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
                  {t.histoire.convictions.titre}
                </h2>
              </Reveal>

              <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
                <div className="grid gap-6 md:grid-cols-2">
                  {t.histoire.convictions.fondateurs.map((f, i) => {
                    const image = IMAGES_HISTOIRE[i];
                    return (
                      <Reveal key={f.nom} delay={(i + 1) as 1 | 2}>
                        <article className="group h-full rounded-[2rem] bg-white/[0.05] p-5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08]">
                          <a
                            href={image.lien ?? undefined}
                            target="_blank"
                            rel="noopener"
                            aria-label={t.histoire.linkedinDe.replace("{nom}", f.nom)}
                            className="relative block overflow-hidden rounded-2xl"
                          >
                            <Image
                              draggable={false}
                              src={image.src}
                              alt={f.alt}
                              width={image.width}
                              height={image.height}
                              className="aspect-[4/3] w-full object-cover object-top grayscale transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                            />
                            <span className="absolute bottom-3 right-3 grid size-11 place-items-center rounded-full bg-white text-[#0a66c2] shadow-lg transition group-hover:scale-110">
                              <IconeLinkedIn className="size-5" />
                            </span>
                          </a>
                          <p className="mt-5 font-display text-2xl font-black">{f.nom}</p>
                          <p className="text-sm text-white/60">{f.role}</p>
                          <ul className="mt-5 grid list-none gap-2.5">
                            {f.points.map((point) => (
                              <li key={point.titre} className="flex items-start gap-3 font-bold leading-snug">
                                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand" />
                                {point.titre}
                              </li>
                            ))}
                          </ul>
                        </article>
                      </Reveal>
                    );
                  })}
                </div>

                <Reveal delay={2}>
                  <aside className="flex h-full flex-col rounded-[2rem] bg-white p-5 text-ink">
                    <Image
                      draggable={false}
                      src={IMAGES_HISTOIRE[2].src}
                      alt={t.histoire.ceed.alt}
                      width={IMAGES_HISTOIRE[2].width}
                      height={IMAGES_HISTOIRE[2].height}
                      className="w-full rounded-2xl object-cover"
                    />
                    <p className="mt-5 font-display text-2xl font-black leading-tight">
                      {t.histoire.ceed.titre}
                    </p>
                    <p className="mt-2 text-ink/70">{t.histoire.ceed.texte}</p>
                  </aside>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ─── La chaîne YouTube ─── */}
        {/* Sur le blanc, entre deux cartes sombres et la FAQ : la page respire,
            et la miniature — la seule image en couleur de ce bout de page —
            porte la section à elle seule.

            LE BUT EST L'ABONNEMENT, PAS LE VISIONNEMENT. D'où le partage : le
            texte et le bouton d'un côté, la vidéo de l'autre comme pièce à
            conviction. Le texte passe avant dans le DOM — c'est lui qui dit de
            quoi il s'agit ; en pile, sur un téléphone, la vidéo le suit.

            3:2 en faveur de la vidéo : un 16:9 rétrécit vite, et à
            moitié-moitié la miniature devenait une vignette — trop petite
            pour donner envie d'appuyer dessus. */}
        <section id="youtube" className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
            <div className="grid items-center gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
              <Reveal>
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-ink/50">
                  <IconeYoutube className="size-5 text-brand" />
                  {t.chaine.surTitre}
                </p>
                <h2 className="mt-4 font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
                  {t.chaine.titre}
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-ink/75">
                  {t.chaine.texte}
                </p>
                <div className="mt-8">
                  <BoutonAbonnement libelle={t.chaine.abonner} />
                </div>
              </Reveal>

              <Reveal delay={1}>
                <LecteurVideo
                  id={VIDEO_HISTOIRE.id}
                  miniature={VIDEO_HISTOIRE.miniature}
                  titre={t.chaine.video.titre}
                  lire={t.chaine.video.lire}
                  langue={t.htmlLang}
                />
                {t.chaine.video.mention && (
                  <p className="mt-3 text-sm text-ink/50">
                    {t.chaine.video.mention}
                  </p>
                )}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <SectionFaq id="faq" titre={t.faq.titre} items={t.faq.items} centre />

        {/* La section « Parlons de ton resto » (agenda) a quitté l'accueil :
            chaque bouton mène déjà à la réservation ou à /contact, qui garde
            l'agenda complet. */}

        <DonneesStructurees json={jsonLd} />
      </main>
      <BarreReservation
        href={cheminReservation(t.racine)}
        libelle={t.hero.reserver}
        places={t.hero.places.replace(
          "{reste}",
          String(Math.max(0, PLACES_FONDATEURS.total - PLACES_FONDATEURS.prises)),
        )}
      />
      <Footer t={t} />
    </>
  );
}
