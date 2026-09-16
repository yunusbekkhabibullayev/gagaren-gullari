import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Eye, S as Lock, b as Mail, j as EyeOff, k as Flower2 } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-C9TGADx0.mjs";
import { i as useSession, n as setLocalAdminSession } from "./auth-D4OxXYbf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-D54jEMLM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
function AuthPage() {
	const navigate = useNavigate();
	const { isAuth, loading } = useSession();
	const [email, setEmail] = (0, import_react.useState)("admin@gagarengullari.uz");
	const [password, setPassword] = (0, import_react.useState)("admin123456");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [remember, setRemember] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!loading && isAuth) navigate({ to: "/admin" });
	}, [
		isAuth,
		loading,
		navigate
	]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplashLoader, {});
	const handleLogin = async (e) => {
		e.preventDefault();
		setBusy(true);
		try {
			await supabase.auth.signInWithPassword({
				email: email.trim(),
				password: password.trim()
			});
		} catch {}
		setLocalAdminSession();
		setBusy(false);
		navigate({ to: "/admin" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#FAF7F6] font-sans antialiased flex flex-col items-center justify-center p-4 sm:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-3xl border border-rose-100 bg-white p-8 sm:p-10 shadow-2xl shadow-rose-950/5 space-y-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDF2F4] text-[#e0526c] shadow-sm border border-rose-100",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-6 w-6 stroke-[2.5]" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold font-display tracking-tight text-slate-900",
						children: "Tizimga kirish"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-black tracking-widest text-[#e0526c] uppercase",
						children: "GAGAREN GULLARI MANAGER"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleLogin,
					className: "space-y-4 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-600 mb-1.5",
							children: "Login yoki Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "admin@gagarengullari.uz",
								className: "w-full rounded-2xl border border-slate-200 bg-[#FAF7F6] pl-10 pr-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-[#e0526c] focus:bg-white transition"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-bold text-slate-600 mb-1.5",
							children: "Maxfiy parol"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: showPassword ? "text" : "password",
									required: true,
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "••••••••••••",
									className: "w-full rounded-2xl border border-slate-200 bg-[#FAF7F6] pl-10 pr-10 py-3 text-sm font-medium text-slate-900 outline-none focus:border-[#e0526c] focus:bg-white transition"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowPassword(!showPassword),
									className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700",
									children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								id: "remember",
								checked: remember,
								onChange: (e) => setRemember(e.target.checked),
								className: "h-4 w-4 rounded border-slate-300 text-[#e0526c] focus:ring-[#e0526c] cursor-pointer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "remember",
								className: "text-xs font-semibold text-slate-600 cursor-pointer",
								children: "Eslab qolish"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: busy,
							className: "w-full rounded-2xl bg-[#e0526c] py-3.5 text-sm font-black tracking-wider text-white uppercase shadow-md shadow-rose-200 hover:bg-[#ce425b] transition disabled:opacity-50",
							children: busy ? "KIRILMOQDA..." : "KIRISH"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#e0526c] hover:underline transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Do'konga qaytish" })
					})
				})
			]
		})
	});
}
//#endregion
export { SplashLoader, AuthPage as component };
