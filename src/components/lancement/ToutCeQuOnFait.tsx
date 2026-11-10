import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Surtitre } from "@/components/lancement/ui";
import type { Langue } from "@/lib/contenu/lancement";
import { colonnesProduit } from "@/lib/contenu/pieces";

/* TOUT CE QU'ON FAIT POUR TOI, EN UN COUP D'ŒIL.

   Les mêmes quatre colonnes que le pied de page (pieces.ts), mais en grandes
   cartes : c'est ce qui dit vraiment ce que le resto reçoit. Chaque pièce
   mène à sa page, avec ses écrans et son « comment ça marche ». */
export default function ToutCeQuOnFait({ langue = "fr" }: { langue?: Langue }) {
  const en = langue === "en";
  const colonnes = colonnesProduit(langue).map((c) => ({ ...c, liens: c.liens.filter((l) => !l.href.includes("#")) }));
  return (
    <section id="tout" className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <Reveal>
          <Surtitre>{en ? "Everything we do for you" : "Tout ce qu'on fait pour toi"}</Surtitre>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
            {en ? "One system. Everything included." : "Un seul système. Tout est inclus."}
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {colonnes.map((c, k) => (
            <Reveal key={c.titre} delay={Math.min(k, 3) as 0 | 1 | 2 | 3} className="h-full">
              <div className={`flex h-full flex-col rounded-[2rem] p-6 ${k % 2 === 0 ? "bg-bone" : "bg-ink text-white"}`}>
                <p className={`text-sm font-black ${k % 2 === 0 ? "text-brand" : "text-white/60"}`}>{c.titre}</p>
                <ul className="mt-4 grid list-none gap-1">
                  {c.liens.map((l) => (
                    <li key={l.href + l.nom}>
                      <Link
                        href={l.href}
                        className={`group flex items-center justify-between gap-3 rounded-xl py-2 font-display text-lg font-black leading-tight tracking-tight transition-colors ${
                          k % 2 === 0 ? "hover:text-brand" : "hover:text-brand"
                        }`}
                      >
                        {l.nom}
                        <ArrowRight className="size-4 shrink-0 opacity-40 transition group-hover:translate-x-1 group-hover:opacity-100" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
