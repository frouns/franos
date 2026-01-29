-- M5: Weekly Reviews

create table if not exists weekly_reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null default auth.uid(),
  week_start_date date not null,
  highlights text,
  challenges text,
  metrics jsonb default '{}'::jsonb, -- Store snapshot of stats
  created_at timestamptz default now()
);

alter table weekly_reviews enable row level security;

create policy "Users can view own reviews" on weekly_reviews for select using (auth.uid() = user_id);
create policy "Users can insert own reviews" on weekly_reviews for insert with check (auth.uid() = user_id);
create policy "Users can update own reviews" on weekly_reviews for update using (auth.uid() = user_id);
create policy "Users can delete own reviews" on weekly_reviews for delete using (auth.uid() = user_id);
