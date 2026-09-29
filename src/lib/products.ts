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
  const compressedDataUrl = await compressImage(file, 1000, 0.82);

  try {
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });

    if (!error && data) {
      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }
    }
  } catch (err) {
    console.warn("Supabase storage upload failed, using compressed data URL:", err);
  }

  return compressedDataUrl;
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

export function saveProductOverride(product: Product) {
  if (typeof window === "undefined") return;
  try {
    const overrides = getLocalProductOverrides();
    overrides[product.id] = product;
    localStorage.setItem(PRODUCT_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch (e) {
    // If QuotaExceededError, clear old overrides and retry
    if ((e as any)?.name === "QuotaExceededError") {
      try {
        console.warn("LocalStorage quota exceeded, clearing old overrides");
        localStorage.removeItem(PRODUCT_OVERRIDES_KEY);
        localStorage.removeItem(PRODUCT_DELETED_KEY);
        // Retry with fresh storage
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
    // If QuotaExceededError, clear and retry with minimal data
    if ((e as any)?.name === "QuotaExceededError") {
      try {
        console.warn("LocalStorage quota exceeded during delete, clearing old overrides");
        localStorage.removeItem(PRODUCT_OVERRIDES_KEY);
        localStorage.removeItem(PRODUCT_DELETED_KEY);
        // Retry with just the deleted ID
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
