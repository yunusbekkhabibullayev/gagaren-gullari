import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useCategories } from "./categories-oyDoVC2I.mjs";
import { c as workshops, i as productImage, n as formatSom, s as useProducts } from "./products-B44v3hOB.mjs";
import { n as SiteFooter, r as SiteHeader, t as MobileTabBar } from "./site-footer-CusmjNK2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-kpRGAoDx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Catalog() {
	const { data: products = [], isLoading } = useProducts();
	const { data: dbCategories = [] } = useCategories();
	const activeCategoryNames = (0, import_react.useMemo)(() => dbCategories.map((c) => c.name), [dbCategories]);
	const [cat, setCat] = (0, import_react.useState)(null);
	const [shop, setShop] = (0, import_react.useState)(null);
	const [sort, setSort] = (0, import_react.useState)("popular");
	const list = (0, import_react.useMemo)(() => {
		let l = [...products];
		if (cat) l = l.filter((p) => p.category === cat);
		if (shop) l = l.filter((p) => p.workshop === shop);
		if (sort === "priceAsc") l.sort((a, b) => a.price - b.price);
		if (sort === "priceDesc") l.sort((a, b) => b.price - a.price);
		if (sort === "new") l.reverse();
		return l;
	}, [
		cat,
		shop,
		sort,
		products
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background pb-24 sm:pb-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-7xl px-5 pt-8 pb-4 sm:pt-12 sm:pb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-[#e0526c] dark:bg-rose-950/40 dark:text-rose-400",
							children: "🌸 Kolleksiya"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-3xl font-semibold tracking-tight sm:text-5xl",
							children: "Yangi gullar katalogi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground sm:text-base",
							children: "Har kuni yangi uzilgan gullar va ajoyib buketlar"
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shrink-0 text-sm font-medium text-muted-foreground",
						children: [
							"Jami: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-foreground",
								children: [list.length, " ta"]
							}),
							" gul"
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "sticky top-[65px] z-30 border-y border-border/60 bg-background/95 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-5 py-3 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 -mx-5 px-5 sm:mx-0 sm:px-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCat(null),
							className: `shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${cat === null ? "bg-foreground text-background shadow-sm" : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
							children: "🌸 Barcha gullar"
						}), activeCategoryNames.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCat(c),
							className: `shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${cat === c ? "bg-[#e0526c] text-white shadow-sm shadow-rose-500/20" : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
							children: c
						}, c))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/40 text-xs sm:text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 overflow-x-auto no-scrollbar",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground font-medium shrink-0",
									children: "Kelib chiqishi:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShop(null),
									className: `rounded-lg px-2.5 py-1 transition font-medium ${shop === null ? "bg-foreground/10 text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`,
									children: "Barchasi"
								}),
								workshops.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShop(w),
									className: `rounded-lg px-2.5 py-1 transition font-medium ${shop === w ? "bg-foreground/10 text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`,
									children: w
								}, w))
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 ml-auto",
							children: [(cat !== null || shop !== null) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setCat(null);
									setShop(null);
								},
								className: "text-xs text-[#e0526c] hover:underline font-medium",
								children: "Filtrlarni tozalash"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-muted-foreground text-xs sm:text-sm font-medium",
									children: "Saralash:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: sort,
									onChange: (e) => setSort(e.target.value),
									className: "rounded-xl border border-border bg-card px-3 py-1.5 text-xs sm:text-sm font-medium outline-none focus:border-[#e0526c] transition",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "popular",
											children: "🔥 Mashhurlik"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "new",
											children: "✨ Yangilari"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "priceAsc",
											children: "💰 Narx: arzon"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "priceDesc",
											children: "💎 Narx: qimmat"
										})
									]
								})]
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-7xl px-5 py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4",
					children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/product/$id",
						params: { id: p.slug },
						className: "group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card p-3 transition duration-300 hover:border-border hover:shadow-lg hover:-translate-y-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-square w-full overflow-hidden rounded-xl bg-secondary/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: productImage(p),
								alt: p.name,
								loading: "lazy",
								className: "h-full w-full object-cover transition duration-500 group-hover:scale-105"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute left-2.5 top-2.5 rounded-full bg-background/80 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-foreground shadow-sm",
								children: p.workshop
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-1 flex-col justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "line-clamp-1 font-medium text-foreground group-hover:text-[#e0526c] transition",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "line-clamp-1 text-xs text-muted-foreground mt-0.5",
								children: p.pattern
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between pt-2 border-t border-border/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold text-foreground",
									children: formatSom(p.price)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-rose-50 dark:bg-rose-950/50 p-1.5 text-[#e0526c] transition group-hover:bg-[#e0526c] group-hover:text-white",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
										className: "h-4 w-4",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor",
										strokeWidth: "2.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											d: "M12 4.5v15m7.5-7.5h-15"
										})
									})
								})]
							})]
						})]
					}, p.id))
				}), list.length === 0 && !isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground my-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-3xl mb-2",
							children: "🌸"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-foreground",
							children: "Ushbu filtr bo'yicha hech qanday gul topilmadi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm mt-1",
							children: "Boshqa kategoriyani tanlang yoki filtrlarni tozalang."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setCat(null);
								setShop(null);
							},
							className: "mt-4 rounded-full bg-[#e0526c] px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#d0425c] transition",
							children: "Barcha gullarni ko'rish"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileTabBar, {})
		]
	});
}
//#endregion
export { Catalog as component };
