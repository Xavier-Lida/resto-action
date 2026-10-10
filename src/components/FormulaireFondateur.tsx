"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Lock, Mail, ShieldCheck } from "lucide-react";
import BarrePlaces from "@/components/BarrePlaces";
import LienPasPret from "@/components/LienPasPret";
import ModalePasPret from "@/components/ModalePasPret";
import DemoApp from "@/components/DemoApp";
import InfoLancement from "@/components/InfoLancement";
import { formaterTelephone } from "@/lib/telephone";
import { lireProvenance } from "@/lib/provenance";
import { PHONE_DISPLAY } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

/* LA RÉSERVATION FONDATEUR, EN 4 ÉTAPES, À LA RELAY.

   À gauche, une étape à la fois : ton resto → ton app → l'offre → la
   réservation. À droite, la VRAIE app qu'on a bâtie pour Bistro Habibi : on
   vend du sur mesure fait à la main, donc on montre du vrai travail, pas un
   modèle généré. L'étape 2 demande de quoi partir (le lien du menu).

   POURQUOI DES ÉTAPES ET PAS UN LONG FORMULAIRE. Chaque écran demande peu, et
   le premier ne demande que l'essentiel. Dès qu'il est rempli, le CRM est
   prévenu (action « prospect ») : un resto qui décroche à l'étape 3 reste un
   lead chaud à rappeler, et sa ville dit où recruter des livreurs.

   LE PAIEMENT SE FAIT CHEZ STRIPE. L'étape 4 demande une session Checkout à
   /api/fondateur et y envoie le navigateur. Le montant est fixé côté serveur.

   Les taxes affichées ici ne sont qu'un aperçu : c'est Stripe qui calcule
   celles qu'il facture, avec les taux TPS et TVQ configurés chez lui. */

const PRIX = 500;
const TPS = 0.05;
const TVQ = 0.09975;
const arrondir = (n: number) => Math.round(n * 100) / 100;

type Champs = {
  restaurant: string;
  ville: string;
  nom: string;
  courriel: string;
  telephone: string;
};

