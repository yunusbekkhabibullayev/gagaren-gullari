import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { I as isRedirect, b as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as stringType, r as objectType } from "../_libs/zod.mjs";
import { n as formatSom } from "./products-B44v3hOB.mjs";
import { n as SiteFooter, r as SiteHeader, t as MobileTabBar } from "./site-footer-CusmjNK2.mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./server-DSncFkQe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/track-C3lGlts2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var trackSchema = objectType({
	orderNumber: stringType().trim().min(3).max(40),
	phone: stringType().trim().min(7).max(20)
});
var trackOrder = createServerFn({ method: "POST" }).inputValidator((data) => trackSchema.parse(data)).handler(createSsrRpc("d74efaed9d368b50c737966712aaf37f9bc30edca8be1eed754f166b39b69dcd"));
var STEPS = [
	{
		key: "new",
		label: "Qabul qilindi"
	},
	{
		key: "confirmed",
		label: "Tasdiqlandi"
	},
	{
		key: "shipped",
		label: "Yo'lda"
	},
	{
		key: "delivered",
		label: "Yetkazildi"
	}
];
var STATUS_LABEL = {
	new: "Qabul qilindi",
	confirmed: "Tasdiqlandi",
	shipped: "Yo'lda",
	delivered: "Yetkazildi",
	cancelled: "Bekor qilindi"
};
function TrackPage() {
	const track = useServerFn(trackOrder);
	const [notFound, setNotFound] = (0, import_react.useState)(false);
	const [order, setOrder] = (0, import_react.useState)(null);
	const lookup = useMutation({
		mutationFn: (vars) => track({ data: vars }),
		onSuccess: (res) => {
			setOrder(res.order);
			setNotFound(!res.order);
		}
	});
	const onSubmit = (e) => {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const orderNumber = String(fd.get("orderNumber") ?? "").trim();
		const phone = String(fd.get("phone") ?? "").trim();
		if (orderNumber.length < 3 || phone.replace(/\D/g, "").length < 7) {
			setOrder(null);
			setNotFound(true);
			return;
		}
		setOrder(null);
		setNotFound(false);
		lookup.mutate({
			orderNumber,
			phone
		});
	};
	const cancelled = order?.status === "cancelled";
	const activeIndex = order ? STEPS.findIndex((s) => s.key === order.status) : -1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background pb-24 sm:pb-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-3xl px-5 pt-10 sm:pt-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-muted-foreground",
						children: "Kuzatish"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-4xl sm:text-5xl",
						children: "Buyurtmangiz qayerda?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-muted-foreground",
						children: "Buyurtma raqami va rasmiylashtirishda kiritgan telefon raqamingizni yozing."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "mt-8 grid gap-3 sm:grid-cols-[1fr_1fr_auto]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "orderNumber",
								placeholder: "SO-XXXXXX",
								className: "rounded-full border border-border bg-card px-5 py-3 text-sm outline-none transition focus:border-foreground"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "phone",
								type: "tel",
								placeholder: "+998 90 000 00 00",
								className: "rounded-full border border-border bg-card px-5 py-3 text-sm outline-none transition focus:border-foreground"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: lookup.isPending,
								className: "rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50",
								children: lookup.isPending ? "Qidirilmoqda…" : "Tekshirish"
							})
						]
					}),
					notFound && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground",
						children: "Bunday buyurtma topilmadi. Raqam va telefonni tekshirib, qayta urinib ko'ring."
					}),
					lookup.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 rounded-2xl border border-border bg-card p-5 text-sm text-red-600",
						children: "Xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring."
					}),
					order && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-2xl",
									children: order.orderNumber
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted-foreground",
									children: new Date(order.createdAt).toLocaleDateString("uz-UZ")
								})]
							}),
							cancelled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 rounded-2xl bg-secondary px-4 py-3 text-sm",
								children: "Buyurtma bekor qilingan. Savollar bo'lsa biz bilan bog'laning."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "mt-6 grid gap-4 sm:grid-cols-4",
								children: STEPS.map((s, i) => {
									const done = i <= activeIndex;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-3 sm:block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-medium ${done ? "bg-[color:var(--terracotta)] text-background" : "border border-border text-muted-foreground"}`,
											children: i + 1
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-sm sm:mt-2 sm:block ${done ? "" : "text-muted-foreground"}`,
											children: s.label
										})]
									}, s.key);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 text-sm text-muted-foreground",
								children: [
									"Holat:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: STATUS_LABEL[order.status] ?? order.status
									}),
									" · ",
									"Shahar: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: order.city
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-6 space-y-3 border-t border-border pt-5 text-sm",
								children: order.items.map((l, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-3",
									children: [
										l.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
												className: "truncate font-medium",
												children: l.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground",
												children: [l.color ? `${l.color} × ` : "× ", l.qty]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "shrink-0 font-medium",
											children: formatSom(l.price * l.qty)
										})
									]
								}, idx))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-5 space-y-2 border-t border-border pt-5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Yetkazib berish"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: order.shipping === 0 ? "Bepul" : formatSom(order.shipping) })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-base font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Jami" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatSom(order.total) })]
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileTabBar, {})
		]
	});
}
//#endregion
export { TrackPage as component };
