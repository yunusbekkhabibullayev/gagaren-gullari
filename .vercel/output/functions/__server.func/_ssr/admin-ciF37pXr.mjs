import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { d as useLocation, m as Outlet, v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as ChevronRight, M as ExternalLink, R as ChevronDown, _ as Package, k as Flower2, l as ShoppingBag, n as X, r as User, s as Tag, u as Shield, v as Menu, x as LogOut, z as ChartNoAxesColumn } from "../_libs/lucide-react.mjs";
import { r as SplashLoader } from "./router-Phzk9hL6.mjs";
import { r as useIsAdmin, t as clearAdminSession } from "./auth-D4OxXYbf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-ciF37pXr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLayout() {
	const { isAdmin, loading, user } = useIsAdmin();
	const navigate = useNavigate();
	const location = useLocation();
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [profileDropdownOpen, setProfileDropdownOpen] = (0, import_react.useState)(false);
	const [logoutConfirmOpen, setLogoutConfirmOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({ to: "/auth" });
	}, [
		loading,
		user,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		setMobileOpen(false);
		setProfileDropdownOpen(false);
	}, [location.pathname]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplashLoader, {});
	if (!user) return null;
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-[#FAF7F6] px-5 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md rounded-3xl border border-rose-100 bg-white p-8 shadow-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDF2F4] text-[#e0526c]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-8 w-8" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-5 text-2xl font-bold text-slate-900",
					children: "Ruxsat yo'q"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-slate-500",
					children: "Ushbu hisobda admin roli mavjud emas."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => window.location.reload(),
						className: "rounded-full bg-[#e0526c] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#ce425b] transition",
						children: "Qayta yuklash"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: async () => {
							await clearAdminSession();
							navigate({ to: "/auth" });
						},
						className: "rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition",
						children: "Chiqish"
					})]
				})
			]
		})
	});
	const sidebarContent = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col bg-white border-r border-slate-200/80",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b border-slate-100 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e0526c] text-white shadow-md shadow-rose-200",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flower2, { className: "h-6 w-6 stroke-[2.2]" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate font-extrabold text-slate-900 text-base font-display",
						children: "Gagaren Gullari"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-black tracking-widest text-[#e0526c] uppercase",
						children: "DO'KON BOSHQARUVI"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto px-3 py-5 space-y-6",
				children: [{
					title: "ASOSIY",
					items: [{
						label: "Statistika",
						to: "/admin",
						exact: true,
						icon: ChartNoAxesColumn
					}, {
						label: "Buyurtmalar",
						to: "/admin/orders",
						icon: ShoppingBag
					}]
				}, {
					title: "KATALOG & MARKETING",
					items: [{
						label: "Mahsulotlar",
						to: "/admin/products",
						icon: Package
					}, {
						label: "Kategoriyalar",
						to: "/admin/categories",
						icon: Tag
					}]
				}].map((group, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2.5",
					children: group.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1",
					children: group.items.map((item) => {
						const Icon = item.icon;
						const isActive = item.exact ? location.pathname === "/admin" || location.pathname === "/admin/" : location.pathname.startsWith(item.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							activeOptions: { exact: item.exact },
							className: `flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-bold transition ${isActive ? "bg-[#e0526c] text-white shadow-md shadow-rose-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4.5 w-4.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1",
									children: item.label
								}),
								isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-white/80" })
							]
						}, item.label);
					})
				})] }, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-slate-100 p-4 bg-slate-50/50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs text-slate-500 font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5 font-bold text-emerald-600",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500 animate-pulse" }), "Dastyor v2.2.52"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-slate-400",
						children: "Online"
					})]
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#FAF7F6] font-sans text-slate-800 antialiased flex",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "hidden lg:block w-64 shrink-0 fixed inset-y-0 left-0 z-30",
				children: sidebarContent
			}),
			mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 bg-slate-900/50 backdrop-blur-sm",
					onClick: () => setMobileOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-y-0 left-0 w-72 max-w-[80vw]",
					children: sidebarContent
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 lg:pl-64 flex flex-col min-h-screen",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMobileOpen(!mobileOpen),
							className: "lg:hidden rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100",
							children: mobileOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-black text-slate-900 text-sm sm:text-base tracking-wider uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hidden sm:inline-block h-2.5 w-2.5 rounded-full bg-[#e0526c]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DO'KON BOSHGARUVI" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 sm:gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Saytga qaytish"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200",
								children: "UZ 🇺🇿"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative border-l border-slate-200 pl-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setProfileDropdownOpen(!profileDropdownOpen),
									className: "flex items-center gap-2.5 rounded-full p-1 hover:bg-slate-100 transition",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-9 w-9 items-center justify-center rounded-full bg-[#e0526c] text-white font-bold text-sm shadow-md shadow-rose-200",
											children: "A"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "hidden md:block text-left leading-tight pr-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs font-bold text-slate-900 truncate max-w-[140px]",
												children: "Admin"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] font-bold text-[#e0526c] tracking-wider uppercase",
												children: "ADMIN"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 text-slate-400 hidden md:block" })
									]
								}), profileDropdownOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute right-0 mt-2 w-64 rounded-3xl border border-slate-100 bg-white p-4 shadow-2xl z-50 space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-b border-slate-100 pb-3 text-left",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-bold text-slate-900 text-sm",
												children: "Admin"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-[#e0526c] font-bold",
												children: "Admin"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[11px] text-slate-400 truncate mt-0.5",
												children: user.email
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1 text-left text-xs font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setProfileDropdownOpen(false),
											className: "w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 transition",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Profil ma'lumotlari" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => {
												setProfileDropdownOpen(false);
												setLogoutConfirmOpen(true);
											},
											className: "w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-[#e0526c] hover:bg-rose-50 transition",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Chiqish" })]
										})]
									})]
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				})]
			}),
			logoutConfirmOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl text-center space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-[#e0526c] border border-rose-100",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-7 w-7" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-slate-900 text-lg",
							children: "Tizimdan chiqish"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-slate-500",
							children: "Haqiqatan ham admin panelidan chiqmoqchimisiz?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setLogoutConfirmOpen(false),
								className: "rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50",
								children: "Yo'q"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: async () => {
									setLogoutConfirmOpen(false);
									await clearAdminSession();
									navigate({ to: "/auth" });
								},
								className: "rounded-2xl bg-[#e0526c] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#ce425b]",
								children: "Chiqish"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { AdminLayout as component };
