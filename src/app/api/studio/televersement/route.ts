import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { STUDIO } from "@/lib/site";
import { frein, introuvable, ipDe, refus, SANS_CACHE, studioPret } from "@/lib/studio/acces";

/* LE STUDIO PHOTO : la permission d'envoyer UNE photo.

   Une fonction Vercel refuse plus de 4,5 Mo en entrée, et une photo de cell en
   fait jusqu'à 15. La photo part donc du navigateur DIRECTEMENT vers le magasin
   privé. Cette route ne voit jamais le fichier : elle remet au navigateur un
   jeton à usage unique, valable pour un seul fichier, dans un seul dossier
   (studio/televersements/), d'un type et d'une taille permis, qui s'efface tout
   seul après la durée de garde. La clé du magasin, elle, reste ici.

   Le fichier téléversé n'est rien tant que /api/studio/retouche ne l'a pas
   pris : c'est là que les limites par visiteur et par resto sont comptées. */
export const runtime = "nodejs";

const tropVite = frein(12);

export async function POST(requete: Request): Promise<Response> {
  if (!studioPret()) return introuvable();
  if (tropVite(ipDe(requete))) return refus("trop", 429);

  let corps: HandleUploadBody;
  try {
    corps = (await requete.json()) as HandleUploadBody;
  } catch {
    return refus("invalide");
  }

  try {
    const reponse = await handleUpload({
      request: requete,
      body: corps,
      onBeforeGenerateToken: async (chemin) => {
        if (!/^studio\/televersements\/photo\.(jpg|png|heic)$/.test(chemin)) throw new Error("chemin refusé");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/heic", "image/heif"],
          maximumSizeInBytes: STUDIO.tailleMaxMo * 1024 * 1024,
          addRandomSuffix: true,
          ttlDays: STUDIO.gardeJours,
        };
      },
    });
    return Response.json(reponse, { headers: SANS_CACHE });
  } catch (erreur) {
    console.error("[studio] téléversement :", erreur instanceof Error ? erreur.message : "erreur inconnue");
    return refus("invalide");
  }
}
