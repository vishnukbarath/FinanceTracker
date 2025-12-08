import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { TransactionContext } from '../src/contexts/TransactionContext';
import { BudgetContext } from '../src/contexts/BudgetContext';

function BudgetSummary() {
  const { budgets } = useContext(BudgetContext);
  
  const overBudget = budgets.filter(b => (b.spent / b.amount) > 1);
  const nearLimit = budgets.filter(b => {
    const percent = (b.spent / b.amount) * 100;
    return percent > 80 && percent <= 100;
  });

  if (overBudget.length === 0 && nearLimit.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>⚠️ Budget Alerts</Text>
      {overBudget.map(b => (
        <View key={b.id} style={styles.alertItem}>
          <Text style={styles.alertTextOver}>
            {b.category}: Over by ₹{(b.spent - b.amount).toFixed(2)}
          </Text>
        </View>
      ))}
      {nearLimit.map(b => (
        <View key={b.id} style={styles.alertItem}>
          <Text style={styles.alertTextNear}>
            {b.category}: {((b.spent / b.amount) * 100).toFixed(0)}% used
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { transactions, getTotalIncome, getTotalExpenses } = useContext(TransactionContext);
  
  console.log('DEBUG: Transactions in home screen:', transactions);
  console.log('DEBUG: Total Income:', getTotalIncome());
  console.log('DEBUG: Total Expenses:', getTotalExpenses());
  
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = totalIncome - totalExpenses;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balance}>₹{balance.toFixed(2)}</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={styles.incomeText}>₹{totalIncome.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={styles.expenseText}>₹{totalExpenses.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Budget Alerts */}
        <BudgetSummary />

        {/* Recent Transactions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
              <Text style={styles.viewAllText}>View All →</Text>
            </TouchableOpacity>
          </View>
          
          {transactions.length > 0 ? (
            transactions.slice(-5).reverse().map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <Text style={styles.transactionDesc}>{transaction.description}</Text>
                  <Text style={styles.transactionCategory}>{transaction.category}</Text>
                </View>
                <Text style={transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No transactions yet. Tap + to add one!</Text>
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
  balanceCard: {
    backgroundColor: '#6200ee',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8
  },
  balance: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  summaryItem: {
    flex: 1
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4
  },
  incomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  expenseText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5252'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  viewAllText: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '600'
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  transactionLeft: {
    flex: 1
  },
  transactionDesc: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  transactionCategory: {
    fontSize: 13,
    color: '#999'
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336'
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20
  },
  alertItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  alertTextOver: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '600'
  },
  alertTextNear: {
    color: '#FF9800',
    fontSize: 14,
    fontWeight: '600'
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
