-- ============================================================
-- user_recent_searches table
-- Stores recent search queries per user (max 6 per user,
-- enforced in application layer via recentSearchService.js).
-- ============================================================

create table if not exists public.user_recent_searches (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  query       text not null,
  searched_at timestamptz not null default now()
);

-- Index for fast per-user lookups ordered by time
create index if not exists idx_recent_searches_user_time
  on public.user_recent_searches (user_id, searched_at desc);

-- ── Row Level Security ──────────────────────────────────────
alter table public.user_recent_searches enable row level security;

-- Users can only see their own searches
create policy "Users can view own recent searches"
  on public.user_recent_searches for select
  using (auth.uid() = user_id);

-- Users can insert their own searches
create policy "Users can insert own recent searches"
  on public.user_recent_searches for insert
  with check (auth.uid() = user_id);

-- Users can delete their own searches
create policy "Users can delete own recent searches"
  on public.user_recent_searches for delete
  using (auth.uid() = user_id);

-- ── Permissions ────────────────────────────────────────────
-- Grant table access to authenticated users
-- (RLS policies alone are not enough — base privileges also needed)
grant usage on schema public to authenticated;
grant select, insert, delete on public.user_recent_searches to authenticated;
