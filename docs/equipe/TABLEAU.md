# Tableau de l'équipe — soirée du 23 nov. 2026

**But de ce soir :** les 3 lead magnets (Calcul 60 secondes, Classement Google, Studio Photo) marchent de bout en bout sur localhost:3001. On optimise après. Bilan à 22 h.

**Dernière mise à jour :** 17 h 40 (chef)

**Dépôt :** `~/Projects/resto-action`, branche `grand-lancement-hiver`, dernier commit `210c333` (18 nov.). 38 fichiers modifiés et une vingtaine de nouveaux, rien de sauvegardé depuis le 18 nov. Le serveur de localhost:3001 roule déjà (processus 54501, lancé de ce dépôt).

## Les sessions

| Session | Couloir | Fichiers | État | Prochaine étape |
|---|---|---|---|---|
| Calculateur 60 secondes | Le Calcul 60 | `src/app/calcul/`, `src/app/api/calcul-60/`, `src/components/lancement/Calcul60.tsx`, `CadreCalcul.tsx`, `ChampResto.tsx`, `src/lib/calcul60*.ts`, `src/lib/mesure.ts`, `src/lib/telephone*.ts`, bloc CALCUL_60 de `contenu/grand-lancement.ts`, bloc `.curseur-60` de `globals.css` | En cours. Parcours vérifié au format cellulaire (2 chiffres, réponse, formulaire, pitch après l'envoi, refus sans la case) | Appeler `signalerLead` à chaque envoi, puis attendre l'essai du courriel |
| Ton rang sur Google | Le Classement | `src/lib/classement*.ts`, `src/lib/contenu/classement.ts`, `src/app/api/classement/`, `src/components/lancement/ClassementGoogle.tsx` | Bloquée sur `GOOGLE_PLACES_CLE`. Parcours vérifié avec des restos fictifs seulement; la vraie recherche Google n'a jamais roulé | Appeler `signalerLead` à chaque envoi; essai réel (3 restos de Trois-Rivières) dès que la clé est posée |
| Studio Photo page | Le Studio et le mini CRM | `src/app/studio/`, `src/app/api/studio/`, `src/components/studio/`, `src/lib/studio/`, `src/lib/contenu/studio.ts`, `src/lib/studio.test.ts`, `src/lib/mini-crm/`, `src/lib/mini-crm.test.ts`, `src/app/tableau/leads/` | Finie pour ce soir, en essai sans IA : photo, correction sans génération, 2 formats, formulaire, `signalerLead` à chaque envoi (vérifié 17 h 07) | Les 4 vrais cas dès que les clés du moteur et du contrôle sont là (facultatif ce soir) |
| chef | Les fichiers partagés, le build, les commits | `src/lib/site.ts`, `src/lib/leads/`, `src/lib/contenu/leads.ts`, `src/lib/provenance.ts`, `src/lib/google/`, `src/lib/places.ts`, `src/lib/crm.ts`, `AccueilLancement.tsx`, mise en page, navigation, plan du site, `package.json`, variables d'environnement, `docs/equipe/` | En cours | Envoi de test du courriel dès que Guillaume a posé ses variables |

Le serveur de localhost:3001 (processus 54501, lancé le 10 nov.) n'appartient à aucune des 3 sessions. Le chef le redémarre quand `.env.local` change.

Les leads sont déjà rangés dans le mini CRM du site (`/tableau/leads`, magasin Vercel Blob privé du compte de Guillaume) avant l'appel à la porte : un lead n'est pas perdu même quand le courriel ne part pas.

## Le contrat de la porte unique

`signalerLead(e)` dans `src/lib/leads/envoi.ts`. Elle existe déjà et les 3 outils l'appellent (`api/calcul-60`, `api/classement/demande`, `api/studio/contact`).

Elle reçoit :
- `id` : l'identifiant créé dans le navigateur (anti-doublon)
- `source` : `calcul-60`, `classement` ou `studio` (liste complète dans `src/lib/leads/lead.ts`)
- `contact` : `prenom` ou `nomComplet`, `cellulaire`, `courriel`
- `resto` : `nom`, `ville`, `googlePlaceId`
- `donnees` : les données de l'outil
- `consentement` : `{ texte, coche }`, le texte exact de la case; l'heure est posée par la porte
- `page` et `provenance`

Elle rend `base`, `courriel` ou `echec`. La route montre un succès seulement pour `base` ou `courriel`. Elle n'appelle aucun CRM extérieur. Elle écrit dans Supabase seulement si `SUPABASE_URL` et `SUPABASE_CLE_SECRETE` sont posées. L'alerte part à `LEADS_COURRIEL_EQUIPE`.

**Le trou, et sa réparation :** l'alerte passait seulement par un compte de service Google Workspace (`GOOGLE_SA_COURRIEL`, `GOOGLE_SA_CLE`, `GOOGLE_SUJET`), absent de `.env.local` et tenu dans un compte que Guillaume ne contrôle pas. À 17 h 35, `src/lib/google/courriel.ts` a reçu une 2e voie : si `COURRIEL_SMTP_UTILISATEUR` et `COURRIEL_SMTP_MDP` sont posées, le courriel part par smtp.gmail.com. Écrite, vérifiée par tsc, pas encore essayée pour vrai : il faut les variables de Guillaume.

## Les comptes et les clés (`.env.local`)

| Sert à | Variables | Dans `.env.local` | Marche | Ce soir |
|---|---|---|---|---|
| Envoi des courriels (alerte) | `GOOGLE_SA_COURRIEL`, `GOOGLE_SA_CLE`, `GOOGLE_SUJET` | Absentes | Non | Requis. Remplacé par un mot de passe d'application Gmail (voir Pour Guillaume) |
| Adresse de l'alerte | `LEADS_COURRIEL_EQUIPE` | Absente | Non | Requis |
| Recherche Google (Classement, choix du resto) | `GOOGLE_PLACES_CLE` | Absente | Non | Requis pour le Classement |
| Stockage des photos (Vercel Blob) | `BLOB_READ_WRITE_TOKEN` | Remplie | Oui (testée, réponse 200) | Requis pour le Studio et le mini CRM. Magasin du compte Vercel de Guillaume |
| Moteur de retouche (Gemini) | `GEMINI_API_KEY` | Vide | Non | Facultatif : sans elle, correction sans génération |
| Contrôle de la photo (Claude) | `ANTHROPIC_API_KEY` | Vide | Non | Facultatif : `STUDIO_ESSAI_SANS_IA=1` le remplace en local |
| Base (Supabase) | `SUPABASE_URL`, `SUPABASE_CLE_SECRETE` | Vides | Non | Facultatif : le courriel fait le travail |
| Mini CRM `/tableau` | `TABLEAU_MDP` | Remplie | Non testé | — |
| Stripe | `STRIPE_*` | Remplies (webhook vide) | On n'y touche pas | Hors de ce soir |
| Ancien CRM | `CRM_INGESTION_URL`, `CRM_INGESTION_SECRET`, `CRM_FONDATEUR_URL`, `CRM_REFERENCES_URL` | Absentes | — | Ne servent plus. Restent absentes |

## Les décisions de ce soir

- 17 h 05 — Le travail se fait dans `~/Projects/resto-action`, pas dans `~/resto-action-site` (vieux dépôt, propre, arrêté au 5 nov.). Le tableau vit ici.
- 17 h 10 — `signalerLead` existe déjà : on la garde, on ne la réécrit pas. Son contrat est celui ci-dessus.
- 17 h 15 — Les sessions « miamo-keplo-b1 », « Prompts et photos patinoires Pure-Vue » et « resto-action-b3 » ne font pas partie de l'équipe : aucun message ne leur est envoyé.
- 17 h 20 — L'alerte par courriel aura une 2e voie que Guillaume installe seul : un mot de passe d'application Gmail (SMTP). Le compte de service Workspace reste en place pour l'agenda, sans que rien de ce soir en dépende.

- 17 h 30 — Les 3 routes rangent d'abord dans le mini CRM, puis appellent `signalerLead` à chaque envoi, sans condition. Le visiteur voit un succès si l'un des deux a marché.
- 17 h 30 — Le mini CRM (`src/lib/mini-crm/`, `/tableau/leads`) est le couloir de « Studio Photo page ».
- 17 h 30 — Le Studio est « en place » ce soir avec la correction sans génération, en essai sans IA.
- 17 h 35 — La 2e voie du courriel est écrite sans nouvelle dépendance (aucun changement à `package.json`).

## Pour Guillaume (dans l'ordre)

1. **Le courriel d'alerte (5 min, gratuit).** Sur myaccount.google.com, avec le compte Gmail qui doit envoyer : Sécurité → Validation en 2 étapes (l'activer si ce n'est pas fait) → Mots de passe des applications → en créer un nommé « Resto Action local ». Dans `~/Projects/resto-action/.env.local`, ajouter :
   - `COURRIEL_SMTP_UTILISATEUR=` l'adresse Gmail
   - `COURRIEL_SMTP_MDP=` les 16 lettres
   - `LEADS_COURRIEL_EQUIPE=` l'adresse où tu veux recevoir les alertes
2. **La recherche Google (10 min, carte de crédit demandée par Google).** Sur console.cloud.google.com, avec ton compte : nouveau projet → activer « Places API (New) » → Identifiants → créer une clé API, limitée à Places API (New). Google exige un compte de facturation; l'usage de ce soir reste dans la tranche gratuite, mais c'est ta décision. Ajouter `GOOGLE_PLACES_CLE=` dans `.env.local`.
3. **Me dire** quand c'est fait : je redémarre le serveur et j'envoie un courriel de test.
4. **Facultatif ce soir :** `GEMINI_API_KEY` (aistudio.google.com → Get API key). La génération d'images est facturée à l'usage : c'est une dépense, à toi de dire oui.
5. **À lire, sans urgence :** le texto du dossier du Calcul (« Salut {prenom}, c'est Guillaume de Resto Action. Voici ton dossier pour {resto} : {lien} »), écrit par la session, et ses 2 phrases proposées pour /confidentialite (texte légal : rien n'est modifié sans ton oui).

## Pour demain

- La base Supabase (compte, `supabase/schema.sql`, les 2 variables).
- Le moteur de retouche et les 2 contrôles du Studio (clés Gemini et Anthropic), puis les 4 vrais cas et le test des 10 photos. Sans la clé Anthropic, aucun contrôle ne regarde la photo : à régler avant d'ouvrir la page.
- Le découpage des grandes villes en zones pour le Classement, et le coût réel par recherche.
- `docs/leads-contrat-crm.md` et `docs/references-contrat-crm.md` : documents « pour Xavier », périmés. À réécrire pour nous ou à retirer.
- Le ménage de `src/lib/crm.ts` (blocs morts « classement », « studio », champs du calcul) et de `STUDIO.crmBranche` dans `site.ts`.
- Le journal du serveur reçoit le lead entier quand la porte échoue : à revoir avant la mise en ligne.
- La mise en ligne : le projet Vercel du site est dans le compte de Xavier. Il faudra un projet Vercel à Guillaume, avec ses variables, et le domaine.

## Dépend encore de Xavier

Pour les 3 lead magnets en local, une fois les étapes 1 et 2 de Guillaume faites : rien.

Hors de ce soir :
- Le webhook Stripe appelle encore `signalerFondateur` (`src/lib/crm.ts`, ancien CRM). On n'y touche pas.
- `src/lib/references/envoi.ts` envoie encore à l'ancien CRM si `CRM_REFERENCES_URL` est posée. Elle ne l'est pas.
- L'agenda (compte de service Google) et le projet Vercel de production sont dans des comptes qu'il tient.
