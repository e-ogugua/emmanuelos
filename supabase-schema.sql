-- EmmanuelOS Apps Table Schema
-- Run this SQL in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Live', 'Finalizing', 'In Development')),
  live_url TEXT,
  github_url TEXT,
  analytics_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}',
  socials JSONB DEFAULT '{}',
  traffic INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_apps_category ON apps(category);
CREATE INDEX IF NOT EXISTS idx_apps_status ON apps(status);
CREATE INDEX IF NOT EXISTS idx_apps_created_at ON apps(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access and authenticated write access
CREATE POLICY "Allow public read access" ON apps
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON apps
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON apps
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON apps
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create a function to automatically update last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update last_updated
CREATE TRIGGER trigger_apps_last_updated
  BEFORE UPDATE ON apps
  FOR EACH ROW
  EXECUTE FUNCTION update_last_updated();
