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

export const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  addTransaction: async () => {},
  deleteTransaction: async () => {},
  updateTransaction: async () => {},
  getTransactionsByDateRange: () => [],
  getTotalIncome: () => 0,
  getTotalExpenses: () => 0,
});

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      console.log('DEBUG: Loading transactions from storage...');
      const stored = await AsyncStorage.getItem('transactions');
      console.log('DEBUG: Stored data:', stored);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('DEBUG: Parsed transactions:', parsed);
        setTransactions(parsed);
      } else {
        console.log('DEBUG: No stored transactions found');
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const saveTransactions = async (newTransactions: Transaction[]) => {
    try {
      console.log('DEBUG: Saving transactions:', newTransactions);
      await AsyncStorage.setItem('transactions', JSON.stringify(newTransactions));
      console.log('DEBUG: Transactions saved to storage');
      setTransactions(newTransactions);
      console.log('DEBUG: State updated with new transactions');
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    console.log('DEBUG: Adding new transaction:', newTransaction);
    console.log('DEBUG: Current transactions before add:', transactions);
    const updated = [...transactions, newTransaction];
    console.log('DEBUG: Updated transactions array:', updated);
    await saveTransactions(updated);
  };

  const deleteTransaction = async (id: string) => {
    console.log('DEBUG: Deleting transaction with id:', id);
    const updated = transactions.filter(t => t.id !== id);
    console.log('DEBUG: Transactions after delete:', updated);
    await saveTransactions(updated);
  };

  const updateTransaction = async (id: string, updatedData: Omit<Transaction, 'id'>) => {
    console.log('DEBUG: Updating transaction with id:', id);
    console.log('DEBUG: Updated data:', updatedData);
    const updated = transactions.map(t => 
      t.id === id ? { ...updatedData, id } : t
    );
    console.log('DEBUG: Transactions after update:', updated);
    await saveTransactions(updated);
  };

  const getTransactionsByDateRange = (startDate: string, endDate: string) => {
    return transactions.filter(t => t.date >= startDate && t.date <= endDate);
  };

  const getTotalIncome = () => {
    const total = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    return total;
  };

  const getTotalExpenses = () => {
    const total = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return total;
  };

  console.log('DEBUG: TransactionProvider rendering, current transactions:', transactions);

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
