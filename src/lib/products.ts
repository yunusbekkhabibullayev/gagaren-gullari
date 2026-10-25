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

export const DEFAULT_FLOWER_PRODUCTS: Product[] = [
  {
    id: "prod-pink-lily",
    slug: "pink-lily-premium-buket",
    name: "Pink Lily Premium Buket",
    pattern: "To'y va bayramlar uchun liliya",
    category: "Buketlar",
    workshop: "Golland",
    price: 380000,
    size: "Balandligi 60 sm",
    weight: "1.2 kg",
    colors: ["Pushti", "Oq"],
    image_url: "/images/floriva/product-pink-lily.jpg",
    stock: 15,
    story: "Yangi uzilgan pushti liliyalar va nozik evkalipt barglaridan iborat mualliflik guldastasi.",
    active: true,
  },
  {
    id: "prod-atirgul-qutida",
    slug: "qizil-atirgullar-qutida-25",
    name: "Qizil Atirgullar Qutida (25 dona)",
    pattern: "Premium qora qutidagi atirgullar",
    category: "Atirgullar",
    workshop: "Golland",
    price: 450000,
    size: "Quti Ø 24 sm",
    weight: "1.5 kg",
    colors: ["Qizil"],
    image_url: "/images/floriva/cat-boxes.jpg",
    stock: 20,
    story: "Maxsus sovg'abop qutidagi 25 dona yangi uzilgan qizil atirgul. 7 kungacha so'lmaydi.",
    active: true,
  },
  {
    id: "prod-bahoriy-buket",
    slug: "mualliflik-bahoriy-buket",
    name: "Mualliflik Bahoriy Buket",
    pattern: "Pushti va oq aralash gullar",
    category: "Buketlar",
    workshop: "Mahalliy",
    price: 290000,
    size: "Balandligi 50 sm",
    weight: "900 g",
    colors: ["Pushti", "Oq", "Yashil"],
    image_url: "/flowers/flower-buket.jpg",
    stock: 18,
    story: "Bahoriy nafislikni ifodalovchi yorqin va hushbo'y mualliflik guldastasi.",
    active: true,
  },
  {
    id: "prod-orxideya-vaza",
    slug: "orxideya-shisha-vazada",
    name: "Orxideya Shisha Vazada",
    pattern: "Tirik gulli orxideya",
    category: "Tuvakdagi o'simliklar",
    workshop: "Golland",
    price: 320000,
    size: "Vaza Ø 18 sm, bo'yi 45 sm",
    weight: "1.1 kg",
    colors: ["Oq", "Binafsha"],
    image_url: "/images/floriva/cat-vases.jpg",
    stock: 10,
    story: "Maxsus shisha vazodagi uzoq muddat so'lmaydigan tirik orxideya guli.",
    active: true,
  },
  {
    id: "prod-sovga-toplami",
    slug: "premium-sovga-toplami-box",
    name: "Premium Sovg'a To'plami",
    pattern: "Gul + Shokolad + Tabriknoma",
    category: "Sovg'a to'plamlari",
    workshop: "Mahalliy",
    price: 490000,
    size: "Sovg'a qutisi 30×25 sm",
    weight: "1.8 kg",
    colors: ["Pushti", "Oltin"],
    image_url: "/images/floriva/cat-giftset.jpg",
    stock: 12,
    story: "Qo'lda yig'ilgan mualliflik guldastasi, shveysariya shokoladi va esdalik sovg'alari.",
    active: true,
  },
  {
    id: "prod-atirgul-klassik",
    slug: "klassik-qizil-atirgullar-15",
    name: "Klassik Qizil Atirgullar (15 dona)",
    pattern: "15 dona premium atirgullar",
    category: "Atirgullar",
    workshop: "Golland",
    price: 240000,
    size: "Bo'yi 70 sm",
    weight: "1.0 kg",
    colors: ["Qizil"],
    image_url: "/flowers/flower-atirgul.jpg",
    stock: 25,
    story: "Muhabbat va ehtirom ifodasi bo'lgan klassik qizil atirgullar to'plami.",
    active: true,
  },
  {
    id: "prod-golland-lola",
    slug: "golland-lolalari-21",
    name: "Golland Lolalari To'plami (21 dona)",
    pattern: "21 dona sariq va qizil lola",
    category: "Buketlar",
    workshop: "Golland",
    price: 270000,
    size: "Bo'yi 45 sm",
    weight: "800 g",
    colors: ["Sariq", "Qizil"],
    image_url: "/flowers/flower-lola.jpg",
    stock: 16,
    story: "Gollandiyadan keltirilgan yangi va yangragan nafis lolalar.",
    active: true,
  },
  {
    id: "prod-tuvak-fikus",
    slug: "xonadon-uchun-yashil-fikus",
    name: "Xonadon Uchun Yashil Fikus",
    pattern: "Dekorativ xona o'simligi",
    category: "Tuvakdagi o'simliklar",
    workshop: "Mahalliy",
    price: 180000,
    size: "Tuvak Ø 20 sm, bo'yi 55 sm",
    weight: "2.0 kg",
    colors: ["Yashil"],
    image_url: "/flowers/flower-tuvak.jpg",
    stock: 14,
    story: "Uyingizga shinamlik va toza havo bag'ishlovchi yashil xona o'simligi.",
    active: true,
  },
  {
    id: "prod-romantik-quti",
    slug: "dostlik-romantik-sovga-qutisi",
    name: "Do'stlik Romantik Qutisi",
    pattern: "Pushti gullar va atir",
    category: "Sovg'a to'plamlari",
    workshop: "Mahalliy",
    price: 520000,
    size: "Quti 28×28 sm",
    weight: "1.6 kg",
    colors: ["Pushti"],
    image_url: "/flowers/flower-sovga.jpg",
    stock: 8,
    story: "Yaqiningizni xursand qilish uchun eng nafis gullar va sovg'alar uyg'unligi.",
    active: true,
  },
  {
    id: "prod-hand-bouquet-special",
    slug: "hand-bouquet-nastarin-special",
    name: "Hand Bouquet Nastarin Special",
    pattern: "Miks guldasta va sovg'a lentalari",
    category: "Buketlar",
    workshop: "Golland",
    price: 350000,
    size: "Bo'yi 55 sm",
    weight: "1.1 kg",
    colors: ["Miks", "Pushti"],
    image_url: "/images/floriva/cat-bouquets.jpg",
    stock: 15,
    story: "Nastarin Gullari floristlaridan maxsus mualliflik dizayni asosidagi guldasta.",
    active: true,
  },
];

async function fetchProductsPage(page = 1, pageSize = 8): Promise<Product[]> {
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(1, Number(pageSize) || 8);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.warn("[Supabase fetchProductsPage error]:", error.message || error);
    }

    if (data && data.length > 0) {
      return mergeProductsWithOverrides(data as unknown as Product[]);
    }
    return mergeProductsWithOverrides(DEFAULT_FLOWER_PRODUCTS);
  } catch (err) {
    console.error("[Supabase fetchProductsPage exception]:", err);
    return mergeProductsWithOverrides(DEFAULT_FLOWER_PRODUCTS);
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
