import type { NextRequest } from "next/server";
import { PlacesNonConfigure, lirePhoto, nomPhotoValide } from "@/lib/places";

/* GET /api/places/photo?nom=places/…/photos/…&l=600 : relaie une photo
   Google sans exposer la clé. Le navigateur la garde un jour en cache. */
export const runtime = "nodejs";

export async function GET(requete: NextRequest): Promise<Response> {
  const nom = requete.nextUrl.searchParams.get("nom") ?? "";
  const largeur = Math.min(800, Math.max(100, Number(requete.nextUrl.searchParams.get("l")) || 600));
  if (!nomPhotoValide(nom)) return new Response("photo invalide", { status: 400 });

  try {
    const photo = await lirePhoto(nom, largeur);
    if (!photo.ok || !photo.body) return new Response("photo introuvable", { status: 404 });
    return new Response(photo.body, {
      headers: {
        "Content-Type": photo.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (erreur) {
    if (erreur instanceof PlacesNonConfigure) return new Response("non configuré", { status: 503 });
    return new Response("google", { status: 502 });
  }
}
