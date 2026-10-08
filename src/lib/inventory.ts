import { supabase } from "@/integrations/supabase/client";

export type InventoryProduct = {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  initialStock: number;
  stock: number;
  minStock: number;
  updatedAt: string;
};

export type StockTransaction = {
  id: string;
  productId: string;
  productName: string;
  type: "IN" | "OUT";
  amount: number;
  previousStock: number;
  newStock: number;
  date: string;
  note: string;
};

export type ProcessStockResult = {
  success: boolean;
  message: string;
  product?: InventoryProduct;
  transaction?: StockTransaction;
  isLowStock?: boolean;
};

const INVENTORY_PRODUCTS_KEY = "bilet029_inventory_products";
const INVENTORY_LOGS_KEY = "bilet029_inventory_logs";
const INVENTORY_CACHE_TTL_MS = 5 * 60 * 1000;

function readInventoryCache(): InventoryProduct[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(INVENTORY_PRODUCTS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => item && typeof item.id === "string");
    }

    if (parsed && Array.isArray(parsed.products)) {
      const ageMs = Date.now() - Number(parsed.updatedAt || 0);
      if (ageMs <= INVENTORY_CACHE_TTL_MS) {
        return parsed.products.filter((item: unknown) => item && typeof (item as any).id === "string");
      }
    }

    return [];
  } catch {
    return [];
  }
}

function writeInventoryCache(products: InventoryProduct[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      INVENTORY_PRODUCTS_KEY,
      JSON.stringify({ updatedAt: Date.now(), products }),
    );
  } catch {
    // ignore write failures; database remains the source of truth
  }
}

function readInventoryLogsCache(): StockTransaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INVENTORY_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeInventoryLogsCache(logs: StockTransaction[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INVENTORY_LOGS_KEY, JSON.stringify(logs));
  } catch {
    // ignore write failures
  }
}

async function loadInventoryLogsFromSupabase(): Promise<StockTransaction[]> {
  try {
    const { data: productRows, error: productError } = await supabase
      .from("products")
      .select("id, name");

    if (productError) throw productError;

    const productNameById = new Map<string, string>();
    for (const product of productRows ?? []) {
      if (product?.id) {
        productNameById.set(product.id, String(product.name ?? "Mahsulot"));
      }
    }

    const { data, error } = await supabase
      .from("inventory_logs")
      .select("id, product_id, type, amount, previous_stock, new_stock, note, created_at")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return readInventoryLogsCache();
    }

    const mapped: StockTransaction[] = data.map((row) => ({
      id: String(row.id ?? `${Date.now()}-${Math.random()}`),
      productId: String(row.product_id ?? ""),
      productName: productNameById.get(String(row.product_id ?? "")) ?? "Mahsulot",
      type: row.type === "IN" ? "IN" : "OUT",
      amount: Number(row.amount ?? 0),
      previousStock: Number(row.previous_stock ?? 0),
      newStock: Number(row.new_stock ?? 0),
      date: String(row.created_at ?? new Date().toISOString()),
      note: String(row.note ?? ""),
    }));

    writeInventoryLogsCache(mapped);
    return mapped;
  } catch {
    return readInventoryLogsCache();
  }
}

export async function syncInventoryFromSupabase(): Promise<InventoryProduct[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, category, stock, price, slug, active, created_at")
      .order("created_at", { ascending: false });

    if (error || !data) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(INVENTORY_PRODUCTS_KEY);
      }
      return readInventoryCache();
    }

    const mapped = data
      .filter((product) => product.active !== false)
      .map((product) => {
        const stock = Number(product.stock ?? 0);
        const minStock = Math.max(1, Math.round(stock * 0.3) || 1);

        return {
          id: product.id,
          name: product.name,
          category: product.category || "Umumiy",
          unit: "dona",
          price: Number(product.price ?? 0),
          initialStock: stock,
          stock,
          minStock,
          updatedAt: product.created_at || new Date().toISOString(),
        };
      });

    writeInventoryCache(mapped);
    return mapped;
  } catch {
    return readInventoryCache();
  }
}

export async function getInventoryProducts(): Promise<InventoryProduct[]> {
  return syncInventoryFromSupabase();
}

export function saveInventoryProducts(products: InventoryProduct[]): void {
  writeInventoryCache(products);
}

export async function getInventoryLogs(): Promise<StockTransaction[]> {
  return loadInventoryLogsFromSupabase();
}

export function saveInventoryLogs(logs: StockTransaction[]): void {
  writeInventoryLogsCache(logs);
}

