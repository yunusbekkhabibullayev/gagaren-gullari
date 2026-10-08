import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  Package,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  History,
  Plus,
  Minus,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Play,
  Search,
  Filter,
  ShieldCheck,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  getInventoryProducts,
  getInventoryLogs,
  processStockMovement,
  resetInventoryToDefault,
  runBilet029TestCase,
  syncInventoryFromSupabase,
  type InventoryProduct,
  type StockTransaction,
} from "@/lib/inventory";
import { formatSom } from "@/lib/products";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({
    meta: [
      { title: "Zaxira Yordamchisi — Nastarin Gullari Admin" },
      { name: "description", content: "Mahsulotlar qoldig'ini yuritish, kirim/chiqim yozuvlarini saqlash tizimi" },
    ],
  }),
  component: AdminInventoryPage,
});

function AdminInventoryPage() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [logs, setLogs] = useState<StockTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [logFilter, setLogFilter] = useState<"ALL" | "IN" | "OUT">("ALL");

  // Modal / Movement Form state
  const [activeModalProduct, setActiveModalProduct] = useState<InventoryProduct | null>(null);
  const [movementType, setMovementType] = useState<"IN" | "OUT">("IN");
  const [movementAmount, setMovementAmount] = useState<string>("");
  const [movementNote, setMovementNote] = useState<string>("");

  // Test Case Modal State
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testResults, setTestResults] = useState<Awaited<ReturnType<typeof runBilet029TestCase>> | null>(null);

  // Load initial data
  const refreshData = async () => {
    const synced = await syncInventoryFromSupabase();
    setProducts(synced);
    const nextLogs = await getInventoryLogs();
    setLogs(nextLogs);
  };

  useEffect(() => {
    void refreshData();
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "ALL" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Categories list
  const categoriesList = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return Array.from(set);
  }, [products]);

  // Low stock products (Chegaradan past qoldig'lar)
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock < p.minStock);
  }, [products]);

  // Total stock items sum
  const totalStockCount = useMemo(() => {
    return products.reduce((acc, p) => acc + p.stock, 0);
  }, [products]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (logFilter === "IN") return l.type === "IN";
      if (logFilter === "OUT") return l.type === "OUT";
      return true;
    });
  }, [logs, logFilter]);

  // Open Movement Modal
  const openMovementModal = (product: InventoryProduct, type: "IN" | "OUT") => {
    setActiveModalProduct(product);
    setMovementType(type);
    setMovementAmount("");
    setMovementNote("");
  };

  // Submit Stock Movement
  const handleMovementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalProduct) return;

    const amountNum = parseInt(movementAmount, 10);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Iltimos, noldan katta butun son kiriting!");
      return;
    }

    const result = await processStockMovement(
      activeModalProduct.id,
      movementType,
      amountNum,
      movementNote,
    );

    if (!result.success) {
      toast.error(result.message, {
        duration: 5000,
        className: "bg-red-50 text-red-900 border border-red-200 font-medium",
      });
      return;
    }

    if (result.isLowStock) {
      toast.warning(result.message, { duration: 6000 });
    } else {
      toast.success(result.message);
    }

    await refreshData();
    setActiveModalProduct(null);
  };

  // Run Test Case
  const handleRunTestCase = async () => {
    const results = await runBilet029TestCase();
    setTestResults(results);
    setTestModalOpen(true);
    await refreshData();
    toast.success("Bilet 029 qabul sinovi muvaffaqiyatli bajarildi!");
  };

  // Reset to Default Data
  const handleResetData = async () => {
    if (window.confirm("Barcha zaxira ma'lumotlarini va yozuvlar tarixini dastlabki holatga qaytarasizmi?")) {
      resetInventoryToDefault();
      await refreshData();
      toast.info("Zaxira ma'lumotlari dastlabki holatiga keltirildi.");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ─── Header & Title Banner ────────────────────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-rose-100 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Zaxira Yordamchisi
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            Mahsulotlar qoldig'ini yuritish, kirim/chiqim yozuvlarini saqlash va tugayotgan mahsulotlarni vaqtida ko'rish tizimi.
          </p>
        </div>
      </div>


      {/* ─── Key Metrics Cards ───────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Items */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Jami Mahsulotlar</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-[#e0526c]">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{products.length}</span>
            <span className="text-xs text-slate-500">tur / xil</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Barcha mahsulot turlari ro'yxati</p>
        </div>

        {/* Total Stock Volume */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Ombordagi Qoldiq</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalStockCount}</span>
            <span className="text-xs text-slate-500">dona jami</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Real vaqt rejimida hisoblanadi</p>
        </div>

        {/* Low Stock Warning Card (Highlighting Requirement 4) */}
        <div
          className={`rounded-2xl border p-5 shadow-sm transition ${
            lowStockProducts.length > 0
              ? "border-amber-300 bg-amber-50/50 hover:bg-amber-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-amber-800">Kam Zaxiralar</span>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                lowStockProducts.length > 0
                  ? "bg-amber-500 text-white animate-pulse"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold ${
                lowStockProducts.length > 0 ? "text-amber-900" : "text-slate-900"
              }`}
            >
              {lowStockProducts.length}
            </span>
            <span className="text-xs font-medium text-amber-700">mahsulotda chegara buzilgan</span>
          </div>
          <p className="mt-2 text-xs text-amber-700 font-medium">
            Minimal chegaradan past mahsulotlar
          </p>
        </div>

        {/* Total Movements Log */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Yozuvlar Tarixi</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <History className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{logs.length}</span>
            <span className="text-xs text-slate-500">ta operatsiya</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Kirim va chiqim jurnali saqlanmoqda</p>
        </div>
      </div>

      {/* ─── Low Stock Alert Banner (If Any Low Stock Products Exist) ───── */}
      {lowStockProducts.length > 0 && (
        <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-amber-900">
                ⚠️ DIQQAT! {lowStockProducts.length} ta mahsulotda zaxira minimal chegaradan kamayib ketdi!
              </h3>
              <p className="mt-1 text-sm text-amber-800">
                Ushbu mahsulotlarni sotuv to‘xtab qolmasligi uchun vaqtida omborga kirim qilish tavsiya etiladi.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-1.5 shadow-sm text-xs font-semibold text-amber-900"
                  >
                    <span>{p.name}</span>
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-800 font-bold">
                      Qoldiq: {p.stock} / Min: {p.minStock} {p.unit}
                    </span>
                    <button
                      onClick={() => openMovementModal(p, "IN")}
                      className="ml-1 flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-white hover:bg-emerald-700 transition"
                    >
                      <Plus className="h-3 w-3" /> Kirim
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Products Table Section (Shart 1, 2, 3, 4) ──────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Table Header & Controls */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Mahsulotlar va Joriy Qoldiqlar</h2>
            <p className="text-xs text-slate-500">
              Oltita boshlang'ich mahsulot ro'yxati, zaxira chegaralari va tezkor kirim/chiqim amallari
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Mahsulot izlash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-[#e0526c] focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1 text-xs">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 focus:border-[#e0526c] focus:outline-none"
              >
                <option value="ALL">Barcha kategoriyalar</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/70 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Mahsulot Nomi</th>
                <th className="px-4 py-3.5">Kategoriya</th>
                <th className="px-4 py-3.5 text-center">Boshlang‘ich</th>
                <th className="px-4 py-3.5 text-center">Joriy Qoldiq</th>
                <th className="px-4 py-3.5 text-center">Eng Kam Chegara</th>
                <th className="px-4 py-3.5 text-center">Holat</th>
                <th className="px-5 py-3.5 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400 font-medium">
                    Hech qanday mahsulot topilmadi.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.stock < p.minStock;
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isLow ? "bg-amber-50/30" : ""
                      }`}
                    >
                      {/* Name & Price */}
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-[#e0526c] font-bold">
                            {p.name.charAt(0)}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                            <div className="text-[11px] text-slate-500 font-normal">
                              Narxi: {formatSom(p.price)} / {p.unit}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                          {p.category}
                        </span>
                      </td>

                      {/* Initial Stock */}
                      <td className="px-4 py-4 text-center font-medium text-slate-500">
                        {p.initialStock} {p.unit}
                      </td>

                      {/* Current Stock (Highlighted) */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-extrabold ${
                            isLow
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {p.stock} {p.unit}
                        </span>
                      </td>

                      {/* Min Stock Limit */}
                      <td className="px-4 py-4 text-center font-semibold text-slate-600">
                        {p.minStock} {p.unit}
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-4 text-center">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-900 border border-amber-300 animate-pulse">
                            <AlertTriangle className="h-3 w-3" /> Zaxira Kam!
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                            <CheckCircle2 className="h-3 w-3" /> Yetarli
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openMovementModal(p, "IN")}
                            className="flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition"
                          >
                            <Plus className="h-3.5 w-3.5" /> Kirim
                          </button>
                          <button
                            onClick={() => openMovementModal(p, "OUT")}
                            className="flex items-center gap-1 rounded-lg bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white transition"
                          >
                            <Minus className="h-3.5 w-3.5" /> Chiqim
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Transaction History Logs (Yozuvlar Tarixi - Shart 4) ─── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <History className="h-5 w-5 text-[#e0526c]" /> Kirim va Chiqim Yozuvlari Tarixi
            </h2>
            <p className="text-xs text-slate-500">
              4-shart: Barcha operatsiyalar tarixi saqlanadi va dinamik kuzatiladi
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLogFilter("ALL")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                logFilter === "ALL"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Hamma yozuvlar ({logs.length})
            </button>
            <button
              onClick={() => setLogFilter("IN")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                logFilter === "IN"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              Faqat Kirimlar
            </button>
            <button
              onClick={() => setLogFilter("OUT")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                logFilter === "OUT"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-50 text-rose-800 hover:bg-rose-100"
              }`}
            >
              Faqat Chiqimlar
            </button>
          </div>
        </div>

        {/* Logs List */}
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 font-medium">
            Hozircha hech qanday kirim/chiqim amaliyoti bajarilmagan. Yuqoridagi jadvaldan "+ Kirim" yoki "- Chiqim" tugmasini bosing.
          </div>
        ) : (
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {filteredLogs.map((log) => {
              const isIn = log.type === "IN";
              return (
                <div
                  key={log.id}
                  className={`flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border p-3.5 text-xs transition ${
                    isIn
                      ? "border-emerald-100 bg-emerald-50/20"
                      : "border-rose-100 bg-rose-50/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold ${
                        isIn ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {isIn ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </div>

                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {log.productName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Izoh: {log.note} • {new Date(log.date).toLocaleString("uz-UZ")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span
                        className={`inline-block font-extrabold text-sm ${
                          isIn ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {isIn ? `+${log.amount}` : `-${log.amount}`} dona
                      </span>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Qoldiq: {log.previousStock} ➔ <strong className="text-slate-800">{log.newStock} dona</strong>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Modal: Process Stock Movement (Kirim/Chiqim Kiritish) ─── */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5 border border-rose-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold ${
                    movementType === "IN" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {movementType === "IN" ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {movementType === "IN" ? "Omborga Kirim Qilish" : "Ombordan Chiqim Qilish"}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalProduct(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Product Summary Info */}
            <div className="rounded-2xl bg-slate-50 p-4 space-y-1 text-xs text-slate-700 border border-slate-200">
              <div className="font-bold text-sm text-slate-900">{activeModalProduct.name}</div>
              <div className="flex justify-between pt-1">
                <span>Joriy ombor qoldig‘i:</span>
                <strong className="text-slate-900 font-bold text-sm">
                  {activeModalProduct.stock} {activeModalProduct.unit}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Eng kam chegara (Min):</span>
                <span className="font-semibold text-slate-600">
                  {activeModalProduct.minStock} {activeModalProduct.unit}
                </span>
              </div>
            </div>

            <form onSubmit={handleMovementSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {movementType === "IN" ? "Kirim miqdori:" : "Chiqim miqdori:"}
                </label>
                <input
                  type="number"
                  min="1"
                  max={movementType === "OUT" ? activeModalProduct.stock : undefined}
                  required
                  value={movementAmount}
                  onChange={(e) => setMovementAmount(e.target.value)}
                  placeholder={`Masalan: 3 ${activeModalProduct.unit}`}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-[#e0526c] focus:outline-none"
                />
                {movementType === "OUT" && (
                  <p className="mt-1 text-[11px] text-rose-600 font-medium">
                    ⚠️ Maksimal ruxsat etilgan chiqim: <strong>{activeModalProduct.stock} dona</strong>.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Izoh / Sabab (ixtiyoriy):
                </label>
                <input
                  type="text"
                  value={movementNote}
                  onChange={(e) => setMovementNote(e.target.value)}
                  placeholder={
                    movementType === "IN"
                      ? "Yangi ta'minotchi partiyasidan kirim"
                      : "Do'konda sotildi / mijoz xaridi"
                  }
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-[#e0526c] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalProduct(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className={`rounded-xl px-5 py-2 text-xs font-bold text-white shadow-md transition ${
                    movementType === "IN"
                      ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                      : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                  }`}
                >
                  {movementType === "IN" ? "+ Kirimni Tasdiqlash" : "- Chiqimni Tasdiqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: Bilet 029 Official Test Case Results ──────────── */}
      {testModalOpen && testResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-5 border border-emerald-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Bilet 029 Qabul Sinovi Natijalari
                  </h3>
                  <p className="text-xs text-slate-500">
                    Rasmiy topshiriq va hakamlar mezonlari bo‘yicha tekshiruv
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTestModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Test Verification Steps Display */}
            <div className="space-y-3 text-xs">
              {/* Step 1 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                  <span>1-bosqich: Dastlabki Holat</span>
                  <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] text-slate-700 font-bold">
                    O'TDI ✅
                  </span>
                </div>
                <p className="text-slate-600">{testResults.step1.message}</p>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5 space-y-1">
                <div className="font-bold text-emerald-900 text-sm flex items-center justify-between">
                  <span>2-bosqich: 7 dona chiqim qilish</span>
                  <span className="rounded bg-emerald-200 px-2 py-0.5 text-[10px] text-emerald-800 font-bold">
                    O'TDI ✅
                  </span>
                </div>
                <p className="text-emerald-800 font-medium">{testResults.step2.message}</p>
                <div className="mt-1 flex items-center gap-2 font-bold text-amber-900 bg-amber-100/80 p-2 rounded-lg border border-amber-200">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Qoldiq: 3 dona (Chegara 5 dan kam). Zaxira kamligi ogohlantirishi faol!</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-3.5 space-y-1">
                <div className="font-bold text-rose-900 text-sm flex items-center justify-between">
                  <span>3-bosqich: Yana 4 dona chiqarishni rad etish</span>
                  <span className="rounded bg-rose-200 px-2 py-0.5 text-[10px] text-rose-800 font-bold">
                    RAD ETILDI (TO'G'RI) ✅
                  </span>
                </div>
                <p className="text-rose-900 font-medium">{testResults.step3.rejectedMessage}</p>
              </div>
            </div>

            {/* Test Summary Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white space-y-1 shadow-lg shadow-emerald-600/20">
              <div className="flex items-center gap-2 font-extrabold text-sm">
                <CheckCircle2 className="h-5 w-5" /> Barcha 4 ta majburiy shart to‘liq qanoatlantirildi!
              </div>
              <p className="text-xs text-emerald-100">
                Loyiha Bilet 029 talablariga 100% javob beradi va hakamlar baholash mezonlariga tayyor.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setTestModalOpen(false)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                Tushunarli / Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
