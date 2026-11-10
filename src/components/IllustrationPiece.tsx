import Image from "next/image";
import { AnimerAuDefilement } from "@/components/lancement/AnimerAuDefilement";
import { Visuel } from "@/components/lancement/visuels";
import type { Ecran, Illustration } from "@/lib/contenu/fonctionnalites";
import type { Visuel as TypeVisuel } from "@/lib/contenu/grand-lancement";
import type { Langue } from "@/lib/contenu/lancement";

/* LES IMAGES DES PAGES DE PIÈCES.

   Un vrai écran de l'app de Bistro Habibi dans un cadre de téléphone (ce que
   le client voit pour vrai), ou un visuel animé du Système (l'imprimante, les
   textos, la fiche Google…). Pas de photo d'archive : on montre comment ça
   marche, pas une ambiance. */
/* Le VRAI cadre d'iPhone du haut de page (telephone_cadre.avif) avec, dedans,
   un écran de l'app : la barre d'état d'origine en haut, le contenu dessous,
   comme DemoApp. Mêmes mesures que .demo-screen (globals.css). */
function barreEtat(src: string): string | null {
  const m = src.match(/^\/demo-app\/(client|livreur)\/([\w-]+)\.webp$/);
  if (!m) return null;
  return m[1] === "client" ? "/demo-app/client/statusbar.webp" : `/demo-app/livreur/statusbar-${m[2]}.webp`;
}

export function Telephone({ ecran, className = "" }: { ecran: Ecran; className?: string }) {
  const barre = barreEtat(ecran.src);
  return (
    <div className={`relative aspect-[780/1598] ${className}`}>
      <div className="demo-screen">
        {barre && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={barre} alt="" draggable={false} className="absolute inset-x-0 top-0 z-[2] w-full" />
        )}
        <Image
          src={ecran.src}
          alt={ecran.alt}
          width={780}
          height={1600}
          sizes="(max-width: 768px) 60vw, 300px"
          draggable={false}
          className="absolute inset-x-0 top-0 h-auto w-full"
          style={{ marginTop: barre ? "12.0513%" : 0 }}
        />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/telephone_cadre.avif" alt="" width={780} height={1598} draggable={false} className="pointer-events-none absolute inset-0 size-full" />
    </div>
  );
}

export function VisuelAnime({ visuel, className = "", langue = "fr" }: { visuel: TypeVisuel; className?: string; langue?: Langue }) {
  return (
    <AnimerAuDefilement className={`rounded-[2rem] bg-white p-2 shadow-xl shadow-ink/10 ${className}`}>
      <Visuel type={visuel} grand langue={langue} />
    </AnimerAuDefilement>
  );
}

export default function IllustrationPiece({ illustration, langue = "fr" }: { illustration: Illustration; langue?: Langue }) {
  if (illustration.type === "ecran") {
    return <Telephone ecran={illustration} className="mx-auto w-56 md:w-64 md:-rotate-3" />;
  }
  return <VisuelAnime visuel={illustration.visuel} className="mx-auto w-full max-w-md" langue={langue} />;
}
