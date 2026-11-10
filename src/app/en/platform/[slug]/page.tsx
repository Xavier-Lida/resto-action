import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageFonctionnalite from "@/components/PageFonctionnalite";
import {
  CLES,
  FONCTIONNALITES_EN,
  cleParSegment,
  segment,
} from "@/lib/contenu/fonctionnalites";
import { PLATEFORME_EN } from "@/lib/contenu/plateforme";
import { PIECES_EN, PIECES_FR, piecesPretes } from "@/lib/contenu/pieces";
import { ANGLAIS_ACTIF } from "@/lib/site";
import { EN } from "@/lib/textes/en";
import { hreflang, paireFonctionnalite } from "@/lib/routes";

/* Les quatre pages de fonctionnalité, sur une seule route.

   `params` est une PROMESSE depuis Next 15 : il faut l'attendre. Écrit comme
   un objet ordinaire, le code compile et casse au rendu.

   `dynamicParams = false` : tout slug absent de generateStaticParams rend un
   404 au lieu d'être fabriqué à la demande. Il n'y a que quatre
   fonctionnalités, et une cinquième URL inventée ne doit pas répondre 200 —
   une page vide indexée coûte plus cher qu'une page absente. */
export const dynamicParams = false;

const PAR_SEGMENT = cleParSegment(FONCTIONNALITES_EN);

/* Les pages des pièces, en anglais (src/lib/contenu/pieces.ts). Une pièce
   pas prête au lancement n'a pas de page. */
const piece = (slug: string) => piecesPretes("en").find((p) => segment(p.slug) === slug) ?? null;
const pieceFr = (slugEn: string) => {
  const cle = Object.keys(PIECES_EN).find((k) => PIECES_EN[k].slug === slugEn);
  return cle ? PIECES_FR[cle] : undefined;
};

const TOUTES = [...CLES.map((c) => FONCTIONNALITES_EN[c]), ...piecesPretes("en")].map((f) => ({ nom: f.filNom, href: f.slug, resume: f.resume }));

export function generateStaticParams() {
  return [
    ...CLES.map((cle) => ({ slug: segment(FONCTIONNALITES_EN[cle].slug) })),
    ...piecesPretes("en").map((p) => ({ slug: segment(p.slug) })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cle = PAR_SEGMENT.get(slug);
  const p = piece(slug);
  if (p) {
    const fr = pieceFr(p.slug)?.slug;
    return {
      title: p.metaTitre,
      description: p.metaDescription,
      alternates: {
        canonical: p.slug,
        languages: ANGLAIS_ACTIF && fr ? { "fr-CA": fr, "en-CA": p.slug, "x-default": fr } : { "en-CA": p.slug },
      },
      openGraph: { type: "website", locale: EN.meta.ogLocale, alternateLocale: "fr_CA", url: p.slug, siteName: "Resto Action", title: p.metaTitre, description: p.metaDescription },
    };
  }
  if (!cle) return {};

  const f = FONCTIONNALITES_EN[cle];
  return {
    title: f.metaTitre,
    description: f.metaDescription,
    alternates: {
      canonical: f.slug,
      languages: hreflang(paireFonctionnalite(cle)),
    },
    openGraph: {
      type: "website",
      locale: EN.meta.ogLocale,
      alternateLocale: "fr_CA",
      url: f.slug,
      siteName: "Resto Action",
      title: f.metaTitre,
      description: f.metaDescription,
    },
  };
}

export default async function Feature({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cle = PAR_SEGMENT.get(slug);
  const f = piece(slug) ?? (cle ? FONCTIONNALITES_EN[cle] : null);
  if (!f) notFound();
  const autres = TOUTES.filter((a) => a.href !== f.slug);

  return <PageFonctionnalite t={EN} f={f} plateforme={PLATEFORME_EN} autres={autres} />;
}
