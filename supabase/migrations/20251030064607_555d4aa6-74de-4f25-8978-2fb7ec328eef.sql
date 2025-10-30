-- Create schema_history table to store saved schemas
CREATE TABLE public.schema_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  location_type TEXT NOT NULL,
  schema_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.schema_history ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (anyone can save and view schemas)
CREATE POLICY "Anyone can view schema history" 
ON public.schema_history 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create schema history" 
ON public.schema_history 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete schema history" 
ON public.schema_history 
FOR DELETE 
USING (true);

-- Create index for faster queries
CREATE INDEX idx_schema_history_created_at ON public.schema_history(created_at DESC);