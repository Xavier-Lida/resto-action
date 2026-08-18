"use client";

import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Phone,
  Video,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Buoy from "@/components/Buoy";
import { FUSEAU } from "@/lib/agenda";
import { EMAIL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import type { Textes } from "@/lib/textes/fr";

/* L'AGENDA MAISON. Il a remplacé l'iframe de Google.

   L'iframe marchait, mais elle était un pansement : aux couleurs de Google,
   son en-tête rogné au pixel près par une marge négative, incapable de
   demander le nom du restaurant, et anglaise en partie même côté français.
   Ici, chaque mot vient des dictionnaires et chaque bouton est du site.

   TROIS ÉTAPES, UNE SEULE CARTE. Choisir l'heure, laisser ses coordonnées,
   voir la confirmation. Elles se remplacent au même endroit plutôt que de
   s'empiler : la page ne saute pas sous le curseur, et sur téléphone on n'a
   jamais à défiler pour retrouver où on en était.

   TOUT L'AFFICHAGE EST EN HEURE DE L'EST, quel que soit le fuseau du visiteur.
   Un restaurateur de Montréal qui lit « 10 h » doit voir la même chose que
   Guillaume dans son agenda ; quelqu'un en voyage qui verrait « 7 h » se
   présenterait à la mauvaise heure au retour. D'où le `timeZone` forcé sur
   chaque formateur — c'est une décision, pas un oubli. */

type Etape = "chargement" | "choix" | "formulaire" | "envoi" | "confirme" | "panne";
type CleErreur = keyof Textes["agenda"]["erreurs"];

/* LE TÉLÉPHONE, MIS EN FORME À LA FRAPPE.

   Les gens tapent « 8199444661 », « 819-944-4661 », « 819 944 4661 » ou
   collent « +1 819 944 4661 ». Tout ça atterrissait tel quel dans l'événement,
   et Guillaume relisait dix formats différents avant de composer.

   ELLE NE BLOQUE RIEN, elle reformate. Un champ qui refuse une frappe est un
   champ dont on ne comprend pas le refus : ici, les chiffres sont retenus, la
   ponctuation est refaite, et ce qu'on ne sait pas lire passe intact.

   Le « 1 » d'en-tête n'est retiré qu'à ONZE chiffres : le retirer dès la
   première frappe ferait disparaître le chiffre sous les doigts de quelqu'un
   qui commence par l'indicatif de pays. Aucun indicatif régional nord-américain
   ne commence par 1, donc à onze chiffres il n'y a pas d'ambiguïté.

   Un numéro qui commence par « + » est laissé TEL QUEL : c'est un numéro
   étranger, et lui plaquer des parenthèses nord-américaines le rendrait faux. */
function formaterTelephone(brut: string): string {
  if (brut.trimStart().startsWith("+")) return brut.slice(0, 24);

  let chiffres = brut.replace(/\D/g, "");
  if (chiffres.length === 11 && chiffres.startsWith("1")) chiffres = chiffres.slice(1);
  chiffres = chiffres.slice(0, 10);

  // Les parenthèses n'arrivent qu'une fois l'indicatif complet : « (81 » sous
  // les doigts de quelqu'un qui tape encore, c'est une ponctuation qui commente.
  if (chiffres.length <= 3) return chiffres;
  if (chiffres.length <= 6) return `(${chiffres.slice(0, 3)}) ${chiffres.slice(3)}`;
  return `(${chiffres.slice(0, 3)}) ${chiffres.slice(3, 6)}-${chiffres.slice(6)}`;
}

const CHAMPS_VIDES = {
  nom: "",
  restaurant: "",
  courriel: "",
  telephone: "",
  sujet: "",
};

export default function Agenda({ t }: { t: Textes }) {
  const [etape, setEtape] = useState<Etape>("chargement");
  const [creneaux, setCreneaux] = useState<string[]>([]);
  const [jour, setJour] = useState<string | null>(null);
  // Le mois FEUILLETÉ, sous la forme « 2026-08 ». Null tant que le visiteur
  // n'a pas touché aux flèches : on lui ouvre alors le mois du premier jour
  // offert, ce qui évite un mois vide au premier regard.
  const [mois, setMois] = useState<string | null>(null);
  const [heure, setHeure] = useState<string | null>(null);
  const [champs, setChamps] = useState(CHAMPS_VIDES);
  const [piege, setPiege] = useState("");
  const [erreur, setErreur] = useState<CleErreur | null>(null);
  const [meet, setMeet] = useState<string | null>(null);

  /* La clé de regroupement est en `en-CA` — donc « 2026-09-14 » — même du côté
     français : elle ne s'affiche jamais, elle sert à trier et à comparer. Une
     date française comme clé (« 14 sept. ») trierait par ordre alphabétique. */
  const formats = useMemo(() => {
    const zone = { timeZone: FUSEAU } as const;
    return {
      cle: new Intl.DateTimeFormat("en-CA", {
        ...zone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      jour: new Intl.DateTimeFormat(t.htmlLang, {
        ...zone,
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      heure: new Intl.DateTimeFormat(t.htmlLang, {
        ...zone,
        hour: "numeric",
        minute: "2-digit",
      }),
      /* Sert UNIQUEMENT à ranger un créneau dans matin / après-midi / soirée.
         `hourCycle: "h23"` et pas `hour12: false` : ce dernier rend « 24 » à
         minuit selon les locales, ce qui ferait tomber minuit dans la soirée
         du jour d'avant. */
      heure24: new Intl.DateTimeFormat("en-GB", {
        ...zone,
        hour: "2-digit",
        hourCycle: "h23",
      }),
      complet: new Intl.DateTimeFormat(t.htmlLang, {
        ...zone,
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  }, [t.htmlLang]);

  const jours = useMemo(() => {
    const carte = new Map<string, string[]>();
    for (const creneau of creneaux) {
      const cle = formats.cle.format(new Date(creneau));
      const heures = carte.get(cle);
      if (heures) heures.push(creneau);
      else carte.set(cle, [creneau]);
    }
    return [...carte].map(([cle, heures]) => ({ cle, heures }));
  }, [creneaux, formats]);

  /* ÉCRITE EN `.then()` PLUTÔT QU'EN `async/await`, ET C'EST VOLONTAIRE.

     La même fonction en `await` place ses `setState` dans le corps direct de
     la fonction appelée par l'effet ci-dessous, ce que React refuse désormais
     (`react-hooks/set-state-in-effect`) : un rendu en cascade déclenché depuis
     un effet. En promesse, ils sont dans une closure — le cas que la règle
     autorise explicitement, « poser l'état quand un système extérieur
     répond ». C'est exactement ce qu'on fait.

     Elle ne pose pas non plus l'étape « chargement » : c'est déjà l'état
     initial, et son autre appelant (le rattrapage d'un créneau pris) la pose
     lui-même juste avant. */
  const charger = useCallback(() => {
    fetch("/api/agenda")
      .then(async (reponse) => {
        const donnees = await reponse.json();
        if (!reponse.ok) {
          setErreur((donnees.erreur as CleErreur) ?? "google");
          setEtape("panne");
          return;
        }
        setCreneaux(donnees.creneaux as string[]);
        setEtape("choix");
      })
      .catch(() => {
        setErreur("reseau");
        setEtape("panne");
      });
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  /* Le jour AFFICHÉ se déduit, il ne se stocke pas. `jour` ne retient que le
     choix explicite du visiteur ; tant qu'il n'a rien cliqué, on ouvre le
     premier jour offert — demander de choisir un jour avant de montrer la
     moindre heure, c'est un clic pour rien. Et si la liste a été rechargée
     entre-temps et que son jour n'existe plus, on retombe sur le premier au
     lieu d'afficher une grille vide. */
  const jourActif = jours.some((j) => j.cle === jour)
    ? jour
    : (jours[0]?.cle ?? null);

  /* ─── LE CALENDRIER ───

     TOUT CE QUI SUIT MANIPULE DES CHAÎNES « AAAA-MM-JJ », JAMAIS DES `Date`
     LOCALES. C'est la règle qui met la grille à l'abri des fuseaux : un jour
     civil n'a pas d'heure, donc pas de décalage possible. Quand il faut
     vraiment un `Date` — pour connaître un jour de la semaine ou faire écrire
     un nom de mois à `Intl` — on le construit en UTC et on le formate en UTC.
     Construire un `Date` local à partir d'un jour civil, c'est se retrouver la
     veille pour la moitié de la planète. */

  const parJour = useMemo(
    () => new Map(jours.map((j) => [j.cle, j.heures])),
    [jours],
  );

  // Les mois entre lesquels il y a quelque chose à voir. Au-delà, l'horizon
  // (21 jours) est vide : autant éteindre les flèches.
  const bornes = useMemo(() => {
    if (jours.length === 0) return null;
    return {
      debut: jours[0].cle.slice(0, 7),
      fin: jours[jours.length - 1].cle.slice(0, 7),
    };
  }, [jours]);

  // Même principe que `jourActif` : dérivé, pas stocké. Un mois hors bornes —
  // parce que la liste vient d'être rechargée — retombe sur le premier.
  const moisActif =
    bornes && mois && mois >= bornes.debut && mois <= bornes.fin
      ? mois
      : (bornes?.debut ?? null);

  const peutReculer = !!(bornes && moisActif && moisActif > bornes.debut);
  const peutAvancer = !!(bornes && moisActif && moisActif < bornes.fin);

  function feuilleter(pas: number) {
    if (!moisActif) return;
    const [a, m] = moisActif.split("-").map(Number);
    // Le mois 12 + 1 bascule tout seul sur janvier de l'année suivante.
    const d = new Date(Date.UTC(a, m - 1 + pas, 1));
    setMois(
      `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`,
    );
  }

  // Les initiales des jours, dans la langue de la page. Le 1er janvier 2024
  // était un lundi — d'où le point de départ, la semaine commençant le lundi.
  const initiales = useMemo(() => {
    const f = new Intl.DateTimeFormat(t.htmlLang, {
      timeZone: "UTC",
      weekday: "narrow",
    });
    return Array.from({ length: 7 }, (_, i) =>
      f.format(new Date(Date.UTC(2024, 0, 1 + i))),
    );
  }, [t.htmlLang]);

  const titreMois = useMemo(() => {
    if (!moisActif) return "";
    const [a, m] = moisActif.split("-").map(Number);
    return new Intl.DateTimeFormat(t.htmlLang, {
      timeZone: "UTC",
      month: "long",
      year: "numeric",
    }).format(new Date(Date.UTC(a, m - 1, 15)));
  }, [moisActif, t.htmlLang]);

  /* Les cases du mois : des `null` pour combler la première semaine, puis un
     jour civil par case. `Date.UTC(a, m, 0)` — le « jour zéro » du mois
     suivant — est le dernier jour du mois courant, y compris en février
     bissextile. */
  const grille = useMemo(() => {
    if (!moisActif) return [];
    const [a, m] = moisActif.split("-").map(Number);
    const nbJours = new Date(Date.UTC(a, m, 0)).getUTCDate();
    // getUTCDay() rend 0 pour dimanche ; on veut lundi en tête.
    const decalage = (new Date(Date.UTC(a, m - 1, 1)).getUTCDay() + 6) % 7;
    const cases: (string | null)[] = Array(decalage).fill(null);
    for (let j = 1; j <= nbJours; j++) {
      cases.push(`${moisActif}-${String(j).padStart(2, "0")}`);
    }
    return cases;
  }, [moisActif]);

  const etiquetteJour = useCallback(
    (cle: string) => {
      const [a, m, j] = cle.split("-").map(Number);
      return new Intl.DateTimeFormat(t.htmlLang, {
        timeZone: "UTC",
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(new Date(Date.UTC(a, m - 1, j)));
    },
    [t.htmlLang],
  );

  /* Matin, après-midi, soirée. Vingt créneaux d'affilée sont illisibles ; en
     trois paquets, l'œil trouve tout de suite la moitié de journée qui
     l'intéresse. Un paquet vide ne s'affiche pas — un titre « Soirée » sans
     rien dessous vaut moins que pas de titre du tout. */
  const groupes = useMemo(() => {
    const heures = jourActif ? (parJour.get(jourActif) ?? []) : [];
    const paquets = [
      { titre: t.agenda.matin, heures: [] as string[] },
      { titre: t.agenda.apresMidi, heures: [] as string[] },
      { titre: t.agenda.soiree, heures: [] as string[] },
    ];
    for (const creneau of heures) {
      const h = Number(formats.heure24.format(new Date(creneau)));
      paquets[h < 12 ? 0 : h < 17 ? 1 : 2].heures.push(creneau);
    }
    return paquets.filter((p) => p.heures.length > 0);
  }, [parJour, jourActif, formats, t.agenda]);

  async function reserver(evenement: React.FormEvent) {
    evenement.preventDefault();
    if (!heure) return;
    setEtape("envoi");
    setErreur(null);
    try {
      const reponse = await fetch("/api/agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...champs,
          message: champs.sujet,
          debut: heure,
          langue: t.code,
          piege,
        }),
      });
      const donnees = await reponse.json();
      if (!reponse.ok) {
        setErreur((donnees.erreur as CleErreur) ?? "google");
        /* Un créneau pris pendant qu'on remplissait le formulaire : on
           recharge la liste et on renvoie au choix. Laisser le visiteur devant
           un formulaire dont l'heure n'existe plus, c'est l'inviter à cliquer
           « Confirmer » une deuxième fois pour le même refus. */
        if (donnees.erreur === "pris") {
          setHeure(null);
          setEtape("chargement");
          charger();
        } else {
          setEtape("formulaire");
        }
        return;
      }
      setMeet((donnees.meet as string | null) ?? null);
      setEtape("confirme");
    } catch {
      setErreur("reseau");
      setEtape("formulaire");
    }
  }

  const messageErreur = erreur ? t.agenda.erreurs[erreur] : null;

  return (
    <div className="rounded-3xl bg-white p-6 text-ink shadow-xl md:p-8">
      {etape === "chargement" && (
        <div className="flex min-h-[380px] flex-col items-center justify-center gap-4">
          <Buoy className="w-16 animate-[spin_3s_linear_infinite]" />
          <p className="text-sm font-bold text-ink/60">{t.agenda.chargement}</p>
        </div>
      )}

      {/* La panne ne dit pas « erreur 502 » : elle tend le téléphone. Le site
          promet qu'on répond vite, et ce n'est pas au visiteur de payer le
          prix d'une API qui tousse. */}
      {(etape === "panne" || (etape === "choix" && jours.length === 0)) && (
        <div className="flex min-h-[380px] flex-col items-center justify-center gap-4 text-center">
          <Buoy className="w-14" />
          <p className="text-xl font-black tracking-tight">
            {etape === "panne" ? t.agenda.panneTitre : t.agenda.aucun}
          </p>
          {etape === "panne" && (
            <p className="max-w-xs text-sm text-ink/60">{t.agenda.panneTexte}</p>
          )}
          <a
            href={PHONE_HREF}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-black text-white transition-colors hover:bg-ink"
          >
            <Phone className="size-4" />
            {PHONE_DISPLAY}
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="text-sm font-bold text-ink/50 transition-colors hover:text-ink"
          >
            {EMAIL}
          </a>
        </div>
      )}

      {etape === "choix" && jours.length > 0 && (
        /* `@container` PLUTÔT QU'UNE MEDIA QUERY, et ce n'est pas un caprice.

           Ce composant vit à deux largeurs sur la MÊME page large : ~528 px
           dans la colonne de l'accueil, ~728 px sur /contact. Une media query
           regarde l'écran, verrait « grand » dans les deux cas, et écraserait
           la version étroite. Une requête de conteneur regarde la boîte du
           composant — la seule chose qui compte ici.

           LE SEUIL EST `@lg` (512 px) ET PAS MOINS. Deux colonnes réclament
           304 px pour un mois lisible (7 cases de 40 px), 176 px pour les
           heures et 32 px de gouttière. En dessous, la grille du mois est
           écrasée — c'était le défaut du seuil `@md` (448 px), qui laissait
           176 px au mois sur l'accueil, soit des cases de 22 px. */
        <div className="@container">
          <p className="text-sm font-bold text-ink/60">{t.agenda.duree}</p>

          <div className="mt-6 grid gap-7 @lg:grid-cols-[minmax(0,1fr)_minmax(0,11rem)] @lg:gap-8">
            {/* ─── Le mois ─── */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-brand">
                {t.agenda.choisirJour}
              </p>

              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => feuilleter(-1)}
                  disabled={!peutReculer}
                  aria-label={t.agenda.moisPrecedent}
                  className="grid size-8 shrink-0 place-items-center rounded-full transition-colors hover:bg-bone disabled:pointer-events-none disabled:opacity-25"
                >
                  <ChevronLeft className="size-5" />
                </button>
                {/* `aria-live` : sans lui, quelqu'un au lecteur d'écran change
                    de mois et rien ne le lui dit. */}
                <span
                  aria-live="polite"
                  className="font-display text-sm font-black capitalize tracking-tight"
                >
                  {titreMois}
                </span>
                <button
                  type="button"
                  onClick={() => feuilleter(1)}
                  disabled={!peutAvancer}
                  aria-label={t.agenda.moisSuivant}
                  className="grid size-8 shrink-0 place-items-center rounded-full transition-colors hover:bg-bone disabled:pointer-events-none disabled:opacity-25"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>

              {/* Plafonné pour ne pas ballonner : sans ce `max-w`, la grille étirée
                  sur toute la largeur de /contact donnerait des cases de 62 px,
                  des pastilles énormes avec un chiffre perdu au milieu. */}
              <div className="mt-3 grid max-w-[24rem] grid-cols-7 gap-1">
                {initiales.map((lettre, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className="pb-1 text-center text-[11px] font-black uppercase text-ink/30"
                  >
                    {lettre}
                  </span>
                ))}

                {grille.map((cle, i) => {
                  if (cle === null) return <span key={`vide-${i}`} />;
                  const offert = parJour.has(cle);
                  const choisi = cle === jourActif;
                  return (
                    <button
                      key={cle}
                      type="button"
                      /* `disabled` et pas seulement grisé : la tabulation doit
                         sauter les jours sans offre, sinon naviguer au clavier
                         dans un mois vide demande trente pressions pour rien. */
                      disabled={!offert}
                      onClick={() => setJour(cle)}
                      aria-pressed={choisi}
                      aria-label={`${etiquetteJour(cle)}${
                        offert ? `, ${parJour.get(cle)!.length}` : ""
                      }`}
                      className={`grid aspect-square place-items-center rounded-full text-sm tabular-nums transition-colors ${
                        choisi
                          ? "bg-brand font-black text-white"
                          : offert
                            ? "bg-bone font-black text-ink hover:bg-ink hover:text-white"
                            : "font-bold text-ink/20"
                      }`}
                    >
                      {Number(cle.slice(8))}
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 text-xs font-bold text-ink/40">
                {t.agenda.fuseau}
              </p>
            </div>

            {/* ─── Les heures du jour choisi ─── */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-brand">
                {t.agenda.choisirHeure}
              </p>
              {jourActif && (
                <p className="mt-3 flex h-8 items-center font-display text-sm font-black capitalize tracking-tight">
                  {formats.jour.format(new Date(parJour.get(jourActif)![0]))}
                </p>
              )}

              {/* La hauteur n'est bridée QU'EN DEUX COLONNES : là, une liste
                  qui s'allonge déséquilibrerait la carte à côté d'un mois de
                  hauteur fixe. Empilé sur téléphone, on laisse la page défiler
                  normalement — un cadre à défilement dans une page qui défile
                  déjà, c'est le meilleur moyen de rater la moitié des heures. */}
              <div className="mt-3 space-y-4 @lg:max-h-[24rem] @lg:overflow-y-auto @lg:pr-1">
                {groupes.map((groupe) => (
                  <div key={groupe.titre}>
                    <p className="sticky top-0 bg-white pb-1.5 text-[11px] font-black uppercase tracking-widest text-ink/30">
                      {groupe.titre}
                    </p>
                    <div className="grid grid-cols-3 gap-2 @lg:grid-cols-2">
                      {groupe.heures.map((creneau) => (
                        <button
                          key={creneau}
                          type="button"
                          onClick={() => {
                            setHeure(creneau);
                            setErreur(null);
                            setEtape("formulaire");
                          }}
                          className="rounded-full border-2 border-bone px-2 py-2.5 text-sm font-black tabular-nums transition-colors hover:border-brand hover:text-brand"
                        >
                          {formats.heure.format(new Date(creneau))}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {messageErreur && (
            <p className="mt-5 rounded-2xl bg-brand/10 px-4 py-3 text-sm font-bold text-brand">
              {messageErreur}
            </p>
          )}
        </div>
      )}

      {(etape === "formulaire" || etape === "envoi") && heure && (
        <form onSubmit={reserver}>
          <button
            type="button"
            onClick={() => {
              setEtape("choix");
              setErreur(null);
            }}
            className="inline-flex items-center gap-2 text-sm font-bold text-ink/50 transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            {t.agenda.retour}
          </button>

          <p className="mt-4 font-display text-xl font-black leading-snug tracking-tight">
            {formats.complet.format(new Date(heure))}
          </p>
          <p className="mt-1 text-sm font-bold text-ink/60">{t.agenda.duree}</p>

          <p className="mt-7 text-xs font-black uppercase tracking-widest text-brand">
            {t.agenda.coordonnees}
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Champ
              etiquette={t.agenda.nom}
              valeur={champs.nom}
              onChange={(v) => setChamps({ ...champs, nom: v })}
              autoComplete="name"
              requis
            />
            <Champ
              etiquette={t.agenda.restaurant}
              note={t.agenda.facultatif}
              valeur={champs.restaurant}
              onChange={(v) => setChamps({ ...champs, restaurant: v })}
              autoComplete="organization"
            />
            <Champ
              etiquette={t.agenda.courriel}
              type="email"
              valeur={champs.courriel}
              onChange={(v) => setChamps({ ...champs, courriel: v })}
              autoComplete="email"
              requis
            />
            <Champ
              etiquette={t.agenda.telephone}
              type="tel"
              valeur={champs.telephone}
              onChange={(v) =>
                setChamps({ ...champs, telephone: formaterTelephone(v) })
              }
              autoComplete="tel"
              requis
            />
          </div>

          <label className="mt-3 block">
            <span className="text-sm font-bold text-ink/70">
              {t.agenda.sujet}{" "}
              <span className="font-normal text-ink/40">
                ({t.agenda.facultatif})
              </span>
            </span>
            <textarea
              rows={3}
              value={champs.sujet}
              onChange={(e) => setChamps({ ...champs, sujet: e.target.value })}
              className="mt-1.5 w-full resize-none rounded-2xl border-2 border-bone px-4 py-3 outline-none transition-colors focus:border-brand"
            />
          </label>

          {/* Le piège. Invisible, hors du parcours au clavier, ignoré des
              lecteurs d'écran : un humain ne peut pas le remplir, un robot qui
              remplit tout ce qu'il trouve, oui. `autoComplete="off"` pour que
              le navigateur ne le remplisse pas non plus à sa place. */}
          <input
            type="text"
            name="site"
            value={piege}
            onChange={(e) => setPiege(e.target.value)}
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            className="absolute left-[-9999px] size-px opacity-0"
          />

          {messageErreur && (
            <p className="mt-4 rounded-2xl bg-brand/10 px-4 py-3 text-sm font-bold text-brand">
              {messageErreur}
            </p>
          )}

          <button
            type="submit"
            disabled={etape === "envoi"}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 font-black text-white transition-colors hover:bg-ink disabled:opacity-60"
          >
            {etape === "envoi" ? t.agenda.envoi : t.agenda.envoyer}
          </button>
        </form>
      )}

      {etape === "confirme" && heure && (
        <div className="flex min-h-[380px] flex-col items-center justify-center gap-4 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-brand text-white">
            <Check className="size-7" strokeWidth={3} />
          </span>
          <p className="font-display text-2xl font-black tracking-tight">
            {t.agenda.confirmeTitre}
          </p>
          <p className="font-black">{formats.complet.format(new Date(heure))}</p>
          <p className="max-w-sm text-sm text-ink/60">
            {t.agenda.confirmeTexte.replace("{courriel}", champs.courriel)}
          </p>
          {meet && (
            <a
              href={meet}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-full border-2 border-bone px-6 py-3 font-black transition-colors hover:border-brand hover:text-brand"
            >
              <Video className="size-4" />
              {t.agenda.meet}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function Champ({
  etiquette,
  note,
  valeur,
  onChange,
  type = "text",
  autoComplete,
  requis = false,
}: {
  etiquette: string;
  note?: string;
  valeur: string;
  onChange: (valeur: string) => void;
  type?: string;
  autoComplete?: string;
  requis?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-ink/70">
        {etiquette}
        {note && <span className="font-normal text-ink/40"> ({note})</span>}
      </span>
      <input
        type={type}
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={requis}
        className="mt-1.5 w-full rounded-2xl border-2 border-bone px-4 py-3 outline-none transition-colors focus:border-brand"
      />
    </label>
  );
}
