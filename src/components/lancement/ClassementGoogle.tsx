"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Phone, Search, Star } from "lucide-react";
import BoutonReserver from "@/components/BoutonReserver";
import BoutonAppel from "@/components/lancement/BoutonAppel";
import type { Candidat, ResultatClassement } from "@/lib/classement-google";
import { ordinal } from "@/lib/classement";
import { CLASSEMENT as K, libelleType, libelleTypes, remplir, type ReponseTest } from "@/lib/contenu/classement";
import { lienAppel, lienReservation } from "@/lib/contenu/grand-lancement";
import { entier, fr } from "@/lib/format";
import { garderContact, mesurerLead, nouvelIdLead, usePreremplir } from "@/lib/leads/client";
import { lireProvenance } from "@/lib/provenance";
import { formaterTelephone } from "@/lib/telephone";

/* TON RANG SUR GOOGLE, juste sous le héro.

   Le proprio tape le nom de son resto, choisit sa fiche (la recherche de
   « Trouve ton resto »), et voit son rang dans sa ville pour le nombre d'avis
   Google, parmi les restos du même type. Lisible en 10 secondes sur un
   cellulaire : son rang, les 2 devant lui, les 3 premiers, la règle.

   Ensuite : le test du bouton « Commander en ligne », le classement complet
   par texto (case obligatoire). Une seule action par écran : la suite, la
   ligne de la mise en service et les 2 boutons n'arrivent qu'après l'envoi.

   CE QUE CETTE SECTION NE FAIT PAS, exprès : pas de page de palmarès, pas
   d'adresse par resto, pas de bouton de partage (le classement ne s'affiche
   qu'à celui qui cherche, après son clic, jamais dans le HTML de la page) ;
   aucune promesse de faire monter ses avis ou son rang ; pas un mot sur ce que
   le bouton « Commander en ligne » lui coûte ; pas de compte à rebours ni de
   compteur de places ; pas de logo de Google, seulement l'attribution en texte.

   Français seulement. Textes et table des types : src/lib/contenu/classement.ts.
   `ligneMise` vient du serveur (miseEnService()) : vide dès le 19 décembre, et
   la ligne disparaît. */

const champ =
  "mt-1 w-full rounded-xl border-2 border-bone bg-white px-3.5 py-3 text-base font-bold outline-none transition-colors focus:border-brand";
const etiquette = "block text-sm font-bold text-ink/70";
const carte = "rounded-[2rem] bg-white p-6 shadow-xl shadow-ink/5 md:p-8";

type Etat =
  | { etape: "depart" }
  | { etape: "recherche" }
  | { etape: "choix"; candidats: Candidat[] }
  | { etape: "calcul"; candidat: Candidat }
  | { etape: "resultat"; candidat: Candidat; classement: ResultatClassement }
  | { etape: "message"; texte: string };

type Ligne = ResultatClassement["premiers"][number];
type Oublis = { prenom?: string; cellulaire?: string; textos?: string };

