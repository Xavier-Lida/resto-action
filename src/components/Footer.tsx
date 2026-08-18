import Image from "next/image";
import { EMAIL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

/* Le pied de page suit la langue de la page qui le rend. Il était rendu par la
   mise en page racine, donc partout à l'identique : il en est descendu pour
   pouvoir parler anglais sur /en.

   Ses liens de section sont ABSOLUS (`/#approche`), parce qu'il apparaît aussi
   sur /confidentialite où un simple fragment ne mènerait nulle part. D'où le
   préfixe `t.racine` : sans lui, un anglophone retomberait sur la page
   française. La politique de confidentialité, elle, n'existe qu'en français —
   son lien ne prend donc pas le préfixe. */
export default function Footer({ t }: { t: Textes }) {
  const lien = (ancre: string) => `${t.racine}/#${ancre}`;

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
          <a href={lien("approche")} className="hover:text-white transition-colors">
            {t.pied.approche}
          </a>
          <a href={lien("mission")} className="hover:text-white transition-colors">
            {t.pied.mission}
          </a>
          <a href={lien("histoire")} className="hover:text-white transition-colors">
            {t.pied.histoire}
          </a>
          <a href={lien("faq")} className="hover:text-white transition-colors">
            {t.pied.faq}
          </a>
          <a href="/confidentialite" className="hover:text-white transition-colors">
            {t.pied.confidentialite}
          </a>
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
          <a
            href={`${t.racine}/contact`}
            className="hover:text-white transition-colors"
          >
            {t.pied.ceduler}
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="hover:text-white transition-colors"
          >
            {EMAIL}
          </a>
          <p>{t.pied.ville}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-5 text-xs">
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
        </div>
      </div>
    </footer>
  );
}
