
-- Function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
