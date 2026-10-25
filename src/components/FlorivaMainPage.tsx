import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useProducts, formatSom, productImage, Product } from "@/lib/products";
import { useCategories } from "@/lib/categories";
import { useCart } from "@/lib/cart";
import { useFavorites } from "@/lib/favorites";
import { toast } from "sonner";

interface FlorivaMainPageProps {
  onOpenOnboarding?: () => void;
}

export function FlorivaMainPage({ onOpenOnboarding }: FlorivaMainPageProps) {
  const navigate = useNavigate();
  const { count: cartCount, add: addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { data: dbProducts = [], isLoading: productsLoading } = useProducts(1, 24);
  const { data: dbCategories = [] } = useCategories();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"home" | "saved" | "cart" | "catalog" | "profile">("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [activeBannerDot, setActiveBannerDot] = useState(1);

  // Trending categories matching Floriva design
  const trendingCategories = [
    {
      id: "boxes",
      name: "Flowers in\nBoxes",
      dbMatch: "Atirgullar",
      img: "/images/floriva/cat-boxes.jpg",
    },
    {
      id: "bouquets",
      name: "Hand\nBouquets",
      dbMatch: "Buketlar",
      img: "/images/floriva/cat-bouquets.jpg",
    },
    {
      id: "vases",
      name: "Flowers in\nVases",
      dbMatch: "Tuvakdagi o'simliklar",
      img: "/images/floriva/cat-vases.jpg",
    },
    {
      id: "giftset",
      name: "Premium\nGiftset",
      dbMatch: "Sovg'a to'plamlari",
      img: "/images/floriva/cat-giftset.jpg",
    },
  ];

  // Celebrations matching Floriva design
  const celebrations = [
    { id: "weeding", title: "Weeding", img: "/images/floriva/pt-weeding.jpg" },
    { id: "baby", title: "New baby", img: "/images/floriva/pt-baby.jpg" },
    { id: "graduations", title: "Graduations", img: "/images/floriva/pt-graduations.jpg" },
    { id: "birthday", title: "Birthday", img: "/images/floriva/pt-birthday.jpg" },
  ];

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return dbProducts.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.pattern?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        (q === "weeding" && (p.category === "Buketlar" || p.name.toLowerCase().includes("lily") || p.story?.toLowerCase().includes("to'y"))) ||
        (q === "birthday" && (p.category === "Atirgullar" || p.category === "Sovg'a to'plamlari")) ||
        (q === "new baby" && (p.category === "Buketlar" || p.category === "Sovg'a to'plamlari")) ||
        (q === "graduations" && (p.category === "Buketlar" || p.category === "Atirgullar"));

      const matchesCategory =
        !selectedCategory ||
        p.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [dbProducts, searchQuery, selectedCategory]);

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(p, 1);
    toast.success(`${p.name} savatga qo'shildi! 🌸`);
  };

  const handleOpenProduct = (p: Product) => {
    setSelectedProduct(p);
    setModalQuantity(1);
    setIsFavorite(false);
  };

  const handleModalAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, modalQuantity);
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
      {/* SVG Sprite Definitions matching Floriva */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <symbol id="f-search" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="m16.5 16.5 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </symbol>
          <symbol id="f-cart" viewBox="0 0 24 24">
            <path
              d="M3 4h2.2l2.1 10.2a1 1 0 0 0 1 .8h8.4a1 1 0 0 0 1-.8L19.2 8H6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9.5" cy="19.5" r="1.1" fill="currentColor" />
            <circle cx="16.5" cy="19.5" r="1.1" fill="currentColor" />
          </symbol>
          <symbol id="f-bell" viewBox="0 0 24 24">
            <path
              d="M6 16v-5a6 6 0 0 1 12 0v5l1.6 2H4.4z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M10 21a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </symbol>
          <symbol id="f-home" viewBox="0 0 24 24">
            <path fill="currentColor" stroke="none" d="M12 3.5 3.5 11v9a.8.8 0 0 0 .8.8H9v-6h6v6h4.7a.8.8 0 0 0 .8-.8v-9z" />
          </symbol>
          <symbol id="f-msg" viewBox="0 0 24 24">
            <path
              d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 4v-4H6a2 2 0 0 1-2-2z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M9 10h.01M15 10h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </symbol>
          <symbol id="f-heart" viewBox="0 0 24 24">
            <path
              d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </symbol>
          <symbol id="f-grid" viewBox="0 0 24 24">
            <rect x="4" y="4" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <rect x="14" y="4" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <rect x="4" y="14" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M17 14v6M14 17h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </symbol>
          <symbol id="f-user" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M6.5 18.5c1.2-2.4 3.2-3.5 5.5-3.5s4.3 1.1 5.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </symbol>
          <symbol id="f-star" viewBox="0 0 24 24">
            <path fill="#f5a623" stroke="none" d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" />
          </symbol>
          <symbol id="f-fire" viewBox="0 0 24 24">
            <path fill="#f5821f" stroke="none" d="M12 2c1 4 5.5 5.5 5.5 11a5.5 5.5 0 0 1-11 0c0-2 1-3.4 2.2-4.4.1 2 .9 3 2 3.2C10.2 8 10.5 5 12 2z" />
          </symbol>
          <symbol id="f-off" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#ee4b6a" stroke="none" />
            <path d="m8 16 8-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="8.6" cy="8.6" r="1.6" fill="#fff" stroke="none" />
            <circle cx="15.4" cy="15.4" r="1.6" fill="#fff" stroke="none" />
          </symbol>
          <symbol id="f-minus" viewBox="0 0 24 24">
            <path d="M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </symbol>
          <symbol id="f-plus" viewBox="0 0 24 24">
            <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </symbol>
        </defs>
      </svg>

      {/* Main Column Container */}
      <div className="w-full max-w-[414px] mx-auto px-4 pt-4 sm:pt-6">
        {/* ── TOP HEADER (Avatar + Cart + Notification) ────────────────── */}
        <div className="flex items-center justify-between w-full h-[52px]">
          {/* Avatar / Profile */}
          <button
            onClick={() => {
              if (onOpenOnboarding) onOpenOnboarding();
              else navigate({ to: "/auth" });
            }}
            className="p-0 border-0 bg-transparent cursor-pointer rounded-full active:scale-95 transition-transform"
          >
            <img
              src="/images/floriva/avatar.jpg"
              alt="Profil"
              className="w-[48px] h-[48px] rounded-full object-cover shadow-sm border border-white/80"
              onError={(e) => {
                e.currentTarget.src = "/icon-192x192.png";
              }}
            />
          </button>

          {/* Action icon: Bell */}
          <div className="flex items-center gap-2">
            {/* Bell Button with Pink Dot Indicator */}
            <div className="relative">
              <button
                onClick={() => toast.info("Yangi chegirmalar va yangiliklar bildirishnomasi yoqilgan.")}
                className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center text-[#222] shadow-[0_2px_8px_rgba(0,0,0,0.04)] cursor-pointer active:scale-95 transition-transform border border-gray-100"
                aria-label="Bildirishnomalar"
              >
                <svg width="21" height="21" className="text-[#222]">
                  <use href="#f-bell" />
                </svg>
              </button>
              <div className="absolute top-1 right-1 w-[9px] h-[9px] rounded-full bg-[#ee4b6a] border-[1.5px] border-white pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── SEARCH BAR ────────────────────────────────────────────── */}
        <div className="mt-4 w-full h-[40px] rounded-[20px] bg-white flex items-center gap-2 px-3.5 text-[14px] text-[#222] shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-gray-100/80">
          <svg width="19" height="19" className="text-gray-400 shrink-0">
            <use href="#f-search" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bouquet, giftset..."
            className="w-full bg-transparent border-0 outline-none text-[14px] text-[#222] placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-gray-400 hover:text-gray-600 text-xs px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* ── TRENDING CATEGORIES ───────────────────────────────────── */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2
              className="font-semibold text-[17px] leading-[22px] tracking-[-0.4px] text-[#17171c]"
              style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
            >
              Trending Categories
            </h2>
            <Link
              to="/catalog"
              className="text-[14px] leading-[20px] text-[#333] hover:text-[#ee4b6a] transition"
            >
              View All &nbsp;›
            </Link>
          </div>

          {/* 4 Horizontal Categories */}
          <div className="mt-3.5 grid grid-cols-4 gap-2">
            {trendingCategories.map((c) => {
              const isSelected = selectedCategory === c.dbMatch;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCategory(isSelected ? null : c.dbMatch);
                  }}
                  className={`flex flex-col items-center bg-transparent border-0 p-0 cursor-pointer active:scale-95 transition-transform ${
                    isSelected ? "ring-2 ring-[#ee4b6a] rounded-[10px]" : ""
                  }`}
                >
                  <img
                    src={c.img}
                    alt={c.name}
                    className="w-full aspect-square rounded-[8px] object-cover shadow-sm"
                  />
                  <p className="mt-2 text-[12.5px] leading-[15px] text-[#8e8e93] text-center whitespace-pre-line font-normal">
                    {c.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── FLORIVA SPECIAL PROMO BANNER ──────────────────────────── */}
        <div className="mt-6 w-full">
          <div className="relative w-full h-[144px] rounded-[10px] overflow-hidden shadow-sm">
            <img
              src="/images/floriva/banner-special.jpg"
              alt="Floriva Special"
              className="w-full h-full object-cover"
            />
            {/* Banner overlay text */}
            <div className="absolute left-[17px] top-[24px] z-10">
              <div
                className="font-semibold text-[18px] leading-[26px] tracking-[-0.3px] text-[#17171c]"
                style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
              >
                Nastarin{" "}
                <span
                  style={{
                    fontFamily: '"Instrument Serif", Georgia, serif',
                    fontStyle: "italic",
                    fontSize: "22px",
                    color: "#ee4b6a",
                    fontWeight: 400,
                  }}
                >
                  Special
                </span>
              </div>
              <div className="text-[12.5px] leading-[17px] text-[#777] w-[140px] mt-1">
                Customisable flower arrangements!
              </div>
              <button
                onClick={() => navigate({ to: "/catalog" })}
                className="mt-3.5 w-[84px] h-[28px] rounded-[8px] bg-[#111] text-white text-[12px] font-medium flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
              >
                Shop Now
              </button>
            </div>
          </div>

          {/* Banner Dots */}
          <div className="mt-2.5 flex items-center justify-center gap-1.5">
            <div
              onClick={() => setActiveBannerDot(0)}
              className={`h-[6px] rounded-[3px] transition-all cursor-pointer ${
                activeBannerDot === 0 ? "w-[30px] bg-[#ee4b6a]" : "w-[6px] bg-[#d4d4d8]"
              }`}
            />
            <div
              onClick={() => setActiveBannerDot(1)}
              className={`h-[6px] rounded-[3px] transition-all cursor-pointer ${
                activeBannerDot === 1 ? "w-[30px] bg-[#ee4b6a]" : "w-[6px] bg-[#d4d4d8]"
              }`}
            />
            <div
              onClick={() => setActiveBannerDot(2)}
              className={`h-[6px] rounded-[3px] transition-all cursor-pointer ${
                activeBannerDot === 2 ? "w-[30px] bg-[#ee4b6a]" : "w-[6px] bg-[#d4d4d8]"
              }`}
            />
          </div>
        </div>

        {/* ── PRESENTS FOR ALL CELEBRATIONS ─────────────────────────── */}
        <div className="mt-6">
          <h2
            className="font-semibold text-[17px] leading-[22px] tracking-[-0.4px] text-[#17171c]"
            style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
          >
            Presents for All Celebrations
          </h2>

          {/* Celebrations horizontal row */}
          <div className="mt-3.5 grid grid-cols-4 gap-2">
            {celebrations.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSearchQuery(item.title);
                }}
                className="flex flex-col items-center bg-transparent border-0 p-0 cursor-pointer active:scale-95 transition-transform"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full aspect-square rounded-[10px] object-cover shadow-sm"
                />
                <p className="mt-2.5 text-[13px] leading-[16px] text-[#8e8e93] text-center font-normal">
                  {item.title}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ── REAL DATABASE PRODUCTS (Grid) ─────────────────────────── */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2
              className="font-semibold text-[17px] leading-[22px] tracking-[-0.4px] text-[#17171c]"
              style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
            >
              {selectedCategory ? `${selectedCategory} mahsulotlari` : "Featured Flowers"}
            </h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-[13px] text-[#ee4b6a] font-medium"
              >
                Filtrni tozalash
              </button>
            )}
          </div>

          {/* Loading Skeleton */}
          {productsLoading ? (
            <div className="mt-3.5 grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-[220px] rounded-[14px] bg-white/70 animate-pulse border border-pink-50"
                />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="mt-6 py-8 text-center text-gray-500 text-sm bg-white/60 rounded-[14px]">
              Kechirasiz, mahsulot topilmadi.
            </div>
          ) : (
            <div className="mt-3.5 grid grid-cols-2 gap-3">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleOpenProduct(p)}
                  className="group flex flex-col justify-between rounded-[14px] bg-white p-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-pink-50/80 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md"
                >
                  {/* Product Image */}
                  <div className="relative w-full aspect-square rounded-[10px] overflow-hidden bg-pink-50/30">
                    <img
                      src={productImage(p)}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/images/floriva/cat-bouquets.jpg";
                      }}
                    />
                    {/* Rating Chip */}
                    <div className="absolute top-1.5 left-1.5 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded-[6px] flex items-center gap-1 shadow-xs">
                      <svg width="12" height="12">
                        <use href="#f-star" />
                      </svg>
                      <span className="text-[11px] font-semibold text-gray-800">4.8</span>
                    </div>

                    {/* Favorite Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(p.id, p.name);
                      }}
                      className="absolute top-1.5 right-1.5 w-[26px] h-[26px] rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-xs cursor-pointer active:scale-90 transition-transform border-0"
                      aria-label="Sevimlilarga qo'shish"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill={isFavorite(p.id) ? "#ee4b6a" : "none"} stroke={isFavorite(p.id) ? "#ee4b6a" : "#71717a"} strokeWidth="2">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>

                  {/* Info */}
                  <div className="mt-2 flex-1 flex flex-col justify-between">
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
                        className="w-[26px] h-[26px] rounded-full bg-[#fde8ec] text-[#ee4b6a] flex items-center justify-center hover:bg-[#ee4b6a] hover:text-white transition-colors cursor-pointer border-0"
                        aria-label="Savatga qo'shish"
                      >
                        <svg width="13" height="13">
                          <use href="#f-plus" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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

              {/* Share & Heart Action Buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Havola nusxalandi!");
                  }}
                  className="w-[38px] h-[38px] rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-gray-800 shadow-sm cursor-pointer border-0"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (selectedProduct) {
                      toggleFavorite(selectedProduct.id, selectedProduct.name);
                    }
                  }}
                  className={`w-[38px] h-[38px] rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm cursor-pointer border-0 transition-colors ${
                    selectedProduct && isFavorite(selectedProduct.id) ? "text-[#ee4b6a]" : "text-gray-800"
                  }`}
                >
                  <svg width="19" height="19" fill={selectedProduct && isFavorite(selectedProduct.id) ? "#ee4b6a" : "none"} stroke="currentColor" strokeWidth="1.8">
                    <use href="#f-heart" />
                  </svg>
                </button>
              </div>

              {/* Counter Pill */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-0.5 rounded-full text-xs font-medium text-gray-700 shadow-xs">
                1 / 1
              </div>
            </div>

            {/* Sheet Body Content */}
            <div className="p-4">
              {/* Store / Florist Header */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#ff5ea0] to-[#d6286f] text-white font-bold text-sm flex items-center justify-center italic">
                    N
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-gray-900">Nastarin Gullari</div>
                    <div className="text-[11px] text-gray-400">Do'stlik shahar floristika do'koni</div>
                  </div>
                </div>
                <a
                  href="https://t.me/nastarin_admin"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-full bg-gray-100 text-[13px] font-medium text-gray-700 flex items-center gap-1.5 hover:bg-gray-200 transition"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-3.9A8 8 0 1 1 20 12z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Aloqa
                </a>
              </div>

              {/* Rating & Reviews */}
              <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                <svg width="16" height="16">
                  <use href="#f-star" />
                </svg>
                <b className="text-sm font-semibold text-gray-900">4.8</b>
                <span>(180+ sharhlar)</span>
              </div>

              {/* Product Title */}
              <h2
                className="mt-1 text-[20px] font-semibold leading-[28px] tracking-[-0.5px] text-[#17171c]"
                style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
              >
                {selectedProduct.name}
              </h2>

              {/* Benefit Chips */}
              <div className="mt-2.5 flex flex-wrap gap-2">
                <span className="h-[28px] border border-gray-200 rounded-[14px] px-2.5 flex items-center gap-1.5 text-xs font-medium bg-white text-gray-800">
                  <svg width="15" height="15">
                    <use href="#f-fire" />
                  </svg>
                  Ommabop
                </span>
                <span className="h-[28px] border border-gray-200 rounded-[14px] px-2.5 flex items-center text-xs font-medium bg-white text-gray-800">
                  Yangi uzilgan gullar
                </span>
                <span className="h-[28px] border border-gray-200 rounded-[14px] px-2.5 flex items-center text-xs font-medium bg-white text-gray-800">
                  Do'stlik bo'ylab yetkazish
                </span>
              </div>

              {/* Price & Discount */}
              <div className="mt-3.5 flex items-center gap-2.5">
                <span
                  className="font-semibold text-[22px] leading-[28px] text-[#17171c]"
                  style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
                >
                  {formatSom(selectedProduct.price)}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#fde8ec] text-[#ee4b6a] font-semibold text-xs flex items-center gap-1">
                  <svg width="13" height="13">
                    <use href="#f-off" />
                  </svg>
                  Yangi
                </span>
              </div>

              {/* Details List */}
              <div className="mt-4">
                <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Tafsilotlar
                </div>
                <ul className="mt-2 bg-[#fcf7e3]/80 rounded-[8px] p-3 pl-6 text-[13px] leading-[22px] list-disc text-gray-800 border border-[#f3ecc8]">
                  <li>Toifa: {selectedProduct.category}</li>
                  <li>Kelib chiqishi: {selectedProduct.workshop || "Mahalliy yangi gullar"}</li>
                  <li>O'ram: Premium mualliflik sovg'a o'rami</li>
                  <li>Saqlanish: 5–7 kun so'lmaydi</li>
                </ul>
              </div>

              {/* Description */}
              {selectedProduct.story && (
                <div className="mt-3 text-[13px] leading-[20px] text-[#555] bg-gray-50 rounded-[8px] p-3 border border-gray-100">
                  {selectedProduct.story}
                </div>
              )}
            </div>

            {/* Bottom Floating Bar */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[414px] h-[72px] bg-white border-t border-gray-100 px-4 flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-30">
              {/* Quantity Selector */}
              <div className="w-[106px] h-[41px] border border-gray-200 rounded-[21px] flex items-center justify-between px-2 text-sm bg-white">
                <button
                  onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                  className="w-[26px] h-[26px] rounded-full border border-gray-200 bg-white text-gray-500 flex items-center justify-center cursor-pointer active:scale-95"
                >
                  <svg width="12" height="12">
                    <use href="#f-minus" />
                  </svg>
                </button>
                <span className="font-semibold text-gray-900">{modalQuantity}</span>
                <button
                  onClick={() => setModalQuantity(modalQuantity + 1)}
                  className="w-[26px] h-[26px] rounded-full border border-[#ee4b6a] bg-[#fde8ec] text-[#ee4b6a] flex items-center justify-center cursor-pointer active:scale-95"
                >
                  <svg width="12" height="12">
                    <use href="#f-plus" />
                  </svg>
                </button>
              </div>

              {/* Add to Cart CTA */}
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

      {/* ── FLOATING BOTTOM BAR (Matching 1-rasm: Home, Saved, Center FAB, Katalog, Profile) ── */}
      <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-28px)] max-w-[390px] bg-white rounded-[32px] shadow-[0_12px_36px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.03)] border border-[#efeff2] z-40 pt-2 pb-1.5 px-2 select-none">
        {/* Center Elevated Floating Circle (Primary Brand Color #ee4b6a) */}
        <button
          onClick={() => {
            setActiveTab("cart");
            navigate({ to: "/cart" });
          }}
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
            onClick={() => {
              setActiveTab("home");
              setSelectedCategory(null);
              setSearchQuery("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex-1 flex flex-col items-center justify-center p-0 m-0 border-0 bg-transparent cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-[24px] h-[22px] flex items-center justify-center">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3.2L3.5 10.5C2.8 11.1 2.5 12 2.5 12.9V19C2.5 20.1 3.4 21 4.5 21H9.5C9.8 21 10 20.8 10 20.5V15.5C10 14.7 10.7 14 11.5 14H12.5C13.3 14 14 14.7 14 15.5V20.5C14 20.8 14.2 21 14.5 21H19.5C20.6 21 21.5 20.1 21.5 19V12.9C21.5 12 21.2 11.1 20.5 10.5L12 3.2Z"
                  fill={activeTab === "home" ? "#ee4b6a" : "none"}
                  stroke={activeTab === "home" ? "#ee4b6a" : "#17171c"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="11.2"
                  y="14"
                  width="1.6"
                  height="3.2"
                  rx="0.8"
                  fill={activeTab === "home" ? "#ffffff" : "#17171c"}
                />
              </svg>
            </div>
            <span
              className={`text-[10.5px] leading-[13px] mt-0.5 transition-colors ${
                activeTab === "home" ? "text-[#ee4b6a] font-semibold" : "text-[#17171c] font-medium"
              }`}
            >
              Home
            </span>
          </button>

          {/* Tab 2: Saved */}
          <button
            onClick={() => {
              navigate({ to: "/saved" });
            }}
            className="flex-1 flex flex-col items-center justify-center p-0 m-0 border-0 bg-transparent cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-[24px] h-[22px] flex items-center justify-center">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill={activeTab === "saved" ? "#ee4b6a" : "none"}
                  stroke={activeTab === "saved" ? "#ee4b6a" : "#17171c"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className={`text-[10.5px] leading-[13px] mt-0.5 transition-colors ${
                activeTab === "saved" ? "text-[#ee4b6a] font-semibold" : "text-[#17171c] font-medium"
              }`}
            >
              Saved
            </span>
          </button>

          {/* Center Spacer: creates exact space for the elevated button */}
          <div className="w-[58px] shrink-0 pointer-events-none" />

          {/* Tab 4: Katalog */}
          <button
            onClick={() => {
              setActiveTab("catalog");
              navigate({ to: "/catalog" });
            }}
            className="flex-1 flex flex-col items-center justify-center p-0 m-0 border-0 bg-transparent cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-[24px] h-[22px] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3.5"
                  y="3.5"
                  width="6.5"
                  height="6.5"
                  rx="1.6"
                  fill={activeTab === "catalog" ? "#ee4b6a" : "none"}
                  stroke={activeTab === "catalog" ? "#ee4b6a" : "#17171c"}
                  strokeWidth="1.8"
                />
                <rect
                  x="14"
                  y="3.5"
                  width="6.5"
                  height="6.5"
                  rx="1.6"
                  fill={activeTab === "catalog" ? "#ee4b6a" : "none"}
                  stroke={activeTab === "catalog" ? "#ee4b6a" : "#17171c"}
                  strokeWidth="1.8"
                />
                <rect
                  x="3.5"
                  y="14"
                  width="6.5"
                  height="6.5"
                  rx="1.6"
                  fill={activeTab === "catalog" ? "#ee4b6a" : "none"}
                  stroke={activeTab === "catalog" ? "#ee4b6a" : "#17171c"}
                  strokeWidth="1.8"
                />
                <rect
                  x="14"
                  y="14"
                  width="6.5"
                  height="6.5"
                  rx="1.6"
                  fill={activeTab === "catalog" ? "#ee4b6a" : "none"}
                  stroke={activeTab === "catalog" ? "#ee4b6a" : "#17171c"}
                  strokeWidth="1.8"
                />
              </svg>
            </div>
            <span
              className={`text-[10.5px] leading-[13px] mt-0.5 transition-colors ${
                activeTab === "catalog" ? "text-[#ee4b6a] font-semibold" : "text-[#17171c] font-medium"
              }`}
            >
              Katalog
            </span>
          </button>

          {/* Tab 4: Aloqa (Replaced Profile) */}
          <button
            onClick={() => {
              navigate({ to: "/contacts" });
            }}
            className="flex-1 flex flex-col items-center justify-center p-0 m-0 border-0 bg-transparent cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-[24px] h-[22px] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                  stroke={activeTab === "profile" ? "#ee4b6a" : "#17171c"}
                  strokeWidth="1.8"
                  fill={activeTab === "profile" ? "#ee4b6a" : "none"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className={`text-[10.5px] leading-[13px] mt-0.5 transition-colors ${
                activeTab === "profile" ? "text-[#ee4b6a] font-semibold" : "text-[#17171c] font-medium"
              }`}
            >
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
