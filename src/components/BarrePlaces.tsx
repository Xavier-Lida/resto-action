/* « 10 places fondateurs par ville · 500 $ au lieu de 1 000 $ ».

   C'était une barre « Il reste X places dans ta ville » : le site ne connaît pas
   la ville du visiteur, le chiffre était tenu à la main et faux pour presque
   tout le monde. On garde la limite, qui est vraie, et le prix, qui est la
   vraie raison d'agir maintenant, sans compteur.

   Les deux morceaux passent à la ligne proprement au cellulaire au lieu de
   couper la phrase au milieu. `ton` suit le fond : « clair » pour un texte
   blanc sur fond foncé, « sombre » pour un texte encre sur fond clair. */
export default function BarrePlaces({
  modele,
  prix,
  ton = "clair",
  aligne = "centre",
  className = "",
}: {
  /** La limite, ex. « 10 places fondateurs par ville ». */
  modele: string;
  /** Le prix fondateur, ex. « 500 $ au lieu de 1 000 $ ». */
  prix?: string;
  ton?: "clair" | "sombre";
  aligne?: "centre" | "gauche";
  className?: string;
}) {
  const point = ton === "clair" ? "bg-white" : "bg-brand";
  const second = ton === "clair" ? "text-white/75" : "text-ink/60";

  return (
    <p
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-black ${
        aligne === "centre" ? "justify-center text-center" : "justify-start"
      } ${className}`}
    >
      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${point}`} />
        {modele}
      </span>
      {prix && <span className={`font-semibold ${second}`}>{prix}</span>}
    </p>
  );
}
