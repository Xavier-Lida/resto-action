import { createHmac, timingSafeEqual } from "node:crypto";

/* STRIPE, SANS LA LIBRAIRIE.

   Le site ne fait que trois choses avec Stripe : ouvrir une page de paiement
   (Checkout), relire une session pour la page de remerciement, et vérifier la
   signature des avis que Stripe nous envoie (webhook). Trois appels HTTP et
   un HMAC : la librairie officielle ajouterait une dépendance (et un
   package-lock à garder synchro) pour bien peu. Si on en vient aux
   abonnements ou aux remboursements automatiques, on la prendra.

   SERVEUR SEULEMENT. La clé secrète ne doit jamais atteindre le navigateur :
   ce module n'est importé que par des routes d'API et des pages serveur.

   LES VARIABLES (voir .env.example) :
     STRIPE_CLE_SECRETE      sk_live_… (ou sk_test_… pour essayer)
     STRIPE_WEBHOOK_SECRET   whsec_…, donné par Stripe à la création du webhook
     STRIPE_TAXE_TPS         txr_…, le taux TPS 5 % créé dans Stripe
     STRIPE_TAXE_TVQ         txr_…, le taux TVQ 9,975 % créé dans Stripe */

const API = "https://api.stripe.com/v1";
// La version d'API est figée : un changement de format chez Stripe ne doit
// pas casser le paiement un matin sans qu'on ait rien touché.
const VERSION = "2025-06-30.basil";

export class ErreurStripe extends Error {
  code: "config" | "stripe";
  constructor(code: "config" | "stripe", message: string) {
    super(message);
    this.code = code;
  }
}

/* Stripe parle en formulaire encodé, avec des crochets pour les objets :
   { line_items: [{ quantity: 1 }] } devient line_items[0][quantity]=1. */
type Valeur = string | number | boolean | null | undefined | Valeur[] | { [cle: string]: Valeur };

function aplatir(objet: Valeur, prefixe: string, sortie: URLSearchParams): void {
  if (objet === null || objet === undefined) return;
  if (Array.isArray(objet)) {
    objet.forEach((v, i) => aplatir(v, `${prefixe}[${i}]`, sortie));
  } else if (typeof objet === "object") {
    for (const [cle, v] of Object.entries(objet)) {
      aplatir(v, prefixe ? `${prefixe}[${cle}]` : cle, sortie);
    }
  } else {
    sortie.append(prefixe, String(objet));
  }
}

async function appeler<T>(
  methode: "GET" | "POST",
  chemin: string,
  corps?: { [cle: string]: Valeur },
): Promise<T> {
  const cle = process.env.STRIPE_CLE_SECRETE;
  if (!cle) throw new ErreurStripe("config", "STRIPE_CLE_SECRETE manquante");

  const params = new URLSearchParams();
  if (corps) aplatir(corps, "", params);

  const reponse = await fetch(`${API}${chemin}`, {
    method: methode,
    headers: {
      Authorization: `Bearer ${cle}`,
      "Stripe-Version": VERSION,
      ...(methode === "POST" && {
        "Content-Type": "application/x-www-form-urlencoded",
      }),
    },
    body: methode === "POST" ? params : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });

  const donnees = (await reponse.json()) as T & { error?: { message?: string } };
  if (!reponse.ok) {
    // Le message de Stripe va dans les journaux, jamais au visiteur.
    throw new ErreurStripe("stripe", donnees.error?.message ?? `HTTP ${reponse.status}`);
  }
  return donnees;
}

/* ─── La réservation fondateur ─── */

/** 500 $ en cents. Le prix fondateur, avant taxes. */
export const MONTANT_FONDATEUR = 50_000;

export type SessionCheckout = {
  id: string;
  url: string | null;
  status: "open" | "complete" | "expired";
  payment_status: "paid" | "unpaid" | "no_payment_required";
  amount_total: number | null;
  currency: string;
  customer_details: { email: string | null; name: string | null } | null;
  metadata: Record<string, string>;
};

export type DonneesFondateur = {
  restaurant: string;
  ville: string;
  nom: string;
  courriel: string;
  telephone: string;
  /** Le lien du menu ou du site, pour monter l'app. */
  menu: string;
  service: string;
  plateformes: string;
  commandes: string;
  langue: "fr" | "en";
  source: string;
};

