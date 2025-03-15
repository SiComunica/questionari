-- Abilita RLS su tutte le tabelle
alter table public.strutture enable row level security;
alter table public.operatori enable row level security;
alter table public.giovani enable row level security;
alter table auth.users enable row level security;

-- Policies per admin
create policy "Admin full access strutture" on public.strutture
  for all using (current_setting('auth.role') = 'admin');

create policy "Admin full access operatori" on public.operatori
  for all using (current_setting('auth.role') = 'admin');

create policy "Admin full access giovani" on public.giovani
  for all using (current_setting('auth.role') = 'admin');

create policy "Admin full access users" on auth.users
  for all using (current_setting('auth.role') = 'admin');

-- Policies per operatori
create policy "Operatori view own strutture" on public.strutture
  for select using (created_by = auth.uid()::text);

create policy "Operatori insert strutture" on public.strutture
  for insert with check (created_by = auth.uid()::text);

create policy "Operatori view own operatori" on public.operatori
  for select using (created_by = auth.uid()::text);

create policy "Operatori insert operatori" on public.operatori
  for insert with check (created_by = auth.uid()::text);

create policy "Operatori view own giovani" on public.giovani
  for select using (created_by = auth.uid()::text);

create policy "Operatori insert giovani" on public.giovani
  for insert with check (created_by = auth.uid()::text);

-- Policies per anonimi
create policy "Anonimi insert strutture" on public.strutture
  for insert with check (created_by = 'anonimo');

create policy "Anonimi insert operatori" on public.operatori
  for insert with check (created_by = 'anonimo');

create policy "Anonimi insert giovani" on public.giovani
  for insert with check (created_by = 'anonimo'); 