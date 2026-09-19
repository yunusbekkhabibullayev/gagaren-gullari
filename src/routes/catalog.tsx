import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MobileTabBar, SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { formatSom, productImage, useProducts, workshops } from "@/lib/products";
import { useCategories } from "@/lib/categories";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Katalog - NASTARIN GULLARI" },
      {
        name: "description",
        content:
          "Premium guldastalar, atirgullar, tuvakdagi o'simliklar va sovg'a to'plamlari katalogi. Gagarin bo'ylab bepul yetkazib berish.",
      },
      { property: "og:title", content: "Katalog - NASTARIN GULLARI" },
      {
        property: "og:description",
        content: "Yangi gullar katalogini ko'ring va bugunoq yetkazib oling.",
      },
    ],
  }),
  component: Catalog,
});

type Sort = "popular" | "priceAsc" | "priceDesc" | "new";

function Catalog() {
  const { data: products = [], isLoading } = useProducts();
  const { data: dbCategories = [] } = useCategories();
  const activeCategoryNames = useMemo(() => dbCategories.map((c) => c.name), [dbCategories]);

  const [cat, setCat] = useState<string | null>(null);
  const [shop, setShop] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("popular");

  const list = useMemo(() => {
    let l = [...products];
    if (cat) l = l.filter((p) => p.category === cat);
    if (shop) l = l.filter((p) => p.workshop === shop);
    if (sort === "priceAsc") l.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") l.sort((a, b) => b.price - a.price);
    if (sort === "new") l.reverse();
    return l;
  }, [cat, shop, sort, products]);

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-0">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-5 pt-8 pb-4 sm:pt-12 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-[#e0526c] dark:bg-rose-950/40 dark:text-rose-400">
              🌸 Kolleksiya
            </span>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Yangi gullar katalogi
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Har kuni yangi uzilgan gullar va ajoyib buketlar
            </p>
          </div>
          <div className="shrink-0 text-sm font-medium text-muted-foreground">
            Jami: <span className="font-semibold text-foreground">{list.length} ta</span> gul
          </div>
        </div>
      </section>

      {/* FILTERS & CATEGORIES TOOLBAR */}
      <section className="sticky top-[65px] z-30 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-5 py-3 space-y-2.5">
          {/* Main Category Tabs - Wrap on mobile, scrollable on desktop */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:overflow-x-auto sm:no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
            <button
              onClick={() => setCat(null)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                cat === null
                  ? "bg-rose-500 text-white shadow-sm"
                  : "bg-slate-100 text-muted-foreground hover:bg-slate-200 hover:text-foreground"
              }`}
            >
              🌸 Barcha
            </button>
            {activeCategoryNames.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                  cat === c
                    ? "bg-rose-500 text-white shadow-sm"
                    : "bg-slate-100 text-muted-foreground hover:bg-slate-200 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Secondary Controls: Origin Filter + Sort Dropdown + Reset */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 text-xs sm:text-sm">
            {/* Origin pills - Wrap on mobile */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-muted-foreground font-medium shrink-0">📍 Manba:</span>
              <button
                onClick={() => setShop(null)}
                className={`shrink-0 rounded-full px-2.5 py-1 font-medium transition-all text-xs ${
                  shop === null
                    ? "bg-blue-500 text-white shadow-sm"
                    : "bg-slate-100 text-muted-foreground hover:bg-slate-200"
                }`}
              >
                Barchasi
              </button>
              {workshops.map((w) => (
                <button
                  key={w}
                  onClick={() => setShop(w)}
                  className={`shrink-0 rounded-full px-2.5 py-1 font-medium transition-all text-xs ${
                    shop === w
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-slate-100 text-muted-foreground hover:bg-slate-200"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>

            {/* Right side controls: Sorting + Clear filters */}
            <div className="flex items-center gap-2 ml-auto">
              {(cat !== null || shop !== null) && (
                <button
                  onClick={() => {
                    setCat(null);
                    setShop(null);
                  }}
                  className="text-xs font-medium text-rose-500 hover:text-rose-700 px-2 py-1 rounded-full hover:bg-rose-50 transition-all"
                >
                  ✕ Tozalash
                </button>
              )}

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-full border border-border/60 bg-white px-2.5 py-1 text-xs font-medium outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-200 transition-all"
              >
                <option value="popular">🔥 Mashhur</option>
                <option value="new">✨ Yangi</option>
                <option value="priceAsc">💰 Arzon</option>
                <option value="priceDesc">💎 Qimmat</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <Link
              key={p.id}
              to="/product/$id"
              params={{ id: p.slug }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card p-3 transition duration-300 hover:border-border hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-secondary/50">
                <img
                  src={productImage(p)}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-2.5 top-2.5 rounded-full bg-background/80 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-foreground shadow-sm">
                  {p.workshop}
                </div>
              </div>
              <div className="mt-3 flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="line-clamp-1 font-medium text-foreground group-hover:text-[#e0526c] transition">
                    {p.name}
                  </h3>
                  <p className="line-clamp-1 text-xs text-muted-foreground mt-0.5">{p.pattern}</p>
                </div>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/30">
                  <span className="text-sm font-bold text-foreground">{formatSom(p.price)}</span>
                  <span className="rounded-full bg-rose-50 dark:bg-rose-950/50 p-1.5 text-[#e0526c] transition group-hover:bg-[#e0526c] group-hover:text-white">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {list.length === 0 && !isLoading && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground my-8">
            <div className="text-3xl mb-2">🌸</div>
            <p className="font-medium text-foreground">
              Ushbu filtr bo'yicha hech qanday gul topilmadi
            </p>
            <p className="text-sm mt-1">Boshqa kategoriyani tanlang yoki filtrlarni tozalang.</p>
            <button
              onClick={() => {
                setCat(null);
                setShop(null);
              }}
              className="mt-4 rounded-full bg-[#e0526c] px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#d0425c] transition"
            >
              Barcha gullarni ko'rish
            </button>
          </div>
        )}
      </section>

      <SiteFooter />
      <MobileTabBar />
    </div>
  );
}
