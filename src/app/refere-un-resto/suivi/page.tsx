import type { Metadata } from "next";
import BarreNav from "@/components/BarreNav";
import Footer from "@/components/Footer";
import { Surtitre } from "@/components/lancement/ui";
import { NOM_PROGRAMME, REFERE_UN_RESTO, ROUTES_REFERENCES, SUIVI_ACTIF } from "@/lib/contenu/references";
import { FR } from "@/lib/textes/fr";

/* L'ESPACE DE SUIVI DU PARRAIN (/refere-un-resto/suivi).

   NON PUBLIÉ : hors du plan du site, aucun lien n'y mène, et les robots ne
   l'indexent pas. Tant que SUIVI_ACTIF est faux (le CRM n'est pas branché),
   il montre « bientôt ». Le vrai espace (connexion par lien magique, la vue
   `mes_references` du CRM) se branche ici, derrière le même interrupteur. */
export const metadata: Metadata = {
  title: `Ton suivi | ${NOM_PROGRAMME}`,
  robots: { index: false, follow: false },
};

export default function Suivi() {
  const B = REFERE_UN_RESTO.suiviBientot;
  return (
    <>
      <BarreNav t={FR} />
      <main className="flex-1" lang="fr-CA">
        <section className="bg-white px-3 pt-3 md:px-5 md:pt-5 lg:px-6 lg:pt-6">
          <div className="rounded-[2rem] bg-bone px-5 py-20 md:py-28 lg:rounded-[3rem]">
            <div className="mx-auto max-w-2xl text-center">
              <Surtitre>{NOM_PROGRAMME}</Surtitre>
              {/* SUIVI_ACTIF : le tableau des références remplacera ce bloc. */}
              <h1 className="mt-4 font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">{B.titre}</h1>
              <p className="mx-auto mt-5 max-w-xl text-lg text-ink/65">{B.texte}</p>
              {!SUIVI_ACTIF && (
                <a href={ROUTES_REFERENCES.page} className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 font-black text-white transition hover:bg-brand">
                  {NOM_PROGRAMME}
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer t={FR} />
    </>
  );
}
