-- Remove Auth Dependencies

-- Disable RLS on all tables
alter table notes disable row level security;
alter table tasks disable row level security;
alter table projects disable row level security;
alter table tags disable row level security;
alter table weekly_reviews disable row level security;
alter table task_tags disable row level security;
alter table project_tags disable row level security;
alter table note_tags disable row level security;

-- Make user_id nullable and remove default auth.uid()
alter table notes alter column user_id drop not null;
alter table notes alter column user_id drop default;

alter table tasks alter column user_id drop not null;
alter table tasks alter column user_id drop default;

alter table projects alter column user_id drop not null;
alter table projects alter column user_id drop default;

alter table tags alter column user_id drop not null;
alter table tags alter column user_id drop default;

alter table weekly_reviews alter column user_id drop not null;
alter table weekly_reviews alter column user_id drop default;
