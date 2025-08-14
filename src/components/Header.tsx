'use client';

import React from 'react';
import Image from 'next/image';

export function Header() {
  return (
    <header className="bg-[#283644] text-white py-6 px-4">
      <div className="container mx-auto">
        <div className="flex items-start justify-between lg:justify-start lg:space-x-8">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="relative h-10 w-28 sm:h-12 sm:w-32 md:h-14 md:w-36">
              <Image
                src="/santander_logo.png"
                alt="Santander Logo"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 7rem, (max-width: 768px) 8rem, (max-width: 1024px) 9rem, 10rem"
                priority
              />
            </div>
          </div>
          
          {/* Title and Description */}
          <div className="flex-1 text-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 lg:mb-3">
              Simulador de Previdência Privada
            </h1>
            
          </div>
          {/* Right spacer to keep title centered */}
          <div className="w-28 sm:w-32 md:w-36" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
} 