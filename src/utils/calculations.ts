import { FINANCIAL_CONSTANTS } from '@/constants';
import {
  BaseInputs,
  TargetAmountInputs,
  MonthlyContributionInputs,
  RetirementIncomeInputs,
  CalculationResult,
} from '@/types';
import { getLifeExpectancy, validateLifeExpectancyInputs } from '@/utils/lifeExpectancy';

/**
 * Calculate compound interest with monthly contributions
 * Formula: FV = PV * (1 + r)^n + PMT * [((1 + r)^n - 1) / r]
 * Where:
 * - FV = Future Value
 * - PV = Present Value (initial investment)
 * - PMT = Monthly Payment
 * - r = Monthly interest rate
 * - n = Number of periods (months)
 */
function calculateFutureValue(
  presentValue: number,
  monthlyPayment: number,
  monthlyRate: number,
  months: number
): number {
  if (monthlyRate === 0) {
    return presentValue + monthlyPayment * months;
  }
  
  const compoundFactor = Math.pow(1 + monthlyRate, months);
  const annuityFactor = (compoundFactor - 1) / monthlyRate;
  
  return presentValue * compoundFactor + monthlyPayment * annuityFactor;
}

/**
 * Calculate required monthly payment to reach target future value
 * Formula: PMT = (FV - PV * (1 + r)^n) / [((1 + r)^n - 1) / r]
 */
function calculateMonthlyPayment(
  futureValue: number,
  presentValue: number,
  monthlyRate: number,
  months: number
): number {
  if (monthlyRate === 0) {
    return (futureValue - presentValue) / months;
  }
  
  const compoundFactor = Math.pow(1 + monthlyRate, months);
  const annuityFactor = (compoundFactor - 1) / monthlyRate;
  
  return (futureValue - presentValue * compoundFactor) / annuityFactor;
}

/**
 * Validate common inputs including gender for life expectancy calculation
 */
function validateBaseInputs(inputs: BaseInputs): string | null {
  const { currentAge, retirementAge, initialInvestment, gender } = inputs;
  
  if (currentAge < 18 || currentAge > 100) {
    return 'Idade atual deve estar entre 18 e 100';
  }
  
  if (retirementAge < 50 || retirementAge > 100) {
    return 'Idade de aposentadoria deve estar entre 50 e 100';
  }
  
  if (retirementAge <= currentAge) {
    return 'Idade de aposentadoria deve ser maior que a idade atual';
  }
  
  if (initialInvestment < 0) {
    return 'Investimento inicial não pode ser negativo';
  }
  
  // Validate gender for life expectancy calculation
  const genderValidation = validateLifeExpectancyInputs(retirementAge, gender);
  if (!genderValidation.isValid) {
    return genderValidation.error || 'Erro na validação do sexo';
  }
  
  return null;
}

/**
 * Case 1: Calculate monthly contribution needed to reach target amount
 */
export function calculateMonthlyContribution(
  inputs: TargetAmountInputs
): CalculationResult {
  try {
    // Validate inputs
    const baseValidation = validateBaseInputs(inputs);
    if (baseValidation) {
      return { success: false, error: baseValidation };
    }
    
    const { currentAge, retirementAge, initialInvestment, desiredFinalAmount, gender } = inputs;

    if (desiredFinalAmount <= 0) {
      return { success: false, error: 'Saldo alvo deve ser positivo' };
    }
    
    if (desiredFinalAmount <= initialInvestment) {
      return { success: false, error: 'Saldo alvo deve ser maior que o investimento inicial' };
    }
    
    // Calculate periods and rates
    const totalYears = retirementAge - currentAge;
    const totalMonths = totalYears * FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
    const monthlyRate = FINANCIAL_CONSTANTS.ANNUAL_RETURN_RATE / FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
    
    // Get life expectancy for this person
    const lifeExpectancy = getLifeExpectancy(retirementAge, gender);
    
    // Calculate required monthly contribution
    const monthlyContribution = calculateMonthlyPayment(
      desiredFinalAmount,
      initialInvestment,
      monthlyRate,
      totalMonths
    );
    
    if (monthlyContribution < 0) {
      return { 
        success: false, 
        error: 'Saldo alvo é muito baixo para o investimento inicial e o período de tempo' 
      };
    }
    
    return {
      success: true,
      value: monthlyContribution,
      details: {
        totalYears,
        totalMonths,
        totalContributions: monthlyContribution * totalMonths,
        finalAmount: desiredFinalAmount,
        monthlyContribution,
        lifeExpectancy,
        retirementPeriodYears: lifeExpectancy,
        inputData: {
          currentAge,
          retirementAge,
          initialInvestment,
          gender,
          desiredFinalAmount,
        },
      },
    };
  } catch {
    return { 
      success: false, 
      error: 'Erro ao calcular' 
    };
  }
}

