import { LIFE_EXPECTANCY_TABLE, LIFE_EXPECTANCY_AGE_RANGE } from '@/constants/lifeExpectancy';

/**
 * Get life expectancy for a given age and gender using Brazilian mortality tables
 * 
 * @param age - The retirement age
 * @param gender - 'male' or 'female'
 * @returns Expected remaining years of life
 */
export function getLifeExpectancy(age: number, gender: 'male' | 'female'): number {
  // Validate gender
  if (gender !== 'male' && gender !== 'female') {
    throw new Error('Gender must be either "male" or "female"');
  }
  
  // Check if age is within the table range
  if (age < LIFE_EXPECTANCY_AGE_RANGE.MIN_AGE) {
    // For ages below 50, use the life expectancy at age 50
    return LIFE_EXPECTANCY_TABLE[gender][LIFE_EXPECTANCY_AGE_RANGE.MIN_AGE];
  }
  
  if (age > LIFE_EXPECTANCY_AGE_RANGE.MAX_AGE) {
    // For ages above 112, assume minimal life expectancy
    return 0.1;
  }
  
  // Direct lookup if age exists in table
  const exactMatch = LIFE_EXPECTANCY_TABLE[gender][age];
  if (exactMatch !== undefined) {
    return exactMatch;
  }
  
  // If exact age is not in table, find the closest ages and interpolate
  const lowerAge = Math.floor(age);
  const upperAge = Math.ceil(age);
  
  const lowerExpectancy = LIFE_EXPECTANCY_TABLE[gender][lowerAge];
  const upperExpectancy = LIFE_EXPECTANCY_TABLE[gender][upperAge];
  
  if (lowerExpectancy !== undefined && upperExpectancy !== undefined) {
    // Linear interpolation
    const fraction = age - lowerAge;
    return lowerExpectancy + (upperExpectancy - lowerExpectancy) * fraction;
  }
  
  // Fallback: find the nearest available age
  const availableAges = Object.keys(LIFE_EXPECTANCY_TABLE[gender]).map(Number);
  const nearestAge = availableAges.reduce((prev, curr) => 
    Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev
  );
  
  return LIFE_EXPECTANCY_TABLE[gender][nearestAge];
}

/**
 * Validate if retirement age and gender combination is supported
 * 
 * @param retirementAge - The age at retirement
 * @param gender - 'male' or 'female' or empty string
 * @returns Validation result with error message if invalid
 */
export function validateLifeExpectancyInputs(
  retirementAge: number, 
  gender: string
): { isValid: boolean; error?: string } {
  if (!gender || gender === '') {
    return {
      isValid: false,
      error: 'Sexo é obrigatório para calcular expectativa de vida',
    };
  }
  
  if (gender !== 'male' && gender !== 'female') {
    return {
      isValid: false,
      error: 'Sexo deve ser Masculino ou Feminino',
    };
  }
  
  if (retirementAge > 120) {
    return {
      isValid: false,
      error: 'Idade de aposentadoria muito alta para cálculo de expectativa de vida',
    };
  }
  
  return { isValid: true };
}

/**
 * Get formatted life expectancy description for display
 * 
 * @param age - The retirement age
 * @param gender - 'male' or 'female'
 * @returns Formatted string describing the life expectancy
 */
export function getLifeExpectancyDescription(age: number, gender: 'male' | 'female'): string {
  const expectancy = getLifeExpectancy(age, gender);
  const genderLabel = gender === 'male' ? 'homem' : 'mulher';
  
  return `${expectancy.toFixed(1)} anos (${genderLabel} aos ${age} anos)`;
} 