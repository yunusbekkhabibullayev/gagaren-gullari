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
  items: any[];
  delivery_date: string | null;
  delivery_time: string | null;
  created_at: string;
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
      setTelegramStatusMsg("⚠️ Chat ID topilmadi. Avval Telegram botingizga /start bosing va qayta bosing!");
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
      customerCity: "Mirzacho'l tumani",
      customerAddress: "Gagarin shahri, Markaziy ko'cha",
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
      return (data ?? []) as Order[];
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

  // Filtered Orders (Xavfsiz va crash bermaydigan qilib tuzatilgan)
  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase();

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
              <Send className="h-3.5 w-3.5" />
              <span>{telegramTesting ? "Yuborilmoqda..." : "Test Xabar"}</span>
            </button>
          </div>
        </div>

        {telegramStatusMsg && (
          <div className="mt-3 text-xs font-semibold text-sky-900 bg-sky-100/70 rounded-xl px-3.5 py-2">
            {telegramStatusMsg}
          </div>
        )}
      </div>

      {/* Controls Bar: Search & Status Tabs */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Mijoz ismi, ID (#34), telefon yoki manzil..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:border-red-600 focus:bg-white transition"
            />
          </div>

          {/* Date Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider mr-1">Sana:</span>
            <button className="rounded-xl bg-slate-900 px-3 py-1.5 text-white shadow-sm">Barchasi</button>
            <button className="rounded-xl bg-slate-100 px-3 py-1.5 hover:bg-slate-200 transition">Bugun</button>
            <button className="rounded-xl bg-slate-100 px-3 py-1.5 hover:bg-slate-200 transition">Kecha</button>
            <button className="rounded-xl bg-slate-100 px-3 py-1.5 hover:bg-slate-200 transition">Bu hafta</button>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 no-scrollbar">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`rounded-2xl px-4 py-2 text-xs font-bold shrink-0 transition ${
              selectedStatus === "all"
                ? "bg-red-600 text-white shadow-md shadow-red-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Barchasi {counts.all}
          </button>
          <button
            onClick={() => setSelectedStatus("pending")}
            className={`rounded-2xl px-4 py-2 text-xs font-bold shrink-0 transition ${
              selectedStatus === "pending"
                ? "bg-amber-500 text-white shadow-md"
                : "bg-amber-50 text-amber-600 hover:bg-amber-100"
            }`}
          >
            Kutilmoqda {counts.pending}
          </button>
          <button
            onClick={() => setSelectedStatus("preparing")}
            className={`rounded-2xl px-4 py-2 text-xs font-bold shrink-0 transition ${
              selectedStatus === "preparing"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
            }`}
          >
            Tayyorlanmoqda {counts.preparing}
          </button>
          <button
            onClick={() => setSelectedStatus("ready")}
            className={`rounded-2xl px-4 py-2 text-xs font-bold shrink-0 transition ${
              selectedStatus === "ready"
                ? "bg-teal-600 text-white shadow-md"
                : "bg-teal-50 text-teal-600 hover:bg-teal-100"
            }`}
          >
            Tayyorlandi {counts.ready}
          </button>
          <button
            onClick={() => setSelectedStatus("delivering")}
            className={`rounded-2xl px-4 py-2 text-xs font-bold shrink-0 transition ${
              selectedStatus === "delivering"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-purple-50 text-purple-600 hover:bg-purple-100"
            }`}
          >
            Yo'lda {counts.delivering}
          </button>
          <button
            onClick={() => setSelectedStatus("completed")}
            className={`rounded-2xl px-4 py-2 text-xs font-bold shrink-0 transition ${
              selectedStatus === "completed"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            }`}
          >
            Yetkazildi {counts.completed}
          </button>
          <button
            onClick={() => setSelectedStatus("cancelled")}
            className={`rounded-2xl px-4 py-2 text-xs font-bold shrink-0 transition ${
              selectedStatus === "cancelled"
                ? "bg-red-600 text-white shadow-md"
                : "bg-red-50 text-red-600 hover:bg-red-100"
            }`}
          >
            Bekor qilingan {counts.cancelled}
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        {ordersQuery.isLoading ? (
          <div className="grid min-h-[300px] place-items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-base font-bold text-slate-800">Buyurtma topilmadi</h3>
            <p className="mt-1 text-xs text-slate-500">Ushbu mezon bo'yicha hech qanday buyurtma mavjud emas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-4">#ID</th>
                  <th className="px-6 py-4">XARIDOR</th>
                  <th className="px-6 py-4">YETKAZISH MANZILI</th>
                  <th className="px-6 py-4">MAHSULOTLAR</th>
                  <th className="px-6 py-4">JAMI SUMMA</th>
                  <th className="px-6 py-4">HOLATI</th>
                  <th className="px-6 py-4 text-right">AMALLAR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((o) => {
                  const statusInfo = statusMap[o.status] || {
                    label: o.status,
                    bg: "bg-slate-100",
                    text: "text-slate-600",
                  };
                  const itemsSummary = Array.isArray(o.items)
                    ? o.items.map((i) => `${i?.name || i?.title || "Tovar"} (${i?.quantity || 1} dona)`).join(", ")
                    : "Maxsus buyurtma";

                  return (
                    <tr key={o.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <span className="rounded-xl bg-slate-900 px-2.5 py-1 text-xs font-mono font-bold text-white shadow-sm">
                          #{o.code ? o.code.slice(-4) : o.id.slice(0, 4)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{o.customer_name || "Noma'lum"}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" />
                          {o.customer_phone || "Mavjud emas"}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="truncate text-xs font-semibold text-slate-700">
                          {o.customer_city ? `${o.customer_city}, ` : ""}{o.customer_address || "Manzil ko'rsatilmagan"}
                        </div>
                        {o.customer_address && (
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(o.customer_address)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:underline mt-0.5"
                          >
                            <span>Xarita</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="truncate text-xs font-medium text-slate-600" title={itemsSummary}>
                          {itemsSummary}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-slate-900">{formatSom(o.total || 0)}</div>
                        <div className="text-[11px] text-slate-400 capitalize">
                          {o.payment_method === "cash"
                            ? "Naqd pul"
                            : o.payment_method === "card"
                            ? "Karta orqali"
                            : o.payment_method || "Ko'rsatilmagan"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusInfo.bg} ${statusInfo.text}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-400" />
                          <span>Batafsil</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Buyurtma #{selectedOrder.code || selectedOrder.id.slice(0, 6)}
                </h3>
                <div className="text-xs text-slate-400">
                  Sana: {new Date(selectedOrder.created_at).toLocaleString("uz-UZ")}
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <User className="h-4 w-4 text-slate-500" />
                {selectedOrder.customer_name || "Noma'lum mijoz"}
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-semibold">
                <Phone className="h-4 w-4 text-slate-400" />
                {selectedOrder.customer_phone || "Mavjud emas"}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4 text-slate-400" />
                {selectedOrder.customer_city ? `${selectedOrder.customer_city}, ` : ""}{selectedOrder.customer_address || "Manzil yo'q"}
              </div>
            </div>

            {/* Status Changer */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Buyurtma Holatini O'zgartirish
              </label>
              <select
                value={selectedOrder.status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
                  updateStatusMutation.mutate({ id: selectedOrder.id, status: newStatus });
                }}
                className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-bold outline-none focus:border-red-600"
              >
                <option value="new">Kutilmoqda (Yangi)</option>
                <option value="preparing">Tayyorlanmoqda</option>
                <option value="ready">Tayyorlandi</option>
                <option value="delivering">Yo'lda</option>
                <option value="completed">Yetkazildi (Yakunlandi)</option>
                <option value="cancelled">Bekor qilingan</option>
              </select>
            </div>

            {/* Total Payment Info */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm font-bold text-slate-600">Jami summasi:</span>
              <span className="text-xl font-extrabold text-red-600">
                {formatSom(selectedOrder.total || 0)}
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}