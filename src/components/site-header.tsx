import { Link, useRouterState } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import logoImg from "@/assets/logo.png";

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
        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 sm:flex">
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
          <a href="#hunar" className="transition hover:text-[#D84C73]">
            Yetkazib berish
          </a>
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
  const isHome = pathname === "/";

  function handleAloqa(e: React.MouseEvent) {
    e.preventDefault();
    if (isHome) {
      const el = document.getElementById("aloqa");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#aloqa";
    }
  }

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 bg-white pb-[env(safe-area-inset-bottom)] sm:hidden"
      style={{
        borderTop: "1.5px solid #F0E6EB",
        borderRadius: "16px 16px 0 0",
        boxShadow: "0 -4px 24px rgba(216,76,115,0.08)",
      }}
      aria-label="Mobil navigatsiya"
    >
      <div className="flex items-stretch h-16">

        {/* Bosh */}
        <Link
          to="/"
          activeOptions={{ exact: true }}
          className="flex flex-1 flex-col items-center justify-center gap-1"
        >
          <IconHome active={isActive("__home__")} />
          <span className="text-[11px] font-semibold leading-none"
            style={{ color: pathname === "/" ? "#D84C73" : "#9CA3AF" }}>
            Bosh
          </span>
        </Link>

        {/* Katalog */}
        <Link
          to="/catalog"
          className="flex flex-1 flex-col items-center justify-center gap-1"
        >
          <IconGrid active={isActive("/catalog") || pathname.startsWith("/product")} />
          <span className="text-[11px] font-semibold leading-none"
            style={{ color: isActive("/catalog") || pathname.startsWith("/product") ? "#D84C73" : "#9CA3AF" }}>
            Katalog
          </span>
        </Link>

        {/* Savat */}
        <Link
          to="/cart"
          className="flex flex-1 flex-col items-center justify-center gap-1 relative"
        >
          <span className="relative">
            <IconBag active={isActive("/cart")} />
            {hydrated && count > 0 && (
              <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                style={{ background: "#D84C73" }}>
                {count}
              </span>
            )}
          </span>
          <span className="text-[11px] font-semibold leading-none"
            style={{ color: isActive("/cart") ? "#D84C73" : "#9CA3AF" }}>
            Savat
          </span>
        </Link>

        {/* Aloqa */}
        <a
          href="/#aloqa"
          onClick={handleAloqa}
          className="flex flex-1 flex-col items-center justify-center gap-1"
        >
          <IconUser active={false} />
          <span className="text-[11px] font-semibold leading-none" style={{ color: "#9CA3AF" }}>
            Aloqa
          </span>
        </a>

      </div>
    </nav>
  );
}




function IconHome() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}
function IconGrid() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
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
function IconUser() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}
function IconBag() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
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
