import React from 'react';
import { TransactionProvider } from '../src/contexts/TransactionContext';
import { BudgetProvider } from '../src/contexts/BudgetContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TransactionProvider>
      <BudgetProvider>
        {children}
      </BudgetProvider>
    </TransactionProvider>
  );
}
