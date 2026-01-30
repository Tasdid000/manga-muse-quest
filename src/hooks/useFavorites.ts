import { useState, useEffect, useCallback } from 'react';

export interface FavoriteEntry {
  mangaId: string;
  mangaTitle: string;
  coverUrl: string;
  addedAt: string;
}

const STORAGE_KEY = 'manhwa-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  }, []);

  // Add to favorites
  const addFavorite = useCallback((entry: Omit<FavoriteEntry, 'addedAt'>) => {
    setFavorites(prev => {
      // Check if already exists
      if (prev.some(f => f.mangaId === entry.mangaId)) {
        return prev;
      }

      const newEntry: FavoriteEntry = {
        ...entry,
        addedAt: new Date().toISOString(),
      };

      const updated = [newEntry, ...prev];
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
      
      return updated;
    });
  }, []);

  // Remove from favorites
  const removeFavorite = useCallback((mangaId: string) => {
    setFavorites(prev => {
      const updated = prev.filter(f => f.mangaId !== mangaId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Toggle favorite status
  const toggleFavorite = useCallback((entry: Omit<FavoriteEntry, 'addedAt'>) => {
    const isFav = favorites.some(f => f.mangaId === entry.mangaId);
    if (isFav) {
      removeFavorite(entry.mangaId);
    } else {
      addFavorite(entry);
    }
  }, [favorites, addFavorite, removeFavorite]);

  // Check if manga is favorited
  const isFavorite = useCallback((mangaId: string): boolean => {
    return favorites.some(f => f.mangaId === mangaId);
  }, [favorites]);

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setFavorites([]);
  }, []);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
}