export async function creerSessionFondateur(
  d: DonneesFondateur,
  origine: string,
): Promise<SessionCheckout> {
  const tps = process.env.STRIPE_TAXE_TPS;
  const tvq = process.env.STRIPE_TAXE_TVQ;
  /* Sans les deux taux, on refuse d'encaisser : facturer 500 $ sans TPS ni
     TVQ, c'est payer les taxes de notre poche. */
  if (!tps || !tvq) {
    throw new ErreurStripe("config", "STRIPE_TAXE_TPS ou STRIPE_TAXE_TVQ manquante");
  }

  const fr = d.langue === "fr";
  const chemin = fr ? "/reserver" : "/en/reserve";
  // Les métadonnées suivent le paiement jusque dans le tableau de bord Stripe
  // et dans l'avis envoyé au webhook. Stripe borne chaque valeur à 500 car.
  const metadata = {
    type: "fondateur",
    restaurant: d.restaurant,
    ville: d.ville,
    nom: d.nom,
    telephone: d.telephone,
    menu: d.menu,
    service: d.service,
    plateformes: d.plateformes,
    commandes: d.commandes,
    langue: d.langue,
    source: d.source,
  };

  return appeler<SessionCheckout>("POST", "/checkout/sessions", {
    mode: "payment",
    locale: fr ? "fr-CA" : "en",
    customer_email: d.courriel,
    customer_creation: "always",
    billing_address_collection: "required",
    line_items: [
      {
        quantity: 1,
        tax_rates: [tps, tvq],
        price_data: {
          currency: "cad",
          unit_amount: MONTANT_FONDATEUR,
          product_data: {
            name: fr
              ? `Place fondateur Resto Action · ${d.restaurant}`
              : `Resto Action founding spot · ${d.restaurant}`,
            description: fr
              ? "Pré-réservation au prix fondateur. Mise en service après validation des tests, date à confirmer. Remboursable sur demande écrite jusqu'à la mise en ligne."
              : "Pre-launch reservation at the founder price. Activation after successful testing, date to be confirmed. Refundable on written request until your app goes live.",
          },
        },
      },
    ],
    /* Une vraie facture, avec nos numéros de TPS et de TVQ (à inscrire dans
       Stripe → Paramètres → Facturation) : le resto en a besoin pour réclamer
       ses crédits de taxe. */
    invoice_creation: {
      enabled: true,
      invoice_data: { metadata },
    },
    payment_intent_data: {
      description: `Place fondateur · ${d.restaurant} (${d.ville})`,
      metadata,
    },
    metadata,
    custom_text: {
      submit: {
        message: fr
          ? "Pré-lancement avec deux restaurants partenaires : tests à valider et date de mise en service à confirmer. Aucun abonnement pendant l'attente. 500 $ remboursables sur demande écrite jusqu'à la mise en ligne. On te contacte dans les 24 h pour la suite."
          : "Pre-launch with two restaurant partners: testing must be validated and your launch date confirmed. No subscription while you wait. $500 refundable on written request until your app goes live. We'll reach out within 24 hours.",
      },
    },
    success_url: `${origine}${chemin}/${fr ? "merci" : "thanks"}?session={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origine}${chemin}?annule=1`,
  });
}

export async function lireSession(id: string): Promise<SessionCheckout | null> {
  // Un identifiant de session a toujours cette forme : on ne relaie rien d'autre.
  if (!/^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(id)) return null;
  try {
    return await appeler<SessionCheckout>("GET", `/checkout/sessions/${id}`);
  } catch (erreur) {
    console.error("[stripe] session illisible :", erreur instanceof Error ? erreur.message : erreur);
    return null;
  }
}

/* ─── Le dossier du resto (page /dossier/[session]) ───

   Le suivi d'un resto fondateur vit dans les MÉTADONNÉES DE SON CLIENT STRIPE,
   modifiables à la main dans le tableau de bord Stripe (Clients → le resto →
   Métadonnées → Modifier). Aucune base de données de plus. Les clés :
     etape           1 à 7, le nombre d'étapes terminées (voir les textes
                     reservation.dossier.etapes) ; 1 = place réservée
     date_lancement  texte libre, ex. « 18 novembre 2026 »
     prochain_point  texte libre, ex. « Jeudi 16 oct., 10 h »
     message         un mot de l'équipe, affiché tel quel
     mis_a_jour      texte libre, ex. « 9 oct. 2026 »

   La clé Stripe du site doit pouvoir LIRE les clients (permission
   « Customers : Lecture » sur la clé limitée). */
export type DossierFondateur = {
  restaurant: string;
  ville: string;
  etape: number;
  dateLancement: string | null;
  prochainPoint: string | null;
  message: string | null;
  misAJour: string | null;
};

type SessionAvecClient = SessionCheckout & {
  customer: { metadata?: Record<string, string> } | string | null;
};

export async function lireDossier(id: string): Promise<DossierFondateur | null> {
  if (!/^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(id)) return null;
  try {
    const s = await appeler<SessionAvecClient>("GET", `/checkout/sessions/${id}?expand[]=customer`);
    if (s.payment_status !== "paid" || s.metadata?.type !== "fondateur") return null;
    const meta = typeof s.customer === "object" && s.customer ? (s.customer.metadata ?? {}) : {};
    const texte = (cle: string) => (meta[cle]?.trim() ? meta[cle].trim().slice(0, 500) : null);
    const etape = Math.min(7, Math.max(1, Number.parseInt(meta.etape ?? "1", 10) || 1));
    return {
      restaurant: s.metadata.restaurant ?? "",
      ville: s.metadata.ville ?? "",
      etape,
      dateLancement: texte("date_lancement"),
      prochainPoint: texte("prochain_point"),
      message: texte("message"),
      misAJour: texte("mis_a_jour"),
    };
  } catch (erreur) {
    console.error("[stripe] dossier illisible :", erreur instanceof Error ? erreur.message : erreur);
    return null;
  }
}

/* ─── La signature des webhooks ───

   L'en-tête Stripe-Signature ressemble à « t=1700000000,v1=abc…,v1=def… ».
   On recalcule HMAC-SHA256(secret, `${t}.${corps brut}`) et on le compare à
   chaque v1, en temps constant. On refuse un avis vieux de plus de 5 minutes :
   sinon, un avis intercepté pourrait être rejoué indéfiniment. */
export function signatureValide(
  corps: string,
  entete: string | null,
  secret: string,
  maintenant = Date.now(),
): boolean {
  if (!entete) return false;
  const morceaux = entete.split(",").map((m) => m.split("=") as [string, string]);
  const t = morceaux.find(([k]) => k === "t")?.[1];
  const signatures = morceaux.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!t || signatures.length === 0) return false;
  if (Math.abs(maintenant / 1000 - Number(t)) > 300) return false;

  const attendue = createHmac("sha256", secret).update(`${t}.${corps}`).digest();
  return signatures.some((s) => {
    const recue = Buffer.from(s, "hex");
    return recue.length === attendue.length && timingSafeEqual(recue, attendue);
  });
}
