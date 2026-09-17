import type { Metadata } from "next";
import Tableau, { PERIODES, type Periode } from "@/components/Tableau";
import { HORIZON_JOURS } from "@/lib/agenda";
import { ErreurAgenda } from "@/lib/google/auth";
import { listerRendezVous, type RendezVousListe } from "@/lib/google/calendrier";

/* Le tableau de bord privé. Protégé par src/proxy.ts (mot de passe HTTP).

   Volontairement ABSENT de src/lib/routes.ts, comme demo-app : ce registre
   alimente le plan du site et les balises hreflang, et une page à mot de
   passe n'a rien à y faire. robots.ts l'exclut en plus, par précaution. */
export const metadata: Metadata = {
  title: "Provenance des rendez-vous",
  robots: { index: false, follow: false },
};

// Lu à chaque requête : la donnée vient de l'agenda, jamais d'un cache.
export const dynamic = "force-dynamic";

const JOUR = 86_400_000;

const PANNES: Record<string, string> = {
  config: "L'agenda n'est pas configuré sur cet environnement (variables Google absentes).",
  google: "Google Calendar n'a pas répondu. Réessaie dans une minute.",
};

/* Le chargement vit hors du composant : la règle de pureté de React refuse
   `Date.now()` dans le corps d'une page, même rendue une fois côté serveur.
   Ici, c'est une fonction ordinaire qui lit l'heure et l'agenda. */
async function charger(
  periode: Periode,
): Promise<{ rendezVous: RendezVousListe[]; erreur: string | null }> {
  const maintenant = Date.now();
  const depuis = maintenant - periode * JOUR;
  try {
    /* Google filtre sur la date du RENDEZ-VOUS ; on veut ceux RÉSERVÉS dans
       la période. On lit donc large — de « depuis » jusqu'au bout de
       l'horizon de réservation — puis on garde par date de création. */
    const tous = await listerRendezVous(
      new Date(depuis),
      new Date(maintenant + HORIZON_JOURS * JOUR),
    );
    return {
      rendezVous: tous.filter((r) => Date.parse(r.cree) >= depuis),
      erreur: null,
    };
  } catch (e) {
    console.error("[tableau]", e);
    const code = e instanceof ErreurAgenda ? e.code : "google";
    return { rendezVous: [], erreur: PANNES[code] ?? PANNES.google };
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ jours?: string | string[] }>;
}) {
  const { jours } = await searchParams;
  const brut = Number(Array.isArray(jours) ? jours[0] : jours);
  const periode: Periode = (PERIODES as readonly number[]).includes(brut)
    ? (brut as Periode)
    : PERIODES[0];

  const { rendezVous, erreur } = await charger(periode);
  return <Tableau rendezVous={rendezVous} periode={periode} erreur={erreur} />;
}
