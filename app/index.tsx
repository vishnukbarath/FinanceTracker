import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { TransactionContext } from '../src/contexts/TransactionContext';

export default function Index() {
  const router = useRouter();
  const { transactions, getTotalIncome, getTotalExpenses } = useContext(TransactionContext);
  
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = totalIncome - totalExpenses;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Balance Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Balance</Text>
          <Text style={styles.balance}>₹{balance.toFixed(2)}</Text>
        </View>

        {/* Income and Expense Cards */}
        <View style={styles.row}>
          <View style={[styles.card, styles.halfCard]}>
            <Text style={styles.cardTitle}>Income</Text>
            <Text style={styles.income}>₹{totalIncome.toFixed(2)}</Text>
          </View>

          <View style={[styles.card, styles.halfCard]}>
            <Text style={styles.cardTitle}>Expenses</Text>
            <Text style={styles.expense}>₹{totalExpenses.toFixed(2)}</Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Transactions</Text>
          {transactions.length > 0 ? (
            transactions.slice(-5).reverse().map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View>
                  <Text style={styles.transactionDesc}>{transaction.description}</Text>
                  <Text style={styles.transactionCategory}>{transaction.category}</Text>
                </View>
                <Text style={transaction.type === 'income' ? styles.income : styles.expense}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No transactions yet. Add your first one!</Text>
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/add')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1,
    padding: 16
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  halfCard: {
    width: '48%'
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2196F3'
  },
  income: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  expense: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F44336'
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  transactionDesc: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  transactionCategory: {
    fontSize: 14,
    color: '#999',
    marginTop: 4
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8
  },
  fabText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold'
  }
});
