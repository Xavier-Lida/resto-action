# Réfère un resto : contrat entre le site et le CRM

Pour : Xavier · De : Guillaume (rédigé avec Claude) · Version 1, 10 nov. 2026
Statut : **spécification**. Rien de ce qui suit n'existe encore dans le CRM. Le site fonctionne en mode pilote sans base : chaque événement part par courriel à l'équipe. Quand le CRM est prêt, on pose `CRM_REFERENCES_URL` dans Vercel et les mêmes événements arrivent ici, sans changer une ligne du site.

Les montants qui apparaissent dans les règles ont été confirmés par Guillaume le 10 nov. 2026 (pas de plafond de références par parrain). Ils vivent dans `src/lib/contenu/references.ts` côté site. Le CRM ne les code pas en dur : il les lit d'une table de configuration (voir `programme_config`).

---

## 1. Le transport

- **Un seul point d'entrée côté site** : `signalerReference(evenement)` dans `src/lib/references/envoi.ts`.
- **Requête** : `POST {CRM_REFERENCES_URL}`, en-têtes `Authorization: Bearer {CRM_INGESTION_SECRET}` et `Content-Type: application/json`. Même secret et même façon de faire que `signalerReservation` et `signalerFondateur` (`src/lib/crm.ts`).
- **Réponse attendue** : `2xx` = accepté. Tout le reste (4xx, 5xx, délai de 10 s dépassé) = refusé.
- **Rien ne se perd** : si le CRM refuse ou ne répond pas, le site envoie le même événement par courriel à `REFERENCES_COURRIEL_EQUIPE`, et journalise l'erreur. Si le courriel échoue aussi, le visiteur voit un message d'erreur honnête avec le numéro de téléphone.
- **Idempotence** : chaque événement porte un `id` (UUID v4) créé par le site. Le CRM ignore un `id` déjà reçu (contrainte unique). Le site peut donc renvoyer sans risque de doublon.
- **Horloge** : `horodatage` en ISO 8601 UTC, fixé par le serveur du site au moment de l'action. C'est cet horodatage qui sert à l'attribution (« le premier inscrit gagne »).

## 2. Les événements (JSON exact)

### 2.1 L'enveloppe commune

```json
{
  "id": "6f0d3c2a-2b1e-4d1c-9d6a-0f3f1d7c9b21",
  "version": 1,
  "type": "reference.recue",
  "horodatage": "2026-11-10T19:42:11.204Z",
  "langue": "fr",
  "page": "/p/CHEZTI",
  "provenance": {
    "source": "facebook", "medium": "cpc", "campaign": "lancement-hiver",
    "content": null, "term": null, "referent": "l.facebook.com", "page": "/p/CHEZTI"
  },
  "referent": {
    "code": "CHEZTI",
    "type": "client",
    "nom": "Chez Ti-Jean",
    "representant": null
  },
  "source": "formulaire"
}
```

| Champ | Valeurs | Notes |
|---|---|---|
| `type` | voir 2.2 | |
| `version` | `1` | Monte si le format change. Le CRM refuse une version inconnue (400). |
| `langue` | `fr` · `en` | |
| `referent.code` | 4 à 12 caractères, `[A-Z2-9]` | Pas de 0 ni de 1 : un O et un I sont toujours des lettres. Majuscules ; le site normalise ce que le visiteur tape. |
| `referent.type` | `client` · `fournisseur` · `professionnel` | `professionnel` = comptable, conseiller, association, agence. |
| `referent.nom` | texte | Tel qu'inscrit dans `references-codes.ts` (site) ou `referrers` (CRM). |
| `referent.representant` | texte ou `null` | Nom du représentant d'un fournisseur, s'il y en a un. |
| `source` | `lien` · `formulaire` · `carte` · `representant` | `carte` = arrivé par le code QR de la carte imprimée. |
| `provenance` | objet | Le même que celui des réservations (`src/lib/provenance.ts`). |

### 2.2 Les types et leur charge utile

**`reference.recue`** : un référent présente un resto (formulaire « Présente-nous quelqu'un », ou formulaire mobile d'un représentant).

