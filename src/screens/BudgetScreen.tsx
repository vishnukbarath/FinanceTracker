import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { BudgetContext } from '../contexts/BudgetContext';
import { Budget } from '../types';

const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'];

export default function BudgetScreen() {
  const { budgets, addBudget, deleteBudget } = useContext(BudgetContext);
  const [showAddForm, setShowAddForm] = useState(false);
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly');

  const handleAddBudget = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid budget amount');
      return;
    }

    const existingBudget = budgets.find(b => b.category === category);
    if (existingBudget) {
      Alert.alert('Error', `Budget for ${category} already exists`);
      return;
    }

    await addBudget({
      category,
      amount: parseFloat(amount),
      period
    });

    setAmount('');
    setShowAddForm(false);
    Alert.alert('Success', 'Budget added successfully!');
  };

  const handleDeleteBudget = (id: string, category: string) => {
    Alert.alert(
      'Delete Budget',
      `Delete budget for ${category}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteBudget(id)
        }
      ]
    );
  };

  const renderBudgetItem = (budget: Budget) => {
    const percentage = (budget.spent / budget.amount) * 100;
    const isOverBudget = percentage > 100;
    const isNearLimit = percentage > 80 && percentage <= 100;

    return (
      <View key={budget.id} style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <View>
            <Text style={styles.budgetCategory}>{budget.category}</Text>
            <Text style={styles.budgetPeriod}>{budget.period}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDeleteBudget(budget.id, budget.category)}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.budgetAmounts}>
          <Text style={styles.spentAmount}>
            ₹{budget.spent.toFixed(2)} / ₹{budget.amount.toFixed(2)}
          </Text>
          <Text style={[
            styles.percentageText,
            isOverBudget && styles.overBudget,
            isNearLimit && styles.nearLimit
          ]}>
            {percentage.toFixed(0)}%
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar,
              { width: `${Math.min(percentage, 100)}%` },
              isOverBudget && styles.progressBarOver,
              isNearLimit && styles.progressBarNear
            ]}
          />
        </View>

        {isOverBudget && (
          <Text style={styles.warningText}>⚠️ Over budget by ₹{(budget.spent - budget.amount).toFixed(2)}</Text>
        )}
        {isNearLimit && !isOverBudget && (
          <Text style={styles.warningTextNear}>⚠️ Approaching budget limit</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {budgets.length > 0 ? (
          budgets.map(renderBudgetItem)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No budgets set</Text>
            <Text style={styles.emptySubtext}>Create your first budget to track spending</Text>
          </View>
        )}
      </ScrollView>

      {/* Add Budget Form */}
      {showAddForm ? (
        <View style={styles.addForm}>
          <Text style={styles.formTitle}>Add New Budget</Text>

          {/* Period Selector */}
          <View style={styles.periodContainer}>
            <TouchableOpacity
              style={[styles.periodButton, period === 'weekly' && styles.periodButtonActive]}
              onPress={() => setPeriod('weekly')}
            >
              <Text style={[styles.periodText, period === 'weekly' && styles.periodTextActive]}>
                Weekly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, period === 'monthly' && styles.periodButtonActive]}
              onPress={() => setPeriod('monthly')}
            >
              <Text style={[styles.periodText, period === 'monthly' && styles.periodTextActive]}>
                Monthly
              </Text>
            </TouchableOpacity>
          </View>

          {/* Category Selector */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {EXPENSE_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryText,
                  category === cat && styles.categoryTextActive
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Amount Input */}
          <Text style={styles.label}>Budget Amount (₹)</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="Enter budget amount"
            placeholderTextColor="#999"
          />

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setShowAddForm(false);
                setAmount('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={handleAddBudget}
            >
              <Text style={styles.addButtonText}>Add Budget</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowAddForm(true)}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
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
  budgetCard: {
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
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  budgetCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  budgetPeriod: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  deleteText: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '600'
  },
  budgetAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  spentAmount: {
    fontSize: 16,
    color: '#333'
  },
  percentageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  nearLimit: {
    color: '#FF9800'
  },
  overBudget: {
    color: '#F44336'
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5
  },
  progressBarNear: {
    backgroundColor: '#FF9800'
  },
  progressBarOver: {
    backgroundColor: '#F44336'
  },
  warningText: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4
  },
  warningTextNear: {
    color: '#FF9800',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4
  },
  emptyContainer: {
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
  },
  addForm: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16
  },
  periodContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  periodButtonActive: {
    backgroundColor: '#6200ee'
  },
  periodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  periodTextActive: {
    color: '#fff'
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff'
  },
  categoryButtonActive: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee'
  },
  categoryText: {
    fontSize: 14,
    color: '#333'
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 16
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#f0f0f0'
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600'
  },
  addButton: {
    backgroundColor: '#6200ee'
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
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
