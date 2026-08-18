import Image from "next/image";
import Link from "next/link";
import { EMAIL, MISE_A_JOUR, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

/* Le pied de page suit la langue de la page qui le rend. Il était rendu par la
   mise en page racine, donc partout à l'identique : il en est descendu pour
   pouvoir parler anglais sur /en.

   Ses liens de section sont ABSOLUS (`/#approche`), parce qu'il apparaît aussi
   sur /confidentialite où un simple fragment ne mènerait nulle part. D'où le
   préfixe `t.racine` : sans lui, un anglophone retomberait sur la page
   française. La politique de confidentialité fait exception : ses deux
   adresses ne se déduisent pas l'une de l'autre (/confidentialite et
   /en/privacy), elle voyage donc avec son chemin dans le dictionnaire. */
export default function Footer({ t }: { t: Textes }) {
  const lien = (ancre: string) => `${t.racine}/#${ancre}`;

  /* La date de mise à jour est formatée ICI, dans la langue de la page. Écrite
     à la main dans les deux dictionnaires, elle aurait fini par dire deux
     dates différentes ; une seule constante ISO et un formatage par langue ne
     peuvent pas diverger. Midi UTC pour que le jour affiché ne bascule pas
     d'un fuseau à l'autre. */
  const miseAJour = new Date(`${MISE_A_JOUR}T12:00:00Z`).toLocaleDateString(
    t.htmlLang,
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <footer className="bg-ink text-white/60">
      <div className="mx-auto max-w-6xl px-5 py-12 grid gap-10 md:grid-cols-3 text-sm">
        <div className="space-y-4">
          {/* Le logo original, posé sur une plaque blanche comme la
              languette de la hero : « Resto » est noir, illisible à nu
              sur le fond sombre. */}
          <div className="w-fit rounded-xl bg-white px-4 py-2.5">
            <Image
              src="/logo-marque.png"
              alt={t.nav.logoAlt}
              width={1012}
              height={128}
              draggable={false}
              className="h-6 w-auto"
            />
          </div>
          <p>{t.pied.tagline}</p>
        </div>
        <nav className="flex flex-col gap-2" aria-label={t.pied.aria}>
          <Link
            href={t.nav.plateformeHref}
            className="hover:text-white transition-colors"
          >
            {t.pied.plateforme}
          </Link>
          <Link href={lien("approche")} className="hover:text-white transition-colors">
            {t.pied.approche}
          </Link>
          <Link href={lien("mission")} className="hover:text-white transition-colors">
            {t.pied.mission}
          </Link>
          <Link href={lien("histoire")} className="hover:text-white transition-colors">
            {t.pied.histoire}
          </Link>
          <Link href={lien("faq")} className="hover:text-white transition-colors">
            {t.pied.faq}
          </Link>
          <Link
            href={t.nav.blogueHref}
            className="hover:text-white transition-colors"
          >
            {t.pied.blogue}
          </Link>
          <Link
            href={t.pied.confidentialiteHref}
            className="hover:text-white transition-colors"
          >
            {t.pied.confidentialite}
          </Link>
        </nav>
        <div className="flex flex-col gap-2">
          <a
            href={PHONE_HREF}
            className="font-bold text-white/80 hover:text-white transition-colors"
          >
            {PHONE_DISPLAY}
          </a>
          {/* Mène à /contact plutôt qu'à l'agenda Google dans un onglet neuf :
              cette page est maintenant l'adresse de la prise de rendez-vous, et
              elle laisse le choix d'appeler plutôt que de céduler. */}
          <Link
            href={`${t.racine}/contact`}
            className="hover:text-white transition-colors"
          >
            {t.pied.ceduler}
          </Link>
          <a
            href={`mailto:${EMAIL}`}
            className="hover:text-white transition-colors"
          >
            {EMAIL}
          </a>
          {/* L'adresse remplace la ville seule : c'est le « A » du NAP, et
              c'est ce qui manquait au référencement local. Un `address` plutôt
              qu'un `p` — l'élément existe exactement pour ça, et il englobe le
              bloc de coordonnées au complet. */}
          <address className="not-italic">{t.pied.adresse}</address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-x-6 gap-y-2 px-5 py-5 text-xs">
          <p>
          {t.pied.droits.replace("{annee}", String(new Date().getFullYear()))}{" "}
          <a
            href="https://studioslt.com"
            target="_blank"
            rel="noopener"
            className="font-bold text-white/80 underline transition-colors hover:text-white"
          >
            Studios LT
          </a>
          {t.pied.droitsFin}
          </p>
          {/* Le signal de fraîcheur. Aucune date n'apparaissait nulle part sur
              l'accueil : un moteur ne pouvait pas distinguer une page écrite
              hier d'une page laissée là depuis trois ans. */}
          <p>{t.pied.miseAJour.replace("{date}", miseAJour)}</p>
        </div>
      </div>
    </footer>
  );
}
