
CREATE TABLE public.categories (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE USING (has_role(auth.uid(), 'admin'));

INSERT INTO public.categories (name, sort_order) VALUES
  ('تحليل', 1),
  ('سجلات', 2),
  ('تصميم صور', 3),
  ('مقطع فيديو', 4),
  ('سيرة ذاتية', 5),
  ('صفحة متابعة الدرجات', 6),
  ('سجل اداء وظيفي', 7),
  ('تقارير', 8);
