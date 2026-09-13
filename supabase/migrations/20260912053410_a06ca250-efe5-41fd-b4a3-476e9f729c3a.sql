ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS delivery_date date,
  ADD COLUMN IF NOT EXISTS delivery_time text NOT NULL DEFAULT '';