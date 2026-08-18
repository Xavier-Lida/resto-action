import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import BarreNav from "@/components/BarreNav";
import Footer from "@/components/Footer";
import { PHONE_HREF } from "@/lib/site";
import { FR } from "@/lib/textes/fr";

export const metadata: Metadata = {
  title: "Page introuvable",
};

// 404 dans le langage de la hero : carte rouge arrondie sur page blanche,
// la mascotte perdue dans un cercle comme sur les cartes de l'approche.
export default function NotFound() {
  return (
    <>
      <BarreNav t={FR} />
      <main className="flex-1 bg-white p-3 md:p-5 lg:p-6">
      <div className="flex min-h-[92svh] flex-col items-center justify-center rounded-[2rem] bg-hero px-6 py-16 text-center text-white lg:rounded-[3rem]">
        <p
          aria-hidden="true"
          className="select-none font-display text-7xl font-black leading-none md:text-8xl"
        >
          404
        </p>

        <div className="mt-8 size-44 overflow-hidden rounded-full border-2 border-ink bg-bone md:size-52">
          <Image
            src="/mascotte-perdu.webp"
            alt="La mascotte Resto Action se gratte la tête, l'air perdu, sa bouée sous le bras"
            width={1024}
            height={1024}
            unoptimized
            draggable={false}
            className="size-full object-cover"
          />
        </div>

        <h1 className="mt-8 max-w-xl font-display text-2xl font-black leading-tight md:text-4xl">
          Oups, cette page a coulé.
        </h1>
        <p className="mt-3 max-w-md text-white/85">
          Elle n&apos;existe pas, ou elle a déménagé. On te ramène à bon port.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-black text-hero transition hover:bg-ink hover:text-white active:scale-95"
          >
            Retour à l&apos;accueil
          </Link>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center gap-2 rounded-full border-2 border-white px-6 py-3.5 font-black transition-colors hover:bg-white hover:text-hero"
          >
            <Phone className="size-4" />
            Appelle-nous
          </a>
        </div>
      </div>
    </main>
      <Footer t={FR} />
    </>
  );
}
