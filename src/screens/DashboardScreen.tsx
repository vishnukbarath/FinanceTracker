import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { TransactionContext } from '../contexts/TransactionContext';

export default function DashboardScreen() {
  const { transactions, getTotalIncome, getTotalExpenses } = useContext(TransactionContext);
  
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = totalIncome - totalExpenses;

  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(categoryData).map(([name, amount], index) => ({
    name,
    population: amount,
    color: `hsl(${index * 60}, 70%, 50%)`,
    legendFontColor: '#7F7F7F',
    legendFontSize: 12
  }));

  const screenWidth = Dimensions.get('window').width;

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

      {chartData.length > 0 ? (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Expense Breakdown</Title>
            <PieChart
              data={chartData}
              width={screenWidth - 60}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </Card.Content>
        </Card>
      ) : (
        <Card style={styles.card}>
          <Card.Content>
            <Title>No Expenses Yet</Title>
            <Paragraph>Add your first transaction to see the breakdown</Paragraph>
          </Card.Content>
        </Card>
      )}
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
