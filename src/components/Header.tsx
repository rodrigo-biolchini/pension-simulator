'use client';

import React from 'react';
import { Building2 } from 'lucide-react';
import Image from 'next/image';

export function Header() {
  return (
    <header className="bg-red-600 text-white py-6 px-4">
      <div className="container mx-auto">
        <div className="flex items-start justify-between lg:justify-start lg:space-x-8">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* You can replace this with an actual logo image */}
            <div className="w-12 h-12 flex items-center justify-center">
              <Image 
                src="/santander_logo.jpg" 
                alt="Santander Logo" 
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-semibold">Santander</div>
              <div className="text-sm opacity-90">Private</div>
            </div>
          </div>
          
          {/* Title and Description */}
          <div className="flex-1 text-center lg:text-left lg:pl-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 lg:mb-3">
              Simulador de Previdência Privada
            </h1>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl font-light max-w-4xl">
              Planeje sua aposentadoria com nosso simulador inteligente. Calcule contribuições, projeções e renda futura de forma simples e eficiente.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
} 