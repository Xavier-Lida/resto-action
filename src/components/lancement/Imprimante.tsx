/**
 * L'imprimante de cuisine animée, dans le trait de la bouée : fond blanc,
 * contour encre, accent rouge. Elle sort des billets de commande.
 *  - mode « boucle » : en haut de page, les billets sortent sans arrêt.
 *  - mode « une-fois » : dans une carte, un billet sort quand la carte entre
 *    à l'écran (classe .anime posée par AnimerAuDefilement).
 */
export function Imprimante({
  className = "",
  mode = "boucle",
  nomResto,
}: {
  className?: string;
  mode?: "boucle" | "une-fois";
  nomResto?: string;
}) {
  const boucle = mode === "boucle";
  const id = boucle ? "clip-boucle" : "clip-carte";
  return (
    <svg
      viewBox="0 0 240 240"
      className={`${boucle ? "imprimante-boucle" : "imprimante-une-fois"} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={id}>
          {/* Zone visible au-dessus de la fente */}
          <rect x="0" y="0" width="240" height="132" />
        </clipPath>
      </defs>

      {/* Billets */}
      <g clipPath={`url(#${id})`}>
        <Ticket className="ticket ticket-1" y={134} nomResto={nomResto} />
        {boucle && <Ticket className="ticket ticket-2" y={134 + 48} nomResto={nomResto} />}
      </g>

      {/* Corps de l'imprimante */}
      <rect x="40" y="128" width="160" height="84" rx="16" fill="#ffffff" stroke="#191919" strokeWidth="5" />
      <rect x="40" y="128" width="160" height="30" rx="14" fill="#f1f1ef" stroke="#191919" strokeWidth="5" />
      <rect x="40" y="146" width="160" height="12" fill="#f1f1ef" />
      {/* Fente */}
      <rect x="66" y="139" width="108" height="8" rx="4" fill="#191919" />
      {/* Voyant et bouton */}
      <circle className="led" cx="176" cy="184" r="7" fill="#ff3008" />
      <rect x="58" y="176" width="52" height="16" rx="8" fill="#f1f1ef" stroke="#191919" strokeWidth="4" />
      {/* Pieds */}
      <rect x="60" y="212" width="24" height="10" rx="4" fill="#191919" />
      <rect x="156" y="212" width="24" height="10" rx="4" fill="#191919" />
    </svg>
  );
}

function Ticket({ className, y, nomResto }: { className: string; y: number; nomResto?: string }) {
  return (
    <g className={className}>
      <rect x="78" y={y} width="84" height="104" fill="#ffffff" stroke="#191919" strokeWidth="4" />
      <rect x="78" y={y} width="84" height="4" fill="#191919" />
      {nomResto ? (
        <text x="120" y={y + 20} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontWeight="900" fontSize="11" fill="#191919">
          {nomResto}
        </text>
      ) : (
        <rect x="92" y={y + 14} width="56" height="6" rx="3" fill="#191919" />
      )}
      <rect x="88" y={y + 32} width="64" height="4" rx="2" fill="#191919" opacity="0.5" />
      <rect x="88" y={y + 44} width="48" height="4" rx="2" fill="#191919" opacity="0.5" />
      <rect x="88" y={y + 56} width="56" height="4" rx="2" fill="#191919" opacity="0.5" />
      <rect x="88" y={y + 68} width="40" height="4" rx="2" fill="#191919" opacity="0.5" />
      <rect x="88" y={y + 84} width="64" height="6" rx="3" fill="#ff3008" />
    </g>
  );
}
