import Image from "next/image";
import Link from "next/link";
import { Check, Mail, Phone, RotateCcw } from "lucide-react";
import InfoLancement from "@/components/InfoLancement";
import { EMAIL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { lireDossier } from "@/lib/stripe";
import type { Textes } from "@/lib/textes/fr";

/* LE DOSSIER PRIVÉ D'UN RESTO FONDATEUR (/dossier/[session]).

   Le problème qu'elle règle : un resto qui paye 500 $ puis n'a plus de
   nouvelles pendant les tests finit par demander son argent. Ici, il voit en
   tout temps où en est son app, la prochaine date où on lui reparle, un mot
   de l'équipe, et ses trois portes : envoyer son menu, appeler, se faire
   rembourser.

   Les étapes se mettent à jour dans Stripe (métadonnées du client, voir
   lireDossier dans src/lib/stripe.ts). Le lien est l'identifiant de la session
   de paiement : long, impossible à deviner, et rien de sensible n'est affiché
   (ni courriel, ni téléphone, ni montant). Page jamais indexée. */
export default async function PageDossier({ t, session }: { t: Textes; session: string }) {
  const d = t.reservation.dossier;
  const dossier = await lireDossier(session);

  if (!dossier) {
    return (
      <main className="grid min-h-svh place-items-center bg-bone px-5">
        <p className="max-w-md text-center text-lg text-ink/70">{d.introuvable.replace("{tel}", PHONE_DISPLAY)}</p>
      </main>
    );
  }

  const total = d.etapes.length;
  const faites = dossier.etape;
  const sujet = (modele: string) => encodeURIComponent(modele.replace("{resto}", dossier.restaurant));

  return (
    <main className="min-h-svh bg-bone px-3 py-6 md:px-6 md:py-10">
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

        <header className="mt-8 md:mt-12">
          <p className="text-xs font-black uppercase tracking-widest text-brand">{d.surTitre}</p>
          <h1 className="mt-2 font-display text-4xl font-black leading-tight tracking-tight md:text-5xl">
            {dossier.restaurant}
          </h1>
          {dossier.ville && <p className="mt-1 text-ink/60">{dossier.ville}</p>}
          <div className="mt-6 max-w-md">
            <p className="text-sm font-bold text-ink/70">
              {d.progression.replace("{n}", String(faites)).replace("{total}", String(total))}
            </p>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-ink/10">
              <div className="h-full rounded-full bg-brand" style={{ width: `${(faites / total) * 100}%` }} />
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          {/* ─── Les étapes ─── */}
          <section className="rounded-[2rem] bg-white p-7 md:p-10">
            <ol className="relative grid list-none gap-6 border-l-2 border-bone pl-7">
              {d.etapes.map((etape, i) => {
                const faite = i < faites;
                const courante = i === faites;
                return (
                  <li key={etape.titre} className="relative">
                    <span
                      className={`absolute -left-[2.6rem] top-0 grid size-8 place-items-center rounded-full ring-4 ring-white ${
                        faite ? "bg-brand text-white" : courante ? "bg-white text-brand ring-brand/30" : "bg-bone text-ink/40"
                      }`}
                    >
                      {faite ? (
                        <Check className="size-4" aria-hidden="true" />
                      ) : (
                        <span className={`font-display text-xs font-black ${courante ? "animate-pulse" : ""}`}>{i + 1}</span>
                      )}
                    </span>
                    <p className={`flex flex-wrap items-center gap-2 font-black ${faite || courante ? "" : "text-ink/45"}`}>
                      {etape.titre}
                      {courante && (
                        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[0.65rem] font-black uppercase tracking-widest text-brand">
                          {d.enCours}
                        </span>
                      )}
                    </p>
                    <p className={`mt-0.5 text-sm leading-relaxed ${faite || courante ? "text-ink/70" : "text-ink/40"}`}>
                      {etape.texte}
                    </p>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* ─── Les nouvelles et les actions ─── */}
          <div className="grid content-start gap-4">
            <section className="rounded-[2rem] bg-hero p-7 text-white">
              <p className="text-xs font-black uppercase tracking-widest text-white/60">{d.prochainPoint}</p>
              <p className="mt-1 font-display text-2xl font-black">{dossier.prochainPoint ?? d.aConfirmer}</p>
              <p className="mt-5 text-xs font-black uppercase tracking-widest text-white/60">{d.dateLancement}</p>
              <p className="mt-1 font-display text-2xl font-black">{dossier.dateLancement ?? d.aConfirmer}</p>
              {dossier.message && (
                <div className="mt-5 rounded-2xl bg-white/10 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-white/60">{d.message}</p>
                  <p className="mt-1 leading-relaxed">{dossier.message}</p>
                </div>
              )}
              {dossier.misAJour && (
                <p className="mt-4 text-xs text-white/60">{d.misAJour.replace("{date}", dossier.misAJour)}</p>
              )}
            </section>

            <section className="rounded-[2rem] bg-white p-7">
              <p className="font-black">{d.actions}</p>
              <div className="mt-4 grid gap-2">
                <a
                  href={`mailto:${EMAIL}?subject=${sujet(d.sujetMenu)}`}
                  className="flex items-center gap-3 rounded-2xl bg-ink px-4 py-3.5 font-black text-white transition hover:bg-brand"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  {d.envoyerMenu}
                </a>
                <a
                  href={PHONE_HREF}
                  className="flex items-center gap-3 rounded-2xl bg-bone px-4 py-3.5 font-black transition hover:bg-ink hover:text-white"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  {d.appeler} · {PHONE_DISPLAY}
                </a>
                <a
                  href={`mailto:${EMAIL}?subject=${sujet(d.sujetRemboursement)}`}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-ink/60 transition hover:bg-bone hover:text-ink"
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  {d.rembourser}
                </a>
              </div>
              <p className="mt-3 text-xs text-ink/50">{d.rembourserNote}</p>
            </section>

            <InfoLancement t={t} compact />
          </div>
        </div>
      </div>
    </main>
  );
}
