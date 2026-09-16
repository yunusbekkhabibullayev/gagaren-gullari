import { n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-C9TGADx0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-B44v3hOB.js
var workshops = ["Mahalliy", "Golland"];
function formatSom(n) {
	return new Intl.NumberFormat("uz-UZ").format(n) + " so'm";
}
function productImage(p) {
	return p?.image_url || "/flowers/flower-hero.jpg";
}
var PRODUCT_OVERRIDES_KEY = "admin_product_overrides";
var PRODUCT_DELETED_KEY = "admin_product_deleted";
function getLocalProductOverrides() {
	if (typeof window === "undefined") return {};
	try {
		const raw = localStorage.getItem(PRODUCT_OVERRIDES_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}
function getLocalDeletedProductIds() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(PRODUCT_DELETED_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
function saveProductOverride(product) {
	if (typeof window === "undefined") return;
	try {
		const overrides = getLocalProductOverrides();
		overrides[product.id] = product;
		localStorage.setItem(PRODUCT_OVERRIDES_KEY, JSON.stringify(overrides));
	} catch (e) {
		console.error("Failed to save product override", e);
	}
}
function deleteProductOverride(id) {
	if (typeof window === "undefined") return;
	try {
		const overrides = getLocalProductOverrides();
		delete overrides[id];
		localStorage.setItem(PRODUCT_OVERRIDES_KEY, JSON.stringify(overrides));
		const deleted = getLocalDeletedProductIds();
		if (!deleted.includes(id)) {
			deleted.push(id);
			localStorage.setItem(PRODUCT_DELETED_KEY, JSON.stringify(deleted));
		}
	} catch (e) {
		console.error("Failed to delete product override", e);
	}
}
function mergeProductsWithOverrides(dbProducts) {
	const overrides = getLocalProductOverrides();
	const deletedIds = new Set(getLocalDeletedProductIds());
	const remainingDb = dbProducts.filter((p) => !deletedIds.has(p.id));
	const resultMap = /* @__PURE__ */ new Map();
	remainingDb.forEach((p) => {
		resultMap.set(p.id, overrides[p.id] ? {
			...p,
			...overrides[p.id]
		} : p);
	});
	Object.values(overrides).forEach((p) => {
		if (!deletedIds.has(p.id) && !resultMap.has(p.id)) resultMap.set(p.id, p);
	});
	return Array.from(resultMap.values());
}
async function fetchProducts() {
	try {
		const { data, error } = await supabase.from("products").select("*").eq("active", true).order("created_at", { ascending: false });
		if (error || !data) return mergeProductsWithOverrides([]);
		return mergeProductsWithOverrides(data);
	} catch {
		return mergeProductsWithOverrides([]);
	}
}
function useProducts() {
	return useQuery({
		queryKey: ["products"],
		queryFn: fetchProducts
	});
}
function useProduct(slug) {
	return useQuery({
		queryKey: ["product", slug],
		queryFn: async () => {
			const match = (await fetchProducts()).find((p) => p.slug === slug || p.id === slug);
			if (match) return match;
			const { data } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
			return data ?? null;
		}
	});
}
//#endregion
export { saveProductOverride as a, workshops as c, productImage as i, formatSom as n, useProduct as o, mergeProductsWithOverrides as r, useProducts as s, deleteProductOverride as t };