```json
{
  "refere": {
    "resto_nom": "Pizzeria du Coin",
    "contact_prenom": "Marie",
    "contact_nom": "Tremblay",
    "telephone": "819 555-1234",
    "courriel": null,
    "ville": "Shawinigan"
  },
  "consentement_contact": {
    "donne": true,
    "texte": "Cette personne m'a dit qu'elle voulait en savoir plus sur Resto Action, et je l'ai prévenue que quelqu'un de l'équipe allait la contacter.",
    "horodatage": "2026-11-10T19:42:11.204Z"
  },
  "referent_contact": { "courriel": "jean@chezti.ca", "telephone": "819 555-0000" }
}
```
Un des deux, `telephone` ou `courriel`, est obligatoire. Le texte du consentement est copié **mot pour mot** tel qu'affiché.

Depuis le formulaire public de `/refere-un-resto`, la personne n'a pas toujours de code : `referent` vaut alors `null`, et `referent_contact` porte qui elle est :

```json
"referent_contact": { "nom": "Jean Gagnon", "entreprise": "Chez Ti-Jean", "courriel": "jean@chezti.ca", "telephone": null, "code_saisi": null }
```
`code_saisi` : ce que la personne a tapé dans « Ton code » quand il ne correspond à aucun code actif (sinon `null`). Le site ne refuse jamais la référence pour un code inconnu.

**`lien.demande`** : un resto client demande son lien (« Je veux mon lien »). En mode pilote, l'équipe vérifie qu'il est client, en ligne et à jour, ajoute son code dans `references-codes.ts` et lui envoie son lien. Le CRM, lui, créera la ligne `referrers` et enverra le courriel `lienCree`.

```json
{ "demandeur": { "nom": "Jean Gagnon", "resto": "Chez Ti-Jean", "courriel": "jean@chezti.ca", "telephone": "819 555-0000" } }
```

