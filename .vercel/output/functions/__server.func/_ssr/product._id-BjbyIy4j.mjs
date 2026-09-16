import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useCart, n as Route } from "./router-Phzk9hL6.mjs";
import { i as productImage, n as formatSom, o as useProduct, s as useProducts } from "./products-B44v3hOB.mjs";
import { n as SiteFooter, r as SiteHeader, t as MobileTabBar } from "./site-footer-CusmjNK2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._id-BjbyIy4j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductPage() {
	const { id } = Route.useParams();
	const { data: product, isLoading } = useProduct(id);
	const { data: allProducts = [] } = useProducts();
	const [activeImg, setActiveImg] = (0, import_react.useState)(0);
	const [color, setColor] = (0, import_react.useState)("");
	const [qty, setQty] = (0, import_react.useState)(1);
	const { add } = useCart();
	const navigate = useNavigate();
	const [added, setAdded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (product && !color) setColor(product.colors[0] ?? "");
	}, [product, color]);
	const gallery = (0, import_react.useMemo)(() => {
		if (!product) return [];
		const imgs = [productImage(product)];
		if (product.image_url_2) imgs.push(product.image_url_2);
		else imgs.push(productImage(product));
		return imgs;
	}, [product]);
	const related = allProducts.filter((p) => p.id !== product?.id).slice(0, 4);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-7xl px-5 py-24 text-center text-muted-foreground",
			children: "Yuklanmoqda…"
		})]
	});
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center px-5 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-4xl",
			children: "Buyum topilmadi"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/catalog",
			className: "mt-6 inline-block underline",
			children: "Katalogga qaytish"
		})] })
	});
	const handleAdd = () => {
		add(product, color, qty);
		setAdded(true);
		window.setTimeout(() => setAdded(false), 1600);
	};
	const handleBuyNow = () => {
		add(product, color, qty);
		navigate({ to: "/checkout" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background pb-32 sm:pb-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-5 pt-6 text-sm text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:text-foreground",
						children: "Bosh"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-2",
						children: "/"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/catalog",
						className: "hover:text-foreground",
						children: "Katalog"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-2",
						children: "/"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: product.name
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-7xl gap-12 px-5 py-8 md:grid-cols-2 md:py-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gallery, {
					images: gallery,
					active: activeImg,
					setActive: setActiveImg,
					name: product.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs uppercase tracking-widest text-muted-foreground",
						children: [
							product.workshop,
							" · ",
							product.category
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-4xl sm:text-5xl",
						children: product.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 text-lg text-muted-foreground",
						children: product.pattern
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 font-display text-3xl",
						children: formatSom(product.price)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 leading-relaxed text-muted-foreground",
						children: product.story
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 space-y-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: "Rang"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: product.colors.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setColor(c),
								className: `rounded-full border px-3 py-1.5 text-sm transition ${color === c ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:bg-secondary"}`,
								children: c
							}, c))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: "Miqdor"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center rounded-full border border-border bg-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setQty((q) => Math.max(1, q - 1)),
										className: "px-3 py-1.5",
										children: "−"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 text-center text-sm",
										children: qty
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setQty((q) => q + 1),
										className: "px-3 py-1.5",
										children: "+"
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleAdd,
							className: "flex-1 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition hover:opacity-90 sm:flex-none",
							children: added ? "Savatga qo'shildi ✓" : "Savatga qo'shish"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleBuyNow,
							className: "flex-1 rounded-full border border-foreground px-6 py-3.5 text-sm font-medium transition hover:bg-secondary sm:flex-none",
							children: "Hoziroq sotib olish"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 grid grid-cols-2 gap-4 border-t border-border pt-6 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
								k: "O'lcham",
								v: product.size || "Standart"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
								k: "Og'irlik",
								v: product.weight || "1.0 kg"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
								k: "Ustaxona",
								v: product.workshop || "Gollandiya"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
								k: "Tayyorlanish",
								v: product.preparation || "15–30 daqiqa (tayyor)"
							})
						]
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-7xl px-5 py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl sm:text-3xl",
					children: "O'xshash buyumlar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
					children: related.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
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
							className: "mt-3 flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "shrink-0 text-sm font-semibold",
								children: formatSom(p.price)
							})]
						})]
					}, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileTabBar, {})
		]
	});
}
function Spec({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-muted-foreground",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-0.5 font-medium",
		children: v
	})] });
}
function Gallery({ images, active, setActive, name }) {
	const ref = (0, import_react.useRef)(null);
	const dragging = (0, import_react.useRef)(false);
	const startX = (0, import_react.useRef)(0);
	const startIdx = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const onDown = (x) => {
			dragging.current = true;
			startX.current = x;
			startIdx.current = active;
		};
		const onMove = (x) => {
			if (!dragging.current) return;
			const dx = x - startX.current;
			const step = Math.round(dx / 40);
			setActive(((startIdx.current - step) % images.length + images.length) % images.length);
		};
		const onUp = () => dragging.current = false;
		const md = (e) => onDown(e.clientX);
		const mm = (e) => onMove(e.clientX);
		const td = (e) => onDown(e.touches[0].clientX);
		const tm = (e) => onMove(e.touches[0].clientX);
		el.addEventListener("mousedown", md);
		window.addEventListener("mousemove", mm);
		window.addEventListener("mouseup", onUp);
		el.addEventListener("touchstart", td, { passive: true });
		el.addEventListener("touchmove", tm, { passive: true });
		el.addEventListener("touchend", onUp);
		return () => {
			el.removeEventListener("mousedown", md);
			window.removeEventListener("mousemove", mm);
			window.removeEventListener("mouseup", onUp);
			el.removeEventListener("touchstart", td);
			el.removeEventListener("touchmove", tm);
			el.removeEventListener("touchend", onUp);
		};
	}, [
		active,
		images.length,
		setActive
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "relative aspect-square cursor-grab overflow-hidden rounded-[2rem] bg-card select-none active:cursor-grabbing",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: images[active],
			alt: name,
			className: "pointer-events-none h-full w-full object-cover transition-opacity duration-300",
			draggable: false
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-background/85 px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground",
			children: "Barmoq bilan aylantiring"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-4 grid grid-cols-4 gap-3",
		children: images.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => setActive(i),
			className: `aspect-square overflow-hidden rounded-xl border transition ${i === active ? "border-foreground" : "border-border"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src,
				alt: "",
				className: "h-full w-full object-cover"
			})
		}, i))
	})] });
}
//#endregion
export { ProductPage as component };
