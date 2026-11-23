import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { PIED } from "@/lib/contenu/grand-lancement";
import { FR } from "@/lib/textes/fr";

/* LE CADRE DES PAGES DU CALCUL 60 SECONDES (/calcul et /calcul/dossier).

   Le logo, la page, les liens légaux : rien qui distrait. Pas de menu, pas de
   bandeau, pas de barre « Réserve ta place ». C'est la page où mènent les
   annonces, les textos et les cartes. */
export default function CadreCalcul({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="bg-white px-5 py-5 md:px-8">
        <Link href="/" className="inline-block">
          <Image draggable={false} src="/logo-marque.png" alt={FR.nav.logoAlt} width={1012} height={128} priority className="h-7 w-auto object-contain md:h-9" />
        </Link>
      </header>
      <main className="flex-1 bg-white" lang="fr-CA">
        {children}
      </main>
      <footer className="bg-white px-5 pb-10 pt-6 text-center text-sm text-ink/60 md:px-8">
        <p>{PIED.entreprise}</p>
        <p className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1">
          {PIED.liens.map((l) => (
            <Link key={l.href} href={l.href} className="font-bold underline underline-offset-4 hover:text-brand">
              {l.label}
            </Link>
          ))}
        </p>
      </footer>
    </>
  );
}
