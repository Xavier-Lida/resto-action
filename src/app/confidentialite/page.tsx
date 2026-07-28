import type { Metadata } from "next";
import { CITY, EMAIL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité de Resto Action (Studio LT), conforme à la Loi 25 du Québec.",
  alternates: { canonical: "/confidentialite" },
};

export default function Confidentialite() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-5 py-20 md:py-28">
        <p className="text-xs font-black uppercase tracking-widest text-brand">
          Loi 25
        </p>
        <h1 className="mt-3 text-3xl md:text-5xl font-black leading-tight tracking-tight">
          Politique de confidentialité
        </h1>
        <p className="mt-7 text-lg leading-relaxed text-ink/75">
          On vous fait la leçon sur les données des clients. Ce serait mal
          venu de niaiser avec les vôtres. Voici, sans jargon, ce qu&apos;on
          fait (pis surtout ce qu&apos;on fait pas) avec vos renseignements sur
          ce site.
        </p>

        <div className="mt-12 space-y-10 leading-relaxed text-ink/75">
          <section>
            <h2 className="text-xl font-black text-ink">
              Renseignements recueillis
            </h2>
            <p className="mt-3">
              Ce site ne recueille aucun renseignement personnel. Pas de
              formulaire, pas de compte, pas de témoins (cookies)
              publicitaires. Si vous nous appelez ou nous écrivez, on utilise
              vos coordonnées uniquement pour vous répondre.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-ink">
              Statistiques de fréquentation
            </h2>
            <p className="mt-3">
              On mesure l&apos;achalandage du site avec Vercel Analytics, un
              outil de statistiques anonymes qui n&apos;utilise pas de témoins
              et ne permet pas de vous identifier personnellement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-ink">
              Responsable de la protection des renseignements personnels
            </h2>
            <p className="mt-3">
              Conformément à la Loi 25, le responsable de la protection des
              renseignements personnels est Guillaume Therrien. Pour toute
              question :{" "}
              <a
                href={`mailto:${EMAIL}`}
                className="font-bold text-ink underline hover:text-brand"
              >
                {EMAIL}
              </a>{" "}
              ou{" "}
              <a
                href={PHONE_HREF}
                className="font-bold text-ink underline hover:text-brand"
              >
                {PHONE_DISPLAY}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-ink">Vos droits</h2>
            <p className="mt-3">
              Vous pouvez demander l&apos;accès aux renseignements personnels
              qu&apos;on détiendrait sur vous, leur rectification ou leur
              suppression, en écrivant à l&apos;adresse ci-dessus. On vous
              répond dans les 30 jours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-ink">Qui nous sommes</h2>
            <p className="mt-3">
              Resto Action est un produit de Studio LT, {CITY}.
            </p>
          </section>

          <p className="text-sm text-ink/50">
            Dernière mise à jour : juillet 2026.
          </p>
        </div>
      </div>
    </main>
  );
}
