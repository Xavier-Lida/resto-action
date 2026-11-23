import { GoogleGenAI } from "@google/genai";
import { CONSIGNE_RETOUCHE } from "@/lib/contenu/studio";
import { STUDIO } from "@/lib/site";
import type { Rapport } from "@/lib/studio/cadrage";

/* LE STUDIO PHOTO : la retouche par IA.

   Un seul appel, au modèle d'édition d'image de Google (STUDIO.moteurIA dans
   src/lib/site.ts), avec la photo et la consigne de Guillaume, MOT POUR MOT
   (CONSIGNE_RETOUCHE, src/lib/contenu/studio.ts). Rien d'autre n'est ajouté à
   la consigne.

   CE MOTEUR REFAIT L'IMAGE : il peut donc inventer, malgré la consigne. C'est
   pour ça que rien de ce qu'il rend n'est livré avant le deuxième contrôle
   (src/lib/studio/controle.ts), et que la correction sans génération
   (moteur-sharp.ts) attend toujours derrière.

   On demande le rapport de la photo d'origine : il n'a aucun bord à combler.
   Changer de fournisseur, c'est réécrire ce fichier seulement : le reste du
   Studio ne connaît que `retoucherIA`.

   La clé (GEMINI_API_KEY) reste sur le serveur. `store: false` : Google ne
   garde pas l'échange pour une suite de conversation. */

export function moteurIAPret(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

export type RetoucheIA =
  | { ok: true; jpeg: Buffer; coutUsd: number }
  /** Le moteur a répondu par du texte au lieu d'une image : il dit que la photo
      ne peut pas être sauvée (c'est ce que la consigne lui demande). */
  | { ok: false; dit: string; coutUsd: number };

const DELAI_MS = 90_000;

/** Lance une erreur en cas de panne ou de délai dépassé : l'appelant livre alors la correction. */
export async function retoucherIA(jpeg: Buffer, rapport: Rapport): Promise<RetoucheIA> {
  const ia = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { timeout: DELAI_MS } });
  const interaction = await ia.interactions.create({
    model: STUDIO.moteurIA.modele,
    input: [
      { type: "text", text: CONSIGNE_RETOUCHE },
      { type: "image", mime_type: "image/jpeg", data: jpeg.toString("base64") },
    ],
    response_format: { type: "image", aspect_ratio: rapport, image_size: STUDIO.moteurIA.taille, mime_type: "image/jpeg" },
    store: false,
  });

  const image = interaction.output_image?.data;
  if (image) {
    return { ok: true, jpeg: Buffer.from(image, "base64"), coutUsd: STUDIO.moteurIA.prixParImageUsd };
  }
  return { ok: false, dit: (interaction.output_text ?? "").slice(0, 500), coutUsd: 0 };
}
