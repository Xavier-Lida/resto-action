import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { lireSession } from "@/lib/stripe";
import type { Textes } from "@/lib/textes/fr";

/* LA PAGE OÙ STRIPE RAMÈNE LE RESTO APRÈS LE PAIEMENT.

   Elle relit la session chez Stripe pour dire « c'est réservé » avec le nom
   du resto, mais SEULEMENT si le paiement est bel et bien passé. Sinon (lien
   partagé, session expirée, Stripe injoignable), un merci générique : on ne
   confirme jamais une place sur la seule foi d'une adresse.

   Ce n'est pas elle qui enregistre la place : c'est le webhook. Un resto qui
   ferme l'onglet avant d'arriver ici a quand même sa place. */
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

  const titre = paye ? m.titre.replace("{nom}", s.metadata.nom?.split(" ")[0] ?? "") : m.titreGenerique;
  const texte = paye
    ? m.texte
        .replace("{resto}", s.metadata.restaurant ?? "")
        .replace("{courriel}", s.customer_details?.email ?? "")
    : m.texteGenerique.replace("{tel}", PHONE_DISPLAY);

  return (
    <main className="min-h-svh bg-white p-3 md:p-5 lg:p-6">
      <div className="relative flex min-h-[calc(100svh-1.5rem)] flex-col overflow-hidden rounded-[2rem] bg-hero px-5 py-8 text-white md:min-h-[calc(100svh-2.5rem)] md:px-12 lg:min-h-[calc(100svh-3rem)] lg:rounded-[3rem]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-white/10 blur-3xl"
        />
        <Link href={t.racine || "/"} className="relative self-start">
          <Image
            draggable={false}
            src="/logo-blanc.png"
            alt={t.nav.logoAlt}
            width={1012}
            height={128}
            priority
            // Le logo « blanc » garde « Action » en rouge, invisible sur le
            // rouge : on le passe au blanc pur.
            className="h-7 w-auto object-contain brightness-0 invert md:h-8"
          />
        </Link>

        <div className="relative mx-auto my-auto w-full max-w-2xl py-12">
          <span className="calc-entre grid size-16 place-items-center rounded-full bg-white text-hero">
            <Check className="size-8" aria-hidden="true" />
          </span>
          <h1 className="mt-8 font-display text-4xl font-black leading-tight tracking-tight md:text-6xl">
            {titre}
          </h1>
          <p className="mt-5 text-lg text-white/85">{texte}</p>

          {/* Le reçu en une ligne : ce qui a été payé, et la garantie de
              remboursement, pour qu'il n'ait pas à fouiller ses courriels. */}
          {paye && s.amount_total !== null && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white/10 px-6 py-5 ring-1 ring-white/20">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-white/60">{m.paye}</p>
                <p className="font-display text-3xl font-black">
                  {new Intl.NumberFormat(t.htmlLang, { style: "currency", currency: "CAD" }).format(s.amount_total / 100)}
                </p>
              </div>
              <p className="max-w-xs text-sm font-bold text-white/80">{t.hero.condition}</p>
            </div>
          )}

          {paye && (
            <div className="mt-10 rounded-3xl bg-white p-6 text-ink md:p-8">
              <p className="text-xs font-black uppercase tracking-widest text-brand">{m.suiteTitre}</p>
              <ol className="mt-5 grid list-none gap-4">
                {m.suite.map((etape, i) => (
                  <li key={etape} className="flex items-start gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-bone font-display text-sm font-black">
                      {i + 1}
                    </span>
                    <span className="pt-1 font-bold">{etape}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <p className="mt-8 text-white/80">
            {m.question}{" "}
            <a href={PHONE_HREF} className="font-black text-white underline underline-offset-4">
              {PHONE_DISPLAY}
            </a>
          </p>

          <Link
            href={t.racine || "/"}
            className="mt-8 inline-flex items-center rounded-full bg-white px-7 py-4 text-lg font-black text-ink shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5"
          >
            {m.retour}
          </Link>
        </div>
      </div>
    </main>
  );
}
