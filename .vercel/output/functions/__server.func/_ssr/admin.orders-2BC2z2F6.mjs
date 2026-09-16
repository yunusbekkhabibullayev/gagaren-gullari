import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { A as Eye, M as ExternalLink, U as Bot, d as Send, f as Search, h as Phone, l as ShoppingBag, n as X, r as User, y as MapPin } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-C9TGADx0.mjs";
import { n as formatSom } from "./products-B44v3hOB.mjs";
import { i as sendTelegramOrderNotification, n as getSavedTelegramChatId, r as saveTelegramChatId, t as autoDetectTelegramChatId } from "./telegram-DkxzySxY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders-2BC2z2F6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var statusMap = {
	new: {
		label: "Kutilmoqda",
		bg: "bg-amber-50",
		text: "text-amber-600"
	},
	pending: {
		label: "Kutilmoqda",
		bg: "bg-amber-50",
		text: "text-amber-600"
	},
	preparing: {
		label: "Tayyorlanmoqda",
		bg: "bg-blue-50",
		text: "text-blue-600"
	},
	ready: {
		label: "Tayyorlandi",
		bg: "bg-teal-50",
		text: "text-teal-600"
	},
	delivering: {
		label: "Yo'lda",
		bg: "bg-purple-50",
		text: "text-purple-600"
	},
	completed: {
		label: "Yetkazildi",
		bg: "bg-emerald-50",
		text: "text-emerald-600"
	},
	delivered: {
		label: "Yetkazildi",
		bg: "bg-emerald-50",
		text: "text-emerald-600"
	},
	cancelled: {
		label: "Bekor qilingan",
		bg: "bg-red-50",
		text: "text-red-600"
	}
};
function AdminOrdersPage() {
	const qc = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [selectedStatus, setSelectedStatus] = (0, import_react.useState)("all");
	const [selectedOrder, setSelectedOrder] = (0, import_react.useState)(null);
	const [telegramChatId, setTelegramChatId] = (0, import_react.useState)(() => getSavedTelegramChatId() || "");
	const [telegramTesting, setTelegramTesting] = (0, import_react.useState)(false);
	const [telegramStatusMsg, setTelegramStatusMsg] = (0, import_react.useState)(null);
	const handleSaveTelegramChatId = (val) => {
		setTelegramChatId(val);
		saveTelegramChatId(val);
		setTelegramStatusMsg("✓ Chat ID saqlandi!");
		setTimeout(() => setTelegramStatusMsg(null), 3e3);
	};
	const handleAutoDetectTelegram = async () => {
		setTelegramTesting(true);
		setTelegramStatusMsg("Bot xabarlari tekshirilmoqda...");
		const detected = await autoDetectTelegramChatId();
		setTelegramTesting(false);
		if (detected) {
			setTelegramChatId(detected);
			setTelegramStatusMsg(`✓ Chat ID aniqlandi: ${detected}`);
		} else setTelegramStatusMsg("⚠️ Chat ID topilmadi. Avval Telegram botingizga /start bosing va qayta bosing!");
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
			subtotal: 15e4,
			shipping: 0,
			total: 15e4,
			items: [{
				name: "Oq Pion Buketi",
				color: "Oq",
				qty: 1,
				price: 15e4
			}]
		});
		setTelegramTesting(false);
		if (ok) setTelegramStatusMsg("✅ Test xabari Telegram botga muvaffaqiyatli yuborildi!");
		else setTelegramStatusMsg("❌ Xabar yuborishda xatolik. Chat ID tog'riligini tekshiring.");
	};
	const ordersQuery = useQuery({
		queryKey: ["admin-orders"],
		queryFn: async () => {
			const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const orders = ordersQuery.data ?? [];
	const updateStatusMutation = useMutation({
		mutationFn: async ({ id, status }) => {
			const { error } = await supabase.from("orders").update({ status }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-orders"] });
			if (selectedOrder) setSelectedOrder((prev) => prev ? {
				...prev,
				status: prev.status
			} : null);
		},
		onError: (err) => alert("Xatolik: " + err.message)
	});
	const filtered = (0, import_react.useMemo)(() => {
		const searchLower = (search ?? "").toLowerCase();
		return orders.filter((o) => {
			const code = (o.code ?? "").toLowerCase();
			const name = (o.customer_name ?? "").toLowerCase();
			const phone = o.customer_phone ?? "";
			const address = (o.customer_address ?? "").toLowerCase();
			if (!(code.includes(searchLower) || name.includes(searchLower) || phone.includes(search) || address.includes(searchLower))) return false;
			if (selectedStatus === "all") return true;
			return o.status === selectedStatus;
		});
	}, [
		orders,
		search,
		selectedStatus
	]);
	const counts = (0, import_react.useMemo)(() => {
		return {
			all: orders.length,
			pending: orders.filter((o) => o.status === "new" || o.status === "pending").length,
			preparing: orders.filter((o) => o.status === "preparing").length,
			ready: orders.filter((o) => o.status === "ready").length,
			delivering: orders.filter((o) => o.status === "delivering").length,
			completed: orders.filter((o) => o.status === "completed" || o.status === "delivered").length,
			cancelled: orders.filter((o) => o.status === "cancelled").length
		};
	}, [orders]);
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
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-6 w-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-extrabold text-slate-900 text-2xl tracking-tight",
							children: "BUYURTMALAR"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-slate-500",
							children: "Xaridorlar buyurtmalari va yetkazib berish holati"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-2xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700",
							children: [
								"Jami buyurtmalar: ",
								orders.length,
								" ta"
							]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-50/80 via-indigo-50/40 to-white p-6 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-md shadow-sky-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-6 w-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-slate-900 text-base",
								children: "Telegram Bot Bildirishnomasi"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }), "Bot Ulangan"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-600 mt-1",
							children: "Yangi buyurtma tushganda avtomatik Telegram botingizga xabar boradi."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 pt-2 md:pt-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "Telegram Chat ID",
									value: telegramChatId,
									onChange: (e) => handleSaveTelegramChatId(e.target.value),
									className: "w-44 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold outline-none focus:border-sky-500 shadow-sm transition"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleAutoDetectTelegram,
								disabled: telegramTesting,
								className: "rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm",
								title: "Telegram botingizga yozgan foydalanuvchidan Chat ID topish",
								children: "🔍 Auto-detect"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleSendTestTelegram,
								disabled: telegramTesting,
								className: "inline-flex items-center gap-1.5 rounded-2xl bg-sky-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-sky-200 hover:bg-sky-600 disabled:opacity-50 transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: telegramTesting ? "Yuborilmoqda..." : "Test Xabar" })]
							})
						]
					})]
				}), telegramStatusMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 text-xs font-semibold text-sky-900 bg-sky-100/70 rounded-xl px-3.5 py-2",
					children: telegramStatusMsg
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 max-w-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							placeholder: "Mijoz ismi, ID (#34), telefon yoki manzil...",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							className: "w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:border-red-600 focus:bg-white transition"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-xs font-bold text-slate-600",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-slate-400 uppercase tracking-wider mr-1",
								children: "Sana:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "rounded-xl bg-slate-900 px-3 py-1.5 text-white shadow-sm",
								children: "Barchasi"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "rounded-xl bg-slate-100 px-3 py-1.5 hover:bg-slate-200 transition",
								children: "Bugun"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "rounded-xl bg-slate-100 px-3 py-1.5 hover:bg-slate-200 transition",
								children: "Kecha"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "rounded-xl bg-slate-100 px-3 py-1.5 hover:bg-slate-200 transition",
								children: "Bu hafta"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 no-scrollbar",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedStatus("all"),
							className: `rounded-2xl px-4 py-2 text-xs font-bold shrink-0 transition ${selectedStatus === "all" ? "bg-red-600 text-white shadow-md shadow-red-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
							children: ["Barchasi ", counts.all]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedStatus("pending"),
							className: `rounded-2xl px-4 py-2 text-xs font-bold shrink-0 transition ${selectedStatus === "pending" ? "bg-amber-500 text-white shadow-md" : "bg-amber-50 text-amber-600 hover:bg-amber-100"}`,
							children: ["Kutilmoqda ", counts.pending]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedStatus("preparing"),
							className: `rounded-2xl px-4 py-2 text-xs font-bold shrink-0 transition ${selectedStatus === "preparing" ? "bg-blue-600 text-white shadow-md" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`,
							children: ["Tayyorlanmoqda ", counts.preparing]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedStatus("ready"),
							className: `rounded-2xl px-4 py-2 text-xs font-bold shrink-0 transition ${selectedStatus === "ready" ? "bg-teal-600 text-white shadow-md" : "bg-teal-50 text-teal-600 hover:bg-teal-100"}`,
							children: ["Tayyorlandi ", counts.ready]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedStatus("delivering"),
							className: `rounded-2xl px-4 py-2 text-xs font-bold shrink-0 transition ${selectedStatus === "delivering" ? "bg-purple-600 text-white shadow-md" : "bg-purple-50 text-purple-600 hover:bg-purple-100"}`,
							children: ["Yo'lda ", counts.delivering]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedStatus("completed"),
							className: `rounded-2xl px-4 py-2 text-xs font-bold shrink-0 transition ${selectedStatus === "completed" ? "bg-emerald-600 text-white shadow-md" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`,
							children: ["Yetkazildi ", counts.completed]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedStatus("cancelled"),
							className: `rounded-2xl px-4 py-2 text-xs font-bold shrink-0 transition ${selectedStatus === "cancelled" ? "bg-red-600 text-white shadow-md" : "bg-red-50 text-red-600 hover:bg-red-100"}`,
							children: ["Bekor qilingan ", counts.cancelled]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden",
				children: ordersQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid min-h-[300px] place-items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent" })
				}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-12 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "mx-auto h-12 w-12 text-slate-300" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-4 text-base font-bold text-slate-800",
							children: "Buyurtma topilmadi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-slate-500",
							children: "Ushbu mezon bo'yicha hech qanday buyurtma mavjud emas"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-200/80",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "#ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "XARIDOR"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "YETKAZISH MANZILI"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "MAHSULOTLAR"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "JAMI SUMMA"
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
							children: filtered.map((o) => {
								const statusInfo = statusMap[o.status] || {
									label: o.status,
									bg: "bg-slate-100",
									text: "text-slate-600"
								};
								const itemsSummary = Array.isArray(o.items) ? o.items.map((i) => `${i?.name || i?.title || "Tovar"} (${i?.quantity || 1} dona)`).join(", ") : "Maxsus buyurtma";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-slate-50/80 transition",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-6 py-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded-xl bg-slate-900 px-2.5 py-1 text-xs font-mono font-bold text-white shadow-sm",
												children: ["#", o.code ? o.code.slice(-4) : o.id.slice(0, 4)]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-6 py-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-bold text-slate-900",
												children: o.customer_name || "Noma'lum"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-slate-400 flex items-center gap-1 mt-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" }), o.customer_phone || "Mavjud emas"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-6 py-4 max-w-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "truncate text-xs font-semibold text-slate-700",
												children: [o.customer_city ? `${o.customer_city}, ` : "", o.customer_address || "Manzil ko'rsatilmagan"]
											}), o.customer_address && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: `https://maps.google.com/?q=${encodeURIComponent(o.customer_address)}`,
												target: "_blank",
												rel: "noreferrer",
												className: "inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:underline mt-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Xarita" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-6 py-4 max-w-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-xs font-medium text-slate-600",
												title: itemsSummary,
												children: itemsSummary
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-6 py-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-extrabold text-slate-900",
												children: formatSom(o.total || 0)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[11px] text-slate-400 capitalize",
												children: o.payment_method === "cash" ? "Naqd pul" : o.payment_method === "card" ? "Karta orqali" : o.payment_method || "Ko'rsatilmagan"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-6 py-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusInfo.bg} ${statusInfo.text}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current" }), statusInfo.label]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-6 py-4 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => setSelectedOrder(o),
												className: "inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Batafsil" })]
											})
										})
									]
								}, o.id);
							})
						})]
					})
				})
			}),
			selectedOrder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-slate-100 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-extrabold text-slate-900 text-lg",
								children: ["Buyurtma #", selectedOrder.code || selectedOrder.id.slice(0, 6)]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-slate-400",
								children: ["Sana: ", new Date(selectedOrder.created_at).toLocaleString("uz-UZ")]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedOrder(null),
								className: "rounded-full p-2 text-slate-400 hover:bg-slate-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 font-bold text-slate-900 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-slate-500" }), selectedOrder.customer_name || "Noma'lum mijoz"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-slate-600 font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-slate-400" }), selectedOrder.customer_phone || "Mavjud emas"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-slate-600",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-slate-400" }),
										selectedOrder.customer_city ? `${selectedOrder.customer_city}, ` : "",
										selectedOrder.customer_address || "Manzil yo'q"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5",
							children: "Buyurtma Holatini O'zgartirish"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: selectedOrder.status,
							onChange: (e) => {
								const newStatus = e.target.value;
								setSelectedOrder((prev) => prev ? {
									...prev,
									status: newStatus
								} : null);
								updateStatusMutation.mutate({
									id: selectedOrder.id,
									status: newStatus
								});
							},
							className: "w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-bold outline-none focus:border-red-600",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "new",
									children: "Kutilmoqda (Yangi)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "preparing",
									children: "Tayyorlanmoqda"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "ready",
									children: "Tayyorlandi"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "delivering",
									children: "Yo'lda"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "completed",
									children: "Yetkazildi (Yakunlandi)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "cancelled",
									children: "Bekor qilingan"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t border-slate-100 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold text-slate-600",
								children: "Jami summasi:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xl font-extrabold text-red-600",
								children: formatSom(selectedOrder.total || 0)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedOrder(null),
								className: "rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800",
								children: "Yopish"
							})
						})
					]
				})
			})
		]
	});
}
//#endregion
export { AdminOrdersPage as component };
