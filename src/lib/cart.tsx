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
import { getInventoryProducts } from "@/lib/inventory";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getLiveProductStock, getLiveProductStockBySlug } from "@/lib/stock";

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
    const normalizedQty = Number.isFinite(qty) ? Math.max(1, Math.round(qty)) : 1;
    if (normalizedQty <= 0) {
      toast.error("Miqdor 1 dan kichik bo'lishi mumkin emas.");
      return;
    }

    void (async () => {
      const availableStock = await getLiveProductStock(product);

      setItems((prev) => {
        const totalQtyForProduct = prev
          .filter((item) => item.slug === product.slug)
          .reduce((sum, item) => sum + item.qty, 0);
        const currentQtyInCart = prev.find((item) => item.slug === product.slug && item.color === color)?.qty ?? 0;
        const requestedTotal = totalQtyForProduct - currentQtyInCart + normalizedQty;

        if (requestedTotal > availableStock) {
          toast.error(
            `Xarid rad etildi! Omborda bor-yo'g'i ${availableStock} dona mavjud. (Savatda: ${totalQtyForProduct} dona, so'raldi: ${normalizedQty} dona)`,
            { duration: 5000 },
          );
          return prev;
        }

        toast.success(
          `${product.name} savatga qo'shildi! (Omborda qoldiq: ${Math.max(0, availableStock - requestedTotal)} dona)`,
        );

        const idx = prev.findIndex((item) => item.slug === product.slug && item.color === color);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: requestedTotal };
          return next;
        }

        return [
          ...prev,
          {
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.image_url || "/flowers/flower-atirgul.jpg",
            workshop: product.workshop,
            color,
            qty: Math.max(1, normalizedQty),
          },
        ];
      });
    })();
  }, []);

  const setQty = useCallback((slug: string, color: string, qty: number) => {
    const nextQty = Number.isFinite(qty) ? Math.max(0, Math.round(qty)) : 0;
    if (nextQty === 0) {
      setItems((prev) => prev.filter((item) => !(item.slug === slug && item.color === color)));
      return;
    }

    void (async () => {
      const availableStock = await getLiveProductStockBySlug(slug);

      setItems((prev) => {
        const currentProductQty = prev
          .filter((item) => item.slug === slug)
          .reduce((sum, item) => sum + item.qty, 0);
        const currentItemQty = prev.find((item) => item.slug === slug && item.color === color)?.qty ?? 0;
        const maxAllowed = Math.max(0, availableStock - (currentProductQty - currentItemQty));
        const safeQty = Math.min(nextQty, maxAllowed || 0);

        return prev
          .map((item) =>
            item.slug === slug && item.color === color ? { ...item, qty: Math.max(0, safeQty) } : item,
          )
          .filter((item) => item.qty > 0);
      });
    })();
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
