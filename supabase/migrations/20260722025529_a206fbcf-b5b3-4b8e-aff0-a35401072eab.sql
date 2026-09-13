
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.claim_admin_if_first()
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  has_any_admin boolean;
BEGIN
  IF uid IS NULL THEN
    RETURN false;
  END IF;
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO has_any_admin;
  IF has_any_admin THEN
    RETURN public.has_role(uid, 'admin');
  END IF;
  INSERT INTO public.user_roles(user_id, role) VALUES (uid, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_admin_if_first() TO authenticated;

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  pattern text NOT NULL DEFAULT '',
  category text NOT NULL,
  workshop text NOT NULL,
  price integer NOT NULL CHECK (price >= 0),
  size text NOT NULL DEFAULT '',
  weight text NOT NULL DEFAULT '',
  colors text[] NOT NULL DEFAULT '{}',
  image_url text,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  story text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read active products"
  ON public.products FOR SELECT TO anon, authenticated
  USING (active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin insert products"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin update products"
  ON public.products FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin delete products"
  ON public.products FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER products_touch_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.products (slug, name, pattern, category, workshop, price, size, weight, colors, image_url, stock, story) VALUES
  ('rishton-ikat-tovoq','Rishton Ikat Tovoq','Ikat gulli — ko''k, qizil, sariq','Tovoqlar','Rishton',480000,'Ø 32 sm','1.4 kg',ARRAY['Ko''k','Qizil','Sariq'],'/products/hero-plate.jpg',12,'Rishton ustaxonasi an''anasida qo''lda bo''yalgan katta tovoq.'),
  ('kobalt-tovoq','Kobalt Gulli Tovoq','Kobalt gulli','Tovoqlar','Rishton',390000,'Ø 26 sm','1.1 kg',ARRAY['Ko''k','Oq'],'/products/product-tovoq.jpg',20,'Klassik ko''k-oq palitrada, o''zbek gulli naqshi bilan bezalgan tovoq.'),
  ('anor-kosa','Anor Naqshli Kosa','Anor va gullar','Kosachalar','Rishton',145000,'Ø 11 sm','220 g',ARRAY['Qizil','Sariq','Yashil'],'/products/product-kosa.jpg',45,'Anor — mo''l-ko''llik va baraka ramzi.'),
  ('xiva-likopcha','Xiva Likopchasi','Feruza geometrik','Likopchalar','Xiva',95000,'Ø 15 sm','310 g',ARRAY['Feruza','Ko''k'],'/products/product-likopcha.jpg',60,'Xiva maktabining feruza va ko''k ranglaridagi likopchasi.'),
  ('choynak-toplam','Choynak To''plami','An''anaviy ikat','Choynak to''plami','Rishton',720000,'Choynak + 2 piyola','1.8 kg',ARRAY['Ko''k','Qizil'],'/products/product-choynak.jpg',8,'Choynak va ikkita piyoladan iborat sovg''abop to''plam.'),
  ('sovga-toplam','Sovg''a To''plami — 3 likopcha','Aralash naqshlar','Sovg''a to''plami','Rishton',260000,'3 × Ø 14 sm','900 g',ARRAY['Qizil','Ko''k','Yashil'],'/products/product-souvenir.jpg',15,'Uchta har xil naqshli likopchadan iborat to''plam.');

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL DEFAULT ('SO-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6))),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_city text NOT NULL DEFAULT '',
  customer_address text NOT NULL,
  note text NOT NULL DEFAULT '',
  payment_method text NOT NULL DEFAULT 'cash',
  items jsonb NOT NULL,
  subtotal integer NOT NULL,
  shipping integer NOT NULL DEFAULT 0,
  total integer NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can place order"
  ON public.orders FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "admin read orders"
  ON public.orders FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin update orders"
  ON public.orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin delete orders"
  ON public.orders FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER orders_touch_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY "public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "admin upload product images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin update product images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin delete product images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
