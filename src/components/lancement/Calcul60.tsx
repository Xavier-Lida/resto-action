"use client";

import { useEffect, useId, useMemo, useRef, useState, type FocusEvent, type FormEvent } from "react";
import Link from "next/link";
import { Phone, ShoppingBag } from "lucide-react";
import BoutonReserver from "@/components/BoutonReserver";
import CalculateurReleve from "@/components/lancement/CalculateurReleve";
import ChampResto, { Manque, type RestoChoisi } from "@/components/lancement/ChampResto";
import BoutonAppel from "@/components/lancement/BoutonAppel";
import { ANCRES, CALCUL_60 as K, lienAppel, lienReservation } from "@/lib/contenu/grand-lancement";
import {
  CALCUL_60_DEPART,
  COMMANDES_MAX,
  COMMANDES_MIN,
  COMMANDES_PAS,
  TAUX_60,
  borner60,
  calculer60,
  partCommission,
  sur5Ans,
  type Taux60,
} from "@/lib/calcul60";
import { argent, entier, fr, pourcent } from "@/lib/format";
import { garderContact, lieuGarde, mesurerLead, nouvelIdLead, usePreremplir } from "@/lib/leads/client";
import { mesurer } from "@/lib/mesure";
import { lireProvenance } from "@/lib/provenance";
import { dixChiffres, formaterTelephone } from "@/lib/telephone";

/* LE CALCUL 60 SECONDES, en premier dans la section du calculateur.

   LE BUT DE LA SECTION : que le resto laisse son cellulaire. UNE SEULE ACTION
   PAR ÉCRAN.

   Avant l'envoi : les 2 questions, la carte du chiffre et le formulaire
   (« Reçois ton dossier par texto »). Rien d'autre : ni « La suite », ni la
   mise en service, ni les boutons Réserver et Appeler.
   Après l'envoi : le formulaire laisse sa place à « C'est noté, {prénom}! »,
   puis « La suite », la ligne de la mise en service et les 2 boutons.
   « Pour ton chiffre exact : téléverse ton relevé. » reste un lien discret,
   en dernier, et ouvre le parcours du relevé (CalculateurReleve, inchangé).

   Français seulement : /en garde le calculateur du relevé. `seul` : le Calcul
   sur sa propre page (/calcul), avec le titre de la page. Textes : CALCUL_60
   dans src/lib/contenu/grand-lancement.ts. Calcul : src/lib/calcul60.ts.
   Mesure : src/lib/mesure.ts (aucune donnée personnelle).

   `ligneMise` vient du serveur (miseEnService()) : vide dès le 19 décembre,
   et la ligne disparaît. */

const champ =
  "mt-1 w-full rounded-xl border-2 bg-white px-3.5 py-3 text-base font-bold outline-none transition-colors focus:border-brand";
const etiquette = "block text-sm font-bold text-ink/70";
const carte = "rounded-[2rem] bg-white p-6 shadow-xl shadow-ink/5 md:p-8";

function num(s: string): number {
  return parseFloat(s.replace(/\s/g, "").replace(",", "."));
}

/** 30 → « 30 $ », 27,5 → « 27,50 $ ». */
function dollars(n: number): string {
  return argent(n, Number.isInteger(n) ? 0 : 2);
}

