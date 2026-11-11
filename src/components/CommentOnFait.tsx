import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BoutonReserver from "@/components/BoutonReserver";
import Carrousel from "@/components/Carrousel";
import FilAriane from "@/components/FilAriane";
import { Telephone, VisuelAnime } from "@/components/IllustrationPiece";
import LecteurVideo from "@/components/LecteurVideo";
import Reveal from "@/components/Reveal";
import { FONCTIONNALITES_EN, FONCTIONNALITES_FR, type Ecran } from "@/lib/contenu/fonctionnalites";
import type { Visuel } from "@/lib/contenu/grand-lancement";
import type { Langue } from "@/lib/contenu/lancement";
import { PIECES_EN, PIECES_FR, piecesPretes } from "@/lib/contenu/pieces";
import { VIDEO_ACCUEIL } from "@/lib/site";

/* « TU POURRAIS FAIRE BEAUCOUP PLUS DE VENTES EN LIGNE. »

   La page « How it works » d'Owner, version Québec : un gros titre centré sur
   le crème, puis les étapes 01, 02, 03… Chacune : son numéro, son titre, une
   ligne, « En savoir plus » vers sa page, et à droite ce que ça donne pour
   vrai (un écran de l'app ou un visuel animé). Une étape dont la page n'est
   pas prête disparaît.

   Deux usages : la page /plateforme (avec le fil d'Ariane, titre en h1, le
   bouton du calculateur) et l'accueil, juste sous le héro (titre en h2, la
   vidéo à la place du bouton). */

type Etape = { court: string; titre: string; texte: string; href: string; fond: string; clair?: boolean; ecran?: Ecran; visuel?: Visuel; image?: { src: string; l: number; h: number; alt: string } };

const TEXTES = {
  fr: {
    titre: "Tu pourrais faire BEAUCOUP plus de ventes en ligne.",
    surligne: "BEAUCOUP",
    intro: "Sortir dans Google, prendre plus de commandes en ligne et faire revenir tes clients. Voici comment.",
    bouton: "Calcule ce que tu aurais gardé",
    calculateur: "/#calculateur",
    plus: "En savoir plus",
    courts: { google: "Google", commandes: "Commandes", pub: "Nouveaux clients", points: "Fidélité", livraison: "Livraison", lundi: "Texto du lundi" },
    video: { titre: "Ta propre app de commande, ta clientèle t'appartient", lire: "Lire la vidéo" },
    etapes: {
      google: ["Sors en haut de Google", "Ta fiche Google montée pour toi. Les gens du coin te trouvent et commandent chez toi."],
      commandes: ["Prends tes commandes sans les 30 %", "Ton app à ton nom, à tes prix. La commande sort sur ton imprimante."],
      pub: ["On va chercher tes nouveaux clients", "300 $ de pub payés par nous, et nos cartons dans tes sacs."],
      points: ["Tes clients reviennent tout seuls", "Des points et des textos qui partent tout seuls."],
      livraison: ["La livraison, sans livreur à gérer", "Ton client paie 4,99 $. On s'occupe du reste."],
      lundi: ["Chaque lundi, tu vois ce que ça rapporte", "Tes commandes et tes nouvelles ventes, en un texto."],
    },
    alt: { accueil: "L'accueil de l'app de Bistro Habibi", compte: "Le compte client, avec ses points de fidélité", offre: "La course offerte au livreur", google: "Une épingle de carte au-dessus d'un quartier, avec cinq étoiles", pub: "Un sac de commande et un cellulaire avec une pub", points: "Une carte de fidélité avec des tampons et des pièces", livraison: "Un sac de livreur entre le resto et la maison du client", lundi: "Un cellulaire avec des messages, un calendrier et un graphique qui monte" },
  },
  en: {
    titre: "You could be making A LOT more online sales.",
    surligne: "A LOT",
    intro: "Show up on Google, take more orders online and bring your customers back. Here's how.",
    bouton: "Calculate what you'd have kept",
    calculateur: "/en#calculateur",
    plus: "Learn more",
    courts: { google: "Google", commandes: "Orders", pub: "New customers", points: "Loyalty", livraison: "Delivery", lundi: "Monday text" },
    video: { titre: "Your own ordering app, your customers belong to you", lire: "Play the video" },
    etapes: {
      google: ["Get to the top of Google", "Your Google profile, set up for you. Locals find you and order from you."],
      commandes: ["Take orders without the 30%", "Your own branded app, at your prices. Orders print in your kitchen."],
      pub: ["We go get your new customers", "$300 in ads paid by us, and our inserts in your bags."],
      points: ["Your customers come back on their own", "Points and texts that go out automatically."],
      livraison: ["Delivery, with no drivers to manage", "Your customer pays $4.99. We handle the rest."],
      lundi: ["Every Monday, see what it brings in", "Your orders and new sales, in one text."],
    },
    alt: { accueil: "The home screen of Bistro Habibi's app", compte: "The customer account, with loyalty points", offre: "The run offered to the driver", google: "A map pin above a neighbourhood, with five stars", pub: "A takeout bag and a phone showing an ad", points: "A loyalty card with stamps and coins", livraison: "A delivery bag between the restaurant and the customer's house", lundi: "A phone with messages, a calendar and a rising chart" },
  },
};

