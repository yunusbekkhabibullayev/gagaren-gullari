import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { C as List, F as CircleX, H as Box, I as CircleCheck, O as Folder, T as Layers, f as Search, g as Pen, m as Plus, o as Trash2, t as lucide_react_exports, w as LayoutGrid } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-C9TGADx0.mjs";
import { n as saveCategoryOverride, r as useAdminCategories, t as deleteCategoryOverride } from "./categories-oyDoVC2I.mjs";
import { s as useProducts } from "./products-B44v3hOB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.categories-Cf0XKi7q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DynIcon({ name, size = 20, className = "" }) {
	if (!name) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
		size,
		className
	});
	const Icon = lucide_react_exports[name];
	if (!Icon) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
		size,
		className
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
		size,
		className
	});
}
function AdminCategoriesPage() {
	const qc = useQueryClient();
	const { data: categories = [], isLoading } = useAdminCategories();
	const { data: products = [] } = useProducts();
	const [search, setSearch] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [viewMode, setViewMode] = (0, import_react.useState)("grid");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => {
		return categories.filter((c) => {
			const s = (search ?? "").toLowerCase();
			const matchSearch = (c.name ?? "").toLowerCase().includes(s) || (c.slug ?? "").toLowerCase().includes(s);
			if (filter === "active") return matchSearch && c.active;
			if (filter === "inactive") return matchSearch && !c.active;
			return matchSearch;
		});
	}, [
		categories,
		search,
		filter
	]);
	const saveMutation = useMutation({
		mutationFn: async (d) => {
			const slug = d.slug?.trim() || (d.name ?? "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
			const row = {
				name: d.name.trim(),
				slug,
				icon: d.icon?.trim() || "Folder",
				color: d.color || "#e0526c",
				order_index: d.order_index ?? categories.length,
				active: d.active ?? true
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
			const savedCat = {
				id: resultId || d.id || `cat_${Date.now()}`,
				name: row.name,
				slug: row.slug,
				icon: row.icon,
				color: row.color,
				order_index: row.order_index,
				active: row.active,
				created_at: (/* @__PURE__ */ new Date()).toISOString(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			};
			saveCategoryOverride(savedCat);
			return savedCat;
		},
		onSuccess: (saved) => {
			qc.setQueryData(["admin-categories"], (old = []) => {
				const index = old.findIndex((c) => c.id === saved.id || c.slug === saved.slug);
				if (index >= 0) {
					const updated = [...old];
					updated[index] = saved;
					return updated;
				}
				return [...old, saved];
			});
			qc.setQueryData(["categories"], (old = []) => {
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
		onError: (err) => alert("Xatolik: " + err.message)
	});
	const deleteMutation = useMutation({
		mutationFn: async (id) => {
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
			qc.setQueryData(["admin-categories"], (old = []) => old.filter((c) => c.id !== id));
			qc.setQueryData(["categories"], (old = []) => old.filter((c) => c.id !== id));
			qc.invalidateQueries({ queryKey: ["admin-categories"] });
			qc.invalidateQueries({ queryKey: ["categories"] });
			setDeletingId(null);
		},
		onError: (err) => alert("Xatolik: " + err.message)
	});
	const toggleActiveMutation = useMutation({
		mutationFn: async ({ id, active }) => {
			try {
				const { error } = await supabase.from("categories").update({ active }).eq("id", id);
				if (error) console.warn("Supabase toggle active error:", error);
			} catch (err) {
				console.warn("Supabase toggle active failed, using local fallback:", err);
			}
			const existing = categories.find((c) => c.id === id);
			if (existing) saveCategoryOverride({
				...existing,
				active
			});
			return {
				id,
				active
			};
		},
		onSuccess: ({ id, active }) => {
			qc.setQueryData(["admin-categories"], (old = []) => old.map((c) => c.id === id ? {
				...c,
				active
			} : c));
			qc.setQueryData(["categories"], (old = []) => old.map((c) => c.id === id ? {
				...c,
				active
			} : c));
			qc.invalidateQueries({ queryKey: ["admin-categories"] });
			qc.invalidateQueries({ queryKey: ["categories"] });
		}
	});
	const activeCount = categories.filter((c) => c.active).length;
	const inactiveCount = categories.filter((c) => !c.active).length;
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
							className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-6 w-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-extrabold text-slate-900 text-2xl tracking-tight",
							children: "Katalog Toifalari"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-slate-500",
							children: "Do'kon toifalari va ularga biriktirilgan mahsulotlar boshqaruvi"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setEditing({
							name: "",
							slug: "",
							icon: "Folder",
							color: "#e0526c",
							order_index: categories.length,
							active: true
						}),
						className: "inline-flex items-center gap-2 rounded-2xl bg-[#e0526c] px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-200 hover:bg-[#ce425b] transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 stroke-[3]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Yangi toifa" })]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setFilter("all"),
						className: `text-left rounded-3xl border p-5 shadow-sm flex items-center justify-between transition ${filter === "all" ? "border-[#e0526c] bg-rose-50/40 ring-2 ring-rose-200 shadow-md" : "border-slate-200/80 bg-white hover:border-slate-300"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-extrabold tracking-wider text-slate-400 uppercase",
							children: "JAMI TOIFALAR"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-2xl font-extrabold text-slate-900",
							children: [categories.length, " ta"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "h-5 w-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setFilter("active"),
						className: `text-left rounded-3xl border p-5 shadow-sm flex items-center justify-between transition ${filter === "active" ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-200 shadow-md" : "border-slate-200/80 bg-white hover:border-slate-300"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-extrabold tracking-wider text-slate-400 uppercase",
							children: "FAOL TOIFALAR"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-2xl font-extrabold text-emerald-600",
							children: [activeCount, " ta"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setFilter("inactive"),
						className: `text-left rounded-3xl border p-5 shadow-sm flex items-center justify-between transition ${filter === "inactive" ? "border-slate-400 bg-slate-100/60 ring-2 ring-slate-200 shadow-md" : "border-slate-200/80 bg-white hover:border-slate-300"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-extrabold tracking-wider text-slate-400 uppercase",
							children: "NOFAOL TOIFALAR"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-2xl font-extrabold text-slate-500",
							children: [inactiveCount, " ta"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-5 w-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-extrabold tracking-wider text-slate-400 uppercase",
							children: "BIRIKTIRILGAN TOVARLAR"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-2xl font-extrabold text-[#e0526c]",
							children: [products.length, " ta tovar"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-[#e0526c]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { className: "h-5 w-5" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "Toifa nomi yoki ID bo'yicha qidirish...",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						className: "w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:border-[#e0526c] focus:bg-white transition"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 rounded-2xl bg-slate-100 p-1 text-xs font-bold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setFilter("all"),
								className: `rounded-xl px-3 py-1.5 transition ${filter === "all" ? "bg-[#e0526c] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
								children: ["Barchasi ", categories.length]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setFilter("active"),
								className: `rounded-xl px-3 py-1.5 transition ${filter === "active" ? "bg-[#e0526c] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
								children: ["Faol ", activeCount]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setFilter("inactive"),
								className: `rounded-xl px-3 py-1.5 transition ${filter === "inactive" ? "bg-[#e0526c] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
								children: ["Nofaol ", inactiveCount]
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
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid min-h-[300px] place-items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent" })
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "mx-auto h-12 w-12 text-slate-300" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 text-base font-bold text-slate-800",
						children: "Toifa topilmadi"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-slate-500",
						children: "Qidiruv bo'yicha hech qanday toifa mos kelmadi"
					})
				]
			}) : viewMode === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: filtered.map((cat) => {
					const catProductCount = products.filter((p) => p.category?.toLowerCase() === (cat.name || "").toLowerCase() || p.category?.toLowerCase() === (cat.slug || "").toLowerCase()).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm",
									style: { background: cat.color || "#e85d4a" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DynIcon, {
										name: cat.icon,
										size: 22
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => toggleActiveMutation.mutate({
										id: cat.id,
										active: !cat.active
									}),
									className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${cat.active ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-slate-100 text-slate-400"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${cat.active ? "bg-emerald-500" : "bg-slate-400"}` }), cat.active ? "Faol" : "Nofaol"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-bold text-slate-900 text-lg",
								children: cat.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-mono text-slate-400",
								children: ["#", cat.slug]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-center justify-between border-t border-slate-100 pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600",
								children: [catProductCount, " ta tovar"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setEditing(cat),
									className: "rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setDeletingId(cat.id),
									className: "rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})]
							})]
						})]
					}, cat.id);
				})
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
									children: "TARTIB"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "BELGI"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "TOIFA NOMI"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "SLUG"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "HOLATI"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4 text-right",
									children: "AMALLAR"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-slate-100 font-medium text-slate-700",
							children: filtered.map((cat, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-slate-50/80 transition",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-4 text-slate-400 font-bold",
										children: idx + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm",
											style: { background: cat.color || "#e85d4a" },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DynIcon, {
												name: cat.icon,
												size: 18
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-4 font-bold text-slate-900",
										children: cat.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-4 font-mono text-xs text-slate-400",
										children: cat.slug
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${cat.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${cat.active ? "bg-emerald-500" : "bg-slate-400"}` }), cat.active ? "Faol" : "Nofaol"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-6 py-4 text-right space-x-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setEditing(cat),
											className: "rounded-xl p-2 text-slate-600 hover:bg-slate-100 transition inline-block",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setDeletingId(cat.id),
											className: "rounded-xl p-2 text-red-600 hover:bg-red-50 transition inline-block",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})]
									})
								]
							}, cat.id))
						})]
					})
				})
			}),
			editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col w-full max-w-lg max-h-[90vh] rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-slate-100 p-5 bg-white shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-[#e0526c]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-slate-900 text-lg",
									children: editing.id ? "Toifani tahrirlash" : "Yangi toifa qo'shish"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setEditing(null),
								className: "rounded-full p-2 text-slate-400 hover:bg-slate-100 transition",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-5 w-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-6 overflow-y-auto space-y-4 text-sm flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1",
									children: "Toifa nomi"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "Masalan: Uy gullari",
									value: editing.name ?? "",
									onChange: (e) => {
										const name = e.target.value;
										const autoSlug = name.toLowerCase().replace(/ʻ|ʼ|'/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
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
											icon: autoIcon
										});
									},
									className: "w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#e0526c] transition"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1",
									children: "Slug (URL identifikatori)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "uy-gullari",
									value: editing.slug ?? "",
									onChange: (e) => setEditing({
										...editing,
										slug: e.target.value
									}),
									className: "w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#e0526c] focus:bg-white transition"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-bold uppercase tracking-wider text-slate-500",
											children: "Icon tanlash"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs font-bold text-[#e0526c] flex items-center gap-1",
											children: [
												"Tanlangan: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DynIcon, {
													name: editing.icon || "Folder",
													size: 16
												}),
												" ",
												editing.icon || "Folder"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-6 gap-2 p-2 rounded-2xl bg-slate-50 border border-slate-200/80",
										children: [
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
											"CheckCircle2"
										].map((icName) => {
											const isSelected = (editing.icon || "Folder") === icName;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setEditing({
													...editing,
													icon: icName
												}),
												className: `flex flex-col items-center justify-center p-2 rounded-xl transition border ${isSelected ? "border-[#e0526c] bg-white text-[#e0526c] shadow-sm ring-2 ring-rose-100" : "border-transparent text-slate-500 hover:bg-white hover:text-slate-900"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DynIcon, {
													name: icName,
													size: 18
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mt-1 text-[9px] font-semibold truncate w-full text-center",
													children: icName
												})]
											}, icName);
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1",
									children: "Rang (Color Hex)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "color",
										value: editing.color || "#e0526c",
										onChange: (e) => setEditing({
											...editing,
											color: e.target.value
										}),
										className: "h-10 w-14 cursor-pointer rounded-xl border border-slate-200 p-1 bg-white"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: editing.color || "#e0526c",
										onChange: (e) => setEditing({
											...editing,
											color: e.target.value
										}),
										className: "w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium outline-none focus:border-[#e0526c]"
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-bold text-slate-900",
										children: "Faol holati"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-500",
										children: "Mijozlar uchun do'konda ko'rinadi"
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
								className: "rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition",
								children: "Bekor qilish"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => saveMutation.mutate(editing),
								disabled: saveMutation.isPending || !editing.name?.trim(),
								className: "rounded-2xl bg-[#e0526c] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-200 hover:bg-[#ce425b] disabled:opacity-50 transition",
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
							children: "Toifani o'chirish"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500",
							children: "Ushbu toifani o'chirmoqchimisiz? Amalni ortga qaytarib bo'lmaydi."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDeletingId(null),
								className: "rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition",
								children: "Yo'q"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => deleteMutation.mutate(deletingId),
								disabled: deleteMutation.isPending,
								className: "rounded-2xl bg-[#e0526c] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-200 hover:bg-[#ce425b] transition",
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
export { AdminCategoriesPage as component };
