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

// AUTHORITATIVE SERVER-SIDE ORDER PLACEMENT
// Prevents price tampering, enforces stock constraints, calculates totals on server, and prevents overbooking.
const placeOrderSchema = z.object({
  name: z.string().trim().min(2, "Ismingizni to'liq kiriting").max(120),
  phone: z
    .string()
    .trim()
    .min(9, "Telefon raqam noto'g'ri")
    .max(25)
    .regex(/^[+\d\s()-]+$/i, "Faqat raqam va + belgisi"),
  address: z.string().trim().min(5, "Manzilni to'liq kiriting").max(300),
  city: z.string().trim().max(120).optional().default("Mirzacho'l tumani"),
  note: z.string().trim().max(400).optional().default(""),
  method: z.enum(["cash", "card", "transfer"]).default("cash"),
  items: z
    .array(
      z.object({
        slug: z.string().trim(),
        qty: z.number().int().min(1, "Miqdor kamida 1 bo'lishi kerak").max(50),
        color: z.string().optional(),
      })
    )
    .min(1, "Savat bo'sh"),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => placeOrderSchema.parse(data))
  .handler(
    async ({
      data,
    }): Promise<{ success: boolean; orderId: string; total: number; error?: string }> => {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { sendTelegramOrderNotification } = await import("@/lib/telegram");

      // 1. Authoritative price & stock lookup from DB
      const validatedItems: Array<{
        slug: string;
        name: string;
        price: number;
        color?: string;
        qty: number;
        image?: string;
      }> = [];

      let calculatedSubtotal = 0;

      for (const item of data.items) {
        const { data: dbProduct, error: prodErr } = await supabaseAdmin
          .from("products")
          .select("id, slug, name, price, stock, active, image_url")
          .eq("slug", item.slug)
          .maybeSingle();

        if (prodErr || !dbProduct || !dbProduct.active) {
          throw new Error(`Mahsulot topilmadi yoki sotuvda yo'q: ${item.slug}`);
        }

        if (dbProduct.stock < item.qty) {
          throw new Error(
            `"${dbProduct.name}" mahsulotidan yetarli zaxira yo'q (Omborda: ${dbProduct.stock} ta)`
          );
        }

        const dbPrice = Number(dbProduct.price);
        const itemTotal = dbPrice * item.qty;
        calculatedSubtotal += itemTotal;

        validatedItems.push({
          slug: dbProduct.slug,
          name: dbProduct.name,
          price: dbPrice,
          color: item.color,
          qty: item.qty,
          image: dbProduct.image_url || undefined,
        });

        // 2. Atomic Stock Decrement via RPC
        try {
          const { data: rpcOk, error: rpcErr } = await supabaseAdmin.rpc("decrement_product_stock", {
            p_product_id: dbProduct.id,
            p_quantity: item.qty,
          });

          if (rpcErr || !rpcOk) {
            // Fallback atomic update
            const { data: updateData, error: updateErr } = await supabaseAdmin
              .from("products")
              .update({ stock: dbProduct.stock - item.qty })
              .eq("id", dbProduct.id)
              .gte("stock", item.qty)
              .select("stock");

            if (updateErr || !updateData || updateData.length === 0) {
              throw new Error(
                `"${dbProduct.name}" mahsulotini xarid qilishda zaxira yetishmovchiligi yuz berdi.`
              );
            }
          }
        } catch (e: any) {
          throw new Error(e?.message || `Zaxira yangilashda xatolik: ${dbProduct.name}`);
        }
      }

      // 3. Authoritative server calculation for shipping and total
      const calculatedShipping = calculatedSubtotal >= 500000 ? 0 : 35000;
      const calculatedTotal = calculatedSubtotal + calculatedShipping;

      const generatedOrderId = "SO-" + Math.random().toString(36).substring(2, 8).toUpperCase();

      // 4. Save to Database
      const { data: insertedRow, error: insertError } = await supabaseAdmin
        .from("orders")
        .insert({
          order_number: generatedOrderId,
          customer_name: data.name,
          customer_phone: data.phone,
          customer_city: data.city || "Mirzacho'l tumani",
          customer_address: data.address,
          note: data.note || "",
          payment_method: data.method,
          items: validatedItems,
          subtotal: calculatedSubtotal,
          shipping: calculatedShipping,
          total: calculatedTotal,
          status: "new",
        })
        .select("id, order_number")
        .single();

      if (insertError) {
        console.error("Supabase order insert error:", insertError);
        throw new Error("Buyurtmani bazaga saqlashda xatolik yuz berdi.");
      }

      const finalOrderId = insertedRow?.order_number || generatedOrderId;

      // 5. Send Telegram Notification
      try {
        sendTelegramOrderNotification({
          orderId: finalOrderId,
          customerName: data.name,
          customerPhone: data.phone,
          customerCity: data.city || "Mirzacho'l tumani",
          customerAddress: data.address,
          paymentMethod: data.method,
          note: data.note,
          subtotal: calculatedSubtotal,
          shipping: calculatedShipping,
          total: calculatedTotal,
          items: validatedItems.map((i) => ({
            name: i.name,
            color: i.color,
            qty: i.qty,
            price: i.price,
          })),
        });
      } catch (tgErr) {
        console.warn("Telegram bot notification error (non-fatal):", tgErr);
      }

      return {
        success: true,
        orderId: finalOrderId,
        total: calculatedTotal,
      };
    }
  );
