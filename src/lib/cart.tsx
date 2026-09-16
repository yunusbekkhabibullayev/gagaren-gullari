import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/products";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  workshop: string;
  color: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (product: Product, color: string, qty?: number) => void;
  setQty: (slug: string, color: string, qty: number) => void;
  remove: (slug: string, color: string) => void;
  clear: () => void;
  hydrated: boolean;
};

const STORAGE_KEY = "sopol-cart-v2";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && typeof i.slug === "string"));
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const add = useCallback((product: Product, color: string, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.slug === product.slug && i.color === color);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: Math.min(99, next[idx].qty + qty) };
        return next;
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image_url || "/products/hero-plate.jpg",
          workshop: product.workshop,
          color,
          qty: Math.max(1, qty),
        },
      ];
    });
  }, []);

  const setQty = useCallback((slug: string, color: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.slug === slug && i.color === color ? { ...i, qty: Math.max(0, Math.min(99, qty)) } : i,
        )
        .filter((i) => i.qty > 0),
    );
  }, []);

  const remove = useCallback((slug: string, color: string) => {
    setItems((prev) => prev.filter((i) => !(i.slug === slug && i.color === color)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, l) => s + l.qty, 0);
    const subtotal = items.reduce((s, l) => s + l.qty * l.price, 0);
    return { items, count, subtotal, add, setQty, remove, clear, hydrated };
  }, [items, add, setQty, remove, clear, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
