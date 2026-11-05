/**
 * Les visuels des cartes de la pile : la vraie chose, pas une icône.
 * SVG et CSS seulement. Chaque nom et chaque chiffre est un exemple.
 * L'animation part au défilement, une seule fois (AnimerAuDefilement).
 */
import { NOM_RESTO_EXEMPLE as RESTO, VISUELS as V, type Visuel as TypeVisuel } from "@/lib/contenu/grand-lancement";
import { Imprimante } from "../Imprimante";
import { Exemple } from "../ui";

const INK = "#191919";
const BRAND = "#ff3008";
const BONE = "#f1f1ef";
const FONT = "Helvetica, Arial, sans-serif";

type Props = { nomResto: string };

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export function Visuel({ type, nomResto = RESTO }: { type: TypeVisuel; nomResto?: string }) {
  const composants: Record<TypeVisuel, (p: Props) => React.ReactNode> = {
    app: App,
    "fiche-google": FicheGoogle,
    calendrier: Calendrier,
    blitz: Blitz,
    tournee: Tournee,
    fidelite: Fidelite,
    avis: Avis,
    textos: Textos,
    livraison: Livraison,
    imprimante: ({ nomResto }) => (
      <Imprimante mode="une-fois" nomResto={nomResto} className="mx-auto h-full w-auto" />
    ),
  };
  const C = composants[type];
  return (
    <figure className="relative mb-4 h-40 overflow-hidden rounded-2xl bg-bone">
      <div className="absolute right-2 top-2 z-10">
        <Exemple />
      </div>
      <div className="flex h-full items-center justify-center p-3">
        <C nomResto={nomResto} />
      </div>
    </figure>
  );
}

/* ───────────── Pièces communes ───────────── */

function Cell({ x = 0, y = 0, w = 70, h = 130, children }: { x?: number; y?: number; w?: number; h?: number; children?: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx="10" fill="#fff" stroke={INK} strokeWidth="4" />
      <rect x={w / 2 - 12} y="5" width="24" height="4" rx="2" fill={INK} />
      {children}
    </g>
  );
}

function Bulle({ x, y, w, texte, droite = false, delai = 0, rouge = false }: { x: number; y: number; w: number; texte: string; droite?: boolean; delai?: number; rouge?: boolean }) {
  const lignes = couper(texte, Math.max(10, Math.floor(w / 5.6)));
  const h = 14 + lignes.length * 11;
  return (
    <g className="v-rise" style={d(delai)}>
      <rect x={x} y={y} width={w} height={h} rx="9" fill={rouge ? BRAND : "#fff"} stroke={INK} strokeWidth="3" />
      <path d={droite ? `M${x + w - 12} ${y + h} l6 7 l2 -7z` : `M${x + 12} ${y + h} l-6 7 l-2 -7z`} fill={rouge ? BRAND : "#fff"} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {lignes.map((l, i) => (
        <text key={i} x={x + 8} y={y + 16 + i * 11} fontFamily={FONT} fontSize="9" fontWeight="700" fill={rouge ? "#fff" : INK}>
          {l}
        </text>
      ))}
    </g>
  );
}

function couper(texte: string, max: number): string[] {
  const mots = texte.split(" ");
  const lignes: string[] = [];
  let cur = "";
  for (const m of mots) {
    if ((cur + " " + m).trim().length > max && cur) {
      lignes.push(cur);
      cur = m;
    } else cur = (cur + " " + m).trim();
  }
  if (cur) lignes.push(cur);
  return lignes;
}

function Etoiles({ x, y, n, taille = 8, delai = 0 }: { x: number; y: number; n: number; taille?: number; delai?: number }) {
  return (
    <g>
      {Array.from({ length: 5 }).map((_, i) => (
        <polygon
          key={i}
          className="v-pop"
          style={d(delai + i * 0.08)}
          points="0,-5 1.5,-1.5 5,-1.5 2,1 3,5 0,2.5 -3,5 -2,1 -5,-1.5 -1.5,-1.5"
          transform={`translate(${x + i * (taille + 2)} ${y}) scale(${taille / 10})`}
          fill={i < n ? BRAND : BONE}
          stroke={INK}
          strokeWidth="1"
        />
      ))}
    </g>
  );
}

