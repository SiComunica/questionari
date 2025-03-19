-- Rimuovi gli utenti esistenti (opzionale, usa solo se necessario)
-- DELETE FROM auth.users WHERE email LIKE '%@ferro.com';

-- Crea l'utente admin
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  is_super_admin
)
VALUES (
  'admin2025@ferro.com',
  crypt('admin2025', gen_salt('bf')),
  now(),
  '{"role":"admin"}'::jsonb,
  false
)
ON CONFLICT (email) DO NOTHING;

-- Crea gli utenti operatore (da 1 a 300)
DO $$
BEGIN
  FOR i IN 1..300 LOOP
    INSERT INTO auth.users (
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      is_super_admin
    )
    VALUES (
      'operatore' || i || '@ferro.com',
      crypt('operatore' || i, gen_salt('bf')),
      now(),
      '{"role":"operatore"}'::jsonb,
      false
    )
    ON CONFLICT (email) DO NOTHING;
  END LOOP;
END $$; 