-- Security Hardening & RLS Lock Down Migration
-- Fixes products RLS bypass, orders privacy leak, stock race conditions, and DB constraints.

-- 1. LOCK DOWN PRODUCTS TABLE
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.products FROM anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

DROP POLICY IF EXISTS "allow all products select" ON public.products;
DROP POLICY IF EXISTS "allow all products insert" ON public.products;
DROP POLICY IF EXISTS "allow all products update" ON public.products;
DROP POLICY IF EXISTS "allow all products delete" ON public.products;
DROP POLICY IF EXISTS "public read active products" ON public.products;
DROP POLICY IF EXISTS "anon read active products" ON public.products;
DROP POLICY IF EXISTS "auth read products" ON public.products;
DROP POLICY IF EXISTS "admin insert products" ON public.products;
DROP POLICY IF EXISTS "admin update products" ON public.products;
DROP POLICY IF EXISTS "admin delete products" ON public.products;

CREATE POLICY "public read active products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. LOCK DOWN ORDERS TABLE (PRIVACY FIX & STRICT CHECKOUT INSERT)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.orders FROM anon, authenticated;
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

DROP POLICY IF EXISTS "anyone select orders" ON public.orders;
DROP POLICY IF EXISTS "anyone can place order" ON public.orders;
DROP POLICY IF EXISTS "admin read orders" ON public.orders;
DROP POLICY IF EXISTS "admin select orders" ON public.orders;
DROP POLICY IF EXISTS "admin update orders" ON public.orders;
DROP POLICY IF EXISTS "admin delete orders" ON public.orders;

-- Order placement validation check
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
    AND payment_method IN ('cash','card','transfer')
    AND jsonb_typeof(items) = 'array'
    AND jsonb_array_length(items) BETWEEN 1 AND 100
  );

-- Only admins can read/update/delete orders directly from PostgREST API
CREATE POLICY "admin select orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin delete orders"
  ON public.orders FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. LOCK DOWN USER_ROLES TABLE (PREVENT SELF-ESCALATION)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.user_roles FROM anon, authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

DROP POLICY IF EXISTS "users read own roles" ON public.user_roles;

CREATE POLICY "users read own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- 4. ATOMIC STOCK DECREMENT FUNCTION
CREATE OR REPLACE FUNCTION public.decrement_product_stock(p_product_id uuid, p_quantity integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_quantity <= 0 THEN
    RETURN false;
  END IF;

  UPDATE public.products
  SET stock = stock - p_quantity,
      updated_at = now()
  WHERE id = p_product_id
    AND stock >= p_quantity;

  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.decrement_product_stock(uuid, integer) TO authenticated, service_role;

-- 5. ORDER STATUS CHECK CONSTRAINT
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('new', 'confirmed', 'pending', 'preparing', 'ready', 'delivering', 'shipped', 'delivered', 'completed', 'cancelled'));

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
