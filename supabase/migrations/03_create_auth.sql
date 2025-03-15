-- Crea schema auth se non esiste
create schema if not exists auth;

-- Tabella utenti autenticati
create table auth.users (
  id uuid primary key default uuid_generate_v4(),
  role user_type not null default 'anonimo'::user_type,
  codice text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Inserisci utenti di default
insert into auth.users (role, codice) values
  ('admin'::user_type, 'admin2025'),
  ('anonimo'::user_type, 'anonimo9999');

-- Inserisci operatori da 1 a 300
do $$
begin
  for i in 1..300 loop
    insert into auth.users (role, codice)
    values ('operatore'::user_type, 'operatore' || i::text);
  end loop;
end $$; 