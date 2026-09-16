import { i as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { a as require_jsx_runtime, o as require_react, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { _ as createRootRouteWithContext, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as stringType, n as literalType, r as objectType, t as enumType } from "../_libs/zod.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { k as Flower2 } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Phzk9hL6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-CYaUnisu.css";
var STORAGE_KEY = "sopol-cart-v2";
var CartContext = (0, import_react.createContext)(null);
function CartProvider({ children }) {
	const [items, setItems] = (0, import_react.useState)([]);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && typeof i.slug === "string"));
			}
		} catch {}
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
		} catch {}
	}, [items, hydrated]);
	const add = (0, import_react.useCallback)((product, color, qty = 1) => {
		setItems((prev) => {
			const idx = prev.findIndex((i) => i.slug === product.slug && i.color === color);
			if (idx >= 0) {
				const next = [...prev];
				next[idx] = {
					...next[idx],
					qty: Math.min(99, next[idx].qty + qty)
				};
				return next;
			}
			return [...prev, {
				slug: product.slug,
				name: product.name,
				price: product.price,
				image: product.image_url || "/products/hero-plate.jpg",
				workshop: product.workshop,
				color,
				qty: Math.max(1, qty)
			}];
		});
	}, []);
	const setQty = (0, import_react.useCallback)((slug, color, qty) => {
		setItems((prev) => prev.map((i) => i.slug === slug && i.color === color ? {
			...i,
			qty: Math.max(0, Math.min(99, qty))
		} : i).filter((i) => i.qty > 0));
	}, []);
	const remove = (0, import_react.useCallback)((slug, color) => {
		setItems((prev) => prev.filter((i) => !(i.slug === slug && i.color === color)));
	}, []);
	const clear = (0, import_react.useCallback)(() => setItems([]), []);
	const value = (0, import_react.useMemo)(() => {
		const count = items.reduce((s, l) => s + l.qty, 0);
		const subtotal = items.reduce((s, l) => s + l.qty * l.price, 0);
		return {
			items,
			count,
			subtotal,
			add,
			setQty,
			remove,
			clear,
			hydrated
		};
	}, [
		items,
		add,
		setQty,
		remove,
		clear,
		hydrated
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartContext.Provider, {
		value,
		children
	});
}
function useCart() {
	const ctx = (0, import_react.useContext)(CartContext);
	if (!ctx) throw new Error("useCart must be used within CartProvider");
	return ctx;
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$12 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Gagaren Gullari — Mirzacho'l tumani gul yetkazib berish" },
			{
				name: "description",
				content: "Yangi buketlar, atirgullar, tuvakdagi o'simliklar va sovg'a to'plamlari. Mirzacho'l tumani bo'ylab tanlagan kuningiz va vaqtingizda yetkazamiz."
			},
			{
				name: "author",
				content: "Gagaren Gullari"
			},
			{
				property: "og:title",
				content: "Gagaren Gullari — Mirzacho'l tumani gul yetkazib berish"
			},
			{
				property: "og:description",
				content: "Yangi buketlar, atirgullar, tuvakdagi o'simliklar va sovg'a to'plamlari. Tanlagan kuningizda yetkazamiz."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Gagaren Gullari — Mirzacho'l tumani gul yetkazib berish"
			},
			{
				name: "twitter:description",
				content: "Yangi buketlar, atirgullar va sovg'a to'plamlari — tanlagan kuningizda yetkazamiz."
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/logo.png",
				type: "image/png"
			},
			{
				rel: "apple-touch-icon",
				href: "/logo.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$12.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
	});
}
var $$splitComponentImporter$11 = () => import("./routes-C__VK6ck.mjs");
var Route$11 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Gagaren Gullari — Mirzacho'l tumani gul yetkazib berish" },
		{
			name: "description",
			content: "Yangi buketlar, atirgullar, tuvakdagi o'simliklar va sovg'a to'plamlari. Mirzacho'l tumani bo'ylab 2 soatda yetkazamiz."
		},
		{
			property: "og:title",
			content: "Gagaren Gullari — Mirzacho'l tumani gul yetkazib berish"
		},
		{
			property: "og:description",
			content: "Har kuni yangi kelgan gullardan yig'ilgan buketlar. 2 soat ichida yetkazib berish."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./admin-ciF37pXr.mjs");
var Route$10 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Gagaren Gullari — Do'kon Boshqaruvi" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./auth-D54jEMLM.mjs");
var Route$9 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Tizimga Kirish — Gagaren Gullari Manager" },
		{
			name: "description",
			content: "Admin panelga kirish."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
function SplashLoader() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#e0526c] via-[#d94460] to-[#b8324b] p-8 text-white font-sans",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center text-center space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-[#e0526c] shadow-2xl shadow-black/20 border-4 border-white/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flower2, { className: "h-12 w-12 stroke-[2.2]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] font-black tracking-widest uppercase mt-0.5",
							children: "GAGAREN"
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl font-bold font-display tracking-tight text-white drop-shadow-md",
							children: "Gagaren Gullari"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-black tracking-widest text-white/90 uppercase",
							children: "TOSHKENTDA GUL YETKAZIB BERISH"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-white/80 font-medium",
							children: "Yangi buketlar va sovg'a to'plamlari"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center space-y-3 w-full max-w-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1 w-36 overflow-hidden rounded-full bg-white/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-1/2 animate-[pulse_1s_infinite] rounded-full bg-white transition-all duration-500" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] font-semibold text-white/80 tracking-wider",
					children: "v2.2.52 • Gagaren Store"
				})]
			})
		]
	});
}
var $$splitComponentImporter$8 = () => import("./cart-6x5sotVp.mjs");
var Route$8 = createFileRoute("/cart")({
	head: () => ({ meta: [
		{ title: "Savat — Sopol Ustalari" },
		{
			name: "description",
			content: "Sizning tanlagan sopol buyumlaringiz savati."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./catalog-kpRGAoDx.mjs");
var Route$7 = createFileRoute("/catalog")({
	head: () => ({ meta: [
		{ title: "Katalog — Gagaren Gullari" },
		{
			name: "description",
			content: "Buketlar, atirgullar, tuvakdagi o'simliklar va sovg'a to'plamlari katalogi. Mirzacho'l tumani bo'ylab yetkazib berish."
		},
		{
			property: "og:title",
			content: "Katalog — Gagaren Gullari"
		},
		{
			property: "og:description",
			content: "Yangi gullar katalogini ko'ring va bugunoq yetkazib oling."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./checkout-CTT7GcMc.mjs");
var Route$6 = createFileRoute("/checkout")({
	head: () => ({ meta: [
		{ title: "Buyurtma berish — Sopol Ustalari" },
		{
			name: "description",
			content: "Buyurtmangizni rasmiylashtiring va biz bilan bog'laning."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
objectType({
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
var $$splitComponentImporter$5 = () => import("./track-C3lGlts2.mjs");
var Route$5 = createFileRoute("/track")({
	head: () => ({ meta: [
		{ title: "Buyurtmani kuzatish — Sopol Ustalari" },
		{
			name: "description",
			content: "Buyurtma raqami va telefon raqamingiz orqali buyurtmangiz holatini tekshiring."
		},
		{
			property: "og:title",
			content: "Buyurtmani kuzatish — Sopol Ustalari"
		},
		{
			property: "og:description",
			content: "Buyurtmangiz qayerda? Holatini bir daqiqada bilib oling."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin.index-D7sJfAxR.mjs");
var Route$4 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./admin.categories-Cf0XKi7q.mjs");
var Route$3 = createFileRoute("/admin/categories")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.orders-2BC2z2F6.mjs");
var Route$2 = createFileRoute("/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.products-D9sFx2DX.mjs");
var Route$1 = createFileRoute("/admin/products")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./product._id-BjbyIy4j.mjs");
var $$splitNotFoundComponentImporter = () => import("./product._id-BbObnW5t.mjs");
var Route = createFileRoute("/product/$id")({
	head: () => ({ meta: [{ title: "Mahsulot — Sopol Ustalari" }, {
		name: "description",
		content: "Qo'lda ishlangan sopol idish tafsilotlari."
	}] }),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$11.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$12
});
var AdminRoute = Route$10.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$12
});
var AuthRoute = Route$9.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$12
});
var CartRoute = Route$8.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$12
});
var CatalogRoute = Route$7.update({
	id: "/catalog",
	path: "/catalog",
	getParentRoute: () => Route$12
});
var CheckoutRoute = Route$6.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$12
});
var TrackRoute = Route$5.update({
	id: "/track",
	path: "/track",
	getParentRoute: () => Route$12
});
var AdminIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminCategoriesRoute = Route$3.update({
	id: "/categories",
	path: "/categories",
	getParentRoute: () => AdminRoute
});
var AdminOrdersRoute = Route$2.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AdminRoute
});
var AdminProductsRoute = Route$1.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AdminRoute
});
var ProductIdRoute = Route.update({
	id: "/product/$id",
	path: "/product/$id",
	getParentRoute: () => Route$12
});
var AdminRouteChildren = {
	AdminCategoriesRoute,
	AdminOrdersRoute,
	AdminProductsRoute,
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	AuthRoute,
	CartRoute,
	CatalogRoute,
	CheckoutRoute,
	TrackRoute,
	ProductIdRoute
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { useCart as i, Route as n, SplashLoader as r, router_exports as t };
