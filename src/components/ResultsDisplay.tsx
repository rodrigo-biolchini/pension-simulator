'use client';

import React from 'react';
import { FINANCIAL_CONSTANTS } from '@/constants';
import { useLastResult, useSelectedScenario } from '@/contexts/AppContext';
import { formatCurrency } from '@/utils/calculations';
import { CheckCircle, XCircle, TrendingUp, Calendar, DollarSign } from 'lucide-react';

export function ResultsDisplay() {
  const lastResult = useLastResult();
  const selectedScenario = useSelectedScenario();
  
  if (!lastResult || !selectedScenario) {
    return null;
  }
  
  if (!lastResult.success) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 h-fit">
          <div className="flex items-center mb-4">
            <XCircle className="text-red-600 mr-3" size={24} />
            <h3 className="text-lg font-semibold text-red-900">
              Erro no Cálculo
            </h3>
          </div>
          <p className="text-red-700">
            {lastResult.error}
          </p>
        </div>
      </div>
    );
  }
  
  const renderResultContent = () => {
    const { value, details } = lastResult;
    
    if (!value || !details) return null;
    
    switch (selectedScenario) {
      case 'target-amount':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">
                {formatCurrency(value)}
              </div>
              <p className="text-base lg:text-lg text-gray-600">
                Contribuição mensal necessária
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Calendar className="text-red-600 mr-2" size={20} />
                  <span className="font-medium text-gray-700">Período</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {details.totalYears} anos
                </p>
                <p className="text-sm text-gray-600">
                  ({details.totalMonths} meses)
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <DollarSign className="text-red-600 mr-2" size={20} />
                  <span className="font-medium text-gray-700">Total Investido</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(details.totalContributions || 0)}
                </p>
                <p className="text-sm text-gray-600">
                  Ao longo do período
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'monthly-contribution':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">
                {formatCurrency(value)}
              </div>
              <p className="text-base lg:text-lg text-gray-600">
                Valor acumulado na aposentadoria
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <TrendingUp className="text-red-600 mr-2" size={20} />
                  <span className="font-medium text-gray-700">Contribuição Total</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(details.totalContributions || 0)}
                </p>
                <p className="text-sm text-gray-600">
                  Valor investido
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <DollarSign className="text-red-600 mr-2" size={20} />
                  <span className="font-medium text-gray-700">Rendimento</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(value - (details.totalContributions || 0))}
                </p>
                <p className="text-sm text-gray-600">
                  Ganho com juros
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'retirement-income':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">
                {formatCurrency(value)}
              </div>
              <p className="text-base lg:text-lg text-gray-600">
                Contribuição mensal necessária
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <DollarSign className="text-red-600 mr-2" size={20} />
                  <span className="font-medium text-gray-700">Saldo na Aposentadoria</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(details.retirementBalance || 0)}
                </p>
                <p className="text-sm text-gray-600">
                  Valor necessário
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <TrendingUp className="text-red-600 mr-2" size={20} />
                  <span className="font-medium text-gray-700">Total Investido</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(details.totalContributions || 0)}
                </p>
                <p className="text-sm text-gray-600">
                  Ao longo de {details.totalYears} anos
                </p>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="w-full">
      <div className="bg-white border border-green-200 rounded-lg shadow-lg p-6 h-fit">
        <div className="flex items-center mb-6">
          <CheckCircle className="text-green-600 mr-3" size={24} />
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900">
            Resultado da Simulação
          </h3>
        </div>
        
        {renderResultContent()}
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">
            Importante:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Taxa de retorno real considerada: {FINANCIAL_CONSTANTS.ANNUAL_RETURN_RATE * 100}% ao ano</li>
            <li>• Período de aposentadoria: {FINANCIAL_CONSTANTS.RETIREMENT_PERIOD_YEARS} anos</li>
            <li>• Valores não consideram inflação</li>
            <li>• Esta é uma simulação para fins educativos</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 