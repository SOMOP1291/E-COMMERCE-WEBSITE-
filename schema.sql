-- STEP 7: run this once in Supabase → SQL Editor
create table if not exists orders (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  total      numeric(10,2) not null check (total >= 0),
  items      int not null check (items > 0),
  city       text,
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

create policy "users read own orders"   on orders for select using (auth.uid() = user_id);
create policy "users insert own orders" on orders for insert with check (auth.uid() = user_id);

-- STEP 8: after placing a test order, check it arrived
-- select id, user_id, total, items, city, created_at from orders order by created_at desc;
