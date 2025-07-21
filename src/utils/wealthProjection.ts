import { FINANCIAL_CONSTANTS } from '@/constants';
import { BaseInputs, SimulationScenario } from '@/types';
import { getLifeExpectancy } from '@/utils/lifeExpectancy';

/**
 * Data point representing wealth at a specific age
 */
export interface WealthDataPoint {
  age: number;
  wealth: number;
  phase: 'accumulation' | 'retirement';
  monthlyFlow: number; // positive for contributions, negative for withdrawals
}

/**
 * Input data for any of the three scenarios
 */
export interface WealthProjectionInputs extends BaseInputs {
  // Target Amount scenario
  desiredFinalAmount?: number;
  // Monthly Contribution scenario  
  monthlyContribution?: number;
  // Retirement Income scenario
  desiredMonthlyIncome?: number;
}

/**
 * Generate wealth progression data for Target Amount scenario
 * User wants specific amount at retirement
 */
function generateTargetAmountProgression(
  inputs: WealthProjectionInputs & { desiredFinalAmount: number }
): WealthDataPoint[] {
  const { currentAge, retirementAge, initialInvestment, desiredFinalAmount, gender } = inputs;
  const monthlyRate = FINANCIAL_CONSTANTS.ANNUAL_RETURN_RATE / FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
  const lifeExpectancy = getLifeExpectancy(retirementAge, gender);
  
  // Calculate required monthly contribution
  const accumulationMonths = (retirementAge - currentAge) * FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
  
  const requiredMonthlyContribution = monthlyRate === 0
    ? (desiredFinalAmount - initialInvestment) / accumulationMonths
    : (desiredFinalAmount - initialInvestment * Math.pow(1 + monthlyRate, accumulationMonths)) / 
      ((Math.pow(1 + monthlyRate, accumulationMonths) - 1) / monthlyRate);

  // Calculate monthly withdrawal in retirement
  const retirementMonths = lifeExpectancy * FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
  const monthlyWithdrawal = monthlyRate === 0
    ? desiredFinalAmount / retirementMonths
    : desiredFinalAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -retirementMonths));

  const dataPoints: WealthDataPoint[] = [];
  
  // ACCUMULATION PHASE: Current age to retirement age
  let currentWealth = initialInvestment;
  let currentMonthAge = currentAge;
  
  // Add initial point
  dataPoints.push({
    age: currentAge,
    wealth: initialInvestment,
    phase: 'accumulation',
    monthlyFlow: requiredMonthlyContribution
  });
  
  // Monthly progression during accumulation
  for (let month = 1; month <= accumulationMonths; month++) {
    // Add monthly contribution
    currentWealth += requiredMonthlyContribution;
    
    // Apply monthly compound interest
    currentWealth *= (1 + monthlyRate);
    
    // Update age (in fractional years)
    currentMonthAge = currentAge + (month / FINANCIAL_CONSTANTS.MONTHS_PER_YEAR);
    
    // Add data point every month (we'll sample later for display if needed)
    dataPoints.push({
      age: currentMonthAge,
      wealth: currentWealth,
      phase: 'accumulation',
      monthlyFlow: requiredMonthlyContribution
    });
  }
  
  // RETIREMENT PHASE: Retirement age to end of life
  currentWealth = desiredFinalAmount; // Should be very close to our accumulated amount
  
  for (let month = 1; month <= retirementMonths; month++) {
    // Apply monthly interest first
    currentWealth *= (1 + monthlyRate);
    
    // Subtract monthly withdrawal
    currentWealth -= monthlyWithdrawal;
    
    // Ensure we don't go negative (precision issues)
    currentWealth = Math.max(0, currentWealth);
    
    // Update age
    currentMonthAge = retirementAge + (month / FINANCIAL_CONSTANTS.MONTHS_PER_YEAR);
    
    dataPoints.push({
      age: currentMonthAge,
      wealth: currentWealth,
      phase: 'retirement',
      monthlyFlow: -monthlyWithdrawal
    });
  }
  
  return dataPoints;
}

