import { useQuery, useQueryClient } from "@tanstack/react-query";
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

const PRODUCT_LIST_SELECT =
  "id, slug, name, pattern, category, workshop, price, image_url, stock, created_at";

const PRODUCT_DETAIL_SELECT =
  "id, slug, name, pattern, category, workshop, price, size, weight, colors, image_url, image_url_2, stock, story, active, preparation";

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
    const merged = override ? { ...p, ...override } : p;
    merged.stock = p.stock;
    resultMap.set(p.id, merged);
  });

  Object.values(overrides).forEach((p) => {
    if (deletedIds.has(p.id)) return;

    const dbMatch = remainingDb.find((existing) => existing.id === p.id || existing.slug === p.slug);
    if (dbMatch) return;

    const alreadyPresent = Array.from(resultMap.values()).some((existing) => existing.id === p.id || existing.slug === p.slug);
    if (!alreadyPresent) {
      const safeProduct = { ...p, stock: p.stock };
      resultMap.set(p.id, safeProduct);
    }
  });

  return Array.from(resultMap.values());
}

async function fetchProductsPage(page = 1, pageSize = 8): Promise<Product[]> {
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(1, Number(pageSize) || 8);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  try {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_LIST_SELECT)
      .eq("active", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error || !data) return mergeProductsWithOverrides([]);
    return mergeProductsWithOverrides(data as unknown as Product[]);
  } catch {
    return mergeProductsWithOverrides([]);
  }
}

async function fetchProducts(): Promise<Product[]> {
  return fetchProductsPage(1, 8);
}

export function useProducts(page = 1, pageSize = 8) {
  return useQuery({
    queryKey: ["products", page, pageSize],
    queryFn: () => fetchProductsPage(page, pageSize),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
}

export function useProduct(slug: string) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const cachedList = qc.getQueryData<Product[]>(["products", 1, 8]);
      if (cachedList && cachedList.length > 0) {
        const found = cachedList.find((p) => p.slug === slug || p.id === slug);
        if (found) return found;
      }

      const all = await fetchProducts();
      const match = all.find((p) => p.slug === slug || p.id === slug);
      if (match) return match;

      const { data } = await supabase
        .from("products")
        .select(PRODUCT_DETAIL_SELECT)
        .eq("slug", slug)
        .maybeSingle();

      if (!data) throw new Error("Product not found");
      return data as unknown as Product;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}
