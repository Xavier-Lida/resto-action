import Reveal from "@/components/Reveal";
import { contenuLancement, type Langue } from "@/lib/contenu/lancement";
import { formats } from "@/lib/format";

/* LES 4 CHIFFRES, SOUS LE HÉRO : le problème en un chiffre, puis notre
   réponse en trois chiffres qu'on garantit (48 h, 10 commandes, 90 jours).
   Peu de texte, de gros chiffres : on comprend en 3 secondes pourquoi
   changer, et qu'on prend le risque à notre place. */
/* Ce qu'on fait pour le resto, en 4 chiffres : rien sur les frais des
   plateformes (on ne veut pas qu'un « 30 % » soit lu comme notre prix), et
   pas les garanties (elles ont leur section plus bas). Les ventes d'abord. */
type Chiffres = { pub: number; commandes: number };
const TEXTES = {
  fr: {
    titre: "En 4 chiffres",
    chiffres: (c: Chiffres) => [
      { gros: "48", unite: "h", nom: "Ton app à ton nom", ligne: "prête à prendre des commandes" },
      { gros: `${c.pub}`, unite: "$", nom: "De pub payés par nous", ligne: "pour aller chercher tes clients" },
      { gros: `${c.commandes}`, unite: "commandes", nom: "Visées dès ta 1re semaine", ligne: "sur ton app, pas sur une plateforme" },
      { gros: "100", unite: "%", nom: "Tes clients sont à toi", ligne: "leurs noms, leurs numéros" },
    ],
  },
  en: {
    titre: "In 4 numbers",
    chiffres: (c: Chiffres) => [
      { gros: "48", unite: "h", nom: "Your own branded app", ligne: "ready to take orders" },
      { gros: `$${c.pub}`, unite: "", nom: "In ads paid by us", ligne: "to go get your customers" },
      { gros: `${c.commandes}`, unite: "orders", nom: "Targeted in your first week", ligne: "on your app, not a platform" },
      { gros: "100", unite: "%", nom: "Your customers are yours", ligne: "their names, their numbers" },
    ],
  },
};

export default function ChiffresLancement({ langue = "fr" }: { langue?: Langue }) {
  const { COMMANDES_VISEES_7_JOURS, PUB_LANCEMENT } = contenuLancement(langue);
  const { typo: fr } = formats(langue);
  const T = TEXTES[langue];
  return (
    <section className="bg-white" aria-label={T.titre}>
      <ul className="mx-auto grid max-w-6xl list-none grid-cols-2 gap-x-6 gap-y-10 px-5 py-14 md:py-20 lg:grid-cols-4 lg:gap-0">
        {T.chiffres({ pub: PUB_LANCEMENT, commandes: COMMANDES_VISEES_7_JOURS }).map((c, k) => (
          <li key={c.nom} className={`lg:px-8 ${k > 0 ? "lg:border-l lg:border-ink/10" : "lg:pl-0"}`}>
            <Reveal delay={Math.min(k, 3) as 0 | 1 | 2 | 3}>
              <p className={`flex flex-wrap items-baseline gap-x-1.5 font-display font-black tracking-tight ${"text-ink"}`}>
                <span className="text-5xl xl:text-6xl">{c.gros}</span>
                <span className="text-base sm:text-lg xl:text-2xl">{c.unite}</span>
              </p>
              <span aria-hidden="true" className={`mt-4 block h-1 w-10 rounded-full ${"bg-ciel"}`} />
              <p className={`mt-4 font-black leading-snug ${"text-ink"}`}>{fr(c.nom)}</p>
              <p className="mt-1 text-sm text-ink/55">{fr(c.ligne)}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
