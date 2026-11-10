"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { REFERENCES, REFERENCES_EN, type Profil } from "@/lib/contenu/references";
import { lireProvenance } from "@/lib/provenance";
import { PHONE_DISPLAY } from "@/lib/site";
import { formaterTelephone } from "@/lib/telephone";

/* LE FORMULAIRE DU PROGRAMME DE RÉFÉRENCES : qui tu es, tes coordonnées, et
   un resto en tête si tu en as un. Part à /api/reference (courriel à
   l'équipe). Pensé pour le cellulaire : gros champs, une colonne. */

const champ =
  "mt-1.5 w-full rounded-2xl border-2 border-transparent bg-bone px-4 py-3.5 text-base font-bold text-ink outline-none transition focus:border-ink";
const etiquette = "block text-sm font-black text-ink/70";

export default function FormulaireReference({ langue = "fr" }: { langue?: "fr" | "en" }) {
  const R = langue === "en" ? REFERENCES_EN : REFERENCES;
  const [profil, setProfil] = useState<Profil>("resto");
  const [v, setV] = useState({ nom: "", entreprise: "", courriel: "", telephone: "", region: "", restoEnTete: "" });
  const [consentementRefere, setConsentementRefere] = useState(false);
  const [consentementContact, setConsentementContact] = useState(false);
  const [piege, setPiege] = useState("");
  const [etat, setEtat] = useState<"idle" | "envoi" | "fait" | "erreur">("idle");

  async function envoyer(e: FormEvent) {
    e.preventDefault();
    setEtat("envoi");
    try {
      const r = await fetch("/api/reference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ langue, profil, ...v, consentementRefere, consentementContact, piege, provenance: lireProvenance() }),
      });
      setEtat(r.ok ? "fait" : "erreur");
    } catch {
      setEtat("erreur");
    }
  }

  if (etat === "fait") {
    return (
      <div className="rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-ink/5 md:p-12" role="status">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-ciel text-white shadow-[0_0_0_6px_rgba(25,211,240,0.25)]">
          <Check className="size-7" aria-hidden="true" />
        </span>
        <p className="mt-6 font-display text-2xl font-black md:text-3xl">{R.merciTitre}</p>
        <p className="mx-auto mt-3 max-w-md text-ink/65">{R.merciTexte}</p>
      </div>
    );
  }

  return (
    <form onSubmit={envoyer} className="rounded-[2rem] bg-white p-6 shadow-xl shadow-ink/5 md:p-9">
      <fieldset>
        <legend className={etiquette}>{R.champs.profil}</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {R.profils.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={profil === p.id}
              onClick={() => setProfil(p.id)}
              className={`rounded-2xl px-3 py-3 text-sm font-black transition ${profil === p.id ? "bg-ink text-white" : "bg-bone text-ink/70 hover:bg-ink/10"}`}
            >
              {p.nom}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className={etiquette}>
          {R.champs.nom}
          <input className={champ} required autoComplete="name" value={v.nom} onChange={(e) => setV({ ...v, nom: e.target.value })} />
        </label>
        <label className={etiquette}>
          {R.champs.entreprise}
          <input className={champ} required autoComplete="organization" value={v.entreprise} onChange={(e) => setV({ ...v, entreprise: e.target.value })} />
        </label>
        <label className={etiquette}>
          {R.champs.courriel}
          <input className={champ} required type="email" autoComplete="email" value={v.courriel} onChange={(e) => setV({ ...v, courriel: e.target.value })} />
        </label>
        <label className={etiquette}>
          {R.champs.telephone}
          <input className={champ} required type="tel" autoComplete="tel" value={v.telephone} onChange={(e) => setV({ ...v, telephone: formaterTelephone(e.target.value) })} />
        </label>
        <label className={`${etiquette} sm:col-span-2`}>
          {R.champs.region}
          <input className={champ} autoComplete="address-level2" value={v.region} onChange={(e) => setV({ ...v, region: e.target.value })} />
        </label>
        <label className={`${etiquette} sm:col-span-2`}>
          {R.champs.restoEnTete}
          <input className={champ} placeholder={R.champs.restoEnTeteAide} value={v.restoEnTete} onChange={(e) => setV({ ...v, restoEnTete: e.target.value })} />
        </label>
      </div>

      <input type="text" value={piege} onChange={(e) => setPiege(e.target.value)} tabIndex={-1} aria-hidden="true" autoComplete="off" className="absolute left-[-9999px] size-px opacity-0" />

      <div className="mt-6 space-y-3">
        {v.restoEnTete.trim() && (
          <label className="flex items-start gap-3 text-sm leading-relaxed text-ink/75">
            <input type="checkbox" required checked={consentementRefere} onChange={(e) => setConsentementRefere(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-brand" />
            {R.consentementRefere}
          </label>
        )}
        <label className="flex items-start gap-3 text-sm leading-relaxed text-ink/75">
          <input type="checkbox" required checked={consentementContact} onChange={(e) => setConsentementContact(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-brand" />
          {R.consentementContact}
        </label>
      </div>

      {etat === "erreur" && <p className="mt-5 rounded-2xl bg-brand/10 p-4 text-sm font-bold text-brand" role="alert">{R.erreur.replace("{tel}", PHONE_DISPLAY)}</p>}

      <button
        type="submit"
        disabled={etat === "envoi"}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-60 sm:w-auto"
      >
        {R.boutonEnvoyer}
        <ArrowRight className="size-5" aria-hidden="true" />
      </button>
    </form>
  );
}