function etapes(langue: Langue): Etape[] {
  const T = TEXTES[langue];
  const f = langue === "en" ? FONCTIONNALITES_EN : FONCTIONNALITES_FR;
  const pieces = langue === "en" ? PIECES_EN : PIECES_FR;
  const pretes = new Set(piecesPretes(langue).map((p) => p.slug));
  const piece = (cle: string) => {
    const p = pieces[cle];
    return p && pretes.has(p.slug) ? p.slug : null;
  };
  const e = (k: keyof typeof T.etapes) => ({ court: T.courts[k], titre: T.etapes[k][0], texte: T.etapes[k][1] });
  const liste: (Etape | null | "")[] = [
    { ...e("google"), href: f.referencement.slug, fond: "bg-gradient-to-br from-ciel via-[#3d8bf0] to-[#5b5ff0]", image: { src: "/systeme/google.webp", l: 724, h: 775, alt: T.alt.google } },
    { ...e("commandes"), href: f.commandes.slug, fond: "bg-gradient-to-br from-hero to-brand", ecran: { src: "/demo-app/client/accueil.webp", alt: T.alt.accueil } },
    piece("pub-du-lancement") && { ...e("pub"), href: piece("pub-du-lancement")!, fond: "bg-ink", image: { src: "/systeme/nouveaux-clients.webp", l: 691, h: 646, alt: T.alt.pub } },
    piece("points-recompenses") && { ...e("points"), href: piece("points-recompenses")!, fond: "bg-[#efe9e1]", clair: true, image: { src: "/systeme/fidelite.webp", l: 810, h: 712, alt: T.alt.points } },
    piece("livraison") && { ...e("livraison"), href: piece("livraison")!, fond: "bg-gradient-to-br from-[#1f2a37] to-ink", image: { src: "/systeme/livraison.webp", l: 872, h: 559, alt: T.alt.livraison } },
    piece("texto-du-lundi") && { ...e("lundi"), href: piece("texto-du-lundi")!, fond: "bg-ink", image: { src: "/systeme/texto-du-lundi.webp", l: 742, h: 669, alt: T.alt.lundi } },
  ];
  return liste.filter((x): x is Etape => Boolean(x));
}

