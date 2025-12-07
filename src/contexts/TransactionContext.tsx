import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Transaction } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => Promise<void>;
  getTransactionsByDateRange: (startDate: string, endDate: string) => Transaction[];
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
}

export const TransactionContext = createContext<TransactionContextType>({} as TransactionContextType);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const stored = await AsyncStorage.getItem('transactions');
      if (stored) {
        setTransactions(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const saveTransactions = async (newTransactions: Transaction[]) => {
    try {
      await AsyncStorage.setItem('transactions', JSON.stringify(newTransactions));
      setTransactions(newTransactions);
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    await saveTransactions([...transactions, newTransaction]);
  };

  const deleteTransaction = async (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    await saveTransactions(updated);
  };

  const updateTransaction = async (id: string, updatedData: Omit<Transaction, 'id'>) => {
    const updated = transactions.map(t => 
      t.id === id ? { ...updatedData, id } : t
    );
    await saveTransactions(updated);
  };

  const getTransactionsByDateRange = (startDate: string, endDate: string) => {
    return transactions.filter(t => t.date >= startDate && t.date <= endDate);
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      getTransactionsByDateRange,
      getTotalIncome,
      getTotalExpenses
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