/**
 * Generate wealth progression data for Monthly Contribution scenario
 * User has fixed monthly contribution amount
 */
function generateMonthlyContributionProgression(
  inputs: WealthProjectionInputs & { monthlyContribution: number }
): WealthDataPoint[] {
  const { currentAge, retirementAge, initialInvestment, monthlyContribution, gender } = inputs;
  const monthlyRate = FINANCIAL_CONSTANTS.ANNUAL_RETURN_RATE / FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
  const lifeExpectancy = getLifeExpectancy(retirementAge, gender);
  
  // Calculate what final amount will be with this contribution
  const accumulationMonths = (retirementAge - currentAge) * FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
  
  const finalAmount = monthlyRate === 0
    ? initialInvestment + monthlyContribution * accumulationMonths
    : initialInvestment * Math.pow(1 + monthlyRate, accumulationMonths) + 
      monthlyContribution * (Math.pow(1 + monthlyRate, accumulationMonths) - 1) / monthlyRate;

  // Calculate monthly withdrawal in retirement
  const retirementMonths = lifeExpectancy * FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
  const monthlyWithdrawal = monthlyRate === 0
    ? finalAmount / retirementMonths
    : finalAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -retirementMonths));

  const dataPoints: WealthDataPoint[] = [];
  
  // ACCUMULATION PHASE
  let currentWealth = initialInvestment;
  let currentMonthAge = currentAge;
  
  dataPoints.push({
    age: currentAge,
    wealth: initialInvestment,
    phase: 'accumulation',
    monthlyFlow: monthlyContribution
  });
  
  for (let month = 1; month <= accumulationMonths; month++) {
    currentWealth += monthlyContribution;
    currentWealth *= (1 + monthlyRate);
    currentMonthAge = currentAge + (month / FINANCIAL_CONSTANTS.MONTHS_PER_YEAR);
    
    dataPoints.push({
      age: currentMonthAge,
      wealth: currentWealth,
      phase: 'accumulation',
      monthlyFlow: monthlyContribution
    });
  }
  
  // RETIREMENT PHASE
  currentWealth = finalAmount;
  
  for (let month = 1; month <= retirementMonths; month++) {
    currentWealth *= (1 + monthlyRate);
    currentWealth -= monthlyWithdrawal;
    currentWealth = Math.max(0, currentWealth);
    currentMonthAge = retirementAge + (month / FINANCIAL_CONSTANTS.MONTHS_PER_YEAR);
    
    dataPoints.push({
      age: currentMonthAge,
      wealth: currentWealth,
      phase: 'retirement',
      monthlyFlow: -monthlyWithdrawal
    });
  }
  
  return dataPoints;
}

/**
 * Generate wealth progression data for Retirement Income scenario
 * User wants specific monthly income in retirement
 */
