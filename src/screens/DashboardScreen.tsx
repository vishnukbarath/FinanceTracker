import React, { useContext } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { TransactionContext } from '../contexts/TransactionContext';

export default function DashboardScreen() {
  const { transactions, getTotalIncome, getTotalExpenses } = useContext(TransactionContext);
  
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = totalIncome - totalExpenses;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Total Balance</Title>
          <Paragraph style={styles.balance}>₹{balance.toFixed(2)}</Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.row}>
        <Card style={[styles.card, styles.halfCard]}>
          <Card.Content>
            <Title style={styles.cardTitle}>Income</Title>
            <Paragraph style={styles.income}>₹{totalIncome.toFixed(2)}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={[styles.card, styles.halfCard]}>
          <Card.Content>
            <Title style={styles.cardTitle}>Expenses</Title>
            <Paragraph style={styles.expense}>₹{totalExpenses.toFixed(2)}</Paragraph>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Recent Transactions</Title>
          <Paragraph>Total: {transactions.length} transactions</Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  card: {
    marginBottom: 16
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  halfCard: {
    width: '48%'
  },
  cardTitle: {
    fontSize: 16
  },
  balance: {
    fontSize: 32,
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
  }
});
