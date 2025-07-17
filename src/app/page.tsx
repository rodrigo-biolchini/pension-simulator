'use client';

import { SelectionGrid } from '@/components/SelectionGrid';
import { DynamicForm } from '@/components/DynamicForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { Header } from '@/components/Header';
import { AppProvider } from '@/contexts/AppContext';
import { useSelectedScenario, useLastResult } from '@/contexts/AppContext';

function MainContent() {
  const selectedScenario = useSelectedScenario();
  const lastResult = useLastResult();
  const hasResults = lastResult !== null;

  return (
    <main className="bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        <SelectionGrid />
        
        {/* Form and Results Container */}
        {selectedScenario && (
          <div className="mt-8 overflow-hidden">
            <div className={`
              flex transition-all duration-700 ease-in-out
              ${hasResults 
                ? 'lg:flex-row flex-col lg:space-x-8 space-y-8 lg:space-y-0' 
                : 'justify-center'
              }
            `}>
              {/* Dynamic Form */}
              <div className={`
                transition-all duration-700 ease-in-out
                ${hasResults 
                  ? 'lg:w-1/2 w-full' 
                  : 'w-full max-w-2xl mx-auto'
                }
              `}>
                <DynamicForm />
              </div>
              
              {/* Results Display */}
              <div className={`
                transition-all duration-700 ease-in-out
                ${hasResults 
                  ? 'lg:w-1/2 w-full opacity-100 transform translate-x-0' 
                  : 'w-0 opacity-0 transform translate-x-full overflow-hidden lg:block hidden'
                }
              `}>
                {hasResults && <ResultsDisplay />}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <Header />
      <MainContent />
    </AppProvider>
  );
}
