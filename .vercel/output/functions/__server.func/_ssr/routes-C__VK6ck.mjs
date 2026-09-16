import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useCategories } from "./categories-oyDoVC2I.mjs";
import { i as productImage, n as formatSom, s as useProducts } from "./products-B44v3hOB.mjs";
import { i as logo_default, n as SiteFooter, r as SiteHeader, t as MobileTabBar } from "./site-footer-CusmjNK2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C__VK6ck.js
var import_jsx_runtime = require_jsx_runtime();
var flower_hero_default = "/assets/flower-hero-BvYAU0WA.jpg";
function Home() {
	const { data: products = [] } = useProducts();
	const { data: categories = [] } = useCategories();
	const featured = products.slice(0, 4);
	const categoryImages = {};
	for (const c of categories) {
		const p = products.find((x) => x.category === c.name);
		if (p) categoryImages[c.name] = productImage(p);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background pb-20 sm:pb-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-7xl items-center gap-12 px-5 pt-10 pb-16 sm:pt-20 sm:pb-28 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 animate-fade-in",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-[color:var(--terracotta)]" }), "Mirzacho'l tumani"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-6 font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl",
								children: [
									"Gullar bilan",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "italic text-[color:var(--terracotta)]",
										children: "aytilgan so'z"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 max-w-md text-lg text-muted-foreground",
								children: "Har kuni ertalab yangi kelgan gullardan yig'ilgan buketlar. Yetkazish kunini va vaqtini o'zingiz tanlaysiz."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/catalog",
									className: "inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90",
									children: "Buketlarni ko'rish →"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#hunar",
									className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition hover:bg-secondary",
									children: "Yetkazib berish"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-12 grid max-w-md grid-cols-3 gap-6 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Yetkazish",
										value: "15 daqiqa"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Florist",
										value: "8"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Buket",
										value: products.length > 0 ? `${products.length}+` : "..."
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-6 -z-10 rounded-full bg-[color:var(--saffron)]/25 blur-3xl" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative aspect-square overflow-hidden rounded-[2rem] bg-card shadow-2xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: flower_hero_default,
									alt: "Pushti va krem atirgullardan yig'ilgan buket",
									width: 1408,
									height: 1408,
									className: "h-full w-full object-cover"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card px-5 py-4 shadow-xl sm:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs uppercase tracking-widest text-muted-foreground",
									children: "Bugun"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 font-display text-xl",
									children: "Yangi kelgan gullar"
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "petal-divider",
					"aria-hidden": true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-7xl px-5 py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-10 flex items-end justify-between gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-muted-foreground",
						children: "Kolleksiya"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl sm:text-4xl",
						children: "Kategoriyalar"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/catalog",
						className: "text-sm text-muted-foreground underline-offset-4 hover:underline",
						children: "Barchasi →"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/catalog",
						search: { cat: c.name },
						className: "group relative aspect-[4/5] overflow-hidden rounded-2xl bg-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: categoryImages[c.name] || flower_hero_default,
								alt: c.name,
								loading: "lazy",
								className: "h-full w-full object-cover transition duration-700 group-hover:scale-105"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-x-0 bottom-0 p-4 text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-lg",
									children: c.name
								})
							})
						]
					}, c.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-7xl px-5 py-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-10 flex items-end justify-between gap-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-muted-foreground",
						children: "Mashhur"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl sm:text-4xl",
						children: "Floristlar tanlagan"
					})] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
					children: featured.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/product/$id",
						params: { id: p.slug },
						className: "group block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "aspect-square overflow-hidden rounded-2xl bg-card",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: productImage(p),
								alt: p.name,
								loading: "lazy",
								className: "h-full w-full object-cover transition duration-700 group-hover:scale-105"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-medium",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm text-muted-foreground",
									children: p.pattern
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "shrink-0 text-sm font-semibold",
								children: formatSom(p.price)
							})]
						})]
					}, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "hunar",
				className: "mx-auto mt-10 max-w-7xl px-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid overflow-hidden rounded-[2rem] bg-card md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative aspect-[4/3] md:aspect-auto flex items-center justify-center p-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: logo_default,
							alt: "Gagaren Gullari logo",
							className: "h-56 w-56 object-contain"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-8 sm:p-14",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs uppercase tracking-widest text-muted-foreground",
								children: "Qanday ishlaymiz"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-3xl sm:text-4xl",
								children: "Ertalab kesilgan gul — kechqurun sizda"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 text-muted-foreground",
								children: "Gullar har kuni ertalab yangi partiyada keladi. Florist buketni buyurtmangizdan keyin yig'adi, suv va o'ram bilan salqin holatda yetkazamiz. Yetkazish kuni va vaqt oralig'ini buyurtma berayotganda o'zingiz belgilaysiz."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 grid grid-cols-3 gap-6 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
										n: "01",
										t: "Tanlang",
										d: "Katalogdan buket"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
										n: "02",
										t: "Vaqt",
										d: "Kun va soat oralig'i"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
										n: "03",
										t: "Yetkazish",
										d: "Kuryer qo'lma-qo'l"
									})
								]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-7xl px-5 py-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl sm:text-4xl",
					children: "Mijozlar fikri"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-6 sm:grid-cols-3",
					children: TESTIMONIALS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "rounded-2xl border border-border bg-card p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
							className: "text-[15px] leading-relaxed",
							children: [
								"\"",
								t.quote,
								"\""
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
							className: "mt-5 text-sm text-muted-foreground",
							children: [
								"— ",
								t.name,
								", ",
								t.city
							]
						})]
					}, t.name))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileTabBar, {})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "font-display text-3xl",
		children: value
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-1 text-xs uppercase tracking-widest text-muted-foreground",
		children: label
	})] });
}
function Step({ n, t, d }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-xl text-[color:var(--terracotta)]",
			children: n
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 font-medium",
			children: t
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-muted-foreground",
			children: d
		})
	] });
}
var TESTIMONIALS = [
	{
		name: "Malika",
		city: "Mirzacho'l",
		quote: "Buket aynan so'ragan vaqtimda yetib keldi, gullar juda yangi edi. Opamga sovg'a qildim — xursand bo'ldi."
	},
	{
		name: "Jasur",
		city: "Mirzacho'l",
		quote: "25 ta qizil atirgul buyurtma qildim, rasmdagidan ham chiroyli chiqdi. Kuryer aniq soatda keldi."
	},
	{
		name: "Nodira",
		city: "Mirzacho'l",
		quote: "Tuvakdagi o'simlikni ofisga oldim. O'ramigacha ozoda va chiroyli qilib berishdi."
	}
];
//#endregion
export { Home as component };
