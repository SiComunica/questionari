-- Rimuovi ruoli esistenti se presenti
drop role if exists admin;
drop role if exists operatore;
drop role if exists anonimo;

-- Crea i ruoli
create role admin;
create role operatore;
create role anonimo;

-- Assegna i permessi base
grant usage on schema public to admin, operatore, anonimo;
grant all privileges on all tables in schema public to admin;
grant select, insert on all tables in schema public to operatore, anonimo;

-- Rimuovi tabella utenti se esiste
drop table if exists auth.users cascade;

-- Crea la tabella degli utenti
create table auth.users (
  id uuid references auth.users primary key,
  role text not null check (role in ('admin', 'operatore', 'anonimo')),
  codice text not null unique
);

-- Rimuovi policies esistenti
drop policy if exists "Users can view own data" on auth.users;
drop policy if exists "Admin can view all data" on auth.users;

-- Crea le nuove policies
create policy "Users can view own data" on auth.users
  for select using (auth.uid() = id);

create policy "Admin can view all data" on auth.users
  for all using (auth.role() = 'admin');

-- Inserisci gli utenti di default
insert into auth.users (id, role, codice) values
  ('00000000-0000-0000-0000-000000000001', 'admin', 'admin2025'),
  ('00000000-0000-0000-0000-000000000002', 'anonimo', 'anonimo9999');

-- Inserisci gli operatori (da 1 a 100)
do $$
begin
  for i in 1..100 loop
    insert into auth.users (id, role, codice)
    values (
      gen_random_uuid(),
      'operatore',
      'operatore' || i
    );
  end loop;
end $$; 