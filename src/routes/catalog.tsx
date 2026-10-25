import React, { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { formatSom, productImage, useProducts, Product } from "@/lib/products";
import { useCategories } from "@/lib/categories";
import { useCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favorites";
import { toast } from "sonner";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Katalog — NASTARIN GULLARI" },
      {
        name: "description",
        content:
          "Mualliflik guldastalari, atirgullar, tuvakdagi o'simliklar va sovg'a to'plamlari katalogi. Do'stlik bo'ylab bepul yetkazib berish.",
      },
      { property: "og:title", content: "Katalog — NASTARIN GULLARI" },
      {
        property: "og:description",
        content: "Yangi gullar katalogini ko'ring va bugunoq yetkazib oling.",
      },
    ],
  }),
  component: CatalogPage,
});

type SortOption = "popular" | "priceAsc" | "priceDesc" | "new";

function CatalogPage() {
  const navigate = useNavigate();
  const { count: cartCount, add: addToCart } = useCart();
  const { isFavorite, toggleFavorite, count: favCount } = useFavorites();

  const [page, setPage] = useState(1);
  const { data: dbProducts = [], isLoading, isFetching } = useProducts(page, 40);
  const { data: dbCategories = [] } = useCategories();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);

  // Category Tabs list
  const categoryTabs = useMemo(() => {
    const list = [
      { id: "all", label: "Barchasi" },
      { id: "Buketlar", label: "Buketlar" },
      { id: "Atirgullar", label: "Atirgullar" },
      { id: "Tuvakdagi o'simliklar", label: "O'simliklar" },
      { id: "Sovg'a to'plamlari", label: "Sovg'alar" },
    ];
    // Add additional unique categories from DB
    dbCategories.forEach((c) => {
      if (!list.some((item) => item.label.toLowerCase() === c.name.toLowerCase())) {
        list.push({ id: c.name, label: c.name });
      }
    });
    return list;
  }, [dbCategories]);

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    let result = [...dbProducts];

    // 1. Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) =>
          p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          p.workshop?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    if (sortBy === "priceAsc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "new") {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [dbProducts, selectedCategory, searchQuery, sortBy]);

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(p, "Standart", 1);
    toast.success(`${p.name} savatga qo'shildi! 🌸`);
  };

  const handleModalAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, "Standart", modalQuantity);
    toast.success(`${selectedProduct.name} (${modalQuantity} dona) savatga qo'shildi! 🌸`);
    setSelectedProduct(null);
  };

  return (
    <div
      className="min-h-screen min-h-[100dvh] w-full flex flex-col items-center select-none overflow-x-hidden pb-[115px]"
      style={{
        background:
          "linear-gradient(180deg, rgb(254,238,243) 0%, rgb(254,235,241) 15%, rgb(253,230,238) 35%, rgb(252,244,247) 65%, rgb(250,250,250) 100%)",
        color: "#17171c",
        fontFamily: "-apple-system, 'SF Pro Text', Inter, system-ui, sans-serif",
      }}
    >
      <div className="w-full max-w-[414px] mx-auto px-4 pt-4 sm:pt-6 space-y-3.5">
        {/* ── TOP HEADER (iPhone Style Navigation) ───────────────────────── */}
        <div className="flex items-center justify-between w-full h-[52px]">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="w-[42px] h-[42px] rounded-full bg-white flex items-center justify-center text-[#17171c] shadow-[0_2px_8px_rgba(0,0,0,0.04)] cursor-pointer active:scale-95 transition-transform border border-gray-100"
            aria-label="Orqaga"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Title */}
          <div className="text-center">
            <h1
              className="font-semibold text-[19px] leading-[24px] text-[#17171c] tracking-[-0.3px]"
              style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
            >
              Katalog
            </h1>
            <p className="text-[11.5px] text-[#8e8e93] font-normal">
              {filteredProducts.length} ta guldasta va o'simlik
            </p>
          </div>

          {/* Right empty spacer to balance header */}
          <div className="w-[42px]" />
        </div>

        {/* ── SEARCH BAR ─────────────────────────────────────────────────── */}
        <div className="relative w-full h-[44px] rounded-[22px] bg-white border border-pink-100/70 shadow-[0_2px_10px_rgba(0,0,0,0.03)] px-3.5 flex items-center gap-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Guldastalar yoki gullarni qidiring..."
            className="flex-1 bg-transparent text-[13px] text-[#17171c] placeholder:text-gray-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* ── CATEGORY PILLS (Horizontal Scroll without scrollbar) ─────── */}
        <div
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categoryTabs.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-[12.5px] font-semibold transition-all cursor-pointer active:scale-95 ${
                  active
                    ? "bg-[#ee4b6a] text-white shadow-[0_4px_14px_rgba(238,75,106,0.32)]"
                    : "bg-white text-gray-700 border border-pink-100/70 shadow-[0_2px_6px_rgba(0,0,0,0.02)]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── SORT & RESULTS BAR ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-1 pt-1">
          <span className="text-[12px] font-medium text-gray-500">
            Jami: <strong className="text-gray-900">{filteredProducts.length}</strong> ta guldasta
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-[11.5px] text-gray-400">Tartib:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-full border border-pink-200/60 bg-white px-2.5 py-1 text-[11.5px] font-semibold text-gray-800 outline-none shadow-xs"
            >
              <option value="popular">Mashhur</option>
              <option value="new">Yangi uzilgan</option>
              <option value="priceAsc">Arzonroq</option>
              <option value="priceDesc">Qimmatroq</option>
            </select>
          </div>
        </div>

        {/* ── PRODUCT GRID (iPhone 2-Column Floriva Style) ────────────────── */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 pt-1">
            {filteredProducts.map((p) => {
              const favorited = isFavorite(p.id) || isFavorite(p.slug);
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setModalQuantity(1);
                  }}
                  className="group flex flex-col justify-between rounded-[22px] bg-white p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-pink-100/70 cursor-pointer active:scale-[0.98] transition-all relative hover:shadow-md"
                >
                  {/* Image Container with Heart and Rating */}
                  <div className="relative w-full aspect-square rounded-[16px] overflow-hidden bg-pink-50/40">
                    <img
                      src={productImage(p)}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/flowers/flower-atirgul.jpg";
                      }}
                    />

                    {/* Rating Badge */}
                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded-[8px] flex items-center gap-1 shadow-xs">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="#f5a623">
                        <path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" />
                      </svg>
                      <span className="text-[10.5px] font-bold text-gray-800">4.9</span>
                    </div>

                    {/* Heart Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(p.id);
                        if (!favorited) {
                          toast.success(`${p.name} sevimlilarga saqlandi! ❤️`);
                        }
                      }}
                      className="absolute top-2 right-2 w-[32px] h-[32px] rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-xs cursor-pointer active:scale-90 transition-transform"
                      aria-label="Sevimlilar"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={favorited ? "#ee4b6a" : "none"}
                        stroke={favorited ? "#ee4b6a" : "#8e8e93"}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="mt-2.5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-[13.5px] font-bold text-[#17171c] line-clamp-1 leading-snug">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-[#8e8e93] mt-0.5 line-clamp-1">
                        {p.workshop || p.category || "Mualliflik guldastasi"}
                      </p>
                    </div>

                    {/* Price & Quick Add Button */}
                    <div className="mt-2.5 flex items-center justify-between pt-1 border-t border-pink-50">
                      <span className="text-[14px] font-extrabold text-[#ee4b6a]">
                        {formatSom(p.price)}
                      </span>

                      <button
                        onClick={(e) => handleQuickAdd(p, e)}
                        className="w-[30px] h-[30px] rounded-full bg-[#fde8ec] text-[#ee4b6a] flex items-center justify-center hover:bg-[#ee4b6a] hover:text-white transition-all active:scale-90 cursor-pointer shadow-xs"
                        aria-label="Savatga qo'shish"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search / Filter State (NO recommended flowers per user rule) */
          <div className="rounded-[24px] bg-white p-8 text-center border border-pink-100/70 shadow-sm space-y-3 my-4">
            <div className="w-14 h-14 rounded-full bg-pink-50 text-2xl flex items-center justify-center mx-auto">
              🌸
            </div>
            <h3 className="font-bold text-[#17171c] text-[16px]">
              Guldasta topilmadi
            </h3>
            <p className="text-xs text-gray-500 max-w-[220px] mx-auto leading-relaxed">
              Qidiruv so'zini o'zgartirib ko'ring yoki boshqa kategoriyani tanlang.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-2 px-5 py-2.5 rounded-full bg-[#fde8ec] text-[#ee4b6a] text-xs font-bold active:scale-95 transition"
            >
              Filtrlarni tozalash
            </button>
          </div>
        )}
      </div>

      {/* ── PRODUCT DETAIL SHEET MODAL (Screen 3) ───────────────────────── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedProduct(null)}
          />

          <div className="relative w-full max-w-[414px] max-h-[92vh] overflow-y-auto rounded-t-[32px] sm:rounded-[32px] bg-white p-5 pb-24 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200 z-10">
            {/* iOS Drag Handle */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />

            {/* Modal Image */}
            <div className="relative w-full aspect-[4/3] rounded-[22px] overflow-hidden bg-pink-50">
              <img
                src={productImage(selectedProduct)}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/flowers/flower-atirgul.jpg";
                }}
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 flex items-center justify-center shadow-md active:scale-95 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-[19px] text-[#17171c] leading-snug">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedProduct.workshop} • {selectedProduct.category || "Mualliflik guldastasi"}
                  </p>
                </div>

                <div className="bg-[#fde8ec] px-2.5 py-1 rounded-full text-[#ee4b6a] text-xs font-bold shrink-0">
                  4.9 ★
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-extrabold text-[22px] text-[#ee4b6a]">
                  {formatSom(selectedProduct.price)}
                </span>
                <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Do'stlikda bepul yetkazish
                </span>
              </div>

              {selectedProduct.description && (
                <p className="text-[13px] text-gray-600 leading-relaxed bg-[#fbf5f7] rounded-[16px] p-3 border border-pink-100/60 mt-2">
                  {selectedProduct.description}
                </p>
              )}
            </div>

            {/* Modal Sticky Bottom Action Bar */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[414px] h-[72px] bg-white border-t border-gray-100 px-4 flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-30">
              <div className="w-[106px] h-[41px] border border-gray-200 rounded-[21px] flex items-center justify-between px-2 text-sm bg-white">
                <button
                  onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                  className="w-[26px] h-[26px] rounded-full border border-gray-200 bg-white text-gray-500 flex items-center justify-center cursor-pointer active:scale-95"
                >
                  -
                </button>
                <span className="font-semibold text-gray-900">{modalQuantity}</span>
                <button
                  onClick={() => setModalQuantity(modalQuantity + 1)}
                  className="w-[26px] h-[26px] rounded-full border border-[#ee4b6a] bg-[#fde8ec] text-[#ee4b6a] flex items-center justify-center cursor-pointer active:scale-95"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleModalAddToCart}
                className="w-[230px] h-[41px] rounded-[21px] text-white text-[14px] font-semibold flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                style={{
                  background: "linear-gradient(90deg, #f04b6e, #e8466a)",
                  boxShadow: "0 6px 18px rgba(240,75,110,0.3)",
                }}
              >
                Savatga qo'shish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FLOATING BOTTOM BAR (Matching 1-rasm: Home, Saved, Center FAB, Katalog [ACTIVE], Profile) ── */}
      <FloatingTabBar activeTab="katalog" cartCount={cartCount} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// FLOATING 1-RASM BOTTOM NAVIGATION BAR COMPONENT
