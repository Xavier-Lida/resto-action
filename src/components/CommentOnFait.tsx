import { ArrowRight } from "lucide-react";
import Link from "next/link";
import BoutonReserver from "@/components/BoutonReserver";
import FilAriane from "@/components/FilAriane";
import { Telephone, VisuelAnime } from "@/components/IllustrationPiece";
import Reveal from "@/components/Reveal";
import { FONCTIONNALITES_FR, type Ecran } from "@/lib/contenu/fonctionnalites";
import type { Visuel } from "@/lib/contenu/grand-lancement";
import { PIECES_FR, piecesPretes } from "@/lib/contenu/pieces";

/* « TU POURRAIS FAIRE BEAUCOUP PLUS DE VENTES EN LIGNE. »

   La page « How it works » d'Owner, version Québec : un gros titre centré sur
   le crème, un bouton, puis les étapes 01, 02, 03… Chacune : son numéro, son
   titre, deux lignes, « En savoir plus » vers sa page, et à droite ce que ça
   donne pour vrai (un écran de l'app ou un visuel animé, sur un panneau de nos
   couleurs). Une étape dont la page n'est pas prête disparaît. */

type Etape = {
  titre: string;
  texte: string;
  href: string;
  fond: string;
  ecran?: Ecran;
  visuel?: Visuel;
};

const pretes = new Set(piecesPretes().map((p) => p.slug));
const piece = (segment: string) => {
  const p = PIECES_FR[segment];
  return p && pretes.has(p.slug) ? p.slug : null;
};

function etapes(): Etape[] {
  const f = FONCTIONNALITES_FR;
  const liste: (Etape | null | "")[] = [
    {
      titre: "Sors en haut de Google",
      texte: "Ta fiche Google montée pour toi et un site que Google lit. Les gens du coin te trouvent, et commandent chez toi.",
      href: f.referencement.slug,
      fond: "bg-gradient-to-br from-hero to-brand",
      visuel: "fiche-google",
    },
    {
      titre: "Prends tes commandes sans les 30 %",
      texte: "Ton app à ton nom, à tes prix de salle. La commande sort toute seule sur ton imprimante de cuisine.",
      href: f.commandes.slug,
      fond: "bg-bone",
      ecran: { src: "/demo-app/client/accueil.webp", alt: "L'accueil de l'app de Bistro Habibi" },
    },
    piece("pub-du-lancement") && {
      titre: "On va chercher tes nouveaux clients",
      texte: "300 $ de pub payés par nous, tes plaques, ton affiche et nos cartons dans tes sacs.",
      href: piece("pub-du-lancement")!,
      fond: "bg-ink",
      visuel: "blitz",
    },
    piece("points-recompenses") && {
      titre: "Tes clients reviennent tout seuls",
      texte: "Des points, des offres et des textos qui partent tout seuls, après 30 jours ou un panier laissé en plan.",
      href: piece("points-recompenses")!,
      fond: "bg-bone",
      ecran: { src: "/demo-app/client/compte.webp", alt: "Le compte client, avec ses points de fidélité" },
    },
    piece("livraison") && {
      titre: "La livraison, sans livreur à gérer",
      texte: "Ton client paie 4,99 $. On s'occupe des livreurs et des plaintes.",
      href: piece("livraison")!,
      fond: "bg-gradient-to-br from-hero to-brand",
      ecran: { src: "/demo-app/livreur/offre.webp", alt: "La course offerte au livreur" },
    },
    piece("texto-du-lundi") && {
      titre: "Chaque lundi, tu vois ce que ça rapporte",
      texte: "Tes commandes directes, tes nouvelles ventes et l'argent rapporté, en un texto.",
      href: piece("texto-du-lundi")!,
      fond: "bg-ink",
      visuel: "textos",
    },
  ];
  return liste.filter((e): e is Etape => Boolean(e));
}

export default function CommentOnFait({ fil }: { fil: { nom: string; chemin: string }[] }) {
  const liste = etapes();
  return (
    <>
      <section className="bg-bone">
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 text-center md:pb-32 md:pt-14">
          <div className="flex justify-center">
            <FilAriane elements={fil} />
          </div>
          <Reveal>
            <h1 className="mx-auto mt-12 max-w-5xl font-display text-[8.5vw] font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-7xl">
              Tu pourrais faire BEAUCOUP plus de ventes en ligne.
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg font-bold leading-relaxed text-ink/70 md:text-xl">
              Resto Action, c&apos;est la façon la plus simple de sortir dans Google, de prendre plus de commandes en ligne et
              de faire revenir tes clients. Voici comment on s&apos;y prend.
            </p>
            <div className="mt-9 flex justify-center">
              <BoutonReserver href="/#calculateur" libelle="Calcule ce que tu aurais gardé" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="-mt-12 rounded-t-[3rem] bg-white md:-mt-16 md:rounded-t-[4rem]">
        <ol className="mx-auto grid max-w-6xl list-none grid-cols-[minmax(0,1fr)] gap-20 px-5 py-20 md:gap-28 md:py-28">
          {liste.map((e, i) => (
            <li key={e.titre} className="grid min-w-0 grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
              <Reveal>
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:gap-7">
                  <p className="shrink-0 font-display text-3xl font-black tracking-tight sm:text-4xl md:text-6xl">
                    {String(i + 1).padStart(2, "0")}.
                  </p>
                  <div className="min-w-0 sm:border-l-2 sm:border-dashed sm:border-ink/15 sm:pl-7">
                    <h2 className="font-display text-2xl font-black leading-[1.08] tracking-tight [overflow-wrap:anywhere] sm:text-3xl md:text-5xl">{e.titre}</h2>
                    <p className="mt-4 max-w-md text-lg leading-relaxed text-ink/70 md:text-xl">{e.texte}</p>
                    <Link
                      href={e.href}
                      className="group mt-7 inline-flex items-center gap-2 rounded-2xl bg-bone px-6 py-3.5 font-black transition hover:bg-ink hover:text-white"
                    >
                      En savoir plus
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={1}>
                <div className={`relative grid min-h-[22rem] place-items-center overflow-hidden rounded-[2rem] p-8 md:min-h-[28rem] lg:rounded-[2.5rem] ${e.fond}`}>
                  <div aria-hidden="true" className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]" />
                  {e.ecran ? (
                    <Telephone ecran={e.ecran} className="relative w-52 rotate-[-4deg] md:w-60" />
                  ) : (
                    e.visuel && <VisuelAnime visuel={e.visuel} className="relative w-full max-w-sm" />
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
