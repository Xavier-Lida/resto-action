import fs from "node:fs";
import path from "node:path";

/* LES PHOTOS DES PAGES DE PIÈCES (générées dans Higgsfield).

   Dépose le fichier dans public/photos/ avec le nom de la page :
     public/photos/livraison.jpg        → la photo du haut de page
     public/photos/livraison-2.jpg      → la grande photo au milieu de la page
   (.jpg, .jpeg, .png, .webp ou .avif). Pas de fichier : la page s'affiche
   comme avant, sans trou. Lu au moment du rendu, côté serveur. */
const EXTENSIONS = [".webp", ".avif", ".jpg", ".jpeg", ".png"];

export function photoDe(nom: string): string | null {
  const dossier = path.join(process.cwd(), "public", "photos");
  for (const ext of EXTENSIONS) {
    if (fs.existsSync(path.join(dossier, nom + ext))) return `/photos/${nom}${ext}`;
  }
  return null;
}
