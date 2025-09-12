-- Script per copiare le policies dalla tabella operatorinew (che funziona) alla tabella operatori
-- Esegui questo script nel tuo database Supabase

-- 1. Verifica le policies della tabella operatorinew (che funziona)
SELECT 'POLICIES OPERATORINEW:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'operatorinew';

-- 2. Verifica le policies della tabella operatori (che non funziona)
SELECT 'POLICIES OPERATORI:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'operatori';

-- 3. Rimuovi tutte le policies esistenti dalla tabella operatori
DROP POLICY IF EXISTS "Admin full access operatori" ON public.operatori;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.operatori;
DROP POLICY IF EXISTS "Enable select for all users" ON public.operatori;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.operatori;

-- 4. Crea le stesse policies della tabella operatorinew per la tabella operatori
-- (Questo è un esempio, esegui solo dopo aver visto le policies di operatorinew)

-- Se operatorinew ha una policy per DELETE, copiala qui
-- CREATE POLICY "Enable delete for all users" ON public.operatori FOR DELETE TO public USING (true);

-- Se operatorinew ha una policy per INSERT, copiala qui  
-- CREATE POLICY "Enable insert for all users" ON public.operatori FOR INSERT TO public WITH CHECK (true);

-- Se operatorinew ha una policy per SELECT, copiala qui
-- CREATE POLICY "Enable select for all users" ON public.operatori FOR SELECT TO public USING (true);

-- 5. Verifica che le policies siano state copiate
SELECT 'POLICIES OPERATORI DOPO LA COPIA:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'operatori'; 