**`reference.attribuee`** : un resto réserve sa place en portant un code (lien `/p/CODE` ou `/f/CODE`, ou témoin d'attribution de 30 jours). Ce n'est pas un nouvel envoi séparé : le code voyage **dans les deux POST existants** (`signalerReservation` et `signalerFondateur`) sous une clé `reference`, et `signalerReference` émet en plus cet événement pour le journal.

```json
{
  "refere": {
    "resto_nom": "Pizzeria du Coin", "contact_prenom": "Marie", "contact_nom": "Tremblay",
    "telephone": "819 555-1234", "courriel": "marie@pizzeriaducoin.ca", "ville": "Shawinigan"
  },
  "reservation": { "etape": "reservation", "conditions": "2026-11-07" },
  "attribution": { "premier_contact": "2026-11-02T14:10:00Z", "via": "temoin" }
}
```
`attribution.via` : `url` (le code était dans l'adresse) ou `temoin` (lu dans le témoin de 30 jours). En version 1, le site envoie toujours `temoin` : le lien `/p/CODE` pose le témoin, puis redirige vers l'accueil.

La clé `reference` dans les deux POST existants (`signalerReservation`, `signalerFondateur`) :

```json
"reference": { "code": "CHEZTI", "type": "client", "nom": "Chez Ti-Jean", "representant": null, "source": "lien", "premier_contact": "2026-11-02T14:10:00Z" }
```
Absente si le visiteur n'a pas de témoin. Dans l'agenda Google, le code est aussi dans les propriétés privées de l'événement (`reference_code`, `reference_nom`, `reference_type`), jamais dans la description (le resto la voit dans son invitation).

**`reference.visite`** : quelqu'un ouvre `/p/CODE` ou `/f/CODE`. **Aucune donnée personnelle**, seulement l'enveloppe. Sert aux statistiques (clics par référent). Le site peut ne pas l'envoyer en mode courriel (trop de bruit) : il ne part au CRM que si `CRM_REFERENCES_URL` est posée.

**`partenaire.candidature`** : une entreprise veut devenir partenaire référent (formulaire de `/refere-un-resto` ou de la page fournisseurs).

```json
{
  "candidat": {
    "entreprise": "Friteuses Mauricie", "ce_qu_elle_vend": "Équipement de cuisine",
    "nom": "Luc Bergeron", "fonction": "Représentant", "courriel": "luc@exemple.ca",
    "telephone": "819 555-2222", "restos_clients_approx": "40", "regions": "Mauricie, Centre-du-Québec",
    "facon_de_referer": ["lien", "carte", "presentation"]
  },
  "consentement_contact": { "donne": true, "texte": "…", "horodatage": "…" }
}
```

**`avantage.presentation`** (volet C) : un resto client demande à être présenté à un fournisseur. Rien n'est transmis au fournisseur sans ce consentement **propre à ce fournisseur**.

```json
{
  "resto": { "resto_nom": "…", "contact_nom": "…", "courriel": "…", "telephone": "…", "ville": "…", "besoin": "…" },
  "partenaire": { "id": "agendrix", "nom": "Agendrix" },
  "consentement": {
    "donne": true,
    "texte": "J'accepte que Resto Action transmette à Agendrix : le nom de mon resto, mon nom, mon courriel, mon téléphone, ma ville et mon besoin. …",
    "horodatage": "…"
  },
  "donnees_transmises": ["resto_nom", "contact_nom", "courriel", "telephone", "ville", "besoin"]
}
```

**`avantage.clic`** (volet C) : un resto clique sur le lien de suivi d'un partenaire. Enveloppe + `{ "partenaire": { "id": "…", "nom": "…" } }`.

### 2.3 Ce que le CRM renvoie

`201 { "ok": true, "referral_id": "…" }` à la création, `200 { "ok": true, "deja_recu": true }` pour un `id` déjà reçu. Le site n'utilise pas la réponse pour l'instant ; elle sert au débogage.

## 3. Le schéma (PostgreSQL / Supabase)

```sql
-- ─── Types ───
create type type_referent as enum ('client', 'fournisseur', 'professionnel');
create type formule_partenaire as enum ('commission', 'echange', 'mixte');
create type statut_pipeline as enum ('cible', 'contacte', 'en_discussion', 'entente_signee', 'actif', 'pause');
create type source_reference as enum ('lien', 'formulaire', 'carte', 'representant');
create type statut_reference as enum (
  'recu', 'contacte', 'rdv_fait', 'reserve', 'en_ligne', 'paye_1', 'paye_2',
  'credit_libere', 'credit_applique',
  'doublon', 'auto_parrainage', 'perdu', 'rembourse_garantie'
);
create type statut_recompense as enum ('en_attente', 'libere', 'applique', 'paye', 'annule');
create type mode_recompense as enum ('credit_abonnement', 'facture_fournisseur');

-- ─── La configuration du programme (montants confirmés le 10 nov. 2026) ───
create table programme_config (
  cle text primary key,          -- ex. 'parrain_credit_1_2'
  valeur numeric not null,
  confirme boolean not null default false,
  modifie_le timestamptz not null default now()
);

insert into programme_config (cle, valeur, confirme) values
  ('parrain_credit_1_2',           300, true),  -- $ de crédit, 1er et 2e resto
  ('parrain_credit_3_plus',        400, true),  -- $ de crédit dès le 3e resto, pas de plafond
  ('refere_bonus_pub',             100, true),  -- $ de pub de plus au lancement du référé
  ('fournisseur_commission',       250, true),  -- $ par resto, formule « commission »
  ('fournisseur_commission_mixte', 150, true),  -- $ par resto, formule « mixte »
  ('abonnements_avant_recompense',   2, true),
  ('fenetre_doublon_jours',         60, true),
  ('protection_partenaire_jours',   60, true),
  ('temoin_attribution_jours',      30, true),
  ('conservation_fournisseur_mois', 12, true);

-- ─── Les référents ───
create table referrers (
  id uuid primary key default gen_random_uuid(),
  type type_referent not null,
  resto_id uuid references restos(id),           -- client seulement
  user_id uuid references auth.users(id),        -- pour la connexion par lien magique
  organisation text,                              -- fournisseur / professionnel
  categorie text,                                 -- équipement, distributeur, comptable…
  nom text not null,
  courriel text,
  telephone text,
  code text not null unique check (code ~ '^[A-Z2-9]{4,12}$'),
  actif boolean not null default true,
  formule formule_partenaire,                     -- fournisseur / professionnel seulement
  entente_ecrite_le date,
  statut_pipeline statut_pipeline not null default 'cible',
  cree_le timestamptz not null default now(),
  constraint client_a_un_resto check (type <> 'client' or resto_id is not null),
  constraint pas_de_formule_client check (type <> 'client' or formule is null)
);

-- ─── Les références ───
create table referrals (
  id uuid primary key default gen_random_uuid(),
  evenement_id uuid not null unique,              -- l'id de l'événement d'origine (idempotence)
  referrer_id uuid not null references referrers(id),
  representant text,
  source source_reference not null,
  resto_nom text not null,
  contact_prenom text,
  contact_nom text,
  contact_telephone text,
  contact_courriel text,
  ville text,
  statut statut_reference not null default 'recu',
  lead_id uuid references leads(id),
  consentement_contact boolean not null default false,
  consentement_texte text,
  consentement_le timestamptz,
  doublon_de uuid references referrals(id),
  recu_le timestamptz not null,                   -- l'horodatage de l'événement, pas l'heure d'insertion
  cree_le timestamptz not null default now(),
  constraint un_moyen_de_contact check (contact_telephone is not null or contact_courriel is not null)
);
create index on referrals (referrer_id);
create index on referrals (contact_telephone);
create index on referrals (lower(contact_courriel));

-- ─── Le journal immuable ───
create table referral_events (
  id bigint generated always as identity primary key,
  referral_id uuid references referrals(id),
  evenement_id uuid unique,                       -- null pour un changement fait dans le CRM
  type text not null,                             -- 'reference.recue', 'statut', 'credit', …
  horodatage timestamptz not null default now(),
  auteur text not null,                           -- 'site', 'admin:guillaume', 'stripe'
  charge jsonb not null default '{}'
);
create function refuser_modification() returns trigger language plpgsql as $$
begin
  raise exception 'referral_events est en ajout seulement';
end $$;
create trigger journal_sans_update before update or delete on referral_events
  for each row execute function refuser_modification();

-- ─── Les récompenses (crédits des clients, commissions des partenaires) ───
create table referral_rewards (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null unique references referrals(id),   -- UNE récompense par resto, jamais deux
  referrer_id uuid not null references referrers(id),
  beneficiaire_type type_referent not null,
  mode mode_recompense not null,
  montant numeric(10,2) not null,
  statut statut_recompense not null default 'en_attente',
  raison_annulation text,
  libere_le timestamptz,
  applique_le timestamptz,
  approuve_par text,
  facture_recue boolean not null default false,
  constraint client_credit check ((beneficiaire_type = 'client') = (mode = 'credit_abonnement')),
  constraint pas_de_paiement_sans_facture check (mode <> 'facture_fournisseur' or statut <> 'paye' or facture_recue)
);

-- ─── Volet C : les avantages partenaires ───
create table partners (
  id text primary key,                            -- 'agendrix'
  referrer_id uuid references referrers(id),      -- si le partenaire nous réfère aussi des restos
  nom text not null,
  categorie text not null,
  description text,
  langue text,                                    -- 'fr', 'en', 'fr,en'
  logo_url text,                                  -- seulement si l'utilisation est autorisée par écrit
  disponible boolean not null default false,
  entente_ecrite boolean not null default false,
  notes_internes text,                            -- jamais publié
  lien_suivi text,
  type_renvoi text not null check (type_renvoi in ('lien', 'presentation')),
  direction text not null check (direction in ('nous_vers_eux', 'eux_vers_nous', 'les_deux'))
);
create table partner_offers (
  id uuid primary key default gen_random_uuid(),
  partner_id text not null references partners(id),
  texte_avantage_resto text not null,
  valide_jusqua date,
  publie boolean not null default false
);
create table partner_referrals (
  id uuid primary key default gen_random_uuid(),
  evenement_id uuid unique,
  partner_id text not null references partners(id),
  resto_id uuid references restos(id),
  type text not null check (type in ('lien', 'presentation')),
  consentement boolean not null default false,
  consentement_texte text,
  consentement_le timestamptz,
  donnees_transmises jsonb,
  statut text not null default 'clic' check (statut in ('clic', 'presente', 'inscrit', 'actif', 'perdu')),
  cree_le timestamptz not null default now(),
  constraint presentation_consentie check (type <> 'presentation' or consentement)
);
create table partner_commissions (
  id uuid primary key default gen_random_uuid(),
  partner_referral_id uuid not null references partner_referrals(id),
  montant_attendu numeric(10,2),
  montant_recu numeric(10,2),
  devise text not null default 'CAD',
  recu_le date,
  piece_justificative text,                        -- facture ou relevé
  statut text not null default 'attendu' check (statut in ('attendu', 'recu', 'annule'))
);

-- ─── Les leads existants ───
alter table leads add column provenance jsonb;
alter table leads add column referral_id uuid references referrals(id);
```

`restos` et `leads` sont les tables existantes du CRM (adapter les noms au besoin).

`publie = true` sur une offre exige `entente_ecrite = true` sur le partenaire. C'est à faire respecter par un déclencheur ou dans l'admin.

### 3.1 RLS

```sql
alter table referrers enable row level security;
alter table referrals enable row level security;
alter table referral_events enable row level security;
alter table referral_rewards enable row level security;
alter table partners enable row level security;
alter table partner_offers enable row level security;
alter table partner_referrals enable row level security;
alter table partner_commissions enable row level security;

-- L'admin (rôle 'admin' dans le JWT) voit et modifie tout, sauf le journal (ajout seulement).
-- La route d'ingestion utilise la clé de service : elle passe outre la RLS.

-- Un référent connecté ne voit QUE sa fiche et SES références, réduites au nom du resto,
-- à la ville et au statut (passer par une vue) :
create view mes_references with (security_invoker = true) as
  select r.id, r.resto_nom, r.ville, r.statut, r.recu_le
  from referrals r join referrers f on f.id = r.referrer_id
  where f.user_id = auth.uid();

create policy referent_lit_sa_fiche on referrers for select using (user_id = auth.uid());
create policy referent_lit_ses_references on referrals for select
  using (referrer_id in (select id from referrers where user_id = auth.uid()));
create policy referent_lit_ses_recompenses on referral_rewards for select
  using (referrer_id in (select id from referrers where user_id = auth.uid()));
create policy journal_ajout_admin on referral_events for insert with check ((auth.jwt() ->> 'role') = 'admin');
create policy journal_lecture_admin on referral_events for select using ((auth.jwt() ->> 'role') = 'admin');

-- Volet C : seules les offres publiées de partenaires disponibles sont publiques.
create policy offres_publiques on partner_offers for select
  using (publie and exists (select 1 from partners p where p.id = partner_id and p.disponible and p.entente_ecrite));
```

**Test à faire** : avec le jeton d'un référent A, demander les références du référent B directement par l'API REST de Supabase. Résultat attendu : zéro ligne. Ensuite, un `update` ou un `delete` sur `referral_events` doit être refusé, même avec la clé de service.

## 4. La machine d'états

```
recu → contacte → rdv_fait → reserve → en_ligne → paye_1 → paye_2 → credit_libere → credit_applique
```
États terminaux possibles depuis n'importe quel état avant `credit_libere` : `doublon`, `auto_parrainage`, `perdu`, `rembourse_garantie`.

| Passage | Qui le déclenche | Effet |
|---|---|---|
| → `recu` | événement `reference.recue` ou `reference.attribuee` | Contrôle doublon / auto-parrainage (section 5). Courriel « reçu » au référent. |
| `recu` → `contacte` → `rdv_fait` | l'équipe, dans le CRM | Rien d'automatique. |
| → `reserve` | événement `reference.attribuee` (réservation) ou admin | Courriel au référent : « réservé ». |
| → `en_ligne` | admin, le jour de la mise en ligne | Courriel au référent. |
| → `paye_1`, `paye_2` | **admin, à la main** (l'abonnement mensuel n'est pas encore facturé par Stripe) ; plus tard, webhook `invoice.paid` | À `paye_2` : crée la récompense en `en_attente`. |
| `paye_2` → `credit_libere` | admin, un clic d'approbation | Récompense `libere`. Courriel au référent. |
| → `credit_applique` | admin, quand le crédit est appliqué à la facture (client) ou payé sur facture (partenaire) | Récompense `applique` ou `paye`. |
| → `rembourse_garantie` | admin, si le référé est remboursé par la garantie de 90 jours avant `paye_2` | Récompense `annule`, aucune récompense. |

Chaque passage écrit une ligne dans `referral_events` (`type = 'statut'`, `charge = {de, vers, raison}`).

Côté référent, les statuts s'affichent en mots simples : *Reçu, On l'a contacté, Rendez-vous fait, Réservé, En ligne, Crédit appliqué, Pas cette fois*. `doublon`, `auto_parrainage`, `perdu` et `rembourse_garantie` s'affichent tous « Pas cette fois », sans la raison.

## 5. Les règles de doublon, d'auto-parrainage et d'attribution

**Normalisation avant toute comparaison** : téléphone réduit à ses 10 derniers chiffres ; courriel en minuscules, espaces retirés ; nom du resto en minuscules, sans accents, sans ponctuation, sans « restaurant », « resto », « le », « la », « les » ; ville en minuscules, sans accents.

**Doublon** (statut `doublon`, `doublon_de` rempli, aucune récompense) si, dans les **60 jours** avant `recu_le`, le CRM a déjà :
- un lead, un rendez-vous ou un client avec le même téléphone, **ou**
- le même courriel, **ou**
- le même nom de resto normalisé **et** la même ville ;
- ou une autre référence active pour ce resto (dans ce cas, la plus ancienne selon `recu_le` garde la référence).

Le référent reçoit un courriel poli (« ce resto était déjà en discussion avec nous ») sans récompense.

**Auto-parrainage** (statut `auto_parrainage`, aucune récompense) si le référé et le référent partagent : le même resto (`resto_id`), le même propriétaire, la même adresse, le même téléphone ou le même courriel. Un 2e établissement du même propriétaire n'est pas un référé.

**Attribution** : un seul référent par resto. Le premier événement valide au journal gagne (ordre de `recu_le`, puis de `id`). Si un parrain client et un fournisseur réfèrent le même resto, c'est le premier inscrit qui l'a. Une seule ligne `referral_rewards` par `referral_id` (contrainte unique) : jamais deux récompenses.

**Protection des partenaires** : 60 jours à partir de la présentation, renouvelée seulement par un contact documenté de l'équipe (une ligne au journal).

**En mode pilote (sans CRM)** : aucune de ces règles n'est appliquée automatiquement. Chaque courriel reçu porte la ligne « À vérifier dans le CRM : doublon? » et Guillaume tranche à la main.

## 6. La cohorte

Un resto référé suit la même cohorte de 16 restos par mois et la même date limite que tout le monde. Le CRM n'offre aucune priorité à un référé.

## 7. Ce que le site enverra, résumé

| Action sur le site | Événement | Voie |
|---|---|---|
| Ouvrir `/p/CODE` ou `/f/CODE` | `reference.visite` | CRM seulement (pas de courriel) |
| Formulaire « Présente-nous quelqu'un » / formulaire mobile du représentant | `reference.recue` | CRM, sinon courriel |
| Réserver sa place avec un code (URL ou témoin) | `reference.attribuee` + le code dans les 2 POST existants | CRM, sinon courriel |
| Formulaire « Devenir partenaire » | `partenaire.candidature` | CRM, sinon courriel |
| Volet C : « Je veux qu'on me présente » | `avantage.presentation` | CRM, sinon courriel |
| Volet C : lien de suivi | `avantage.clic` | CRM seulement |
