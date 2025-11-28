import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Currency } from '../types';

interface FavoritesState {
  favoriteCurrencies: string[];
  addFavorite: (currencyCode: string) => void;
  removeFavorite: (currencyCode: string) => void;
  isFavorite: (currencyCode: string) => boolean;
  toggleFavorite: (currencyCode: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteCurrencies: [],
      addFavorite: (currencyCode) =>
        set((state) => ({
          favoriteCurrencies: [...state.favoriteCurrencies, currencyCode],
        })),
      removeFavorite: (currencyCode) =>
        set((state) => ({
          favoriteCurrencies: state.favoriteCurrencies.filter(
            (code) => code !== currencyCode
          ),
        })),
      isFavorite: (currencyCode) =>
        get().favoriteCurrencies.includes(currencyCode),
      toggleFavorite: (currencyCode) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(currencyCode)) {
          removeFavorite(currencyCode);
        } else {
          addFavorite(currencyCode);
        }
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

