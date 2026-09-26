import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MobileTabBar, SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatSom, productImage, useProducts, type Product } from "@/lib/products";
import { useCategories } from "@/lib/categories";
import logoImg from "@/assets/logo.png";

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

/* ─── Hero Slider ─────────────────────────────────────────── */
function HeroSlider({ products }: { products: Product[] }) {
  const slides = products.filter((p) => p.image_url).slice(0, 6);
  const [current, setCurrent] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 4000);
  };

  useEffect(() => {
    if (slides.length > 1) startTimer();
    return () => { if (timer.current) clearInterval(timer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-[#F5F1E8] shadow-2xl flex items-center justify-center">
        <img src={logoImg} alt="Nastarin Gullari" className="h-40 w-40 object-contain opacity-40" />
      </div>
    );
  }

  return (
    <div className="relative aspect-square overflow-hidden rounded-[2rem] shadow-2xl">
      {slides.map((p, i) => (
        <div
          key={p.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={p.image_url!}
            alt={p.name}
            className="h-full w-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          {/* Slide info badge */}
          <div
            className="absolute bottom-5 left-5 rounded-xl px-4 py-3 shadow-lg backdrop-blur-md"
            style={{ background: "rgba(31,41,55,0.75)" }}
          >
            <div className="text-[10px] uppercase tracking-widest" style={{ color: "#F5F1E8", opacity: 0.7 }}>Bugun</div>
            <div className="mt-0.5 text-sm font-semibold" style={{ color: "#F5F1E8" }}>{p.name}</div>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-5 right-5 z-10 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); startTimer(); }}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === current ? "1.5rem" : "0.375rem",
              background: i === current ? "#8B3A5C" : "rgba(245,241,232,0.6)",
            }}
          />
        ))}
      </div>
    </div>
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
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          className="shrink-0 h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-[#E5DFC9] bg-white shadow-md flex items-center justify-center text-[#8B3A5C] hover:bg-[#8B3A5C] hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 z-10"
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
                    background: isHighlight ? "#8B3A5C" : "#FFFFFF",
                    borderColor: isHighlight ? "#8B3A5C" : "#E5DFC9",
                    transform: visible > 1 && isHighlight ? "scale(1.02)" : "scale(1)",
                    opacity: isHighlight ? 1 : 0.85,
                    boxShadow: isHighlight ? "0 8px 32px rgba(139,58,92,0.18)" : "0 2px 8px rgba(0,0,0,0.06)",
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

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="shrink-0 h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-[#E5DFC9] bg-white shadow-md flex items-center justify-center text-[#8B3A5C] hover:bg-[#8B3A5C] hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 z-10"
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
              background: i === current ? "#8B3A5C" : "#6B7280",
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
    <div className="min-h-screen pb-20 sm:pb-0" style={{ background: "#F5F1E8" }}>
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
      <section className="relative overflow-hidden">
        <div
          className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-10 pb-16 sm:pt-20 sm:pb-28 md:grid-cols-2"
        >
          {/* Left text */}
          <div className="relative z-10 animate-fade-in">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-widest"
              style={{ background: "rgba(139,58,92,0.10)", color: "#8B3A5C", border: "1px solid rgba(139,58,92,0.20)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#8B3A5C" }} />
              Mirzacho'l tumani
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl" style={{ color: "#1F2937", fontFamily: "'Poppins','Inter',sans-serif", fontWeight: 600 }}>
              Gullar bilan
              <br />
              <span style={{ color: "#8B3A5C", fontStyle: "italic" }}>aytilgan so'z</span>
            </h1>
            <p className="mt-6 max-w-md text-lg" style={{ color: "#6B7280", fontFamily: "'Segoe UI','Helvetica Neue',sans-serif" }}>
              Har kuni ertalab yangi kelgan gullardan yig'ilgan buketlar. Yetkazish kunini va
              vaqtini o'zingiz tanlaysiz.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 hover:opacity-90 hover:scale-105"
                style={{ background: "#8B3A5C", color: "#F5F1E8", fontFamily: "'Poppins',sans-serif", fontWeight: 500 }}
              >
                Buketlarni ko'rish →
              </Link>
              <a
                href="#hunar"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{ background: "#FFFFFF", color: "#1F2937", border: "1px solid #E5DFC9" }}
              >
                Yetkazib berish
              </a>
            </div>

            <div className="mt-12 grid max-w-md grid-cols-3 gap-6 text-sm">
              <Stat label="Yetkazish" value="15 daqiqa" />
              <Stat label="Florist" value="8" />
              <Stat label="Buket" value={products.length > 0 ? `${products.length}+` : "..."} />
            </div>
          </div>

          {/* Right: Hero Slider */}
          <div className="relative">
            <div
              className="absolute -inset-6 -z-10 rounded-full blur-3xl"
              style={{ background: "rgba(168,80,140,0.15)" }}
            />
            <HeroSlider products={products} />
          </div>
        </div>
        <div className="petal-divider" aria-hidden />
      </section>

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
                <div className="shrink-0 text-sm font-semibold" style={{ color: "#8B3A5C" }}>{formatSom(p.price)}</div>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-3xl" style={{ fontFamily: "'Poppins','Inter',sans-serif", fontWeight: 600, color: "#1F2937" }}>{value}</div>
      <div className="mt-1 text-xs uppercase tracking-widest" style={{ color: "#6B7280" }}>{label}</div>
    </div>
  );
}

function Step({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <div>
      <div className="text-xl" style={{ fontFamily: "'Poppins','Inter',sans-serif", fontWeight: 600, color: "#8B3A5C" }}>{n}</div>
      <div className="mt-2 font-medium" style={{ color: "#1F2937" }}>{t}</div>
      <div style={{ color: "#6B7280" }}>{d}</div>
    </div>
  );
}
