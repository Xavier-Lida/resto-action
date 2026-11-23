-- LE CRM DES LEADS DE RESTO ACTION (18 nov. 2026).
--
-- À coller EN ENTIER dans Supabase → SQL Editor → Run, une seule fois, dans un
-- projet neuf. Le relancer ne casse rien (tout est « if not exists » ou
-- « or replace »), mais n'efface rien non plus.
--
-- 3 tables, plus une mini-table de réglages :
--   leads            une fiche par resto
--   lead_evenements  le journal de tout ce qui arrive à une fiche. Une ligne
--                    ne se modifie jamais (un déclencheur le refuse).
--   gabarits         les textos de Guillaume
--   reglages         {places}, le chiffre réglé dans l'écran des gabarits
--
-- LA BASE NE SE LIT JAMAIS DU NAVIGATEUR. Le site y accède du serveur
-- seulement, avec la clé secrète (src/lib/leads/base.ts). La sécurité par
-- rangée est activée partout, SANS AUCUNE RÈGLE : la clé publique ne lit rien
-- et n'écrit rien.
--
-- Les heures sont des instants absolus (timestamptz). Le site les affiche à
-- l'heure de Montréal (America/Toronto). La date de la prochaine action est un
-- jour de Montréal, sans heure.

-- ─── Les fiches ───

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  resto text not null,
  ville text,
  -- L'identifiant de lieu de Google, quand on l'a.
  google_place_id text,
  prenom text,
  -- 10 chiffres, un seul format : « 8195550100 ».
  cellulaire text check (cellulaire ~ '^[0-9]{10}$'),
  courriel text,
  statut text not null default 'nouveau'
    check (statut in ('nouveau', 'contacte', 'rdv_booke', 'rdv_fait', 'signe', 'pas_maintenant', 'perdu')),
  prochaine_action text,
  prochaine_action_le date,
  premiere_source text not null
    check (premiere_source in ('calcul-60', 'classement', 'studio', 'reference', 'reserve-ta-place', 'reservation', 'dossier-releve', 'contact', 'manuel')),
  -- « Référé par » : posé à la création de la fiche (le premier contact gagne).
  reference_code text,
  reference_nom text,
  reference_type text check (reference_type in ('client', 'fournisseur', 'professionnel')),
  ne_plus_texter boolean not null default false,
  -- La première fois que le statut quitte « nouveau » : mon premier contact.
  premier_contact_le timestamptz,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);

-- Le même cellulaire, c'est la même fiche : la base elle-même refuse un doublon.
create unique index if not exists leads_cellulaire_unique on public.leads (cellulaire) where cellulaire is not null;
create index if not exists leads_google_place_id on public.leads (google_place_id) where google_place_id is not null;
create index if not exists leads_statut on public.leads (statut);
create index if not exists leads_prochaine_action_le on public.leads (prochaine_action_le) where prochaine_action_le is not null;

create or replace function public.leads_toucher() returns trigger
language plpgsql set search_path = public as $$
begin
  new.modifie_le := now();
  return new;
end $$;

drop trigger if exists leads_toucher on public.leads;
create trigger leads_toucher before update on public.leads
  for each row execute function public.leads_toucher();

-- ─── Le journal ───

create table if not exists public.lead_evenements (
  -- Pour un formulaire : l'identifiant créé dans le navigateur. Un double clic
  -- ou un rechargement renvoie le même, et la base refuse le 2e.
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  type text not null check (type in ('formulaire', 'ajout_manuel', 'note', 'statut', 'action', 'ne_plus_texter')),
  source text
    check (source in ('calcul-60', 'classement', 'studio', 'reference', 'reserve-ta-place', 'reservation', 'dossier-releve', 'contact', 'manuel')),
  -- Qui a rempli, tel qu'envoyé (la fiche, elle, garde le premier contact).
  contact jsonb not null default '{}'::jsonb,
  -- Les données propres à la source.
  donnees jsonb not null default '{}'::jsonb,
  -- Le texte EXACT de la case, si elle est cochée, et quand.
  consentement_texte text,
  consentement_coche boolean,
  consentement_le timestamptz,
  -- La provenance.
  page text,
  page_arrivee text,
  site_origine text,
  utm jsonb,
  video text,
  reference jsonb,
  cree_le timestamptz not null default now()
);

create index if not exists lead_evenements_lead on public.lead_evenements (lead_id, cree_le desc);

-- Une ligne du journal ne se modifie jamais. Elle disparaît seulement avec sa
-- fiche (« Supprimer ce lead », on delete cascade).
create or replace function public.lead_evenements_figes() returns trigger
language plpgsql set search_path = public as $$
begin
  raise exception 'Une ligne du journal ne se modifie jamais.';
end $$;

drop trigger if exists lead_evenements_figes on public.lead_evenements;
create trigger lead_evenements_figes before update on public.lead_evenements
  for each row execute function public.lead_evenements_figes();

-- ─── Les textos ───

create table if not exists public.gabarits (
  id uuid primary key default gen_random_uuid(),
  source text not null
    check (source in ('calcul-60', 'classement', 'studio', 'reference', 'reserve-ta-place', 'reservation', 'dossier-releve', 'contact', 'manuel')),
  nom text not null,
  texte text not null,
  a_relire boolean not null default true,
  ordre integer not null default 0,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);

