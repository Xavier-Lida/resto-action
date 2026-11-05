/**
 * « Le Système en images » : six panneaux animés, une étape à la fois,
 * dans le trait du site. L'animation part au défilement, une seule fois.
 */
import { SCENE, NOM_RESTO_EXEMPLE as RESTO, disponible } from "@/lib/contenu/grand-lancement";
import { fr } from "@/lib/format";
import { AnimerAuDefilement } from "./AnimerAuDefilement";
import { Exemple } from "./ui";

const INK = "#191919";
const BRAND = "#ff3008";
const BONE = "#f1f1ef";
const FONT = "Helvetica, Arial, sans-serif";
const PAS = 1.1; // secondes entre deux étapes

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

function Personne({ x, y, delai, rouge = false }: { x: number; y: number; delai: number; rouge?: boolean }) {
  return (
    <g className="v-slide" style={d(delai)} transform={`translate(${x} ${y})`}>
      <circle cy="-22" r="9" fill="#fff" stroke={INK} strokeWidth="3" />
      <path d="M-12 14 a12 12 0 0 1 24 0z" fill={rouge ? BRAND : "#fff"} stroke={INK} strokeWidth="3" />
    </g>
  );
}

function Bulle({ x, y, w, h, delai, rouge = false, children }: { x: number; y: number; w: number; h: number; delai: number; rouge?: boolean; children: React.ReactNode }) {
  return (
    <g className="v-rise" style={d(delai)}>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={rouge ? BRAND : "#fff"} stroke={INK} strokeWidth="3" />
      {children}
    </g>
  );
}

function Panneau({ n, delai, children }: { n: number; delai: number; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white">
      <span className="absolute left-3 top-2 z-10 font-script text-3xl leading-none text-brand">{n}</span>
      <svg viewBox="0 0 200 110" className="w-full" aria-hidden="true">
        <g className="v-fade" style={d(delai)}>{children}</g>
      </svg>
    </div>
  );
}

