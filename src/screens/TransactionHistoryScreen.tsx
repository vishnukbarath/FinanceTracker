import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { TransactionContext } from '../contexts/TransactionContext';
import { Transaction } from '../types';

export default function TransactionHistoryScreen() {
  const { transactions, deleteTransaction } = useContext(TransactionContext);
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = transactions.filter(t => 
    filter === 'all' ? true : t.type === filter
  ).reverse(); // Show newest first

  const handleDelete = (id: string, description: string) => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${description}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteTransaction(id)
        }
      ]
    );
  };

  const renderTransaction = (transaction: Transaction) => (
    <TouchableOpacity 
      key={transaction.id} 
      style={styles.transactionCard}
      onPress={() => router.push(`/edit?id=${transaction.id}`)}
    >
      <View style={styles.transactionMain}>
        <View style={styles.transactionInfo}>
          <Text style={styles.description}>{transaction.description}</Text>
          <Text style={styles.category}>{transaction.category}</Text>
          <Text style={styles.date}>{transaction.date}</Text>
          {transaction.notes ? (
            <Text style={styles.notes}>{transaction.notes}</Text>
          ) : null}
        </View>
        <View style={styles.transactionRight}>
          <Text style={[
            styles.amount,
            transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount
          ]}>
            {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
          </Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              handleDelete(transaction.id, transaction.description);
            }}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All ({transactions.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'income' && styles.filterButtonActive]}
          onPress={() => setFilter('income')}
        >
          <Text style={[styles.filterText, filter === 'income' && styles.filterTextActive]}>
            Income ({transactions.filter(t => t.type === 'income').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'expense' && styles.filterButtonActive]}
          onPress={() => setFilter('expense')}
        >
          <Text style={[styles.filterText, filter === 'expense' && styles.filterTextActive]}>
            Expenses ({transactions.filter(t => t.type === 'expense').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transaction List */}
      <ScrollView style={styles.scrollView}>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(renderTransaction)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
            <Text style={styles.emptySubtext}>Add your first transaction to get started!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center'
  },
  filterButtonActive: {
    backgroundColor: '#6200ee'
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666'
  },
  filterTextActive: {
    color: 'white'
  },
  scrollView: {
    flex: 1,
    padding: 16
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  transactionMain: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  transactionInfo: {
    flex: 1,
    marginRight: 12
  },
  transactionRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  date: {
    fontSize: 12,
    color: '#999'
  },
  notes: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  },
  incomeAmount: {
    color: '#4CAF50'
  },
  expenseAmount: {
    color: '#F44336'
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999'
  }
});
