-- Enable RLS
alter table auth.users enable row level security;

-- Notes Table
create table if not exists notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null default auth.uid(),
  content text not null,
  is_archived boolean default false,
  created_at timestamptz default now()
);

alter table notes enable row level security;

create policy "Users can view own notes" on notes for select using (auth.uid() = user_id);
create policy "Users can insert own notes" on notes for insert with check (auth.uid() = user_id);
create policy "Users can update own notes" on notes for update using (auth.uid() = user_id);
create policy "Users can delete own notes" on notes for delete using (auth.uid() = user_id);

-- Tags Table
create table if not exists tags (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null default auth.uid(),
  name text not null,
  color text,
  created_at timestamptz default now()
);

alter table tags enable row level security;

create policy "Users can view own tags" on tags for select using (auth.uid() = user_id);
create policy "Users can insert own tags" on tags for insert with check (auth.uid() = user_id);
create policy "Users can update own tags" on tags for update using (auth.uid() = user_id);
create policy "Users can delete own tags" on tags for delete using (auth.uid() = user_id);

-- Note Tags Context
create table if not exists note_tags (
  note_id uuid references notes(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (note_id, tag_id)
);

alter table note_tags enable row level security;

create policy "Users can view own note tags" on note_tags for select using (
  exists (select 1 from notes where id = note_tags.note_id and user_id = auth.uid())
);
create policy "Users can insert own note tags" on note_tags for insert with check (
  exists (select 1 from notes where id = note_tags.note_id and user_id = auth.uid())
);
create policy "Users can delete own note tags" on note_tags for delete using (
  exists (select 1 from notes where id = note_tags.note_id and user_id = auth.uid())
);
