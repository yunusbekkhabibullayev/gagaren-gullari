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
      return [];
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

    if (typeof window !== "undefined") {
      localStorage.setItem(INVENTORY_PRODUCTS_KEY, JSON.stringify(mapped));
    }

    return mapped;
  } catch {
    return getInventoryProducts();
  }
}

export function getInventoryProducts(): InventoryProduct[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(INVENTORY_PRODUCTS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveInventoryProducts(products: InventoryProduct[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INVENTORY_PRODUCTS_KEY, JSON.stringify(products));
  } catch {
    // ignore write failures; real DB remains source of truth
  }
}

export function getInventoryLogs(): StockTransaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INVENTORY_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveInventoryLogs(logs: StockTransaction[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INVENTORY_LOGS_KEY, JSON.stringify(logs));
  } catch {
    // ignore write failures
  }
}

export function processStockMovement(
  productId: string,
  type: "IN" | "OUT",
  amount: number,
  note = "",
): ProcessStockResult {
  if (amount <= 0 || isNaN(amount)) {
    return {
      success: false,
      message: "Miqdor 0 dan katta butun son bo'lishi kerak!",
    };
  }

  const products = getInventoryProducts();
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

  products[index] = updatedProduct;
  saveInventoryProducts(products);

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

  const currentLogs = getInventoryLogs();
  saveInventoryLogs([transactionLog, ...currentLogs]);

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

export function runBilet029TestCase(): {
  step1: { stock: number; minStock: number; message: string };
  step2: { success: boolean; newStock: number; isLowStock: boolean; message: string };
  step3: { success: boolean; rejectedMessage: string };
} {
  const products = getInventoryProducts();
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

  const step2Res = processStockMovement(productId, "OUT", 7, "Bilet 029 sinovi");
  const step2 = {
    success: step2Res.success,
    newStock: step2Res.product?.stock ?? 0,
    isLowStock: step2Res.product ? step2Res.product.stock < step2Res.product.minStock : false,
    message: `7 dona chiqarildi -> qoldiq: ${step2Res.product?.stock ?? 0}.`,
  };

  const step3Res = processStockMovement(productId, "OUT", 4, "Bilet 029 sinovi 2-bosqich");
  const step3 = {
    success: step3Res.success,
    rejectedMessage: step3Res.message,
  };

  return { step1, step2, step3 };
}
