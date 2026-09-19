# NASTARIN GULLARI 🌸 — Gagarin shahar Gul va Buketlar Do'koni

NASTARIN GULLARI — Gagarin bo'ylab yangi uzilgan gullar, premium guldastalar, atirgullar, tuvakdagi o'simliklar va sovg'a to'plamlarini 24/7 bepul yetkazib berish bo'yicha zamonaviy onlayn e-commerce platformasi.

---

## 🌟 Imkoniyatlar & Xususiyatlar

- **🌸 Tinch & Zamonaviy Dizayn:** Premium responsive UI/UX, mobil moslashuvchan gorizontal scroll tablar.
- **💐 Katalog & Filtrlar:** Kategoriyalar, gullarning kelib chiqishi va narx bo'yicha tezkor saralash.
- **🛒 Savat & Buyurtma berish:** Tezkor buyurtma rasmiylashtirish, yetkazib berish va to'lov usulini tanlash.
- **🤖 Telegram Bot Integratsiyasi:** Buyurtma berilishi bilanoq Telegram botga avtomatik batafsil bildirishnoma borishi (`8898489484:AAGqQN4nAPNSxb6KNHx2VNRbcVoww4U5dBU`).
- **🛡️ Admin Panel (`/admin`):**
  - **Mahsulotlar boshqaruvi (`/admin/products`):** Mahsulot qo'shish/tahrirlash, 2 tagacha rasm yuklash, ranglar, o'lcham, og'irlik va tayyorlanish vaqtini kiritish.
  - **Kategoriyalar boshqaruvi (`/admin/categories`):** Kategoriyalarni faol/nofaol qilish, tahrirlash.
  - **Buyurtmalar nazorati (`/admin/orders`):** Telegram bot ulash, buyurtmalar holatini real vaqtda kuzatish va yangilash.
- **☁️ Supabase Cloud DB Integratsiyasi:** Real-time ma'lumotlar bazasi va zaxira mexanizmi.

---

## 🚀 Ishga tushirish (Local Setup)

```bash
# Kutubxonalarni o'rnatish
npm install

# Dev serverni ishga tushirish
npm run dev

# Production build qilish
npm run build
```

---

## 🌐 Vercel Deploy uchun Environment Variables

Vercel Dashboard -> Project Settings -> Environment Variables bo'limiga quyidagilarni kiriting:

```env
VITE_SUPABASE_PROJECT_ID=rixlvvvyeqzasoavwdng
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YbKnIPrg5mQfAVNLPHi82w_FwASss-k
VITE_SUPABASE_URL=https://rixlvvvyeqzasoavwdng.supabase.co
VITE_TELEGRAM_BOT_TOKEN=8898489484:AAGqQN4nAPNSxb6KNHx2VNRbcVoww4U5dBU
```
