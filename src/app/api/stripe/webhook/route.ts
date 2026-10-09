import { after, type NextRequest } from "next/server";
import { signalerFondateur } from "@/lib/crm";
import { SITE_URL } from "@/lib/site";
import { signatureValide, type SessionCheckout } from "@/lib/stripe";

/* LES AVIS DE STRIPE.

   Stripe appelle cette adresse quand un paiement aboutit. C'est LA source de
   vérité d'une place fondateur payée : la page de remerciement, elle, peut ne
   jamais s'afficher (onglet fermé, réseau coupé).

   À configurer dans Stripe → Développeurs → Webhooks :
     adresse  https://www.restoaction.ca/api/stripe/webhook
     événements  checkout.session.completed
   puis copier le « secret de signature » (whsec_…) dans STRIPE_WEBHOOK_SECRET.

   On répond 200 vite, à tout avis bien signé, même ceux qu'on ignore : sinon
   Stripe réessaie pendant trois jours. */
export const runtime = "nodejs";

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
    data: { object: SessionCheckout };
  };

  if (evenement.type === "checkout.session.completed") {
    const s = evenement.data.object;
    const m = s.metadata ?? {};
    if (m.type === "fondateur" && s.payment_status === "paid") {
      console.info("[fondateur] place payée :", s.id);
      after(() =>
        signalerFondateur({
          etape: "paye",
          prospect: {
            nom: m.nom ?? "",
            courriel: s.customer_details?.email ?? "",
            telephone: m.telephone ?? "",
            restaurant: m.restaurant ?? "",
            ville: m.ville ?? "",
            langue: m.langue === "en" ? "en" : "fr",
          },
          app: { menu: m.menu ?? "", service: m.service ?? "" },
          qualification: { plateformes: m.plateformes ?? "", commandes: m.commandes ?? "" },
          paiement: {
            session: s.id,
            montant: s.amount_total,
            devise: s.currency,
            dossier: `${SITE_URL}${m.langue === "en" ? "/en/status" : "/dossier"}/${s.id}`,
          },
        }),
      );
    }
  }

  return Response.json({ recu: true });
}
