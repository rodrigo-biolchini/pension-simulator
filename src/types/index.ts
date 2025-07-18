export type SimulationScenario = 'target-amount' | 'monthly-contribution' | 'retirement-income';

export interface BaseInputs {
  currentAge: number;
  retirementAge: number;
  initialInvestment: number;
  gender: 'male' | 'female';
}

export interface TargetAmountInputs extends BaseInputs {
  desiredFinalAmount: number;
}

export interface MonthlyContributionInputs extends BaseInputs {
  monthlyContribution: number;
}

export interface RetirementIncomeInputs extends BaseInputs {
  desiredMonthlyIncome: number;
}

export interface CalculationResult {
  success: boolean;
  value?: number;
  error?: string;
  details?: {
    totalYears: number;
    totalMonths: number;
    totalContributions?: number;
    finalAmount?: number;
    monthlyContribution?: number;
    retirementBalance?: number;
    lifeExpectancy?: number;
    retirementPeriodYears?: number;
    // Input parameters for chart generation
    inputData?: {
      currentAge: number;
      retirementAge: number;
      initialInvestment: number;
      gender: 'male' | 'female';
      desiredFinalAmount?: number;
      monthlyContribution?: number;
      desiredMonthlyIncome?: number;
    };
  };
}

export interface ScenarioOption {
  id: SimulationScenario;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
}

export interface AppState {
  selectedScenario: SimulationScenario | null;
  isCalculating: boolean;
  lastResult: CalculationResult | null;
} 