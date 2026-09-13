-- Categories jadvali
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) UNIQUE NOT NULL,
  slug varchar(100) UNIQUE NOT NULL,
  icon varchar(50),
  color varchar(7),
  order_index integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Permissions
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;

-- Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read active categories"
  ON public.categories FOR SELECT TO anon, authenticated
  USING (active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin insert categories"
  ON public.categories FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin update categories"
  ON public.categories FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin delete categories"
  ON public.categories FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- updated_at auto-trigger
CREATE TRIGGER categories_touch_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Boshlang'ich ma'lumotlar (hozirgi hardcoded kategoriyalar)
INSERT INTO public.categories (name, slug, icon, color, order_index) VALUES
  ('Buketlar',             'buketlar',            'Flower2',     '#e85d4a', 0),
  ('Atirgullar',           'atirgullar',           'Heart',       '#f43f5e', 1),
  ('Tuvakdagi o''simliklar', 'tuvakdagi-osimliklar', 'Leaf',       '#10b981', 2),
  ('Sovg''a to''plamlari', 'sovga-toplamlari',     'Gift',        '#f59e0b', 3);
