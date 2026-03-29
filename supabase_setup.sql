-- SplitTrack Database Schema
-- Run this entire file in Supabase SQL Editor

-- ─── TABLES ───────────────────────────────────────────────

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null,
  created_at timestamptz default now()
);

create table groups (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  currency text default '£',
  created_by uuid references profiles(id) on delete cascade,
  created_at timestamptz default now()
);

create table group_members (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references groups(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  joined_at timestamptz default now(),
  unique(group_id, user_id)
);

create table expenses (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references groups(id) on delete cascade,
  description text not null,
  amount numeric(10,2) not null,
  paid_by uuid references profiles(id) on delete cascade,
  created_by uuid references profiles(id) on delete cascade,
  created_at timestamptz default now()
);

create table expense_splits (
  id uuid default gen_random_uuid() primary key,
  expense_id uuid references expenses(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  amount numeric(10,2) not null,
  unique(expense_id, user_id)
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────

alter table profiles enable row level security;
alter table groups enable row level security;
alter table group_members enable row level security;
alter table expenses enable row level security;
alter table expense_splits enable row level security;

-- profiles
create policy "Anyone can view profiles" on profiles for select using (true);
create policy "Users insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);

-- groups
create policy "Members can view their groups" on groups for select using (
  exists (select 1 from group_members where group_id = groups.id and user_id = auth.uid())
  or created_by = auth.uid()
);
create policy "Auth users create groups" on groups for insert with check (auth.uid() = created_by);
create policy "Creator updates group" on groups for update using (auth.uid() = created_by);
create policy "Creator deletes group" on groups for delete using (auth.uid() = created_by);

-- group_members
create policy "Members view group members" on group_members for select using (
  exists (select 1 from group_members gm where gm.group_id = group_members.group_id and gm.user_id = auth.uid())
);
create policy "Creator adds members" on group_members for insert with check (
  exists (select 1 from groups where id = group_id and created_by = auth.uid())
  or user_id = auth.uid()
);
create policy "Users leave groups" on group_members for delete using (user_id = auth.uid());

-- expenses
create policy "Members view expenses" on expenses for select using (
  exists (select 1 from group_members where group_id = expenses.group_id and user_id = auth.uid())
);
create policy "Members add expenses" on expenses for insert with check (
  exists (select 1 from group_members where group_id = expenses.group_id and user_id = auth.uid())
);
create policy "Creator deletes expense" on expenses for delete using (auth.uid() = created_by);

-- expense_splits
create policy "Members view splits" on expense_splits for select using (
  exists (
    select 1 from expenses e
    join group_members gm on gm.group_id = e.group_id
    where e.id = expense_splits.expense_id and gm.user_id = auth.uid()
  )
);
create policy "Members insert splits" on expense_splits for insert with check (true);
create policy "Members delete splits" on expense_splits for delete using (true);

-- ─── AUTO-CREATE PROFILE ON SIGNUP ────────────────────────

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
