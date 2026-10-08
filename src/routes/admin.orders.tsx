import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatSom } from "@/lib/products";
import {
  ShoppingBag,
  Search,
  ExternalLink,
  Eye,
  X,
  MapPin,
  Phone,
  User,
  Send,
  Bot,
} from "lucide-react";
import {
  getSavedTelegramChatId,
  saveTelegramChatId,
  autoDetectTelegramChatId,
  sendTelegramOrderNotification,
} from "@/lib/telegram";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
});

type Order = {
  id: string;
  code: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  customer_city: string | null;
  notes: string | null;
  payment_method: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  items: OrderItem[];
  delivery_date: string | null;
  delivery_time: string | null;
  created_at: string;
};

type OrderItem = {
  name?: string;
  title?: string;
  quantity?: number;
  qty?: number;
  price?: number;
  color?: string;
};

const statusMap: Record<string, { label: string; bg: string; text: string }> = {
  new: { label: "Kutilmoqda", bg: "bg-amber-50", text: "text-amber-600" },
  pending: { label: "Kutilmoqda", bg: "bg-amber-50", text: "text-amber-600" },
  preparing: { label: "Tayyorlanmoqda", bg: "bg-blue-50", text: "text-blue-600" },
  ready: { label: "Tayyorlandi", bg: "bg-teal-50", text: "text-teal-600" },
  delivering: { label: "Yo'lda", bg: "bg-purple-50", text: "text-purple-600" },
  completed: { label: "Yetkazildi", bg: "bg-emerald-50", text: "text-emerald-600" },
  delivered: { label: "Yetkazildi", bg: "bg-emerald-50", text: "text-emerald-600" },
  cancelled: { label: "Bekor qilingan", bg: "bg-red-50", text: "text-red-600" },
};

function AdminOrdersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [telegramChatId, setTelegramChatId] = useState(() => getSavedTelegramChatId() || "");
  const [telegramTesting, setTelegramTesting] = useState(false);
  const [telegramStatusMsg, setTelegramStatusMsg] = useState<string | null>(null);
  const [purgeDays, setPurgeDays] = useState(30);

  const deleteOldOrdersMutation = useMutation({
    mutationFn: async () => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - purgeDays);

      const { data, error } = await supabase
        .from("orders")
        .delete()
        .lt("created_at", cutoff.toISOString())
        .select("id");

      if (error) throw error;
      return data ?? [];
    },
    onSuccess: (deletedOrders) => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      alert(`${deletedOrders.length} ta eski buyurtma o'chirildi.`);
    },
    onError: (err: Error) => {
      alert("Eski buyurtma tarixini o'chirishda xatolik: " + err.message);
    },
  });

  const handleClearOldOrders = () => {
    const confirmed = window.confirm(
      `${purgeDays} kundan eski buyurtmalar tarixini o'chirishni xohlaysizmi? Bu amal qaytarib bo'lmaydi.`,
    );

    if (!confirmed) return;
    deleteOldOrdersMutation.mutate();
  };

  const handleSaveTelegramChatId = (val: string) => {
    setTelegramChatId(val);
    saveTelegramChatId(val);
    setTelegramStatusMsg("✓ Chat ID saqlandi!");
    setTimeout(() => setTelegramStatusMsg(null), 3000);
  };

  const handleAutoDetectTelegram = async () => {
    setTelegramTesting(true);
    setTelegramStatusMsg("Bot xabarlari tekshirilmoqda...");
    const detected = await autoDetectTelegramChatId();
    setTelegramTesting(false);
    if (detected) {
      setTelegramChatId(detected);
      setTelegramStatusMsg(`✓ Chat ID aniqlandi: ${detected}`);
    } else {
      setTelegramStatusMsg(
        "⚠️ Chat ID topilmadi. Avval Telegram botingizga /start bosing va qayta bosing!",
      );
    }
  };

  const handleSendTestTelegram = async () => {
    if (!telegramChatId) {
      alert("Iltimos, avval Chat ID kiriting yoki Auto-detect bosing!");
      return;
    }
    setTelegramTesting(true);
    const ok = await sendTelegramOrderNotification({
      orderId: "TEST-001",
      customerName: "Test Mijoz",
      customerPhone: "+998 99 000 00 00",
      customerCity: "Do'stlik tumani",
      customerAddress: "Do'stlik shahri, Markaziy ko'cha",
      paymentMethod: "cash",
      note: "Test xabari — Telegram Bot ulanganini tekshirish",
      subtotal: 150000,
      shipping: 0,
      total: 150000,
      items: [{ name: "Oq Pion Buketi", color: "Oq", qty: 1, price: 150000 }],
    });
    setTelegramTesting(false);
    if (ok) {
      setTelegramStatusMsg("✅ Test xabari Telegram botga muvaffaqiyatli yuborildi!");
    } else {
      setTelegramStatusMsg("❌ Xabar yuborishda xatolik. Chat ID tog'riligini tekshiring.");
    }
  };

  const ordersQuery = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data ?? []) as unknown as Order[];
    },
  });

  const orders = ordersQuery.data ?? [];

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      if (selectedOrder) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: prev.status } : null));
      }
    },
    onError: (err: Error) => alert("Xatolik: " + err.message),
  });

  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "new" || o.status === "pending").length,
      preparing: orders.filter((o) => o.status === "preparing").length,
      ready: orders.filter((o) => o.status === "ready").length,
      delivering: orders.filter((o) => o.status === "delivering").length,
      completed: orders.filter((o) => o.status === "completed" || o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  const statusValues = [
    ["all", "Barchasi", counts.all],
    ["new", "Yangi", counts.pending],
    ["preparing", "Tayyorlanmoqda", counts.preparing],
    ["ready", "Tayyor", counts.ready],
    ["delivering", "Yo'lda", counts.delivering],
    ["completed", "Yetkazildi", counts.completed],
    ["cancelled", "Bekor qilingan", counts.cancelled],
  ] as const;

  // Filtered Orders (Xavfsiz va crash bermaydigan qilib tuzatilgan)
  const filtered = useMemo(() => {
    const searchLower = (search ?? "").toLowerCase();

    return orders.filter((o) => {
      const code = (o.code ?? "").toLowerCase();
      const name = (o.customer_name ?? "").toLowerCase();
      const phone = o.customer_phone ?? "";
      const address = (o.customer_address ?? "").toLowerCase();

      const matchSearch =
        code.includes(searchLower) ||
        name.includes(searchLower) ||
        phone.includes(search) ||
        address.includes(searchLower);

      if (!matchSearch) return false;
      if (selectedStatus === "all") return true;
      return o.status === selectedStatus;
    });
  }, [orders, search, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-sm">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-2xl tracking-tight">BUYURTMALAR</h1>
              <p className="text-sm font-medium text-slate-500">
                Xaridorlar buyurtmalari va yetkazib berish holati
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-2xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700">
              Jami buyurtmalar: {orders.length} ta
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Eski buyurtmalar tarixini tozalash</h2>
            <p className="text-xs text-slate-500">
              Tanlangan kundan eski buyurtmalar avtomatik ravishda o'chiriladi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={purgeDays}
              onChange={(e) => setPurgeDays(Number(e.target.value))}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-red-400"
            >
              <option value={7}>7 kun</option>
              <option value={30}>30 kun</option>
              <option value={60}>60 kun</option>
              <option value={90}>90 kun</option>
              <option value={180}>180 kun</option>
            </select>

            <button
              type="button"
              onClick={handleClearOldOrders}
              disabled={deleteOldOrdersMutation.isPending}
              className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleteOldOrdersMutation.isPending ? "O'chirilmoqda..." : "Eski tarixni o'chirish"}
            </button>
          </div>
        </div>
      </div>

      {/* Telegram Bot Notification Card */}
      <div className="rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-50/80 via-indigo-50/40 to-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-md shadow-sky-200">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Telegram Bot Bildirishnomasi</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Bot Ulangan
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Yangi buyurtma tushganda avtomatik Telegram botingizga xabar boradi.
              </p>
            </div>
          </div>

          {/* Controls: Chat ID input + Auto Detect + Test Send */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Telegram Chat ID"
                value={telegramChatId}
                onChange={(e) => handleSaveTelegramChatId(e.target.value)}
                className="w-44 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold outline-none focus:border-sky-500 shadow-sm transition"
              />
            </div>

            <button
              onClick={handleAutoDetectTelegram}
              disabled={telegramTesting}
              className="rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
              title="Telegram botingizga yozgan foydalanuvchidan Chat ID topish"
            >
              🔍 Auto-detect
            </button>

            <button
              onClick={handleSendTestTelegram}
              disabled={telegramTesting}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-sky-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-sky-200 hover:bg-sky-600 disabled:opacity-50 transition"
            >
              {telegramTesting ? "Yuborilmoqda..." : "Test xabar"}
            </button>
          </div>
        </div>

        {telegramStatusMsg && (
          <p className="mt-4 text-xs font-medium text-slate-700">{telegramStatusMsg}</p>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {statusValues.map(([value, label, count]) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedStatus(String(value))}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                selectedStatus === value
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buyurtma raqami, ism, telefon yoki manzil bo'yicha qidiring"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-red-400"
            />
          </div>
        </div>
      </div>

      {/* Orders list */}
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-600">Buyurtma topilmadi</p>
          </div>
        ) : (
          filtered.map((order) => (
            <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                      {order.code || order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusMap[order.status]?.bg ?? "bg-slate-100"} ${statusMap[order.status]?.text ?? "text-slate-700"}`}>
                      {statusMap[order.status]?.label ?? order.status}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {new Date(order.created_at).toLocaleString("uz-UZ")}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-4 w-4 text-slate-400" />
                      {order.customer_name || "Noma'lum"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-slate-400" />
                      {order.customer_phone || "-"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {order.customer_city || "-"}
                    </span>
                    <span className="text-slate-500">{order.customer_address || "Manzil joylashtirilmagan"}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:items-end">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Umumiy summa</p>
                    <p className="text-lg font-extrabold text-slate-900">{order.total.toLocaleString("uz-UZ")} so'm</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Ko'rish
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const next = prompt("Yangi statusni kiriting (new, preparing, ready, delivering, completed, cancelled):", order.status);
                        if (!next) return;
                        updateStatusMutation.mutate({ id: order.id, status: next.trim() });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Buyurtma tafsilotlari</p>
                <h3 className="mt-1 text-xl font-extrabold text-slate-900">{selectedOrder.code || selectedOrder.id.slice(0, 8)}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Mijoz</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{selectedOrder.customer_name || "Noma'lum"}</p>
                <p className="mt-1 text-sm text-slate-600">{selectedOrder.customer_phone || "Telefon ko'rsatilmagan"}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Manzil</p>
                <p className="mt-2 text-sm text-slate-700">{selectedOrder.customer_city || "-"}</p>
                <p className="mt-1 text-sm text-slate-600">{selectedOrder.customer_address || "Manzil ko'rsatilmagan"}</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Buyurtma tarkibi</p>
                <span className="text-sm font-bold text-slate-900">{(selectedOrder.items ?? []).length} ta mahsulot</span>
              </div>

              <div className="mt-4 space-y-3">
                {(selectedOrder.items ?? []).map((item, idx) => (
                  <div key={`${item.name ?? "item"}-${idx}`} className="flex items-center justify-between gap-4 rounded-xl bg-white p-3">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{item.name || item.title || "Mahsulot"}</p>
                      <p className="text-xs text-slate-500">{item.color || "Rang ko'rsatilmagan"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Miqdor: {item.quantity ?? item.qty ?? 1}</p>
                      <p className="text-sm font-bold text-slate-900">
                        {((item.price ?? 0) * (item.quantity ?? item.qty ?? 1)).toLocaleString("uz-UZ")} so'm
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">To'lov usuli</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{selectedOrder.payment_method || "-"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Umumiy summa</p>
                <p className="text-lg font-extrabold text-slate-900">{selectedOrder.total.toLocaleString("uz-UZ")} so'm</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
