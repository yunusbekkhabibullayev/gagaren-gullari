import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MobileTabBar, SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatSom, productImage, useProducts, type Product } from "@/lib/products";
import { useCategories } from "@/lib/categories";
import logoImg from "@/assets/logo.png";
import flowerAtirgul from "@/assets/flower-atirgul.jpg";
import flowerBuket from "@/assets/flower-buket.jpg";
import flowerLola from "@/assets/flower-lola.jpg";
import flowerSovga from "@/assets/flower-sovga.jpg";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title: "NASTARIN GULLARI - Gagarin shaharida gul yetkazib berish" },
      {
        name: "description",
        content:
          "Premium guldastalar, atirgullar, tuvakdagi o'simliklar va sovg'a to'plamlari. Gagarin bo'ylab 24/7 bepul yetkazib berish.",
      },
      { property: "og:title", content: "NASTARIN GULLARI - Gagarin shaharida gul yetkazib berish" },
      {
        property: "og:description",
        content:
          "Premium yig'ilgan guldastalar. 24/7 bepul yetkazib berish xizmati mavjud.",
      },
    ],
  }),
  component: Home,
} as Parameters<typeof createFileRoute<"/">>[0]));

/* ─── Default Hero Presets (Matching Image 3 Typography) ────── */
const DEFAULT_HERO_SLIDES = [
  {
    id: "hero-1",
    name: "21 Qizil Atirgul El Toro",
    price: 350000,
    image: flowerAtirgul,
    slug: "21-qizil-atirgul-el-toro",
  },
  {
    id: "hero-2",
    name: "Bahoriy Mix Buket",
    price: 280000,
    image: flowerBuket,
    slug: "bahoriy-mix-buket",
  },
  {
    id: "hero-3",
    name: "Premium Lolalar To'plami",
    price: 220000,
    image: flowerLola,
    slug: "premium-lolalar",
  },
  {
    id: "hero-4",
    name: "Roza va Sovg'alar To'plami",
    price: 450000,
    image: flowerSovga,
    slug: "roza-va-sovgalar",
  },
];

