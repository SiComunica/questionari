-- Aggiungi il campo deleted_at alla tabella operatori per il soft delete
ALTER TABLE public.operatori 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Crea un indice per migliorare le performance delle query che escludono i record cancellati
CREATE INDEX IF NOT EXISTS idx_operatori_deleted_at ON public.operatori(deleted_at);

-- Aggiorna le policies per escludere i record cancellati
DROP POLICY IF EXISTS "Gli admin possono vedere tutti i questionari" ON public.operatori;
DROP POLICY IF EXISTS "Gli operatori possono vedere i propri questionari" ON public.operatori;

-- Ricrea le policies con la condizione deleted_at IS NULL
CREATE POLICY "Gli admin possono vedere tutti i questionari non cancellati"
  ON public.operatori
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' AND deleted_at IS NULL);

CREATE POLICY "Gli operatori possono vedere i propri questionari non cancellati"
  ON public.operatori
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'operatore' AND created_by = auth.uid() AND deleted_at IS NULL); 