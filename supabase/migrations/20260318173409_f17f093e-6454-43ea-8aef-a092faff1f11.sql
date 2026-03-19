
-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Users can read their own roles
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Now restrict portfolio_works write to admins only
DROP POLICY IF EXISTS "Allow insert portfolio_works" ON public.portfolio_works;
DROP POLICY IF EXISTS "Allow update portfolio_works" ON public.portfolio_works;
DROP POLICY IF EXISTS "Allow delete portfolio_works" ON public.portfolio_works;

CREATE POLICY "Admins can insert portfolio_works" ON public.portfolio_works
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update portfolio_works" ON public.portfolio_works
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete portfolio_works" ON public.portfolio_works
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Restrict site_settings write to admins
DROP POLICY IF EXISTS "Allow insert site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow update site_settings" ON public.site_settings;

CREATE POLICY "Admins can insert site_settings" ON public.site_settings
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site_settings" ON public.site_settings
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Restrict site_stats write to authenticated users (visits/requests tracking)
DROP POLICY IF EXISTS "Allow update site_stats" ON public.site_stats;
DROP POLICY IF EXISTS "Allow insert site_stats" ON public.site_stats;

CREATE POLICY "Anon can update site_stats" ON public.site_stats
  FOR UPDATE USING (true);
CREATE POLICY "Anon can insert site_stats" ON public.site_stats
  FOR INSERT WITH CHECK (true);
