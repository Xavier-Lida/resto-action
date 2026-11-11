import Image from "next/image";
import Link from "next/link";
import { colonnesProduit } from "@/lib/contenu/pieces";
import { EMAIL, MISE_A_JOUR, PHONE_DISPLAY, PHONE_HREF, YOUTUBE_URL } from "@/lib/site";

const ARTICLES_FR = [
  { slug: "/blogue/ce-que-coutent-les-apps-de-livraison", titre: "Ce que coûtent les apps de livraison" },
  { slug: "/blogue/fiche-google-business-restaurant", titre: "Ta fiche Google, réglée" },
  { slug: "/blogue/avoir-plus-avis-google-restaurant", titre: "Plus d'avis Google, honnêtement" },
];
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

  const en = t.htmlLang.startsWith("en");
  const produits = colonnesProduit(en ? "en" : "fr");
  const articles = t.htmlLang.startsWith("fr") ? ARTICLES_FR : [];
  const lienPied = "transition-colors hover:text-ink";

  return (
    <footer className="bg-white text-ink">
      {/* À LA OWNER : le logo et les deux boutons, puis chaque pièce du Système
          en gros, chacune vers sa page; ensuite ressources, entreprise et
          joindre. Une pièce pas prête au lancement n'apparaît pas. */}
      <div className="mx-auto max-w-6xl border-t border-ink/10 px-5 pb-10 pt-14 md:pt-20">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Image
            src="/logo-marque.png"
            alt={t.nav.logoAlt}
            width={1012}
            height={128}
            draggable={false}
            className="h-8 w-auto md:h-9"
          />
          <div className="flex flex-wrap gap-3">
            <Link href={en ? "/en/reserve" : "/reserver"} className="rounded-2xl bg-brand px-6 py-3.5 font-black text-white transition hover:bg-ink">
              {en ? "Reserve your spot" : "Réserve ta place"}
            </Link>
            <Link href={en ? "/en#calculateur" : "/#calculateur"} className="rounded-2xl bg-bone px-6 py-3.5 font-black transition hover:bg-ink hover:text-white">
              {en ? "Calculate your number" : "Calcule ton chiffre"}
            </Link>
          </div>
        </div>

        {produits.length > 0 && (
          <nav aria-label={en ? "The New Customer System" : "Le Système Nouveaux Clients"} className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {produits.map((c) => (
              <div key={c.titre}>
                <p className="text-sm font-bold text-ink/50">{c.titre}</p>
                <ul className="mt-5 grid list-none gap-3.5">
                  {c.liens.map((l) => (
                    <li key={l.href + l.nom}>
                      <Link href={l.href} className="font-display text-lg font-black tracking-tight transition-colors hover:text-brand md:text-xl">
                        {l.nom}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        )}

        <div className="mt-16 grid gap-10 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <nav aria-label={t.pied.aria} className="flex flex-col gap-3">
            <p className="font-bold text-ink/50">{en ? "Resources" : "Ressources"}</p>
            <Link href={t.nav.plateformeHref} className={lienPied}>{t.pied.plateforme}</Link>
            <Link href={t.nav.blogueHref} className={lienPied}>{t.pied.blogue}</Link>
            {articles.map((a) => (
              <Link key={a.slug} href={a.slug} className={lienPied}>{a.titre}</Link>
            ))}
          </nav>
          <nav aria-label={en ? "Company" : "Entreprise"} className="flex flex-col gap-3">
            <p className="font-bold text-ink/50">{en ? "Company" : "Entreprise"}</p>
            <Link href={lien("histoire")} className={lienPied}>{t.pied.histoire}</Link>
            <Link href={en ? "/en/faq" : "/faq"} className={lienPied}>{t.pied.faq}</Link>
            <a href={YOUTUBE_URL} target="_blank" rel="noopener" className={lienPied}>{t.pied.youtube}</a>
            <Link href={en ? "/en/referrals" : "/refere-un-resto"} className={lienPied}>{en ? "Referral program" : "Réfère un resto"}</Link>
            <Link href={en ? "/en/founder-terms" : "/conditions-fondateur"} className={lienPied}>{en ? "Terms" : "Conditions"}</Link>
            <Link href={t.pied.confidentialiteHref} className={lienPied}>{t.pied.confidentialite}</Link>
          </nav>
          <div className="flex flex-col gap-3">
            <p className="font-bold text-ink/50">{en ? "Contact us" : "Nous joindre"}</p>
            <a href={PHONE_HREF} className="font-bold transition-colors hover:text-brand">{PHONE_DISPLAY}</a>
            <Link href={`${t.racine}/contact`} className={lienPied}>{t.pied.ceduler}</Link>
            <a href={`mailto:${EMAIL}`} className={lienPied}>{EMAIL}</a>
            <address className="not-italic text-ink/70">{t.pied.adresse}</address>
          </div>
          <p className="text-ink/60">{t.pied.tagline}</p>
        </div>
      </div>
      <div className="border-t border-ink/10 text-ink/60">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-x-6 gap-y-2 px-5 py-5 text-xs">
          <p>
          {t.pied.droits.replace("{annee}", String(new Date().getFullYear()))}{" "}
          <a
            href="https://studioslt.com"
            target="_blank"
            rel="noopener"
            className="font-bold text-ink underline transition-colors hover:text-brand"
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
