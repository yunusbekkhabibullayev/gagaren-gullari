import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as ChartColumn, N as DollarSign, P as Clock, V as Calendar, c as Sparkles, l as ShoppingBag, m as Plus, p as RefreshCw } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-C9TGADx0.mjs";
import { n as formatSom } from "./products-B44v3hOB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-D7sJfAxR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboard() {
	const [period, setPeriod] = (0, import_react.useState)("7");
	const stats = useQuery({
		queryKey: ["admin-stats-full"],
		queryFn: async () => {
			const [productsRes, categoriesRes, ordersRes] = await Promise.all([
				supabase.from("products").select("id", { count: "exact" }),
				supabase.from("categories").select("id", { count: "exact" }),
				supabase.from("orders").select("id, total, created_at, status")
			]);
			const productsCount = productsRes.count ?? 0;
			const categoriesCount = categoriesRes.count ?? 0;
			const orders = ordersRes.data ?? [];
			return {
				productsCount,
				categoriesCount,
				totalOrdersCount: orders.length,
				totalRevenue: orders.reduce((sum, o) => sum + Number(o.total || 0), 0),
				pendingOrdersCount: orders.filter((o) => o.status === "new" || o.status === "pending").length,
				orders
			};
		}
	});
	const currentDate = (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace("T", " ");
	const chartData = (0, import_react.useMemo)(() => {
		const orders = stats.data?.orders ?? [];
		const daysLimit = Number(period);
		const cutoffTime = Date.now() - daysLimit * 864e5;
		const filteredOrders = orders.filter((o) => new Date(o.created_at).getTime() >= cutoffTime);
		const dayNames = [
			{
				key: 1,
				label: "Dush",
				full: "Dushanba"
			},
			{
				key: 2,
				label: "Sesh",
				full: "Seshanba"
			},
			{
				key: 3,
				label: "Chor",
				full: "Chorshanba"
			},
			{
				key: 4,
				label: "Pay",
				full: "Payshanba"
			},
			{
				key: 5,
				label: "Juma",
				full: "Juma"
			},
			{
				key: 6,
				label: "Shan",
				full: "Shanba"
			},
			{
				key: 0,
				label: "Yak",
				full: "Yakshanba"
			}
		];
		const dailySums = {
			0: 0,
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
			6: 0
		};
		filteredOrders.forEach((o) => {
			const day = new Date(o.created_at).getDay();
			dailySums[day] = (dailySums[day] || 0) + Number(o.total || 0);
		});
		const maxSum = Math.max(...Object.values(dailySums), 1);
		const bars = dayNames.map((d) => {
			const sum = dailySums[d.key] || 0;
			const heightPercent = sum > 0 ? Math.max(15, Math.round(sum / maxSum * 100)) : 6;
			return {
				label: d.label,
				full: d.full,
				sum,
				heightPercent
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
			topDay
		};
	}, [stats.data, period]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-200",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500 animate-pulse" }), "Do'kon onlayn & faol"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 text-xs font-semibold text-slate-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5" }), currentDate]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-3 font-extrabold font-display text-slate-900 text-2xl sm:text-3xl tracking-tight",
								children: "XUSH KELIBSIZ, Admin 👋"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-slate-500",
								children: "Bugungi umumiy savdo va operatsiyalar holati"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => stats.refetch(),
							className: "inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-4 w-4 text-slate-500 ${stats.isFetching ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Yangilash" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/products",
							className: "inline-flex items-center gap-2 rounded-2xl bg-[#e0526c] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-200 hover:bg-[#ce425b] transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 stroke-[3]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mahsulot qo'shish" })]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-extrabold tracking-wider text-slate-400 uppercase",
								children: "BUGUNGI BUYURTMALAR"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-[#e0526c]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-5 w-5" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-extrabold text-slate-900",
								children: stats.data ? `${stats.data.totalOrdersCount} ta` : "0 ta"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin/orders",
								className: "mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#e0526c] hover:underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Barcha buyurtmalar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "→" })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-extrabold tracking-wider text-slate-400 uppercase",
								children: "UMUMIY TUSHUM"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-5 w-5" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl sm:text-3xl font-extrabold text-slate-900",
								children: formatSom(stats.data?.totalRevenue ?? 0)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 text-xs font-semibold text-slate-500",
								children: ["Jami tushum: ", formatSom(stats.data?.totalRevenue ?? 0)]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-extrabold tracking-wider text-slate-400 uppercase",
								children: "KATALOGDAGI TOVARLAR"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-extrabold text-slate-900",
								children: stats.data ? `${stats.data.productsCount} ta tovar` : "0 ta tovar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin/categories",
								className: "mt-3 inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [stats.data?.categoriesCount ?? 0, " ta faol toifa"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "→" })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-extrabold tracking-wider text-slate-400 uppercase",
								children: "KUTILAYOTGANLAR"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-extrabold text-slate-900",
								children: stats.data ? `${stats.data.pendingOrdersCount} ta yangi` : "0 ta yangi"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center gap-1 text-xs font-bold text-amber-600",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ko'rib chiqish zarur" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⚡" })]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-[#e0526c]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-bold text-slate-900 text-lg font-display",
								children: "Savdo Dinamikasi & Tushum Grafigi"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-500 font-medium",
								children: "Do'konning kunlik savdo ko'rsatkichlari va tushum tahlili"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 rounded-2xl bg-slate-100 p-1 text-xs font-bold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setPeriod("7"),
									className: `rounded-xl px-3 py-1.5 transition ${period === "7" ? "bg-[#e0526c] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
									children: "7 kun"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setPeriod("14"),
									className: `rounded-xl px-3 py-1.5 transition ${period === "14" ? "bg-[#e0526c] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
									children: "14 kun"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setPeriod("30"),
									className: `rounded-xl px-3 py-1.5 transition ${period === "30" ? "bg-[#e0526c] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
									children: "30 kun"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-48 w-full rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-end justify-between gap-2 sm:gap-4",
						children: chartData.bars.map((bar, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 flex flex-col items-center gap-2 group h-full justify-end relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg transition shadow-md whitespace-nowrap z-10",
									children: [
										bar.full,
										": ",
										formatSom(bar.sum)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: `${bar.heightPercent}%` },
									className: "w-full max-w-[36px] rounded-t-xl bg-gradient-to-t from-[#e0526c] to-[#f4728b] group-hover:from-[#ce425b] group-hover:to-[#e0526c] transition-all duration-300 shadow-sm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold text-slate-400",
									children: bar.label
								})
							]
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-slate-50 p-4 border border-slate-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-extrabold tracking-wider text-slate-400 uppercase",
									children: "DAVR BO'YICHA JAMI"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5 text-lg font-extrabold text-slate-900",
									children: formatSom(chartData.periodTotal)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-slate-50 p-4 border border-slate-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-extrabold tracking-wider text-slate-400 uppercase",
									children: "KUNLIK O'RTACHA"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5 text-lg font-extrabold text-slate-900",
									children: formatSom(chartData.dailyAvg)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-slate-50 p-4 border border-slate-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-extrabold tracking-wider text-slate-400 uppercase",
									children: "O'RTACHA CHEK (AOV)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5 text-lg font-extrabold text-slate-900",
									children: formatSom(chartData.aov)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-slate-50 p-4 border border-slate-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-extrabold tracking-wider text-slate-400 uppercase",
									children: "ENG YUQORI KUN"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5 text-sm font-bold text-[#e0526c]",
									children: chartData.topDay.sum > 0 ? `${chartData.topDay.full} — ${formatSom(chartData.topDay.sum)}` : "Mavjud emas (0 so'm)"
								})]
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { AdminDashboard as component };