/**
 * Case 2: Calculate final amount with fixed monthly contribution
 */
export function calculateFinalAmount(
  inputs: MonthlyContributionInputs
): CalculationResult {
  try {
    // Validate inputs
    const baseValidation = validateBaseInputs(inputs);
    if (baseValidation) {
      return { success: false, error: baseValidation };
    }
    
    const { currentAge, retirementAge, initialInvestment, monthlyContribution, gender } = inputs;
    
    if (monthlyContribution < 0) {
      return { success: false, error: 'Contribuição mensal não pode ser negativa' };
    }
    
    // Calculate periods and rates
    const totalYears = retirementAge - currentAge;
    const totalMonths = totalYears * FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
    const monthlyRate = FINANCIAL_CONSTANTS.ANNUAL_RETURN_RATE / FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
    
    // Get life expectancy for this person
    const lifeExpectancy = getLifeExpectancy(retirementAge, gender);
    
    // Calculate final amount
    const finalAmount = calculateFutureValue(
      initialInvestment,
      monthlyContribution,
      monthlyRate,
      totalMonths
    );
    
    return {
      success: true,
      value: finalAmount,
      details: {
        totalYears,
        totalMonths,
        totalContributions: monthlyContribution * totalMonths,
        finalAmount,
        monthlyContribution,
        lifeExpectancy,
        retirementPeriodYears: lifeExpectancy,
        inputData: {
          currentAge,
          retirementAge,
          initialInvestment,
          gender,
          monthlyContribution,
        },
      },
    };
  } catch {
    return { 
      success: false, 
      error: 'Erro ao calcular' 
    };
  }
}

/**
 * Case 3: Calculate retirement income planning
 */
export function calculateRetirementPlanning(
  inputs: RetirementIncomeInputs
): CalculationResult {
  try {
    // Validate inputs
    const baseValidation = validateBaseInputs(inputs);
    if (baseValidation) {
      return { success: false, error: baseValidation };
    }
    
    const { currentAge, retirementAge, initialInvestment, desiredMonthlyIncome, gender } = inputs;
    
    if (desiredMonthlyIncome <= 0) {
      return { success: false, error: 'Renda mensal desejada deve ser positiva' };
    }
    
    // Get actual life expectancy instead of using hardcoded 15 years
    const lifeExpectancy = getLifeExpectancy(retirementAge, gender);
    const retirementMonths = lifeExpectancy * FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
    const monthlyRate = FINANCIAL_CONSTANTS.ANNUAL_RETURN_RATE / FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
    
    // Calculate present value of annuity (required balance at retirement)
    // PV = PMT * [(1 - (1 + r)^(-n)) / r]
    const annuityPresentValue = monthlyRate === 0 
      ? desiredMonthlyIncome * retirementMonths
      : desiredMonthlyIncome * (1 - Math.pow(1 + monthlyRate, -retirementMonths)) / monthlyRate;
    
    // Calculate monthly contribution needed during accumulation phase
    const accumulationYears = retirementAge - currentAge;
    const accumulationMonths = accumulationYears * FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
    
    const requiredMonthlyContribution = calculateMonthlyPayment(
      annuityPresentValue,
      initialInvestment,
      monthlyRate,
      accumulationMonths
    );
    
    if (requiredMonthlyContribution < 0) {
      return { 
        success: false, 
        error: 'Investimento inicial é suficiente para a renda mensal desejada' 
      };
    }
    
    return {
      success: true,
      value: requiredMonthlyContribution,
      details: {
        totalYears: accumulationYears,
        totalMonths: accumulationMonths,
        totalContributions: requiredMonthlyContribution * accumulationMonths,
        retirementBalance: annuityPresentValue,
        monthlyContribution: requiredMonthlyContribution,
        lifeExpectancy,
        retirementPeriodYears: lifeExpectancy,
        inputData: {
          currentAge,
          retirementAge,
          initialInvestment,
          gender,
          desiredMonthlyIncome,
        },
      },
    };
  } catch {
    return { 
      success: false, 
      error: 'Erro ao calcular' 
    };
  }
}

/**
 * Format currency value for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
} 