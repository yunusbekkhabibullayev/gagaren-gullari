
-- 1) Lock down SECURITY DEFINER function execution
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.claim_admin_if_first() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.claim_admin_if_first() TO authenticated, service_role;

-- 2) Rewrite products SELECT policy so anon does not invoke has_role()
DROP POLICY IF EXISTS "public read active products" ON public.products;
CREATE POLICY "anon read active products"
  ON public.products FOR SELECT
  TO anon
  USING (active = true);
CREATE POLICY "auth read products"
  ON public.products FOR SELECT
  TO authenticated
  USING (active = true OR public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3) Replace permissive INSERT policy on orders with server-side validation
DROP POLICY IF EXISTS "anyone can place order" ON public.orders;
CREATE POLICY "anyone can place order"
  ON public.orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'new'
    AND subtotal >= 0
    AND shipping >= 0
    AND total = subtotal + shipping
    AND char_length(btrim(customer_name)) BETWEEN 2 AND 120
    AND char_length(btrim(customer_phone)) BETWEEN 5 AND 40
    AND char_length(btrim(customer_address)) BETWEEN 3 AND 500
    AND char_length(btrim(customer_city)) <= 120
    AND payment_method IN ('cash','card','transfer')
    AND jsonb_typeof(items) = 'array'
    AND jsonb_array_length(items) BETWEEN 1 AND 100
  );