function generateRetirementIncomeProgression(
  inputs: WealthProjectionInputs & { desiredMonthlyIncome: number }
): WealthDataPoint[] {
  const { currentAge, retirementAge, initialInvestment, desiredMonthlyIncome, gender } = inputs;
  const monthlyRate = FINANCIAL_CONSTANTS.ANNUAL_RETURN_RATE / FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
  const lifeExpectancy = getLifeExpectancy(retirementAge, gender);
  
  // Calculate required balance at retirement for desired income
  const retirementMonths = lifeExpectancy * FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
  
  const requiredRetirementBalance = monthlyRate === 0
    ? desiredMonthlyIncome * retirementMonths
    : desiredMonthlyIncome * (1 - Math.pow(1 + monthlyRate, -retirementMonths)) / monthlyRate;

  // Calculate required monthly contribution to reach that balance
  const accumulationMonths = (retirementAge - currentAge) * FINANCIAL_CONSTANTS.MONTHS_PER_YEAR;
  
  const requiredMonthlyContribution = monthlyRate === 0
    ? (requiredRetirementBalance - initialInvestment) / accumulationMonths
    : (requiredRetirementBalance - initialInvestment * Math.pow(1 + monthlyRate, accumulationMonths)) / 
      ((Math.pow(1 + monthlyRate, accumulationMonths) - 1) / monthlyRate);

  const dataPoints: WealthDataPoint[] = [];
  
  // ACCUMULATION PHASE
  let currentWealth = initialInvestment;
  let currentMonthAge = currentAge;
  
  dataPoints.push({
    age: currentAge,
    wealth: initialInvestment,
    phase: 'accumulation',
    monthlyFlow: requiredMonthlyContribution
  });
  
  for (let month = 1; month <= accumulationMonths; month++) {
    currentWealth += requiredMonthlyContribution;
    currentWealth *= (1 + monthlyRate);
    currentMonthAge = currentAge + (month / FINANCIAL_CONSTANTS.MONTHS_PER_YEAR);
    
    dataPoints.push({
      age: currentMonthAge,
      wealth: currentWealth,
      phase: 'accumulation',
      monthlyFlow: requiredMonthlyContribution
    });
  }
  
  // RETIREMENT PHASE
  currentWealth = requiredRetirementBalance;
  
  for (let month = 1; month <= retirementMonths; month++) {
    currentWealth *= (1 + monthlyRate);
    currentWealth -= desiredMonthlyIncome;
    currentWealth = Math.max(0, currentWealth);
    currentMonthAge = retirementAge + (month / FINANCIAL_CONSTANTS.MONTHS_PER_YEAR);
    
    dataPoints.push({
      age: currentMonthAge,
      wealth: currentWealth,
      phase: 'retirement',
      monthlyFlow: -desiredMonthlyIncome
    });
  }
  
  return dataPoints;
}

/**
 * Main function to generate wealth progression for any scenario
 */
export function generateWealthProgression(
  inputs: WealthProjectionInputs,
  scenario: SimulationScenario
): WealthDataPoint[] {
  try {
    switch (scenario) {
      case 'target-amount':
        if (!inputs.desiredFinalAmount) {
          throw new Error('Desired final amount is required for target-amount scenario');
        }
        return generateTargetAmountProgression({
          ...inputs,
          desiredFinalAmount: inputs.desiredFinalAmount
        });
        
      case 'monthly-contribution':
        if (!inputs.monthlyContribution) {
          throw new Error('Monthly contribution is required for monthly-contribution scenario');
        }
        return generateMonthlyContributionProgression({
          ...inputs,
          monthlyContribution: inputs.monthlyContribution
        });
        
      case 'retirement-income':
        if (!inputs.desiredMonthlyIncome) {
          throw new Error('Desired monthly income is required for retirement-income scenario');
        }
        return generateRetirementIncomeProgression({
          ...inputs,
          desiredMonthlyIncome: inputs.desiredMonthlyIncome
        });
        
      default:
        throw new Error(`Unknown scenario: ${scenario}`);
    }
  } catch (error) {
    console.error('Error generating wealth progression:', error);
    return [];
  }
}

/**
 * Sample data points for chart display (reduces data density for performance)
 * Takes every nth point while preserving key transition points
 */
export function sampleDataForChart(
  data: WealthDataPoint[], 
  maxPoints: number = 200
): WealthDataPoint[] {
  if (data.length <= maxPoints) {
    return data;
  }
  
  const sampledData: WealthDataPoint[] = [];
  const step = Math.floor(data.length / maxPoints);
  
  // Always include first point
  sampledData.push(data[0]);
  
  // Find retirement transition point
  const retirementIndex = data.findIndex(point => point.phase === 'retirement');
  
  // Sample accumulation phase
  for (let i = step; i < retirementIndex; i += step) {
    sampledData.push(data[i]);
  }
  if (retirementIndex > 0) {
    sampledData.push(data[retirementIndex - 1]); // Last accumulation point
    sampledData.push(data[retirementIndex]); // First retirement point
  }

  let seeRetirement = false; // toggle here to see retirement phase
  if (seeRetirement) {
    // Always include retirement transition point
   
    
    // Sample retirement phase
    for (let i = retirementIndex + step; i < data.length; i += step) {
      sampledData.push(data[i]);
    }
    
    // Always include last point
    if (data.length > 1) {
      sampledData.push(data[data.length - 1]);
    }
  }
  return sampledData;
} 