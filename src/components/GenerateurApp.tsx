"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Search, X } from "lucide-react";
import DemoApp from "@/components/DemoApp";
import { lireProvenance } from "@/lib/provenance";
import { PHONE_DISPLAY, cheminReservation } from "@/lib/site";
import { formaterTelephone } from "@/lib/telephone";
import type { Textes } from "@/lib/textes/fr";

/* « TROUVE TON RESTO » → UNE MAQUETTE FAITE À LA MAIN, EN 24 H.

   Avant, le champ générait une app d'exemple : des photos de banque, un menu
   inventé. Ça disait « modèle », alors qu'on vend du sur mesure, fait par du
   monde d'ici. Maintenant, le resto tape son nom et la fenêtre lui montre :
     à droite, la VRAIE app qu'on a bâtie pour Bistro Habibi (la preuve) ;
     à gauche, l'offre : SA maquette, avec son logo, son menu et ses photos,
     gratuite, par texto d'ici 24 h. Nom, cell, ville, lien du menu.

   La demande tombe dans l'agenda de Guillaume (/api/maquette), et c'est en
   livrant la maquette qu'on close. Celui qui est déjà décidé a toujours le
   lien direct vers la réservation fondateur. */

type Etat = "ferme" | "formulaire" | "envoi" | "merci";

