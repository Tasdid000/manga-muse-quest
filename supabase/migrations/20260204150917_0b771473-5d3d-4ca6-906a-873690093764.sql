-- Create a public view that excludes user_id for public profile access
CREATE VIEW public.public_profiles
WITH (security_invoker=on) AS
SELECT id, username, avatar_url, created_at, updated_at
FROM public.profiles;

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Create a new policy that requires authentication to view profiles
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);