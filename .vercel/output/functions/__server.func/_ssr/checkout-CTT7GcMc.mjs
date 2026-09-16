import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as stringType, n as literalType, r as objectType, t as enumType } from "../_libs/zod.mjs";
import { i as useCart } from "./router-Phzk9hL6.mjs";
import { t as supabase } from "./client-C9TGADx0.mjs";
import { n as formatSom } from "./products-B44v3hOB.mjs";
import { i as sendTelegramOrderNotification } from "./telegram-DkxzySxY.mjs";
import { n as SiteFooter, r as SiteHeader, t as MobileTabBar } from "./site-footer-CusmjNK2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-CTT7GcMc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	name: stringType().trim().min(2, "Ismingizni to'liq kiriting").max(80),
	phone: stringType().trim().min(9, "Telefon raqam noto'g'ri").max(25).regex(/^[+\d\s()-]+$/i, "Faqat raqam va + belgisi"),
	address: stringType().trim().min(5, "Shahar, tuman va manzilni to'liq kiriting").max(300),
	note: stringType().trim().max(400).optional().or(literalType("")),
	method: enumType([
		"cash",
		"card",
		"transfer"
	])
});
function CheckoutPage() {
	const { items, subtotal, count, clear, hydrated } = useCart();
	const navigate = useNavigate();
	const [errors, setErrors] = (0, import_react.useState)({});
	const [submitted, setSubmitted] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [phoneValue, setPhoneValue] = (0, import_react.useState)("+998 ");
	const shipping = subtotal > 0 ? subtotal >= 5e5 ? 0 : 35e3 : 0;
	const total = subtotal + shipping;
	const onSubmit = async (e) => {
		e.preventDefault();
		if (saving) return;
		const fd = new FormData(e.currentTarget);
		const raw = {
			name: String(fd.get("name") ?? ""),
			phone: String(fd.get("phone") ?? ""),
			address: String(fd.get("address") ?? ""),
			note: String(fd.get("note") ?? ""),
			method: String(fd.get("method") ?? "cash")
		};
		const parsed = schema.safeParse(raw);
		if (!parsed.success) {
			const errs = {};
			for (const issue of parsed.error.issues) {
				const k = issue.path[0];
				if (k && !errs[k]) errs[k] = issue.message;
			}
			setErrors(errs);
			return;
		}
		setErrors({});
		setSaving(true);
		const payload = {
			customer_name: parsed.data.name,
			customer_phone: parsed.data.phone,
			customer_city: "Mirzacho'l tumani",
			customer_address: parsed.data.address,
			note: parsed.data.note || "",
			payment_method: parsed.data.method,
			items: items.map((i) => ({
				slug: i.slug,
				name: i.name,
				price: i.price,
				color: i.color,
				qty: i.qty,
				image: i.image
			})),
			subtotal,
			shipping,
			total
		};
		let orderId = "SO-" + Math.random().toString(36).substring(2, 8).toUpperCase();
		try {
			const { data, error } = await supabase.from("orders").insert(payload).select("id, order_number").maybeSingle();
			if (data?.order_number) orderId = data.order_number;
			else if (data?.id) orderId = "SO-" + String(data.id).slice(0, 6).toUpperCase();
			else if (error) console.warn("Supabase order insert notice:", error);
		} catch (err) {
			console.warn("Supabase orders save fallback triggered:", err);
		}
		setSaving(false);
		sendTelegramOrderNotification({
			orderId,
			customerName: parsed.data.name,
			customerPhone: parsed.data.phone,
			customerCity: "Mirzacho'l tumani",
			customerAddress: parsed.data.address,
			paymentMethod: parsed.data.method,
			note: parsed.data.note,
			subtotal,
			shipping,
			total,
			items: items.map((i) => ({
				name: i.name,
				color: i.color,
				qty: i.qty,
				price: i.price
			}))
		});
		setSubmitted({
			orderId,
			total
		});
		clear();
	};
	if (submitted) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background pb-24 sm:pb-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-2xl px-5 py-24 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto grid h-16 w-16 place-items-center rounded-full bg-[color:var(--terracotta)]/15 text-[color:var(--terracotta)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							width: "28",
							height: "28",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 13l4 4L19 7" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-6 font-display text-4xl",
						children: "Rahmat! Buyurtma qabul qilindi"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-muted-foreground",
						children: [
							"Buyurtma raqami:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: submitted.orderId
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-muted-foreground",
						children: ["Jami: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: formatSom(submitted.total)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm text-muted-foreground",
						children: "Menejerimiz 15 daqiqa ichida siz bilan bog'lanadi va yetkazib berishni tasdiqlaydi."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap justify-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/track",
								className: "rounded-full bg-[color:var(--terracotta)] px-6 py-3 text-sm font-medium text-background transition hover:opacity-90",
								children: "Buyurtmani kuzatish"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/catalog",
								className: "rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90",
								children: "Xarid davom ettirish"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition hover:bg-secondary",
								children: "Bosh sahifa"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileTabBar, {})
		]
	});
	if (hydrated && items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background pb-24 sm:pb-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-2xl px-5 py-24 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl",
						children: "Savat bo'sh"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted-foreground",
						children: "Avval katalogdan buyum tanlang."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => navigate({ to: "/catalog" }),
						className: "mt-6 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90",
						children: "Katalogga o'tish"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileTabBar, {})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background pb-32 sm:pb-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-5xl px-5 pt-10 sm:pt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-widest text-muted-foreground",
					children: "Buyurtma"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl sm:text-5xl",
					children: "Yetkazib berish"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				noValidate: true,
				className: "mx-auto grid max-w-5xl gap-10 px-5 py-10 md:grid-cols-[1fr_360px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Ism va familiya",
							name: "name",
							placeholder: "Alisher Karimov",
							error: errors.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Telefon raqam",
							name: "phone",
							type: "tel",
							value: phoneValue,
							onChange: (e) => setPhoneValue(e.target.value),
							placeholder: "+998 90 000 00 00",
							error: errors.phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Yetkazib berish manzili (Shahar, tuman va manzil)",
							name: "address",
							placeholder: "Masalan: Mirzacho'l tumani, Gagarin sh., Markaziy 14-uy",
							error: errors.address
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 text-sm font-medium",
							children: "To'lov usuli"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioTile, {
									name: "method",
									value: "cash",
									label: "Naqd",
									desc: "Qabulda to'lov",
									defaultChecked: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioTile, {
									name: "method",
									value: "card",
									label: "Payme / Click",
									desc: "Onlayn karta"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioTile, {
									name: "method",
									value: "transfer",
									label: "Bank o'tkazma",
									desc: "Yur. shaxslar"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-sm font-medium",
								children: "Izoh (ixtiyoriy)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								name: "note",
								rows: 3,
								maxLength: 400,
								placeholder: "Qo'shimcha ma'lumot yoki so'rov",
								className: "w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-foreground"
							}),
							errors.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs text-red-600",
								children: errors.note
							})
						] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "h-fit rounded-2xl border border-border bg-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-xl",
							children: "Buyurtma xulosasi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 max-h-64 space-y-3 overflow-y-auto pr-1 text-sm",
							children: items.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-background",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: l.image,
											alt: "",
											className: "h-full w-full object-cover"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-[13px] font-medium",
											children: l.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground",
											children: [
												l.color,
												" × ",
												l.qty
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "shrink-0 text-[13px] font-medium",
										children: formatSom(l.price * l.qty)
									})
								]
							}, `${l.slug}-${l.color}`))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-5 space-y-3 border-t border-border pt-5 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
										className: "text-muted-foreground",
										children: [
											"Buyumlar (",
											count,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatSom(subtotal) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Yetkazib berish"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: shipping === 0 ? "Bepul" : formatSom(shipping) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex justify-between border-t border-border pt-3 text-base font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Jami" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatSom(total) })]
								})
							]
						}),
						subtotal < 5e5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 text-[11px] text-muted-foreground",
							children: "500 000 so'mdan yuqori buyurtmalar uchun yetkazib berish bepul."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: saving,
							className: "mt-6 w-full rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50",
							children: saving ? "Saqlanmoqda…" : "Buyurtmani tasdiqlash"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileTabBar, {})
		]
	});
}
function Field({ label, name, type = "text", placeholder, value, onChange, error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "mb-2 block text-sm font-medium",
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			name,
			type,
			placeholder,
			value,
			onChange,
			className: `w-full rounded-full border bg-card px-5 py-3 text-sm outline-none transition focus:border-foreground ${error ? "border-red-500" : "border-border"}`
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 px-2 text-xs text-red-600",
			children: error
		})
	] });
}
function RadioTile({ name, value, label, desc, defaultChecked }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "relative flex cursor-pointer flex-col rounded-2xl border border-border bg-card p-4 transition hover:bg-secondary has-[:checked]:border-foreground has-[:checked]:bg-foreground has-[:checked]:text-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "radio",
				name,
				value,
				defaultChecked,
				className: "sr-only"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 text-[11px] opacity-80",
				children: desc
			})
		]
	});
}
//#endregion
export { CheckoutPage as component };
