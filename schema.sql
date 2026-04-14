-- Create a table for prompts
CREATE TABLE prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Anonymous',
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
-- For a simple public community board, we can allow everyone to read
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON prompts FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access"
  ON prompts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON prompts FOR UPDATE
  USING (true);