export default function GenerateurApp({ t }: { t: Textes }) {
  const m = t.hero.maquette;
  const [restaurant, setRestaurant] = useState("");
  const [etat, setEtat] = useState<Etat>("ferme");
  const [champs, setChamps] = useState({ nom: "", telephone: "", ville: "", menu: "" });
  const [piege, setPiege] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const fermer = useRef<HTMLButtonElement>(null);
  const ouvert = etat !== "ferme";

  useEffect(() => {
    if (!ouvert) return;
    fermer.current?.focus();
    const echap = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEtat("ferme");
    };
    window.addEventListener("keydown", echap);
    return () => window.removeEventListener("keydown", echap);
  }, [ouvert]);

  const nomResto = restaurant.trim();
  const avecNom = (modele: string) => modele.replace("{nom}", nomResto);
  const base = cheminReservation(t.racine);
  const reserver = `${base}?resto=${encodeURIComponent(nomResto)}`;

  async function envoyer() {
    setErreur(null);
    if (!champs.nom.trim() || !champs.ville.trim() || champs.telephone.replace(/\D/g, "").length < 10) {
      setErreur(m.erreurs.invalide);
      return;
    }
    setEtat("envoi");
    try {
      const reponse = await fetch("/api/maquette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant: nomResto,
          ...champs,
          piege,
          langue: t.htmlLang.startsWith("en") ? "en" : "fr",
          provenance: lireProvenance() ?? undefined,
        }),
      });
      if (reponse.ok) {
        setEtat("merci");
        return;
      }
      const { erreur: code } = (await reponse.json().catch(() => ({}))) as { erreur?: string };
      setErreur(
        code === "invalide" ? m.erreurs.invalide : code === "trop" ? m.erreurs.trop : m.erreurs.autre.replace("{tel}", PHONE_DISPLAY),
      );
    } catch {
      setErreur(m.erreurs.autre.replace("{tel}", PHONE_DISPLAY));
    }
    setEtat("formulaire");
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (nomResto) setEtat(etat === "merci" ? "merci" : "formulaire");
        }}
        className="animate-hero delay-2 flex max-w-xl flex-wrap gap-2 rounded-2xl bg-white p-2"
      >
        <label htmlFor="hero-resto" className="sr-only">
          {t.hero.recherche.libelle}
        </label>
        <input
          id="hero-resto"
          name="resto"
          type="text"
          autoComplete="organization"
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
          placeholder={t.hero.recherche.exemple}
          className="min-w-0 flex-1 basis-56 bg-transparent px-3 py-3 text-base text-ink outline-none placeholder:text-ink/50"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-black text-white transition hover:bg-ink active:scale-95"
        >
          <Search className="size-4" aria-hidden="true" />
          {t.hero.recherche.bouton}
        </button>
      </form>

      {etat !== "ferme" && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm md:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="maquette-titre"
            className="calc-entre relative grid w-full max-w-5xl items-center gap-8 rounded-[2rem] bg-white p-6 text-ink shadow-2xl md:grid-cols-[minmax(0,1fr)_auto] md:gap-12 md:p-10"
          >
            <button
              ref={fermer}
              type="button"
              onClick={() => setEtat("ferme")}
              aria-label={t.hero.generateur.fermer}
              className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-bone transition hover:bg-ink hover:text-white"
            >
              <X className="size-5" />
            </button>

            {etat === "merci" ? (
              <div className="calc-entre">
                <span className="grid size-14 place-items-center rounded-full bg-brand text-white">
                  <Check className="size-7" aria-hidden="true" />
                </span>
                <h2 id="maquette-titre" className="mt-6 font-display text-3xl font-black leading-tight tracking-tight md:text-4xl">
                  {m.merciTitre.replace("{prenom}", champs.nom.trim().split(" ")[0])}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-ink/70">{avecNom(m.merciTexte)}</p>
                <a
                  href={reserver}
                  className="group mt-8 inline-flex items-center gap-3 rounded-full bg-brand px-7 py-4 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                >
                  {m.merciReserver}
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </a>
                <p className="mt-3 text-sm text-ink/50">{t.hero.condition}</p>
              </div>
            ) : (
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  void envoyer();
                }}
                className="relative"
              >
                <h2 id="maquette-titre" className="pr-10 font-display text-3xl font-black leading-tight tracking-tight md:text-4xl">
                  {avecNom(m.titre)}
                </h2>
                <p className="mt-4 leading-relaxed text-ink/70">{m.texte}</p>
                <ul className="mt-5 grid list-none gap-2">
                  {m.inclus.map((chose) => (
                    <li key={chose} className="flex items-center gap-2.5 font-bold">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-white">
                        <Check className="size-3.5" aria-hidden="true" />
                      </span>
                      {chose}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  <Champ etiquette={m.nom} valeur={champs.nom} autoComplete="name" onChange={(v) => setChamps({ ...champs, nom: v })} />
                  <Champ
                    etiquette={m.cell}
                    type="tel"
                    valeur={champs.telephone}
                    autoComplete="tel"
                    onChange={(v) => setChamps({ ...champs, telephone: formaterTelephone(v) })}
                  />
                  <Champ etiquette={m.ville} valeur={champs.ville} autoComplete="address-level2" onChange={(v) => setChamps({ ...champs, ville: v })} />
                  <Champ
                    etiquette={`${m.menu} (${m.facultatif})`}
                    type="url"
                    valeur={champs.menu}
                    onChange={(v) => setChamps({ ...champs, menu: v })}
                  />
                </div>

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
                  <p role="alert" className="mt-4 rounded-2xl bg-brand/10 px-4 py-3 text-sm font-bold text-brand">
                    {erreur}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={etat === "envoi"}
                  className="group mt-5 inline-flex w-full items-center justify-center gap-3 rounded-full bg-brand px-7 py-4 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-60"
                >
                  {etat === "envoi" ? m.envoi : m.bouton}
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </button>
                <p className="mt-4 text-sm text-ink/60">
                  {m.decide}{" "}
                  <Link href={reserver} className="font-bold text-ink underline underline-offset-4 hover:text-brand">
                    {m.reserver}
                  </Link>
                </p>
              </form>
            )}

            {/* LA PREUVE : la vraie app de Bistro Habibi, qui défile. */}
            <figure className="mx-auto flex flex-col items-center gap-3">
              <DemoApp demo="client" alt={m.exempleAlt} attente={m.attente} className="[--demo-w:15rem] md:[--demo-w:17rem]" />
              <figcaption className="text-sm font-bold text-ink/60">{m.exemple}</figcaption>
            </figure>
          </div>
        </div>
      )}
    </>
  );
}

function Champ({
  etiquette,
  valeur,
  onChange,
  type = "text",
  autoComplete,
}: {
  etiquette: string;
  valeur: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-ink/70">{etiquette}</span>
      <input
        type={type}
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="mt-1 w-full rounded-xl border-2 border-bone bg-white px-3.5 py-3 text-base outline-none transition-colors focus:border-brand"
      />
    </label>
  );
}
