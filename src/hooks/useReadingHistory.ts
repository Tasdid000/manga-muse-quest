import { useState, useEffect, useCallback } from 'react';

export interface ReadingHistoryEntry {
  mangaId: string;
  mangaTitle: string;
  coverUrl: string;
  chapterId: string;
  chapterNumber: string;
  pageNumber: number;
  totalPages: number;
  lastReadAt: string;
}

const STORAGE_KEY = 'manhwa-reading-history';
const MAX_HISTORY_ITEMS = 50;

export function useReadingHistory() {
  const [history, setHistory] = useState<ReadingHistoryEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load reading history:', error);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((newHistory: ReadingHistoryEntry[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Failed to save reading history:', error);
    }
  }, []);

  // Update reading progress
  const updateProgress = useCallback((entry: Omit<ReadingHistoryEntry, 'lastReadAt'>) => {
    setHistory(prev => {
      const newEntry: ReadingHistoryEntry = {
        ...entry,
        lastReadAt: new Date().toISOString(),
      };

      // Remove existing entry for this manga if exists
      const filtered = prev.filter(h => h.mangaId !== entry.mangaId);
      
      // Add new entry at the beginning
      const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save reading history:', error);
      }
      
      return updated;
    });
  }, []);

  // Get progress for a specific manga
  const getProgress = useCallback((mangaId: string): ReadingHistoryEntry | undefined => {
    return history.find(h => h.mangaId === mangaId);
  }, [history]);

  // Clear all history
  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  // Remove single entry
  const removeEntry = useCallback((mangaId: string) => {
    setHistory(prev => {
      const updated = prev.filter(h => h.mangaId !== mangaId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    history,
    updateProgress,
    getProgress,
    clearHistory,
    removeEntry,
  };
}
