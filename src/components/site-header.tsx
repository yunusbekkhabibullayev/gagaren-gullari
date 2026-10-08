import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import logoImg from "@/assets/logo.png";
import { MapPin, Phone, Clock, Instagram, Send, X } from "lucide-react";

export function SiteHeader() {
  const { count, hydrated } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 sm:flex sm:justify-between">
        {/* Logo */}
        <Link to="/" className="flex min-w-0 items-center gap-2.5 group">
          <img
            src={logoImg}
            alt="NASTARIN GULLARI logo"
            className="h-10 w-10 shrink-0 object-contain transition-transform group-hover:scale-105"
          />
          <span className="truncate font-sans text-lg font-bold tracking-tight text-gray-900">
            NASTARIN <span className="text-[#D84C73]">GULLARI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 sm:flex">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-[#D84C73] font-semibold" }}
            className="transition hover:text-[#D84C73]"
          >
            Bosh sahifa
          </Link>
          <Link
            to="/catalog"
            activeProps={{ className: "text-[#D84C73] font-semibold" }}
            className="transition hover:text-[#D84C73]"
          >
            Katalog
          </Link>
          <Link
            to="/admin/inventory"
            activeProps={{ className: "text-[#D84C73] font-semibold" }}
            className="transition flex items-center gap-1 text-[#e0526c] font-bold bg-rose-50 px-3 py-1 rounded-full hover:bg-rose-100"
          >
            <span>📦 Zaxira Yordamchisi (Bilet 029)</span>
          </Link>
        </nav>

        {/* Right side: phone + cart */}
        <div className="flex items-center gap-3">
          {/* Phone button — desktop */}
          <a
            href="tel:+998903949933"
            className="hidden items-center gap-2 rounded-full bg-[#D84C73] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c43f64] hover:scale-105 active:scale-95 sm:inline-flex"
          >
            <IconPhone />
            <span>+998 90 394 99 33</span>
          </a>

          {/* Cart button — desktop */}
          <Link
            to="/cart"
            aria-label="Savat"
            className="relative hidden shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-pink-50 hover:border-pink-200 sm:inline-flex"
          >
            <IconBag />
            <span>Savat</span>
            {hydrated && count > 0 && (
              <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#D84C73] px-1.5 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {/* Phone button — mobile only */}
          <a
            href="tel:+998903949933"
            aria-label="Qo'ng'iroq qilish"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D84C73] text-white shadow-sm transition hover:bg-[#c43f64] sm:hidden"
          >
            <IconPhone />
          </a>
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
      {/* Floating Bottom Navigation Bar with 4-side Margins */}
      <nav
        className="fixed bottom-3 left-4 right-4 z-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-100/80 sm:hidden"
        style={{
          boxShadow: "0 8px 30px rgba(216,76,115,0.18)",
        }}
        aria-label="Mobil navigatsiya"
      >
        <div className="flex items-center justify-around h-14 px-1">
          {/* Bosh */}
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="flex flex-1 flex-col items-center justify-center gap-0.5"
          >
            <IconHome active={isBoshActive} />
            <span
              className="text-[11px] font-semibold leading-none"
              style={{ color: isBoshActive ? "#D84C73" : "#9CA3AF" }}
            >
              Bosh
            </span>
          </Link>

          {/* Katalog */}
          <Link
            to="/catalog"
            className="flex flex-1 flex-col items-center justify-center gap-0.5"
          >
            <IconGrid active={isKatalogActive} />
            <span
              className="text-[11px] font-semibold leading-none"
              style={{ color: isKatalogActive ? "#D84C73" : "#9CA3AF" }}
            >
              Katalog
            </span>
          </Link>

          {/* Savat */}
          <Link
            to="/cart"
            className="flex flex-1 flex-col items-center justify-center gap-0.5 relative"
          >
            <span className="relative">
              <IconBag active={isSavatActive} />
              {hydrated && count > 0 && (
                <span
                  className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-sm"
                  style={{ background: "#D84C73" }}
                >
                  {count}
                </span>
              )}
            </span>
            <span
              className="text-[11px] font-semibold leading-none"
              style={{ color: isSavatActive ? "#D84C73" : "#9CA3AF" }}
            >
              Savat
            </span>
          </Link>

          {/* Aloqa */}
          <button
            type="button"
            onClick={() => setShowAloqaModal(true)}
            className="flex flex-1 flex-col items-center justify-center gap-0.5"
          >
            <IconUser active={showAloqaModal} />
            <span
              className="text-[11px] font-semibold leading-none"
              style={{ color: showAloqaModal ? "#D84C73" : "#9CA3AF" }}
            >
              Aloqa
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Aloqa Modal */}
      {showAloqaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <img src={logoImg} alt="Logo" className="h-10 w-10 object-contain" />
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">
                    NASTARIN <span className="text-[#D84C73]">GULLARI</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">Do'kon ma'lumotlari</p>
                </div>
              </div>
              <button
                onClick={() => setShowAloqaModal(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 leading-relaxed bg-pink-50/60 p-3.5 rounded-2xl border border-pink-100">
              Gagarin shahrida mualliflik guldastalari va yangi gullar do'koni. 24/7 bepul yetkazib berish xizmati mavjud!
            </p>

            {/* Contact Details List */}
            <div className="space-y-2.5 text-xs font-medium">
              {/* Phone */}
              <a
                href="tel:+998903949933"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-pink-50/50 transition"
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
                  <div className="text-xs font-bold text-gray-800">Gagarin sh., Markaziy ko'chasi 14-uy</div>
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
                href="https://www.instagram.com/nastarin_gullari.gagarin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-xs font-bold text-white shadow-md transition hover:opacity-90"
              >
                <Instagram className="h-4 w-4" />
                <span>Instagram</span>
              </a>
              <a
                href="https://t.me/nastarin_gullari.gagarin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#2AABEE] px-4 py-3 text-xs font-bold text-white shadow-md transition hover:opacity-90"
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