/* ─── Hero Section Component (Image 3 Style Format) ────────── */
function HeroSection({ products }: { products: Product[] }) {
  const slides = useMemo(() => {
    if (products && products.length > 0) {
      const valid = products.filter((p) => p.image_url || p.image_url_2 || productImage(p));
      if (valid.length > 0) {
        return valid.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: productImage(p) || p.image_url || p.image_url_2 || "",
          slug: p.slug || p.id,
        }));
      }
    }
    return DEFAULT_HERO_SLIDES;
  }, [products]);

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeSlide = slides[current] || slides[0];

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrent((c) => (c + 1) % slides.length);
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden bg-[#FFFFFF] border-b border-pink-100/60 py-8 sm:py-14 lg:py-20 transition-colors"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 lg:gap-12">

          {/* Left Column: Title, Sub-link, Controls — order-2 on mobile, order-1 on md+ */}
          <div className="order-2 md:order-1 md:col-span-4 flex flex-col gap-4 text-center md:text-left items-center md:items-start">
            <div className="flex flex-col gap-3">
              {/* Eyebrow Label */}
              <div className="text-xs uppercase tracking-widest text-[#6B7280] font-medium">
                Aksiya / Tavsiya
              </div>

              {/* Title */}
              <h1
                key={activeSlide.id}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-medium text-[#1F2937] leading-[1.2] animate-fade-in line-clamp-3"
                style={{ fontFamily: "'Poppins','Inter',sans-serif", fontWeight: 500 }}
              >
                {activeSlide.name}
              </h1>

              <Link
                to="/catalog"
                className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider text-[#D84C73] uppercase transition-colors hover:text-[#B8365B]"
              >
                <span>Kataloga o'tish</span>
                <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 text-[#D84C73]" />
              </Link>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center justify-center md:justify-start gap-3">
              <button
                onClick={handlePrev}
                aria-label="Oldingi buket"
                className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-pink-200 bg-white text-[#D84C73] shadow-sm transition-all hover:bg-[#D84C73] hover:text-white hover:border-[#D84C73] active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Keyingi buket"
                className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-pink-200 bg-white text-[#D84C73] shadow-sm transition-all hover:bg-[#D84C73] hover:text-white hover:border-[#D84C73] active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Column: Pink Backdrop + Bouquet + Price — order-1 on mobile (shows first!) */}
          <div className="order-1 md:order-2 md:col-span-5 relative flex items-center justify-center py-2 sm:py-8 min-h-[260px] sm:min-h-[420px] lg:min-h-[480px]">
            {/* Soft pink halo circle */}
            <div className="absolute h-[220px] w-[220px] sm:h-[360px] sm:w-[360px] lg:h-[440px] lg:w-[440px] rounded-full bg-[#FCE8F0] shadow-inner transition-transform duration-700 ease-out" />

            {/* Bouquet image */}
            <Link
              to="/catalog"
              className="relative z-10 flex items-center justify-center group transition-transform duration-500 hover:scale-105 overflow-hidden rounded-3xl"
            >
              <img
                key={activeSlide.id}
                src={activeSlide.image}
                alt={activeSlide.name}
                className="h-[240px] w-[240px] sm:h-[360px] sm:w-[360px] lg:h-[420px] lg:w-[420px] aspect-square object-cover rounded-3xl shadow-2xl border-4 border-white animate-fade-in"
                onError={(e) => {
                  e.currentTarget.src = "/flowers/flower-atirgul.jpg";
                }}
              />
            </Link>
          </div>

          {/* Right Column: Thumbnails — horizontal on mobile (below image), vertical on md+ */}
          <div className="order-2 md:order-3 md:col-span-3 flex flex-row md:flex-col items-center justify-center gap-3 sm:gap-6 z-10">
            {slides.map((slide, idx) => {
              const isActive = idx === current;
              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrent(idx)}
                  className={`group relative flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 shrink-0 items-center justify-center rounded-full border-2 p-1 transition-all duration-300 bg-white cursor-pointer ${isActive
                      ? "border-[#D84C73] ring-4 ring-[#D84C73]/20 scale-105 shadow-lg"
                      : "border-pink-100 opacity-75 hover:opacity-100 hover:border-pink-300 hover:scale-105"
                    }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.name}
                    className="h-full w-full rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials Slider ─────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: "Malika",
    city: "Mirzacho'l",
    quote: "Buket aynan so'ragan vaqtimda yetib keldi, gullar juda yangi edi. Opamga sovg'a qildim — xursand bo'ldi.",
  },
  {
    name: "Jasur",
    city: "Mirzacho'l",
    quote: "25 ta qizil atirgul buyurtma qildim, rasmdagidan ham chiroyli chiqdi. Kuryer aniq soatda keldi.",
  },
  {
    name: "Nodira",
    city: "Mirzacho'l",
    quote: "Tuvakdagi o'simlikni ofisga oldim. O'ramigacha ozoda va chiroyli qilib berishdi.",
  },
  {
    name: "Sherzod",
    city: "Gagarin",
    quote: "Xotinimga tug'ilgan kun uchun buyurtma berdim. Gullar yangi, hid ajoyib. Albatta yana buyurtma beraman!",
  },
  {
    name: "Dildora",
    city: "Mirzacho'l",
    quote: "Onaginamga sovg'a bo'ldiki, u judayam xursand bo'ldi. Xizmat darajasi a'lo, tavsiya qilaman.",
  },
  {
    name: "Behruz",
    city: "Gagarin",
    quote: "Sovg'a to'plami juda chiroyli yig'ilgan edi. Kuryer vaqtida va madaniyatli keldi.",
  },
];

function TestimonialsSlider() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(3);
  const count = TESTIMONIALS.length;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const startTimer = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setCurrent((c) => (c + 1) % count);
    }, 4000);
  };

  useEffect(() => {
    const updateVisible = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      if (w >= 1024) setVisible(3);
      else if (w >= 768) setVisible(2);
      else setVisible(1);
    };

    updateVisible();
    window.addEventListener("resize", updateVisible);
    startTimer();

    return () => {
      window.removeEventListener("resize", updateVisible);
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const handlePrev = () => {
    setCurrent((c) => (c - 1 + count) % count);
    startTimer();
  };

  const handleNext = () => {
    setCurrent((c) => (c + 1) % count);
    startTimer();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 35;
    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const indices = Array.from({ length: visible }, (_, i) => (current + i) % count);

  return (
    <div className="mt-8 relative">
      {/* Outer row with prev button, viewport track, and next button */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6">
        {/* Prev Button (hidden on mobile, visible on sm+) */}
        <button
          onClick={handlePrev}
          className="hidden sm:flex shrink-0 h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-[#E5DFC9] bg-white shadow-md items-center justify-center text-[#D84C73] hover:bg-[#D84C73] hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 z-10"
          aria-label="Oldingi"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Viewport & Cards Track */}
        <div
          className="flex-1 overflow-hidden py-3 px-1"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="grid gap-4 sm:gap-6 transition-all duration-500 ease-out"
            style={{ gridTemplateColumns: `repeat(${visible}, minmax(0, 1fr))` }}
          >
            {indices.map((idx, pos) => {
              const t = TESTIMONIALS[idx];
              const isHighlight = pos === 0;
              return (
                <figure
                  key={`${t.name}-${idx}`}
                  className="rounded-2xl border p-5 sm:p-6 transition-all duration-500 flex flex-col justify-between min-h-[160px] sm:min-h-[180px]"
                  style={{
                    background: isHighlight ? "#D84C73" : "#FFFFFF",
                    borderColor: isHighlight ? "#D84C73" : "#E5DFC9",
                    transform: visible > 1 && isHighlight ? "scale(1.02)" : "scale(1)",
                    opacity: isHighlight ? 1 : 0.85,
                    boxShadow: isHighlight ? "0 8px 32px rgba(216,76,115,0.18)" : "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <blockquote
                    className="text-sm sm:text-[15px] leading-relaxed"
                    style={{ color: isHighlight ? "#F5F1E8" : "#1F2937" }}
                  >
                    "{t.quote}"
                  </blockquote>
                  <figcaption
                    className="mt-5 text-xs sm:text-sm font-medium"
                    style={{ color: isHighlight ? "rgba(245,241,232,0.85)" : "#6B7280" }}
                  >
                    — {t.name}, {t.city}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>

        {/* Next Button (hidden on mobile, visible on sm+) */}
        <button
          onClick={handleNext}
          className="hidden sm:flex shrink-0 h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-[#E5DFC9] bg-white shadow-md items-center justify-center text-[#D84C73] hover:bg-[#D84C73] hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 z-10"
          aria-label="Keyingi"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Navigation dots */}
      <div className="mt-6 flex justify-center gap-2">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); startTimer(); }}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === current ? "1.5rem" : "0.5rem",
              background: i === current ? "#D84C73" : "#6B7280",
              opacity: i === current ? 1 : 0.35,
            }}
            aria-label={`Fikr ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Category Skeleton ───────────────────────────────────── */
function CategorySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="aspect-[4/5] rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(90deg, #E5DFC9 25%, #F5F1E8 50%, #E5DFC9 75%)", backgroundSize: "200% 100%", animation: `shimmer 1.5s infinite ${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
function Home() {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const featured = products.slice(0, 4);

  const categoryImages: Record<string, string> = {};
  for (const c of categories) {
    const p = products.find((x: Product) => x.category === c.name);
    if (p) categoryImages[c.name] = productImage(p);
  }

  const categoriesReady = !categoriesLoading && !productsLoading;

  return (
    <div className="min-h-screen pb-20 sm:pb-0" style={{ background: "#FFFFFF" }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeInUp 0.7s ease both; }
      `}</style>
      <SiteHeader />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <HeroSection products={products} />

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest" style={{ color: "#6B7280" }}>Kolleksiya</div>
            <h2 className="mt-2 text-3xl sm:text-4xl" style={{ fontFamily: "'Poppins','Inter',sans-serif", fontWeight: 500, color: "#1F2937" }}>Kategoriyalar</h2>
          </div>
          <Link to="/catalog" className="text-sm underline-offset-4 hover:underline" style={{ color: "#6B7280" }}>
            Barchasi →
          </Link>
        </div>

        {!categoriesReady ? (
          <CategorySkeleton />
        ) : categories.length === 0 ? null : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => {
              const imgUrl = categoryImages[c.name];
              if (!imgUrl) return null; // faqat real rasim bo'lsa ko'rsatamiz
              return (
                <Link
                  key={c.id}
                  to="/catalog"
                  search={{ cat: c.name } as never}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-sm transition duration-300 hover:shadow-xl hover:-translate-y-1"
                  style={{ background: "#FFFFFF", border: "1px solid #E5DFC9" }}
                >
                  <img
                    src={imgUrl}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(31,41,55,0.80) 0%, rgba(31,41,55,0.15) 50%, transparent 100%)" }} />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="text-lg font-medium" style={{ color: "#FFFFFF", fontFamily: "'Poppins','Inter',sans-serif" }}>{c.name}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest" style={{ color: "#6B7280" }}>Mashhur</div>
            <h2 className="mt-2 text-3xl sm:text-4xl" style={{ fontFamily: "'Poppins','Inter',sans-serif", fontWeight: 500, color: "#1F2937" }}>Floristlar tanlagan</h2>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p: Product) => (
            <Link key={p.id} to="/product/$id" params={{ id: p.slug }} className="group block">
              <div className="aspect-square overflow-hidden rounded-2xl" style={{ background: "#FFFFFF" }}>
                <img
                  src={productImage(p)}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium" style={{ color: "#1F2937" }}>{p.name}</div>
                  <div className="truncate text-sm" style={{ color: "#6B7280" }}>{p.pattern}</div>
                </div>
                <div className="shrink-0 text-sm font-semibold" style={{ color: "#D84C73" }}>{formatSom(p.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="hunar" className="mx-auto mt-10 max-w-7xl px-5">
        <div className="grid overflow-hidden rounded-[2rem]" style={{ background: "#FFFFFF" }}>
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto flex items-center justify-center p-8">
              <img src={logoImg} alt="NASTARIN GULLARI logo" className="h-56 w-56 object-contain" />
            </div>
            <div className="p-8 sm:p-14">
              <div className="text-xs uppercase tracking-widest" style={{ color: "#6B7280" }}>Qanday ishlaymiz</div>
              <h2 className="mt-3 text-3xl sm:text-4xl" style={{ fontFamily: "'Poppins','Inter',sans-serif", fontWeight: 500, color: "#1F2937" }}>
                Ertalab kesilgan gul — kechqurun sizda
              </h2>
              <p className="mt-5" style={{ color: "#6B7280" }}>
                Gullar har kuni ertalab yangi partiyada keladi. Florist buketni buyurtmangizdan keyin
                yig'adi, suv va o'ram bilan salqin holatda yetkazamiz. Yetkazish kuni va vaqt
                oralig'ini buyurtma berayotganda o'zingiz belgilaysiz.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-6 text-sm">
                <Step n="01" t="Tanlang" d="Katalogdan buket" />
                <Step n="02" t="Vaqt" d="Kun va soat oralig'i" />
                <Step n="03" t="Yetkazish" d="Kuryer qo'lma-qo'l" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "'Poppins','Inter',sans-serif", fontWeight: 500, color: "#1F2937" }}>Mijozlar fikri</h2>
        <TestimonialsSlider />
      </section>

      <SiteFooter />
      <MobileTabBar />
    </div>
  );
}

function Step({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <div>
      <div className="text-xl" style={{ fontFamily: "'pins','Inter',sans-serif", fontWeight: 600, color: "#D84C73" }}>{n}</div>
      <div className="mt-2 font-medium" style={{ color: "#1F2937" }}>{t}</div>
      <div style={{ color: "#6B7280" }}>{d}</div>
    </div>
  );
}

