import React, { useContext, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { TransactionContext } from '../src/contexts/TransactionContext';
import { BudgetContext } from '../src/contexts/BudgetContext';

/* ---------------- Budget Alerts ---------------- */

function BudgetSummary() {
  const { budgets } = useContext(BudgetContext);

  const { overBudget, nearLimit } = useMemo(() => {
    const over: typeof budgets = [];
    const near: typeof budgets = [];

    for (const b of budgets) {
      if (!b.amount || b.amount <= 0) continue;

      const percent = (b.spent / b.amount) * 100;

      if (percent > 100) over.push(b);
      else if (percent >= 80) near.push(b);
    }

    return { overBudget: over, nearLimit: near };
  }, [budgets]);

  if (overBudget.length === 0 && nearLimit.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>⚠ Budget Alerts</Text>

      {overBudget.map(b => (
        <AlertRow
          key={b.id}
          text={`${b.category}: Over by ₹${(b.spent - b.amount).toFixed(2)}`}
          type="over"
        />
      ))}

      {nearLimit.map(b => (
        <AlertRow
          key={b.id}
          text={`${b.category}: ${((b.spent / b.amount) * 100).toFixed(0)}% used`}
          type="near"
        />
      ))}
    </View>
  );
}

function AlertRow({ text, type }: { text: string; type: 'over' | 'near' }) {
  return (
    <View style={styles.alertItem}>
      <Text style={type === 'over' ? styles.alertTextOver : styles.alertTextNear}>
        {text}
      </Text>
    </View>
  );
}

/* ---------------- Home Screen ---------------- */

export default function HomeScreen() {
  const router = useRouter();
  const { transactions, getTotalIncome, getTotalExpenses } =
    useContext(TransactionContext);

  const totalIncome = useMemo(getTotalIncome, [getTotalIncome]);
  const totalExpenses = useMemo(getTotalExpenses, [getTotalExpenses]);
  const balance = totalIncome - totalExpenses;

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [transactions]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balance}>₹{balance.toFixed(2)}</Text>

          <View style={styles.summaryRow}>
            <SummaryItem label="Income" value={totalIncome} type="income" />
            <View style={styles.summaryDivider} />
            <SummaryItem label="Expenses" value={totalExpenses} type="expense" />
          </View>
        </View>

        {/* Budget Alerts */}
        <BudgetSummary />

        {/* Recent Transactions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Transactions</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/transactions')}
            >
              <Text style={styles.viewAllText}>View All →</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length > 0 ? (
            recentTransactions.map(tx => (
              <TransactionRow key={tx.id} transaction={tx} />
            ))
          ) : (
            <Text style={styles.emptyText}>
              No transactions yet. Tap + to add one.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/add')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- Components ---------------- */

function SummaryItem({
  label,
  value,
  type
}: {
  label: string;
  value: number;
  type: 'income' | 'expense';
}) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={type === 'income' ? styles.incomeText : styles.expenseText}>
        ₹{value.toFixed(2)}
      </Text>
    </View>
  );
}

function TransactionRow({ transaction }: any) {
  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <Text style={styles.transactionDesc}>
          {transaction.description}
        </Text>
        <Text style={styles.transactionCategory}>
          {transaction.category}
        </Text>
      </View>

      <Text
        style={
          transaction.type === 'income'
            ? styles.incomeAmount
            : styles.expenseAmount
        }
      >
        {transaction.type === 'income' ? '+' : '-'}₹
        {transaction.amount.toFixed(2)}
      </Text>
    </View>
  );
}

/* ---------------- Styles ---------------- */

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
    borderRadius: 18,
    padding: 24,
    marginBottom: 16,
    elevation: 6
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)'
  },
  balance: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    marginVertical: 12
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
    color: 'rgba(255,255,255,0.8)'
  },
  incomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50'
  },
  expenseText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF5252'
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 3
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700'
  },
  viewAllText: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '600'
  },

  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  transactionLeft: {
    flex: 1
  },
  transactionDesc: {
    fontSize: 15,
    fontWeight: '600'
  },
  transactionCategory: {
    fontSize: 13,
    color: '#999'
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50'
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F44336'
  },

  emptyText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20
  },

  alertItem: {
    paddingVertical: 8
  },
  alertTextOver: {
    color: '#F44336',
    fontWeight: '600'
  },
  alertTextNear: {
    color: '#FF9800',
    fontWeight: '600'
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8
  },
  fabText: {
    fontSize: 34,
    color: '#fff',
    fontWeight: '800'
  }
});
