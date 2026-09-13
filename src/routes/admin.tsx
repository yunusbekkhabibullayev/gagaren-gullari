import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useIsAdmin, clearAdminSession } from "@/lib/auth";
import { SplashLoader } from "@/routes/auth";
import {
  BarChart2,
  ShoppingBag,
  Package,
  Tag,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Flower2,
  Shield,
  User as UserIcon,
  ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Gagaren Gullari — Do'kon Boshqaruvi" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { isAdmin, loading, user } = useIsAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    setMobileOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  if (loading) {
    return <SplashLoader />;
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#FAF7F6] px-5 text-center">
        <div className="max-w-md rounded-3xl border border-rose-100 bg-white p-8 shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDF2F4] text-[#e0526c]">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-slate-900">Ruxsat yo'q</h2>
          <p className="mt-2 text-sm text-slate-500">Ushbu hisobda admin roli mavjud emas.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="rounded-full bg-[#e0526c] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#ce425b] transition"
            >
              Qayta yuklash
            </button>
            <button
              onClick={async () => {
                await clearAdminSession();
                navigate({ to: "/auth" });
              }}
              className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Chiqish
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navGroups = [
    {
      title: "ASOSIY",
      items: [
        { label: "Statistika", to: "/admin", exact: true, icon: BarChart2 },
        { label: "Buyurtmalar", to: "/admin/orders", icon: ShoppingBag },
      ],
    },
    {
      title: "KATALOG & MARKETING",
      items: [
        { label: "Mahsulotlar", to: "/admin/products", icon: Package },
        { label: "Kategoriyalar", to: "/admin/categories", icon: Tag },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white border-r border-slate-200/80">
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e0526c] text-white shadow-md shadow-rose-200">
          <Flower2 className="h-6 w-6 stroke-[2.2]" />
        </div>
        <div className="min-w-0">
          <div className="truncate font-extrabold text-slate-900 text-base font-display">
            Gagaren Gullari
          </div>
          <div className="text-[10px] font-black tracking-widest text-[#e0526c] uppercase">
            DO'KON BOSHQARUVI
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <div className="px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2.5">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === "/admin" || location.pathname === "/admin/"
                  : location.pathname.startsWith(item.to);

                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    activeOptions={{ exact: item.exact }}
                    className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-bold transition ${
                      isActive
                        ? "bg-[#e0526c] text-white shadow-md shadow-rose-200"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="h-4 w-4 text-white/80" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer Status */}
      <div className="border-t border-slate-100 p-4 bg-slate-50/50">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span className="flex items-center gap-1.5 font-bold text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Dastyor v2.2.52
          </span>
          <span className="text-slate-400">Online</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F6] font-sans text-slate-800 antialiased flex">
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden lg:block w-64 shrink-0 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw]">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Right Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 backdrop-blur">
          {/* Left: Mobile Menu Toggle & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2 font-black text-slate-900 text-sm sm:text-base tracking-wider uppercase">
              <span className="hidden sm:inline-block h-2.5 w-2.5 rounded-full bg-[#e0526c]" />
              <span>DO'KON BOSHGARUVI</span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-sm"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">Saytga qaytish</span>
            </Link>

            <span className="hidden sm:inline text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              UZ 🇺🇿
            </span>

            {/* User Profile Dropdown */}
            <div className="relative border-l border-slate-200 pl-3">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 rounded-full p-1 hover:bg-slate-100 transition"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e0526c] text-white font-bold text-sm shadow-md shadow-rose-200">
                  A
                </div>
                <div className="hidden md:block text-left leading-tight pr-1">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[140px]">
                    Admin
                  </div>
                  <div className="text-[10px] font-bold text-[#e0526c] tracking-wider uppercase">
                    ADMIN
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 hidden md:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-3xl border border-slate-100 bg-white p-4 shadow-2xl z-50 space-y-3">
                  <div className="border-b border-slate-100 pb-3 text-left">
                    <div className="font-bold text-slate-900 text-sm">
                      Admin
                    </div>
                    <div className="text-xs text-[#e0526c] font-bold">Admin</div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</div>
                  </div>

                  <div className="space-y-1 text-left text-xs font-bold">
                    <button
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 transition"
                    >
                      <UserIcon className="h-4 w-4 text-slate-400" />
                      <span>Profil ma'lumotlari</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setLogoutConfirmOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-[#e0526c] hover:bg-rose-50 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Chiqish</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal Dialog */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-[#e0526c] border border-rose-100">
              <LogOut className="h-7 w-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Tizimdan chiqish</h3>
            <p className="text-xs font-medium text-slate-500">
              Haqiqatan ham admin panelidan chiqmoqchimisiz?
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setLogoutConfirmOpen(false)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Yo'q
              </button>
              <button
                onClick={async () => {
                  setLogoutConfirmOpen(false);
                  await clearAdminSession();
                  navigate({ to: "/auth" });
                }}
                className="rounded-2xl bg-[#e0526c] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#ce425b]"
              >
                Chiqish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}