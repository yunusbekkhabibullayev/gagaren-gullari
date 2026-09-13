-- Orders jadvalida anonim xaridorlar uchun SELECT va INSERT ruxsatini berish
GRANT SELECT, INSERT ON public.orders TO anon, authenticated;

DROP POLICY IF EXISTS "anyone can place order" ON public.orders;
DROP POLICY IF EXISTS "anyone select orders" ON public.orders;

CREATE POLICY "anyone can place order" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone select orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);
