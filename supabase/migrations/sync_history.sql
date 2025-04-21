
-- Create sync_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.sync_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  success BOOLEAN,
  stats JSONB DEFAULT '{"added": 0, "errors": [], "failed": 0, "deleted": 0, "updated": 0}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  message TEXT,
  sync_type TEXT NOT NULL DEFAULT 'notion',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Allow public read access for admin dashboard
ALTER TABLE public.sync_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read/insert/update access to authenticated admin users
CREATE POLICY "Allow admin access to sync history" ON public.sync_history
  USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS sync_history_started_at_idx ON public.sync_history (started_at DESC);
