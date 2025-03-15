-- Tabella strutture
create table public.strutture (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by text not null,
  id_struttura text not null,
  forma_giuridica text not null,
  tipo_struttura text not null,
  anno_inizio integer not null,
  mission text not null,
  personale_retribuito_uomini integer not null,
  personale_retribuito_donne integer not null,
  personale_volontario_uomini integer not null,
  personale_volontario_donne integer not null,
  figure_professionali text[] not null
);

-- Tabella operatori
create table public.operatori (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by text not null,
  id_struttura text not null,
  tipo_struttura text not null,
  professione text not null,
  persone_seguite_uomini integer not null,
  persone_seguite_donne integer not null,
  persone_seguite_maggiorenni_uomini integer not null,
  persone_seguite_maggiorenni_donne integer not null,
  caratteristiche_persone_seguite text[] not null,
  tipo_interventi text[] not null
);

-- Tabella giovani
create table public.giovani (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by text not null,
  percorso_autonomia boolean not null,
  tipo_percorso text,
  vive_in_struttura boolean not null,
  collocazione_attuale text,
  fattori_vulnerabilita text[] not null,
  sesso text not null,
  classe_eta text not null,
  luogo_nascita text not null,
  cittadinanza text not null,
  permesso_soggiorno text,
  tempo_in_struttura text not null,
  precedenti_strutture text not null,
  famiglia_origine text[] not null,
  titolo_studio text not null,
  attivita_precedenti text[] not null,
  attivita_attuali text[] not null
); 