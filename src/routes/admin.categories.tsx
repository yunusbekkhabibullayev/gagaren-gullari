import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  useAdminCategories,
  type Category,
  saveCategoryOverride,
  deleteCategoryOverride,
} from "@/lib/categories";
import { useProducts } from "@/lib/products";
import * as LucideIcons from "lucide-react";
import {
  Folder,
  Plus,
  Search,
  Check,
  Edit2,
  Trash2,
  ArrowUpDown,
  LayoutGrid,
  List,
  Eye,
  Tag,
  Layers,
  Box,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategoriesPage,
});

function DynIcon({
  name,
  size = 20,
  className = "",
}: {
  name: string | null;
  size?: number;
  className?: string;
}) {
  if (!name) return <Folder size={size} className={className} />;
  const Icon = (
    LucideIcons as Record<string, React.ComponentType<{ size?: number; className?: string }>>
  )[name as string];
  if (!Icon) return <Folder size={size} className={className} />;
  return <Icon size={size} className={className} />;
}

type Draft = Partial<Category>;

function AdminCategoriesPage() {
  const qc = useQueryClient();
  const { data: categories = [], isLoading } = useAdminCategories();
  const { data: products = [] } = useProducts();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [editing, setEditing] = useState<Draft | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filtered Categories
  const filtered = useMemo(() => {
    return categories.filter((c) => {
      const s = (search ?? "").toLowerCase();
      const matchSearch =
        (c.name ?? "").toLowerCase().includes(s) || (c.slug ?? "").toLowerCase().includes(s);

      if (filter === "active") return matchSearch && c.active;
      if (filter === "inactive") return matchSearch && !c.active;
      return matchSearch;
    });
  }, [categories, search, filter]);

  // Save (Create or Edit) Mutation
  const saveMutation = useMutation({
    mutationFn: async (d: Draft) => {
      const slug =
        d.slug?.trim() ||
        (d.name ?? "")
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

      const row = {
        name: d.name!.trim(),
        slug,
        icon: d.icon?.trim() || "Folder",
        color: d.color || "#e0526c",
        order_index: d.order_index ?? categories.length,
        active: d.active ?? true,
      };

      let resultId = d.id;

      try {
        if (d.id) {
          const { error } = await supabase.from("categories").update(row).eq("id", d.id);
          if (error) console.warn("Supabase update error:", error);
        } else {
          const { data, error } = await supabase.from("categories").insert(row).select().single();
          if (error) console.warn("Supabase insert error:", error);
          if (data) resultId = data.id;
        }
      } catch (err) {
        console.warn("Supabase categories save failed, using local update fallback:", err);
      }

      const savedCat: Category = {
        id: resultId || d.id || `cat_${Date.now()}`,
        name: row.name,
        slug: row.slug,
        icon: row.icon,
        color: row.color,
        order_index: row.order_index,
        active: row.active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      saveCategoryOverride(savedCat);

      return savedCat;
    },
    onSuccess: (saved) => {
      qc.setQueryData<Category[]>(["admin-categories"], (old = []) => {
        const index = old.findIndex((c) => c.id === saved.id || c.slug === saved.slug);
        if (index >= 0) {
          const updated = [...old];
          updated[index] = saved;
          return updated;
        }
        return [...old, saved];
      });
      qc.setQueryData<Category[]>(["categories"], (old = []) => {
        const index = old.findIndex((c) => c.id === saved.id || c.slug === saved.slug);
        if (index >= 0) {
          const updated = [...old];
          updated[index] = saved;
          return updated;
        }
        return [...old, saved];
      });
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      setEditing(null);
    },
    onError: (err: Error) => alert("Xatolik: " + err.message),
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) console.warn("Supabase delete error:", error);
      } catch (err) {
        console.warn("Supabase categories delete failed, using local fallback:", err);
      }
      deleteCategoryOverride(id);
      return id;
    },
    onSuccess: (id) => {
      qc.setQueryData<Category[]>(["admin-categories"], (old = []) =>
        old.filter((c) => c.id !== id),
      );
      qc.setQueryData<Category[]>(["categories"], (old = []) => old.filter((c) => c.id !== id));
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      setDeletingId(null);
    },
    onError: (err: Error) => alert("Xatolik: " + err.message),
  });

  // Toggle Active Mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      try {
        const { error } = await supabase.from("categories").update({ active }).eq("id", id);
        if (error) console.warn("Supabase toggle active error:", error);
      } catch (err) {
        console.warn("Supabase toggle active failed, using local fallback:", err);
      }
      const existing = categories.find((c) => c.id === id);
      if (existing) {
        saveCategoryOverride({ ...existing, active });
      }
      return { id, active };
    },
    onSuccess: ({ id, active }) => {
      qc.setQueryData<Category[]>(["admin-categories"], (old = []) =>
        old.map((c) => (c.id === id ? { ...c, active } : c)),
      );
      qc.setQueryData<Category[]>(["categories"], (old = []) =>
        old.map((c) => (c.id === id ? { ...c, active } : c)),
      );
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const activeCount = categories.filter((c) => c.active).length;
  const inactiveCount = categories.filter((c) => !c.active).length;

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle Banner */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-sm">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-2xl tracking-tight">
                Katalog Toifalari
              </h1>
              <p className="text-sm font-medium text-slate-500">
                Do'kon toifalari va ularga biriktirilgan mahsulotlar boshqaruvi
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setEditing({
                name: "",
                slug: "",
                icon: "Folder",
                color: "#e0526c",
                order_index: categories.length,
                active: true,
              })
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-[#e0526c] px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-200 hover:bg-[#ce425b] transition"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Yangi toifa</span>
          </button>
        </div>
      </div>

      {/* Top 4 Summary KPI Filter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`text-left rounded-3xl border p-5 shadow-sm flex items-center justify-between transition ${
            filter === "all"
              ? "border-[#e0526c] bg-rose-50/40 ring-2 ring-rose-200 shadow-md"
              : "border-slate-200/80 bg-white hover:border-slate-300"
          }`}
        >
          <div>
            <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              JAMI TOIFALAR
            </div>
            <div className="mt-1 text-2xl font-extrabold text-slate-900">
              {categories.length} ta
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
            <Folder className="h-5 w-5" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilter("active")}
          className={`text-left rounded-3xl border p-5 shadow-sm flex items-center justify-between transition ${
            filter === "active"
              ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-200 shadow-md"
              : "border-slate-200/80 bg-white hover:border-slate-300"
          }`}
        >
          <div>
            <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              FAOL TOIFALAR
            </div>
            <div className="mt-1 text-2xl font-extrabold text-emerald-600">{activeCount} ta</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilter("inactive")}
          className={`text-left rounded-3xl border p-5 shadow-sm flex items-center justify-between transition ${
            filter === "inactive"
              ? "border-slate-400 bg-slate-100/60 ring-2 ring-slate-200 shadow-md"
              : "border-slate-200/80 bg-white hover:border-slate-300"
          }`}
        >
          <div>
            <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              NOFAOL TOIFALAR
            </div>
            <div className="mt-1 text-2xl font-extrabold text-slate-500">{inactiveCount} ta</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <XCircle className="h-5 w-5" />
          </div>
        </button>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              BIRIKTIRILGAN TOVARLAR
            </div>
            <div className="mt-1 text-2xl font-extrabold text-[#e0526c]">
              {products.length} ta tovar
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-[#e0526c]">
            <Box className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filter Tabs */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Toifa nomi yoki ID bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:border-[#e0526c] focus:bg-white transition"
          />
        </div>

        {/* Filter Pills & View Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1 text-xs font-bold">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-xl px-3 py-1.5 transition ${
                filter === "all"
                  ? "bg-[#e0526c] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Barchasi {categories.length}
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`rounded-xl px-3 py-1.5 transition ${
                filter === "active"
                  ? "bg-[#e0526c] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Faol {activeCount}
            </button>
            <button
              onClick={() => setFilter("inactive")}
              className={`rounded-xl px-3 py-1.5 transition ${
                filter === "inactive"
                  ? "bg-[#e0526c] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Nofaol {inactiveCount}
            </button>
          </div>

          <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-xl p-2 transition ${
                viewMode === "grid"
                  ? "bg-rose-50 text-[#e0526c]"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`rounded-xl p-2 transition ${
                viewMode === "table"
                  ? "bg-rose-50 text-[#e0526c]"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or Table List */}
      {isLoading ? (
        <div className="grid min-h-[300px] place-items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Folder className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-base font-bold text-slate-800">Toifa topilmadi</h3>
          <p className="mt-1 text-xs text-slate-500">
            Qidiruv bo'yicha hech qanday toifa mos kelmadi
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((cat) => {
            const catProductCount = products.filter(
              (p) =>
                p.category?.toLowerCase() === (cat.name || "").toLowerCase() ||
                p.category?.toLowerCase() === (cat.slug || "").toLowerCase(),
            ).length;

            return (
              <div
                key={cat.id}
                className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm"
                      style={{ background: cat.color || "#e85d4a" }}
                    >
                      <DynIcon name={cat.icon} size={22} />
                    </div>
                    <button
                      onClick={() =>
                        toggleActiveMutation.mutate({ id: cat.id, active: !cat.active })
                      }
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        cat.active
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${cat.active ? "bg-emerald-500" : "bg-slate-400"}`}
                      />
                      {cat.active ? "Faol" : "Nofaol"}
                    </button>
                  </div>

                  <h3 className="mt-4 font-bold text-slate-900 text-lg">{cat.name}</h3>
                  <div className="text-xs font-mono text-slate-400">#{cat.slug}</div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {catProductCount} ta tovar
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditing(cat)}
                      className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(cat.id)}
                      className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-4">TARTIB</th>
                  <th className="px-6 py-4">BELGI</th>
                  <th className="px-6 py-4">TOIFA NOMI</th>
                  <th className="px-6 py-4">SLUG</th>
                  <th className="px-6 py-4">HOLATI</th>
                  <th className="px-6 py-4 text-right">AMALLAR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((cat, idx) => (
                  <tr key={cat.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 text-slate-400 font-bold">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm"
                        style={{ background: cat.color || "#e85d4a" }}
                      >
                        <DynIcon name={cat.icon} size={18} />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{cat.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{cat.slug}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                          cat.active
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${cat.active ? "bg-emerald-500" : "bg-slate-400"}`}
                        />
                        {cat.active ? "Faol" : "Nofaol"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setEditing(cat)}
                        className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 transition inline-block"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(cat.id)}
                        className="rounded-xl p-2 text-red-600 hover:bg-red-50 transition inline-block"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Create Modal Dialog */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="flex flex-col w-full max-w-lg max-h-[90vh] rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-[#e0526c]">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {editing.id ? "Toifani tahrirlash" : "Yangi toifa qo'shish"}
                </h3>
              </div>
              <button
                onClick={() => setEditing(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm flex-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Toifa nomi
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Uy gullari"
                  value={editing.name ?? ""}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = name
                      .toLowerCase()
                      .replace(/ʻ|ʼ|'/g, "")
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "")
                      .replace(/-+/g, "-");
                    let autoIcon = editing.icon || "Folder";
                    const n = name.toLowerCase();
                    if (n.includes("buket") || n.includes("gul")) autoIcon = "Flower2";
                    else if (n.includes("atirgul") || n.includes("sevgi")) autoIcon = "Heart";
                    else if (n.includes("tuvak") || n.includes("simlik")) autoIcon = "Leaf";
                    else if (n.includes("sovga") || n.includes("to'plam")) autoIcon = "Gift";
                    else if (n.includes("choy") || n.includes("ziynat")) autoIcon = "Sparkles";

                    setEditing({
                      ...editing,
                      name,
                      slug: autoSlug,
                      icon: autoIcon,
                    });
                  }}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#e0526c] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Slug (URL identifikatori)
                </label>
                <input
                  type="text"
                  placeholder="uy-gullari"
                  value={editing.slug ?? ""}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#e0526c] focus:bg-white transition"
                />
              </div>

              {/* Icon & Color Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Icon tanlash
                  </label>
                  <span className="text-xs font-bold text-[#e0526c] flex items-center gap-1">
                    Tanlangan: <DynIcon name={editing.icon || "Folder"} size={16} />{" "}
                    {editing.icon || "Folder"}
                  </span>
                </div>

                {/* Icon Grid Picker */}
                <div className="grid grid-cols-6 gap-2 p-2 rounded-2xl bg-slate-50 border border-slate-200/80">
                  {[
                    "Flower2",
                    "Folder",
                    "Heart",
                    "Leaf",
                    "Gift",
                    "Sparkles",
                    "Package",
                    "Sun",
                    "Tag",
                    "Layers",
                    "Box",
                    "CheckCircle2",
                  ].map((icName) => {
                    const isSelected = (editing.icon || "Folder") === icName;
                    return (
                      <button
                        key={icName}
                        type="button"
                        onClick={() => setEditing({ ...editing, icon: icName })}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition border ${
                          isSelected
                            ? "border-[#e0526c] bg-white text-[#e0526c] shadow-sm ring-2 ring-rose-100"
                            : "border-transparent text-slate-500 hover:bg-white hover:text-slate-900"
                        }`}
                      >
                        <DynIcon name={icName} size={18} />
                        <span className="mt-1 text-[9px] font-semibold truncate w-full text-center">
                          {icName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Rang (Color Hex)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editing.color || "#e0526c"}
                    onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                    className="h-10 w-14 cursor-pointer rounded-xl border border-slate-200 p-1 bg-white"
                  />
                  <input
                    type="text"
                    value={editing.color || "#e0526c"}
                    onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium outline-none focus:border-[#e0526c]"
                  />
                </div>
              </div>

              {/* Faol Holati */}
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <div>
                  <div className="text-sm font-bold text-slate-900">Faol holati</div>
                  <div className="text-xs text-slate-500">Mijozlar uchun do'konda ko'rinadi</div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditing({ ...editing, active: !(editing.active ?? true) })}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    (editing.active ?? true) ? "bg-[#e0526c]" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      (editing.active ?? true) ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 p-5 bg-slate-50/50 shrink-0">
              <button
                onClick={() => setEditing(null)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => saveMutation.mutate(editing)}
                disabled={saveMutation.isPending || !editing.name?.trim()}
                className="rounded-2xl bg-[#e0526c] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-200 hover:bg-[#ce425b] disabled:opacity-50 transition"
              >
                {saveMutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-[#e0526c]">
              <Trash2 className="h-7 w-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Toifani o'chirish</h3>
            <p className="text-xs text-slate-500">
              Ushbu toifani o'chirmoqchimisiz? Amalni ortga qaytarib bo'lmaydi.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Yo'q
              </button>
              <button
                onClick={() => deleteMutation.mutate(deletingId)}
                disabled={deleteMutation.isPending}
                className="rounded-2xl bg-[#e0526c] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-200 hover:bg-[#ce425b] transition"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
