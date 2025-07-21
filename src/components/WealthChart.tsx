'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { ChevronDown, ChevronUp, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { WealthDataPoint, sampleDataForChart } from '@/utils/wealthProjection';
import { formatCurrency } from '@/utils/calculations';

interface WealthChartProps {
  data: WealthDataPoint[];
  retirementAge: number;
  currentAge: number;
  title?: string;
}

/**
 * Custom tooltip component for the wealth chart
 */
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: WealthDataPoint;
  }>;
}

function WealthTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;
  const wealth = payload[0].value;

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-xs">
      <div className="text-sm font-semibold text-gray-900 mb-2">
        Idade: {Math.round(data.age)} anos
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 w-20 flex-shrink-0">Patrimônio:</span>
          <span className="text-sm font-semibold text-gray-900 flex-1 text-right">
            {formatCurrency(wealth)}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 w-20 flex-shrink-0">Fase:</span>
          <span className={`text-sm font-semibold flex-1 text-right ${
            data.phase === 'accumulation' ? 'text-green-600' : 'text-red-600'
          }`}>
            {data.phase === 'accumulation' ? 'Acumulação' : 'Aposentadoria'}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 w-20 flex-shrink-0">
            {data.phase === 'accumulation' ? 'Aporte:' : 'Retirada:'}
          </span>
          <span className={`text-sm font-semibold flex-1 text-right ${
            data.phase === 'accumulation' ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(Math.abs(data.monthlyFlow))}
          </span>
        </div>
      </div>
      
      {data.phase === 'retirement' && wealth === 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <span className="text-xs text-red-600 font-medium">
            Recursos esgotados
          </span>
        </div>
      )}
    </div>
  );
}

export function WealthChart({
  data,
  retirementAge,
  currentAge,
  title = "Evolução do Patrimônio"
}: WealthChartProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!data || data.length === 0) {
    return null;
  }

  // Sample data for performance while preserving key points
  const chartData = sampleDataForChart(data, 150);
  
  // Find key metrics
  const maxWealth = Math.max(...chartData.map(d => d.wealth));
  const endAge = Math.max(...chartData.map(d => d.age));
  const accumulationYears = retirementAge - currentAge;
  const retirementPmt = Math.abs(chartData.find(d => d.age > retirementAge)?.monthlyFlow || 0);
  
  
  // Custom Y-axis formatter
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}k`;
    }
    return `R$ ${value.toFixed(0)}`;
  };

  // Custom X-axis formatter
  const formatXAxis = (value: number) => {
    return `${Math.round(value)}`;
  };

  const chartContent = (
    <div className="w-full space-y-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">
            Evolução do patrimônio dos {currentAge} aos {Math.round(endAge)} anos
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Acumulação</span>
          </div>
          <div className="flex items-center space-x-1">
              <div className="w-6 h-0 border-t-2 border-red-500 border-dashed"></div>
              <span className="text-gray-600">Aposentadoria</span>
            </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-96 bg-gray-50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 40,
              bottom: 60,
            }}
            
            
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            
            {/* X-axis: Age */}
            <XAxis
              dataKey="age"
              type="number"
              scale="linear"
              domain={['dataMin', 'dataMax']}
              tickFormatter={formatXAxis}
              className="text-xs"
              label={{ 
                value: 'Idade (anos)', 
                position: 'insideBottom', 
                offset: -10,
                style: { textAnchor: 'middle' }
              }}
            />
            
            {/* Y-axis: Wealth */}
            <YAxis
              tickFormatter={formatYAxis}
              className="text-xs"
              label={{ 
                value: 'Patrimônio', 
                angle: -90, 
                position: 'insideLeft',
                offset: -10,
                style: { textAnchor: 'middle' }
              }}
            />
            
            {/* Vertical reference line at retirement age */}
            <ReferenceLine
              x={retirementAge}
              stroke="#ef4444"
              strokeDasharray="8 4"
              strokeWidth={2}
            />
            
            {/* Main wealth line */}
            <Line
              type="monotone"
              dataKey="wealth"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#2563eb' }}
              connectNulls={false}
            />
            
            {/* Custom tooltip */}
            <Tooltip content={<WealthTooltip />} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="text-red-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">Fase de Acumulação</span>
          </div>
          <div className="text-lg font-bold text-gray-700">
            {accumulationYears} anos
          </div>
          <div className="text-sm text-gray-600">
            Dos {currentAge} aos {retirementAge} anos
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="text-red-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">Patrimônio Máximo</span>
          </div>
          <div className="text-lg font-bold text-gray-700">
            {formatCurrency(maxWealth)}
          </div>
          <div className="text-sm text-gray-600">
            Na aposentadoria
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="text-red-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">Renda Mensal Esperada</span>
          </div>
          <div className="text-lg font-bold text-gray-700">
            {formatCurrency(retirementPmt)}
          </div>
          <div className="text-sm text-gray-600">
            Na aposentadoria
          </div>
        </div>
      </div>

      {/* Educational Insights */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Insights da Evolução Patrimonial:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Durante <strong>{accumulationYears} anos</strong> o patrimônio cresce com aportes mensais e juros compostos</li>
          <li>• O patrimônio atinge o valor máximo de <strong>{formatCurrency(maxWealth)}</strong> aos {retirementAge} anos</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="w-full mt-6">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <TrendingUp className="text-blue-600" size={24} />
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">
              Ver Evolução do Patrimônio
            </h3>
            <p className="text-sm text-gray-600">
              Visualize como seu patrimônio evolui ao longo da vida
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="text-gray-400" size={20} />
        ) : (
          <ChevronDown className="text-gray-400" size={20} />
        )}
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="bg-white border border-gray-200 border-t-0 rounded-b-lg p-6">
          {chartContent}
        </div>
      )}
    </div>
  );
} 