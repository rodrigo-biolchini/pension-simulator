import { ScenarioOption } from '@/types';

// Financial assumptions
export const FINANCIAL_CONSTANTS = {
  ANNUAL_RETURN_RATE: 0.08, // 8% annual return
  RETIREMENT_PERIOD_YEARS: 15, // Assumed retirement period
  MONTHS_PER_YEAR: 12,
} as const;

// Scenario configurations
export const SCENARIO_OPTIONS: ScenarioOption[] = [
  {
    id: 'target-amount',
    title: 'Saldo na Aposentadoria',
    subtitle: 'Quanto quero ter acumulado na aposentadoria?',
    icon: 'Target',
    description: 'Calcule quanto precisa contribuir por mês para atingir sua meta de aposentadoria',
  },
  {
    id: 'monthly-contribution',
    title: 'Contribuição Mensal',
    subtitle: 'Quanto pretendo contribuir por mês?',
    icon: 'DollarSign',
    description: 'Veja quanto você acumulará com contribuições mensais fixas',
  },
  {
    id: 'retirement-income',
    title: 'Renda na Aposentadoria',
    subtitle: 'Quanto quero receber por mês após a aposentadoria?',
    icon: 'Calendar',
    description: 'Planeje a renda mensal desejada para sua aposentadoria',
  },
];

// Form validation constants
export const VALIDATION_CONSTANTS = {
  MIN_AGE: 18,
  MAX_AGE: 100,
  MIN_RETIREMENT_AGE: 50,
  MAX_RETIREMENT_AGE: 100,
  MIN_AMOUNT: 0,
  MAX_AMOUNT: 10000000, // 10 million
} as const;

// Gender options
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Feminino' },
];

// Currency formatting
export const CURRENCY_CONFIG = {
  locale: 'pt-BR',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
} as const; 