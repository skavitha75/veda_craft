-- Grant permissions to the anon and authenticated roles
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;

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