export default function CommentOnFait({
  fil,
  langue = "fr",
  accueil = false,
}: {
  fil?: { nom: string; chemin: string }[];
  langue?: Langue;
  /** Sur l'accueil : titre en h2 et la vidéo à la place du bouton. */
  accueil?: boolean;
}) {
  const T = TEXTES[langue];
  const liste = etapes(langue);
  const Titre = accueil ? "h2" : "h1";
  const SousTitre = accueil ? "h3" : "h2";
  return (
    <>
      <section className={accueil ? "bg-white px-3 md:px-5 lg:px-6" : "bg-bone"}>
        <div className={accueil ? "rounded-t-[2rem] bg-bone lg:rounded-t-[3rem]" : ""}>
          <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 text-center md:pb-32 md:pt-14">
            {fil && (
              <div className="flex justify-center">
                <FilAriane elements={fil} />
              </div>
            )}
            <Reveal>
              <Titre className="mx-auto mt-12 max-w-5xl font-display text-[8.5vw] font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-7xl">
                {T.titre.split(T.surligne)[0]}
                {/* Le mot qui compte, surligné en cyan comme dans le héro. */}
                <span className="relative inline-block whitespace-nowrap px-1">
                  <span aria-hidden="true" className="surligne absolute inset-x-0 bottom-[0.06em] top-[0.42em] -z-0 rounded-lg bg-ciel" />
                  <span className="relative">{T.surligne}</span>
                </span>
                {T.titre.split(T.surligne)[1]}
              </Titre>
              <p className="mx-auto mt-7 max-w-2xl text-lg font-bold leading-relaxed text-ink/70 md:text-xl">{T.intro}</p>
              {!accueil && (
                <div className="mt-9 flex justify-center">
                  <BoutonReserver href={T.calculateur} libelle={T.bouton} />
                </div>
              )}
            </Reveal>
            {accueil && (
              <Reveal>
                <div className="mx-auto mt-12 max-w-3xl">
                  <LecteurVideo
                    id={VIDEO_ACCUEIL.id}
                    miniature={VIDEO_ACCUEIL.miniature}
                    titre={T.video.titre}
                    lire={T.video.lire}
                    langue={langue === "en" ? "en-CA" : "fr-CA"}
                  />
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* LES ÉTAPES : une à la fois, dans le même espace. On passe à la
          suivante avec les onglets, les flèches ou en glissant. */}
      <section className={accueil ? "bg-white" : "-mt-12 rounded-t-[3rem] bg-white md:-mt-16 md:rounded-t-[4rem]"}>
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <Carrousel onglets={liste.map((e) => e.court)}>
            {liste.map((e) => (
              <div
                key={e.titre}
                className={`relative grid min-w-0 grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[2rem] md:h-[30rem] md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:rounded-[2.5rem] ${e.fond} ${e.clair ? "text-ink" : "text-white"}`}
              >
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]" />
                {/* Le texte */}
                <div className="relative flex min-w-0 flex-col justify-center p-8 md:p-12">
                  <SousTitre className="font-display text-3xl font-black leading-[1.05] tracking-tight [overflow-wrap:break-word] lg:text-4xl">{e.titre}</SousTitre>
                  <p className={`mt-4 max-w-sm text-lg leading-relaxed ${e.clair ? "text-ink/70" : "text-white/80"}`}>{e.texte}</p>
                  <Link
                    href={e.href}
                    className={`group mt-7 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 font-black transition ${
                      e.clair ? "bg-ink text-white hover:bg-brand" : "bg-white text-ink hover:bg-ink hover:text-white"
                    }`}
                  >
                    {T.plus}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
                {/* Le visuel : il entre en glissant quand la diapo apparaît. */}
                <div className="carrousel-visuel relative flex h-[19rem] items-end justify-center overflow-hidden md:h-auto md:items-center">
                  {e.image ? (
                    /* Les images en pâte à modeler (Higgsfield), détourées. Commandes garde le vrai écran de l'app. */
                    <div className="flex h-full w-full items-center justify-center px-8 pb-6 pt-2 md:p-10">
                      <Image
                        src={e.image.src}
                        width={e.image.l}
                        height={e.image.h}
                        alt={e.image.alt}
                        sizes="(min-width: 768px) 420px, 80vw"
                        className="h-auto max-h-[16rem] w-auto max-w-full object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.25)] md:max-h-[24rem]"
                      />
                    </div>
                  ) : e.ecran ? (
                    <Telephone ecran={e.ecran} className="relative -mb-24 w-56 rotate-[-6deg] drop-shadow-[0_40px_40px_rgba(0,0,0,0.35)] md:-mb-48 md:w-72" />
                  ) : (
                    e.visuel && (
                      <div className="w-full max-w-md px-6 pb-8 md:px-10 md:pb-0">
                        <VisuelAnime visuel={e.visuel} className="w-full rotate-[-2deg] shadow-2xl shadow-black/25" langue={langue} />
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </Carrousel>
        </div>
      </section>
    </>
  );
}
