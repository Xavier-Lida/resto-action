"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { PARTENAIRES_REFERENTS, REFERE_UN_RESTO } from "@/lib/contenu/references";
import { PHONE_DISPLAY } from "@/lib/site";
import { formaterTelephone } from "@/lib/telephone";
import Merci from "./Merci";
import { boutonEnvoyer, champ, envoyerRefere, etiquette, piegeClasse, type Etat } from "./formulaire";

/* « JE CONNAIS UN RESTO » : n'importe qui (ami, client, fournisseur,
   comptable) nous donne le nom d'un resto. On le rappelle. */
export default function FormulairePartenaire() {
  const C = PARTENAIRES_REFERENTS.candidature;
  const [v, setV] = useState({ restoConnu: "", entreprise: "", ceQuElleVend: "", nom: "", fonction: "", courriel: "", telephone: "", restosApprox: "", regions: "" });
  const facons: string[] = [];
  const [consentement, setConsentement] = useState(false);
  const [piege, setPiege] = useState("");
  const [etat, setEtat] = useState<Etat>("idle");
  const maj = (k: keyof typeof v) => (e: { target: { value: string } }) => setV({ ...v, [k]: k === "telephone" ? formaterTelephone(e.target.value) : e.target.value });

  async function envoyer(e: FormEvent) {
    e.preventDefault();
    setEtat("envoi");
    setEtat((await envoyerRefere("partenaire", { ...v, facons, consentement, piege })) ? "fait" : "erreur");
  }

  if (etat === "fait") return <Merci texte={C.merci} />;

  /* 16 nov. : pour n'importe qui. Le resto d'abord, puis qui tu es. Le reste
     (fonction, régions, façon de référer) se demande au téléphone ; l'API
     les accepte encore, vides. */
  const champs: [keyof typeof v, string, string, boolean, boolean][] = [
    ["restoConnu", C.champs.restoConnu, "off", true, false],
    ["nom", C.champs.nom, "name", true, false],
    ["telephone", C.champs.telephone, "tel", true, false],
    ["courriel", C.champs.courriel, "email", true, false],
    ["entreprise", C.champs.entrepriseFacultative, "organization", false, false],
  ];

  return (
    <form onSubmit={envoyer} className="relative rounded-[2rem] bg-white p-6 text-ink ring-1 ring-ink/10 md:p-9">
      <div className="grid gap-4 sm:grid-cols-2">
        {champs.map(([k, libelle, auto, requis]) => (
          <label key={k} className={`${etiquette} ${k === "restoConnu" ? "sm:col-span-2" : ""}`}>
            {libelle}
            <input
              className={champ}
              required={requis}
              type={k === "courriel" ? "email" : k === "telephone" ? "tel" : "text"}
              inputMode={k === "restosApprox" ? "numeric" : undefined}
              autoComplete={auto}
              value={v[k]}
              onChange={maj(k)}
            />
          </label>
        ))}
      </div>
      <input type="text" value={piege} onChange={(e) => setPiege(e.target.value)} tabIndex={-1} aria-hidden="true" autoComplete="off" className={piegeClasse} />
      <label className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-ink/75">
        <input type="checkbox" required checked={consentement} onChange={(e) => setConsentement(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-brand" />
        {C.consentement}
      </label>
      {etat === "erreur" && <p className="mt-5 rounded-2xl bg-brand/10 p-4 text-sm font-bold text-brand" role="alert">{REFERE_UN_RESTO.presenteNous.erreur.replace("{tel}", PHONE_DISPLAY)}</p>}
      <button type="submit" disabled={etat === "envoi"} className={boutonEnvoyer}>
        {C.bouton}
        <ArrowRight className="size-5" aria-hidden="true" />
      </button>
    </form>
  );
}
