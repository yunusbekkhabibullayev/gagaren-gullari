-- Products jadvalida RLS ruxsatlarini barchaga ochish (401 xatolikni bartaraf etish)
GRANT ALL ON public.products TO anon, authenticated;

DROP POLICY IF EXISTS "public read active products" ON public.products;
DROP POLICY IF EXISTS "admin insert products" ON public.products;
DROP POLICY IF EXISTS "admin update products" ON public.products;
DROP POLICY IF EXISTS "admin delete products" ON public.products;

CREATE POLICY "allow all products select" ON public.products FOR SELECT USING (true);
CREATE POLICY "allow all products insert" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "allow all products update" ON public.products FOR UPDATE USING (true);
CREATE POLICY "allow all products delete" ON public.products FOR DELETE USING (true);
