import BarreNav from "@/components/BarreNav";
import Footer from "@/components/Footer";
import { EMAIL, PHONE_DISPLAY } from "@/lib/site";
import { CONDITIONS_VERSION, type ConditionsFondateur } from "@/lib/contenu/conditions-fondateur";
import type { Textes } from "@/lib/textes/fr";

/* Les conditions de la place fondateur, partagées par les deux langues.
   Même forme que PageConfidentialite : `t` pour la barre et le pied, `c` pour
   le texte lui-même (src/lib/contenu/conditions-fondateur.ts). */
export default function PageConditions({ t, c }: { t: Textes; c: ConditionsFondateur }) {
  const date = new Date(`${CONDITIONS_VERSION}T12:00:00Z`).toLocaleDateString(t.htmlLang, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <BarreNav t={t} />
      <main className="flex-1" lang={t.htmlLang}>
        <div className="mx-auto max-w-2xl px-5 py-20 md:py-28">
          <p className="text-xs font-black uppercase tracking-widest text-brand">{c.surTitre}</p>
          <h1 className="mt-3 text-3xl md:text-5xl font-black leading-tight tracking-tight">{c.titre}</h1>
          <p className="mt-7 text-lg leading-relaxed text-ink/75">{c.intro}</p>

          <div className="mt-12 space-y-10 leading-relaxed text-ink/75">
            {c.sections.map(({ titre, texte }) => (
              <section key={titre}>
                <h2 className="text-xl font-black text-ink">{titre}</h2>
                <p className="mt-3">{texte}</p>
              </section>
            ))}

            <p>{c.questions.replace("{courriel}", EMAIL).replace("{tel}", PHONE_DISPLAY)}</p>
            <p className="text-sm text-ink/50">{c.version.replace("{date}", date)}</p>
          </div>
        </div>
      </main>
      <Footer t={t} />
    </>
  );
}
