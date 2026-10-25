import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const FAVORITES_STORAGE_KEY = "nastarin_favorites_ids";
const FAVORITES_EVENT = "nastarin_favorites_updated";

function getStoredFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFavorites(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(FAVORITES_EVENT));
  } catch (e) {
    console.error("Failed to save favorites", e);
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavoriteIds(getStoredFavorites());
    setHydrated(true);

    const handleUpdate = () => {
      setFavoriteIds(getStoredFavorites());
    };

    window.addEventListener(FAVORITES_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    (id: string, name?: string) => {
      const current = getStoredFavorites();
      let updated: string[];
      if (current.includes(id)) {
        updated = current.filter((item) => item !== id);
        toast.info(name ? `${name} sevimlilardan olib tashlandi` : "Sevimlilardan olib tashlandi");
      } else {
        updated = [...current, id];
        toast.success(name ? `${name} sevimlilarga qo'shildi! ❤️` : "Sevimlilarga qo'shildi! ❤️");
      }
      saveFavorites(updated);
      setFavoriteIds(updated);
    },
    []
  );

  const removeFavorite = useCallback((id: string) => {
    const current = getStoredFavorites();
    const updated = current.filter((item) => item !== id);
    saveFavorites(updated);
    setFavoriteIds(updated);
    toast.info("Sevimlilardan olib tashlandi");
  }, []);

  const clearFavorites = useCallback(() => {
    saveFavorites([]);
    setFavoriteIds([]);
    toast.info("Sevimlilar ro'yxati tozalandi");
  }, []);

  return {
    favoriteIds,
    count: favoriteIds.length,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
    hydrated,
  };
}
