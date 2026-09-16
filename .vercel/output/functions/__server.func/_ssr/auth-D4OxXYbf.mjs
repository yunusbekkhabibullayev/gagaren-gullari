import { i as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-C9TGADx0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-D4OxXYbf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var MOCK_ADMIN_USER = {
	id: "c42fd7c7-d932-4ae9-b400-cdff704bc72a",
	app_metadata: {},
	user_metadata: {},
	aud: "authenticated",
	created_at: (/* @__PURE__ */ new Date()).toISOString(),
	email: "admin@gagarengullari.uz"
};
function useSession() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [localAdmin, setLocalAdmin] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") return localStorage.getItem("admin_authenticated") === "true";
		return false;
	});
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
		});
		const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
			setSession(s);
			if (s) {
				localStorage.setItem("admin_authenticated", "true");
				setLocalAdmin(true);
			}
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	const isAuth = Boolean(session?.user) || localAdmin;
	return {
		session,
		user: session?.user ?? (localAdmin ? MOCK_ADMIN_USER : null),
		loading,
		isAuth
	};
}
function useIsAdmin() {
	const { user, loading, isAuth } = useSession();
	return {
		isAdmin: isAuth,
		loading,
		user
	};
}
function setLocalAdminSession() {
	if (typeof window !== "undefined") localStorage.setItem("admin_authenticated", "true");
}
function clearAdminSession() {
	if (typeof window !== "undefined") localStorage.removeItem("admin_authenticated");
	return supabase.auth.signOut();
}
//#endregion
export { useSession as i, setLocalAdminSession as n, useIsAdmin as r, clearAdminSession as t };
