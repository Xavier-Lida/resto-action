/**
 * Lecture d'un relevé de plateforme par l'IA.
 *
 * Reçoit le fichier (PDF ou photo) et le consentement, l'envoie au modèle de
 * vision de Claude par l'API d'Anthropic, renvoie seulement les chiffres
 * extraits. Le fichier n'est jamais écrit sur disque ni journalisé : il vit le
 * temps de la requête, puis disparaît (Loi 25).
 */
import Anthropic from "@anthropic-ai/sdk";
import type { Extraction } from "@/lib/calcul";

export const runtime = "nodejs";
export const maxDuration = 60;

const TAILLE_MAX = 10 * 1024 * 1024;
const TYPES_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
type TypeImage = (typeof TYPES_IMAGE)[number];

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "lisible",
    "plateforme",
    "periode_jours",
    "nb_livraison",
    "nb_cueillette",
    "ventes",
    "commissions",
    "autres_frais",
    "taux_commission",
  ],
  properties: {
    lisible: {
      type: "boolean",
      description:
        "Vrai si le document est bien un relevé de plateforme de livraison et que les ventes et le nombre de commandes se lisent.",
    },
    plateforme: { type: "string", enum: ["doordash", "ubereats", "skip", "autre"] },
    periode_jours: { type: ["number", "null"], description: "Nombre de jours couverts par le relevé." },
    nb_livraison: { type: ["number", "null"], description: "Nombre de commandes en livraison." },
    nb_cueillette: { type: ["number", "null"], description: "Nombre de commandes en cueillette (pickup)." },
    ventes: { type: ["number", "null"], description: "Ventes d'aliments et boissons (sous-total avant taxes, frais et pourboires), en dollars." },
    commissions: { type: ["number", "null"], description: "Montant total des commissions prises par la plateforme, en dollars (positif)." },
    autres_frais: { type: ["number", "null"], description: "Autres frais pris par la plateforme (marketing, traitement, etc.), en dollars (positif)." },
    taux_commission: { type: ["number", "null"], description: "Taux de commission affiché, entre 0 et 1." },
  },
} as const;

const CONSIGNE = `Tu lis un relevé de plateforme de livraison (DoorDash, Uber Eats ou Skip), en français ou en anglais, fourni par un restaurant du Québec.
Extrais les chiffres demandés pour la période couverte. Si le nombre de commandes n'est pas séparé entre livraison et cueillette, mets tout en livraison.
Si le document n'est pas un relevé ou qu'il est illisible, mets lisible à faux et les autres champs à null. N'invente aucun chiffre.`;

type Reponse = { ok: true; extraction: Extraction } | { ok: false; raison: string };

function reponse(r: Reponse, status = 200) {
  return Response.json(r, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return reponse({ ok: false, raison: "lecture indisponible" }, 503);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return reponse({ ok: false, raison: "formulaire invalide" }, 400);
  }

  if (form.get("consentement") !== "oui") {
    return reponse({ ok: false, raison: "consentement requis" }, 400);
  }
  const fichier = form.get("fichier");
  if (!(fichier instanceof File) || fichier.size === 0) {
    return reponse({ ok: false, raison: "fichier manquant" }, 400);
  }
  if (fichier.size > TAILLE_MAX) {
    return reponse({ ok: false, raison: "fichier trop gros (10 Mo max)" }, 413);
  }

  const type = fichier.type;
  const estPdf = type === "application/pdf";
  const estImage = (TYPES_IMAGE as readonly string[]).includes(type);
  if (!estPdf && !estImage) {
    return reponse({ ok: false, raison: "format non lu : envoie un PDF ou une photo (JPG, PNG)" }, 415);
  }

  const data = Buffer.from(await fichier.arrayBuffer()).toString("base64");

  const client = new Anthropic();
  try {
    const message = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 2000,
      output_config: { effort: "medium", format: { type: "json_schema", schema: SCHEMA } },
      system: CONSIGNE,
      messages: [
        {
          role: "user",
          content: [
            estPdf
              ? { type: "document", source: { type: "base64", media_type: "application/pdf", data } }
              : { type: "image", source: { type: "base64", media_type: type as TypeImage, data } },
            { type: "text", text: "Extrais les chiffres de ce relevé." },
          ],
        },
      ],
    });

    if (message.stop_reason === "refusal") {
      return reponse({ ok: false, raison: "lecture impossible" });
    }
    const texte = message.content.find((b) => b.type === "text")?.text ?? "";
    const extraction = JSON.parse(texte) as Extraction;
    return reponse({ ok: true, extraction });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return reponse({ ok: false, raison: "trop de demandes, réessaie dans une minute" }, 429);
    }
    if (err instanceof Anthropic.APIError) {
      console.error("releve: erreur API", err.status);
    } else {
      console.error("releve: erreur", err instanceof Error ? err.message : "inconnue");
    }
    return reponse({ ok: false, raison: "lecture impossible" });
  }
}
