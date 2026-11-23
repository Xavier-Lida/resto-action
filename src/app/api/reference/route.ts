import { after, type NextRequest } from "next/server";
import { REFERENCES, REFERENCES_EN, type Profil } from "@/lib/contenu/references";
import { envoyerCourriel } from "@/lib/google/courriel";
import { signalerLead } from "@/lib/leads/envoi";
import { assainirProvenance } from "@/lib/provenance";
import { pageDeLaRequete, referenceDeLaRequete } from "@/lib/references/lien";
import { PHONE_DISPLAY } from "@/lib/site";

/* UNE DEMANDE DU PROGRAMME DE RÉFÉRENCES (/references).

   L'ancien formulaire, encore en ligne sur /en/referrals. Sans base de
   données : la demande passe par la porte unique des leads (signalerLead,
   source « contact »), qui envoie l'alerte [Lead] à l'équipe, et la personne
   reçoit son accusé de réception comme avant. Si rien n'est parti, on répond
   une erreur : une demande ne doit pas se perdre en silence. */
export const runtime = "nodejs";

const SANS_CACHE = { "Cache-Control": "no-store" };
const COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PROFILS: Profil[] = ["resto", "fournisseur", "pro", "autre"];

const texte = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const refus = (code: string, statut = 400) => Response.json({ erreur: code }, { status: statut, headers: SANS_CACHE });
const echapper = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const tentatives = new Map<string, number[]>();
function tropDeTentatives(ip: string): boolean {
  const maintenant = Date.now();
  const recentes = (tentatives.get(ip) ?? []).filter((t) => maintenant - t < 10 * 60_000);
  recentes.push(maintenant);
  if (tentatives.size > 500) tentatives.clear();
  tentatives.set(ip, recentes);
  return recentes.length > 8;
}

export async function POST(requete: NextRequest): Promise<Response> {
  let corps: Record<string, unknown>;
  try {
    corps = (await requete.json()) as Record<string, unknown>;
  } catch {
    return refus("invalide");
  }
  if (texte(corps.piege, 100)) return Response.json({ ok: true }, { headers: SANS_CACHE });

  const ip = requete.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
  if (tropDeTentatives(ip)) return refus("trop", 429);

  const d = {
    profil: (PROFILS.includes(corps.profil as Profil) ? corps.profil : "autre") as Profil,
    nom: texte(corps.nom, 120),
    entreprise: texte(corps.entreprise, 160),
    courriel: texte(corps.courriel, 160).toLowerCase(),
    telephone: texte(corps.telephone, 40),
    region: texte(corps.region, 120),
    restoEnTete: texte(corps.restoEnTete, 300),
    consentementRefere: corps.consentementRefere === true,
    consentementContact: corps.consentementContact === true,
    provenance: assainirProvenance(corps.provenance),
  };
  if (!d.nom || !d.entreprise || !d.telephone || !COURRIEL.test(d.courriel) || !d.consentementContact) return refus("champs");
  // Un resto nommé exige l'affirmation qu'il veut être contacté.
  if (d.restoEnTete && !d.consentementRefere) return refus("consentement");

  const nomProfil = REFERENCES.profils.find((p) => p.id === d.profil)?.nom ?? d.profil;
  const langue = corps.langue === "en" ? ("en" as const) : ("fr" as const);

  // La porte unique des leads : l'alerte [Lead] à l'équipe. On attend le résultat.
  const resultat = await signalerLead({
    id: corps.idLead,
    source: "contact",
    langue,
    contact: { nomComplet: d.nom, cellulaire: d.telephone, courriel: d.courriel },
    resto: { nom: d.entreprise, ville: d.region || null },
    donnees: {
      demande: "programme de références (ancien formulaire)",
      profil: nomProfil,
      entreprise: d.entreprise,
      region: d.region,
      resto_en_tete: d.restoEnTete,
      consentement_refere: d.restoEnTete ? d.consentementRefere : null,
    },
    // Le texte de la case vient du serveur, jamais du navigateur.
    consentement: { texte: (langue === "en" ? REFERENCES_EN : REFERENCES).consentementContact, coche: true },
    page: pageDeLaRequete(requete, langue === "en" ? "/en/referrals" : "/refere-un-resto"),
    provenance: d.provenance,
    attribution: referenceDeLaRequete(requete),
  });
  if (resultat === "echec") return refus("envoi", 502);

  // L'accusé de réception part après la réponse : la personne n'attend pas.
  const c = (corps.langue === "en" ? REFERENCES_EN : REFERENCES).courriel;
  const remplir = (v: string) => v.replace("{prenom}", d.nom.split(/\s+/)[0] ?? "").replace("{tel}", PHONE_DISPLAY);
  after(async () => {
    try {
      await envoyerCourriel({
        a: d.courriel,
        sujet: c.sujet,
        texte: [remplir(c.salut), "", c.corps, "", remplir(c.question), "", "Guillaume", "Resto Action"].join("\n"),
        html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#191919;"><p>${echapper(remplir(c.salut))}</p><p>${echapper(c.corps)}</p><p>${echapper(remplir(c.question))}</p><p>Guillaume<br>Resto Action</p></div>`,
      });
    } catch (erreur) {
      console.error("[reference] accusé de réception refusé :", erreur instanceof Error ? erreur.message : erreur);
    }
  });

  return Response.json({ ok: true }, { headers: SANS_CACHE });
}
