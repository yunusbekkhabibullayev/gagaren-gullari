import { n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-C9TGADx0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/categories-oyDoVC2I.js
var DEFAULT_CATEGORIES = [
	{
		id: "1",
		name: "Buketlar",
		slug: "buketlar",
		icon: "Flower2",
		color: "#e85d4a",
		order_index: 0,
		active: true,
		created_at: (/* @__PURE__ */ new Date()).toISOString(),
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "2",
		name: "Atirgullar",
		slug: "atirgullar",
		icon: "Heart",
		color: "#f43f5e",
		order_index: 1,
		active: true,
		created_at: (/* @__PURE__ */ new Date()).toISOString(),
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "3",
		name: "Tuvakdagi o'simliklar",
		slug: "tuvakdagi-osimliklar",
		icon: "Leaf",
		color: "#10b981",
		order_index: 2,
		active: true,
		created_at: (/* @__PURE__ */ new Date()).toISOString(),
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "4",
		name: "Sovg'a to'plamlari",
		slug: "sovga-toplamlari",
		icon: "Gift",
		color: "#f59e0b",
		order_index: 3,
		active: true,
		created_at: (/* @__PURE__ */ new Date()).toISOString(),
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}
];
var CATEGORY_OVERRIDES_KEY = "admin_category_overrides";
var CATEGORY_DELETED_KEY = "admin_category_deleted";
function getLocalCategoryOverrides() {
	if (typeof window === "undefined") return {};
	try {
		const raw = localStorage.getItem(CATEGORY_OVERRIDES_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}
function saveCategoryOverride(cat) {
	if (typeof window === "undefined") return;
	try {
		const overrides = getLocalCategoryOverrides();
		overrides[cat.id] = cat;
		localStorage.setItem(CATEGORY_OVERRIDES_KEY, JSON.stringify(overrides));
	} catch (e) {
		console.error("Failed to save category override", e);
	}
}
function deleteCategoryOverride(id) {
	if (typeof window === "undefined") return;
	try {
		const overrides = getLocalCategoryOverrides();
		delete overrides[id];
		localStorage.setItem(CATEGORY_OVERRIDES_KEY, JSON.stringify(overrides));
		const rawDel = localStorage.getItem(CATEGORY_DELETED_KEY);
		const deleted = rawDel ? JSON.parse(rawDel) : [];
		if (!deleted.includes(id)) {
			deleted.push(id);
			localStorage.setItem(CATEGORY_DELETED_KEY, JSON.stringify(deleted));
		}
	} catch (e) {
		console.error("Failed to delete category override", e);
	}
}
function mergeCategoriesWithOverrides(dbCategories) {
	const overrides = getLocalCategoryOverrides();
	let deletedIds = /* @__PURE__ */ new Set();
	try {
		const rawDel = localStorage.getItem(CATEGORY_DELETED_KEY);
		if (rawDel) deletedIds = new Set(JSON.parse(rawDel));
	} catch (e) {
		console.warn("Failed to read deleted category ids from localStorage", e);
	}
	const remainingDb = (dbCategories.length > 0 ? dbCategories : DEFAULT_CATEGORIES).filter((c) => !deletedIds.has(c.id));
	const resultMap = /* @__PURE__ */ new Map();
	remainingDb.forEach((c) => {
		resultMap.set(c.id, overrides[c.id] ? {
			...c,
			...overrides[c.id]
		} : c);
	});
	Object.values(overrides).forEach((c) => {
		if (!deletedIds.has(c.id) && !resultMap.has(c.id)) resultMap.set(c.id, c);
	});
	return Array.from(resultMap.values());
}
/** Public: faqat aktiv kategoriyalar (order_index bo'yicha) */
function useCategories() {
	return useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			try {
				const { data, error } = await supabase.from("categories").select("*").eq("active", true).order("order_index", { ascending: true });
				if (error || !data) return mergeCategoriesWithOverrides([]);
				return mergeCategoriesWithOverrides(data).filter((c) => c.active);
			} catch {
				return mergeCategoriesWithOverrides([]).filter((c) => c.active);
			}
		}
	});
}
/** Admin: barcha kategoriyalar (aktiv + yashirin) */
function useAdminCategories() {
	return useQuery({
		queryKey: ["admin-categories"],
		queryFn: async () => {
			try {
				const { data, error } = await supabase.from("categories").select("*").order("order_index", { ascending: true });
				if (error || !data) return mergeCategoriesWithOverrides([]);
				return mergeCategoriesWithOverrides(data);
			} catch {
				return mergeCategoriesWithOverrides([]);
			}
		},
		retry: 1
	});
}
//#endregion
export { useCategories as i, saveCategoryOverride as n, useAdminCategories as r, deleteCategoryOverride as t };
