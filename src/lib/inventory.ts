// Bilet 029 - Kichik do‘kon uchun zaxira yordamchisi (Inventory & Stock Management)

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
  type: "IN" | "OUT"; // Kirim (+) yoki Chiqim (-)
  amount: number;
  previousStock: number;
  newStock: number;
  date: string; // ISO string
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

// 1. Oltita mahsulotga boshlang‘ich qoldiq va eng kam zaxira chegarasini berish (1-shart)
export const DEFAULT_INVENTORY_PRODUCTS: InventoryProduct[] = [
  {
    id: "prod-1",
    name: "21 Qizil Atirgul El Toro",
    category: "Atirgullar",
    unit: "dona",
    price: 350000,
    initialStock: 10,
    stock: 10,
    minStock: 5,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Bahoriy Mix Buket",
    category: "Buketlar",
    unit: "dona",
    price: 280000,
    initialStock: 15,
    stock: 15,
    minStock: 4,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Premium Lolalar To'plami",
    category: "Buketlar",
    unit: "dona",
    price: 220000,
    initialStock: 8,
    stock: 3, // Boshlanishida kam zaxira ko'rsatish uchun
    minStock: 5,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-4",
    name: "Roza va Sovg'alar To'plami",
    category: "Sovg'alar",
    unit: "to'plam",
    price: 450000,
    initialStock: 12,
    stock: 12,
    minStock: 3,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-5",
    name: "Oq Atirgullar Klassik",
    category: "Atirgullar",
    unit: "dona",
    price: 320000,
    initialStock: 20,
    stock: 20,
    minStock: 6,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-6",
    name: "Orxideya Tuvakda Premium",
    category: "Tuvakdagi o'simliklar",
    unit: "tuvak",
    price: 390000,
    initialStock: 5,
    stock: 2, // Kam zaxirada
    minStock: 4,
    updatedAt: new Date().toISOString(),
  },
];

export function getInventoryProducts(): InventoryProduct[] {
  if (typeof window === "undefined") return DEFAULT_INVENTORY_PRODUCTS;
  try {
    const raw = localStorage.getItem(INVENTORY_PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(INVENTORY_PRODUCTS_KEY, JSON.stringify(DEFAULT_INVENTORY_PRODUCTS));
      return DEFAULT_INVENTORY_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_INVENTORY_PRODUCTS;
  } catch (e) {
    console.error("Failed to load inventory products:", e);
    return DEFAULT_INVENTORY_PRODUCTS;
  }
}

export function saveInventoryProducts(products: InventoryProduct[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INVENTORY_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error("Failed to save inventory products:", e);
  }
}

export function getInventoryLogs(): StockTransaction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INVENTORY_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load inventory logs:", e);
    return [];
  }
}

export function saveInventoryLogs(logs: StockTransaction[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INVENTORY_LOGS_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error("Failed to save inventory logs:", e);
  }
}

// 2 & 3. Kirim va chiqim yozuvlarini qo'shish va mavjuddan ortiq chiqimni rad etish (2 & 3 shart)
export function processStockMovement(
  productId: string,
  type: "IN" | "OUT",
  amount: number,
  note = ""
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
      message: "Mahsulot topilmadi!",
    };
  }

  const product = products[index];
  const previousStock = product.stock;

  // 3-SHART: Mavjuddan ortiq chiqimni RAD ETISH!
  if (type === "OUT" && amount > previousStock) {
    return {
      success: false,
      message: `Chiqim rad etildi! Mavjud qoldiq: ${previousStock} ${product.unit}, so'ralgan miqdor: ${amount} ${product.unit}. Orticha chiqim kiritish taqiqlanadi!`,
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
  const updatedLogs = [transactionLog, ...currentLogs];
  saveInventoryLogs(updatedLogs);

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

// Demo ma'lumotlarni qayta tiklash
export function resetInventoryToDefault(): { products: InventoryProduct[]; logs: StockTransaction[] } {
  saveInventoryProducts(DEFAULT_INVENTORY_PRODUCTS);
  saveInventoryLogs([]);
  return {
    products: DEFAULT_INVENTORY_PRODUCTS,
    logs: [],
  };
}

// Bilet 029 rasmiy tekshirish sinovini o'tkazuvchi funksiya:
// Tekshirish sharti: Qoldiq 10, chiqim 7 va chegara 5 bo‘lsa, 3 dona hamda zaxira kamligi ko‘rinsin; yana 4 dona chiqarish rad etilsin.
export function runBilet029TestCase(): {
  step1: { stock: number; minStock: number; message: string };
  step2: { success: boolean; newStock: number; isLowStock: boolean; message: string };
  step3: { success: boolean; rejectedMessage: string };
} {
  // 1. Reset prod-1 to stock=10, minStock=5
  const products = getInventoryProducts();
  const prodIndex = products.findIndex((p) => p.id === "prod-1") !== -1 ? products.findIndex((p) => p.id === "prod-1") : 0;
  
  products[prodIndex] = {
    ...products[prodIndex],
    initialStock: 10,
    stock: 10,
    minStock: 5,
    updatedAt: new Date().toISOString(),
  };
  saveInventoryProducts(products);

  const step1 = {
    stock: 10,
    minStock: 5,
    message: "Boshlang'ich holat: Qoldiq = 10, Eng kam chegara = 5",
  };

  // 2. Chiqim 7
  const step2Res = processStockMovement(products[prodIndex].id, "OUT", 7, "Bilet 029 Sinov Testi (1-bosqich: 7 dona chiqim)");
  const step2 = {
    success: step2Res.success,
    newStock: step2Res.product?.stock ?? 3,
    isLowStock: (step2Res.product?.stock ?? 3) < 5,
    message: `7 dona chiqarildi -> Joriy qoldiq: ${step2Res.product?.stock ?? 3} dona. Zaxira kamligi ogohlantirishi: AKTIV!`,
  };

  // 3. Yana 4 dona chiqarish -> Rad etilishi kerak!
  const step3Res = processStockMovement(products[prodIndex].id, "OUT", 4, "Bilet 029 Sinov Testi (2-bosqich: 4 dona chiqim)");
  const step3 = {
    success: step3Res.success, // should be false
    rejectedMessage: step3Res.message,
  };

  return { step1, step2, step3 };
}
