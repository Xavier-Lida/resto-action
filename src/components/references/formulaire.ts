import { lireProvenance } from "@/lib/provenance";

/* Ce que les trois formulaires de /refere-un-resto partagent : le style des
   champs (le même que le formulaire de références et du calculateur) et
   l'envoi à /api/refere-un-resto. */

export const champ =
  "mt-1.5 w-full rounded-2xl border-2 border-transparent bg-bone px-4 py-3.5 text-base font-bold text-ink outline-none transition focus:border-ink";
export const etiquette = "block text-sm font-black text-ink/70";
export const boutonEnvoyer =
  "mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-60 sm:w-auto";
export const piegeClasse = "absolute left-[-9999px] size-px opacity-0";

export type Etat = "idle" | "envoi" | "fait" | "erreur";

export async function envoyerRefere(action: "presente" | "lien" | "partenaire", donnees: Record<string, unknown>): Promise<boolean> {
  try {
    const r = await fetch("/api/refere-un-resto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, langue: "fr", ...donnees, provenance: lireProvenance() }),
    });
    return r.ok;
  } catch {
    return false;
  }
}
