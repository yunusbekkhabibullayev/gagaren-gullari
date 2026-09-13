import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Buketlar", slug: "buketlar", icon: "Flower2", color: "#e85d4a", order_index: 0, active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "2", name: "Atirgullar", slug: "atirgullar", icon: "Heart", color: "#f43f5e", order_index: 1, active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "3", name: "Tuvakdagi o'simliklar", slug: "tuvakdagi-osimliklar", icon: "Leaf", color: "#10b981", order_index: 2, active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "4", name: "Sovg'a to'plamlari", slug: "sovga-toplamlari", icon: "Gift", color: "#f59e0b", order_index: 3, active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const CATEGORY_OVERRIDES_KEY = "admin_category_overrides";
const CATEGORY_DELETED_KEY = "admin_category_deleted";

export function getLocalCategoryOverrides(): Record<string, Category> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CATEGORY_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCategoryOverride(cat: Category) {
  if (typeof window === "undefined") return;
  try {
    const overrides = getLocalCategoryOverrides();
    overrides[cat.id] = cat;
    localStorage.setItem(CATEGORY_OVERRIDES_KEY, JSON.stringify(overrides));
  } catch (e) {
    console.error("Failed to save category override", e);
  }
}

export function deleteCategoryOverride(id: string) {
  if (typeof window === "undefined") return;
  try {
    const overrides = getLocalCategoryOverrides();
    delete overrides[id];
    localStorage.setItem(CATEGORY_OVERRIDES_KEY, JSON.stringify(overrides));

    const rawDel = localStorage.getItem(CATEGORY_DELETED_KEY);
    const deleted: string[] = rawDel ? JSON.parse(rawDel) : [];
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem(CATEGORY_DELETED_KEY, JSON.stringify(deleted));
    }
  } catch (e) {
    console.error("Failed to delete category override", e);
  }
}

export function mergeCategoriesWithOverrides(dbCategories: Category[]): Category[] {
  const overrides = getLocalCategoryOverrides();
  let deletedIds = new Set<string>();
  try {
    const rawDel = localStorage.getItem(CATEGORY_DELETED_KEY);
    if (rawDel) deletedIds = new Set(JSON.parse(rawDel));
  } catch {}

  const source = dbCategories.length > 0 ? dbCategories : DEFAULT_CATEGORIES;
  const remainingDb = source.filter((c) => !deletedIds.has(c.id));
  const resultMap = new Map<string, Category>();

  remainingDb.forEach((c) => {
    resultMap.set(c.id, overrides[c.id] ? { ...c, ...overrides[c.id] } : c);
  });

  Object.values(overrides).forEach((c) => {
    if (!deletedIds.has(c.id) && !resultMap.has(c.id)) {
      resultMap.set(c.id, c);
    }
  });

  return Array.from(resultMap.values());
}

/** Public: faqat aktiv kategoriyalar (order_index bo'yicha) */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("active", true)
          .order("order_index", { ascending: true });
        if (error || !data) return mergeCategoriesWithOverrides([]);
        return mergeCategoriesWithOverrides(data as Category[]).filter((c) => c.active);
      } catch {
        return mergeCategoriesWithOverrides([]).filter((c) => c.active);
      }
    },
  });
}

/** Admin: barcha kategoriyalar (aktiv + yashirin) */
export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("order_index", { ascending: true });
        if (error || !data) {
          return mergeCategoriesWithOverrides([]);
        }
        return mergeCategoriesWithOverrides(data as Category[]);
      } catch {
        return mergeCategoriesWithOverrides([]);
      }
    },
    retry: 1,
  });
}
