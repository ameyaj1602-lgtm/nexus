-- Nexus Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Student Profiles
create table if not exists student_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  age integer,
  class_grade integer,
  board text,
  city text,
  school_type text,
  parent_expectations text[],
  interests text[],
  language_pref text default 'en',
  onboarding_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Identity Snapshots (radar chart data over time)
create table if not exists identity_snapshots (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references student_profiles(id) on delete cascade,
  creative integer default 50,
  analytical integer default 50,
  social integer default 50,
  practical integer default 50,
  entrepreneurial integer default 50,
  caring integer default 50,
  source text default 'self',
  snapshot_date timestamptz default now()
);

-- 3. Career Hypotheses
create table if not exists career_hypotheses (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references student_profiles(id) on delete cascade,
  career_name text not null,
  status text default 'exploring' check (status in ('exploring', 'tested', 'rejected', 'active')),
  evidence text,
  liked_aspects text,
  disliked_aspects text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Interest Responses (discovery swipe cards)
create table if not exists interest_responses (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references student_profiles(id) on delete cascade,
  card_id integer not null,
  response text check (response in ('love', 'meh', 'nope')),
  created_at timestamptz default now()
);

-- 5. Value Rankings
create table if not exists value_rankings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references student_profiles(id) on delete cascade,
  value_name text not null,
  rank integer not null,
  created_at timestamptz default now()
);

-- 6. Journal Entries
create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references student_profiles(id) on delete cascade,
  prompt text not null,
  response text not null,
  mood text,
  created_at timestamptz default now()
);

-- 7. Coach Conversations
create table if not exists coach_conversations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references student_profiles(id) on delete cascade,
  messages jsonb not null default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 8. Parent Profiles
create table if not exists parent_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  linked_student_id uuid references student_profiles(id),
  invite_code text unique default substr(md5(random()::text), 1, 8),
  created_at timestamptz default now()
);

-- 9. Alignment Surveys
create table if not exists alignment_surveys (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references parent_profiles(id) on delete cascade,
  student_id uuid references student_profiles(id) on delete cascade,
  parent_expectations text[],
  alignment_score integer,
  survey_date timestamptz default now()
);

-- Enable Row Level Security
alter table student_profiles enable row level security;
alter table identity_snapshots enable row level security;
alter table career_hypotheses enable row level security;
alter table interest_responses enable row level security;
alter table value_rankings enable row level security;
alter table journal_entries enable row level security;
alter table coach_conversations enable row level security;
alter table parent_profiles enable row level security;
alter table alignment_surveys enable row level security;

-- RLS Policies: Users can only access their own data
create policy "Users can manage own student profile" on student_profiles
  for all using (auth.uid() = user_id);

create policy "Students can manage own identity" on identity_snapshots
  for all using (student_id in (select id from student_profiles where user_id = auth.uid()));

create policy "Students can manage own hypotheses" on career_hypotheses
  for all using (student_id in (select id from student_profiles where user_id = auth.uid()));

create policy "Students can manage own interests" on interest_responses
  for all using (student_id in (select id from student_profiles where user_id = auth.uid()));

create policy "Students can manage own values" on value_rankings
  for all using (student_id in (select id from student_profiles where user_id = auth.uid()));

create policy "Students can manage own journal" on journal_entries
  for all using (student_id in (select id from student_profiles where user_id = auth.uid()));

create policy "Students can manage own conversations" on coach_conversations
  for all using (student_id in (select id from student_profiles where user_id = auth.uid()));

create policy "Users can manage own parent profile" on parent_profiles
  for all using (auth.uid() = user_id);

create policy "Parents can view linked student alignment" on alignment_surveys
  for all using (parent_id in (select id from parent_profiles where user_id = auth.uid()));