function Sac({ x, y, className = "", style }: { x: number; y: number; className?: string; style?: React.CSSProperties }) {
  return (
    <g className={className} style={style} transform={`translate(${x} ${y})`}>
      <path d="M4 10 h28 l-3 28 h-22z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M11 10 v-4 a7 7 0 0 1 14 0 v4" fill="none" stroke={INK} strokeWidth="3" />
      <rect x="10" y="20" width="16" height="4" rx="2" fill={BRAND} />
    </g>
  );
}

/* ───────────── Les visuels ───────────── */

function App({ nomResto }: Props) {
  return (
    <svg viewBox="0 0 160 140" className="h-full w-auto" aria-hidden="true">
      <Cell x={45} y={5} w={70} h={130}>
        <text x="35" y="24" textAnchor="middle" fontFamily={FONT} fontSize="8" fontWeight="900" fill={INK}>
          {nomResto}
        </text>
        <rect x="6" y="30" width="58" height="3" fill={BRAND} />
        <clipPath id="v-app-clip">
          <rect x="4" y="36" width="62" height="88" />
        </clipPath>
        <g clipPath="url(#v-app-clip)">
          <g className="v-scroll" style={{ "--d": "0.6s", "--t": "2.4s" } as React.CSSProperties}>
            {V.menu.map(([nom, prix], i) => (
              <g key={nom} transform={`translate(6 ${40 + i * 22})`}>
                <rect width="58" height="18" rx="4" fill={BONE} />
                <text x="4" y="12" fontFamily={FONT} fontSize="6.5" fontWeight="700" fill={INK}>
                  {nom}
                </text>
                <text x="55" y="12" textAnchor="end" fontFamily={FONT} fontSize="6.5" fontWeight="900" fill={BRAND}>
                  {prix}
                </text>
              </g>
            ))}
          </g>
        </g>
      </Cell>
    </svg>
  );
}

function FicheGoogle({ nomResto }: Props) {
  return (
    <svg viewBox="0 0 200 130" className="h-full w-auto" aria-hidden="true">
      <rect x="10" y="10" width="180" height="110" rx="12" fill="#fff" stroke={INK} strokeWidth="4" />
      <rect x="22" y="22" width="48" height="48" rx="8" fill={BONE} />
      <text x="46" y="52" textAnchor="middle" fontFamily={FONT} fontSize="20" fontWeight="900" fill={BRAND}>
        {nomResto.charAt(0)}
      </text>
      <text x="80" y="36" fontFamily={FONT} fontSize="12" fontWeight="900" fill={INK}>
        {nomResto}
      </text>
      <text x="80" y="52" fontFamily={FONT} fontSize="9" fontWeight="700" fill={INK}>
        {V.ficheNote}
      </text>
      <Etoiles x={100} y={49} n={5} taille={7} delai={0.3} />
      <text x="80" y="66" fontFamily={FONT} fontSize="8" fill={INK} opacity="0.6">
        Restaurant · Ouvert
      </text>
      <g className="v-pop" style={d(0.9)}>
        <rect x="22" y="84" width="156" height="24" rx="12" fill={BRAND} />
        <text x="100" y="100" textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="900" fill="#fff">
          {V.ficheBouton}
        </text>
      </g>
    </svg>
  );
}

