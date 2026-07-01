-- Create the serviceable_states table
CREATE TABLE IF NOT EXISTS public.serviceable_states (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  state_name VARCHAR(100) NOT NULL UNIQUE,
  estimated_days INTEGER NOT NULL DEFAULT 3,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.serviceable_states ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to serviceable_states" 
ON public.serviceable_states 
FOR SELECT 
USING (true);

-- Insert initial seed data
INSERT INTO public.serviceable_states (state_name, estimated_days, is_active)
VALUES
  ('Tamil Nadu', 2, true),
  ('Kerala', 3, true),
  ('Karnataka', 3, true),
  ('Andhra Pradesh', 4, true),
  ('Telangana', 4, true),
  ('Maharashtra', 5, true),
  ('Delhi', 5, true),
  ('Gujarat', 6, false),
  ('West Bengal', 6, false),
  ('Rajasthan', 6, false)
ON CONFLICT (state_name) DO UPDATE 
SET 
  estimated_days = EXCLUDED.estimated_days,
  is_active = EXCLUDED.is_active;
