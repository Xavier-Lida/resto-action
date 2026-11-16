import { Clock, Megaphone, ShoppingBag, Users } from "lucide-react";
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
      { gros: "48", unite: "h", nom: "Ton site et ton app à ton nom", ligne: "prêts à prendre des commandes" },
      { gros: `${c.pub}`, unite: "$", nom: "De pub payés par nous", ligne: "pour aller chercher tes clients" },
      { gros: `${c.commandes}`, unite: "commandes", nom: "Visées dès ta 1re semaine", ligne: "chez toi, pas sur une plateforme" },
      { gros: "100", unite: "%", nom: "Tes clients sont à toi", ligne: "leurs noms, leurs numéros" },
    ],
  },
  en: {
    titre: "In 4 numbers",
    chiffres: (c: Chiffres) => [
      { gros: "48", unite: "h", nom: "Your site and your app, under your name", ligne: "ready to take orders" },
      { gros: `$${c.pub}`, unite: "", nom: "In ads paid by us", ligne: "to go get your customers" },
      { gros: `${c.commandes}`, unite: "orders", nom: "Targeted in your first week", ligne: "with you, not on a platform" },
      { gros: "100", unite: "%", nom: "Your customers are yours", ligne: "their names, their numbers" },
    ],
  },
};

/* 4 cartes : rouge, sable, sable, bleu. Au cellulaire (2 × 2), ça donne un
   damier; à l'ordi, une rangée symétrique. Le chiffre en haut, le texte en
   bas, toutes les cartes de la même hauteur. */
const STYLES = [
  { carte: "bg-gradient-to-br from-hero to-brand text-white", trait: "bg-white/70", ligne: "text-white/80", icone: "bg-white/15 text-white" },
  { carte: "bg-bone text-ink", trait: "bg-brand", ligne: "text-ink/60", icone: "bg-white text-brand" },
  { carte: "bg-bone text-ink", trait: "bg-ciel", ligne: "text-ink/60", icone: "bg-white text-[#3d8bf0]" },
  { carte: "bg-gradient-to-br from-ciel via-[#3d8bf0] to-[#5b5ff0] text-white", trait: "bg-white/70", ligne: "text-white/80", icone: "bg-white/15 text-white" },
];
const ICONES = [Clock, Megaphone, ShoppingBag, Users];

export default function ChiffresLancement({ langue = "fr" }: { langue?: Langue }) {
  const { COMMANDES_VISEES_7_JOURS, PUB_LANCEMENT } = contenuLancement(langue);
  const { typo: fr } = formats(langue);
  const T = TEXTES[langue];
  return (
    <section className="bg-white px-3 md:px-5 lg:px-6" aria-label={T.titre}>
      <ul className="mx-auto grid max-w-6xl list-none grid-cols-2 gap-3 py-12 md:gap-4 md:px-5 md:py-16 lg:grid-cols-4">
        {T.chiffres({ pub: PUB_LANCEMENT, commandes: COMMANDES_VISEES_7_JOURS }).map((c, k) => {
          const st = STYLES[k];
          const Icone = ICONES[k];
          return (
            <li key={c.nom} className="min-w-0">
              <Reveal delay={Math.min(k, 3) as 0 | 1 | 2 | 3} className="h-full">
                <div className={`flex h-full min-h-[13.5rem] flex-col justify-between gap-4 rounded-[1.75rem] p-5 md:min-h-[15rem] md:p-7 ${st.carte}`}>
                  <div className="flex items-start justify-between gap-2">
                    {/* Une unité courte (h, $, %) suit le chiffre; un mot (« commandes ») passe dessous. */}
                    <p className="font-display font-black leading-none tracking-tight">
                      <span className="text-[2.6rem] md:text-6xl">{c.gros}</span>
                      {c.unite.length <= 2 ? (
                        c.unite && <span className="ml-1 text-lg md:text-2xl">{c.unite}</span>
                      ) : (
                        <span className="mt-1.5 block text-lg md:text-2xl">{c.unite}</span>
                      )}
                    </p>
                    <span className={`hidden size-9 shrink-0 place-items-center rounded-full sm:grid ${st.icone}`}>
                      <Icone className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                  <div>
                    <span aria-hidden="true" className={`block h-1 w-8 rounded-full ${st.trait}`} />
                    <p className="mt-3 font-black leading-snug md:text-lg">{fr(c.nom)}</p>
                    <p className={`mt-1 text-sm leading-snug ${st.ligne}`}>{fr(c.ligne)}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
