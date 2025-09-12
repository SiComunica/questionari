-- Script per verificare e correggere le policies della tabella operatori
-- Esegui questo script nel tuo database Supabase

-- 1. Verifica le policies esistenti
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'operatori';

-- 2. Rimuovi le policies esistenti che potrebbero bloccare DELETE
DROP POLICY IF EXISTS "Gli admin possono vedere tutti i questionari" ON public.operatori;
DROP POLICY IF EXISTS "Gli operatori possono vedere i propri questionari" ON public.operatori;
DROP POLICY IF EXISTS "Gli admin possono vedere tutti i questionari non cancellati" ON public.operatori;
DROP POLICY IF EXISTS "Gli operatori possono vedere i propri questionari non cancellati" ON public.operatori;

-- 3. Crea una policy semplice per admin che permette tutte le operazioni
CREATE POLICY "Admin full access operatori"
  ON public.operatori
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- 4. Verifica che la policy sia stata creata
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'operatori'; 