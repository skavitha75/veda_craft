-- Products table and Supabase Storage setup for VedaCraft

create extension if not exists pg_trgm;

create table if not exists public.products (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  description text,
  category text not null,
  brand text,
  price numeric(10, 2) not null check (price >= 0),
  discount_price numeric(10, 2) check (discount_price is null or discount_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  images text[] not null default '{}',
  rating numeric(3, 2) not null default 0 check (rating >= 0 and rating <= 5),
  total_reviews integer not null default 0 check (total_reviews >= 0),
  specifications jsonb not null default '{}'::jsonb,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now())
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

create index if not exists idx_products_active_created
  on public.products (is_active, created_at desc);

create index if not exists idx_products_active_category
  on public.products (is_active, lower(category));

create index if not exists idx_products_active_brand
  on public.products (is_active, lower(brand));

create index if not exists idx_products_active_price
  on public.products (is_active, price);

create index if not exists idx_products_active_rating
  on public.products (is_active, rating desc);

create index if not exists idx_products_active_featured
  on public.products (is_active, is_featured);

create index if not exists idx_products_specs_gin
  on public.products using gin (specifications);

create index if not exists idx_products_search_trgm
  on public.products using gin (
    (coalesce(name, '') || ' ' || coalesce(slug, '') || ' ' || coalesce(description, '') || ' ' || coalesce(category, '') || ' ' || coalesce(brand, '')) gin_trgm_ops
  );

alter table public.products enable row level security;

drop policy if exists "Active products are publicly readable." on public.products;
create policy "Active products are publicly readable."
on public.products for select
using (is_active = true);

grant select on public.products to anon, authenticated;
grant all on public.products to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Product images are publicly readable." on storage.objects;
create policy "Product images are publicly readable."
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Service role can manage product images." on storage.objects;
create policy "Service role can manage product images."
on storage.objects for all
using (bucket_id = 'product-images' and auth.role() = 'service_role')
with check (bucket_id = 'product-images' and auth.role() = 'service_role');
