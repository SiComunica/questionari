-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create operatori table
create table if not exists public.operatori (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id),
  stato text default 'nuovo',
  fonte text,
  
  -- Sezione A: Dati anagrafici e professionali
  nome text not null,
  cognome text not null,
  eta text not null,
  genere text not null,
  titolo_studio text not null,
  anni_esperienza text not null,
  tipo_contratto text not null,
  ruolo_attuale text not null,
  
  -- Sezione B: Struttura e ruolo
  id_struttura text not null,
  tipo_struttura text not null,
  professione text not null,
  professione_altro text,
  mansioni_principali text[] not null,
  competenze_specifiche text[] not null,
  formazione_specialistica text,
  certificazioni text[],
  lingue_conosciute text[],
  
  -- Sezione C: Esperienza con giovani
  esperienza_giovani text not null,
  persone_seguite jsonb not null,
  persone_maggiorenni jsonb not null,
  caratteristiche_persone text[] not null,
  caratteristiche_altro text,
  
  -- Sezione D: Approccio e metodologia
  approccio_educativo text not null,
  tipo_intervento text[] not null,
  intervento_altro text,
  sfide_principali text[] not null,
  strategie_supporto text[] not null,
  casi_successo text not null,
  
  -- Sezione E: Difficoltà riscontrate
  difficolta_uscita jsonb not null,
  difficolta_altro_spec text,
  
  -- Sezione F: Sviluppo professionale
  punti_forza text[] not null,
  aree_miglioramento text[] not null,
  obiettivi_professionali text not null,
  formazione_desiderata text[] not null,
  suggerimenti text
);

-- Enable RLS
alter table public.operatori enable row level security;

-- Drop existing policies if any
drop policy if exists "Gli admin possono vedere tutti i questionari" on public.operatori;
drop policy if exists "Gli operatori possono inserire questionari" on public.operatori;
drop policy if exists "Gli operatori possono vedere i propri questionari" on public.operatori;

-- Create policies
create policy "Gli admin possono vedere tutti i questionari"
  on public.operatori
  for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Gli operatori possono inserire questionari"
  on public.operatori
  for insert
  to authenticated
  with check (auth.jwt() ->> 'role' = 'operatore');

create policy "Gli operatori possono vedere i propri questionari"
  on public.operatori
  for select
  to authenticated
  using (auth.jwt() ->> 'role' = 'operatore' and created_by = auth.uid());

-- Create indexes for better performance
create index if not exists operatori_created_by_idx on public.operatori(created_by);
create index if not exists operatori_stato_idx on public.operatori(stato);
create index if not exists operatori_created_at_idx on public.operatori(created_at); 