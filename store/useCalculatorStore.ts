import { create } from 'zustand';
import { CalculatorState, initialCalculatorState } from '../utils/calculator';

interface CalculatorStore {
  state: CalculatorState;
  memory: number;
  setState: (state: CalculatorState) => void;
  setMemory: (value: number) => void;
  reset: () => void;
}

export const useCalculatorStore = create<CalculatorStore>((set) => ({
  state: initialCalculatorState,
  memory: 0,
  setState: (newState) => set({ state: newState }),
  setMemory: (value) => set({ memory: value }),
  reset: () => set({ state: initialCalculatorState, memory: 0 }),
}));

