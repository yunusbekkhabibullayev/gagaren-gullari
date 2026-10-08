import { supabase } from "@/integrations/supabase/client";

export async function getLiveProductStock(product: {
  slug?: string;
  id?: string;
  name?: string;
  stock?: number;
}): Promise<number> {
  try {
    if (product.slug) {
      const { data, error } = await supabase
        .from("products")
        .select("stock")
        .eq("slug", product.slug)
        .maybeSingle();

      if (!error && data && typeof data.stock === "number") return data.stock;
    }

    if (product.id) {
      const { data, error } = await supabase
        .from("products")
        .select("stock")
        .eq("id", product.id)
        .maybeSingle();

      if (!error && data && typeof data.stock === "number") return data.stock;
    }
  } catch {
    // fall through to direct product value below
  }

  return typeof product.stock === "number" ? product.stock : 0;
}

export async function getLiveProductStockBySlug(slug: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("stock")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data && typeof data.stock === "number") return data.stock;
  } catch {
    // no fallback to mock values; real product stock must be authoritative
  }

  return 0;
}
