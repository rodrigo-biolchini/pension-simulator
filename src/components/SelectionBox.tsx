'use client';

import React from 'react';
import { ScenarioOption } from '@/types';
import { useSelectedScenario, useApp } from '@/contexts/AppContext';
import * as Icons from 'lucide-react';

interface SelectionBoxProps {
  option: ScenarioOption;
}

export function SelectionBox({ option }: SelectionBoxProps) {
  const selectedScenario = useSelectedScenario();
  const { setScenario } = useApp();
  
  const isSelected = selectedScenario === option.id;
  
  // Get the icon component dynamically
  const IconComponent = Icons[option.icon as keyof typeof Icons] as React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  
  const handleClick = () => {
    setScenario(option.id);
  };
  
  return (
    <button
      onClick={handleClick}
      className={`
        w-full p-6 rounded-lg border-2 transition-all duration-200 text-left
        hover:shadow-lg hover:scale-105 transform
        ${isSelected
          ? 'border-red-500 bg-red-50 shadow-lg scale-105'
          : 'border-gray-200 bg-white hover:border-red-300'
        }
      `}
    >
      <div className="flex items-start space-x-4">
        <div className={`
          p-3 rounded-full
          ${isSelected 
            ? 'bg-red-500 text-white' 
            : 'bg-gray-100 text-gray-600'
          }
        `}>
          <IconComponent size={24} />
        </div>
        
        <div className="flex-1">
          <h3 className={`
            text-lg font-semibold mb-2
            ${isSelected ? 'text-red-900' : 'text-gray-900'}
          `}>
            {option.title}
          </h3>
          
          <p className={`
            text-sm mb-3
            ${isSelected ? 'text-red-700' : 'text-gray-600'}
          `}>
            {option.subtitle}
          </p>
          
          <p className={`
            text-xs
            ${isSelected ? 'text-red-600' : 'text-gray-500'}
          `}>
            {option.description}
          </p>
        </div>
      </div>
    </button>
  );
} 