"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { lireProvenance } from "@/lib/provenance";
import { PHONE_DISPLAY, cheminReservation } from "@/lib/site";
import { formaterTelephone } from "@/lib/telephone";
import type { Textes } from "@/lib/textes/fr";

/* LA DEMANDE DE MAQUETTE GRATUITE, PARTAGÉE.

   Deux portes y mènent : le champ « Trouve ton resto » du héro (le nom du
   resto est déjà tapé) et la fenêtre « Pas encore prêt? » (on le demande ici,
   `demanderRestaurant`). La demande part à /api/maquette, qui la pose dans
   l'agenda de Guillaume. Après l'envoi, on garde la porte de la réservation
   ouverte : la maquette sert à récupérer les hésitants, pas à remplacer la
   vente. */
export default function FormulaireMaquette({
  t,
  restaurant: restaurantInitial = "",
  demanderRestaurant = false,
  titreId,
}: {
  t: Textes;
  restaurant?: string;
  demanderRestaurant?: boolean;
  titreId: string;
}) {
  const m = t.hero.maquette;
  const [restaurant, setRestaurant] = useState(restaurantInitial);
  const [champs, setChamps] = useState({ nom: "", courriel: "", telephone: "", ville: "", menu: "" });
  const [piege, setPiege] = useState("");
  const [etat, setEtat] = useState<"formulaire" | "envoi" | "merci">("formulaire");
  const [erreur, setErreur] = useState<string | null>(null);

  const nomResto = restaurant.trim();
  const avecNom = (modele: string) => modele.replace("{nom}", nomResto);
  const reserver = `${cheminReservation(t.racine)}?resto=${encodeURIComponent(nomResto)}`;

  async function envoyer() {
    setErreur(null);
    if (
      !nomResto ||
      !champs.nom.trim() ||
      !champs.ville.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(champs.courriel.trim()) ||
      champs.telephone.replace(/\D/g, "").length < 10
    ) {
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
        code === "invalide"
          ? m.erreurs.invalide
          : code === "trop"
            ? m.erreurs.trop
            : m.erreurs.autre.replace("{tel}", PHONE_DISPLAY),
      );
    } catch {
      setErreur(m.erreurs.autre.replace("{tel}", PHONE_DISPLAY));
    }
    setEtat("formulaire");
  }

  if (etat === "merci") {
    return (
      <div className="calc-entre">
        <span className="grid size-14 place-items-center rounded-full bg-brand text-white">
          <Check className="size-7" aria-hidden="true" />
        </span>
        <h2 id={titreId} className="mt-6 font-display text-3xl font-black leading-tight tracking-tight md:text-4xl">
          {m.merciTitre.replace("{prenom}", champs.nom.trim().split(" ")[0])}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-ink/70">
          {avecNom(m.merciTexte).replace("{courriel}", champs.courriel.trim())}
        </p>
        <a
          href={reserver}
          className="group mt-8 inline-flex items-center gap-3 rounded-full bg-brand px-7 py-4 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
        >
          {m.merciReserver}
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </a>
        <p className="mt-3 text-sm text-ink/50">{t.hero.condition}</p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void envoyer();
      }}
      className="relative"
    >
      <h2 id={titreId} className="pr-10 font-display text-3xl font-black leading-tight tracking-tight md:text-4xl">
        {nomResto && !demanderRestaurant ? avecNom(m.titre) : m.titreGenerique}
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
        {demanderRestaurant && (
          <Champ etiquette={m.restaurant} valeur={restaurant} autoComplete="organization" onChange={setRestaurant} />
        )}
        <Champ etiquette={m.nom} valeur={champs.nom} autoComplete="name" onChange={(v) => setChamps({ ...champs, nom: v })} />
        <Champ
          etiquette={m.courriel}
          type="email"
          valeur={champs.courriel}
          autoComplete="email"
          onChange={(v) => setChamps({ ...champs, courriel: v })}
        />
        <Champ
          etiquette={m.cell}
          type="tel"
          valeur={champs.telephone}
          autoComplete="tel"
          onChange={(v) => setChamps({ ...champs, telephone: formaterTelephone(v) })}
        />
        <Champ
          etiquette={m.ville}
          valeur={champs.ville}
          autoComplete="address-level2"
          onChange={(v) => setChamps({ ...champs, ville: v })}
        />
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
        <a href={reserver} className="font-bold text-ink underline underline-offset-4 hover:text-brand">
          {m.reserver}
        </a>
      </p>
      <p className="mt-2 text-xs text-ink/50">
        {m.vieprivee}{" "}
        <a href={t.pied.confidentialiteHref} className="underline underline-offset-4 hover:text-brand">
          {t.pied.confidentialite}
        </a>
      </p>
    </form>
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
