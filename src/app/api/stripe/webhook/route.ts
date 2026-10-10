import { after, type NextRequest } from "next/server";
import { signalerFondateur } from "@/lib/crm";
import { courrielAvancement, courrielBienvenue, lienDossier, type Langue } from "@/lib/courriels-fondateur";
import { envoyerCourriel, type Courriel } from "@/lib/google/courriel";
import { sessionFondateurDuClient, signatureValide, type SessionCheckout } from "@/lib/stripe";

/* LES AVIS DE STRIPE.

   Stripe appelle cette adresse quand un paiement aboutit. C'est LA source de
   vérité d'une place fondateur payée : la page de remerciement, elle, peut ne
   jamais s'afficher (onglet fermé, réseau coupé).

   À configurer dans Stripe → Développeurs → Webhooks :
     adresse  https://www.restoaction.ca/api/stripe/webhook
     événements  checkout.session.completed ET customer.updated
   puis copier le « secret de signature » (whsec_…) dans STRIPE_WEBHOOK_SECRET.

   checkout.session.completed : on prévient le CRM et on envoie au resto le
   courriel de bienvenue avec le lien de son dossier.
   customer.updated : si etape, prochain_point, date_lancement ou message ont
   changé dans les métadonnées du client, on lui écrit que son dossier avance.
   Mettre avis = non dans ses métadonnées coupe ces courriels d'avancement.

   On répond 200 vite, à tout avis bien signé, même ceux qu'on ignore : sinon
   Stripe réessaie pendant trois jours. Les courriels partent après la réponse. */
export const runtime = "nodejs";

// Les clés du dossier qui méritent un courriel quand elles changent.
const CLES_AVIS = ["etape", "prochain_point", "date_lancement", "message"] as const;

type Client = {
  id: string;
  email: string | null;
  name: string | null;
  metadata: Record<string, string>;
};

async function envoyer(c: Courriel, quoi: string): Promise<void> {
  try {
    await envoyerCourriel(c);
    console.info(`[fondateur] courriel ${quoi} envoyé`);
  } catch (erreur) {
    console.error(`[fondateur] courriel ${quoi} refusé :`, erreur instanceof Error ? erreur.message : erreur);
  }
}

const texte = (m: Record<string, string>, cle: string) => (m[cle]?.trim() ? m[cle].trim().slice(0, 500) : null);

export async function POST(requete: NextRequest): Promise<Response> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("non configuré", { status: 503 });

  // Le corps BRUT : la signature porte sur les octets exacts, pas sur un
  // JSON relu et réécrit.
  const corps = await requete.text();
  if (!signatureValide(corps, requete.headers.get("stripe-signature"), secret)) {
    return new Response("signature invalide", { status: 400 });
  }

  const evenement = JSON.parse(corps) as {
    type: string;
    data: { object: unknown; previous_attributes?: { metadata?: Record<string, string | null> } };
  };

  if (evenement.type === "checkout.session.completed") {
    const s = evenement.data.object as SessionCheckout;
    const m = s.metadata ?? {};
    if (m.type === "fondateur" && s.payment_status === "paid") {
      console.info("[fondateur] place payée :", s.id);
      const langue: Langue = m.langue === "en" ? "en" : "fr";
      const courriel = s.customer_details?.email ?? "";
      after(async () => {
        await signalerFondateur({
          etape: "paye",
          prospect: {
            nom: m.nom ?? "",
            courriel,
            telephone: m.telephone ?? "",
            restaurant: m.restaurant ?? "",
            ville: m.ville ?? "",
            langue,
          },
          app: { menu: m.menu ?? "", service: m.service ?? "" },
          qualification: { plateformes: m.plateformes ?? "", commandes: m.commandes ?? "" },
          paiement: {
            session: s.id,
            montant: s.amount_total,
            devise: s.currency,
            dossier: lienDossier(s.id, langue),
          },
        });
        if (courriel) {
          await envoyer(
            courrielBienvenue({ a: courriel, nom: m.nom ?? "", restaurant: m.restaurant ?? "", session: s.id, langue }),
            "de bienvenue",
          );
        }
      });
    }
  }

  if (evenement.type === "customer.updated") {
    const client = evenement.data.object as Client;
    const avant = evenement.data.previous_attributes?.metadata;
    const apres = client.metadata ?? {};
    const change =
      avant !== undefined &&
      CLES_AVIS.some((cle) => cle in avant && (avant[cle] ?? "") !== (apres[cle] ?? ""));

    if (change && apres.avis?.trim().toLowerCase() !== "non") {
      after(async () => {
        const s = await sessionFondateurDuClient(client.id);
        if (!s) return;
        const m = s.metadata ?? {};
        const a = client.email ?? s.customer_details?.email ?? "";
        if (!a) return;
        await envoyer(
          courrielAvancement({
            a,
            nom: m.nom ?? client.name ?? "",
            restaurant: m.restaurant ?? "",
            session: s.id,
            langue: m.langue === "en" ? "en" : "fr",
            etape: Number.parseInt(apres.etape ?? "1", 10) || 1,
            prochainPoint: texte(apres, "prochain_point"),
            dateLancement: texte(apres, "date_lancement"),
            message: texte(apres, "message"),
          }),
          "d'avancement",
        );
      });
    }
  }

  return Response.json({ recu: true });
}