function note(n: number | null): string {
  return n === null ? "" : n.toLocaleString("fr-CA", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/** « 1 240 avis · note 4,5 », ou « 12 avis · pas encore de note ». */
function chiffres(avis: number, n: number | null): string {
  return `${entier(avis)} ${K.avis} · ${n === null ? K.sansNote : `${K.note} ${note(n)}`}`;
}

function messageDe(statut: number): string {
  if (statut === 429) return K.trop;
  if (statut === 404) return K.introuvable;
  return K.panne;
}

export default function ClassementGoogle({ ligneMise }: { ligneMise: string }) {
  const id = useId();
  const [nom, setNom] = useState("");
  /** Le nom tel qu'il a été tapé pour la recherche en cours : c'est lui qui part au CRM. */
  const [nomCherche, setNomCherche] = useState("");
  const [etat, setEtat] = useState<Etat>({ etape: "depart" });
  // Une réponse en retard d'une recherche abandonnée ne doit rien afficher.
  const tour = useRef(0);
  const zoneResultat = useRef<HTMLDivElement>(null);

  const [test, setTest] = useState<ReponseTest | null>(null);
  const [lead, setLead] = useState({ prenom: "", cellulaire: "" });
  const [textos, setTextos] = useState(false);
  const [piege, setPiege] = useState("");
  const [envoi, setEnvoi] = useState<"idle" | "envoi" | "fait" | "erreur">("idle");
  // Ce qui manque, dit à côté du champ : le bouton, lui, n'est jamais éteint.
  const [oublis, setOublis] = useState<Oublis>({});
  /* L'identifiant du lead, créé ici et gardé pour ce resto : un 2e clic ou un
     nouvel essai renvoie le même, et le serveur n'envoie pas 2 fois. */
  const idLead = useRef("");
  /* Déjà rempli ailleurs sur le site (le Calcul, la réservation…) : le prénom,
     le cellulaire et le nom du resto reviennent. Gardé sur son appareil
     seulement, et il peut tout changer. */
  usePreremplir((garde) => {
    setLead((l) => ({ prenom: l.prenom || garde.prenom || "", cellulaire: l.cellulaire || garde.cellulaire || "" }));
    setNom((n) => n || garde.resto || "");
  });

  async function appeler(corps: Record<string, unknown>): Promise<{ statut: number; donnees: Record<string, unknown> }> {
    const r = await fetch("/api/classement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corps),
      cache: "no-store",
    });
    const donnees = (await r.json().catch(() => ({}))) as Record<string, unknown>;
    return { statut: r.status, donnees };
  }

  async function chercher(e: FormEvent) {
    e.preventDefault();
    const q = nom.trim();
    if (q.length < 2) return;
    const moi = ++tour.current;
    setNomCherche(q);
    setEtat({ etape: "recherche" });
    setTest(null);
    setEnvoi("idle");
    setOublis({});
    try {
      const { statut, donnees } = await appeler({ action: "chercher", q });
      if (moi !== tour.current) return;
      if (statut !== 200) return setEtat({ etape: "message", texte: messageDe(statut) });
      const candidats = (donnees.candidats ?? []) as Candidat[];
      setEtat(candidats.length > 0 ? { etape: "choix", candidats } : { etape: "message", texte: K.introuvable });
    } catch {
      if (moi === tour.current) setEtat({ etape: "message", texte: K.panne });
    }
  }

  async function classer(candidat: Candidat) {
    const moi = ++tour.current;
    setEtat({ etape: "calcul", candidat });
    // Une autre fiche, un autre lead.
    idLead.current = "";
    try {
      const { statut, donnees } = await appeler({
        action: "classer",
        id: candidat.id,
        type: candidat.type,
        ville: candidat.ville,
        province: candidat.province,
        lat: candidat.lat,
        lng: candidat.lng,
      });
      if (moi !== tour.current) return;
      if (statut !== 200 || !donnees.classement) return setEtat({ etape: "message", texte: messageDe(statut) });
      setEtat({ etape: "resultat", candidat, classement: donnees.classement as ResultatClassement });
    } catch {
      if (moi === tour.current) setEtat({ etape: "message", texte: K.panne });
    }
  }

  // Le rang vient d'arriver : on l'amène à l'écran.
  const aResultat = etat.etape === "resultat";
  useEffect(() => {
    if (!aResultat) return;
    const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    zoneResultat.current?.scrollIntoView({ behavior: doux ? "smooth" : "auto", block: "start" });
  }, [aResultat]);

  async function envoyer(e: FormEvent) {
    e.preventDefault();
    if (etat.etape !== "resultat" || envoi === "envoi") return;
    const manque: Oublis = {};
    if (!lead.prenom.trim()) manque.prenom = K.prenomManquant;
    if (lead.cellulaire.replace(/\D/g, "").length < 10) manque.cellulaire = K.cellulaireManquant;
    // La case est obligatoire : sans elle, rien ne part.
    if (!textos) manque.textos = K.caseManquante;
    setOublis(manque);
    if (Object.keys(manque).length > 0) return;
    setEnvoi("envoi");
    idLead.current ||= nouvelIdLead();
    try {
      const r = await fetch("/api/classement/demande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idLead: idLead.current,
          prenom: lead.prenom,
          cellulaire: lead.cellulaire,
          consentementTextos: textos,
          resto: nomCherche,
          ville: etat.candidat.ville,
          type: etat.candidat.type,
          placeId: etat.candidat.id,
          // Le rang et le total tels qu'affichés : notre calcul, pour le texto de Guillaume.
          rang: etat.classement.rang,
          total: etat.classement.total,
          test,
          piege,
          provenance: lireProvenance() ?? undefined,
        }),
        keepalive: true,
      });
      setEnvoi(r.ok ? "fait" : "erreur");
      if (r.ok) {
        mesurerLead("classement");
        // Pour les autres formulaires du site, sur cet appareil seulement.
        garderContact({
          prenom: lead.prenom,
          cellulaire: lead.cellulaire,
          resto: nomCherche,
          ville: etat.candidat.ville,
          lieu: { id: etat.candidat.id, resto: nomCherche },
        });
      }
    } catch {
      setEnvoi("erreur");
    }
  }

  const occupe = etat.etape === "recherche" || etat.etape === "calcul";

  return (
    <section id={K.ancre} className="scroll-mt-24 bg-white px-3 pt-10 md:px-5 md:pt-16 lg:px-6">
      <div className="rounded-[2rem] bg-bone lg:rounded-[3rem]">
        <div className="mx-auto max-w-3xl px-5 py-12 md:py-20">
          <h2 className="font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">{fr(K.titre)}</h2>
          <p className="mt-3 text-lg text-ink/65">{fr(K.sousTitre)}</p>

          {/* A. L'ENTRÉE : la recherche de « Trouve ton resto ». */}
          <form
            onSubmit={chercher}
            className="mt-6 flex w-full flex-wrap gap-2 rounded-2xl bg-white p-2 shadow-xl shadow-ink/10 ring-1 ring-ink/10"
          >
            <label htmlFor={`${id}-resto`} className="sr-only">
              {K.champLibelle}
            </label>
            <input
              id={`${id}-resto`}
              name="resto"
              type="text"
              autoComplete="organization"
              enterKeyHint="search"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder={K.champExemple}
              className="min-w-0 flex-1 basis-56 bg-transparent px-3 py-3 text-base text-ink outline-none placeholder:text-ink/50"
            />
            <button
              type="submit"
              disabled={occupe}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 font-black text-white transition hover:bg-ink active:scale-95 disabled:opacity-60 sm:w-auto"
            >
              <Search className="size-4" aria-hidden="true" />
              {K.boutonChercher}
            </button>
          </form>

          <div ref={zoneResultat} className="scroll-mt-24" aria-live="polite">
            {occupe && (
              <p className="mt-6 animate-pulse rounded-2xl bg-white px-5 py-4 text-sm font-bold text-ink/60">
                {etat.etape === "recherche" ? K.recherche : K.calcul}
              </p>
            )}

            {etat.etape === "message" && (
              <p role="status" className="mt-6 rounded-2xl bg-white px-5 py-4 font-bold text-ink">
                {fr(etat.texte)}
              </p>
            )}

            {/* Le proprio choisit sa fiche : un classement coûte une recherche, on ne devine pas. */}
            {etat.etape === "choix" && (
              <div className="mt-6">
                <p className="text-sm font-black text-ink/70">{fr(K.choisir)}</p>
                <div className="mt-2 grid gap-2">
                  {etat.candidats.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => void classer(c)}
                      className="rounded-2xl border-2 border-transparent bg-white px-4 py-3 text-left shadow-sm transition hover:border-brand focus-visible:border-brand focus-visible:outline-none"
                    >
                      <span className="block font-black">{c.nom}</span>
                      <span className="block truncate text-sm text-ink/60">{c.adresse}</span>
                    </button>
                  ))}
                </div>
                <Attribution className="mt-3" />
              </div>
            )}

            {etat.etape === "resultat" && <Resultat c={etat.classement} />}
          </div>

          {etat.etape === "resultat" && (
            <>
              {/* Un geste à faire cette semaine. */}
              <div className="mt-4 rounded-[2rem] bg-ink p-6 text-white md:p-8">
                <p className="text-sm font-bold text-white/65">{K.gesteTitre}</p>
                <p className="mt-1 font-display text-2xl font-black leading-tight md:text-3xl">{fr(K.geste)}</p>
              </div>

              {/* D. LE PROBLÈME SUIVANT : le test du bouton. On ne dit jamais ce qu'il coûte. */}
              <div className={`${carte} mt-4`}>
                <p id={`${id}-test`} className="font-display text-xl font-black leading-snug md:text-2xl">
                  {fr(K.test)}
                </p>
                <div role="group" aria-labelledby={`${id}-test`} className="mt-5 grid gap-2 sm:grid-cols-3">
                  {K.testReponses.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setTest(r.id)}
                      aria-pressed={test === r.id}
                      className={`rounded-full px-4 py-3 text-base font-black transition ${test === r.id ? "bg-brand text-white" : "bg-bone text-ink hover:bg-ink hover:text-white"}`}
                    >
                      {r.libelle}
                    </button>
                  ))}
                </div>
              </div>

              {/* E. APRÈS : le classement complet par texto. */}
              <div className={`${carte} mt-4`}>
                <h3 className="font-display text-xl font-black md:text-2xl">{K.formulaireTitre}</h3>
                {envoi === "fait" ? (
                  <p role="status" className="mt-5 rounded-2xl bg-bone px-5 py-4 font-display text-lg font-black">
                    {fr(remplir(K.apresEnvoi, { prenom: lead.prenom.trim() }))}
                  </p>
                ) : (
                  <form noValidate onSubmit={envoyer} className="relative mt-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className={etiquette}>
                        {K.champs.prenom}
                        <input
                          className={champ}
                          type="text"
                          required
                          autoComplete="given-name"
                          value={lead.prenom}
                          aria-invalid={oublis.prenom ? true : undefined}
                          onChange={(e) => {
                            setLead({ ...lead, prenom: e.target.value });
                            setOublis((o) => ({ ...o, prenom: undefined }));
                          }}
                        />
                        <Oubli texte={oublis.prenom} />
                      </label>
                      <label className={etiquette}>
                        {K.champs.cellulaire}
                        <input
                          className={champ}
                          type="tel"
                          required
                          autoComplete="tel"
                          value={lead.cellulaire}
                          aria-invalid={oublis.cellulaire ? true : undefined}
                          onChange={(e) => {
                            setLead({ ...lead, cellulaire: formaterTelephone(e.target.value) });
                            setOublis((o) => ({ ...o, cellulaire: undefined }));
                          }}
                        />
                        <Oubli texte={oublis.cellulaire} />
                      </label>
                    </div>
                    <input type="text" name="site" value={piege} onChange={(e) => setPiege(e.target.value)} tabIndex={-1} aria-hidden="true" autoComplete="off" className="absolute left-[-9999px] size-px opacity-0" />
                    {/* La case est obligatoire : sans elle, le formulaire ne part pas. */}
                    <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-ink/80">
                      <input
                        type="checkbox"
                        required
                        checked={textos}
                        onChange={(e) => {
                          setTextos(e.target.checked);
                          setOublis((o) => ({ ...o, textos: undefined }));
                        }}
                        className="mt-0.5 size-5 shrink-0 accent-brand"
                      />
                      <span>{fr(K.consentement)}</span>
                    </label>
                    <div className="pl-8">
                      <Oubli texte={oublis.textos} />
                    </div>
                    <p className="mt-2 pl-8 text-sm">
                      <Link href={K.lienConfidentialite.href} className="font-bold text-ink/70 underline underline-offset-4 hover:text-brand">
                        {K.lienConfidentialite.label}
                      </Link>
                    </p>
                    {envoi === "erreur" && (
                      <p role="alert" className="mt-4 rounded-2xl bg-brand/10 px-4 py-3 text-sm font-bold text-brand">
                        {fr(K.erreurEnvoi)}
                      </p>
                    )}
                    {/* Jamais éteint : un 2e clic pendant l'envoi est ignoré par envoyer(). */}
                    <button
                      type="submit"
                      aria-busy={envoi === "envoi"}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-lg font-black text-white shadow-[0_4px_0_0_var(--ombre-cta)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                    >
                      {K.boutonEnvoyer}
                    </button>
                  </form>
                )}
              </div>

              {/* UNE SEULE ACTION PAR ÉCRAN : la suite, la ligne de la mise en service et
                  les 2 boutons arrivent seulement après l'envoi, jamais à côté du formulaire. */}
              {envoi === "fait" && (
                <div className={`${carte} mt-4`}>
                  <p className="font-display text-xl font-black leading-snug md:text-2xl">{fr(K.suite)}</p>
                  {ligneMise && (
                    <p className="mt-5 rounded-2xl bg-brand/10 px-4 py-3 text-sm font-black text-brand">{fr(ligneMise)}</p>
                  )}
                  <div className="mt-6 flex flex-col gap-4">
                    <BoutonReserver href={lienReservation()} libelle={K.boutonReserver} taille="md" className="w-full text-ink [&>a]:w-full [&>a>span:first-child]:text-center" />
                    <BoutonAppel href={lienAppel()} ou="classement" className="w-full">
                      <Phone className="size-4" aria-hidden="true" />
                      {K.boutonAppel}
                    </BoutonAppel>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/** Ce qui manque, écrit juste sous le champ concerné. */
function Oubli({ texte }: { texte?: string }) {
  if (!texte) return null;
  return (
    <span role="alert" className="mt-1.5 block text-sm font-bold text-brand">
      {fr(texte)}
    </span>
  );
}

/* L'ATTRIBUTION QUE GOOGLE EXIGE, en texte (pas de logo sans y avoir droit) :
   « Google Maps », jamais traduit ni coupé sur deux lignes, en Roboto ou la
   police sans empattement du système, graisse 400, 14 px, gris #5E5E5E. */
function Attribution({ tiers = [], className = "" }: { tiers?: string[]; className?: string }) {
  return (
    <p
      className={`whitespace-nowrap text-[14px] font-normal not-italic leading-normal tracking-normal text-[#5E5E5E] ${className}`}
      style={{ fontFamily: "Roboto, Arial, sans-serif" }}
    >
      <span translate="no" lang="en">
        {K.attribution}
      </span>
      {tiers.map((t) => (
        <span key={t} translate="no">
          {", "}
          {t}
        </span>
      ))}
    </p>
  );
}

/* CE QU'IL VOIT : son rang, ses chiffres, les 2 devant lui, les 3 premiers, la
   règle. Tout ce qui vient de Google est dans UNE carte, avec l'attribution
   au bas de la même carte. */
function Resultat({ c }: { c: ResultatClassement }) {
  const types = libelleTypes(c.type, c.voisin);
  const [avantRang, apresRang] = (c.partiel ? K.phrasePartielle : K.phrase).split("{rang}");
  const valeurs = { resto: c.resto, total: entier(c.total), types, ville: c.ville };

  return (
    <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-xl shadow-ink/5 ring-1 ring-ink/10 md:p-8">
      {/* 1. Le rang, en une phrase. */}
      <p className="font-display text-xl font-black leading-snug tracking-tight md:text-3xl md:leading-tight">
        {fr(remplir(avantRang, valeurs))}
        <span className="text-brand">{ordinal(c.rang)}</span>
        {fr(remplir(apresRang, valeurs))}
      </p>
      <p className="mt-3 flex items-center gap-1.5 text-lg font-black tabular-nums">
        <Star className="size-5 shrink-0 fill-current text-brand" aria-hidden="true" />
        {chiffres(c.avis, c.note)}
      </p>
      {c.voisin && (
        <p className="mt-2 text-sm text-ink/60">
          {fr(remplir(K.elargi, { types: libelleType(c.type), ville: c.ville, voisins: libelleType(c.voisin) }))}
        </p>
      )}

      {/* 2. Les 2 juste devant, et l'écart. */}
      {c.devant.length > 0 ? (
        <div className="mt-6 border-t border-bone pt-5">
          <h3 className="text-sm font-black text-ink/60">{K.devantTitre}</h3>
          <ul className="mt-2 flex list-none flex-col gap-2">
            {c.devant.map((l) => (
              <Rangee key={l.rang} l={l} />
            ))}
          </ul>
          {c.manque !== null && (
            <p className="mt-4 rounded-2xl bg-brand/10 px-4 py-3 font-display text-lg font-black leading-snug text-brand">
              {fr(remplir(K.manque, { x: entier(c.manque), rang: ordinal(c.rang - 1) }))}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-6 rounded-2xl bg-brand/10 px-4 py-3 font-display text-lg font-black leading-snug text-brand">
          {fr(K.premier)}
          {c.avance !== null && ` ${fr(remplir(K.premierAvance, { x: entier(c.avance) }))}`}
        </p>
      )}

      {/* 3. Les 3 premiers. */}
      <div className="mt-6 border-t border-bone pt-5">
        <h3 className="text-sm font-black text-ink/60">{K.premiersTitre}</h3>
        <ul className="mt-2 flex list-none flex-col gap-2">
          {c.premiers.map((l) => (
            <Rangee key={l.rang} l={l} moi={l.rang === c.rang} />
          ))}
        </ul>
      </div>

      {/* 4. La règle, toujours visible, et l'attribution. */}
      <div className="mt-6 border-t border-bone pt-4">
        <p className="text-sm font-bold text-ink/70">{fr(remplir(K.regle, { date: c.date }))}</p>
        <Attribution tiers={c.attributions} className="mt-1" />
      </div>
    </div>
  );
}

function Rangee({ l, moi = false }: { l: Ligne; moi?: boolean }) {
  return (
    <li className={`flex min-w-0 items-center gap-3 rounded-2xl px-3 py-2.5 ${moi ? "bg-brand/10" : "bg-bone"}`}>
      <span className="w-9 shrink-0 font-display text-base font-black tabular-nums">{ordinal(l.rang)}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-black">
          {l.nom}
          {moi && <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-[0.65rem] font-black text-white">{K.toi}</span>}
        </span>
        <span className="block text-sm tabular-nums text-ink/65">{chiffres(l.avis, l.note)}</span>
      </span>
    </li>
  );
}
