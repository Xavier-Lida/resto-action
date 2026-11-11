"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { REFERE_UN_RESTO } from "@/lib/contenu/references";
import { PHONE_DISPLAY } from "@/lib/site";
import { formaterTelephone } from "@/lib/telephone";
import Merci from "./Merci";
import { boutonEnvoyer, champ, envoyerRefere, etiquette, piegeClasse, type Etat } from "./formulaire";

/* « PRÉSENTE-NOUS QUELQU'UN » : qui présente, le resto présenté, et la case
   de consentement obligatoire (son texte exact est recopié par le serveur).
   `representant` : la version mobile des représentants d'un fournisseur
   (étape 6), avec le champ « Ton nom (représentant) ». */
export default function FormulairePresente({ representant = false, code = "" }: { representant?: boolean; code?: string }) {
  const P = REFERE_UN_RESTO.presenteNous;
  const [v, setV] = useState({
    toiNom: "", toiEntreprise: "", toiCourriel: "", toiTelephone: "", toiCode: code,
    restoNom: "", prenom: "", nom: "", telephone: "", courriel: "", ville: "", representant: "",
  });
  const [consentement, setConsentement] = useState(false);
  const [piege, setPiege] = useState("");
  const [etat, setEtat] = useState<Etat | "manque">("idle");
  const maj = (k: keyof typeof v, tel = false) => (e: { target: { value: string } }) =>
    setV({ ...v, [k]: tel ? formaterTelephone(e.target.value) : e.target.value });

  async function envoyer(e: FormEvent) {
    e.preventDefault();
    // Un moyen de contact de chaque côté : le téléphone ou le courriel.
    if ((!v.toiCourriel.trim() && !v.toiTelephone.trim()) || (!v.courriel.trim() && !v.telephone.trim())) {
      setEtat("manque");
      return;
    }
    setEtat("envoi");
    setEtat((await envoyerRefere("presente", { ...v, consentement, piege })) ? "fait" : "erreur");
  }

  if (etat === "fait") return <Merci texte={P.merci} />;

  return (
    <form onSubmit={envoyer} className="relative rounded-[2rem] bg-white p-6 shadow-xl shadow-ink/5 md:p-9">
      <p className="text-xs font-black uppercase tracking-widest text-ink/50">{P.toiTitre}</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {representant && (
          <label className={`${etiquette} sm:col-span-2`}>
            {P.champs.representant}
            <input className={champ} required autoComplete="name" value={v.representant} onChange={maj("representant")} />
          </label>
        )}
        <label className={etiquette}>
          {P.toi.nom}
          <input className={champ} required autoComplete="name" value={v.toiNom} onChange={maj("toiNom")} />
        </label>
        <label className={etiquette}>
          {P.toi.entreprise}
          <input className={champ} required autoComplete="organization" value={v.toiEntreprise} onChange={maj("toiEntreprise")} />
        </label>
        <label className={etiquette}>
          {P.toi.courriel}
          <input className={champ} type="email" autoComplete="email" value={v.toiCourriel} onChange={maj("toiCourriel")} />
        </label>
        <label className={etiquette}>
          {P.toi.telephone}
          <input className={champ} type="tel" autoComplete="tel" value={v.toiTelephone} onChange={maj("toiTelephone", true)} />
        </label>
        {!representant && (
          <label className={`${etiquette} sm:col-span-2`}>
            {P.toi.code}
            <input className={`${champ} uppercase`} autoCapitalize="characters" autoComplete="off" value={v.toiCode} onChange={maj("toiCode")} />
          </label>
        )}
      </div>

      <p className="mt-8 text-xs font-black uppercase tracking-widest text-ink/50">{P.luiTitre}</p>
      <p className="mt-1 text-sm text-ink/60">{P.aide}</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <label className={`${etiquette} sm:col-span-2`}>
          {P.champs.restoNom}
          <input className={champ} required value={v.restoNom} onChange={maj("restoNom")} />
        </label>
        <label className={etiquette}>
          {P.champs.prenom}
          <input className={champ} value={v.prenom} onChange={maj("prenom")} />
        </label>
        <label className={etiquette}>
          {P.champs.nom}
          <input className={champ} value={v.nom} onChange={maj("nom")} />
        </label>
        <label className={etiquette}>
          {P.champs.telephone}
          <input className={champ} type="tel" value={v.telephone} onChange={maj("telephone", true)} />
        </label>
        <label className={etiquette}>
          {P.champs.courriel}
          <input className={champ} type="email" value={v.courriel} onChange={maj("courriel")} />
        </label>
        <label className={`${etiquette} sm:col-span-2`}>
          {P.champs.ville}
          <input className={champ} value={v.ville} onChange={maj("ville")} />
        </label>
      </div>

      <input type="text" value={piege} onChange={(e) => setPiege(e.target.value)} tabIndex={-1} aria-hidden="true" autoComplete="off" className={piegeClasse} />

      <label className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-ink/75">
        <input type="checkbox" required checked={consentement} onChange={(e) => setConsentement(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-brand" />
        {P.consentement}
      </label>

      {etat === "manque" && <p className="mt-5 rounded-2xl bg-brand/10 p-4 text-sm font-bold text-brand" role="alert">{P.aide}</p>}
      {etat === "erreur" && <p className="mt-5 rounded-2xl bg-brand/10 p-4 text-sm font-bold text-brand" role="alert">{P.erreur.replace("{tel}", PHONE_DISPLAY)}</p>}

      <button type="submit" disabled={etat === "envoi"} className={boutonEnvoyer}>
        {P.bouton}
        <ArrowRight className="size-5" aria-hidden="true" />
      </button>
    </form>
  );
}
