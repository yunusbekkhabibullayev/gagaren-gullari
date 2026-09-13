-- Products jadvaliga yangi ustunlarni qo'shish (2-rasm va Tayyorlanish vaqti)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url_2 text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS preparation text DEFAULT '15–30 daqiqa (tayyor)';
