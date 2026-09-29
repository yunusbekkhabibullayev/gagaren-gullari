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
  let url = p?.image_url?.trim();
  if (!url || url === "/flowers/flower-hero.jpg" || url === "flowers/flower-hero.jpg") {
    return "/flowers/flower-atirgul.jpg";
  }
  if (!url.startsWith("http") && !url.startsWith("/") && !url.startsWith("data:")) {
    return "/" + url;
  }
  return url;
}

export function compressImage(file: File, maxDimension = 1000, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Faylni o'qishda xatolik"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Rasm yuklashda xatolik"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL("image/jpeg", quality);
        resolve(compressed);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function processAndUploadImage(file: File): Promise<string> {
  return await compressImage(file, 1000, 0.82);
}


// Local override helpers to prevent edits from reverting
const PRODUCT_OVERRIDES_KEY = "admin_product_overrides";
const PRODUCT_DELETED_KEY = "admin_product_deleted";

export function getLocalProductOverrides(): Record<string, Product> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PRODUCT_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn("Failed to parse product overrides", e);
    // Clear corrupted data
    try {
      localStorage.removeItem(PRODUCT_OVERRIDES_KEY);
    } catch {}
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

export function saveProductOverride(product: Product, tempId?: string) {
  if (typeof window === "undefined") return;
  try {
    const overrides = getLocalProductOverrides();
    if (tempId && tempId !== product.id) {
      delete overrides[tempId];
    }
    overrides[product.id] = product;
    localStorage.setItem(PRODUCT_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch (e) {
    if ((e as any)?.name === "QuotaExceededError") {
      try {
        console.warn("LocalStorage quota exceeded, keeping only current product override");
        const overrides = { [product.id]: product };
        localStorage.setItem(PRODUCT_OVERRIDES_KEY, JSON.stringify(overrides));
      } catch (retryErr) {
        console.error("Failed to save product override even after cleanup", retryErr);
      }
    } else {
      console.error("Failed to save product override", e);
    }
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
    if ((e as any)?.name === "QuotaExceededError") {
      try {
        console.warn("LocalStorage quota exceeded during delete, clearing old overrides");
        localStorage.removeItem(PRODUCT_OVERRIDES_KEY);
        localStorage.removeItem(PRODUCT_DELETED_KEY);
        localStorage.setItem(PRODUCT_DELETED_KEY, JSON.stringify([id]));
      } catch (retryErr) {
        console.error("Failed to delete product even after cleanup", retryErr);
      }
    } else {
      console.error("Failed to delete product override", e);
    }
  }
}

export function mergeProductsWithOverrides(dbProducts: Product[]): Product[] {
  if (typeof window === "undefined") return dbProducts;
  const overrides = getLocalProductOverrides();
  const deletedIds = new Set(getLocalDeletedProductIds());

  const remainingDb = dbProducts.filter((p) => !deletedIds.has(p.id));
  const resultMap = new Map<string, Product>();

  remainingDb.forEach((p) => {
    const override = overrides[p.id] || Object.values(overrides).find((o) => o.slug === p.slug);
    resultMap.set(p.id, override ? { ...p, ...override } : p);
  });

  Object.values(overrides).forEach((p) => {
    if (
      !deletedIds.has(p.id) &&
      !resultMap.has(p.id) &&
      !Array.from(resultMap.values()).some((existing) => existing.slug === p.slug)
    ) {
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
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes (instant 0ms loading!)
    gcTime: 1000 * 60 * 60, // Keep in memory for 1 hour
  });
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
    staleTime: 1000 * 60 * 10,
  });
}
