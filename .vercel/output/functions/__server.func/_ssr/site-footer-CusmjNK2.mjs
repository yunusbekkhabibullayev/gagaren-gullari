import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Instagram, P as Clock, d as Send, y as MapPin } from "../_libs/lucide-react.mjs";
import { i as useCart } from "./router-Phzk9hL6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-footer-CusmjNK2.js
var import_jsx_runtime = require_jsx_runtime();
var logo_default = "/assets/logo-Cl-kLyyP.png";
function SiteHeader() {
	const { count, hydrated } = useCart();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 sm:flex sm:justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex min-w-0 items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: logo_default,
						alt: "Gagaren Gullari logo",
						className: "h-10 w-10 shrink-0 object-contain"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate font-display text-lg font-semibold tracking-tight",
						children: "Gagaren Gullari"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-8 text-sm text-muted-foreground sm:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							activeOptions: { exact: true },
							activeProps: { className: "text-foreground" },
							className: "transition hover:text-foreground",
							children: "Bosh sahifa"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/catalog",
							activeProps: { className: "text-foreground" },
							className: "transition hover:text-foreground",
							children: "Katalog"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#hunar",
							className: "transition hover:text-foreground",
							children: "Yetkazib berish"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "tel:+998990000000",
							className: "hidden items-center gap-2 rounded-full bg-[color:var(--terracotta)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 sm:inline-flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPhone, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "+998 99 000 00 00" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/cart",
							"aria-label": "Savat",
							className: "relative hidden shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-secondary sm:inline-flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBag, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Savat" }),
								hydrated && count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-foreground px-1.5 text-[11px] font-semibold text-background",
									children: count
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "tel:+998990000000",
							"aria-label": "Qo'ng'iroq qilish",
							className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--terracotta)] text-white shadow-sm transition hover:opacity-90 sm:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPhone, {})
						})
					]
				})
			]
		})
	});
}
function MobileTabBar() {
	const { count, hydrated } = useCart();
	const item = "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] text-muted-foreground transition";
	const active = "text-foreground";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] sm:hidden",
		"aria-label": "Mobil navigatsiya",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					activeOptions: { exact: true },
					activeProps: { className: active },
					className: item,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconHome, {}), " Bosh"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/catalog",
					activeProps: { className: active },
					className: item,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconGrid, {}), " Katalog"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/cart",
					activeProps: { className: active },
					className: `${item} relative`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBag, {}), hydrated && count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background",
							children: count
						})]
					}), "Savat"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#aloqa",
					className: item,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconUser, {}), " Aloqa"]
				})
			]
		})
	});
}
function IconHome() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "20",
		height: "20",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.6",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 10.5 12 3l9 7.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 9.5V21h14V9.5" })]
	});
}
function IconGrid() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "20",
		height: "20",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.6",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "3",
				y: "3",
				width: "7",
				height: "7",
				rx: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "14",
				y: "3",
				width: "7",
				height: "7",
				rx: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "3",
				y: "14",
				width: "7",
				height: "7",
				rx: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "14",
				y: "14",
				width: "7",
				height: "7",
				rx: "1.5"
			})
		]
	});
}
function IconUser() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "20",
		height: "20",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.6",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "8",
			r: "4"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 21c1.5-4 5-6 8-6s6.5 2 8 6" })]
	});
}
function IconBag() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "20",
		height: "20",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.6",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6 7h12l-1 13H7L6 7Z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 7a3 3 0 0 1 6 0" })]
	});
}
function IconPhone() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		width: "16",
		height: "16",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.92a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92Z" })
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		id: "aloqa",
		className: "mt-24 border-t border-border/60 bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-5 py-14 sm:py-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "petal-divider mb-10",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-10 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-xl font-semibold",
									children: "Gagaren Gullari"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-muted-foreground leading-relaxed",
									children: "Har kuni yangi kelgan gullardan yig'ilgan mualliflik buketlari. Mirzacho'l tumani bo'ylab 2 soat ichida yetkazib beramiz."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "https://www.instagram.com/gagarin_gullari",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-[#e0526c] transition hover:bg-[#e0526c] hover:text-white",
										title: "Instagram @gagarin_gullari",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "https://t.me/gagarin_gullari",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition hover:bg-sky-600 hover:text-white",
										title: "Telegram @gagarin_gullari",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-5 w-5" })
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: "Bog'lanish"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-2.5 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-4 w-4 text-[#e0526c]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "https://www.instagram.com/gagarin_gullari",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "hover:text-foreground hover:underline font-medium",
										children: "@gagarin_gullari"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4 text-sky-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "https://t.me/gagarin_gullari",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "hover:text-foreground hover:underline font-medium",
										children: "@gagarin_gullari"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Har kuni 08:00 – 22:00" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mirzacho'l tumani" })]
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: "Navigatsiya"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-2 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									className: "underline-offset-4 hover:text-foreground hover:underline",
									children: "Bosh sahifa"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/catalog",
									className: "underline-offset-4 hover:text-foreground hover:underline",
									children: "Gullar katalogi"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/track",
									className: "underline-offset-4 hover:text-foreground hover:underline",
									children: "Buyurtmani kuzatish"
								}) })
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: "Kafolat & Xizmat"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-2 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "✓ 100% Yangi gullar kafolati" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "✓ 2 soatda tezkor yetkazib berish" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "✓ Rasm va vido hisobot" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "✓ Bepul tabriknoma karta" })
							]
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border/40 pt-6 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Gagaren Gullari. Barcha huquqlar himoyalangan."
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://www.instagram.com/gagarin_gullari",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "hover:underline",
								children: "Instagram"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://t.me/gagarin_gullari",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "hover:underline",
								children: "Telegram"
							})
						]
					})]
				})
			]
		})
	});
}
//#endregion
export { logo_default as i, SiteFooter as n, SiteHeader as r, MobileTabBar as t };
