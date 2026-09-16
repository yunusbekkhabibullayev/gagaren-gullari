import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { C as List, D as Image, F as CircleX, H as Box, I as CircleCheck, _ as Package, a as TriangleAlert, f as Search, g as Pen, i as Upload, m as Plus, n as X, o as Trash2, w as LayoutGrid } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-C9TGADx0.mjs";
import { r as useAdminCategories } from "./categories-oyDoVC2I.mjs";
import { a as saveProductOverride, n as formatSom, r as mergeProductsWithOverrides, t as deleteProductOverride } from "./products-B44v3hOB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products-D9sFx2DX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var workshops = [
	"Mahalliy",
	"Gollandiya",
	"Ekvador",
	"Rishton",
	"Avtorlik"
];
function AdminProductsPage() {
	const qc = useQueryClient();
	const { data: dbCategories = [] } = useAdminCategories();
	const activeCategories = (0, import_react.useMemo)(() => dbCategories.filter((c) => c.active), [dbCategories]);
	const list = useQuery({
		queryKey: ["admin-products"],
		queryFn: async () => {
			try {
				const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
				if (error || !data) return mergeProductsWithOverrides([]);
				return mergeProductsWithOverrides(data);
			} catch {
				return mergeProductsWithOverrides([]);
			}
		}
	});
	const products = list.data ?? [];
	const [search, setSearch] = (0, import_react.useState)("");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [viewMode, setViewMode] = (0, import_react.useState)("grid");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => {
		return products.filter((p) => {
			const matchSearch = (p.name ?? "").toLowerCase().includes((search ?? "").toLowerCase()) || (p.slug ?? "").toLowerCase().includes((search ?? "").toLowerCase());
			const matchCat = categoryFilter === "all" || p.category === categoryFilter;
			if (!matchSearch || !matchCat) return false;
			if (statusFilter === "in_stock") return p.stock > 0;
			if (statusFilter === "low") return p.stock > 0 && p.stock <= 5;
			if (statusFilter === "out") return p.stock === 0;
			return true;
		});
	}, [
		products,
		search,
		categoryFilter,
		statusFilter
	]);
	const saveMutation = useMutation({
		mutationFn: async (draft) => {
			const colors = (draft.colorsText ?? "").split(",").map((s) => s.trim()).filter(Boolean);
			const slug = draft.slug?.trim() || (draft.name ?? "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
			const imageUrl2 = draft.image_url_2?.trim() || null;
			const preparation = draft.preparation?.trim() || "15–30 daqiqa (tayyor)";
			const fullDbRow = {
				name: draft.name.trim(),
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
				active: draft.active ?? true
			};
			const { image_url_2: _img2, preparation: _prep, ...safeDbRow } = fullDbRow;
			let resultId = draft.id;
			try {
				if (draft.id) {
					const { error } = await supabase.from("products").update(fullDbRow).eq("id", draft.id);
					if (error && error.code === "PGRST204") await supabase.from("products").update(safeDbRow).eq("id", draft.id);
				} else {
					const { data, error } = await supabase.from("products").insert(fullDbRow).select().single();
					if (error && error.code === "PGRST204") {
						const { data: safeData } = await supabase.from("products").insert(safeDbRow).select().single();
						if (safeData) resultId = safeData.id;
					} else if (data) resultId = data.id;
				}
			} catch (err) {
				console.warn("Supabase products save fallback triggered:", err);
			}
			const savedProduct = {
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
				preparation,
				story: fullDbRow.story,
				active: fullDbRow.active
			};
			saveProductOverride(savedProduct);
			return savedProduct;
		},
		onSuccess: (saved) => {
			qc.setQueryData(["admin-products"], (old = []) => {
				const index = old.findIndex((p) => p.id === saved.id || p.slug === saved.slug);
				if (index >= 0) {
					const updated = [...old];
					updated[index] = saved;
					return updated;
				}
				return [saved, ...old];
			});
			qc.setQueryData(["products"], (old = []) => {
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
		onError: (err) => alert("Xatolik: " + err.message)
	});
	const deleteMutation = useMutation({
		mutationFn: async (id) => {
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
			qc.setQueryData(["admin-products"], (old = []) => old.filter((p) => p.id !== id));
			qc.setQueryData(["products"], (old = []) => old.filter((p) => p.id !== id));
			qc.invalidateQueries({ queryKey: ["admin-products"] });
			qc.invalidateQueries({ queryKey: ["products"] });
			setDeletingId(null);
		},
		onError: (err) => alert("Xatolik: " + err.message)
	});
	const inStockCount = products.filter((p) => p.stock > 0).length;
	const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
	const outOfStockCount = products.filter((p) => p.stock === 0).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#e0526c] shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-6 w-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-extrabold text-slate-900 text-2xl tracking-tight",
							children: "MAHSULOTLAR"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-slate-500",
							children: "Do'kon tovarlari boshqaruvi va zaxira nazorati"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setEditing({
							name: "",
							slug: "",
							category: activeCategories[0]?.name ?? "Buketlar",
							workshop: workshops[0],
							price: void 0,
							stock: void 0,
							image_url: "",
							story: "",
							active: true,
							colorsText: ""
						}),
						className: "inline-flex items-center gap-2 rounded-2xl bg-[#e0526c] px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-200 hover:bg-[#ce425b] transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 stroke-[3]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Yangi mahsulot" })]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-extrabold tracking-wider text-slate-400 uppercase",
							children: "JAMI TOVARLAR"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 text-3xl font-extrabold text-slate-900",
							children: [products.length, " ta"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { className: "h-6 w-6" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-extrabold tracking-wider text-emerald-600 uppercase",
							children: "SOTUVDA MAVJUD"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 text-3xl font-extrabold text-slate-900",
							children: [inStockCount, " ta"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-extrabold tracking-wider text-amber-600 uppercase",
							children: "KAM QOLGAN (≤5)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 text-3xl font-extrabold text-slate-900",
							children: [lowStockCount, " ta"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-6 w-6" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-extrabold tracking-wider text-[#e0526c] uppercase",
							children: "QOLDIG'I TUGAGAN"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 text-3xl font-extrabold text-slate-900",
							children: [outOfStockCount, " ta"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#e0526c]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-6 w-6" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 flex-wrap items-center gap-3 max-w-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 min-w-[200px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							placeholder: "Nomi yoki ID bo'yicha qidirish...",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							className: "w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:border-[#e0526c] focus:bg-white transition"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: categoryFilter,
						onChange: (e) => setCategoryFilter(e.target.value),
						className: "rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#e0526c]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "Barcha toifalar"
						}), activeCategories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.name,
							children: c.name
						}, c.id))]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 rounded-2xl bg-slate-100 p-1 text-xs font-bold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setStatusFilter("all"),
								className: `rounded-xl px-3 py-1.5 transition ${statusFilter === "all" ? "bg-[#e0526c] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
								children: ["Barchasi ", products.length]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setStatusFilter("in_stock"),
								className: `rounded-xl px-3 py-1.5 transition ${statusFilter === "in_stock" ? "bg-[#e0526c] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
								children: ["Mavjud ", inStockCount]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setStatusFilter("low"),
								className: `rounded-xl px-3 py-1.5 transition ${statusFilter === "low" ? "bg-[#e0526c] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
								children: ["Kam ", lowStockCount]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setStatusFilter("out"),
								className: `rounded-xl px-3 py-1.5 transition ${statusFilter === "out" ? "bg-[#e0526c] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
								children: ["Tugagan ", outOfStockCount]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 border-l border-slate-200 pl-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setViewMode("grid"),
							className: `rounded-xl p-2 transition ${viewMode === "grid" ? "bg-rose-50 text-[#e0526c]" : "text-slate-400 hover:text-slate-700"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setViewMode("table"),
							className: `rounded-xl p-2 transition ${viewMode === "table" ? "bg-rose-50 text-[#e0526c]" : "text-slate-400 hover:text-slate-700"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "h-4 w-4" })
						})]
					})]
				})]
			}),
			list.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid min-h-[300px] place-items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[#e0526c] border-t-transparent" })
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "mx-auto h-12 w-12 text-slate-300" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 text-base font-bold text-slate-800",
						children: "Mahsulot topilmadi"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-slate-500",
						children: "Tanlangan qidiruv bo'yicha tovarlar yo'q"
					})
				]
			}) : viewMode === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5",
				children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative aspect-[4/3] w-full bg-slate-100 overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.image_url || "/flowers/flower-hero.jpg",
								alt: p.name,
								className: "h-full w-full object-cover group-hover:scale-105 transition duration-500"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-3 left-3 rounded-full bg-slate-900/80 backdrop-blur px-3 py-1 text-[10px] font-extrabold uppercase text-white tracking-wider",
								children: p.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute bottom-3 left-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-bold text-slate-800 shadow-sm",
								children: [p.stock, " dona"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-3 right-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold shadow-sm ${p.active ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"}`,
									children: p.active ? "Faol" : "Nofaol"
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-slate-900 text-base leading-snug",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5 font-extrabold text-[#e0526c] text-lg",
								children: formatSom(p.price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-slate-500 line-clamp-2",
								children: p.story || p.pattern || "Qo'lda yig'ilgan mualliflik buketi."
							})
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-slate-400",
							children: p.workshop
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setEditing({
									...p,
									colorsText: (p.colors || []).join(", ")
								}),
								className: "rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDeletingId(p.id),
								className: "rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-[#e0526c] transition",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						})]
					})]
				}, p.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-200/80",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "RASM"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "NOMI"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "KAT."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "NARX"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "STOK"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "AKTIV"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4 text-right",
									children: "AMALLAR"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-slate-100 font-medium text-slate-700",
							children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-slate-50/80 transition",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: p.image_url || "/flowers/flower-hero.jpg",
											alt: p.name,
											className: "h-12 w-12 rounded-2xl object-cover border border-slate-200"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-6 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold text-slate-900",
											children: p.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-mono text-slate-400",
											children: p.slug
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-3 text-slate-600 font-semibold",
										children: p.category
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-3 font-extrabold text-[#e0526c]",
										children: formatSom(p.price)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-6 py-3 font-bold",
										children: [p.stock, " dona"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${p.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`,
											children: p.active ? "✓ Faol" : "Nofaol"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-6 py-3 text-right space-x-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setEditing({
												...p,
												colorsText: (p.colors || []).join(", ")
											}),
											className: "rounded-xl p-2 text-slate-600 hover:bg-slate-100 transition inline-block",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setDeletingId(p.id),
											className: "rounded-xl p-2 text-[#e0526c] hover:bg-rose-50 transition inline-block",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})]
									})
								]
							}, p.id))
						})]
					})
				})
			}),
			editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col w-full max-w-xl max-h-[90vh] rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-slate-100 p-5 bg-white shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-[#e0526c]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-slate-900 text-lg",
									children: editing.id ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setEditing(null),
								className: "rounded-full p-2 text-slate-400 hover:bg-slate-100 transition",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-6 overflow-y-auto space-y-4 text-sm flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold uppercase text-slate-500 mb-1",
									children: "Mahsulot nomi"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "Masalan: Pushti Nafosat Buketi",
									value: editing.name ?? "",
									onChange: (e) => {
										const name = e.target.value;
										const autoSlug = name.toLowerCase().replace(/ʻ|ʼ|'/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
										setEditing({
											...editing,
											name,
											slug: autoSlug
										});
									},
									className: "w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold uppercase text-slate-500 mb-1",
										children: "Kategoriya"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: editing.category || (activeCategories[0]?.name ?? "Buketlar"),
										onChange: (e) => setEditing({
											...editing,
											category: e.target.value
										}),
										className: "w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition bg-white",
										children: activeCategories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: c.name,
											children: c.name
										}, c.id))
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold uppercase text-slate-500 mb-1",
										children: "Ustaxona / Kelib chiqishi"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: editing.workshop || workshops[0],
										onChange: (e) => setEditing({
											...editing,
											workshop: e.target.value
										}),
										className: "w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition bg-white",
										children: workshops.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: w,
											children: w
										}, w))
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold uppercase text-slate-500 mb-1",
										children: "Narx (so'mda)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										placeholder: "450000",
										value: editing.price ?? "",
										onChange: (e) => setEditing({
											...editing,
											price: e.target.value ? Number(e.target.value) : void 0
										}),
										className: "w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold uppercase text-slate-500 mb-1",
										children: "Omborda qoldiq (dona)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										placeholder: "12",
										value: editing.stock ?? "",
										onChange: (e) => setEditing({
											...editing,
											stock: e.target.value ? Number(e.target.value) : void 0
										}),
										className: "w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold uppercase text-slate-500 mb-1",
										children: "Ranglar (vergul bilan)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "Masalan: Oq, Pushti, Qizil",
										value: editing.colorsText ?? (editing.colors ? editing.colors.join(", ") : ""),
										onChange: (e) => setEditing({
											...editing,
											colorsText: e.target.value
										}),
										className: "w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold uppercase text-slate-500 mb-1",
										children: "Tayyorlanish vaqti"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "Masalan: 15–30 daqiqa (tayyor)",
										value: editing.preparation ?? "",
										onChange: (e) => setEditing({
											...editing,
											preparation: e.target.value
										}),
										className: "w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold uppercase text-slate-500 mb-1",
										children: "O'lcham"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "Masalan: D 30 sm",
										value: editing.size ?? "",
										onChange: (e) => setEditing({
											...editing,
											size: e.target.value
										}),
										className: "w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold uppercase text-slate-500 mb-1",
										children: "Og'irlik"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "Masalan: 1.1 kg",
										value: editing.weight ?? "",
										onChange: (e) => setEditing({
											...editing,
											weight: e.target.value
										}),
										className: "w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-bold uppercase text-slate-500",
										children: "Mahsulot rasmlari (2 tagacha rasm)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-bold text-slate-700",
													children: "1-rasm (Asosiy)"
												}), editing.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full",
													children: "Yuklandi ✓"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-rose-50 border border-rose-100 flex items-center justify-center text-[#e0526c]",
													children: editing.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: editing.image_url,
														alt: "1-rasm",
														className: "h-full w-full object-cover",
														onError: (e) => {
															e.currentTarget.src = "/flowers/flower-hero.jpg";
														}
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-6 w-6 text-[#e0526c]/70" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex-1 min-w-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "inline-flex items-center gap-1.5 rounded-xl bg-[#e0526c] px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#ce425b] cursor-pointer transition",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rasm 1 tanlash" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																type: "file",
																accept: "image/*",
																className: "hidden",
																onChange: (e) => {
																	const file = e.target.files?.[0];
																	if (file) {
																		const reader = new FileReader();
																		reader.onload = (evt) => {
																			if (evt.target?.result) setEditing({
																				...editing,
																				image_url: evt.target.result
																			});
																		};
																		reader.readAsDataURL(file);
																	}
																}
															})
														]
													})
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-bold text-slate-700",
													children: "2-rasm (Qo'shimcha)"
												}), editing.image_url_2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setEditing({
														...editing,
														image_url_2: null
													}),
													className: "text-[10px] font-semibold text-rose-600 hover:underline",
													children: "O'chirish"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-slate-400",
													children: "Ixtiyoriy"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400",
													children: editing.image_url_2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: editing.image_url_2,
														alt: "2-rasm",
														className: "h-full w-full object-cover"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-6 w-6 text-slate-300" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex-1 min-w-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-900 cursor-pointer transition",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rasm 2 tanlash" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																type: "file",
																accept: "image/*",
																className: "hidden",
																onChange: (e) => {
																	const file = e.target.files?.[0];
																	if (file) {
																		const reader = new FileReader();
																		reader.onload = (evt) => {
																			if (evt.target?.result) setEditing({
																				...editing,
																				image_url_2: evt.target.result
																			});
																		};
																		reader.readAsDataURL(file);
																	}
																}
															})
														]
													})
												})]
											})]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold uppercase text-slate-500 mb-1",
									children: "Tavsif / Hikoya"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 3,
									value: editing.story ?? "",
									onChange: (e) => setEditing({
										...editing,
										story: e.target.value
									}),
									className: "w-full rounded-2xl border border-slate-200 px-4 py-2.5 font-medium outline-none focus:border-[#e0526c] transition"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold text-slate-900",
										children: "Faol holati"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-500",
										children: "Mijozlar sotib olishi mumkin"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setEditing({
											...editing,
											active: !(editing.active ?? true)
										}),
										className: `relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${editing.active ?? true ? "bg-[#e0526c]" : "bg-slate-300"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${editing.active ?? true ? "translate-x-5" : "translate-x-0"}` })
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-3 border-t border-slate-100 p-5 bg-slate-50/50 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setEditing(null),
								className: "rounded-2xl border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 transition",
								children: "Bekor qilish"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => saveMutation.mutate(editing),
								disabled: saveMutation.isPending || !editing.name?.trim(),
								className: "rounded-2xl bg-[#e0526c] px-6 py-2.5 font-bold text-white shadow-md shadow-rose-200 hover:bg-[#ce425b] disabled:opacity-50 transition",
								children: saveMutation.isPending ? "Saqlanmoqda..." : "Saqlash"
							})]
						})
					]
				})
			}),
			deletingId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-[#e0526c]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-7 w-7" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-slate-900 text-lg",
							children: "Mahsulotni o'chirish"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500",
							children: "Ushbu mahsulotni o'chirmoqchimisiz? Amalni ortga qaytarib bo'lmaydi."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDeletingId(null),
								className: "rounded-2xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-600 hover:bg-slate-50 transition",
								children: "Yo'q"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => deleteMutation.mutate(deletingId),
								disabled: deleteMutation.isPending,
								className: "rounded-2xl bg-[#e0526c] px-6 py-2.5 font-bold text-white shadow-md shadow-rose-200 hover:bg-[#ce425b] transition",
								children: "O'chirish"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { AdminProductsPage as component };
