import type { Textes } from "@/lib/textes/fr";

/* Le sélecteur de langue : deux pastilles, celle de la page courante marquée et
   non cliquable. Le lien mène à l'autre version de la page — un rechargement
   complet, ce qui est exactement ce qu'on attend d'un changement de langue.

   `ton` distingue les deux endroits où il se pose : la nav du héro, blanche sur
   le rouge de la carte, et le menu mobile, encre sur blanc. */
export default function SelecteurLangue({
  t,
  ton = "hero",
}: {
  t: Textes;
  ton?: "hero" | "menu" | "barre";
}) {
  /* Le ton « barre » est nu : deux mots séparés d'un filet, sans bordure ni
     pilule. Dans la barre de navigation, le sélecteur voisine le bouton
     « Appelle-nous » — lui donner une pilule bordée en faisait un second
     bouton, et l'œil ne savait plus laquelle des deux formes était l'action.
     Un réglage de langue n'est pas une action. */
  if (ton === "barre") {
    return (
      <div
        aria-label={t.langue.aria}
        className="flex items-center gap-1.5 text-sm font-bold"
      >
        <span aria-current="true" className="text-ink">
          {t.code.toUpperCase()}
        </span>
        <span aria-hidden="true" className="text-ink/25">
          |
        </span>
        <a
          href={t.autre.href}
          hrefLang={t.autre.code}
          title={t.autre.titre}
          className="text-ink/40 transition-colors hover:text-brand"
        >
          {t.autre.etiquette}
        </a>
      </div>
    );
  }

  const cadre =
    ton === "hero"
      ? "border-white/40 text-white"
      : "border-ink/15 text-ink";
  const actif =
    ton === "hero" ? "bg-white text-brand" : "bg-ink text-white";
  const inactif =
    ton === "hero" ? "hover:bg-white/15" : "hover:bg-bone";

  return (
    <div
      aria-label={t.langue.aria}
      className={`flex items-center gap-0.5 rounded-full border p-0.5 text-xs font-black ${cadre}`}
    >
      <span aria-current="true" className={`rounded-full px-2.5 py-1.5 ${actif}`}>
        {t.code.toUpperCase()}
      </span>
      <a
        href={t.autre.href}
        hrefLang={t.autre.code}
        title={t.autre.titre}
        className={`rounded-full px-2.5 py-1.5 transition-colors ${inactif}`}
      >
        {t.autre.etiquette}
      </a>
    </div>
  );
}
