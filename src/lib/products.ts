import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  slug: string;
  name: string;
  pattern: string;
  category: string;
  workshop: string;
  price: number;
  size: string;
  weight: string;
  colors: string[];
  image_url: string | null;
  image_url_2?: string | null;
  preparation?: string;
  stock: number;
  story: string;
  active: boolean;
};

export const categories = [
  "Buketlar",
  "Atirgullar",
  "Tuvakdagi o'simliklar",
  "Sovg'a to'plamlari",
] as const;

// DB'dagi `workshop` ustuni gul do'konida "kelib chiqishi" sifatida ishlatiladi.
export const workshops = ["Mahalliy", "Golland"] as const;

export function formatSom(n: number) {
  return new Intl.NumberFormat("uz-UZ").format(n) + " so'm";
}

export function productImage(p: Pick<Product, "image_url"> | null | undefined) {
  return p?.image_url || "/flowers/flower-hero.jpg";
}

// Local override helpers to prevent edits from reverting
const PRODUCT_OVERRIDES_KEY = "admin_product_overrides";
const PRODUCT_DELETED_KEY = "admin_product_deleted";

export function getLocalProductOverrides(): Record<string, Product> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PRODUCT_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getLocalDeletedProductIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PRODUCT_DELETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProductOverride(product: Product) {
  if (typeof window === "undefined") return;
  try {
    const overrides = getLocalProductOverrides();
    overrides[product.id] = product;
    localStorage.setItem(PRODUCT_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch (e) {
    console.error("Failed to save product override", e);
  }
}

export function deleteProductOverride(id: string) {
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

export function mergeProductsWithOverrides(dbProducts: Product[]): Product[] {
  const overrides = getLocalProductOverrides();
  const deletedIds = new Set(getLocalDeletedProductIds());

  const remainingDb = dbProducts.filter((p) => !deletedIds.has(p.id));
  const resultMap = new Map<string, Product>();

  remainingDb.forEach((p) => {
    resultMap.set(p.id, overrides[p.id] ? { ...p, ...overrides[p.id] } : p);
  });

  Object.values(overrides).forEach((p) => {
    if (!deletedIds.has(p.id) && !resultMap.has(p.id)) {
      resultMap.set(p.id, p);
    }
  });

  return Array.from(resultMap.values());
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (error || !data) return mergeProductsWithOverrides([]);
    return mergeProductsWithOverrides(data as Product[]);
  } catch {
    return mergeProductsWithOverrides([]);
  }
}

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: fetchProducts });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const all = await fetchProducts();
      const match = all.find((p) => p.slug === slug || p.id === slug);
      if (match) return match;

      const { data } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
      return (data as Product | null) ?? null;
    },
  });
}
