-- M3: Organization Tables

-- Projects Table
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null default auth.uid(),
  name text not null,
  description text,
  status text default 'active', -- active, archived, completed
  created_at timestamptz default now()
);

alter table projects enable row level security;

create policy "Users can view own projects" on projects for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on projects for delete using (auth.uid() = user_id);

-- Tasks Table
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null default auth.uid(),
  title text not null,
  status text default 'todo', -- todo, in_progress, done
  due_date timestamptz,
  project_id uuid references projects(id),
  origin_note_id uuid references notes(id), -- Traceability
  created_at timestamptz default now()
);

alter table tasks enable row level security;

create policy "Users can view own tasks" on tasks for select using (auth.uid() = user_id);
create policy "Users can insert own tasks" on tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on tasks for update using (auth.uid() = user_id);
create policy "Users can delete own tasks" on tasks for delete using (auth.uid() = user_id);

-- Task Tags (Junction)
create table if not exists task_tags (
  task_id uuid references tasks(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (task_id, tag_id)
);

alter table task_tags enable row level security;

create policy "Users can view own task tags" on task_tags for select using (
  exists (select 1 from tasks where id = task_tags.task_id and user_id = auth.uid())
);
create policy "Users can insert own task tags" on task_tags for insert with check (
  exists (select 1 from tasks where id = task_tags.task_id and user_id = auth.uid())
);
create policy "Users can delete own task tags" on task_tags for delete using (
  exists (select 1 from tasks where id = task_tags.task_id and user_id = auth.uid())
);

-- Project Tags (Junction)
create table if not exists project_tags (
  project_id uuid references projects(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (project_id, tag_id)
);

alter table project_tags enable row level security;

create policy "Users can view own project tags" on project_tags for select using (
  exists (select 1 from projects where id = project_tags.project_id and user_id = auth.uid())
);
create policy "Users can insert own project tags" on project_tags for insert with check (
  exists (select 1 from projects where id = project_tags.project_id and user_id = auth.uid())
);
create policy "Users can delete own project tags" on project_tags for delete using (
  exists (select 1 from projects where id = project_tags.project_id and user_id = auth.uid())
);
