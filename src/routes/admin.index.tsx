import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatSom } from "@/lib/products";
import {
  ShoppingBag,
  DollarSign,
  Package,
  Clock,
  RefreshCw,
  Plus,
  BarChart3,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [period, setPeriod] = useState<"7" | "14" | "30">("7");

  const stats = useQuery({
    queryKey: ["admin-stats-full"],
    queryFn: async () => {
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact" }),
        supabase.from("categories").select("id", { count: "exact" }),
        supabase.from("orders").select("id, total, created_at, status"),
      ]);

      const productsCount = productsRes.count ?? 0;
      const categoriesCount = categoriesRes.count ?? 0;
      const orders = ordersRes.data ?? [];
      const totalOrdersCount = orders.length;

      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
      const pendingOrdersCount = orders.filter(
        (o) => o.status === "new" || o.status === "pending",
      ).length;

      return {
        productsCount,
        categoriesCount,
        totalOrdersCount,
        totalRevenue,
        pendingOrdersCount,
        orders,
      };
    },
  });

  const currentDate = new Date().toISOString().slice(0, 16).replace("T", " ");

  // Real chart calculation based on period and actual order data
  const chartData = useMemo(() => {
    const orders = stats.data?.orders ?? [];
    const daysLimit = Number(period);
    const cutoffTime = Date.now() - daysLimit * 86400000;

    const filteredOrders = orders.filter((o) => new Date(o.created_at).getTime() >= cutoffTime);

    const dayNames = [
      { key: 1, label: "Dush", full: "Dushanba" },
      { key: 2, label: "Sesh", full: "Seshanba" },
      { key: 3, label: "Chor", full: "Chorshanba" },
      { key: 4, label: "Pay", full: "Payshanba" },
      { key: 5, label: "Juma", full: "Juma" },
      { key: 6, label: "Shan", full: "Shanba" },
      { key: 0, label: "Yak", full: "Yakshanba" },
    ];

    const dailySums: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    filteredOrders.forEach((o) => {
      const day = new Date(o.created_at).getDay();
      dailySums[day] = (dailySums[day] || 0) + Number(o.total || 0);
    });

    const maxSum = Math.max(...Object.values(dailySums), 1);

    const bars = dayNames.map((d) => {
      const sum = dailySums[d.key] || 0;
      const heightPercent = sum > 0 ? Math.max(15, Math.round((sum / maxSum) * 100)) : 6;
      return {
        label: d.label,
        full: d.full,
        sum,
        heightPercent,
      };
    });

    const periodTotal = filteredOrders.reduce((acc, o) => acc + Number(o.total || 0), 0);
    const dailyAvg = Math.round(periodTotal / daysLimit);
    const aov = filteredOrders.length > 0 ? Math.round(periodTotal / filteredOrders.length) : 0;

    let topDay = bars[0];
    bars.forEach((b) => {
      if (b.sum > topDay.sum) topDay = b;
    });

    return {
      bars,
      periodTotal,
      dailyAvg,
      aov,
      topDay,
    };
  }, [stats.data, period]);

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Do'kon onlayn & faol
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                {currentDate}
              </span>
            </div>
            <h1 className="mt-3 font-extrabold font-display text-slate-900 text-2xl sm:text-3xl tracking-tight">
              XUSH KELIBSIZ, Admin 👋
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Bugungi umumiy savdo va operatsiyalar holati
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => stats.refetch()}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              <RefreshCw
                className={`h-4 w-4 text-slate-500 ${stats.isFetching ? "animate-spin" : ""}`}
              />
              <span>Yangilash</span>
            </button>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#e0526c] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-200 hover:bg-[#ce425b] transition"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Mahsulot qo'shish</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 KPI Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Bugungi Buyurtmalar */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
              BUGUNGI BUYURTMALAR
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-[#e0526c]">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900">
              {stats.data ? `${stats.data.totalOrdersCount} ta` : "0 ta"}
            </div>
            <Link
              to="/admin/orders"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#e0526c] hover:underline"
            >
              <span>Barcha buyurtmalar</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Card 2: Bugungi Tushum */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
              UMUMIY TUSHUM
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {formatSom(stats.data?.totalRevenue ?? 0)}
            </div>
            <div className="mt-3 text-xs font-semibold text-slate-500">
              Jami tushum: {formatSom(stats.data?.totalRevenue ?? 0)}
            </div>
          </div>
        </div>

        {/* Card 3: Katalogdagi Tovarlar */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
              KATALOGDAGI TOVARLAR
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900">
              {stats.data ? `${stats.data.productsCount} ta tovar` : "0 ta tovar"}
            </div>
            <Link
              to="/admin/categories"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline"
            >
              <span>{stats.data?.categoriesCount ?? 0} ta faol toifa</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Card 4: Kutilayotganlar */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
              KUTILAYOTGANLAR
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900">
              {stats.data ? `${stats.data.pendingOrdersCount} ta yangi` : "0 ta yangi"}
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-amber-600">
              <span>Ko'rib chiqish zarur</span>
              <span>⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Graph Block */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-[#e0526c]">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg font-display">
                Savdo Dinamikasi & Tushum Grafigi
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Do'konning kunlik savdo ko'rsatkichlari va tushum tahlili
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1 text-xs font-bold">
            <button
              onClick={() => setPeriod("7")}
              className={`rounded-xl px-3 py-1.5 transition ${
                period === "7"
                  ? "bg-[#e0526c] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              7 kun
            </button>
            <button
              onClick={() => setPeriod("14")}
              className={`rounded-xl px-3 py-1.5 transition ${
                period === "14"
                  ? "bg-[#e0526c] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              14 kun
            </button>
            <button
              onClick={() => setPeriod("30")}
              className={`rounded-xl px-3 py-1.5 transition ${
                period === "30"
                  ? "bg-[#e0526c] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              30 kun
            </button>
          </div>
        </div>

        {/* Dynamic Visual Chart Bars */}
        <div className="h-48 w-full rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-end justify-between gap-2 sm:gap-4">
          {chartData.bars.map((bar, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-2 group h-full justify-end relative"
            >
              {/* Tooltip on Hover */}
              <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg transition shadow-md whitespace-nowrap z-10">
                {bar.full}: {formatSom(bar.sum)}
              </div>

              <div
                style={{ height: `${bar.heightPercent}%` }}
                className="w-full max-w-[36px] rounded-t-xl bg-gradient-to-t from-[#e0526c] to-[#f4728b] group-hover:from-[#ce425b] group-hover:to-[#e0526c] transition-all duration-300 shadow-sm"
              />
              <span className="text-[10px] font-bold text-slate-400">{bar.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom Key Metrics Row dynamically calculated */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              DAVR BO'YICHA JAMI
            </div>
            <div className="mt-1.5 text-lg font-extrabold text-slate-900">
              {formatSom(chartData.periodTotal)}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              KUNLIK O'RTACHA
            </div>
            <div className="mt-1.5 text-lg font-extrabold text-slate-900">
              {formatSom(chartData.dailyAvg)}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              O'RTACHA CHEK (AOV)
            </div>
            <div className="mt-1.5 text-lg font-extrabold text-slate-900">
              {formatSom(chartData.aov)}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              ENG YUQORI KUN
            </div>
            <div className="mt-1.5 text-sm font-bold text-[#e0526c]">
              {chartData.topDay.sum > 0
                ? `${chartData.topDay.full} — ${formatSom(chartData.topDay.sum)}`
                : "Mavjud emas (0 so'm)"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
