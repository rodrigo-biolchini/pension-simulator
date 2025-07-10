import { FINANCIAL_CONSTANTS } from '@/constants';
import {
  BaseInputs,
  TargetAmountInputs,
  MonthlyContributionInputs,
  RetirementIncomeInputs,
  CalculationResult,
} from '@/types';

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
 * Validate common inputs
 */
function validateBaseInputs(inputs: BaseInputs): string | null {
  const { currentAge, retirementAge, initialInvestment } = inputs;
  
  if (currentAge < 18 || currentAge > 100) {
    return 'Current age must be between 18 and 100';
  }
  
  if (retirementAge < 50 || retirementAge > 100) {
    return 'Retirement age must be between 50 and 100';
  }
  
  if (retirementAge <= currentAge) {
    return 'Retirement age must be greater than current age';
  }
  
  if (initialInvestment < 0) {
    return 'Initial investment cannot be negative';
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
    
    const { currentAge, retirementAge, initialInvestment, desiredFinalAmount } = inputs;
    
    if (desiredFinalAmount <= 0) {
      return { success: false, error: 'Desired final amount must be positive' };
    }
    
    if (desiredFinalAmount <= initialInvestment) {
      return { success: false, error: 'Desired final amount must be greater than initial investment' };
    }
    
    // Calculate periods and rates
    const totalYears = retirementAge - currentAge;
    const totalMonths = totalYears * FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
    const monthlyRate = FINANCIAL_CONSTANTS.ANNUAL_RETURN_RATE / FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
    
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
        error: 'Target amount is too low for the given initial investment and time period' 
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
      },
    };
  } catch {
    return { 
      success: false, 
      error: 'Calculation error occurred' 
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
    
    const { currentAge, retirementAge, initialInvestment, monthlyContribution } = inputs;
    
    if (monthlyContribution < 0) {
      return { success: false, error: 'Monthly contribution cannot be negative' };
    }
    
    // Calculate periods and rates
    const totalYears = retirementAge - currentAge;
    const totalMonths = totalYears * FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
    const monthlyRate = FINANCIAL_CONSTANTS.ANNUAL_RETURN_RATE / FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
    
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
      },
    };
  } catch {
    return { 
      success: false, 
      error: 'Calculation error occurred' 
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
    
    const { currentAge, retirementAge, initialInvestment, desiredMonthlyIncome } = inputs;
    
    if (desiredMonthlyIncome <= 0) {
      return { success: false, error: 'Desired monthly income must be positive' };
    }
    
    // Calculate required balance at retirement
    const retirementMonths = FINANCIAL_CONSTANTS.RETIREMENT_PERIOD_YEARS * FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
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
        error: 'Initial investment is sufficient for the desired retirement income' 
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
      },
    };
  } catch {
    return { 
      success: false, 
      error: 'Calculation error occurred' 
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