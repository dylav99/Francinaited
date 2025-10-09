import { useState, useEffect, useCallback } from 'react';
import { StoredImage } from '../types';

const HISTORY_STORAGE_KEY = 'francine-image-history';

export const useImageHistory = () => {
  const [history, setHistory] = useState<StoredImage[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load image history from local storage", error);
      // If parsing fails, clear the corrupted data
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  }, []);

  const saveHistory = useCallback((newHistory: StoredImage[]) => {
    try {
      // Prevent saving excessively large histories
      const historyToSave = newHistory.slice(0, 50);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyToSave));
      setHistory(historyToSave);
    } catch (error) {
      console.error("Failed to save image history to local storage", error);
    }
  }, []);

  const addImageToHistory = useCallback((image: Omit<StoredImage, 'id' | 'timestamp'>) => {
    const newImage: StoredImage = {
      ...image,
      id: `img-${Date.now()}`,
      timestamp: Date.now(),
    };
    setHistory(prevHistory => {
        const updatedHistory = [newImage, ...prevHistory];
        saveHistory(updatedHistory);
        return updatedHistory;
    });
  }, [saveHistory]);

  const removeImageFromHistory = useCallback((id: string) => {
    setHistory(prevHistory => {
        const updatedHistory = prevHistory.filter(image => image.id !== id);
        saveHistory(updatedHistory);
        return updatedHistory;
    });
  }, [saveHistory]);

  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  return { history, addImageToHistory, removeImageFromHistory, clearHistory };
};
