import { i as stringType, r as objectType } from "../_libs/zod.mjs";
import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./server-DSncFkQe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders.functions-qGTIqVqW.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var digits = (v) => v.replace(/\D/g, "");
var trackSchema = objectType({
	orderNumber: stringType().trim().min(3).max(40),
	phone: stringType().trim().min(7).max(20)
});
var trackOrder_createServerFn_handler = createServerRpc({
	id: "d74efaed9d368b50c737966712aaf37f9bc30edca8be1eed754f166b39b69dcd",
	name: "trackOrder",
	filename: "src/lib/orders.functions.ts"
}, (opts) => trackOrder.__executeServer(opts));
var trackOrder = createServerFn({ method: "POST" }).inputValidator((data) => trackSchema.parse(data)).handler(trackOrder_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-DH7nwGGH.mjs");
	const { data: row, error } = await supabaseAdmin.from("orders").select("order_number, status, created_at, updated_at, customer_city, customer_phone, payment_method, subtotal, shipping, total, items").eq("order_number", data.orderNumber.toUpperCase()).maybeSingle();
	if (error) throw new Error("lookup_failed");
	if (!row) return { order: null };
	const given = digits(data.phone);
	const stored = digits(row.customer_phone ?? "");
	if (!(given.length >= 7 && stored.endsWith(given.slice(-9)))) return { order: null };
	const rawItems = Array.isArray(row.items) ? row.items : [];
	return { order: {
		orderNumber: row.order_number,
		status: row.status,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		city: row.customer_city ?? "",
		paymentMethod: row.payment_method ?? "",
		subtotal: Number(row.subtotal ?? 0),
		shipping: Number(row.shipping ?? 0),
		total: Number(row.total ?? 0),
		items: rawItems.map((i) => ({
			name: String(i.name ?? ""),
			color: i.color ? String(i.color) : void 0,
			qty: Number(i.qty ?? 1),
			price: Number(i.price ?? 0),
			image: i.image ? String(i.image) : void 0
		}))
	} };
});
//#endregion
export { trackOrder_createServerFn_handler };
