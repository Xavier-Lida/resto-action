import type { NextRequest } from "next/server";
import { PARTENAIRES_REFERENTS, REFERE_UN_RESTO } from "@/lib/contenu/references";
import { assainirProvenance } from "@/lib/provenance";
import { normaliserCode, trouverReferent } from "@/lib/references/codes";
import { referentDe, signalerReference, type EvenementReference } from "@/lib/references/envoi";
import { pageDeLaRequete } from "@/lib/references/lien";

/* LES TROIS FORMULAIRES DE /refere-un-resto.

     « presente »   : Présente-nous quelqu'un  → reference.recue
     « lien »       : Je veux mon lien         → lien.demande
     « partenaire » : Devenir partenaire       → partenaire.candidature

   Tout part par signalerReference (CRM, sinon courriel à l'équipe). Si rien
   n'est passé, on répond une erreur : le formulaire montre notre numéro.

   LE TEXTE DU CONSENTEMENT VIENT DU SERVEUR, jamais du navigateur : le
   formulaire n'envoie qu'un « oui », et c'est ici qu'on copie le texte exact
   de references.ts avec l'heure du serveur. */
export const runtime = "nodejs";

const SANS_CACHE = { "Cache-Control": "no-store" };
const COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const texte = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const ouNull = (v: string) => v || null;
const refus = (code: string, statut = 400) => Response.json({ erreur: code }, { status: statut, headers: SANS_CACHE });
const telOk = (t: string) => t.replace(/\D/g, "").length >= 10;

const tentatives = new Map<string, number[]>();
function tropDeTentatives(ip: string): boolean {
  const maintenant = Date.now();
  const recentes = (tentatives.get(ip) ?? []).filter((t) => maintenant - t < 10 * 60_000);
  recentes.push(maintenant);
  if (tentatives.size > 500) tentatives.clear();
  tentatives.set(ip, recentes);
  return recentes.length > 10;
}

export async function POST(requete: NextRequest): Promise<Response> {
  let c: Record<string, unknown>;
  try {
    c = (await requete.json()) as Record<string, unknown>;
  } catch {
    return refus("invalide");
  }
  if (texte(c.piege, 100)) return Response.json({ ok: true }, { headers: SANS_CACHE });
  const ip = requete.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
  if (tropDeTentatives(ip)) return refus("trop", 429);

  const base = {
    langue: c.langue === "en" ? ("en" as const) : ("fr" as const),
    page: pageDeLaRequete(requete, "/refere-un-resto"),
    provenance: assainirProvenance(c.provenance),
  };
  const maintenant = new Date().toISOString();
  let evenement: EvenementReference;

  if (c.action === "presente") {
    const toi = {
      nom: texte(c.toiNom, 120),
      entreprise: texte(c.toiEntreprise, 160),
      courriel: texte(c.toiCourriel, 160).toLowerCase(),
      telephone: texte(c.toiTelephone, 40),
      code: texte(c.toiCode, 30),
    };
    const lui = {
      resto: texte(c.restoNom, 160),
      prenom: texte(c.prenom, 80),
      nom: texte(c.nom, 80),
      telephone: texte(c.telephone, 40),
      courriel: texte(c.courriel, 160).toLowerCase(),
      ville: texte(c.ville, 80),
    };
    const representant = texte(c.representant, 120);
    if (!toi.nom || !toi.entreprise) return refus("champs");
    if (!(COURRIEL.test(toi.courriel) || telOk(toi.telephone))) return refus("champs");
    if (!lui.resto) return refus("champs");
    // Un des deux moyens de contact du resto, et valide.
    if (!(COURRIEL.test(lui.courriel) || telOk(lui.telephone))) return refus("champs");
    if (c.consentement !== true) return refus("consentement");

    // Un code inconnu est ignoré (pas d'erreur), mais l'équipe voit ce qui a été tapé.
    const referent = trouverReferent(toi.code);
    evenement = {
      ...base,
      type: "reference.recue",
      source: representant ? "representant" : "formulaire",
      referent: referent ? { ...referentDe(referent), representant: representant || referent.representant || null } : null,
      refere: {
        resto_nom: lui.resto,
        contact_prenom: ouNull(lui.prenom),
        contact_nom: ouNull(lui.nom),
        telephone: ouNull(lui.telephone),
        courriel: COURRIEL.test(lui.courriel) ? lui.courriel : null,
        ville: ouNull(lui.ville),
      },
      consentement_contact: { donne: true, texte: REFERE_UN_RESTO.presenteNous.consentement, horodatage: maintenant },
      referent_contact: {
        nom: toi.nom,
        entreprise: toi.entreprise,
        courriel: COURRIEL.test(toi.courriel) ? toi.courriel : null,
        telephone: ouNull(toi.telephone),
        code_saisi: toi.code && !referent ? (normaliserCode(toi.code) ?? toi.code) : null,
      },
    };
  } else if (c.action === "lien") {
    const d = { nom: texte(c.nom, 120), resto: texte(c.resto, 160), courriel: texte(c.courriel, 160).toLowerCase(), telephone: texte(c.telephone, 40) };
    if (!d.nom || !d.resto || !COURRIEL.test(d.courriel)) return refus("champs");
    evenement = { ...base, type: "lien.demande", source: "formulaire", referent: null, demandeur: { ...d, telephone: ouNull(d.telephone) } };
  } else if (c.action === "partenaire") {
    const facons = Array.isArray(c.facons)
      ? c.facons.filter((f): f is string => typeof f === "string" && PARTENAIRES_REFERENTS.candidature.facons.some((x) => x.id === f))
      : [];
    const d = {
      entreprise: texte(c.entreprise, 160),
      ce_qu_elle_vend: texte(c.ceQuElleVend, 200),
      nom: texte(c.nom, 120),
      fonction: texte(c.fonction, 120),
      courriel: texte(c.courriel, 160).toLowerCase(),
      telephone: texte(c.telephone, 40),
      restos_clients_approx: texte(c.restosApprox, 40),
      regions: texte(c.regions, 200),
      facon_de_referer: facons,
    };
    if (!d.entreprise || !d.nom || !COURRIEL.test(d.courriel) || !telOk(d.telephone)) return refus("champs");
    if (c.consentement !== true) return refus("consentement");
    evenement = {
      ...base,
      type: "partenaire.candidature",
      source: "formulaire",
      referent: null,
      candidat: d,
      consentement_contact: { donne: true, texte: PARTENAIRES_REFERENTS.candidature.consentement, horodatage: maintenant },
    };
  } else {
    return refus("invalide");
  }

  // On attend le résultat : si rien n'est passé, le visiteur doit le savoir.
  const resultat = await signalerReference(evenement);
  if (resultat === "echec") return refus("envoi", 502);
  return Response.json({ ok: true }, { headers: SANS_CACHE });
}
