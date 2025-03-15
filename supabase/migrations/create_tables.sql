-- Rimuovi le tabelle esistenti se presenti
drop table if exists strutture cascade;
drop table if exists operatori cascade;
drop table if exists giovani cascade;
drop type if exists user_type cascade;

-- Crea enum per i tipi di utente
CREATE TYPE user_type AS ENUM ('admin', 'operatore', 'anonimo');

-- Tabella strutture
CREATE TABLE strutture (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by user_type DEFAULT 'anonimo'::user_type NOT NULL,
  id_struttura TEXT NOT NULL,
  forma_giuridica TEXT NOT NULL,
  tipo_struttura TEXT NOT NULL,
  anno_inizio INTEGER NOT NULL,
  mission TEXT,
  personale_retribuito_uomini INTEGER DEFAULT 0,
  personale_retribuito_donne INTEGER DEFAULT 0,
  personale_volontario_uomini INTEGER DEFAULT 0,
  personale_volontario_donne INTEGER DEFAULT 0,
  figure_professionali TEXT[] DEFAULT '{}'::TEXT[]
);

-- Tabella operatori
CREATE TABLE operatori (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by user_type DEFAULT 'anonimo'::user_type NOT NULL,
  professione TEXT NOT NULL,
  persone_seguite_uomini INTEGER DEFAULT 0,
  persone_seguite_donne INTEGER DEFAULT 0,
  persone_seguite_maggiorenni_uomini INTEGER DEFAULT 0,
  persone_seguite_maggiorenni_donne INTEGER DEFAULT 0,
  caratteristiche_persone_seguite TEXT[] DEFAULT '{}'::TEXT[],
  tipo_interventi TEXT[] DEFAULT '{}'::TEXT[]
);

-- Tabella giovani
CREATE TABLE giovani (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by user_type DEFAULT 'anonimo'::user_type NOT NULL,
  percorso_autonomia BOOLEAN DEFAULT false,
  tipo_percorso TEXT,
  vive_in_struttura BOOLEAN DEFAULT false,
  collocazione_attuale TEXT,
  fattori_vulnerabilita TEXT[] DEFAULT '{}'::TEXT[],
  sesso TEXT NOT NULL,
  classe_eta TEXT NOT NULL,
  luogo_nascita TEXT,
  cittadinanza TEXT,
  permesso_soggiorno BOOLEAN,
  tempo_in_struttura TEXT,
  precedenti_strutture INTEGER DEFAULT 0,
  famiglia_origine TEXT,
  titolo_studio TEXT,
  attivita_precedenti TEXT[] DEFAULT '{}'::TEXT[],
  attivita_attuali TEXT[] DEFAULT '{}'::TEXT[]
);

-- Indici per migliorare le performance delle query
CREATE INDEX idx_strutture_created_by ON strutture(created_by);
CREATE INDEX idx_operatori_created_by ON operatori(created_by);
CREATE INDEX idx_giovani_created_by ON giovani(created_by);

-- Policies di sicurezza
alter table strutture enable row level security;
alter table operatori enable row level security;
alter table giovani enable row level security;

-- Policy per admin (può vedere tutto)
create policy "Admin full access" on strutture
  for all using (auth.role() = 'admin');
create policy "Admin full access" on operatori
  for all using (auth.role() = 'admin');
create policy "Admin full access" on giovani
  for all using (auth.role() = 'admin');

-- Policy per operatori (possono vedere solo i propri record)
create policy "Operatori access own records" on strutture
  for all using (auth.uid()::text = created_by);
create policy "Operatori access own records" on operatori
  for all using (auth.uid()::text = created_by);
create policy "Operatori access own records" on giovani
  for all using (auth.uid()::text = created_by); 