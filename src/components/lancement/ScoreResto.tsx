/* LE SCORE PLATEFORME : une jauge simple, une aiguille, un chiffre.

   Pas une note inventée : il vient des frais du relevé (commissions et frais
   divisés par les ventes), sur une échelle fixe : 0 % de frais = 100,
   40 % ou plus = 0. Un resto qui laisse 27 % à la plateforme tombe à 33.
   L'échelle est écrite dans « Comment on calcule ». */
export const FRAIS_PLANCHER = 0.4;

export function scoreDepuisFrais(frais: number): number {
  return Math.round(100 * Math.max(0, Math.min(1, 1 - frais / FRAIS_PLANCHER)));
}

const couleurScore = (s: number) => (s < 50 ? "#ff3008" : s < 75 ? "#f59e0b" : "#19d3f0");

// L'arc fait 180° : t = 0 à gauche, t = 1 à droite. Rayon 40, centre (50, 50).
const R = 40;
const LONGUEUR = Math.PI * R;
const ARC = `M10 50 A${R} ${R} 0 0 1 90 50`;

export default function ScoreResto({ frais, ton = "sombre", className = "", langue = "fr" }: { frais: number; ton?: "sombre" | "clair"; className?: string; langue?: "fr" | "en" }) {
  const score = scoreDepuisFrais(frais);
  const couleur = couleurScore(score);
  const sombre = ton === "sombre";
  const angle = (score / 100) * 180;
  return (
    <div className={`text-center ${className}`} role="img" aria-label={langue === "en" ? `Platform score: ${score} out of 100` : `Score plateforme : ${score} sur 100`}>
      <svg viewBox="0 0 100 56" className="mx-auto w-full max-w-[10rem]" aria-hidden="true">
        <path d={ARC} fill="none" stroke={sombre ? "rgba(255,255,255,0.12)" : "#e6e6e3"} strokeWidth="7" strokeLinecap="round" />
        <path
          d={ARC}
          fill="none"
          stroke={couleur}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={LONGUEUR}
          strokeDashoffset={LONGUEUR * (1 - score / 100)}
          className="score-arc"
          style={{ ["--score-depart" as string]: String(LONGUEUR) }}
        />
        <g className="score-aiguille" style={{ transform: `rotate(${angle}deg)`, transformOrigin: "50px 50px", ["--score-angle" as string]: `${angle}deg` }}>
          <line x1="50" y1="50" x2="20" y2="50" stroke={sombre ? "#fff" : "#191919"} strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <circle cx="50" cy="50" r="4" fill={sombre ? "#fff" : "#191919"} />
      </svg>
      <p className="mt-1 font-display text-2xl font-black tabular-nums leading-none">
        {score}
        <span className={`text-xs ${sombre ? "text-white/45" : "text-ink/40"}`}>/100</span>
      </p>
    </div>
  );
}
