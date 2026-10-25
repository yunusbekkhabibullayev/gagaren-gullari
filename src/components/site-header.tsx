import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import logoImg from "@/assets/logo.png";
import { MapPin, Phone, Clock, Instagram, Send, X } from "lucide-react";

export function SiteHeader() {
  const { count, hydrated } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-pink-100/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo & Avatar with Pink Ring (Screen 2 Header) */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative h-10 w-10 shrink-0 rounded-full border-2 border-[#E94B77] p-0.5 bg-white shadow-sm overflow-hidden transition-transform group-hover:scale-105">
            <img
              src={logoImg}
              alt="NASTARIN GULLARI"
              className="h-full w-full object-cover rounded-full"
            />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-gray-900 leading-none block">
              NASTARIN <span className="text-[#E94B77]">GULLARI</span>
            </span>
            <span className="text-[10px] text-[#E94B77] font-bold tracking-wider uppercase block mt-0.5">
              24/7 Bepul yetkazish
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 text-xs font-bold text-gray-600 sm:flex">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-[#E94B77]" }}
            className="transition hover:text-[#E94B77]"
          >
            Bosh sahifa
          </Link>
          <Link
            to="/catalog"
            activeProps={{ className: "text-[#E94B77]" }}
            className="transition hover:text-[#E94B77]"
          >
            Katalog
          </Link>
          <Link
            to="/cart"
            activeProps={{ className: "text-[#E94B77]" }}
            className="transition hover:text-[#E94B77]"
          >
            Savat
          </Link>
        </nav>

        {/* Right Icons: Phone & Cart (Screen 2 Right Icons) */}
        <div className="flex items-center gap-2.5">
          {/* Phone call icon */}
          <a
            href="tel:+998903949933"
            aria-label="Qo'ng'iroq qilish"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-50 text-[#E94B77] border border-pink-100 hover:bg-[#E94B77] hover:text-white transition active:scale-95 shadow-sm"
          >
            <Phone className="w-4 h-4" />
          </a>

          {/* Cart Icon with badge */}
          <Link
            to="/cart"
            aria-label="Savat"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-pink-50 text-[#E94B77] border border-pink-100 hover:bg-[#E94B77] hover:text-white transition active:scale-95 shadow-sm"
          >
            <IconBag />
            {hydrated && count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E94B77] text-white px-1 text-[10px] font-extrabold shadow-sm">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MobileTabBar() {
  const { count, hydrated } = useCart();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const [showAloqaModal, setShowAloqaModal] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const isBoshActive = pathname === "/";
  const isKatalogActive = isActive("/catalog") || pathname.startsWith("/product");
  const isSavatActive = isActive("/cart");

  return (
    <>
      {/* Floating Bottom Navigation Bar (Styled after 5th image reference) */}
      <nav
        className="fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto sm:hidden select-none"
        aria-label="Mobil navigatsiya"
      >
        <div className="relative h-16 w-full">
          {/* Smooth Concave Curved Notch SVG Background */}
          <svg
            className="absolute inset-0 w-full h-full drop-shadow-[0_8px_25px_rgba(216,76,115,0.18)]"
            viewBox="0 0 360 64"
            preserveAspectRatio="none"
            fill="#FFFFFF"
          >
            <path
              d="M 28 0 
                 L 128 0 
                 C 140 0 146 6 151 16 
                 C 157 30 167 38 180 38 
                 C 193 38 203 30 209 16 
                 C 214 6 220 0 232 0 
                 L 332 0 
                 C 347.46 0 360 12.54 360 28 
                 L 360 36 
                 C 360 51.46 347.46 64 332 64 
                 L 28 64 
                 C 12.54 64 0 51.46 0 36 
                 L 0 28 
                 C 0 12.54 12.54 0 28 0 Z"
            />
          </svg>

          {/* Elevated Center Button nestled in the concave notch */}
          <div className="absolute left-1/2 -top-4 -translate-x-1/2 z-10 flex flex-col items-center">
            <Link
              to="/catalog"
              aria-label="Katalog"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#D84C73] to-[#E86288] text-white shadow-[0_6px_18px_rgba(216,76,115,0.40)] border-[3px] border-white active:scale-95 transition-transform"
            >
              <CenterFlowerIcon className="w-5 h-5 text-white" />
            </Link>
            <span
              className={`w-1.5 h-1.5 rounded-full mt-2 transition-opacity duration-200 ${
                isKatalogActive ? "bg-[#D84C73] opacity-100" : "opacity-0"
              }`}
            />
          </div>

          {/* 5 Navigation Item Slots: Slot 1 (Bosh), Slot 2 (Katalog), Slot 3 (Spacer), Slot 4 (Savat), Slot 5 (Aloqa) */}
          <div className="relative z-0 grid grid-cols-5 h-full items-center px-1">
            {/* 1. Bosh */}
            <Link
              to="/"
              activeOptions={{ exact: true }}
              aria-label="Bosh sahifa"
              className="flex flex-col items-center justify-center py-2"
            >
              <IconHome active={isBoshActive} />
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1 transition-all duration-200 ${
                  isBoshActive ? "bg-[#D84C73] opacity-100 scale-100" : "opacity-0 scale-50"
                }`}
              />
            </Link>

            {/* 2. Katalog */}
            <Link
              to="/catalog"
              aria-label="Katalog"
              className="flex flex-col items-center justify-center py-2"
            >
              <IconGrid active={isKatalogActive} />
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1 transition-all duration-200 ${
                  isKatalogActive ? "bg-[#D84C73] opacity-100 scale-100" : "opacity-0 scale-50"
                }`}
              />
            </Link>

            {/* 3. Empty spacer for the center elevated button */}
            <div className="pointer-events-none" />

            {/* 4. Savat */}
            <Link
              to="/cart"
              aria-label="Savat"
              className="flex flex-col items-center justify-center py-2 relative"
            >
              <span className="relative">
                <IconBag active={isSavatActive} />
                {hydrated && count > 0 && (
                  <span
                    className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-sm"
                    style={{ background: "#D84C73" }}
                  >
                    {count}
                  </span>
                )}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1 transition-all duration-200 ${
                  isSavatActive ? "bg-[#D84C73] opacity-100 scale-100" : "opacity-0 scale-50"
                }`}
              />
            </Link>

            {/* 5. Aloqa */}
            <button
              type="button"
              onClick={() => setShowAloqaModal(true)}
              aria-label="Do'kon ma'lumotlari"
              className="flex flex-col items-center justify-center py-2 cursor-pointer"
            >
              <IconUser active={showAloqaModal} />
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1 transition-all duration-200 ${
                  showAloqaModal ? "bg-[#D84C73] opacity-100 scale-100" : "opacity-0 scale-50"
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Aloqa Bottom Sheet Modal (Styled after 4th image reference) */}
      {showAloqaModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          {/* Backdrop blur overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setShowAloqaModal(false)}
          />

          {/* Bottom Sheet Card */}
          <div className="relative w-full max-w-lg rounded-t-[32px] sm:rounded-3xl bg-white p-6 pb-8 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-300 z-10">
            {/* Drag Handle Bar on top (like iOS bottom sheet) */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto sm:hidden mb-2" />

            {/* Header: Title in center, Done/Yopish button on the right */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="w-14" />
              <h3 className="font-bold text-gray-900 text-base sm:text-lg text-center">
                Do'kon ma'lumotlari
              </h3>
              <button
                type="button"
                onClick={() => setShowAloqaModal(false)}
                className="text-sm font-bold text-[#D84C73] hover:opacity-80 transition py-1 px-2"
              >
                Yopish
              </button>
            </div>

            {/* Shop summary */}
            <div className="flex items-center gap-3 bg-pink-50/60 p-3.5 rounded-2xl border border-pink-100">
              <img src={logoImg} alt="Logo" className="h-10 w-10 object-contain rounded-lg" />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  NASTARIN <span className="text-[#D84C73]">GULLARI</span>
                </h4>
                <p className="text-xs text-gray-600">
                  Do'stlik shahrida 24/7 mualliflik guldastalari va yangi gullar yetkazib berish.
                </p>
              </div>
            </div>

            {/* Contact Details List */}
            <div className="space-y-2.5 text-xs font-medium">
              {/* Phone */}
              <a
                href="tel:+998903949933"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-pink-50/50 transition active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D84C73] text-white">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-semibold uppercase">Telefon raqam</div>
                    <div className="text-sm font-bold text-gray-900">+998 90 394 99 33</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#D84C73]">Qo'ng'iroq ➔</span>
              </a>

              {/* Location */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-100 text-[#D84C73]">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase">Manzil / Joylashuv</div>
                  <div className="text-xs font-bold text-gray-800">Do'stlik sh., Markaziy ko'chasi 14-uy</div>
                </div>
              </div>

              {/* Work Hours */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase">Ish vaqti</div>
                  <div className="text-xs font-bold text-gray-800">24/7 (Har kuni tanaffussiz)</div>
                </div>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <a
                href="https://www.instagram.com/nastarin_gullari.dostlik"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-xs font-bold text-white shadow-md transition hover:opacity-90 active:scale-95"
              >
                <Instagram className="h-4 w-4" />
                <span>Instagram</span>
              </a>
              <a
                href="https://t.me/nastarin_gullari.dostlik"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#2AABEE] px-4 py-3 text-xs font-bold text-white shadow-md transition hover:opacity-90 active:scale-95"
              >
                <Send className="h-4 w-4" />
                <span>Telegram</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function IconHome({ active }: { active?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#D84C73" : "#9CA3AF"}
      strokeWidth={active ? "2.2" : "1.8"}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}
function IconGrid({ active }: { active?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#D84C73" : "#9CA3AF"}
      strokeWidth={active ? "2.2" : "1.8"}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function IconUser({ active }: { active?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#D84C73" : "#9CA3AF"}
      strokeWidth={active ? "2.2" : "1.8"}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}
function IconBag({ active }: { active?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#D84C73" : "#9CA3AF"}
      strokeWidth={active ? "2.2" : "1.8"}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 7h12l-1 13H7L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.92a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92Z" />
    </svg>
  );
}

function CenterFlowerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || "w-6 h-6"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 3 Petals / Leaves radiating outward matching reference image 5 */}
      <path d="M12 3c-2.2 3.2-3 7 0 10.5 3-3.5 2.2-7.3 0-10.5z" />
      <path d="M10.5 13.5C7.5 12.2 4.5 13 3.5 16c3.2.5 6-.5 7-2.5z" />
      <path d="M13.5 13.5C16.5 12.2 19.5 13 20.5 16c-3.2.5-6-.5-7-2.5z" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}