export function Scene() {
  const avis = disponible({ dependDe: ["avis"] });
  const etapes = SCENE.etapes.filter(disponible);
  return (
    <AnimerAuDefilement seuil={0.2}>
      <div className="relative">
        <div className="absolute right-0 -top-7">
          <Exemple />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 1. La pub, les cartons et la tournée amènent un client */}
          <Panneau n={1} delai={0}>
            <rect x="40" y="30" width="44" height="54" rx="4" fill="#fff" stroke={INK} strokeWidth="3" />
            <rect x="48" y="40" width="28" height="18" rx="2" fill={BRAND} />
            <rect x="48" y="64" width="28" height="3" fill={INK} opacity="0.5" />
            <rect x="48" y="71" width="18" height="3" fill={INK} opacity="0.5" />
            <g className="v-drop" style={d(0.4)}>
              <rect x="96" y="52" width="34" height="22" rx="2" fill={BONE} stroke={INK} strokeWidth="3" />
              <rect x="104" y="60" width="18" height="4" rx="2" fill={BRAND} />
            </g>
            <Personne x={160} y={62} delai={0.8} />
          </Panneau>

          {/* 2. Il commande sur l'app */}
          <Panneau n={2} delai={PAS}>
            <Personne x={40} y={62} delai={PAS} />
            <g className="v-rise" style={d(PAS + 0.3)}>
              <rect x="86" y="14" width="52" height="86" rx="8" fill="#fff" stroke={INK} strokeWidth="3" />
              <text x="112" y="30" textAnchor="middle" fontFamily={FONT} fontSize="7" fontWeight="900" fill={INK}>{RESTO}</text>
              <rect x="94" y="38" width="36" height="10" rx="2" fill={BONE} />
              <rect x="94" y="52" width="36" height="10" rx="2" fill={BONE} />
              <rect x="94" y="66" width="36" height="10" rx="2" fill={BONE} />
              <g className="v-pop" style={d(PAS + 0.8)}>
                <rect x="94" y="82" width="36" height="11" rx="5" fill={BRAND} />
                <text x="112" y="90" textAnchor="middle" fontFamily={FONT} fontSize="6.5" fontWeight="900" fill="#fff">Commander</text>
              </g>
            </g>
          </Panneau>

          {/* 3. L'imprimante sort la commande */}
          <Panneau n={3} delai={PAS * 2}>
            <clipPath id="scene-clip"><rect x="0" y="0" width="200" height="56" /></clipPath>
            <g clipPath="url(#scene-clip)">
              <g className="v-rise" style={{ "--d": `${PAS * 2 + 0.3}s`, "--t": "1.2s" } as React.CSSProperties}>
                <rect x="76" y="18" width="48" height="40" fill="#fff" stroke={INK} strokeWidth="3" />
                <rect x="84" y="26" width="32" height="3" fill={INK} />
                <rect x="84" y="34" width="24" height="3" fill={INK} opacity="0.5" />
                <rect x="84" y="42" width="28" height="3" fill={INK} opacity="0.5" />
                <rect x="84" y="50" width="32" height="4" fill={BRAND} />
              </g>
            </g>
            <rect x="56" y="54" width="88" height="40" rx="10" fill="#fff" stroke={INK} strokeWidth="3" />
            <rect x="56" y="54" width="88" height="16" rx="8" fill={BONE} stroke={INK} strokeWidth="3" />
            <rect x="72" y="60" width="56" height="4" rx="2" fill={INK} />
            <circle cx="130" cy="82" r="4" fill={BRAND} />
          </Panneau>

          {/* 4. La livraison part, ou le client vient la chercher */}
          <Panneau n={4} delai={PAS * 3}>
            <path d="M30 80 C 70 80, 80 30, 170 30" fill="none" stroke={INK} strokeWidth="3" strokeDasharray="6 6" />
            <g transform="translate(30 80)"><circle r="8" fill={BRAND} stroke={INK} strokeWidth="3" /></g>
            <g className="v-travel" style={{ "--d": `${PAS * 3 + 0.3}s`, "--t": "1.6s", offsetPath: "path('M30 80 C 70 80, 80 30, 170 30')", offsetRotate: "0deg" } as React.CSSProperties}>
              <path d="M-10 -4 h20 l-2 20 h-16z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
              <path d="M-5 -4 v-3 a5 5 0 0 1 10 0 v3" fill="none" stroke={INK} strokeWidth="3" />
            </g>
            <Personne x={176} y={62} delai={PAS * 3 + 1.2} />
          </Panneau>

          {/* 5. Points, demande d'avis, texto de retour */}
          <Panneau n={5} delai={PAS * 4}>
            <Personne x={34} y={66} delai={PAS * 4} />
            <Bulle x={62} y={14} w={70} h={24} delai={PAS * 4 + 0.3}>
              {Array.from({ length: 5 }).map((_, i) => (
                <circle key={i} cx={74 + i * 12} cy="26" r="4.5" fill={i < 3 ? BRAND : BONE} stroke={INK} strokeWidth="1.5" />
              ))}
            </Bulle>
            {avis && (
              <Bulle x={62} y={44} w={70} h={22} delai={PAS * 4 + 0.7}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <polygon key={i} points="0,-5 1.5,-1.5 5,-1.5 2,1 3,5 0,2.5 -3,5 -2,1 -5,-1.5 -1.5,-1.5" transform={`translate(${74 + i * 12} 55) scale(0.8)`} fill={BRAND} stroke={INK} strokeWidth="1" />
                ))}
              </Bulle>
            )}
            <Bulle x={62} y={avis ? 72 : 48} w={126} h={26} delai={PAS * 4 + 1.1} rouge>
              <text x="70" y={(avis ? 72 : 48) + 16} fontFamily={FONT} fontSize="7.5" fontWeight="700" fill="#fff">Points doublés ce soir.</text>
            </Bulle>
          </Panneau>

          {/* 6. Le texto du soir et le Texto du Lundi */}
          <Panneau n={6} delai={PAS * 5}>
            <Personne x={170} y={66} delai={PAS * 5} rouge />
            <Bulle x={14} y={18} w={126} h={26} delai={PAS * 5 + 0.3}>
              <text x="22" y="34" fontFamily={FONT} fontSize="7.5" fontWeight="700" fill={INK}>Ce soir : 7 commandes directes.</text>
            </Bulle>
            <Bulle x={14} y={54} w={140} h={36} delai={PAS * 5 + 0.8} rouge>
              <text x="22" y="69" fontFamily={FONT} fontSize="7.5" fontWeight="700" fill="#fff">Lundi : 31 commandes, 12 nouveaux</text>
              <text x="22" y="81" fontFamily={FONT} fontSize="7.5" fontWeight="700" fill="#fff">clients, 486 $ rapportés.</text>
            </Bulle>
          </Panneau>
        </div>

        <ol className="mt-6 grid gap-x-6 gap-y-2 text-sm leading-snug text-ink/80 sm:grid-cols-2 lg:grid-cols-3">
          {etapes.map((e, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-script text-xl leading-none text-brand">{i + 1}</span>
              <span>{fr(!avis && e.sansAvis ? e.sansAvis : e.texte)}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-2xl border-l-4 border-brand pl-5 font-display text-lg font-black leading-snug">
          {fr(SCENE.sousScene)}
        </p>
      </div>
    </AnimerAuDefilement>
  );
}
