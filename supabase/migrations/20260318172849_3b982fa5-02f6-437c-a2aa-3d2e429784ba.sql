
-- Create portfolio_works table
CREATE TABLE public.portfolio_works (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'تصميم',
  image TEXT NOT NULL,
  description TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  client TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  tools TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_settings table
CREATE TABLE public.site_settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT ''
);

-- Create site_stats table
CREATE TABLE public.site_stats (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  count INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.portfolio_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read portfolio_works" ON public.portfolio_works FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read site_stats" ON public.site_stats FOR SELECT USING (true);

-- Public write access (admin is client-side auth only)
CREATE POLICY "Allow insert portfolio_works" ON public.portfolio_works FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update portfolio_works" ON public.portfolio_works FOR UPDATE USING (true);
CREATE POLICY "Allow delete portfolio_works" ON public.portfolio_works FOR DELETE USING (true);

CREATE POLICY "Allow insert site_settings" ON public.site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update site_settings" ON public.site_settings FOR UPDATE USING (true);

CREATE POLICY "Allow update site_stats" ON public.site_stats FOR UPDATE USING (true);
CREATE POLICY "Allow insert site_stats" ON public.site_stats FOR INSERT WITH CHECK (true);

-- Insert default stats
INSERT INTO public.site_stats (key, count) VALUES ('total_visits', 0), ('total_requests', 0);

-- Insert default works
INSERT INTO public.portfolio_works (title, category, image, description, images, client, duration, tools) VALUES
('هوية بصرية - مطعم', 'هوية', 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=600&q=80', 'تصميم هوية بصرية متكاملة لمطعم فاخر تشمل الشعار والألوان والخطوط وتطبيقات الهوية على جميع المواد التسويقية.', ARRAY['https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&q=80','https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80'], 'مطعم الذواقة', '15 يوم', 'Adobe Illustrator, Photoshop'),
('مونتاج فيديو إعلاني', 'مونتاج', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80', 'مونتاج فيديو إعلاني احترافي مع مؤثرات بصرية وصوتية عالية الجودة لحملة تسويقية رقمية.', ARRAY['https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80','https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'], 'شركة تقنية', '7 أيام', 'Adobe Premiere, After Effects'),
('تصميم سوشيال ميديا', 'تصميم', 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80', 'حزمة تصاميم سوشيال ميديا متكاملة تشمل بوستات وستوريز وأغلفة لجميع منصات التواصل الاجتماعي.', ARRAY['https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80','https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80'], 'متجر إلكتروني', '5 أيام', 'Adobe Photoshop, Canva'),
('شعار شركة تقنية', 'هوية', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80', 'تصميم شعار عصري ومبتكر لشركة تقنية ناشئة مع دليل استخدام كامل للشعار.', ARRAY['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80'], 'شركة ناشئة', '10 أيام', 'Adobe Illustrator'),
('بروشور تعريفي', 'تصميم', 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&q=80', 'تصميم بروشور تعريفي احترافي متعدد الصفحات مع رسوم بيانية وصور عالية الجودة.', ARRAY['https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80'], 'مؤسسة تعليمية', '8 أيام', 'Adobe InDesign, Illustrator'),
('موشن جرافيك', 'مونتاج', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', 'فيديو موشن جرافيك توضيحي يشرح خدمات الشركة بطريقة إبداعية وجذابة.', ARRAY['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'], 'شركة خدمات', '12 يوم', 'After Effects, Cinema 4D');
