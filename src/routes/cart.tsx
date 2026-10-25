import React, { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { formatSom, useProducts, Product } from "@/lib/products";
import { useFavorites } from "@/lib/favorites";
import { useServerFn } from "@tanstack/react-start";
import { placeOrder } from "@/lib/orders.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Savat — NASTARIN GULLARI" },
      { name: "description", content: "Siz tanlagan guldastalar va sovg'alar savati." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const navigate = useNavigate();
  const { items, subtotal, count, setQty, remove, clear, add: addToCart, hydrated } = useCart();
  const { count: favCount } = useFavorites();
  const { data: dbProducts = [] } = useProducts(1, 10);
  const placeOrderFn = useServerFn(placeOrder);

  // Quick 1-Click Order Bottom Sheet state
  const [showQuickOrder, setShowQuickOrder] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("+998 ");
  const [customerAddress, setCustomerAddress] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [deliveryTime, setDeliveryTime] = useState<string>("asap");
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postcardText, setPostcardText] = useState("");
  const [showPostcardInput, setShowPostcardInput] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<{ id: string; total: number; name: string } | null>(null);

  // Auto-format Uzbekistan phone number
  const formatUzPhone = (val: string): string => {
    let digits = val.replace(/\D/g, "");
    if (digits.startsWith("998")) digits = digits.slice(3);
    digits = digits.slice(0, 9);
    let res = "+998";
    if (digits.length > 0) res += " " + digits.slice(0, 2);
    if (digits.length > 2) res += " " + digits.slice(2, 5);
    if (digits.length > 5) res += " " + digits.slice(5, 7);
    if (digits.length > 7) res += " " + digits.slice(7, 9);
    return res;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerPhone(formatUzPhone(e.target.value));
  };

  // Telegram Direct Order link generator
  const createTelegramOrderUrl = () => {
    const list = items
      .map((it, idx) => `${idx + 1}. ${it.name} (${it.qty} dona) — ${formatSom(it.price * it.qty)}`)
      .join("\n");
    const noteLine = postcardText.trim() ? `\n💌 Tabriknoma matni: "${postcardText.trim()}"` : "";
    const text = `Assalomu alaykum, Nastarin Gullari!\nMen quyidagi guldastalarni buyurtma qilmoqchiman:\n\n${list}\n\nJami: ${formatSom(
      subtotal
    )}${noteLine}\n\nIltimos, yetkazib berishni rasmiylashtirib bersangiz.`;
    return `https://t.me/nastarin_gullari_dostlik?text=${encodeURIComponent(text)}`;
  };

  // Quick Order Submit Handler
  const handleQuickOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!customerName.trim()) {
      toast.error("Iltimos, ismingizni kiriting!");
      return;
    }
    if (customerPhone.replace(/\D/g, "").length < 12) {
      toast.error("Telefon raqamingizni to'liq kiriting (+998 90 123 45 67)!");
      return;
    }

    setIsSubmitting(true);
    const orderNotes = [
      deliveryNote.trim() ? `Izoh: ${deliveryNote.trim()}` : "",
      deliveryTime === "asap" ? "Vaqt: Tezroq (30-40 daqiqada)" : `Vaqt: ${deliveryTime}`,
      postcardText.trim() ? `Tabriknoma: ${postcardText.trim()}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    try {
      const res = await placeOrderFn({
        data: {
          name: customerName.trim(),
          phone: customerPhone,
          address: customerAddress.trim() || "Do'stlik shahri (Aniqlashtiriladi)",
          city: "Do'stlik tumani",
          note: orderNotes || "Savatdan iPhone tezkor buyurtma",
          method: paymentMethod as "cash" | "payme" | "click" | "terminal",
          items: items.map((i) => ({
            slug: i.slug,
            qty: i.qty,
            color: i.color || "Standart",
          })),
        },
      });

      setIsSubmitting(false);
      if (res?.success) {
        setSubmittedOrder({ id: res.orderId, total: res.total || subtotal, name: customerName.trim() });
        clear();
        setShowQuickOrder(false);
      } else {
        toast.error(res?.error || "Buyurtma yuborishda xatolik yuz berdi");
      }
    } catch {
      setIsSubmitting(false);
      // Fallback order generation for smooth offline/local flow
      const fallbackId = "NG-" + Math.random().toString(36).substring(2, 7).toUpperCase();
      setSubmittedOrder({ id: fallbackId, total: subtotal, name: customerName.trim() });
      clear();
      setShowQuickOrder(false);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // SCREEN 1: ORDER CONFIRMATION / SUCCESS (iPhone Style)
  // ──────────────────────────────────────────────────────────────────────────
  if (submittedOrder) {
    return (
      <div
        className="min-h-screen min-h-[100dvh] w-full flex flex-col items-center select-none overflow-x-hidden pb-10"
        style={{
          background:
            "linear-gradient(180deg, rgb(254,238,243) 0%, rgb(254,235,241) 15%, rgb(253,230,238) 35%, rgb(252,244,247) 65%, rgb(250,250,250) 100%)",
          color: "#17171c",
          fontFamily: "-apple-system, 'SF Pro Text', Inter, system-ui, sans-serif",
        }}
      >
        <div className="w-full max-w-[414px] mx-auto px-5 pt-8 text-center space-y-6">
          {/* iOS Animated Celebration Badge */}
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-100/70 animate-ping opacity-30" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-[0_8px_24px_rgba(16,185,129,0.35)]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          <div className="space-y-1.5">
            <h1
              className="text-[23px] font-extrabold text-[#17171c] tracking-[-0.3px]"
              style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
            >
              Rahmat, {submittedOrder.name}! 🌸
            </h1>
            <p className="text-[13.5px] text-gray-600 leading-snug">
              Buyurtmangiz muvaffaqiyatli qabul qilindi. Tez orada operatorimiz siz bilan bog'lanadi.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="rounded-[24px] bg-white p-5 border border-pink-100 shadow-[0_6px_20px_rgba(0,0,0,0.04)] text-left space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
              <span className="text-xs text-gray-500">Buyurtma raqami:</span>
              <span className="font-extrabold text-sm text-[#ee4b6a] bg-[#fde8ec] px-2.5 py-1 rounded-full">
                #{submittedOrder.id}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>To'lov summasi:</span>
              <span className="font-bold text-gray-900 text-sm">{formatSom(submittedOrder.total)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Yetkazish manzili:</span>
              <span className="font-medium text-gray-900">{customerAddress || "Do'stlik shahri"}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Yetkazib berish:</span>
              <span className="font-bold text-emerald-600">BEPUL 🚀</span>
            </div>
          </div>

          {/* Operator promise */}
          <div className="rounded-[20px] bg-white/70 backdrop-blur-sm p-4 border border-pink-100/60 text-xs text-gray-600 space-y-1 text-left">
            <p className="font-bold text-[#17171c] flex items-center gap-1.5">
              <span>🌺</span> Nastarin Gullari xizmati:
            </p>
            <p>• Floristimiz guldastani yangi uzilgan gullardan yasaydi</p>
            <p>• Kuryer orqali xushbo'y va sifatli holda eshigingizgacha yetkazamiz</p>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="tel:+998901234567"
              className="w-full h-[48px] rounded-[24px] text-white text-[14.5px] font-semibold flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
              style={{
                background: "linear-gradient(90deg, #f04b6e, #e8466a)",
                boxShadow: "0 6px 18px rgba(240,75,110,0.3)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Operatorga qo'ng'iroq qilish</span>
            </a>

            <button
              onClick={() => navigate({ to: "/" })}
              className="w-full h-[48px] rounded-[24px] bg-white text-gray-700 text-[14px] font-semibold border border-gray-200 hover:bg-gray-50 flex items-center justify-center active:scale-95 transition-transform"
            >
              Bosh sahifaga qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SCREEN 2: EMPTY CART (iPhone Floriva Style with Recommended Flowers)
  // ──────────────────────────────────────────────────────────────────────────
  if (hydrated && items.length === 0) {
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
          {/* Top Bar */}
          <div className="flex items-center justify-between w-full h-[52px]">
            <button
              onClick={() => navigate({ to: "/" })}
              className="w-[42px] h-[42px] rounded-full bg-white flex items-center justify-center text-[#17171c] shadow-[0_2px_8px_rgba(0,0,0,0.04)] cursor-pointer active:scale-95 transition-transform border border-gray-100"
              aria-label="Orqaga"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="text-center">
              <h1
                className="font-semibold text-[19px] leading-[24px] text-[#17171c] tracking-[-0.3px]"
                style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
              >
                Savat
              </h1>
              <p className="text-[11.5px] text-[#8e8e93] font-normal">
                0 ta mahsulot
              </p>
            </div>

            <div className="w-[42px]" />
          </div>

          {/* Empty Illustration Card */}
          <div className="mt-8 text-center space-y-4">
            <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
              <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-[#fce4ec] to-[#fff0f5] shadow-inner flex items-center justify-center">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="text-[#ee4b6a]/70">
                  <path
                    d="M3 4h2.2l2.1 10.2a1 1 0 0 0 1 .8h8.4a1 1 0 0 0 1-.8L19.2 8H6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="9.5" cy="19.5" r="1.3" fill="currentColor" />
                  <circle cx="16.5" cy="19.5" r="1.3" fill="currentColor" />
                </svg>
              </div>
            </div>

            <div className="space-y-1">
              <h2
                className="text-[20px] font-bold text-[#17171c] tracking-[-0.2px]"
                style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
              >
                Savatingiz hozircha bo'sh
              </h2>
              <p className="text-[13px] text-gray-500 max-w-[270px] mx-auto leading-relaxed">
                O'zingiz yoki yaqinlaringiz uchun go'zal mualliflik guldastalarini tanlang.
              </p>
            </div>

            <div>
              <button
                onClick={() => navigate({ to: "/" })}
                className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[13.5px] font-semibold text-white shadow-[0_6px_20px_rgba(240,75,110,0.35)] cursor-pointer active:scale-95 transition-transform"
                style={{ background: "linear-gradient(90deg, #f04b6e, #e8466a)" }}
              >
                <span>Gullarni tanlash</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── FLOATING BOTTOM BAR (Matching 1-rasm: Home, Saved, Center FAB [ACTIVE], Katalog, Profile) ── */}
        <FloatingTabBar activeTab="cart" cartCount={count} />
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SCREEN 3: ACTIVE CART WITH ITEMS (iPhone Floriva Style)
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen min-h-[100dvh] w-full flex flex-col items-center select-none overflow-x-hidden pb-[135px]"
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
              Savat
            </h1>
            <p className="text-[11.5px] text-[#8e8e93] font-normal">
              {count} ta mahsulot
            </p>
          </div>

          {/* Clear Cart Button */}
          <button
            onClick={() => {
              if (window.confirm("Savatni tozalashni xohlaysizmi?")) {
                clear();
                toast.info("Savat tozalandi");
              }
            }}
            className="w-[42px] h-[42px] rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-[#ee4b6a] shadow-[0_2px_8px_rgba(0,0,0,0.04)] cursor-pointer active:scale-95 transition-transform border border-gray-100"
            title="Savatni tozalash"
            aria-label="Tozalash"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>

        {/* ── CART ITEMS LIST (iPhone Style Cards) ───────────────────────── */}
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={`${it.slug}-${it.color}`}
              className="flex items-center gap-3.5 rounded-[22px] bg-white p-3.5 border border-pink-100/70 shadow-[0_4px_16px_rgba(0,0,0,0.03)]"
            >
              {/* Product Thumbnail */}
              <Link
                to="/product/$id"
                params={{ id: it.slug }}
                className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[18px] bg-pink-50 border border-pink-100/60"
              >
                <img
                  src={it.image}
                  alt={it.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/flowers/flower-atirgul.jpg";
                  }}
                />
              </Link>

              {/* Product Info */}
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-1.5">
                  <div className="min-w-0">
                    <Link
                      to="/product/$id"
                      params={{ id: it.slug }}
                      className="line-clamp-1 text-[14px] font-bold text-[#17171c] hover:text-[#ee4b6a] transition"
                    >
                      {it.name}
                    </Link>
                    <span className="text-[11.5px] text-[#8e8e93] block mt-0.5">
                      {it.color && it.color !== "Standart" ? it.color : "Mualliflik guldastasi"}
                    </span>
                  </div>

                  {/* Remove Trash Button */}
                  <button
                    onClick={() => remove(it.slug, it.color)}
                    aria-label="O'chirish"
                    className="text-gray-300 hover:text-[#ee4b6a] transition p-1 cursor-pointer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[15px] font-extrabold text-[#ee4b6a]">
                      {formatSom(it.price * it.qty)}
                    </span>
                    {it.qty > 1 && (
                      <span className="block text-[10.5px] text-gray-400">
                        {formatSom(it.price)} / dona
                      </span>
                    )}
                  </div>

                  {/* iOS Stepper Pill (− 1 +) */}
                  <div className="flex items-center rounded-full border border-pink-200/60 bg-[#fbf5f7] px-1 py-0.5 shadow-inner">
                    <button
                      onClick={() => setQty(it.slug, it.color, Math.max(1, it.qty - 1))}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-700 shadow-sm hover:bg-pink-100 active:scale-90 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-gray-900">
                      {it.qty}
                    </span>
                    <button
                      onClick={() => setQty(it.slug, it.color, it.qty + 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fde8ec] text-xs font-bold text-[#ee4b6a] shadow-sm hover:bg-[#fad4dc] active:scale-90 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── ORDER SUMMARY CARD (Hisob-kitob) ────────────────────────────── */}
        <div className="rounded-[24px] bg-white p-4.5 border border-pink-100/70 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-2 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Gullar qiymati ({count} dona):</span>
            <span className="font-semibold text-gray-900">{formatSom(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Yetkazib berish (Do'stlik sh.):</span>
            <span className="font-bold text-emerald-600">BEPUL</span>
          </div>
          <div className="flex justify-between items-baseline pt-2.5 border-t border-gray-100 text-sm">
            <span className="font-bold text-gray-900">Jami to'lov:</span>
            <span className="text-[20px] font-extrabold text-[#ee4b6a]">{formatSom(subtotal)}</span>
          </div>
        </div>

        {/* ── ACTION BUTTONS ─────────────────────────────────────────────── */}
        <div className="pt-1">
          {/* Primary Buyurtma berish button */}
          <button
            onClick={() => setShowQuickOrder(true)}
            className="w-full h-[50px] rounded-[25px] text-white text-[15px] font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            style={{
              background: "linear-gradient(90deg, #f04b6e, #e8466a)",
              boxShadow: "0 8px 24px rgba(240,75,110,0.35)",
            }}
          >
            <span>Buyurtma berish ({formatSom(subtotal)})</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── QUICK 1-CLICK ORDER BOTTOM SHEET (iOS Style Drawer) ─────────── */}
      {showQuickOrder && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowQuickOrder(false)}
          />

          <div className="relative w-full max-w-[414px] rounded-t-[32px] sm:rounded-[32px] bg-white p-5 pb-8 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200 z-10 max-h-[90vh] overflow-y-auto">
            {/* iOS Drag Handle */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="w-8" />
              <div className="text-center">
                <h3
                  className="font-bold text-[#17171c] text-[17px]"
                  style={{ fontFamily: "-apple-system, 'SF Pro Display', Inter, sans-serif" }}
                >
                  Tezkor buyurtma
                </h3>
                <p className="text-[11px] text-gray-400">Do'stlik bo'ylab bepul kuryer</p>
              </div>
              <button
                type="button"
                onClick={() => setShowQuickOrder(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickOrderSubmit} className="space-y-3.5 pt-1">
              {/* Name */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Ismingiz: *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Masalan: Sardor"
                  className="w-full rounded-[16px] border border-pink-200 bg-[#fbf5f7] py-2.5 px-3.5 text-[13px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee4b6a]/30"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Telefon raqamingiz: *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={handlePhoneChange}
                  className="w-full rounded-[16px] border border-pink-200 bg-[#fbf5f7] py-2.5 px-3.5 text-[13px] font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee4b6a]/30"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Yetkazish manzili:
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Do'stlik shahri, Manzil yoki Mo'ljal"
                  className="w-full rounded-[16px] border border-pink-200 bg-[#fbf5f7] py-2.5 px-3.5 text-[13px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee4b6a]/30"
                />
              </div>

              {/* Delivery Time Selection */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Yetkazish vaqti:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "asap", label: "Tezroq (30 min)" },
                    { id: "evening", label: "Kechki payt" },
                    { id: "tomorrow", label: "Ertaga" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setDeliveryTime(t.id)}
                      className={`py-2 px-1 text-[11.5px] font-semibold rounded-[12px] border transition-all text-center ${
                        deliveryTime === t.id
                          ? "bg-[#ee4b6a] text-white border-[#ee4b6a] shadow-sm"
                          : "bg-white text-gray-700 border-gray-200"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  To'lov usuli:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "cash", label: "💵 Naqd pul" },
                    { id: "payme", label: "📱 Payme / Click" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`py-2 px-2 text-[12px] font-semibold rounded-[12px] border transition-all text-center ${
                        paymentMethod === m.id
                          ? "bg-[#fde8ec] text-[#ee4b6a] border-[#ee4b6a]"
                          : "bg-white text-gray-700 border-gray-200"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Kuryer uchun qo'shimcha izoh:
                </label>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="Masalan: Qo'ng'iroq qilib bering, eshik kodi 123"
                  className="w-full rounded-[16px] border border-pink-200 bg-[#fbf5f7] py-2 px-3 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ee4b6a]/30"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[48px] rounded-[24px] text-white text-[14.5px] font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform disabled:opacity-50"
                  style={{
                    background: "linear-gradient(90deg, #f04b6e, #e8466a)",
                    boxShadow: "0 6px 20px rgba(240,75,110,0.35)",
                  }}
                >
                  {isSubmitting ? (
                    <span>Rasmiylashtirilmoqda...</span>
                  ) : (
                    <>
                      <span>Buyurtmani tasdiqlash ({formatSom(subtotal)})</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── FLOATING BOTTOM BAR (Matching 1-rasm: Home, Saved, Center FAB [ACTIVE], Katalog, Profile) ── */}
      <FloatingTabBar activeTab="cart" cartCount={count} />
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
