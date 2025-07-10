'use client';

import React from 'react';
import { SelectionBox } from './SelectionBox';
import { SCENARIO_OPTIONS } from '@/constants';

export function SelectionGrid() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Escolha uma das opções abaixo para simular seu planejamento previdenciário
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SCENARIO_OPTIONS.map((option) => (
          <SelectionBox key={option.id} option={option} />
        ))}
      </div>
    </div>
  );
} 