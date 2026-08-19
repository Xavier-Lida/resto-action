import { ImageResponse } from "next/og";
import { PHONE_DISPLAY } from "@/lib/site";

/* LE DESSIN DES IMAGES DE PARTAGE, en un seul endroit.

   `opengraph-image` est une convention de FICHIER : Next la lit dans le segment
   de route où le fichier est posé, et nulle part plus bas. Une image à la
   racine ne descend donc pas sur /plateforme ni sur /blogue — il faut un
   fichier par segment. Ce qu'on ne veut pas, c'est vingt-six copies du même
   dessin : les fichiers de segment ne portent que leur texte, le dessin vit
   ici.

   Le dessin lui-même vient de l'ancienne image d'accueil, inchangé : la bouée
   en logo, une phrase sur deux tons, et la signature en bas. La seconde ligne
   passe au rouge de marque — c'est ce qui fait lire la phrase comme une chute
   plutôt que comme un titre.

   Trois textes, tous facultatifs sauf le titre :
   - `surTitre` : la petite ligne rouge en capitales, pour les pages profondes
     qui ont déjà un sur-titre écrit dans leur module de contenu ;
   - `titre` : la phrase principale ;
   - `chute` : une seconde ligne, en rouge, quand la phrase se casse en deux —
     c'est le cas des deux accueils, et d'eux seuls. */

export const TAILLE = { width: 1200, height: 630 };
export const TYPE = "image/png";

export function visuel({
  surTitre,
  titre,
  chute,
}: {
  surTitre?: string;
  titre: string;
  chute?: string;
}) {
  /* Une phrase en deux morceaux tient sur deux lignes ; un titre de page seul
     peut en prendre quatre. On descend d'un cran quand il n'y a pas de chute,
     pour qu'un titre d'article long ne déborde pas de la zone centrale. */
  const corps = chute ? 64 : 56;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#f1f1ef",
          padding: "72px 80px",
        }}
      >
        <svg viewBox="0 0 160 160" width="120" height="120">
          <circle cx="80" cy="80" r="52" fill="#ffffff" stroke="#e2e2df" strokeWidth="34" />
          <circle
            cx="80"
            cy="80"
            r="52"
            fill="none"
            stroke="#ff3008"
            strokeWidth="34"
            strokeDasharray="40.84 40.84"
          />
          <circle cx="80" cy="80" r="69" fill="none" stroke="#191919" strokeWidth="5" />
          <circle cx="80" cy="80" r="35" fill="#ffffff" stroke="#191919" strokeWidth="5" />
        </svg>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: corps,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#191919",
          }}
        >
          {surTitre && (
            <span
              style={{
                fontSize: 26,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#ff3008",
                marginBottom: 22,
              }}
            >
              {surTitre}
            </span>
          )}
          <span>{titre}</span>
          {chute && <span style={{ color: "#ff3008" }}>{chute}</span>}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            color: "#191919",
            opacity: 0.7,
          }}
        >
          restoaction.ca · {PHONE_DISPLAY}
        </div>
      </div>
    ),
    { ...TAILLE }
  );
}
