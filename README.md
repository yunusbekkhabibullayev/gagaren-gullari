# Sopol Masters Boutique

# Lovable.dev uchun to'liq prompt — "Sopol Ustalari" milliy suvenir do'koni




Quyidagi promptni to'liq nusxalab, lovable.dev'dagi yangi loyiha chatiga joylashtiring.




---




## PROMPT (nusxalash uchun)




```

Men O'zbekistonning milliy sopol (keramika) idishlari — tovoqlar, likopchalar, kosalar,

suvenirlar — savdosi uchun premium darajadagi online do'kon (e-commerce) yaratmoqchiman.

Loyihaning nomi: "Sopol Ustalari" (Sopol Masters).




## UMUMIY KONSEPSIYA




Bu — Rishton va Xiva sopolchilik maktablari uslubidagi qo'lda ishlangan, ikat/gulli

naqshli (qizil, ko'k, sariq, yashil, oq, qora ranglar) keramika mahsulotlarini

sotadigan butik do'kon. Sayt milliy ruh bilan zamonaviy, minimal, premium dizaynni

uyg'unlashtirishi kerak — xuddi Applening mahsulot sahifalari kabi toza, lekin

o'zbek naqshlari va rang palitrasi bilan boyitilgan.




## DIZAYN YO'NALISHI (UI/UX)




- Umumiy stil: Apple.com/iPhone mahsulot sahifalariga o'xshash — katta hero

  rasmlar, ko'p bo'sh joy (whitespace), silliq scroll-animatsiyalar, mahsulotni

  markazga qo'yuvchi minimalizm.

- Milliy elementlar: sahifa fonida yoki bo'limlar orasida nozik ikat naqshli

  bezaklar (SVG chiziqlar), lekin ular kontentga xalaqit bermasligi kerak.

- Rang palitrasi: fon — issiq oq/krem (#FAF7F2 kabi), aksent ranglar — terrakota

  qizil, ko'k, sariq (mahsulot ranglaridan olingan), matn — to'q kulrang/qora.

  Neon yoki sovuq ranglardan qoching.

- Tipografika: zamonaviy, oqilona serif yoki geometrik sans-serif sarlavhalar

  uchun (masalan Playfair Display + Inter kombinatsiyasi), o'qish qulay bo'lishi

  kerak.

- Mobil versiya (telefon): iPhone ilovasi kabi his qilinishi kerak — pastda

  tab-bar navigatsiya (Bosh sahifa, Katalog, Savat, Profil), yumshoq

  animatsiyali o'tishlar, katta tap-target tugmalar, safe-area padding'lar,

  swipe-friendly mahsulot kartochkalari, pull-to-refresh hissi.

- Har bir interaktiv element (tugma, kartochka, filtr) hover/tap holatida

  mikroanimatsiyaga ega bo'lishi kerak (scale, shadow, fade).




## SAHIFALAR VA FUNKSIONAL TALABLAR




1. **Bosh sahifa (Landing)**

   - To'liq ekranli hero: aylanayotgan/parallax mahsulot rasmi, qisqa milliy

     hikoya matni, "Katalogni ko'rish" CTA tugmasi.

   - "Bizning hunar" bo'limi — sopolchilik ustaxonasi haqida qisqa hikoya.

   - Mashhur mahsulotlar karuseli.

   - Kategoriyalar bo'yicha vitrina (Tovoqlar, Kosachalar, Likopchalar, Sovg'a

     to'plamlari).

   - Mijozlar fikri (testimonials) bo'limi.




2. **Katalog sahifasi**

   - Grid ko'rinishida mahsulotlar, filtr (rang, o'lcham, narx, kategoriya,

     usta/ustaxona bo'yicha), saralash (narx, mashhurlik, yangilik).

   - Har bir kartochkada: rasm, nomi, narxi, qisqa naqsh nomi, "savatga qo'shish"

     tez tugmasi.




3. **Mahsulot sahifasi (Product Detail)**

   - Katta galereya: bir nechta rakurs rasmlari + agar mumkin bo'lsa 360°

     aylantirish effekti yoki 3D interaktiv ko'rinish (Three.js/model-viewer

     yordamida — mahsulotni sichqoncha/barmoq bilan aylantirib ko'rish).

   - Mahsulot tavsifi: naqsh nomi, tarixi, o'lchamlari, og'irligi, ustaxona,

     tayyorlanish vaqti (qo'lda ishlanganligi haqida eslatma).

   - Rang/o'lcham variantlarini tanlash.

   - "Savatga qo'shish" va "Hoziroq sotib olish" tugmalari.

   - O'xshash mahsulotlar bo'limi.




4. **Savat va checkout**

   - Savat sahifasi — miqdorni o'zgartirish, o'chirish, umumiy summa.

   - Checkout: yetkazib berish manzili (O'zbekiston viloyatlari ro'yxati),

     to'lov usuli (naqd, Payme/Click integratsiyasi uchun joy qoldiring),

     buyurtma xulosasi.




5. **Profil / Kabinet**

   - Buyurtmalar tarixi, saqlangan (sevimli) mahsulotlar, manzillar.




6. **Usta/Ustaxona sahifasi**

   - Har bir sopolchi ustaxonasi haqida alohida "brend sahifasi" — ularning

     hikoyasi, mahsulotlari, joylashuvi (Rishton, Xiva va h.k.).




7. **Qo'shimcha sahifalar**

   - Biz haqimizda, Yetkazib berish shartlari, Aloqa (Telegram/WhatsApp tugmasi

     bilan), SSS.




## 3D VA VIZUAL BOYITISH




- Mumkin bo'lsa, mahsulot sahifasida `<model-viewer>` yoki Three.js komponenti

  orqali soddalashtirilgan 3D aylanuvchi tovoq/idish modeli namoyish eting

  (agar haqiqiy 3D fayl bo'lmasa — rasmlar asosida pseudo-3D aylanish effektini

  simulyatsiya qiling: bir nechta burchakdan olingan rasmlarni drag orqali

  almashtirish).

- Bosh sahifada scroll bilan bog'liq parallax va fade-in animatsiyalar

  qo'shing.




## TEXNIK TALABLAR




- Responsive: mobil-first yondashuv, lekin desktopda ham chiroyli ko'rinishi

  kerak.

- Tez yuklanadigan, optimallashtirilgan rasm placeholder'lari bilan boshlang

  (keyinchalik men haqiqiy mahsulot rasmlarini yuklab qo'yaman).

- Til: interfeys o'zbek tilida (lotin yozuvida) bo'lsin, lekin kelajakda

  rus/ingliz tiliga almashtirish uchun tuzilma tayyor bo'lsin (i18n-friendly

  matn tuzilishi).

- Barcha matn va narxlar demo/placeholder ma'lumot sifatida kiritilsin

  (masalan 5 ta namunaviy mahsulot — tovoq, kosa, likopcha, suvenir to'plami,

  choynak to'plami — o'zbek ikat naqshlari tavsifi bilan).




Iltimos, avval bosh sahifa va katalog + mahsulot sahifasining to'liq,

chiroyli, milliy ruhli va Apple-darajasidagi dizaynini yarating, keyin men

qolgan sahifalar bo'yicha qo'shimcha ko'rsatmalar beraman.

```




---




## Qo'shimcha maslahatlar




- **Bosqichma-bosqich boring**: Lovable'da bitta promptga hammasini tiqishtirish o'rniga, avval yuqoridagi promptni yuboring, natijani ko'ring, so'ng "endi katalog sahifasini kengaytir", "endi checkout qo'sh" kabi keyingi promptlar bilan davom eting — natija sifatliroq chiqadi.

- **Rasmlar**: sizdagi sopol idish rasmlarini (xuddi yuklagan rasmingizdek) Lovable loyihasiga asset sifatida yuklab, "shu rasmlardagi mahsulotlarni katalogga joylashtir" deb alohida so'rov yuboring.

- **To'lov tizimi**: O'zbekistonda Payme/Click integratsiyasini keyingi bosqichda, backend (Supabase orqali Lovable'da mavjud) ulanganidan so'ng so'rang.

- **3D bo'yicha real kutish**: to'liq real-time 3D skanerlash qimmat va murakkab; boshlang'ich bosqichda "bir nechta burchakli rasm + drag-to-rotate" psevdo-3D yechim tezroq va arzonroq natija beradi — yuqoridagi promptda shu variant ko'rsatilgan.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://mirzacholustalari.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e946a33e-0ffc-4c00-b044-c154d5d9651d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
