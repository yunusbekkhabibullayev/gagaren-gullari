import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import logoImg from "@/assets/logo.png";

export function SiteHeader() {
  const { count, hydrated } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 sm:flex sm:justify-between">
        {/* Logo */}
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <img
            src={logoImg}
            alt="Gagaren Gullari logo"
            className="h-10 w-10 shrink-0 object-contain"
          />
          <span className="truncate font-display text-lg font-semibold tracking-tight">
            Gagaren Gullari
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground sm:flex">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-foreground" }}
            className="transition hover:text-foreground"
          >
            Bosh sahifa
          </Link>
          <Link
            to="/catalog"
            activeProps={{ className: "text-foreground" }}
            className="transition hover:text-foreground"
          >
            Katalog
          </Link>
          <a href="#hunar" className="transition hover:text-foreground">
            Yetkazib berish
          </a>
        </nav>

        {/* Right side: phone + cart */}
        <div className="flex items-center gap-3">
          {/* Phone button — desktop */}
          <a
            href="tel:+998990000000"
            className="hidden items-center gap-2 rounded-full bg-[color:var(--terracotta)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 sm:inline-flex"
          >
            <IconPhone />
            <span>+998 99 000 00 00</span>
          </a>

          {/* Cart button — desktop */}
          <Link
            to="/cart"
            aria-label="Savat"
            className="relative hidden shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-secondary sm:inline-flex"
          >
            <IconBag />
            <span>Savat</span>
            {hydrated && count > 0 && (
              <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-foreground px-1.5 text-[11px] font-semibold text-background">
                {count}
              </span>
            )}
          </Link>

          {/* Phone button — mobile only (shown in header on small screens) */}
          <a
            href="tel:+998990000000"
            aria-label="Qo'ng'iroq qilish"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--terracotta)] text-white shadow-sm transition hover:opacity-90 sm:hidden"
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
  const item =
    "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] text-muted-foreground transition";
  const active = "text-foreground";
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] sm:hidden"
      aria-label="Mobil navigatsiya"
    >
      <div className="mx-auto flex max-w-md">
        <Link
          to="/"
          activeOptions={{ exact: true }}
          activeProps={{ className: active }}
          className={item}
        >
          <IconHome /> Bosh
        </Link>
        <Link
          to="/catalog"
          activeProps={{ className: active }}
          className={item}
        >
          <IconGrid /> Katalog
        </Link>
        <Link
          to="/cart"
          activeProps={{ className: active }}
          className={`${item} relative`}
        >
          <span className="relative">
            <IconBag />
            {hydrated && count > 0 && (
              <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background">
                {count}
              </span>
            )}
          </span>
          Savat
        </Link>
        <a href="#aloqa" className={item}>
          <IconUser /> Aloqa
        </a>
      </div>
    </nav>
  );
}

function IconHome() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>
  );
}
function IconGrid() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
  );
}
function IconUser() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>
  );
}
function IconBag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>
  );
}
function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.92a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92Z"/></svg>
  );
}