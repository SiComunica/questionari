-- Enable necessari extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Rimuovi tabelle esistenti se presenti
drop table if exists public.strutture cascade;
drop table if exists public.operatori cascade;
drop table if exists public.giovani cascade;
drop table if exists auth.users cascade;
drop type if exists user_type cascade;

-- Crea il tipo per i ruoli utente
do $$ 
begin
    if not exists (select 1 from pg_type where typname = 'user_type') then
        create type user_type as enum ('admin', 'operatore', 'anonimo');
    end if;
end $$; 