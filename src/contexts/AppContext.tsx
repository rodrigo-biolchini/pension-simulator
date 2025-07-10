'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { SimulationScenario, AppState, CalculationResult } from '@/types';

// Action types
type AppAction =
  | { type: 'SET_SCENARIO'; payload: SimulationScenario | null }
  | { type: 'SET_CALCULATING'; payload: boolean }
  | { type: 'SET_RESULT'; payload: CalculationResult | null }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: AppState = {
  selectedScenario: null,
  isCalculating: false,
  lastResult: null,
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SCENARIO':
      return {
        ...state,
        selectedScenario: action.payload,
        lastResult: null, // Reset result when scenario changes
      };
    case 'SET_CALCULATING':
      return {
        ...state,
        isCalculating: action.payload,
      };
    case 'SET_RESULT':
      return {
        ...state,
        lastResult: action.payload,
        isCalculating: false,
      };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  setScenario: (scenario: SimulationScenario | null) => void;
  setCalculating: (calculating: boolean) => void;
  setResult: (result: CalculationResult | null) => void;
  resetState: () => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper functions
  const setScenario = (scenario: SimulationScenario | null) => {
    dispatch({ type: 'SET_SCENARIO', payload: scenario });
  };

  const setCalculating = (calculating: boolean) => {
    dispatch({ type: 'SET_CALCULATING', payload: calculating });
  };

  const setResult = (result: CalculationResult | null) => {
    dispatch({ type: 'SET_RESULT', payload: result });
  };

  const resetState = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  const value: AppContextType = {
    state,
    dispatch,
    setScenario,
    setCalculating,
    setResult,
    resetState,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Selector hooks for specific state values
export function useSelectedScenario() {
  const { state } = useApp();
  return state.selectedScenario;
}

export function useIsCalculating() {
  const { state } = useApp();
  return state.isCalculating;
}

export function useLastResult() {
  const { state } = useApp();
  return state.lastResult;
} 