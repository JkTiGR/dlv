-- DRAGON cloud bridge schema for Supabase
-- Run this in the Supabase SQL Editor before starting dragon_local_server_cloud.py

create extension if not exists pgcrypto;

create table if not exists public.orders (
    id text primary key,
    code text not null unique,
    status text not null default 'NEW',
    type text not null default 'takeaway',
    source text not null default 'site',
    total numeric(10, 2) not null default 0,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    payload jsonb not null default '{}'::jsonb
);

create index if not exists idx_orders_code on public.orders (code);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_orders_type on public.orders (type);
create index if not exists idx_orders_source on public.orders (source);
create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_orders_updated_at on public.orders (updated_at desc);

create table if not exists public.menu_state (
    scope text primary key,
    updated_at timestamptz not null default timezone('utc', now()),
    payload jsonb not null default '{"version":1,"updated_at":"","items":{}}'::jsonb
);

insert into public.menu_state (scope, payload)
values ('global', '{"version":1,"updated_at":"","items":{}}'::jsonb)
on conflict (scope) do nothing;

alter table public.orders enable row level security;
alter table public.menu_state enable row level security;

drop policy if exists "orders public read" on public.orders;
create policy "orders public read"
on public.orders
for select
using (true);

drop policy if exists "orders service write" on public.orders;
create policy "orders service write"
on public.orders
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "menu_state public read" on public.menu_state;
create policy "menu_state public read"
on public.menu_state
for select
using (true);

drop policy if exists "menu_state service write" on public.menu_state;
create policy "menu_state service write"
on public.menu_state
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

do $$
begin
    if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'orders'
    ) then
        alter publication supabase_realtime add table public.orders;
    end if;

    if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'menu_state'
    ) then
        alter publication supabase_realtime add table public.menu_state;
    end if;
end $$;