function Calendrier() {
  return (
    <svg viewBox="0 0 220 130" className="h-full w-auto" aria-hidden="true">
      {V.calendrierMois.map((mois, m) => (
        <g key={mois} transform={`translate(${8 + m * 70} 10)`}>
          <rect width="64" height="110" rx="8" fill="#fff" stroke={INK} strokeWidth="3" />
          <rect width="64" height="18" rx="8" fill={INK} />
          <rect y="10" width="64" height="8" fill={INK} />
          <text x="32" y="13" textAnchor="middle" fontFamily={FONT} fontSize="8" fontWeight="900" fill="#fff">
            {mois}
          </text>
          {Array.from({ length: 28 }).map((_, i) => {
            const c = i % 7;
            const r = Math.floor(i / 7);
            const publie = [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26].includes(i);
            return (
              <g key={i}>
                <rect x={5 + c * 8} y={24 + r * 20} width="6" height="14" rx="2" fill={BONE} />
                {publie && (
                  <rect
                    className="v-pop"
                    style={d(0.2 + m * 0.9 + (i / 28) * 0.8)}
                    x={5 + c * 8}
                    y={24 + r * 20}
                    width="6"
                    height="14"
                    rx="2"
                    fill={BRAND}
                  />
                )}
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

function Blitz() {
  return (
    <svg viewBox="0 0 220 130" className="h-full w-auto" aria-hidden="true">
      {/* Le sac et ce qui y tombe */}
      <g transform="translate(10 0)">
        <path d="M10 60 h70 l-6 62 h-58z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M28 60 v-10 a17 17 0 0 1 34 0 v10" fill="none" stroke={INK} strokeWidth="4" />
        <rect className="v-drop" style={d(0.2)} x="22" y="22" width="26" height="30" rx="3" fill={BRAND} stroke={INK} strokeWidth="3" />
        <rect className="v-drop" style={d(0.6)} x="40" y="14" width="30" height="40" rx="3" fill="#fff" stroke={INK} strokeWidth="3" />
        <rect className="v-drop" style={d(1.0)} x="30" y="40" width="34" height="16" rx="3" fill={BONE} stroke={INK} strokeWidth="3" />
        {V.blitzItems.map((t, i) => (
          <text key={t} className="v-fade" style={d(0.3 + i * 0.4)} x="45" y={84 + i * 11} textAnchor="middle" fontFamily={FONT} fontSize="8" fontWeight="900" fill={INK}>
            {t}
          </text>
        ))}
      </g>
      {/* La pub sur un fil de réseau social */}
      <g className="v-slide" style={d(1.3)} transform="translate(110 14)">
        <rect width="100" height="104" rx="10" fill="#fff" stroke={INK} strokeWidth="3" />
        <circle cx="16" cy="16" r="8" fill={BONE} />
        <rect x="30" y="11" width="40" height="5" rx="2" fill={INK} />
        <rect x="30" y="19" width="26" height="4" rx="2" fill={INK} opacity="0.4" />
        <rect x="8" y="32" width="84" height="40" rx="6" fill={BRAND} />
        <text x="50" y="56" textAnchor="middle" fontFamily={FONT} fontSize="9" fontWeight="900" fill="#fff">
          {V.blitzPub}
        </text>
        <rect x="8" y="80" width="30" height="5" rx="2" fill={INK} opacity="0.4" />
        <rect x="8" y="90" width="60" height="5" rx="2" fill={INK} opacity="0.4" />
      </g>
    </svg>
  );
}

function Tournee({ nomResto }: Props) {
  const points = [
    [40, 30], [160, 28], [50, 100], [150, 102], [100, 20], [30, 65], [170, 70], [110, 108], [80, 45], [130, 50],
  ];
  return (
    <svg viewBox="0 0 200 130" className="h-full w-auto" aria-hidden="true">
      <rect width="200" height="130" rx="10" fill="#fff" />
      {/* Rues */}
      <g stroke={BONE} strokeWidth="8" strokeLinecap="round">
        <path d="M0 40 H200" />
        <path d="M0 90 H200" />
        <path d="M60 0 V130" />
        <path d="M140 0 V130" />
      </g>
      {/* Le resto */}
      <g transform="translate(100 65)">
        <circle r="14" fill={BRAND} stroke={INK} strokeWidth="3" />
        <text y="4" textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="900" fill="#fff">
          {nomResto.charAt(0)}
        </text>
        <text y="28" textAnchor="middle" fontFamily={FONT} fontSize="8" fontWeight="900" fill={INK}>
          {nomResto}
        </text>
      </g>
      {/* Les bureaux visités */}
      {points.map(([x, y], i) => (
        <g key={i} className="v-pop" style={d(0.3 + i * 0.25)} transform={`translate(${x} ${y})`}>
          <circle r="7" fill="#fff" stroke={INK} strokeWidth="3" />
          <circle r="3" fill={BRAND} />
        </g>
      ))}
    </svg>
  );
}

function Fidelite({ nomResto }: Props) {
  return (
    <svg viewBox="0 0 220 130" className="h-full w-auto" aria-hidden="true">
      {/* Carte de points */}
      <g transform="translate(8 14)">
        <rect width="110" height="70" rx="10" fill="#fff" stroke={INK} strokeWidth="3" />
        <text x="10" y="18" fontFamily={FONT} fontSize="9" fontWeight="900" fill={INK}>
          {nomResto}
        </text>
        <text x="100" y="18" textAnchor="end" fontFamily={FONT} fontSize="7" fontWeight="700" fill={INK} opacity="0.6">
          {V.fidelitePoints}/{V.fidelitePointsMax}
        </text>
        {Array.from({ length: V.fidelitePointsMax }).map((_, i) => (
          <g key={i} transform={`translate(${18 + (i % 5) * 19} ${38 + Math.floor(i / 5) * 20})`}>
            <circle r="7" fill={BONE} stroke={INK} strokeWidth="2" />
            {i < V.fidelitePoints && <circle className="v-pop" style={d(0.2 + i * 0.15)} r="7" fill={BRAND} stroke={INK} strokeWidth="2" />}
          </g>
        ))}
      </g>
      {/* Le texto */}
      <Bulle x={126} y={30} w={88} texte={V.fideliteTexto} delai={1.9} />
    </svg>
  );
}

function Avis({ nomResto }: Props) {
  return (
    <svg viewBox="0 0 240 130" className="h-full w-auto" aria-hidden="true">
      {/* La fiche Google : l'avis arrive, puis la réponse */}
      <g transform="translate(6 8)">
        <rect width="124" height="114" rx="10" fill="#fff" stroke={INK} strokeWidth="3" />
        <text x="10" y="18" fontFamily={FONT} fontSize="9" fontWeight="900" fill={INK}>
          {nomResto}
        </text>
        <g className="v-slide" style={d(0.2)}>
          <circle cx="18" cy="38" r="7" fill={BONE} stroke={INK} strokeWidth="2" />
          <Etoiles x={32} y={38} n={V.avisEtoiles} taille={7} delai={0.4} />
          <text x="10" y="58" fontFamily={FONT} fontSize="7.5" fill={INK}>
            {V.avisTexte}
          </text>
        </g>
        <g className="v-rise" style={d(3.2)}>
          <rect x="18" y="68" width="98" height="36" rx="6" fill={BONE} />
          <text x="24" y="81" fontFamily={FONT} fontSize="7" fontWeight="900" fill={BRAND}>
            Réponse du proprio
          </text>
          {couper(V.avisReponseProposee, 26).map((l, i) => (
            <text key={i} x="24" y={92 + i * 9} fontFamily={FONT} fontSize="7" fill={INK}>
              {l}
            </text>
          ))}
        </g>
      </g>
      {/* Le texto au proprio, et son OK */}
      <Bulle x={138} y={14} w={96} texte={V.avisReponseProposee} delai={1.4} />
      <Bulle x={190} y={74} w={44} texte={V.avisOk} droite delai={2.4} rouge />
    </svg>
  );
}

function Textos() {
  return (
    <svg viewBox="0 0 220 130" className="h-full w-auto" aria-hidden="true">
      <text x="10" y="22" fontFamily={FONT} fontSize="8" fontWeight="900" fill={INK} opacity="0.5" className="v-fade" style={d(0)}>
        Le soir
      </text>
      <Bulle x={10} y={28} w={120} texte={V.textoSoir} delai={0.2} />
      <text x="210" y="70" textAnchor="end" fontFamily={FONT} fontSize="8" fontWeight="900" fill={INK} opacity="0.5" className="v-fade" style={d(1)}>
        Le lundi
      </text>
      <Bulle x={60} y={76} w={150} texte={V.textoLundi} droite delai={1.2} rouge />
    </svg>
  );
}

function Livraison({ nomResto }: Props) {
  const chemin = "M30 95 C 60 95, 70 40, 110 40 S 170 60, 190 35";
  return (
    <svg viewBox="0 0 220 130" className="h-full w-auto" aria-hidden="true">
      <rect width="220" height="130" rx="10" fill="#fff" />
      <g stroke={BONE} strokeWidth="8" strokeLinecap="round">
        <path d="M0 60 H220" />
        <path d="M80 0 V130" />
        <path d="M160 0 V130" />
      </g>
      <path d={chemin} fill="none" stroke={INK} strokeWidth="3" strokeDasharray="6 6" />
      <g transform="translate(30 95)">
        <circle r="10" fill={BRAND} stroke={INK} strokeWidth="3" />
        <text y="26" textAnchor="middle" fontFamily={FONT} fontSize="8" fontWeight="900" fill={INK}>
          {nomResto}
        </text>
      </g>
      <g transform="translate(190 35)">
        <path d="M-10 8 v-10 l10 -8 l10 8 v10z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      </g>
      <g
        className="v-travel"
        style={{ "--d": "0.3s", "--t": "2.6s", offsetPath: `path('${chemin}')`, offsetRotate: "0deg" } as React.CSSProperties}
      >
        <Sac x={-18} y={-30} />
      </g>
      <Bulle x={112} y={84} w={100} texte={V.livraisonTexto} droite delai={2.9} />
    </svg>
  );
}
