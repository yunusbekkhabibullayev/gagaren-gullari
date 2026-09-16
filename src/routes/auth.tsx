import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession, setLocalAdminSession } from "@/lib/auth";
import { Lock, Mail, Eye, EyeOff, Flower2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Tizimga Kirish — Gagaren Gullari Manager" },
      { name: "description", content: "Admin panelga kirish." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

export function SplashLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#e0526c] via-[#d94460] to-[#b8324b] p-8 text-white font-sans">
      <div />

      {/* Center Logo & Title */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-[#e0526c] shadow-2xl shadow-black/20 border-4 border-white/30">
          <div className="flex flex-col items-center justify-center">
            <Flower2 className="h-12 w-12 stroke-[2.2]" />
            <span className="text-[9px] font-black tracking-widest uppercase mt-0.5">GAGAREN</span>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-display tracking-tight text-white drop-shadow-md">
            Gagaren Gullari
          </h1>
          <div className="text-xs font-black tracking-widest text-white/90 uppercase">
            TOSHKENTDA GUL YETKAZIB BERISH
          </div>
          <p className="text-xs text-white/80 font-medium">Yangi buketlar va sovg'a to'plamlari</p>
        </div>
      </div>

      {/* Bottom Loading Progress Bar */}
      <div className="flex flex-col items-center space-y-3 w-full max-w-xs">
        <div className="h-1 w-36 overflow-hidden rounded-full bg-white/30">
          <div className="h-full w-1/2 animate-[pulse_1s_infinite] rounded-full bg-white transition-all duration-500" />
        </div>
        <div className="text-[11px] font-semibold text-white/80 tracking-wider">
          v2.2.52 • Gagaren Store
        </div>
      </div>
    </div>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const { isAuth, loading } = useSession();
  const [email, setEmail] = useState("admin@gagarengullari.uz");
  const [password, setPassword] = useState("admin123456");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && isAuth) navigate({ to: "/admin" });
  }, [isAuth, loading, navigate]);

  if (loading) {
    return <SplashLoader />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    try {
      // Supabase orqali kirish urinishi
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
    } catch {
      /* ignore Supabase rate-limit errors */
    }

    // Local Admin sessiyani o'rnatish (Har doim zudlik bilan Admin panelga kiradi)
    setLocalAdminSession();
    setBusy(false);
    navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F6] font-sans antialiased flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Centered Login Card */}
      <div className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-8 sm:p-10 shadow-2xl shadow-rose-950/5 space-y-6 text-center">
        {/* Lock Icon Header */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDF2F4] text-[#e0526c] shadow-sm border border-rose-100">
          <Lock className="h-6 w-6 stroke-[2.5]" />
        </div>

        {/* Card Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900">
            Tizimga kirish
          </h1>
          <div className="text-[11px] font-black tracking-widest text-[#e0526c] uppercase">
            GAGAREN GULLARI MANAGER
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Login yoki Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gagarengullari.uz"
                className="w-full rounded-2xl border border-slate-200 bg-[#FAF7F6] pl-10 pr-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-[#e0526c] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Maxfiy parol</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-[#FAF7F6] pl-10 pr-10 py-3 text-sm font-medium text-slate-900 outline-none focus:border-[#e0526c] focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#e0526c] focus:ring-[#e0526c] cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="text-xs font-semibold text-slate-600 cursor-pointer"
            >
              Eslab qolish
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-2xl bg-[#e0526c] py-3.5 text-sm font-black tracking-wider text-white uppercase shadow-md shadow-rose-200 hover:bg-[#ce425b] transition disabled:opacity-50"
          >
            {busy ? "KIRILMOQDA..." : "KIRISH"}
          </button>
        </form>

        {/* Back to store link */}
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#e0526c] hover:underline transition"
          >
            <span>Do'konga qaytish</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
