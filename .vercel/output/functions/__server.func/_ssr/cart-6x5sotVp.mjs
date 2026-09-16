import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useCart } from "./router-Phzk9hL6.mjs";
import { n as formatSom } from "./products-B44v3hOB.mjs";
import { n as SiteFooter, r as SiteHeader, t as MobileTabBar } from "./site-footer-CusmjNK2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-6x5sotVp.js
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const { items, subtotal, count, setQty, remove, hydrated } = useCart();
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background pb-32 sm:pb-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-5xl px-5 pt-10 sm:pt-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-muted-foreground",
						children: "Savat"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-4xl sm:text-5xl",
						children: "Sizning tanlovingiz"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted-foreground",
						children: hydrated ? `${count} ta buyum` : "Yuklanmoqda..."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-5xl gap-10 px-5 py-10 md:grid-cols-[1fr_360px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [hydrated && items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-dashed border-border p-14 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-2xl",
							children: "Savat bo'sh"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Katalogdan yoqqan buyumingizni tanlang."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/catalog",
							className: "mt-6 inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90",
							children: "Katalogga o'tish"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border rounded-2xl border border-border bg-card",
					children: items.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-4 p-4 sm:p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/product/$id",
							params: { id: l.slug },
							className: "block h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-background sm:h-28 sm:w-28",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: l.image,
								alt: l.name,
								className: "h-full w-full object-cover"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 flex-1 flex-col",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/product/$id",
										params: { id: l.slug },
										className: "truncate font-medium hover:underline",
										children: l.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-0.5 truncate text-xs text-muted-foreground",
										children: [
											l.workshop,
											" · ",
											l.color
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => remove(l.slug, l.color),
									className: "shrink-0 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
									children: "O'chirish"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-auto flex items-end justify-between gap-3 pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center rounded-full border border-border bg-background",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setQty(l.slug, l.color, l.qty - 1),
											className: "px-3 py-1.5",
											children: "−"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-8 text-center text-sm",
											children: l.qty
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setQty(l.slug, l.color, l.qty + 1),
											className: "px-3 py-1.5",
											children: "+"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: formatSom(l.price * l.qty)
								})]
							})]
						})]
					}, `${l.slug}-${l.color}`))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "h-fit rounded-2xl border border-border bg-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-xl",
							children: "Buyurtma xulosasi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-5 space-y-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Buyumlar"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: count })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Yetkazish"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "Checkoutda hisoblanadi" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Jami" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatSom(subtotal) })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: !hydrated || items.length === 0,
							onClick: () => navigate({ to: "/checkout" }),
							className: "mt-6 w-full rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40",
							children: "Checkoutga o'tish →"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/catalog",
							className: "mt-3 block text-center text-sm text-muted-foreground underline-offset-4 hover:underline",
							children: "Xarid davom ettirish"
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
export { CartPage as component };