create table if not exists public.reglages (
  cle text primary key,
  valeur text not null,
  modifie_le timestamptz not null default now()
);

-- ─── L'entrée d'un lead, en une seule transaction ───
--
-- Le même resto, c'est la même fiche : même cellulaire, sinon même identifiant
-- Google. Un 2e formulaire ajoute un événement à la fiche, jamais une 2e fiche.
-- La fiche garde ce qu'elle avait : un 2e formulaire remplit seulement ses
-- champs encore vides.
--
-- Rend : { lead_id, existait, depuis, deja_recu, ne_plus_texter }.
--   existait   : la fiche était déjà là avant cet envoi
--   depuis     : la date de création de la fiche
--   deja_recu  : cet identifiant d'envoi était déjà au journal (double clic) :
--                rien n'a été ajouté
create or replace function public.enregistrer_lead(p jsonb) returns jsonb
language plpgsql security invoker set search_path = public as $$
declare
  v_evenement uuid := (p ->> 'id')::uuid;
  v_type text := coalesce(nullif(p ->> 'type', ''), 'formulaire');
  v_cell text := nullif(p ->> 'cellulaire', '');
  v_lieu text := nullif(p ->> 'google_place_id', '');
  v_ref jsonb := case when jsonb_typeof(p -> 'reference') = 'object' then p -> 'reference' end;
  v_lead public.leads%rowtype;
  v_existait boolean := false;
begin
  -- Un lead à la fois : deux formulaires envoyés au même instant par le même
  -- resto ne créent pas 2 fiches. Le verrou tombe à la fin de la transaction.
  perform pg_advisory_xact_lock(20261118);

  select l.* into v_lead
    from public.lead_evenements e join public.leads l on l.id = e.lead_id
    where e.id = v_evenement;
  if found then
    return jsonb_build_object(
      'lead_id', v_lead.id, 'existait', true, 'depuis', v_lead.cree_le,
      'deja_recu', true, 'ne_plus_texter', v_lead.ne_plus_texter);
  end if;

  if v_cell is not null then
    select * into v_lead from public.leads where cellulaire = v_cell;
  end if;
  if v_lead.id is null and v_lieu is not null then
    select * into v_lead from public.leads where google_place_id = v_lieu order by cree_le limit 1;
  end if;

  if v_lead.id is null then
    insert into public.leads (
      resto, ville, google_place_id, prenom, cellulaire, courriel, premiere_source,
      reference_code, reference_nom, reference_type)
    values (
      coalesce(nullif(p ->> 'resto', ''), '(resto non précisé)'),
      nullif(p ->> 'ville', ''), v_lieu, nullif(p ->> 'prenom', ''), v_cell, nullif(p ->> 'courriel', ''),
      p ->> 'source',
      v_ref ->> 'code', v_ref ->> 'nom', v_ref ->> 'type')
    returning * into v_lead;
  else
    v_existait := true;
    update public.leads set
      ville = coalesce(ville, nullif(p ->> 'ville', '')),
      google_place_id = coalesce(google_place_id, v_lieu),
      prenom = coalesce(prenom, nullif(p ->> 'prenom', '')),
      cellulaire = coalesce(cellulaire, v_cell),
      courriel = coalesce(courriel, nullif(p ->> 'courriel', ''))
    where id = v_lead.id;
  end if;

  insert into public.lead_evenements (
    id, lead_id, type, source, contact, donnees,
    consentement_texte, consentement_coche, consentement_le,
    page, page_arrivee, site_origine, utm, video, reference, cree_le)
  values (
    v_evenement, v_lead.id, v_type, p ->> 'source',
    coalesce(p -> 'contact', '{}'::jsonb), coalesce(p -> 'donnees', '{}'::jsonb),
    p ->> 'consentement_texte', (p ->> 'consentement_coche')::boolean, (p ->> 'consentement_le')::timestamptz,
    p ->> 'page', p ->> 'page_arrivee', p ->> 'site_origine',
    case when jsonb_typeof(p -> 'utm') = 'object' then p -> 'utm' end,
    p ->> 'video', v_ref,
    coalesce((p ->> 'recu_le')::timestamptz, now()));

  return jsonb_build_object(
    'lead_id', v_lead.id, 'existait', v_existait, 'depuis', v_lead.cree_le,
    'deja_recu', false, 'ne_plus_texter', v_lead.ne_plus_texter);
end $$;

-- ─── La sécurité ───
--
-- La sécurité par rangée, SANS AUCUNE RÈGLE : rien n'est lisible ni modifiable
-- avec la clé publique. La clé secrète (rôle service_role) passe outre, et
-- c'est la seule que le site utilise, du serveur.

alter table public.leads enable row level security;
alter table public.lead_evenements enable row level security;
alter table public.gabarits enable row level security;
alter table public.reglages enable row level security;

revoke all on table public.leads, public.lead_evenements, public.gabarits, public.reglages from anon, authenticated;
grant select, insert, update, delete on table public.leads, public.lead_evenements, public.gabarits, public.reglages to service_role;

revoke execute on function public.enregistrer_lead(jsonb) from public, anon, authenticated;
grant execute on function public.enregistrer_lead(jsonb) to service_role;