function mouvementReduit(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* Le chiffre monte ou descend en comptant, vite, quand sa cible change. Sans
   animation si l'appareil demande moins de mouvement : il saute à la cible. */
function useCompte(cible: number, duree = 350): number {
  const [valeur, setValeur] = useState(cible);
  const courant = useRef(cible);
  useEffect(() => {
    const depart = courant.current;
    if (depart === cible) return;
    const d = mouvementReduit() ? 0 : duree;
    const t0 = performance.now();
    let image = requestAnimationFrame(function pas(t) {
      const p = d === 0 ? 1 : Math.min(1, (t - t0) / d);
      const v = depart + (cible - depart) * (1 - Math.pow(1 - p, 3));
      courant.current = v;
      setValeur(v);
      if (p < 1) image = requestAnimationFrame(pas);
    });
    return () => cancelAnimationFrame(image);
  }, [cible, duree]);
  return valeur;
}

type CleErreur = "prenom" | "resto" | "ville" | "cellulaire" | "consentement";
type Erreurs = Partial<Record<CleErreur, string>>;
/** L'ordre des champs à l'écran : on amène le resto au premier qui manque. */
const ORDRE: CleErreur[] = ["prenom", "resto", "ville", "cellulaire", "consentement"];

export default function Calcul60({ ligneMise, seul = false }: { ligneMise: string; seul?: boolean }) {
  const id = useId();
  // Le chiffre retenu et ce qui est écrit dans la case : pendant qu'on tape,
  // la case peut être vide ou hors limites sans que la réponse saute.
  const [commandes, setCommandes] = useState<number>(CALCUL_60_DEPART.commandes);
  const [commandesTexte, setCommandesTexte] = useState(String(CALCUL_60_DEPART.commandes));
  const [panier, setPanier] = useState<number>(CALCUL_60_DEPART.panier);
  const [panierTexte, setPanierTexte] = useState(String(CALCUL_60_DEPART.panier));
  const [taux, setTaux] = useState<Taux60>(CALCUL_60_DEPART.taux);
  // Tant qu'il n'a touché à aucun chiffre, la carte porte l'étiquette « Exemple ».
  const [touche, setTouche] = useState(false);

  const [prenom, setPrenom] = useState("");
  const [resto, setResto] = useState<RestoChoisi>({ nom: "", ville: "", placeId: "" });
  const [restoLibre, setRestoLibre] = useState(false);
  const [cellulaire, setCellulaire] = useState("");
  const [textos, setTextos] = useState(false);
  const [piege, setPiege] = useState("");
  const [erreurs, setErreurs] = useState<Erreurs>({});
  const [envoi, setEnvoi] = useState<"idle" | "envoi" | "fait" | "erreur">("idle");
  // Un seul envoi, même s'il tape 2 fois.
  const enCours = useRef(false);
  /* L'identifiant du lead (la porte unique, src/lib/leads) : un nouvel essai
     ou un rechargement de l'envoi renvoie le même, et le serveur n'envoie pas 2 fois. */
  const idLead = useRef("");
  /* Déjà rempli ailleurs sur le site (le Classement, la réservation…) : le
     prénom, le resto, la ville et le cellulaire reviennent. Gardé sur son
     appareil seulement, et il peut tout changer. Avec l'identifiant Google
     gardé, sa fiche est déjà choisie ; sans lui, on ouvre les 2 champs libres
     plutôt que de relancer une recherche facturée par Google. */
  usePreremplir((garde) => {
    setPrenom((p) => p || garde.prenom || "");
    setCellulaire((c) => c || garde.cellulaire || "");
    if (!garde.resto || resto.nom) return;
    const placeId = lieuGarde(garde, garde.resto) ?? "";
    setResto({ nom: garde.resto, ville: garde.ville ?? "", placeId });
    if (!placeId) setRestoLibre(true);
  });
  const commence = useRef(false);

  const [releveOuvert, setReleveOuvert] = useState(false);
  const ancreReleve = useRef<HTMLDivElement>(null);

  // Ce qui est à l'écran, pour le chiffre collé en haut et la barre du bas.
  const zone = useRef<HTMLDivElement>(null);
  const questions = useRef<HTMLDivElement>(null);
  const chiffre = useRef<HTMLParagraphElement>(null);
  const formulaire = useRef<HTMLDivElement>(null);
  const bouton = useRef<HTMLButtonElement>(null);
  const apres = useRef<HTMLDivElement>(null);
  const [vue, setVue] = useState({ zone: false, questions: false, chiffre: true, bouton: false });
  const [saisie, setSaisie] = useState(false);

  const reponse = useMemo(() => calculer60({ commandes, panier, taux }), [commandes, panier, taux]);
  const part = partCommission(taux);
  // Le chiffre affiché compte jusqu'à sa cible, à la centaine comme elle.
  const parAnnee = argent(Math.round(useCompte(reponse.parAnnee) / 100) * 100);
  const parAnneeFinal = argent(reponse.parAnnee);
  const [avantX, apresX] = K.reponse.split("{x}");
  const fait = envoi === "fait";

  function aTouche() {
    if (touche) return;
    setTouche(true);
    mesurer("calcul_touche");
  }

  function saisirCommandes(texte: string) {
    setCommandesTexte(texte);
    const n = num(texte);
    if (Number.isFinite(n)) {
      setCommandes(borner60({ commandes: n, panier, taux }).commandes);
      aTouche();
    }
  }

  function saisirPanier(texte: string) {
    setPanierTexte(texte);
    const n = num(texte);
    if (Number.isFinite(n)) {
      setPanier(borner60({ commandes, panier: n, taux }).panier);
      aTouche();
    }
  }

  function descendreVers(el: Element | null) {
    el?.scrollIntoView({ behavior: mouvementReduit() ? "auto" : "smooth", block: "start" });
  }

  // Le relevé vient de s'ouvrir : on y descend.
  useEffect(() => {
    if (releveOuvert) descendreVers(ancreReleve.current);
  }, [releveOuvert]);

  // L'envoi a réussi : « C'est noté » prend la place du formulaire, on l'amène à l'écran.
  useEffect(() => {
    if (!fait) return;
    apres.current?.focus({ preventScroll: true });
    descendreVers(apres.current);
  }, [fait]);

  // Ce qui est à l'écran. `calcul_vu` part une fois, quand la section entre vraiment.
  useEffect(() => {
    let vu = false;
    const sousLaBarre = "-80px 0px 0px 0px";
    const paires: [Element | null, keyof typeof vue, IntersectionObserverInit][] = [
      [zone.current, "zone", { threshold: [0, 0.15] }],
      [questions.current, "questions", { rootMargin: sousLaBarre }],
      [chiffre.current, "chiffre", { rootMargin: sousLaBarre, threshold: 0.6 }],
      [bouton.current, "bouton", {}],
    ];
    const observateurs = paires.map(([el, cle, options]) => {
      if (!el) return null;
      const o = new IntersectionObserver(([entree]) => {
        if (!entree) return;
        const seuil = typeof options.threshold === "number" ? options.threshold : 0;
        const dedans = entree.isIntersecting && entree.intersectionRatio >= seuil - 0.01;
        setVue((v) => (v[cle] === dedans ? v : { ...v, [cle]: dedans }));
        if (cle === "zone" && !vu && entree.intersectionRatio >= 0.15) {
          vu = true;
          mesurer("calcul_vu");
        }
      }, options);
      o.observe(el);
      return o;
    });
    return () => observateurs.forEach((o) => o?.disconnect());
    // Le bouton du formulaire disparaît après l'envoi : on réobserve.
  }, [fait]);

  function corriger(cle: CleErreur) {
    setErreurs((e) => {
      if (!e[cle]) return e;
      const reste = { ...e };
      delete reste[cle];
      return reste;
    });
  }

  function valider(): Erreurs {
    const e: Erreurs = {};
    if (!prenom.trim()) e.prenom = K.manque.prenom;
    if (!resto.nom.trim()) e.resto = K.manque.resto;
    // Un nom tapé sans fiche choisie, ou les champs libres sans ville.
    else if (!resto.ville.trim()) e.ville = K.manque.ville;
    if (!cellulaire.trim()) e.cellulaire = K.manque.cellulaire;
    else if (!dixChiffres(cellulaire)) e.cellulaire = K.manque.cellulaireInvalide;
    if (!textos) e.consentement = K.manque.consentement;
    return e;
  }

  const idDe: Record<CleErreur, string> = {
    prenom: `${id}-prenom`,
    resto: `${id}-resto`,
    ville: `${id}-resto-ville`,
    cellulaire: `${id}-cellulaire`,
    consentement: `${id}-textos`,
  };

  async function envoyer(ev: FormEvent) {
    ev.preventDefault();
    if (enCours.current) return;
    const e = valider();
    // Il manque la ville : les 2 champs libres s'ouvrent, avec le nom déjà tapé.
    if (e.ville && !restoLibre) setRestoLibre(true);
    setErreurs(e);
    const premier = ORDRE.find((k) => e[k]);
    if (premier) {
      // Le temps que le champ de la ville s'affiche, s'il vient de s'ouvrir.
      requestAnimationFrame(() => document.getElementById(idDe[premier])?.focus());
      return;
    }

    enCours.current = true;
    setEnvoi("envoi");
    idLead.current ||= nouvelIdLead();
    try {
      const r = await fetch("/api/calcul-60", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idLead: idLead.current,
          prenom,
          resto: resto.nom,
          ville: resto.ville,
          placeId: resto.placeId,
          cellulaire,
          consentementTextos: textos,
          commandes,
          panier,
          taux,
          piege,
          provenance: lireProvenance() ?? undefined,
        }),
        keepalive: true,
      });
      if (r.ok) {
        setEnvoi("fait");
        mesurer("dossier_demande", { source: "calcul-60" });
        // L'événement « lead », le même pour toutes les sources, et le préremplissage des autres formulaires.
        mesurerLead("calcul-60");
        garderContact({
          prenom,
          resto: resto.nom,
          ville: resto.ville,
          cellulaire,
          ...(resto.placeId ? { lieu: { id: resto.placeId, resto: resto.nom } } : {}),
        });
      } else {
        setEnvoi("erreur");
        mesurer("calcul_envoi_echec");
      }
    } catch {
      setEnvoi("erreur");
      mesurer("calcul_envoi_echec");
    } finally {
      enCours.current = false;
    }
  }

  /* Le premier champ touché, et le clavier qui ne cache jamais le champ : au
     doigt, on ramène le champ au milieu de l'écran une fois le clavier monté. */
  function champPris(e: FocusEvent<HTMLElement>) {
    if (!commence.current) {
      commence.current = true;
      mesurer("calcul_formulaire_commence");
    }
    const cible = e.target;
    if (!(cible instanceof HTMLInputElement) || cible.type === "checkbox") return;
    setSaisie(true);
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    window.setTimeout(() => {
      if (document.activeElement === cible) {
        cible.scrollIntoView({ behavior: mouvementReduit() ? "auto" : "smooth", block: "center" });
      }
    }, 350);
  }

  const Titre = seul ? "h1" : "h2";
  // Au cellulaire : le chiffre collé en haut tant qu'il est dans les questions et que la carte est sortie de l'écran.
  const chiffreColle = vue.questions && !vue.chiffre;
  // Au cellulaire : la barre du bas mène au formulaire, tant qu'il n'est pas à l'écran. Plus rien après l'envoi.
  const barre = vue.zone && !vue.bouton && !fait && !saisie;
  const numeroEnClair = lienAppel().startsWith("tel:");

  return (
    <section id={ANCRES.calculateur.slice(1)} className="bg-white px-3 pb-3 md:px-5 md:pb-5 lg:px-6 lg:pb-6">
      <div className="rounded-[2rem] bg-bone lg:rounded-[3rem]">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <div ref={zone}>
            <Titre className="max-w-3xl font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">{fr(K.titre)}</Titre>
            <p className="mt-3 max-w-2xl text-lg text-ink/65">{fr(K.sousTitre)}</p>

            {/* A. LES 2 QUESTIONS À GAUCHE, LA CARTE DU CHIFFRE À DROITE (dessous au cellulaire). */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-stretch">
              <div ref={questions} className={carte}>
                <label htmlFor={`${id}-commandes`} className="block font-display text-lg font-black md:text-xl">
                  {K.question1}
                </label>
                <div className="mt-3 flex items-center gap-4">
                  <input
                    id={`${id}-commandes`}
                    type="range"
                    min={COMMANDES_MIN}
                    max={COMMANDES_MAX}
                    step={COMMANDES_PAS}
                    value={commandes}
                    onChange={(e) => {
                      setCommandes(Number(e.target.value));
                      setCommandesTexte(e.target.value);
                      aTouche();
                    }}
                    aria-describedby={`${id}-aide-curseur`}
                    style={{ "--rempli": `${((commandes - COMMANDES_MIN) / (COMMANDES_MAX - COMMANDES_MIN)) * 100}%` } as React.CSSProperties}
                    className="curseur-60 w-full min-w-0"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    aria-label={K.question1}
                    value={commandesTexte}
                    onChange={(e) => saisirCommandes(e.target.value)}
                    onBlur={() => setCommandesTexte(String(commandes))}
                    className="w-24 shrink-0 rounded-xl border-2 border-bone bg-white px-3 py-3 text-center text-xl font-black tabular-nums outline-none transition-colors focus:border-brand"
                  />
                </div>
                <p id={`${id}-aide-curseur`} className="mt-1 text-sm text-ink/60">
                  {fr(K.aideCurseur)}
                </p>

                <p id={`${id}-taux`} className="mt-8 font-display text-lg font-black md:text-xl">
                  {K.question2}
                </p>
                <div role="group" aria-labelledby={`${id}-taux`} aria-describedby={`${id}-aide-taux`} className="mt-4 flex gap-2">
                  {TAUX_60.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTaux(t);
                        aTouche();
                      }}
                      aria-pressed={taux === t}
                      className={`flex-1 rounded-full px-2 py-3 text-lg font-black tabular-nums transition ${taux === t ? "bg-brand text-white" : "bg-bone text-ink hover:bg-ink hover:text-white"}`}
                    >
                      {pourcent(t)}
                    </button>
                  ))}
                </div>
                <p id={`${id}-aide-taux`} className="mt-3 text-sm text-ink/60">
                  {fr(K.aideTaux)}
                </p>

                <label className="mt-8 flex flex-wrap items-center gap-2 text-sm text-ink/60">
                  {fr(K.panier)}
                  <input
                    type="text"
                    inputMode="decimal"
                    value={panierTexte}
                    onChange={(e) => saisirPanier(e.target.value)}
                    onBlur={() => setPanierTexte(String(panier).replace(".", ","))}
                    className="w-16 rounded-lg border-2 border-bone bg-white px-2 py-1.5 text-center text-base font-bold text-ink tabular-nums outline-none transition-colors focus:border-brand"
                  />
                  $
                </label>
              </div>

              {/* LA CARTE DU CHIFFRE : elle suit les curseurs, sans bouton. */}
              <div className="relative flex flex-col overflow-hidden rounded-[2rem] bg-ink p-7 text-white md:p-9">
                <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-brand/30 blur-3xl" />
                {!touche && (
                  <span className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white md:right-7 md:top-7">
                    {K.exemple}
                  </span>
                )}
                {/* La phrase complète pour les lecteurs d'écran; le chiffre qui compte est décoratif. */}
                <p className="sr-only" aria-live="polite">
                  {fr(K.reponse.replace("{x}", parAnneeFinal))}
                </p>
                <p ref={chiffre} className="relative" aria-hidden="true">
                  <span className="block text-lg font-bold text-white/75">{avantX.trim()}</span>
                  <span className={`mt-1 block font-display font-black tabular-nums ${parAnneeFinal.length > 9 ? "text-4xl md:text-5xl" : "text-5xl md:text-6xl"}`}>
                    {parAnnee}
                  </span>
                  <span className="mt-1 block text-lg font-bold text-white/75">{apresX.trim()}</span>
                </p>
                <p className="relative mt-5 font-display text-xl font-black">
                  {fr(K.parSemaine.replace("{y}", dollars(reponse.parSemaine)))}
                </p>
                <p className="relative mt-1 text-base font-bold text-white/85">
                  {fr(K.sur5Ans.replace("{z}", argent(sur5Ans(reponse))))}
                </p>
                <p className="relative mt-2 text-sm tabular-nums text-white/60">
                  {fr(
                    K.formule
                      .replace("{commandes}", entier(commandes))
                      .replace("{panier}", dollars(panier))
                      .replace("{taux}", pourcent(taux)),
                  )}
                </p>
                {/* Une rangée de sacs de commande : ceux qui partent en commission sont à la couleur de la marque. */}
                <div className="relative mt-6">
                  <p aria-hidden="true" className="flex flex-wrap gap-1.5">
                    {Array.from({ length: part.sur }, (_, i) => (
                      <ShoppingBag
                        key={i}
                        strokeWidth={2.25}
                        className={`size-6 ${i < part.parts ? "fill-brand/25 text-brand" : "text-white/30"}`}
                      />
                    ))}
                  </p>
                  <p className="mt-2 text-base font-bold">{fr(K.partCommission[Math.round(taux * 100)])}</p>
                </div>
                {taux === 0.2 && (
                  <p className="relative mt-5 border-l-4 border-brand pl-4 text-base font-bold">{fr(K.franc20)}</p>
                )}
                <p className="relative mt-auto pt-6 text-sm leading-relaxed text-white/80">{fr(K.avertissement)}</p>
              </div>
            </div>

            {/* B. LA SEULE ACTION : le dossier par texto. Toute la 2e rangée, plus rien à côté.
                Après l'envoi : « C'est noté », puis la suite et les 2 boutons. */}
            {!fait ? (
              <div ref={formulaire} className={`${carte} mt-6 scroll-mt-24`}>
                <h3 className="font-display text-xl font-black md:text-2xl">{K.formulaireTitre}</h3>
                <p className="mt-2 text-ink/70">{fr(K.formulaireAide)}</p>
                <form noValidate onSubmit={envoyer} onFocus={champPris} onBlur={() => setSaisie(false)} className="relative mt-6">
                  <div className="grid gap-4 md:grid-cols-3 md:items-start">
                    <label className={etiquette}>
                      {K.champs.prenom}
                      <input
                        id={idDe.prenom}
                        className={`${champ} ${erreurs.prenom ? "border-brand" : "border-bone"}`}
                        type="text"
                        autoComplete="given-name"
                        aria-invalid={!!erreurs.prenom}
                        aria-describedby={erreurs.prenom ? `${idDe.prenom}-erreur` : undefined}
                        value={prenom}
                        onChange={(e) => {
                          setPrenom(e.target.value);
                          corriger("prenom");
                        }}
                      />
                      {erreurs.prenom && <Manque id={`${idDe.prenom}-erreur`}>{fr(erreurs.prenom)}</Manque>}
                    </label>

                    <ChampResto
                      id={idDe.resto}
                      valeur={resto}
                      onChange={(v) => {
                        setResto(v);
                        if (v.nom.trim()) corriger("resto");
                        if (v.ville.trim()) corriger("ville");
                      }}
                      libre={restoLibre}
                      onLibre={setRestoLibre}
                      erreurResto={erreurs.resto && fr(erreurs.resto)}
                      erreurVille={erreurs.ville && fr(erreurs.ville)}
                    />

                    <div>
                      <label className={etiquette}>
                        {K.champs.cellulaire}
                        <input
                          id={idDe.cellulaire}
                          className={`${champ} ${erreurs.cellulaire ? "border-brand" : "border-bone"}`}
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          aria-invalid={!!erreurs.cellulaire}
                          aria-describedby={`${idDe.cellulaire}-aide${erreurs.cellulaire ? ` ${idDe.cellulaire}-erreur` : ""}`}
                          value={cellulaire}
                          onChange={(e) => {
                            setCellulaire(formaterTelephone(e.target.value));
                            corriger("cellulaire");
                          }}
                        />
                      </label>
                      {erreurs.cellulaire && <Manque id={`${idDe.cellulaire}-erreur`}>{fr(erreurs.cellulaire)}</Manque>}
                      <p id={`${idDe.cellulaire}-aide`} className="mt-1.5 text-sm text-ink/60">
                        {fr(K.aideCellulaire)}
                      </p>
                    </div>
                  </div>

                  <input type="text" name="site" value={piege} onChange={(e) => setPiege(e.target.value)} tabIndex={-1} aria-hidden="true" autoComplete="off" className="absolute left-[-9999px] size-px opacity-0" />

                  {/* La case reste décochée au départ. Sans elle, le bouton le dit et rien ne part. */}
                  <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-ink/80">
                    <input
                      id={idDe.consentement}
                      type="checkbox"
                      checked={textos}
                      aria-invalid={!!erreurs.consentement}
                      aria-describedby={erreurs.consentement ? `${idDe.consentement}-erreur` : undefined}
                      onChange={(e) => {
                        setTextos(e.target.checked);
                        corriger("consentement");
                      }}
                      className="mt-0.5 size-5 shrink-0 accent-brand"
                    />
                    <span>{fr(K.consentement)}</span>
                  </label>
                  <div className="pl-8">
                    {erreurs.consentement && <Manque id={`${idDe.consentement}-erreur`}>{fr(erreurs.consentement)}</Manque>}
                    <p className="mt-2 text-sm">
                      <Link href={K.lienConfidentialite.href} className="font-bold text-ink/70 underline underline-offset-4 hover:text-brand">
                        {K.lienConfidentialite.label}
                      </Link>
                    </p>
                  </div>

                  {envoi === "erreur" && (
                    <p role="alert" className="mt-5 rounded-2xl bg-brand/10 px-4 py-3 text-sm font-bold text-brand">
                      {fr(K.erreur)}
                    </p>
                  )}
                  {/* Jamais éteint : s'il manque quelque chose, on le dit à côté du champ.
                      `data-cta-reserver` : la barre « Réserve ta place » du site se tait dans cette section. */}
                  <button
                    ref={bouton}
                    type="submit"
                    data-cta-reserver
                    aria-busy={envoi === "envoi"}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none md:w-auto md:min-w-80 md:text-xl"
                  >
                    {envoi === "envoi" ? K.envoiEnCours : K.boutonEnvoyer}
                  </button>
                </form>
              </div>
            ) : (
              <div ref={apres} tabIndex={-1} className={`${carte} mt-6 scroll-mt-24 outline-none`}>
                <p role="status" className="rounded-2xl bg-bone px-5 py-4 font-display text-lg font-black md:text-xl">
                  {fr(K.apresEnvoi.replace("{prenom}", prenom.trim()))}
                </p>
                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start lg:gap-10">
                  <div>
                    <p className="font-display text-xl font-black leading-snug md:text-2xl">{fr(K.suite)}</p>
                    {/* La règle du 20 % : à 20 %, on ne parle pas de l'argent par commande. */}
                    {taux !== 0.2 && <p className="mt-3 text-ink/70">{fr(K.suiteCommission)}</p>}
                  </div>
                  <div>
                    {ligneMise && (
                      <p className="rounded-2xl bg-brand/10 px-4 py-3 text-sm font-black text-brand">{fr(ligneMise)}</p>
                    )}
                    <div className={`flex flex-col gap-4 ${ligneMise ? "mt-5" : ""}`}>
                      <div onClickCapture={() => mesurer("calcul_clic_reserver")}>
                        <BoutonReserver href={lienReservation()} libelle={K.boutonReserver} taille="md" className="w-full text-ink [&>a]:w-full [&>a>span:first-child]:text-center" />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2" onClickCapture={() => mesurer("calcul_clic_appel")}>
                        <BoutonAppel href={lienAppel()} ou="calcul-60" className="w-full md:w-auto md:flex-1">
                          <Phone className="size-4 shrink-0" aria-hidden="true" />
                          {K.boutonAppel}
                        </BoutonAppel>
                        {/* À l'ordinateur, un lien d'appel ne fait souvent rien : le numéro en clair. */}
                        {numeroEnClair && <span className="hidden text-base font-black tabular-nums text-ink md:inline">{K.telephone}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* EN DERNIER, DISCRET : le chiffre exact, par le relevé. Sous le formulaire
                avant l'envoi, sous les 2 boutons après. */}
            <p className="mt-8 text-center">
              <button
                type="button"
                aria-expanded={releveOuvert}
                onClick={() => (releveOuvert ? descendreVers(ancreReleve.current) : setReleveOuvert(true))}
                className="text-sm font-bold text-ink/70 underline underline-offset-4 hover:text-brand"
              >
                {fr(K.lienReleve)}
              </button>
            </p>
          </div>

          {/* Le parcours du relevé, celui qui existait déjà, tel quel. */}
          <div ref={ancreReleve} className="scroll-mt-24">
            {releveOuvert && (
              <div className="mt-10 border-t border-ink/10 pt-10">
                <CalculateurReleve integre />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AU CELLULAIRE : le chiffre reste visible pendant qu'il bouge le curseur. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-3 z-40 flex justify-center transition-[transform,opacity] duration-300 lg:hidden ${seul ? "top-3" : "top-[4.75rem]"} ${
          chiffreColle ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <p className="rounded-full bg-ink px-5 py-2.5 font-display text-base font-black tabular-nums text-white shadow-2xl ring-1 ring-white/10">
          {fr(K.reponseCompacte.replace("{x}", parAnnee))}
        </p>
      </div>

      {/* AU CELLULAIRE : la barre du bas descend au formulaire. Elle disparaît après l'envoi. */}
      <div
        inert={!barre}
        className={`fixed inset-x-3 bottom-3 z-30 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:hidden ${
          barre ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[130%] opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={() => descendreVers(formulaire.current)}
          className="w-full rounded-full bg-brand px-7 py-4 text-lg font-black text-white shadow-2xl ring-1 ring-white/20"
        >
          {K.barreCollante}
        </button>
      </div>
    </section>
  );
}
