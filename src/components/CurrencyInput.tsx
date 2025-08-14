'use client';

import React, { useState, useEffect } from 'react';
import { UseFormRegister, FieldError, UseFormSetValue, UseFormWatch, Path } from 'react-hook-form';

interface CurrencyInputProps<T extends Record<string, unknown>> {
  label: string;
  name: Path<T>;
  placeholder?: string;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  error?: FieldError;
  required?: boolean;
  min?: number;
  max?: number;
  className?: string;
}

export function CurrencyInput<T extends Record<string, unknown>>({
  label,
  name,
  placeholder,
  register,
  setValue,
  watch,
  error,
  required = false,
  min = 0,
  max = 10000000,
  className = '',
}: CurrencyInputProps<T>) {
  const [displayValue, setDisplayValue] = useState('R$ 0,00');
  const watchedValue = watch(name);
  const inputId = `input-${name}`;

  // Format number to Brazilian Real currency
  const formatCurrency = (value: number | undefined | null): string => {
    // Handle undefined, null, or NaN values
    const numValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  };

  // Convert cents to currency value
  const centsToValue = (cents: number): number => {
    return cents / 100;
  };

  // Initialize and update display value
  useEffect(() => {
    const formattedValue = formatCurrency(watchedValue as number);
    setDisplayValue(formattedValue);
  }, [watchedValue]);

  // Initialize the form value to 0 if it's undefined
  useEffect(() => {
    if (watchedValue === undefined || watchedValue === null) {
      (setValue as (name: Path<T>, value: number) => void)(name, 0);
    }
  }, [name, setValue, watchedValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Extract only digits from input
    const digitsOnly = inputValue.replace(/\D/g, '');
    
    // Convert to cents (number)
    const cents = parseInt(digitsOnly || '0', 10);
    
    // Convert cents to actual currency value
    const currencyValue = centsToValue(cents);
    
    // Update display value
    setDisplayValue(formatCurrency(currencyValue));
    
    // Update form value
    (setValue as (name: Path<T>, value: number, options?: object) => void)(name, currencyValue, { shouldValidate: true });
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Move cursor to end on focus
    setTimeout(() => {
      e.target.setSelectionRange(e.target.value.length, e.target.value.length);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ];
    
    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

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
        <input
          id={inputId}
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'R$ 0,00'}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            text-left font-semibold text-lg
            ${error 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 bg-white'
            }
          `}
          style={{ direction: 'ltr' }}
        />
        
        {/* Hidden input for form validation */}
        <input
          type="hidden"
          {...register(name, {
            required: required ? `${label} é obrigatório` : false,
            min: min !== undefined ? {
              value: min,
              message: `${label} deve ser maior que ${formatCurrency(min)}`
            } : undefined,
            max: max !== undefined ? {
              value: max,
              message: `${label} deve ser menor que ${formatCurrency(max)}`
            } : undefined,
            valueAsNumber: true,
          })}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    
    </div>
  );
} 