'use client';

import React, { useState } from 'react';
import { FINANCIAL_CONSTANTS } from '@/constants';
import { useLastResult, useSelectedScenario } from '@/contexts/AppContext';
import { formatCurrency } from '@/utils/calculations';
import { CheckCircle, XCircle, TrendingUp, Calendar, DollarSign, BarChart3, Wallet } from 'lucide-react';
import { WealthChart } from './WealthChart';
import { generateWealthProgression } from '@/utils/wealthProjection';

export function ResultsDisplay() {
  const lastResult = useLastResult();
  const selectedScenario = useSelectedScenario();
  const [activeTab, setActiveTab] = useState<'resumo' | 'evolucao'>('resumo');
  
  if (!lastResult || !selectedScenario) {
    return null;
  }
  
  if (!lastResult.success) {
    return (
      <div className="w-full">
        <div className="bg-[#ea1e25] border border-[#ea1e25] rounded-lg p-6 h-fit">
          <div className="flex items-center mb-4">
            <XCircle className="text-[#ea1e25] mr-3" size={24} />
            <h3 className="text-lg font-semibold text-[#ea1e25]">
              Erro no Cálculo
            </h3>
          </div>
          <p className="text-[#ea1e25]">
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
                  <Calendar className="text-[#ea1e25] mr-2" size={20} />
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
                  <DollarSign className="text-[#ea1e25] mr-2" size={20} />
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
                  <TrendingUp className="text-[#ea1e25] mr-2" size={20} />
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
                  <DollarSign className="text-[#ea1e25] mr-2" size={20} />
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
                  <DollarSign className="text-[#ea1e25] mr-2" size={20} />
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
                  <TrendingUp className="text-[#ea1e25] mr-2" size={20} />
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

  // Generate wealth chart data if we have successful results with input data
  const generateChartData = () => {
    if (!lastResult.success || !lastResult.details?.inputData || !selectedScenario) {
      return null;
    }

    const inputData = lastResult.details.inputData;
    
    try {
      return generateWealthProgression(inputData, selectedScenario);
    } catch (error) {
      console.error('Error generating wealth chart data:', error);
      return null;
    }
  };

  const chartData = generateChartData();
  
  return (
    <div className="w-full">
      <div className="bg-white border border-green-200 rounded-lg shadow-lg h-fit">
        {/* Header */}
        <div className="flex items-center p-6 pb-4">
          <CheckCircle className="text-green-600 mr-3" size={24} />
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900">
            Resultado da Simulação
          </h3>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('resumo')}
            className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'resumo'
                ? 'text-[#ea1e25] border-[#ea1e25]'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Wallet className="w-4 h-4 mr-2" />
            Resumo
          </button>
          <button
            onClick={() => setActiveTab('evolucao')}
            className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'evolucao'
                ? 'text-[#ea1e25] border-[#ea1e25]'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Evolução
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'resumo' && (
            <div>
              {renderResultContent()}
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Importante:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Taxa de retorno real considerada: {FINANCIAL_CONSTANTS.ANNUAL_RETURN_RATE * 100}% ao ano</li>
                  <li>• Valores não consideram inflação</li>
                  <li>• Esta é uma simulação para fins educativos</li>
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'evolucao' && chartData && lastResult.details?.inputData && (
            <div>
              <WealthChart
                data={chartData}
                currentAge={lastResult.details.inputData.currentAge}
                retirementAge={lastResult.details.inputData.retirementAge}
                title="Evolução do Patrimônio"
                embedded={true}
              />
            </div>
          )}
          
          {activeTab === 'evolucao' && (!chartData || !lastResult.details?.inputData) && (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Dados insuficientes para gerar o gráfico de evolução.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 