-- orders jadvalidagi note ustunini schema cache da ko'rsatish uchun qayta tasdiqlash
-- PGRST204 xatosini tuzatadi: "Could not find the 'note' column of 'orders' in the schema cache"

-- Agar note ustuni mavjud bo'lmasa qo'shamiz (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'orders'
      AND column_name  = 'note'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN note text NOT NULL DEFAULT '';
  END IF;
END;
$$;

-- PostgREST schema cache ni yangilash
NOTIFY pgrst, 'reload schema';
