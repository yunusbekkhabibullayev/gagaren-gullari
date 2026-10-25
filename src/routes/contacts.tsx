import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Aloqa va Do'kon haqida — NASTARIN GULLARI" },
      {
        name: "description",
        content: "Nastarin Gullari do'koni bilan bog'lanish, manzil, telefon raqamlar, ish tartibi va xizmatlar.",
      },
      { property: "og:title", content: "Aloqa va Do'kon haqida — NASTARIN GULLARI" },
    ],
  }),
  component: ContactsPage,
});

function ContactsPage() {
  const navigate = useNavigate();
  const { count: cartCount } = useCart();

  const phoneNumbers = [
    { label: "Asosiy buyurtmalar", number: "+998 90 123 45 67", raw: "+998901234567" },
    { label: "Kuryer va yetkazish", number: "+998 91 234 56 78", raw: "+998912345678" },
  ];

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
      <div className="w-full max-w-[414px] mx-auto px-4 pt-4 sm:pt-6 space-y-4">
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
              Aloqa
            </h1>
            <p className="text-[11.5px] text-[#8e8e93] font-normal">
              Do'kon haqida barcha ma'lumotlar
            </p>
          </div>

          {/* Right empty spacer to balance header (NO cart icon) */}
          <div className="w-[42px]" />
        </div>

        {/* ── STORE HERO CARD ────────────────────────────────────────────── */}
        <div className="relative rounded-[28px] bg-white p-5 border border-pink-100/70 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-center space-y-3">
          {/* Store Logo / Avatar */}
          <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-[#fce4ec] to-[#fff0f5] p-1.5 shadow-sm">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border border-pink-100">
              <span className="text-3xl">🌸</span>
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white text-xs">
              ✓
            </div>
          </div>

          <div>
            <h2
              className="text-[20px] font-bold text-[#17171c] tracking-[-0.3px]"
              style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
            >
              NASTARIN GULLARI
            </h2>
            <p className="text-[12.5px] text-[#8e8e93] mt-0.5">
              Do'stlik shahri • Mualliflik guldastalari maskani
            </p>
          </div>

          {/* Working Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Hozir ochiq • 24/7 xizmatingizdamiz</span>
          </div>

          <p className="text-[13px] leading-[19px] text-gray-600 pt-1 px-1">
            Biz har kuni yangi uzilgan sarxil gullar, nafis guldastalar va xushbo'y kompozitsiyalarni tayyorlaymiz. Har bir mijozimiz uchun o'zgacha mehr bilan xizmat ko'rsatamiz!
          </p>
        </div>

        {/* ── QUICK ACTION BUTTONS (Qo'ng'iroq / Telegram / Instagram) ──── */}
        <div className="grid grid-cols-3 gap-2.5">
          <a
            href="tel:+998901234567"
            className="flex flex-col items-center justify-center py-3 px-2 rounded-[20px] bg-white border border-pink-100 shadow-[0_3px_10px_rgba(0,0,0,0.03)] active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-[#fde8ec] text-[#ee4b6a] flex items-center justify-center mb-1.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <span className="text-[12px] font-bold text-gray-800">Qo'ng'iroq</span>
            <span className="text-[10px] text-gray-400">Tezkor aloqa</span>
          </a>

          <a
            href="https://t.me/nastarin_gullari_dostlik"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-3 px-2 rounded-[20px] bg-white border border-pink-100 shadow-[0_3px_10px_rgba(0,0,0,0.03)] active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-[#E8F5FD] text-[#2AABEE] flex items-center justify-center mb-1.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
            </div>
            <span className="text-[12px] font-bold text-gray-800">Telegram</span>
            <span className="text-[10px] text-gray-400">@nastarin</span>
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-3 px-2 rounded-[20px] bg-white border border-pink-100 shadow-[0_3px_10px_rgba(0,0,0,0.03)] active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FDE8EE] to-[#FFF0F4] text-[#E1306C] flex items-center justify-center mb-1.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            <span className="text-[12px] font-bold text-gray-800">Instagram</span>
            <span className="text-[10px] text-gray-400">Fotolar</span>
          </a>
        </div>

        {/* ── STORE INFORMATION LIST (iOS Grouped Style) ─────────────────── */}
        <div className="rounded-[24px] bg-white p-4 border border-pink-100/70 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-3.5">
          <h3 className="text-[14.5px] font-bold text-[#17171c] pb-1 border-b border-gray-100">
            Do'kon ma'lumotlari
          </h3>

          {/* Location */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#fde8ec] text-[#ee4b6a] flex items-center justify-center shrink-0 mt-0.5">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-[11.5px] text-gray-400 block">Do'kon manzili</span>
              <p className="text-[13px] font-semibold text-gray-900 leading-snug">
                Do'stlik shahri, Markaziy ko'cha (Markaziy bozor va bog' ro'parasida)
              </p>
            </div>
          </div>

          {/* Delivery */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-[11.5px] text-gray-400 block">Yetkazib berish</span>
              <p className="text-[13px] font-semibold text-gray-900 leading-snug">
                Do'stlik shahri bo'ylab <span className="text-emerald-600 font-bold">BEPUL</span> (30-40 daqiqada tezkor)
              </p>
            </div>
          </div>

          {/* Working Hours */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-[11.5px] text-gray-400 block">Ish vaqti</span>
              <p className="text-[13px] font-semibold text-gray-900 leading-snug">
                Har kuni 24 soat (24/7 dam olish kunlarisiz)
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-[11.5px] text-gray-400 block">To'lov turlari</span>
              <p className="text-[13px] font-semibold text-gray-900 leading-snug">
                Naqd pul, Payme, Click, Karta orqali kuryerga
              </p>
            </div>
          </div>
        </div>

        {/* ── PHONE NUMBERS CARD ─────────────────────────────────────────── */}
        <div className="rounded-[24px] bg-white p-4 border border-pink-100/70 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-2.5">
          <h3 className="text-[14.5px] font-bold text-[#17171c] pb-1 border-b border-gray-100">
            Telefon raqamlar
          </h3>

          <div className="space-y-2">
            {phoneNumbers.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between py-1">
                <div>
                  <span className="text-[11px] text-gray-400 block">{p.label}</span>
                  <span className="text-[14px] font-bold text-gray-900">{p.number}</span>
                </div>
                <a
                  href={`tel:${p.raw}`}
                  className="px-3.5 py-1.5 rounded-full bg-[#fde8ec] text-[#ee4b6a] text-xs font-bold active:scale-95 transition"
                >
                  Qo'ng'iroq
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ── FLORIST SPECIAL ORDER CTA ──────────────────────────────────── */}
        <div className="rounded-[24px] bg-gradient-to-r from-[#feeef3] to-[#fde6ee] p-4.5 border border-pink-200/80 text-center space-y-2.5">
          <span className="text-2xl">💐</span>
          <h4 className="text-[15px] font-bold text-[#17171c]">
            Maxsus buyurtma bermoqchimisiz?
          </h4>
          <p className="text-xs text-gray-600 max-w-[280px] mx-auto leading-relaxed">
            To'y, tug'ilgan kun yoki tantanali marosimlar uchun individual guldasta dizaynini floristimiz bilan kelishib oling.
          </p>
          <a
            href="https://t.me/nastarin_gullari_dostlik"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full h-[44px] rounded-full text-white text-[13.5px] font-bold active:scale-95 transition-transform"
            style={{
              background: "linear-gradient(90deg, #f04b6e, #e8466a)",
              boxShadow: "0 6px 18px rgba(240,75,110,0.3)",
            }}
          >
            <span>Floristga Telegramdan yozish</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* ── FLOATING BOTTOM BAR (Matching 1-rasm: Home, Saved, Center FAB, Katalog, Aloqa [ACTIVE]) ── */}
      <FloatingTabBar activeTab="aloqa" cartCount={cartCount} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// FLOATING 1-RASM BOTTOM NAVIGATION BAR COMPONENT (with Aloqa tab)
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
