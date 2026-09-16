import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  formatSom,
  type Product,
  saveProductOverride,
  deleteProductOverride,
  mergeProductsWithOverrides,
} from "@/lib/products";
import { useAdminCategories } from "@/lib/categories";
import {
  Package,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  Check,
  X,
  Box,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  component: AdminProductsPage,
});

const workshops = ["Mahalliy", "Gollandiya", "Ekvador", "Rishton", "Avtorlik"];

function AdminProductsPage() {
  const qc = useQueryClient();
  const { data: dbCategories = [] } = useAdminCategories();
  const activeCategories = useMemo(() => dbCategories.filter((c) => c.active), [dbCategories]);

  const list = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
        if (error || !data) return mergeProductsWithOverrides([]);
        return mergeProductsWithOverrides(data as Product[]);
      } catch {
        return mergeProductsWithOverrides([]);
      }
    },
  });

  const products = list.data ?? [];
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "in_stock" | "low" | "out">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [editing, setEditing] = useState<Partial<Product> & { colorsText?: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filtered Products
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        (p.name ?? "").toLowerCase().includes((search ?? "").toLowerCase()) ||
        (p.slug ?? "").toLowerCase().includes((search ?? "").toLowerCase());
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;

      if (!matchSearch || !matchCat) return false;
      if (statusFilter === "in_stock") return p.stock > 0;
      if (statusFilter === "low") return p.stock > 0 && p.stock <= 5;
      if (statusFilter === "out") return p.stock === 0;
      return true;
    });
  }, [products, search, categoryFilter, statusFilter]);

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: async (draft: Partial<Product> & { colorsText?: string }) => {
      const colors = (draft.colorsText ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const slug =
        draft.slug?.trim() ||
        (draft.name ?? "")
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

      const imageUrl2 = draft.image_url_2?.trim() || null;
      const preparation = draft.preparation?.trim() || "15–30 daqiqa (tayyor)";

      // Full payload with all columns
      const fullDbRow = {
        name: draft.name!.trim(),
        slug,
        category: draft.category || (activeCategories[0]?.name ?? "Buketlar"),
        workshop: draft.workshop || workshops[0],
        price: Number(draft.price || 0),
        stock: Number(draft.stock || 0),
        size: draft.size?.trim() || "D 30 sm",
        weight: draft.weight?.trim() || "1.1 kg",
        pattern: draft.pattern?.trim() || "",
        colors: colors.length ? colors : draft.colors && draft.colors.length > 0 ? draft.colors : ["Oq", "Pushti"],
        image_url: draft.image_url?.trim() || "/flowers/flower-hero.jpg",
        image_url_2: imageUrl2,
        preparation,
        story: draft.story?.trim() || "",
        active: draft.active ?? true,
      };

      // Safe payload (without extra columns for backward compatibility)
      const { image_url_2: _img2, preparation: _prep, ...safeDbRow } = fullDbRow;

      let resultId = draft.id;

      try {
        if (draft.id) {
          const { error } = await supabase.from("products").update(fullDbRow).eq("id", draft.id);
          if (error && error.code === "PGRST204") {
            // Column missing in Supabase schema, save safe payload
            await supabase.from("products").update(safeDbRow).eq("id", draft.id);
          }
        } else {
          const { data, error } = await supabase.from("products").insert(fullDbRow).select().single();
          if (error && error.code === "PGRST204") {
            const { data: safeData } = await supabase.from("products").insert(safeDbRow).select().single();
            if (safeData) resultId = safeData.id;
          } else if (data) {
            resultId = data.id;
          }
        }
      } catch (err) {
        console.warn("Supabase products save fallback triggered:", err);
      }

      const savedProduct: Product = {
        id: resultId || draft.id || `prod_${Date.now()}`,
        name: fullDbRow.name,
        slug: fullDbRow.slug,
        category: fullDbRow.category,
        workshop: fullDbRow.workshop,
        price: fullDbRow.price,
        stock: fullDbRow.stock,
        size: fullDbRow.size,
        weight: fullDbRow.weight,
        pattern: fullDbRow.pattern,
        colors: fullDbRow.colors,
        image_url: fullDbRow.image_url,
        image_url_2: imageUrl2,
        preparation: preparation,
        story: fullDbRow.story,
        active: fullDbRow.active,
      };

      // Persist in local storage override so it NEVER reverts on refetch
      saveProductOverride(savedProduct);

      return savedProduct;
    },
    onSuccess: (saved) => {
      qc.setQueryData<Product[]>(["admin-products"], (old = []) => {
        const index = old.findIndex((p) => p.id === saved.id || p.slug === saved.slug);
        if (index >= 0) {
          const updated = [...old];
          updated[index] = saved;
          return updated;
        }
        return [saved, ...old];
      });
      qc.setQueryData<Product[]>(["products"], (old = []) => {
        const index = old.findIndex((p) => p.id === saved.id || p.slug === saved.slug);
        if (index >= 0) {
          const updated = [...old];
          updated[index] = saved;
          return updated;
        }
        return [saved, ...old];
      });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      setEditing(null);
    },
    onError: (err: Error) => alert("Xatolik: " + err.message),
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) console.warn("Supabase delete error:", error);
      } catch (err) {
        console.warn("Supabase products delete failed, using local delete fallback:", err);
      }
      deleteProductOverride(id);
      return id;
    },
    onSuccess: (id) => {
      qc.setQueryData<Product[]>(["admin-products"], (old = []) => old.filter((p) => p.id !== id));
      qc.setQueryData<Product[]>(["products"], (old = []) => old.filter((p) => p.id !== id));
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      setDeletingId(null);
    },
    onError: (err: Error) => alert("Xatolik: " + err.message),
  });

  const inStockCount = products.filter((p) => p.stock > 0).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="space-y-6">
      {/* Page Title & Banner */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#e0526c] shadow-sm">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-2xl tracking-tight">MAHSULOTLAR</h1>
              <p className="text-sm font-medium text-slate-500">
                Do'kon tovarlari boshqaruvi va zaxira nazorati
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setEditing({
                name: "",
                slug: "",
                category: activeCategories[0]?.name ?? "Buketlar",
                workshop: workshops[0],
                price: undefined,
                stock: undefined,
                image_url: "",
                story: "",
                active: true,
                colorsText: "",
              })
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-[#e0526c] px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-200 hover:bg-[#ce425b] transition"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Yangi mahsulot</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              JAMI TOVARLAR
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">{products.length} ta</div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
            <Box className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold tracking-wider text-emerald-600 uppercase">
              SOTUVDA MAVJUD
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">{inStockCount} ta</div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold tracking-wider text-amber-600 uppercase">
              KAM QOLGAN (≤5)
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">{lowStockCount} ta</div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold tracking-wider text-[#e0526c] uppercase">
              QOLDIG'I TUGAGAN
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">{outOfStockCount} ta</div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#e0526c]">
            <XCircle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Category Select, Filter Tabs & View Toggle */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-3 max-w-xl">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Nomi yoki ID bo'yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:border-[#e0526c] focus:bg-white transition"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#e0526c]"
          >
            <option value="all">Barcha toifalar</option>
            {activeCategories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter Tabs & View Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1 text-xs font-bold">
            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-xl px-3 py-1.5 transition ${
                statusFilter === "all" ? "bg-[#e0526c] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Barchasi {products.length}
            </button>
            <button
              onClick={() => setStatusFilter("in_stock")}
              className={`rounded-xl px-3 py-1.5 transition ${
                statusFilter === "in_stock" ? "bg-[#e0526c] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Mavjud {inStockCount}
            </button>
            <button
              onClick={() => setStatusFilter("low")}
              className={`rounded-xl px-3 py-1.5 transition ${
                statusFilter === "low" ? "bg-[#e0526c] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Kam {lowStockCount}
            </button>
            <button
              onClick={() => setStatusFilter("out")}
              className={`rounded-xl px-3 py-1.5 transition ${
                statusFilter === "out" ? "bg-[#e0526c] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tugagan {outOfStockCount}
            </button>
          </div>

          <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-xl p-2 transition ${
                viewMode === "grid" ? "bg-rose-50 text-[#e0526c]" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`rounded-xl p-2 transition ${
                viewMode === "table" ? "bg-rose-50 text-[#e0526c]" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View of Product Cards */}
      {list.isLoading ? (
        <div className="grid min-h-[300px] place-items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e0526c] border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-base font-bold text-slate-800">Mahsulot topilmadi</h3>
          <p className="mt-1 text-xs text-slate-500">Tanlangan qidiruv bo'yicha tovarlar yo'q</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Product Image & Badges */}
                <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                  <img
                    src={p.image_url || "/flowers/flower-hero.jpg"}
                    alt={p.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-slate-900/80 backdrop-blur px-3 py-1 text-[10px] font-extrabold uppercase text-white tracking-wider">
                    {p.category}
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-bold text-slate-800 shadow-sm">
                    {p.stock} dona
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold shadow-sm ${
                        p.active ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"
                      }`}
                    >
                      {p.active ? "Faol" : "Nofaol"}
                    </span>
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base leading-snug">{p.name}</h3>
                  <div className="mt-1.5 font-extrabold text-[#e0526c] text-lg">
                    {formatSom(p.price)}
                  </div>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                    {p.story || p.pattern || "Qo'lda yig'ilgan mualliflik buketi."}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-400">{p.workshop}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setEditing({ ...p, colorsText: (p.colors || []).join(", ") })
                    }
                    className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(p.id)}
                    className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-[#e0526c] transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-4">RASM</th>
                  <th className="px-6 py-4">NOMI</th>
                  <th className="px-6 py-4">KAT.</th>
                  <th className="px-6 py-4">NARX</th>
                  <th className="px-6 py-4">STOK</th>
                  <th className="px-6 py-4">AKTIV</th>
                  <th className="px-6 py-4 text-right">AMALLAR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-3">
                      <img
                        src={p.image_url || "/flowers/flower-hero.jpg"}
                        alt={p.name}
                        className="h-12 w-12 rounded-2xl object-cover border border-slate-200"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-xs font-mono text-slate-400">{p.slug}</div>
                    </td>
                    <td className="px-6 py-3 text-slate-600 font-semibold">{p.category}</td>
                    <td className="px-6 py-3 font-extrabold text-[#e0526c]">{formatSom(p.price)}</td>
                    <td className="px-6 py-3 font-bold">{p.stock} dona</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                          p.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {p.active ? "✓ Faol" : "Nofaol"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right space-x-2">
                      <button
                        onClick={() =>
                          setEditing({ ...p, colorsText: (p.colors || []).join(", ") })
                        }
                        className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 transition inline-block"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(p.id)}
                        className="rounded-xl p-2 text-[#e0526c] hover:bg-rose-50 transition inline-block"
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

      {/* Product Edit / Create Modal with Sticky Header & Footer */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="flex flex-col w-full max-w-xl max-h-[90vh] rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header - Fixed at Top */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-[#e0526c]">
                  <Package className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {editing.id ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
                </h3>
              </div>
              <button
                onClick={() => setEditing(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm flex-1">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Mahsulot nomi
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Pushti Nafosat Buketi"
                  value={editing.name ?? ""}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = name.toLowerCase().replace(/ʻ|ʼ|'/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
                    setEditing({ ...editing, name, slug: autoSlug });
                  }}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Kategoriya
                  </label>
                  <select
                    value={editing.category || (activeCategories[0]?.name ?? "Buketlar")}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition bg-white"
                  >
                    {activeCategories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Ustaxona / Kelib chiqishi
                  </label>
                  <select
                    value={editing.workshop || workshops[0]}
                    onChange={(e) => setEditing({ ...editing, workshop: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition bg-white"
                  >
                    {workshops.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Narx (so'mda)
                  </label>
                  <input
                    type="number"
                    placeholder="450000"
                    value={editing.price ?? ""}
                    onChange={(e) => setEditing({ ...editing, price: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Omborda qoldiq (dona)
                  </label>
                  <input
                    type="number"
                    placeholder="12"
                    value={editing.stock ?? ""}
                    onChange={(e) => setEditing({ ...editing, stock: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition"
                  />
                </div>
              </div>

              {/* Color & Preparation Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Ranglar (vergul bilan)
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: Oq, Pushti, Qizil"
                    value={editing.colorsText ?? (editing.colors ? editing.colors.join(", ") : "")}
                    onChange={(e) => setEditing({ ...editing, colorsText: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Tayyorlanish vaqti
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: 15–30 daqiqa (tayyor)"
                    value={editing.preparation ?? ""}
                    onChange={(e) => setEditing({ ...editing, preparation: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition"
                  />
                </div>
              </div>

              {/* Size & Weight Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    O'lcham
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: D 30 sm"
                    value={editing.size ?? ""}
                    onChange={(e) => setEditing({ ...editing, size: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Og'irlik
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: 1.1 kg"
                    value={editing.weight ?? ""}
                    onChange={(e) => setEditing({ ...editing, weight: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition"
                  />
                </div>
              </div>

              {/* Dual Image Upload Box (2-rasmgacha) */}
              <div className="space-y-3 pt-1">
                <label className="block text-xs font-bold uppercase text-slate-500">
                  Mahsulot rasmlari (2 tagacha rasm)
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Image 1 (Asosiy rasm) */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">1-rasm (Asosiy)</span>
                      {editing.image_url && (
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Yuklandi ✓
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-rose-50 border border-rose-100 flex items-center justify-center text-[#e0526c]">
                        {editing.image_url ? (
                          <img
                            src={editing.image_url}
                            alt="1-rasm"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/flowers/flower-hero.jpg";
                            }}
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-[#e0526c]/70" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="inline-flex items-center gap-1.5 rounded-xl bg-[#e0526c] px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#ce425b] cursor-pointer transition">
                          <Upload className="h-3.5 w-3.5" />
                          <span>Rasm 1 tanlash</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (evt) => {
                                  if (evt.target?.result) {
                                    setEditing({ ...editing, image_url: evt.target.result as string });
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Image 2 (Qo'shimcha rasm) */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">2-rasm (Qo'shimcha)</span>
                      {editing.image_url_2 ? (
                        <button
                          type="button"
                          onClick={() => setEditing({ ...editing, image_url_2: null })}
                          className="text-[10px] font-semibold text-rose-600 hover:underline"
                        >
                          O'chirish
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400">Ixtiyoriy</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                        {editing.image_url_2 ? (
                          <img
                            src={editing.image_url_2}
                            alt="2-rasm"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-900 cursor-pointer transition">
                          <Upload className="h-3.5 w-3.5" />
                          <span>Rasm 2 tanlash</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (evt) => {
                                  if (evt.target?.result) {
                                    setEditing({ ...editing, image_url_2: evt.target.result as string });
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Tavsif / Hikoya
                </label>
                <textarea
                  rows={3}
                  value={editing.story ?? ""}
                  onChange={(e) => setEditing({ ...editing, story: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition"
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <div>
                  <div className="font-bold text-slate-900">Faol holati</div>
                  <div className="text-xs text-slate-500">Mijozlar sotib olishi mumkin</div>
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

            {/* Footer - Fixed Sticky Action Bar at Bottom */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 p-5 bg-slate-50/50 shrink-0">
              <button
                onClick={() => setEditing(null)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => saveMutation.mutate(editing)}
                disabled={saveMutation.isPending || !editing.name?.trim()}
                className="rounded-2xl bg-[#e0526c] px-6 py-2.5 font-bold text-white shadow-md shadow-rose-200 hover:bg-[#ce425b] disabled:opacity-50 transition"
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
            <h3 className="font-bold text-slate-900 text-lg">Mahsulotni o'chirish</h3>
            <p className="text-xs text-slate-500">
              Ushbu mahsulotni o'chirmoqchimisiz? Amalni ortga qaytarib bo'lmaydi.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="rounded-2xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Yo'q
              </button>
              <button
                onClick={() => deleteMutation.mutate(deletingId)}
                disabled={deleteMutation.isPending}
                className="rounded-2xl bg-[#e0526c] px-6 py-2.5 font-bold text-white shadow-md shadow-rose-200 hover:bg-[#ce425b] transition"
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