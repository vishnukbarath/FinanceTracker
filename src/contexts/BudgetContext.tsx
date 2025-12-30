import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { Budget } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TransactionContext } from './TransactionContext';

interface BudgetContextType {
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => Promise<void>;
  updateBudget: (id: string, budget: Omit<Budget, 'id' | 'spent'>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  getBudgetByCategory: (category: string) => Budget | undefined;
  calculateSpent: (category: string, period: 'weekly' | 'monthly') => number;
}

export const BudgetContext = createContext<BudgetContextType>({
  budgets: [],
  addBudget: async () => {},
  updateBudget: async () => {},
  deleteBudget: async () => {},
  getBudgetByCategory: () => undefined,
  calculateSpent: () => 0,
});

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const { transactions } = useContext(TransactionContext);

  useEffect(() => {
    loadBudgets();
  }, []);

  useEffect(() => {
    if (transactions && transactions.length >= 0) {
      updateAllSpent();
    }
  }, [transactions]);

  const loadBudgets = async () => {
    try {
      const stored = await AsyncStorage.getItem('budgets');
      if (stored) {
        setBudgets(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading budgets:', error);
    }
  };

  const saveBudgets = async (newBudgets: Budget[]) => {
    try {
      await AsyncStorage.setItem('budgets', JSON.stringify(newBudgets));
      setBudgets(newBudgets);
    } catch (error) {
      console.error('Error saving budgets:', error);
    }
  };

  const calculateSpent = (category: string, period: 'weekly' | 'monthly'): number => {
    if (!transactions || transactions.length === 0) {
      return 0;
    }

    const now = new Date();
    const startDate = new Date();

    if (period === 'weekly') {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setMonth(now.getMonth() - 1);
    }

    const spent = transactions
      .filter(t => 
        t.type === 'expense' &&
        t.category === category &&
        new Date(t.date) >= startDate
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return spent;
  };

  const updateAllSpent = () => {
    if (budgets.length === 0) return;
    

    
    const updated = budgets.map(budget => ({
      ...budget,
      spent: calculateSpent(budget.category, budget.period)
    }));
    
    setBudgets(updated);
  };


  const addBudget = async (budget: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      spent: calculateSpent(budget.category, budget.period)
    };
    await saveBudgets([...budgets, newBudget]);
  };

  const updateBudget = async (id: string, updatedData: Omit<Budget, 'id' | 'spent'>) => {
    const updated = budgets.map(b => 
      b.id === id 
        ? { ...updatedData, id, spent: calculateSpent(updatedData.category, updatedData.period) }
        : b
    );
    await saveBudgets(updated);
  };

  const deleteBudget = async (id: string) => {
    const updated = budgets.filter(b => b.id !== id);
    await saveBudgets(updated);
  };

  const getBudgetByCategory = (category: string) => {
    return budgets.find(b => b.category === category);
  };

  return (
    <BudgetContext.Provider value={{
      budgets,
      addBudget,
      updateBudget,
      deleteBudget,
      getBudgetByCategory,
      calculateSpent
    }}>
      {children}
    </BudgetContext.Provider>
  );
};
