import React, { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useProducts, formatSom, productImage, Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favorites";
import { toast } from "sonner";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved (Sevimlilar) — NASTARIN GULLARI" },
      { name: "description", content: "Siz saqlagan va yoqtirgan mualliflik guldastalari." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const navigate = useNavigate();
  const { count: cartCount, add: addToCart } = useCart();
  const { favoriteIds, removeFavorite, clearFavorites, count: favCount } = useFavorites();
  const { data: dbProducts = [], isLoading } = useProducts(1, 40);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);

  // Filter products by favorited IDs
  const savedProducts = useMemo(() => {
    return dbProducts.filter((p) => favoriteIds.includes(p.id) || favoriteIds.includes(p.slug));
  }, [dbProducts, favoriteIds]);

  // Filter by category segment
  const displayedProducts = useMemo(() => {
    if (selectedCategory === "all") return savedProducts;
    return savedProducts.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
  }, [savedProducts, selectedCategory]);

  const categories = [
    { id: "all", label: "Barchasi" },
    { id: "Buketlar", label: "Buketlar" },
    { id: "Atirgullar", label: "Atirgullar" },
    { id: "Tuvakdagi o'simliklar", label: "O'simliklar" },
    { id: "Sovg'a to'plamlari", label: "Sovg'alar" },
  ];

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(p, "Standart", 1);
  };

  const handleModalAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, "Standart", modalQuantity);
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
      <div className="w-full max-w-[414px] mx-auto px-4 pt-4 sm:pt-6">
        {/* ── TOP HEADER (iPhone Style Navigation) ───────────────────────── */}
        <div className="flex items-center justify-between w-full h-[52px]">
          {/* Back Button */}
          <button
            onClick={() => navigate({ to: "/" })}
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
              Saved
            </h1>
            <p className="text-[11.5px] text-[#8e8e93] font-normal">
              Sevimlilar ro'yxati
            </p>
          </div>

          {/* Clear or Cart Button */}
          <div className="flex items-center gap-2">
            {savedProducts.length > 0 ? (
              <button
                onClick={clearFavorites}
                className="w-[42px] h-[42px] rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-[#ee4b6a] shadow-[0_2px_8px_rgba(0,0,0,0.04)] cursor-pointer active:scale-95 transition-transform border border-gray-100"
                title="Ro'yxatni tozalash"
                aria-label="Tozalash"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            ) : (
              <div className="w-[42px]" />
            )}
          </div>
        </div>

        {/* ── STATS HERO PILL ────────────────────────────────────────────── */}
        <div className="mt-4 w-full bg-white/80 backdrop-blur-md rounded-[18px] p-3.5 flex items-center justify-between border border-pink-100/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2.5">
            <div className="w-[36px] h-[36px] rounded-full bg-[#fde8ec] text-[#ee4b6a] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#ee4b6a" stroke="#ee4b6a" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div>
              <div className="text-[13.5px] font-semibold text-[#17171c]">
                Yoqtirgan gullaringiz
              </div>
              <div className="text-[11.5px] text-[#8e8e93]">
                {savedProducts.length} ta mahsulot saqlangan
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate({ to: "/catalog" })}
            className="text-[12.5px] font-semibold text-[#ee4b6a] bg-[#fde8ec]/60 px-3 py-1.5 rounded-full active:scale-95 transition"
          >
            + Ko'proq
          </button>
        </div>

        {/* ── CATEGORY SEGMENTED FILTER ───────────────────────────────────── */}
        {savedProducts.length > 0 && (
          <div className="mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((c) => {
              const isActive = selectedCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#ee4b6a] text-white shadow-sm font-semibold"
                      : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        )}

        {/* ── CONTENT AREA ────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="mt-4 grid grid-cols-2 gap-3.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[230px] rounded-[20px] bg-white/70 animate-pulse border border-pink-50"
              />
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          /* ── EMPTY STATE (iPhone Style) ────────────────────────────────── */
          <div className="mt-8 flex flex-col items-center justify-center text-center p-6 bg-white/85 backdrop-blur-md rounded-[28px] border border-pink-100/70 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="relative w-[76px] h-[76px] rounded-full bg-gradient-to-tr from-[#ffe4ec] to-[#fdeef3] flex items-center justify-center text-[#ee4b6a] shadow-inner mb-4">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ee4b6a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <div className="absolute top-1 right-1 w-[12px] h-[12px] rounded-full bg-[#ee4b6a] border-2 border-white" />
            </div>

            <h3
              className="text-[17px] font-semibold text-[#17171c] tracking-[-0.3px]"
              style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
            >
              Sevimlilar ro'yxati bo'sh
            </h3>
            <p className="mt-2 text-[13px] leading-[18px] text-[#8e8e93] max-w-[260px]">
              O'zingizga yoqqan guldasta yoki sovg'adagi yurakcha belgisini bosib, bu yerda saqlang.
            </p>

            <button
              onClick={() => navigate({ to: "/catalog" })}
              className="mt-6 w-[200px] h-[44px] rounded-full text-white text-[14px] font-semibold flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
              style={{
                background: "linear-gradient(90deg, #f04b6e, #e8466a)",
                boxShadow: "0 6px 18px rgba(240,75,110,0.35)",
              }}
            >
              Gullarni ko'rish &nbsp;›
            </button>
          </div>
        ) : (
          /* ── SAVED PRODUCTS GRID ────────────────────────────────────────── */
          <div className="mt-4 grid grid-cols-2 gap-3.5">
            {displayedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className="group flex flex-col justify-between rounded-[20px] bg-white p-2.5 shadow-[0_3px_12px_rgba(0,0,0,0.03)] border border-pink-50/80 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md relative"
              >
                {/* Image Container with Heart and Rating Badge */}
                <div className="relative w-full aspect-square rounded-[14px] overflow-hidden bg-pink-50/30">
                  <img
                    src={productImage(p)}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/images/floriva/cat-bouquets.jpg";
                    }}
                  />

                  {/* Rating Badge */}
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded-[6px] flex items-center gap-1 shadow-xs">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="#f5a623">
                      <path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" />
                    </svg>
                    <span className="text-[10.5px] font-semibold text-gray-800">4.8</span>
                  </div>

                  {/* Remove Favorite Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(p.id);
                    }}
                    className="absolute top-2 right-2 w-[30px] h-[30px] rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-[#ee4b6a] shadow-sm cursor-pointer active:scale-90 transition-transform border-0"
                    title="Sevimlilardan o'chirish"
                    aria-label="O'chirish"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="#ee4b6a" stroke="#ee4b6a" strokeWidth="1.5">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>

                {/* Info */}
                <div className="mt-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[13px] font-semibold text-[#17171c] line-clamp-1 group-hover:text-[#ee4b6a] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                      {p.pattern || p.category}
                    </p>
                  </div>

                  {/* Price and Add button */}
                  <div className="mt-2.5 flex items-center justify-between pt-1.5 border-t border-gray-50">
                    <span className="text-[13px] font-bold text-[#ee4b6a]">
                      {formatSom(p.price)}
                    </span>
                    <button
                      onClick={(e) => handleQuickAdd(p, e)}
                      className="w-[28px] h-[28px] rounded-full bg-[#fde8ec] text-[#ee4b6a] flex items-center justify-center hover:bg-[#ee4b6a] hover:text-white transition-colors cursor-pointer border-0 active:scale-95 shadow-xs"
                      aria-label="Savatga qo'shish"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 6v12M6 12h12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── FLORIVA PRODUCT DETAIL SHEET (MODAL matching Screen 3) ── */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative w-full max-w-[414px] max-h-[92vh] overflow-y-auto bg-white rounded-t-[28px] shadow-2xl animate-in slide-in-from-bottom duration-300 pb-24"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: "-apple-system, 'SF Pro Text', Inter, sans-serif",
            }}
          >
            {/* Top Sheet Drag Indicator */}
            <div className="w-full flex justify-center pt-2.5 pb-1">
              <div className="w-[36px] h-[4px] rounded-full bg-gray-200" />
            </div>

            {/* Product Image Header with Actions */}
            <div className="relative w-full h-[260px] bg-pink-50/40">
              <img
                src={productImage(selectedProduct)}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/images/floriva/product-pink-lily.jpg";
                }}
              />

              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 left-3 w-[38px] h-[38px] rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-gray-800 shadow-sm cursor-pointer border-0"
              >
                ✕
              </button>

              {/* Heart Action Button */}
              <button
                onClick={() => removeFavorite(selectedProduct.id)}
                className="absolute top-3 right-3 w-[38px] h-[38px] rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-[#ee4b6a] shadow-sm cursor-pointer border-0"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#ee4b6a">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>

            {/* Sheet Body Content */}
            <div className="p-4">
              <div className="text-[20px] font-semibold text-[#17171c]">
                {selectedProduct.name}
              </div>
              <div className="mt-1 text-[13px] text-gray-400">
                {selectedProduct.category}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-[22px] text-[#ee4b6a]">
                  {formatSom(selectedProduct.price)}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#fde8ec] text-[#ee4b6a] text-xs font-semibold">
                  Yangi uzilgan
                </span>
              </div>

              {selectedProduct.story && (
                <div className="mt-3 text-[13px] leading-[20px] text-gray-600 bg-gray-50 rounded-[12px] p-3">
                  {selectedProduct.story}
                </div>
              )}
            </div>

            {/* Floating Action Bar */}
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

      {/* ── FLOATING BOTTOM BAR (Matching 1-rasm: Home, Saved [ACTIVE], Center FAB, Katalog, Profile) ── */}
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
                  stroke="#17171c"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect x="11.2" y="14" width="1.6" height="3.2" rx="0.8" fill="#17171c" />
              </svg>
            </div>
            <span className="text-[10.5px] leading-[13px] mt-0.5 text-[#17171c] font-medium">
              Home
            </span>
          </button>

          {/* Tab 2: Saved (ACTIVE) */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex-1 flex flex-col items-center justify-center p-0 m-0 border-0 bg-transparent cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-[24px] h-[22px] flex items-center justify-center">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="#ee4b6a" stroke="#ee4b6a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <span className="text-[10.5px] leading-[13px] mt-0.5 text-[#ee4b6a] font-semibold">
              Saved
            </span>
          </button>

          {/* Center Spacer: creates exact space for the elevated button */}
          <div className="w-[58px] shrink-0 pointer-events-none" />

          {/* Tab 4: Katalog */}
          <button
            onClick={() => navigate({ to: "/catalog" })}
            className="flex-1 flex flex-col items-center justify-center p-0 m-0 border-0 bg-transparent cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-[24px] h-[22px] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.6" stroke="#17171c" strokeWidth="1.8" />
                <rect x="14" y="3.5" width="6.5" height="6.5" rx="1.6" stroke="#17171c" strokeWidth="1.8" />
                <rect x="3.5" y="14" width="6.5" height="6.5" rx="1.6" stroke="#17171c" strokeWidth="1.8" />
                <rect x="14" y="14" width="6.5" height="6.5" rx="1.6" stroke="#17171c" strokeWidth="1.8" />
              </svg>
            </div>
            <span className="text-[10.5px] leading-[13px] mt-0.5 text-[#17171c] font-medium">
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
                  stroke="#17171c"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[10.5px] leading-[13px] mt-0.5 text-[#17171c] font-medium">
              Aloqa
            </span>
          </button>
        </div>

        {/* iOS Home Indicator Bar matching 1-rasm */}
        <div className="w-[126px] h-[4px] rounded-full bg-[#d4d4d8] mx-auto mt-1.5 mb-0.5 pointer-events-none" />
      </div>
    </div>
  );
}
