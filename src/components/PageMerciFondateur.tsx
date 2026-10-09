import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { lireSession } from "@/lib/stripe";
import type { Textes } from "@/lib/textes/fr";
import InfoLancement from "@/components/InfoLancement";

/* LA PAGE OÙ STRIPE RAMÈNE LE RESTO APRÈS LE PAIEMENT.

   Deux cartes côte à côte : à gauche, la confirmation en rouge (le nom du
   resto, le montant payé, la condition de remboursement) ; à droite, la suite
   en étapes. Le titre ne dit plus « C'est réservé, {prénom} » : le prénom
   coupé du nom complet donnait des « Resto ! » qui ne voulaient rien dire.

   Elle relit la session chez Stripe et ne confirme la place QUE si le
   paiement est passé. Sinon (lien partagé, session expirée, Stripe
   injoignable), un merci générique. Ce n'est pas elle qui enregistre la place :
   c'est le webhook. */
export default async function PageMerciFondateur({
  t,
  session,
}: {
  t: Textes;
  session: string | undefined;
}) {
  const m = t.reservation.merci;
  const s = session ? await lireSession(session) : null;
  const paye = s?.payment_status === "paid" && s.metadata?.type === "fondateur";
  const prenom = s?.metadata?.nom?.trim().split(/\s+/)[0] ?? "";
  const argent = (cents: number) =>
    new Intl.NumberFormat(t.htmlLang, { style: "currency", currency: "CAD" }).format(cents / 100);

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

        {paye ? (
          <div className="mt-8 grid gap-4 md:mt-12 lg:grid-cols-2">
            {/* ─── La confirmation ─── */}
            <section className="calc-entre relative overflow-hidden rounded-[2rem] bg-hero p-7 text-white md:p-10">
              <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
              <div className="relative">
                <p className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold">
                  {m.etiquette.replace("{resto}", s.metadata.restaurant ?? "")}
                </p>
                <span className="mt-8 grid size-14 place-items-center rounded-full bg-white text-hero">
                  <Check className="size-7" aria-hidden="true" />
                </span>
                <h1 className="mt-6 font-display text-4xl font-black leading-[1.05] tracking-tight md:text-5xl">
                  {m.titre}
                </h1>
                <p className="mt-4 text-lg text-white/85">
                  {m.texte.replace("{prenom}", prenom).replace("{courriel}", s.customer_details?.email ?? "")}
                </p>

                {s.amount_total !== null && (
                  <div className="mt-8 border-t border-white/20 pt-6">
                    <p className="text-xs font-black uppercase tracking-widest text-white/60">{m.paye}</p>
                    <p className="mt-1 font-display text-4xl font-black">{argent(s.amount_total)}</p>
                    <p className="mt-2 text-sm font-bold text-white/75">{t.hero.condition}</p>
                  </div>
                )}
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
        ) : (
          <section className="calc-entre mt-8 max-w-2xl rounded-[2rem] bg-white p-7 md:mt-12 md:p-10">
            <h1 className="font-display text-4xl font-black leading-tight tracking-tight">{m.titreGenerique}</h1>
            <p className="mt-4 text-lg text-ink/70">{m.texteGenerique.replace("{tel}", PHONE_DISPLAY)}</p>
            <Link
              href={t.racine || "/"}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-black text-white transition hover:bg-brand"
            >
              {m.retour}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
