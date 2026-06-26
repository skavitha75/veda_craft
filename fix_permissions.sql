-- Ensure the addresses table exists before permissions are repaired
create table if not exists public.addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  full_name text not null,
  phone_number text not null,
  address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  landmark text,
  address_type text not null default 'Home' check (address_type in ('Home', 'Work')),
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Grant permissions to the anon and authenticated roles
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.addresses TO anon, authenticated, service_role;

-- Drop existing policies to recreate them cleanly
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Users can update own profile." on public.profiles;
drop policy if exists "Enable insert for authenticated users only" on public.profiles;
drop policy if exists "Enable update for users based on id" on public.profiles;
drop policy if exists "Enable read access for all users" on public.profiles;

-- Create robust RLS policies
create policy "Enable read access for all users"
on public.profiles for select
using ( true );

create policy "Enable insert for authenticated users only"
on public.profiles for insert
with check ( auth.uid() = id );

create policy "Enable update for users based on id"
on public.profiles for update
using ( auth.uid() = id )
with check ( auth.uid() = id );

-- Address policies
drop policy if exists "Users can view own addresses." on public.addresses;
drop policy if exists "Users can insert own addresses." on public.addresses;
drop policy if exists "Users can update own addresses." on public.addresses;
drop policy if exists "Users can delete own addresses." on public.addresses;
drop policy if exists "Enable read access for own addresses" on public.addresses;
drop policy if exists "Enable insert for own addresses" on public.addresses;
drop policy if exists "Enable update for own addresses" on public.addresses;
drop policy if exists "Enable delete for own addresses" on public.addresses;

alter table public.addresses enable row level security;

create policy "Enable read access for own addresses"
on public.addresses for select
using ( auth.uid() = user_id );

create policy "Enable insert for own addresses"
on public.addresses for insert
with check ( auth.uid() = user_id );

create policy "Enable update for own addresses"
on public.addresses for update
using ( auth.uid() = user_id )
with check ( auth.uid() = user_id );

create policy "Enable delete for own addresses"
on public.addresses for delete
using ( auth.uid() = user_id );
