import { create } from 'zustand';
import { Currency, ConversionResult } from '../types';
import { POPULAR_CURRENCIES } from '../constants/currencies';

interface ConverterState {
  fromCurrency: Currency;
  toCurrency: Currency;
  amount: string;
  result: ConversionResult | null;
  loading: boolean;
  error: string | null;
  setFromCurrency: (currency: Currency) => void;
  setToCurrency: (currency: Currency) => void;
  setAmount: (amount: string) => void;
  setResult: (result: ConversionResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  swapCurrencies: () => void;
  reset: () => void;
}

export const useConverterStore = create<ConverterState>((set) => ({
  fromCurrency: POPULAR_CURRENCIES[0],
  toCurrency: POPULAR_CURRENCIES[1],
  amount: '1',
  result: null,
  loading: false,
  error: null,
  setFromCurrency: (currency) => set({ fromCurrency: currency }),
  setToCurrency: (currency) => set({ toCurrency: currency }),
  setAmount: (amount) => set({ amount }),
  setResult: (result) => set({ result }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  swapCurrencies: () =>
    set((state) => ({
      fromCurrency: state.toCurrency,
      toCurrency: state.fromCurrency,
      amount: state.result
        ? state.result.result.toFixed(2)
        : state.amount,
      result: null,
    })),
  reset: () =>
    set({
      fromCurrency: POPULAR_CURRENCIES[0],
      toCurrency: POPULAR_CURRENCIES[1],
      amount: '1',
      result: null,
      loading: false,
      error: null,
    }),
}));

