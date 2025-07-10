'use client';

import { SelectionGrid } from '@/components/SelectionGrid';
import { DynamicForm } from '@/components/DynamicForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { Header } from '@/components/Header';
import { AppProvider } from '@/contexts/AppContext';

export default function Home() {
  return (
    <AppProvider>
      <Header />
      <main className="bg-gray-50 py-8 px-4">
        <div className="container mx-auto">
          <SelectionGrid />
          <DynamicForm />
          <ResultsDisplay />
        </div>
      </main>
    </AppProvider>
  );
}
