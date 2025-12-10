-- Create a table for storing chat history
create table chat_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  doc_id text not null,
  role text check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table chat_history enable row level security;

-- Create policy to allow users to see only their own chat history
create policy "Users can view their own chat history"
on chat_history for select
using (auth.uid() = user_id);

-- Create policy to allow users to insert their own chat messages
create policy "Users can insert their own chat messages"
on chat_history for insert
with check (auth.uid() = user_id);
