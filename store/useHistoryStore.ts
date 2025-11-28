import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConversionResult } from '../types';

interface HistoryState {
  conversions: ConversionResult[];
  addConversion: (conversion: ConversionResult) => void;
  clearHistory: () => void;
  getRecentConversions: (limit?: number) => ConversionResult[];
}

const MAX_HISTORY = 50;

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      conversions: [],
      addConversion: (conversion) =>
        set((state) => {
          const newConversions = [conversion, ...state.conversions].slice(0, MAX_HISTORY);
          return { conversions: newConversions };
        }),
      clearHistory: () => set({ conversions: [] }),
      getRecentConversions: (limit = 10) => {
        return get().conversions.slice(0, limit);
      },
    }),
    {
      name: 'conversion-history-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

