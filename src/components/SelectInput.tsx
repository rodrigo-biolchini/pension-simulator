'use client';

import React from 'react';
import { UseFormRegister, FieldError, Path } from 'react-hook-form';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps<T extends Record<string, unknown>> {
  label: string;
  name: Path<T>;
  options: SelectOption[];
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  required?: boolean;
  className?: string;
}

export function SelectInput<T extends Record<string, unknown>>({
  label,
  name,
  options,
  placeholder = "Selecione",
  register,
  error,
  required = false,
  className = '',
}: SelectInputProps<T>) {
  const inputId = `select-${name}`;
  
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <select
          id={inputId}
          {...register(name, {
            required: required ? `${label} é obrigatório` : false,
          })}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
            appearance-none bg-white cursor-pointer
            ${error 
              ? 'border-[#ea1e25] bg-[#ea1e25]' 
              : 'border-gray-300 bg-white'
            }
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
} 