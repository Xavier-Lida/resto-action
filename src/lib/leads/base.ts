import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { rangeeDeLead, type Enregistrement, type Lead, type ReferentFiche } from "./lead";

/* LA BASE DES LEADS (Supabase, Postgres, région Canada). 18 nov. 2026.

   LE SEUL FICHIER DU SITE QUI LIT LA CLÉ SECRÈTE. Tout ce qui touche la base
   passe par ici. Le schéma est dans supabase/schema.sql.

   SERVEUR SEULEMENT. La base ne se lit jamais du navigateur : les 2 variables
   n'ont pas le préfixe NEXT_PUBLIC_, donc elles n'existent pas dans le paquet
   du navigateur, et la sécurité par rangée (sans aucune règle) ferme tout à la
   clé publique.

     SUPABASE_URL          l'adresse du projet (https://xxxx.supabase.co)
     SUPABASE_CLE_SECRETE  la clé secrète (sb_secret_…), jamais la clé publique

   Guillaume les pose lui-même dans .env.local et dans Vercel.

   RIEN ICI NE LÈVE pour l'entrée d'un lead : une base en panne ne doit jamais
   empêcher l'alerte par courriel de partir (src/lib/leads/envoi.ts). */

const DELAI_MS = 8_000;

let client: SupabaseClient | null | undefined;

/** Le client de la base, ou `null` si les 2 variables ne sont pas posées. */
export function base(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.SUPABASE_URL;
  const cle = process.env.SUPABASE_CLE_SECRETE;
  if (!url || !cle) {
    client = null;
    return client;
  }
  client = createClient(url, cle, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      // Jamais de cache, et un délai : une base muette ne retient pas le visiteur.
      fetch: (entree, init) => fetch(entree, { ...init, cache: "no-store", signal: init?.signal ?? AbortSignal.timeout(DELAI_MS) }),
    },
  });
  return client;
}

/** Vrai si les 2 variables de la base sont posées. */
export function baseBranchee(): boolean {
  return base() !== null;
}

/* Range un lead : trouve ou crée la fiche, ajoute l'événement au journal, en
   une seule transaction (la fonction `enregistrer_lead`). `null` si la base
   n'a pas répondu : la raison est au journal du serveur, sans donnée du lead. */
export async function enregistrerLead(lead: Lead, referent: ReferentFiche | null): Promise<Enregistrement | null> {
  const b = base();
  if (!b) {
    // Pas une panne : le CRM se branche plus tard, l'alerte par courriel fait le travail.
    return null;
  }
  try {
    const { data, error } = await b.rpc("enregistrer_lead", { p: rangeeDeLead(lead, referent) });
    if (error) {
      console.error("[leads] base refusée :", error.code ?? "", error.message, lead.source, lead.id);
      return null;
    }
    const r = data as { lead_id?: unknown; existait?: unknown; depuis?: unknown; deja_recu?: unknown; ne_plus_texter?: unknown } | null;
    if (!r || typeof r.lead_id !== "string") {
      console.error("[leads] réponse de la base illisible :", lead.source, lead.id);
      return null;
    }
    return {
      leadId: r.lead_id,
      existait: r.existait === true,
      depuis: typeof r.depuis === "string" ? r.depuis : null,
      dejaRecu: r.deja_recu === true,
      nePlusTexter: r.ne_plus_texter === true,
    };
  } catch (erreur) {
    // Ni le lead ni la clé dans les journaux : seulement la nature de la panne.
    console.error("[leads] base injoignable :", erreur instanceof Error ? erreur.name : "erreur inconnue", lead.source, lead.id);
    return null;
  }
}
