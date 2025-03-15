-- Creazione tabella strutture
CREATE TABLE strutture (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_struttura TEXT NOT NULL,
  forma_giuridica TEXT NOT NULL,
  tipo_struttura TEXT NOT NULL,
  anno_inizio INTEGER NOT NULL,
  mission TEXT,
  personale_retribuito_uomini INTEGER DEFAULT 0,
  personale_retribuito_donne INTEGER DEFAULT 0,
  personale_volontario_uomini INTEGER DEFAULT 0,
  personale_volontario_donne INTEGER DEFAULT 0,
  figure_professionali TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Creazione tabella operatori
CREATE TABLE operatori (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_struttura TEXT NOT NULL,
  tipo_struttura TEXT NOT NULL,
  professione TEXT NOT NULL,
  persone_seguite_uomini INTEGER DEFAULT 0,
  persone_seguite_donne INTEGER DEFAULT 0,
  persone_seguite_maggiorenni_uomini INTEGER DEFAULT 0,
  persone_seguite_maggiorenni_donne INTEGER DEFAULT 0,
  caratteristiche_persone_seguite TEXT[] DEFAULT '{}',
  tipo_interventi TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Creazione tabella giovani
CREATE TABLE giovani (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  percorso_autonomia BOOLEAN DEFAULT false,
  tipo_percorso TEXT,
  vive_in_struttura BOOLEAN DEFAULT false,
  collocazione_attuale TEXT,
  fattori_vulnerabilita TEXT[] DEFAULT '{}',
  sesso TEXT NOT NULL,
  classe_eta TEXT NOT NULL,
  luogo_nascita TEXT NOT NULL,
  cittadinanza TEXT NOT NULL,
  permesso_soggiorno TEXT,
  tempo_in_struttura TEXT NOT NULL,
  precedenti_strutture TEXT NOT NULL,
  famiglia_origine TEXT[] DEFAULT '{}',
  titolo_studio TEXT NOT NULL,
  attivita_precedenti TEXT[] DEFAULT '{}',
  attivita_attuali TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Creazione indici per migliorare le performance
CREATE INDEX idx_strutture_id_struttura ON strutture(id_struttura);
CREATE INDEX idx_operatori_id_struttura ON operatori(id_struttura);
CREATE INDEX idx_giovani_created_at ON giovani(created_at); 