export default function FormulaireFondateur({
  t,
  restoInitial,
  annule,
}: {
  t: Textes;
  restoInitial: string;
  annule: boolean;
}) {
  const r = t.reservation;
  const [etape, setEtape] = useState(0);
  const [champs, setChamps] = useState<Champs>({
    restaurant: restoInitial,
    ville: "",
    nom: "",
    courriel: "",
    telephone: "",
  });
  const [menu, setMenu] = useState("");
  const [service, setService] = useState<"livraison" | "cueillette">("livraison");
  const [plateformes, setPlateformes] = useState<string[]>([]);
  const [commandes, setCommandes] = useState("");
  const [accord, setAccord] = useState(false);
  const [piege, setPiege] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(annule ? r.paiement.annule : null);

  // On remonte en haut à chaque étape : sur un téléphone, la suivante
  // commencerait sinon au milieu de l'écran.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [etape]);

  const langue = t.htmlLang.startsWith("en") ? "en" : "fr";
  const argent = (n: number) =>
    new Intl.NumberFormat(t.htmlLang, { style: "currency", currency: "CAD" }).format(n);
  const tps = arrondir(PRIX * TPS);
  const tvq = arrondir(PRIX * TVQ);
  const total = arrondir(PRIX + tps + tvq);
  const messageErreur = (code: string) =>
    (r.erreurs[code as keyof typeof r.erreurs] ?? r.erreurs.stripe).replace("{tel}", PHONE_DISPLAY);

  const base = () => ({
    ...champs,
    langue,
    piege,
    provenance: lireProvenance() ?? undefined,
  });

  async function suivant() {
    setErreur(null);
    if (etape === 0) {
      const { restaurant, ville, nom, courriel, telephone } = champs;
      if (
        !restaurant.trim() ||
        !ville.trim() ||
        !nom.trim() ||
        !telephone.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(courriel.trim())
      ) {
        setErreur(r.erreurs.invalide);
        return;
      }
      // Le CRM est prévenu sans faire attendre : une panne ne bloque pas
      // le resto à l'étape 1.
      fetch("/api/fondateur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "prospect", ...base() }),
        keepalive: true,
      }).catch(() => {});
    }
    if (etape === 2 && !accord) {
      setErreur(r.erreurs.accord);
      return;
    }
    setEtape((e) => Math.min(e + 1, 3));
  }

  async function payer() {
    setErreur(null);
    setEnvoi(true);
    try {
      const reponse = await fetch("/api/fondateur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "paiement",
          ...base(),
          menu,
          service,
          plateformes,
          commandes,
          accord,
        }),
      });
      const donnees = (await reponse.json()) as { url?: string; erreur?: string };
      if (donnees.url) {
        window.location.assign(donnees.url);
        return;
      }
      setErreur(messageErreur(donnees.erreur ?? "stripe"));
    } catch {
      setErreur(messageErreur("stripe"));
    }
    setEnvoi(false);
  }

  return (
    <main lang={t.htmlLang} className="min-h-svh bg-white p-3 md:p-5 lg:p-6">
      <div className="grid min-h-[calc(100svh-1.5rem)] overflow-hidden rounded-[2rem] bg-bone md:min-h-[calc(100svh-2.5rem)] lg:min-h-[calc(100svh-3rem)] lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:rounded-[3rem]">
        {/* ─── Le formulaire ─── */}
        <div className="flex flex-col px-5 py-6 md:px-12 md:py-10">
          <div className="flex items-center justify-between gap-4">
            <Link href={t.racine || "/"} className="shrink-0">
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
            <Link
              href={t.racine || "/"}
              className="text-sm font-bold text-ink/60 underline-offset-4 hover:text-ink hover:underline"
            >
              {r.retour}
            </Link>
          </div>

          {/* La progression : 4 segments, celui en cours se remplit. */}
          <div className="mt-10 md:mt-14">
            <p className="text-xs font-black uppercase tracking-widest text-brand">
              {r.etape.replace("{n}", String(etape + 1))} · {r.etapes[etape]}
            </p>
            <ol className="mt-3 grid list-none grid-cols-4 gap-1.5" aria-label={r.etape.replace("{n}", String(etape + 1))}>
              {r.etapes.map((nom, i) => (
                <li key={nom} className="h-1.5 overflow-hidden rounded-full bg-ink/10">
                  <span
                    className="block h-full rounded-full bg-brand transition-all duration-500"
                    style={{ width: i <= etape ? "100%" : "0%" }}
                  />
                  <span className="sr-only">{nom}</span>
                </li>
              ))}
            </ol>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (etape < 3) void suivant();
              else void payer();
            }}
            className="relative mt-8 flex flex-1 flex-col"
            noValidate
          >
            <div key={etape} className="calc-entre flex-1">
              {etape === 0 && (
                <Etape titre={r.resto.titre} texte={r.resto.texte}>
                  <InfoLancement t={t} compact className="mb-5" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Champ
                      etiquette={r.resto.restaurant}
                      valeur={champs.restaurant}
                      exemple={r.resto.exempleResto}
                      onChange={(v) => setChamps({ ...champs, restaurant: v })}
                      autoComplete="organization"
                      large
                    />
                    <Champ
                      etiquette={r.resto.ville}
                      valeur={champs.ville}
                      exemple={r.resto.exempleVille}
                      onChange={(v) => setChamps({ ...champs, ville: v })}
                      autoComplete="address-level2"
                    />
                    <Champ
                      etiquette={r.resto.nom}
                      valeur={champs.nom}
                      onChange={(v) => setChamps({ ...champs, nom: v })}
                      autoComplete="name"
                    />
                    <Champ
                      etiquette={r.resto.courriel}
                      type="email"
                      valeur={champs.courriel}
                      onChange={(v) => setChamps({ ...champs, courriel: v })}
                      autoComplete="email"
                    />
                    <Champ
                      etiquette={r.resto.telephone}
                      type="tel"
                      valeur={champs.telephone}
                      onChange={(v) => setChamps({ ...champs, telephone: formaterTelephone(v) })}
                      autoComplete="tel"
                    />
                  </div>
                </Etape>
              )}

              {etape === 1 && (
                <Etape titre={r.app.titre} texte={r.app.texte}>
                  {/* La promesse de livraison, à l'adresse qu'il vient de donner. */}
                  <p className="mb-7 flex items-start gap-3 rounded-2xl bg-white p-4 font-bold">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand text-white">
                      <Mail className="size-4" aria-hidden="true" />
                    </span>
                    <span className="pt-1">
                      {r.app.livraisonMaquette.replace("{courriel}", champs.courriel.trim())}
                    </span>
                  </p>
                  <label className="mb-7 block">
                    <span className="font-bold">
                      {r.app.menu} <span className="font-normal text-ink/50">({r.app.facultatif})</span>
                    </span>
                    <input
                      type="url"
                      value={menu}
                      onChange={(e) => setMenu(e.target.value)}
                      placeholder={r.app.exempleMenu}
                      className="mt-2 w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3.5 text-base outline-none transition-colors placeholder:text-ink/35 focus:border-brand"
                    />
                    <span className="mt-1.5 block text-sm text-ink/55">{r.app.menuAide}</span>
                  </label>

                  {/* Au téléphone, la colonne de droite n'existe pas : la preuve
                      (l'app de Bistro Habibi) se montre ici. */}
                  <figure className="mb-8 flex flex-col items-center gap-3 lg:hidden">
                    <DemoApp demo="client" alt={t.hero.maquette.exempleAlt} attente={t.hero.maquette.attente} className="[--demo-w:15rem]" />
                    <figcaption className="text-sm font-bold text-ink/60">{t.hero.maquette.exemple}</figcaption>
                  </figure>

                  <Groupe titre={r.app.service}>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {(["livraison", "cueillette"] as const).map((s) => (
                        <Pastille key={s} actif={service === s} onClick={() => setService(s)}>
                          {r.app.services[s]}
                        </Pastille>
                      ))}
                    </div>
                  </Groupe>

                  <Groupe titre={r.app.plateformes}>
                    <div className="flex flex-wrap gap-2">
                      {r.app.listePlateformes.map((p, i) => {
                        const aucune = i === r.app.listePlateformes.length - 1;
                        const actif = plateformes.includes(p);
                        return (
                          <Pastille
                            key={p}
                            actif={actif}
                            onClick={() =>
                              setPlateformes((liste) =>
                                aucune
                                  ? actif ? [] : [p]
                                  : actif
                                    ? liste.filter((x) => x !== p)
                                    : [...liste.filter((x) => x !== r.app.listePlateformes.at(-1)), p],
                              )
                            }
                          >
                            {p}
                          </Pastille>
                        );
                      })}
                    </div>
                  </Groupe>

                  <Groupe titre={r.app.commandes}>
                    <div className="flex flex-wrap gap-2">
                      {r.app.listeCommandes.map((c) => (
                        <Pastille key={c} actif={commandes === c} onClick={() => setCommandes(c)}>
                          {c}
                        </Pastille>
                      ))}
                    </div>
                  </Groupe>
                </Etape>
              )}

              {etape === 2 && (
                <Etape titre={r.offre.titre} texte={r.offre.texte}>
                  <InfoLancement t={t} className="mb-5" />
                  <ol className="relative list-none rounded-3xl bg-white p-5 md:p-6">
                    {t.offre.couts.map((c, i) => (
                      <li key={c.quand} className="relative flex gap-4 pb-5 last:pb-0">
                        {i < t.offre.couts.length - 1 && (
                          <span aria-hidden="true" className="absolute left-[0.6875rem] top-6 h-full w-px bg-ink/10" />
                        )}
                        <span
                          className={`relative mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${
                            i === 0 ? "bg-brand text-white" : "bg-bone"
                          }`}
                        >
                          {i === 0 && <Check className="size-3.5" aria-hidden="true" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                            <span className="text-sm font-bold text-ink/60">{c.quand}</span>
                            <span className="font-display text-lg font-black">{c.quoi}</span>
                          </span>
                          <span className="block text-sm text-ink/60">{c.detail}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-2 text-xs text-ink/50">{t.offre.taxes}</p>

                  <div className="mt-5 flex gap-3 rounded-3xl bg-ink p-5 text-white">
                    <ShieldCheck className="size-6 shrink-0 text-brand" aria-hidden="true" />
                    <div>
                      <p className="font-black">{t.offre.garantie.titre}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/75">{t.offre.garantie.texte}</p>
                      <p className="mt-2 text-xs text-white/50">{t.offre.garantie.note}</p>
                    </div>
                  </div>

                  <label className="mt-5 flex cursor-pointer gap-3 rounded-2xl border-2 border-ink/10 bg-white p-4 transition-colors has-[:checked]:border-brand">
                    <input
                      type="checkbox"
                      checked={accord}
                      onChange={(e) => setAccord(e.target.checked)}
                      className="mt-0.5 size-5 shrink-0 accent-[var(--color-brand)]"
                    />
                    <span className="text-sm font-bold leading-relaxed">{r.offre.accord}</span>
                  </label>
                  {/* Les conditions complètes, ouvertes à côté pour ne pas perdre le formulaire. */}
                  <a
                    href={r.offre.conditionsHref}
                    target="_blank"
                    rel="noopener"
                    className="mt-3 inline-block text-sm font-bold text-ink underline hover:text-brand"
                  >
                    {r.offre.conditions}
                  </a>
                </Etape>
              )}

              {etape === 3 && (
                <Etape titre={r.paiement.titre} texte={r.paiement.texte}>
                  <InfoLancement t={t} compact className="mb-5" />
                  <div className="rounded-3xl bg-white p-5 md:p-6">
                    <p className="text-xs font-black uppercase tracking-widest text-ink/50">{r.paiement.recap}</p>
                    <p className="mt-2 font-display text-xl font-black">{champs.restaurant}</p>
                    <p className="text-sm text-ink/60">
                      {champs.ville} · {champs.nom} · {champs.courriel}
                    </p>
                    <dl className="mt-5 grid gap-2 border-t border-ink/10 pt-4 text-sm">
                      <Ligne nom={r.paiement.ligne} valeur={argent(PRIX)} />
                      <Ligne nom={r.paiement.tps} valeur={argent(tps)} />
                      <Ligne nom={r.paiement.tvq} valeur={argent(tvq)} />
                      <div className="mt-2 flex items-baseline justify-between border-t border-ink/10 pt-3">
                        <dt className="font-black">{r.paiement.total}</dt>
                        <dd className="font-display text-2xl font-black">{argent(total)}</dd>
                      </div>
                    </dl>
                  </div>
                  <p className="mt-4 flex items-center gap-2 text-sm text-ink/60">
                    <Lock className="size-4 shrink-0" aria-hidden="true" />
                    {r.paiement.securite}
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink/70">{t.hero.condition}</p>
                </Etape>
              )}
            </div>

            {/* Le piège à robots : invisible, hors du parcours au clavier. */}
            <input
              type="text"
              name="site"
              value={piege}
              onChange={(e) => setPiege(e.target.value)}
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
              className="absolute left-[-9999px] size-px opacity-0"
            />

            {erreur && (
              <p role="alert" className="mt-6 rounded-2xl bg-brand/10 px-4 py-3 text-sm font-bold text-brand">
                {erreur}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {etape > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setErreur(null);
                    setEtape((e) => e - 1);
                  }}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-4 font-black text-ink/70 transition hover:bg-ink/5 hover:text-ink"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  {r.precedent}
                </button>
              )}
              <button
                type="submit"
                disabled={envoi}
                className="group inline-flex flex-1 items-center justify-center gap-3 rounded-full bg-brand px-7 py-4 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-60 sm:flex-none"
              >
                {etape < 3
                  ? r.suivant
                  : envoi
                    ? r.paiement.envoi
                    : r.paiement.bouton.replace("{total}", argent(total))}
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </div>

            <LienPasPret
              libelle={t.hero.pasPret}
              className="mt-6 self-start text-sm font-bold text-ink/70 underline underline-offset-4 hover:text-brand"
            />
            <p className="mt-4 text-xs text-ink/50">
              {r.paiement.vieprivee}{" "}
              <a href={t.pied.confidentialiteHref} className="underline underline-offset-4 hover:text-brand">
                {t.pied.confidentialite}
              </a>
            </p>
          </form>
        </div>

        {/* ─── La preuve : du vrai travail ─── */}
        <aside className="relative hidden flex-col items-center justify-center gap-8 overflow-hidden bg-hero px-8 py-12 text-white lg:flex">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-white/10 blur-3xl"
          />
          <div className="relative max-w-sm text-center">
            <p className="font-display text-2xl font-black leading-tight">
              {r.apercu.titre.replace("{nom}", champs.restaurant.trim() || r.apercuDefaut)}
            </p>
            <p className="mt-2 text-white/80">{r.apercu.texte}</p>
          </div>
          <figure className="relative flex flex-col items-center gap-3">
            <DemoApp demo="client" alt={t.hero.maquette.exempleAlt} attente={t.hero.maquette.attente} className="[--demo-w:17rem]" />
            <figcaption className="text-sm font-bold text-white/70">{t.hero.maquette.exemple}</figcaption>
          </figure>
          <div className="relative w-full max-w-xs">
            <BarrePlaces modele={t.hero.places} />
          </div>
        </aside>
      </div>
      <ModalePasPret t={t} />
    </main>
  );
}

function Etape({ titre, texte, children }: { titre: string; texte: string; children: ReactNode }) {
  return (
    <>
      <h1 className="font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">{titre}</h1>
      <p className="mt-3 max-w-xl text-lg text-ink/70">{texte}</p>
      <div className="mt-8">{children}</div>
    </>
  );
}

function Groupe({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <fieldset className="mb-7">
      <legend className="mb-3 font-bold">{titre}</legend>
      {children}
    </fieldset>
  );
}

function Pastille({
  actif,
  onClick,
  children,
}: {
  actif: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3 text-sm font-bold transition ${
        actif ? "border-brand bg-white text-ink" : "border-transparent bg-white/70 text-ink/70 hover:bg-white"
      }`}
    >
      {actif && <Check className="size-4 text-brand" aria-hidden="true" />}
      {children}
    </button>
  );
}

function Champ({
  etiquette,
  valeur,
  onChange,
  type = "text",
  exemple,
  autoComplete,
  large = false,
}: {
  etiquette: string;
  valeur: string;
  onChange: (v: string) => void;
  type?: string;
  exemple?: string;
  autoComplete?: string;
  large?: boolean;
}) {
  return (
    <label className={`block ${large ? "sm:col-span-2" : ""}`}>
      <span className="text-sm font-bold text-ink/70">{etiquette}</span>
      <input
        type={type}
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        placeholder={exemple}
        autoComplete={autoComplete}
        required
        className="mt-1.5 w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3.5 text-base outline-none transition-colors placeholder:text-ink/35 focus:border-brand"
      />
    </label>
  );
}

function Ligne({ nom, valeur }: { nom: string; valeur: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-ink/70">{nom}</dt>
      <dd className="font-bold">{valeur}</dd>
    </div>
  );
}
