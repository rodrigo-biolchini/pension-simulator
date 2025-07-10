'use client';

import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface InputFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'email';
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function InputField({
  label,
  name,
  type = 'number',
  placeholder,
  register,
  error,
  required = false,
  min,
  max,
  step = 0.01,
  className = '',
}: InputFieldProps) {
  const inputId = `input-${name}`;
  
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        {...register(name, {
          required: required ? `${label} é obrigatório` : false,
          min: min !== undefined ? {
            value: min,
            message: `${label} deve ser maior que ${min}`
          } : undefined,
          max: max !== undefined ? {
            value: max,
            message: `${label} deve ser menor que ${max}`
          } : undefined,
          valueAsNumber: type === 'number',
        })}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
          ${error 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300 bg-white'
          }
        `}
        step={type === 'number' ? step : undefined}
        min={type === 'number' ? min : undefined}
        max={type === 'number' ? max : undefined}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
} 