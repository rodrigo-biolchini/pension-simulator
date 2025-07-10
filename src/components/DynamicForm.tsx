'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { InputField } from './InputField';
import { CurrencyInput } from './CurrencyInput';
import { useSelectedScenario, useApp, useIsCalculating } from '@/contexts/AppContext';
import { VALIDATION_CONSTANTS } from '@/constants';
import { 
  calculateMonthlyContribution, 
  calculateFinalAmount, 
  calculateRetirementPlanning 
} from '@/utils/calculations';
import { Loader2 } from 'lucide-react';

type FormData = {
  currentAge: number;
  retirementAge: number;
  initialInvestment: number;
  desiredFinalAmount?: number;
  monthlyContribution?: number;
  desiredMonthlyIncome?: number;
};

export function DynamicForm() {
  const selectedScenario = useSelectedScenario();
  const { setCalculating, setResult } = useApp();
  const isCalculating = useIsCalculating();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      initialInvestment: 0,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!selectedScenario) return;
    
    setCalculating(true);
    
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let result;
    
    switch (selectedScenario) {
      case 'target-amount':
        result = calculateMonthlyContribution({
          currentAge: data.currentAge,
          retirementAge: data.retirementAge,
          initialInvestment: data.initialInvestment,
          desiredFinalAmount: data.desiredFinalAmount || 0,
        });
        break;
        
      case 'monthly-contribution':
        result = calculateFinalAmount({
          currentAge: data.currentAge,
          retirementAge: data.retirementAge,
          initialInvestment: data.initialInvestment,
          monthlyContribution: data.monthlyContribution || 0,
        });
        break;
        
      case 'retirement-income':
        result = calculateRetirementPlanning({
          currentAge: data.currentAge,
          retirementAge: data.retirementAge,
          initialInvestment: data.initialInvestment,
          desiredMonthlyIncome: data.desiredMonthlyIncome || 0,
        });
        break;
        
      default:
        result = { success: false, error: 'Cenário inválido' };
    }
    
    setResult(result);
  };

  if (!selectedScenario) {
    return null;
  }

  const renderScenarioFields = () => {
    switch (selectedScenario) {
      case 'target-amount':
        return (
          <CurrencyInput
            label="Valor desejado na aposentadoria"
            name="desiredFinalAmount"
            placeholder="R$ 0,00"
            register={register}
            setValue={setValue}
            watch={watch}
            error={errors.desiredFinalAmount}
            required
            min={1000}
            max={VALIDATION_CONSTANTS.MAX_AMOUNT}
          />
        );
        
      case 'monthly-contribution':
        return (
          <CurrencyInput
            label="Contribuição mensal"
            name="monthlyContribution"
            placeholder="R$ 0,00"
            register={register}
            setValue={setValue}
            watch={watch}
            error={errors.monthlyContribution}
            required
            min={0}
            max={50000}
          />
        );
        
      case 'retirement-income':
        return (
          <CurrencyInput
            label="Renda mensal desejada na aposentadoria"
            name="desiredMonthlyIncome"
            placeholder="R$ 0,00"
            register={register}
            setValue={setValue}
            watch={watch}
            error={errors.desiredMonthlyIncome}
            required
            min={0}
            max={100000}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Preencha os dados para simulação
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Idade atual"
              name="currentAge"
              placeholder="Ex: 30"
              register={register}
              error={errors.currentAge}
              required
              min={VALIDATION_CONSTANTS.MIN_AGE}
              max={VALIDATION_CONSTANTS.MAX_AGE}
            />
            
            <InputField
              label="Idade de aposentadoria"
              name="retirementAge"
              placeholder="Ex: 65"
              register={register}
              error={errors.retirementAge}
              required
              min={VALIDATION_CONSTANTS.MIN_RETIREMENT_AGE}
              max={VALIDATION_CONSTANTS.MAX_RETIREMENT_AGE}
            />
          </div>
          
          <CurrencyInput
            label="Investimento inicial"
            name="initialInvestment"
            placeholder="R$ 0,00"
            register={register}
            setValue={setValue}
            watch={watch}
            error={errors.initialInvestment}
            required
            min={0}
            max={VALIDATION_CONSTANTS.MAX_AMOUNT}
          />
          
          {renderScenarioFields()}
          
          <button
            type="submit"
            disabled={isCalculating}
            className={`
              w-full py-3 px-4 rounded-md font-medium text-white transition-colors
              ${isCalculating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }
            `}
          >
            {isCalculating ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" size={20} />
                Calculando...
              </div>
            ) : (
              'Calcular'
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 