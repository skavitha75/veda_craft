-- Create a table for public profiles
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  phone_number text,
  gender text,
  dob date,
  is_profile_complete boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create a table for saved delivery addresses
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

-- Set up Row Level Security (RLS)
alter table public.addresses enable row level security;

drop policy if exists "Users can view own addresses." on public.addresses;
drop policy if exists "Users can insert own addresses." on public.addresses;
drop policy if exists "Users can update own addresses." on public.addresses;
drop policy if exists "Users can delete own addresses." on public.addresses;

create policy "Users can view own addresses." on public.addresses
  for select using (auth.uid() = user_id);

create policy "Users can insert own addresses." on public.addresses
  for insert with check (auth.uid() = user_id);

create policy "Users can update own addresses." on public.addresses
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete own addresses." on public.addresses
  for delete using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function when a new user is created in auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
