"use client";

import { useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { CLE_MERCI } from "@/components/FormulaireFondateur";
import InfoLancement from "@/components/InfoLancement";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

/* LA PAGE DE MERCI, APRÈS UNE RÉSERVATION GRATUITE.

   Deux cartes côte à côte : à gauche, la confirmation en rouge (« C'est noté,
   {prénom}! » et l'appel dans les 24 h) ; à droite, la suite : les étapes 2 à
   5 de la frise « Comment ça marche ».

   Le prénom et le resto arrivent du formulaire par sessionStorage (jamais
   dans l'adresse). Sans eux (navigation privée, lien partagé), la page dit
   simplement « C'est noté! ». */
const lire = () => {
  try {
    return sessionStorage.getItem(CLE_MERCI) ?? "";
  } catch {
    return "";
  }
};
const sAbonner = () => () => {};

export default function PageMerciFondateur({ t }: { t: Textes }) {
  const m = t.reservation.merci;
  const brut = useSyncExternalStore(sAbonner, lire, () => "");
  const { prenom, resto } = useMemo(() => {
    try {
      const v = JSON.parse(brut) as { prenom?: unknown; resto?: unknown };
      return {
        prenom: typeof v.prenom === "string" ? v.prenom.slice(0, 60) : "",
        resto: typeof v.resto === "string" ? v.resto.slice(0, 120) : "",
      };
    } catch {
      return { prenom: "", resto: "" };
    }
  }, [brut]);

  return (
    <main lang={t.htmlLang} className="min-h-svh bg-bone px-3 py-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-5xl">
        <Link href={t.racine || "/"} className="inline-block">
          <Image
            draggable={false}
            src="/logo-marque.png"
            alt={t.nav.logoAlt}
            width={1012}
            height={128}
            priority
            className="h-7 w-auto object-contain md:h-8"
          />
        </Link>

        <div className="mt-8 grid gap-4 md:mt-12 lg:grid-cols-2">
          {/* ─── La confirmation ─── */}
          <section className="calc-entre relative overflow-hidden rounded-[2rem] bg-hero p-7 text-white md:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <p className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold">
                {resto ? m.etiquette.replace("{resto}", resto) : m.etiquetteSansResto}
              </p>
              <span className="mt-8 grid size-14 place-items-center rounded-full bg-ciel text-white shadow-[0_0_0_6px_rgba(25,211,240,0.25)]">
                <Check className="size-7" aria-hidden="true" />
              </span>
              <h1 className="mt-6 font-display text-4xl font-black leading-[1.05] tracking-tight md:text-5xl">
                {prenom ? m.titre.replace("{prenom}", prenom) : m.titreSansPrenom}
              </h1>
              <p className="mt-4 text-lg text-white/85">{m.texte}</p>
              <p className="mt-8 border-t border-white/20 pt-6 text-sm font-bold text-white/75">{t.hero.condition}</p>
            </div>
          </section>

          {/* ─── La suite ─── */}
          <section className="calc-entre rounded-[2rem] bg-white p-7 md:p-10" style={{ animationDelay: "0.15s" }}>
            <InfoLancement t={t} className="mb-7" />
            <p className="text-xs font-black uppercase tracking-widest text-brand">{m.suiteTitre}</p>
            <ol className="relative mt-6 grid list-none gap-5 border-l-2 border-bone pl-6">
              {m.suite.map((etape, i) => (
                <li key={etape} className="relative">
                  <span
                    className={`absolute -left-[2.35rem] top-0 grid size-7 place-items-center rounded-full font-display text-xs font-black ring-4 ring-white ${
                      i === 0 ? "bg-brand text-white" : "bg-bone text-ink"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <p className={`leading-snug ${i === 0 ? "font-black" : "font-bold text-ink/80"}`}>{etape}</p>
                </li>
              ))}
            </ol>

            <div className="mt-7 rounded-2xl bg-bone p-5">
              <p className="font-black">{m.suiviTitre}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">{m.suiviTexte}</p>
              <Link href={`${t.racine}/contact`} className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black text-white transition hover:bg-brand">
                {m.suiviBouton}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <p className="mt-8 text-ink/70">
              {m.question}{" "}
              <a href={PHONE_HREF} className="font-black text-ink underline underline-offset-4 hover:text-brand">
                {PHONE_DISPLAY}
              </a>
            </p>
            <Link
              href={t.racine || "/"}
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-black text-white transition hover:bg-brand"
            >
              {m.retour}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
