import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const digits = (v: string) => v.replace(/\D/g, "");

const trackSchema = z.object({
  orderNumber: z.string().trim().min(3).max(40),
  phone: z.string().trim().min(7).max(20),
});

export type TrackedOrderItem = {
  name: string;
  color?: string;
  qty: number;
  price: number;
  image?: string;
};

export type TrackedOrder = {
  orderNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  city: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: TrackedOrderItem[];
};

export const trackOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => trackSchema.parse(data))
  .handler(async ({ data }): Promise<{ order: TrackedOrder | null }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("orders")
      .select(
        "order_number, status, created_at, updated_at, customer_city, customer_phone, payment_method, subtotal, shipping, total, items",
      )
      .eq("order_number", data.orderNumber.toUpperCase())
      .maybeSingle();

    if (error) throw new Error("lookup_failed");
    if (!row) return { order: null };

    // The phone number acts as the shared secret for guest orders.
    const given = digits(data.phone);
    const stored = digits(row.customer_phone ?? "");
    const match = given.length >= 7 && stored.endsWith(given.slice(-9));
    if (!match) return { order: null };

    const rawItems = Array.isArray(row.items) ? (row.items as Record<string, unknown>[]) : [];
    return {
      order: {
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
          color: i.color ? String(i.color) : undefined,
          qty: Number(i.qty ?? 1),
          price: Number(i.price ?? 0),
          image: i.image ? String(i.image) : undefined,
        })),
      },
    };
  });
