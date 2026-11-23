"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { mettreAJour, supprimerLead } from "@/lib/mini-crm/carnet";
import { enteteEquipe } from "@/lib/studio/acces";

/* LE MINI CRM : les 2 gestes du tableau (/tableau/leads).

   Ces fonctions tournent sur le serveur. La page est déjà derrière le mot de
   passe du tableau (src/proxy.ts), mais une action de formulaire est une
   adresse comme une autre : le mot de passe est REVÉRIFIÉ ici, à chaque appel.
   Rien n'est écrit sans lui. */

async function equipe(): Promise<boolean> {
  return enteteEquipe((await headers()).get("authorization"));
}

/** Change le statut et la note d'un contact. */
export async function suivreLead(formulaire: FormData): Promise<void> {
  if (!(await equipe())) return;
  const cle = String(formulaire.get("cle") ?? "");
  await mettreAJour(cle, formulaire.get("statut"), formulaire.get("note"));
  revalidatePath("/tableau/leads");
}

/** Supprime la fiche d'un contact (ses photos, elles, s'effacent toutes seules après la durée de garde). */
export async function retirerLead(formulaire: FormData): Promise<void> {
  if (!(await equipe())) return;
  // La case « oui, supprime » doit être cochée : un bouton seul serait trop facile à toucher sur un cell.
  if (formulaire.get("confirme") !== "oui") return;
  await supprimerLead(String(formulaire.get("cle") ?? ""));
  revalidatePath("/tableau/leads");
}
