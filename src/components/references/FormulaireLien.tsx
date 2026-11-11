"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { REFERE_UN_RESTO } from "@/lib/contenu/references";
import { PHONE_DISPLAY } from "@/lib/site";
import { formaterTelephone } from "@/lib/telephone";
import Merci from "./Merci";
import { boutonEnvoyer, champ, envoyerRefere, etiquette, piegeClasse, type Etat } from "./formulaire";

/* « JE VEUX MON LIEN » : un resto client demande son lien. L'équipe vérifie
   son dossier et lui envoie son lien par courriel (mode pilote). */
export default function FormulaireLien() {
  const L = REFERE_UN_RESTO.monLien;
  const [v, setV] = useState({ nom: "", resto: "", courriel: "", telephone: "" });
  const [piege, setPiege] = useState("");
  const [etat, setEtat] = useState<Etat>("idle");

  async function envoyer(e: FormEvent) {
    e.preventDefault();
    setEtat("envoi");
    setEtat((await envoyerRefere("lien", { ...v, piege })) ? "fait" : "erreur");
  }

  if (etat === "fait") return <Merci texte={L.merci} />;

  return (
    <form onSubmit={envoyer} className="relative rounded-[2rem] bg-white p-6 shadow-xl shadow-ink/5 md:p-9">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={etiquette}>
          {L.champs.nom}
          <input className={champ} required autoComplete="name" value={v.nom} onChange={(e) => setV({ ...v, nom: e.target.value })} />
        </label>
        <label className={etiquette}>
          {L.champs.resto}
          <input className={champ} required autoComplete="organization" value={v.resto} onChange={(e) => setV({ ...v, resto: e.target.value })} />
        </label>
        <label className={etiquette}>
          {L.champs.courriel}
          <input className={champ} required type="email" autoComplete="email" value={v.courriel} onChange={(e) => setV({ ...v, courriel: e.target.value })} />
        </label>
        <label className={etiquette}>
          {L.champs.telephone}
          <input className={champ} type="tel" autoComplete="tel" value={v.telephone} onChange={(e) => setV({ ...v, telephone: formaterTelephone(e.target.value) })} />
        </label>
      </div>
      <input type="text" value={piege} onChange={(e) => setPiege(e.target.value)} tabIndex={-1} aria-hidden="true" autoComplete="off" className={piegeClasse} />
      {etat === "erreur" && <p className="mt-5 rounded-2xl bg-brand/10 p-4 text-sm font-bold text-brand" role="alert">{REFERE_UN_RESTO.presenteNous.erreur.replace("{tel}", PHONE_DISPLAY)}</p>}
      <button type="submit" disabled={etat === "envoi"} className={boutonEnvoyer}>
        {L.bouton}
        <ArrowRight className="size-5" aria-hidden="true" />
      </button>
    </form>
  );
}
