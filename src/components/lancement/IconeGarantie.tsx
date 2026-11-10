import type { NOMS_GARANTIES } from "@/lib/contenu/grand-lancement";

/* UNE PETITE ANIMATION PAR GARANTIE, en lien avec ce qu'elle promet :
   48 h top chrono      → une horloge dont l'aiguille tourne;
   L'Imprimante qui chauffe → un billet qui sort de l'imprimante;
   Ça se paie ou c'est gratuit → une pièce qui tombe et un crochet;
   L'Argent boomerang   → une flèche qui part et revient.
   SVG + CSS (globals.css, bloc « gar- »). Rien ne bouge si le visiteur
   demande moins de mouvement. */

type Id = keyof typeof NOMS_GARANTIES;

const ROUGE = "#ff3008";
const ENCRE = "#191919";

export default function IconeGarantie({ id }: { id: Id }) {
  return (
    <span className="grid size-14 place-items-center rounded-2xl bg-brand/10" aria-hidden="true">
      <svg viewBox="0 0 48 48" className="size-10 overflow-visible">
        {id === "chrono" && (
          <>
            <circle cx="24" cy="26" r="15" fill="#fff" stroke={ENCRE} strokeWidth="3" />
            <rect x="20" y="5" width="8" height="5" rx="1.5" fill={ENCRE} />
            <line x1="24" y1="26" x2="24" y2="16" stroke={ROUGE} strokeWidth="3" strokeLinecap="round" className="gar-aiguille" />
            <circle cx="24" cy="26" r="2.2" fill={ENCRE} />
          </>
        )}
        {id === "imprimante" && (
          <>
            <rect x="15" y="14" width="18" height="16" rx="1" fill="#fff" stroke={ENCRE} strokeWidth="2.5" className="gar-billet" />
            <line x1="19" y1="20" x2="29" y2="20" stroke={ROUGE} strokeWidth="2" className="gar-billet" />
            <rect x="7" y="24" width="34" height="16" rx="4" fill="#fff" stroke={ENCRE} strokeWidth="3" />
            <rect x="13" y="30" width="12" height="4" rx="2" fill="none" stroke={ENCRE} strokeWidth="2.5" />
            <circle cx="34" cy="32" r="2.2" fill={ROUGE} className="gar-led" />
          </>
        )}
        {id === "gratuit" && (
          <>
            <path d="M8 38h32" stroke={ENCRE} strokeWidth="3" strokeLinecap="round" />
            <g className="gar-piece">
              <circle cx="24" cy="22" r="10" fill={ROUGE} stroke={ENCRE} strokeWidth="2.5" />
              <text x="24" y="26.5" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff" fontFamily="Helvetica, Arial, sans-serif">$</text>
            </g>
            <path d="M33 10l3 3 6-7" fill="none" stroke={ENCRE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="gar-crochet" />
          </>
        )}
        {id === "boomerang" && (
          <>
            <path d="M10 30c4-14 24-18 28-4" fill="none" stroke={ENCRE} strokeWidth="3" strokeLinecap="round" strokeDasharray="4 5" />
            <g className="gar-boomerang">
              <circle cx="10" cy="30" r="7" fill={ROUGE} stroke={ENCRE} strokeWidth="2.5" />
              <text x="10" y="33.5" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff" fontFamily="Helvetica, Arial, sans-serif">$</text>
            </g>
          </>
        )}
      </svg>
    </span>
  );
}
