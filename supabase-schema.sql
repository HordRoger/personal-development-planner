-- Supabase schema for Personal Development Planner.
-- Workspace ID configured in supabase-config.js:
-- 4b4349c2-da24-465a-9320-10d886c5216c

create table if not exists public.planner_state (
  workspace_id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.planner_state enable row level security;

drop policy if exists "planner_state_select_workspace" on public.planner_state;
drop policy if exists "planner_state_insert_workspace" on public.planner_state;
drop policy if exists "planner_state_update_workspace" on public.planner_state;

create policy "planner_state_select_workspace"
on public.planner_state
for select
to anon
using (workspace_id = '4b4349c2-da24-465a-9320-10d886c5216c');

create policy "planner_state_insert_workspace"
on public.planner_state
for insert
to anon
with check (workspace_id = '4b4349c2-da24-465a-9320-10d886c5216c');

create policy "planner_state_update_workspace"
on public.planner_state
for update
to anon
using (workspace_id = '4b4349c2-da24-465a-9320-10d886c5216c')
with check (workspace_id = '4b4349c2-da24-465a-9320-10d886c5216c');