export async function processStockMovement(
  productId: string,
  type: "IN" | "OUT",
  amount: number,
  note = "",
): Promise<ProcessStockResult> {
  if (amount <= 0 || isNaN(amount)) {
    return {
      success: false,
      message: "Miqdor 0 dan katta butun son bo'lishi kerak!",
    };
  }

  let products = await syncInventoryFromSupabase();
  if (products.length === 0) {
    products = readInventoryCache();
  }

  const index = products.findIndex((p) => p.id === productId);

  if (index === -1) {
    return {
      success: false,
      message: "Mahsulot topilmadi! Avval Supabase bazasidan ma'lumotni yangilang.",
    };
  }

  const product = products[index];
  const previousStock = product.stock;

  if (type === "OUT" && amount > previousStock) {
    return {
      success: false,
      message: `Chiqim rad etildi! Mavjud qoldiq: ${previousStock} ${product.unit}, so'ralgan miqdor: ${amount} ${product.unit}.`,
    };
  }

  const newStock = type === "IN" ? previousStock + amount : previousStock - amount;
  const updatedProduct: InventoryProduct = {
    ...product,
    stock: newStock,
    updatedAt: new Date().toISOString(),
  };

  try {
    const { error } = await supabase
      .from("products")
      .update({ stock: Number(newStock) })
      .eq("id", productId);

    if (error) {
      return {
        success: false,
        message: `Supabase yozishda xatolik: ${error.message || "unknown error"}`,
      };
    }
  } catch {
    return {
      success: false,
      message: "Supabasega yozib bo'lmadi. Ulanishni tekshiring.",
    };
  }

  const transactionLog: StockTransaction = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    productId: product.id,
    productName: product.name,
    type,
    amount,
    previousStock,
    newStock,
    date: new Date().toISOString(),
    note: note.trim() || (type === "IN" ? "Omborga yangi kirim" : "Sotuv / Chiqim yozuvi"),
  };

  try {
    const { error: logError } = await supabase.from("inventory_logs").insert({
      product_id: product.id,
      type,
      amount,
      previous_stock: previousStock,
      new_stock: newStock,
      note: transactionLog.note,
    });

    if (!logError) {
      const realLogs = await loadInventoryLogsFromSupabase();
      saveInventoryLogs(realLogs);
    } else {
      const currentLogs = readInventoryLogsCache();
      saveInventoryLogs([transactionLog, ...currentLogs]);
    }
  } catch {
    const currentLogs = readInventoryLogsCache();
    saveInventoryLogs([transactionLog, ...currentLogs]);
  }

  products[index] = updatedProduct;
  saveInventoryProducts(products);

  const isLowStock = newStock < product.minStock;

  let successMsg = "";
  if (type === "IN") {
    successMsg = `${product.name} uchun +${amount} ${product.unit} kirim qilindi. Yangi qoldiq: ${newStock} ${product.unit}.`;
  } else {
    successMsg = `${product.name} uchun -${amount} ${product.unit} chiqim qilindi. Yangi qoldiq: ${newStock} ${product.unit}.`;
    if (isLowStock) {
      successMsg += ` ⚠️ DIQQAT: Qoldiq eng kam chegara (${product.minStock} ${product.unit})dan kamaydi!`;
    }
  }

  return {
    success: true,
    message: successMsg,
    product: updatedProduct,
    transaction: transactionLog,
    isLowStock,
  };
}

export function resetInventoryToDefault(): { products: InventoryProduct[]; logs: StockTransaction[] } {
  if (typeof window !== "undefined") {
    localStorage.removeItem(INVENTORY_PRODUCTS_KEY);
    localStorage.removeItem(INVENTORY_LOGS_KEY);
  }

  return { products: [], logs: [] };
}

export async function runBilet029TestCase(): Promise<{
  step1: { stock: number; minStock: number; message: string };
  step2: { success: boolean; newStock: number; isLowStock: boolean; message: string };
  step3: { success: boolean; rejectedMessage: string };
}> {
  const products = await syncInventoryFromSupabase();
  if (products.length === 0) {
    return {
      step1: {
        stock: 0,
        minStock: 0,
        message: "Real DBdan mahsulotlar topilmadi. Avval Supabase ma'lumotlarini yuklang.",
      },
      step2: {
        success: false,
        newStock: 0,
        isLowStock: false,
        message: "Real DB stock yo'q; testni bajarish uchun bazada mahsulot mavjud bo'lishi kerak.",
      },
      step3: { success: false, rejectedMessage: "Real DBga ulanib, mahsulot qoldig'ini yuklang." },
    };
  }

  const prod = products[0];
  const productId = prod.id;
  const step1 = {
    stock: prod.stock,
    minStock: prod.minStock,
    message: `Boshlang'ich holat: qoldiq = ${prod.stock}, min chegarasi = ${prod.minStock}`,
  };

  const step2Res = await processStockMovement(productId, "OUT", 7, "Bilet 029 sinovi");
  const step2 = {
    success: step2Res.success,
    newStock: step2Res.product?.stock ?? 0,
    isLowStock: step2Res.product ? step2Res.product.stock < step2Res.product.minStock : false,
    message: `7 dona chiqarildi -> qoldiq: ${step2Res.product?.stock ?? 0}.`,
  };

  const step3Res = await processStockMovement(productId, "OUT", 4, "Bilet 029 sinovi 2-bosqich");
  const step3 = {
    success: step3Res.success,
    rejectedMessage: step3Res.message,
  };

  return { step1, step2, step3 };
}