// ────────────────────────────────────────────────────────────────────
function FloatingTabBar({ activeTab, cartCount }: { activeTab: "home" | "saved" | "cart" | "katalog" | "aloqa"; cartCount: number }) {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-28px)] max-w-[390px] bg-white rounded-[32px] shadow-[0_12px_36px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.03)] border border-[#efeff2] z-40 pt-2 pb-1.5 px-2 select-none">
      {/* Center Elevated Floating Circle (Primary Brand Color #ee4b6a) */}
      <button
        onClick={() => navigate({ to: "/cart" })}
        className="absolute -top-[26px] left-1/2 -translate-x-1/2 w-[54px] h-[54px] rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform shadow-[0_8px_20px_rgba(238,75,106,0.38)] border-[4px] border-white z-20"
        style={{
          background: "linear-gradient(135deg, #f04b6e, #e8466a)",
        }}
        aria-label="Savat"
      >
        {/* Savat (Shopping Cart) icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
          <path
            d="M3 4h2.2l2.1 10.2a1 1 0 0 0 1 .8h8.4a1 1 0 0 0 1-.8L19.2 8H6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9.5" cy="19.5" r="1.3" fill="currentColor" />
          <circle cx="16.5" cy="19.5" r="1.3" fill="currentColor" />
        </svg>

        {/* Cart Count Badge */}
        {cartCount > 0 && (
          <div className="absolute -top-1 -right-1 w-[19px] h-[19px] rounded-full bg-white text-[#ee4b6a] text-[10.5px] font-bold flex items-center justify-center shadow-md border border-[#ee4b6a]/25 pointer-events-none">
            {cartCount}
          </div>
        )}
      </button>

      <div className="flex items-center justify-between">
        {/* Tab 1: Home */}
        <button
          onClick={() => navigate({ to: "/" })}
          className="flex-1 flex flex-col items-center justify-center p-0 m-0 border-0 bg-transparent cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-[24px] h-[22px] flex items-center justify-center">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3.2L3.5 10.5C2.8 11.1 2.5 12 2.5 12.9V19C2.5 20.1 3.4 21 4.5 21H9.5C9.8 21 10 20.8 10 20.5V15.5C10 14.7 10.7 14 11.5 14H12.5C13.3 14 14 14.7 14 15.5V20.5C14 20.8 14.2 21 14.5 21H19.5C20.6 21 21.5 20.1 21.5 19V12.9C21.5 12 21.2 11.1 20.5 10.5L12 3.2Z"
                fill="none"
                stroke={activeTab === "home" ? "#ee4b6a" : "#17171c"}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="11.2" y="14" width="1.6" height="3.2" rx="0.8" fill={activeTab === "home" ? "#ee4b6a" : "#17171c"} />
            </svg>
          </div>
          <span
            className="text-[10.5px] leading-[13px] mt-[1.5px] tracking-[-0.1px]"
            style={{
              color: activeTab === "home" ? "#ee4b6a" : "#17171c",
              fontWeight: activeTab === "home" ? 700 : 500,
            }}
          >
            Home
          </span>
        </button>

        {/* Tab 2: Saved */}
        <button
          onClick={() => navigate({ to: "/saved" })}
          className="flex-1 flex flex-col items-center justify-center p-0 m-0 border-0 bg-transparent cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-[24px] h-[22px] flex items-center justify-center">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                stroke={activeTab === "saved" ? "#ee4b6a" : "#17171c"}
                strokeWidth="1.8"
                fill={activeTab === "saved" ? "#ee4b6a" : "none"}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            className="text-[10.5px] leading-[13px] mt-[1.5px] tracking-[-0.1px]"
            style={{
              color: activeTab === "saved" ? "#ee4b6a" : "#17171c",
              fontWeight: activeTab === "saved" ? 700 : 500,
            }}
          >
            Saved
          </span>
        </button>

        {/* Center Empty Spacer to preserve slot under elevated FAB button */}
        <div className="w-[58px] shrink-0 pointer-events-none" aria-hidden="true" />

        {/* Tab 3: Katalog */}
        <button
          onClick={() => navigate({ to: "/catalog" })}
          className="flex-1 flex flex-col items-center justify-center p-0 m-0 border-0 bg-transparent cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-[24px] h-[22px] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="2"
                stroke={activeTab === "katalog" ? "#ee4b6a" : "#17171c"}
                strokeWidth="1.8"
                fill={activeTab === "katalog" ? "#ee4b6a" : "none"}
              />
              <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="2"
                stroke={activeTab === "katalog" ? "#ee4b6a" : "#17171c"}
                strokeWidth="1.8"
                fill={activeTab === "katalog" ? "#ee4b6a" : "none"}
              />
              <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="2"
                stroke={activeTab === "katalog" ? "#ee4b6a" : "#17171c"}
                strokeWidth="1.8"
                fill={activeTab === "katalog" ? "#ee4b6a" : "none"}
              />
              <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="2"
                stroke={activeTab === "katalog" ? "#ee4b6a" : "#17171c"}
                strokeWidth="1.8"
                fill={activeTab === "katalog" ? "#ee4b6a" : "none"}
              />
            </svg>
          </div>
          <span
            className="text-[10.5px] leading-[13px] mt-[1.5px] tracking-[-0.1px]"
            style={{
              color: activeTab === "katalog" ? "#ee4b6a" : "#17171c",
              fontWeight: activeTab === "katalog" ? 700 : 500,
            }}
          >
            Katalog
          </span>
        </button>

        {/* Tab 4: Aloqa (Replaced Profile) */}
        <button
          onClick={() => navigate({ to: "/contacts" })}
          className="flex-1 flex flex-col items-center justify-center p-0 m-0 border-0 bg-transparent cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-[24px] h-[22px] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                stroke={activeTab === "aloqa" ? "#ee4b6a" : "#17171c"}
                strokeWidth="1.8"
                fill={activeTab === "aloqa" ? "#ee4b6a" : "none"}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            className="text-[10.5px] leading-[13px] mt-[1.5px] tracking-[-0.1px]"
            style={{
              color: activeTab === "aloqa" ? "#ee4b6a" : "#17171c",
              fontWeight: activeTab === "aloqa" ? 700 : 500,
            }}
          >
            Aloqa
          </span>
        </button>
      </div>
    </div>
  );
}
