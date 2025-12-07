import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TransactionContext } from '../contexts/TransactionContext';

const CATEGORIES = {
  expense: ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'],
  income: ['Salary', 'Business', 'Investment', 'Freelance', 'Other']
};

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams();
  const { transactions, updateTransaction } = useContext(TransactionContext);
  const router = useRouter();

  const transaction = transactions.find(t => t.id === id);

  const [type, setType] = useState<'income' | 'expense'>(transaction?.type || 'expense');
  const [amount, setAmount] = useState(transaction?.amount.toString() || '');
  const [category, setCategory] = useState(transaction?.category || 'Food');
  const [description, setDescription] = useState(transaction?.description || '');
  const [notes, setNotes] = useState(transaction?.notes || '');
  const [date, setDate] = useState(transaction?.date || new Date().toISOString().split('T')[0]);

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Transaction not found</Text>
      </View>
    );
  }

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
  };

  const handleUpdate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    await updateTransaction(transaction.id, {
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
      notes
    });

    Alert.alert('Success', 'Transaction updated successfully!');
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Type Selector */}
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
          onPress={() => handleTypeChange('expense')}
        >
          <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>
            Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
          onPress={() => handleTypeChange('income')}
        >
          <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>
            Income
          </Text>
        </TouchableOpacity>
      </View>

      {/* Amount Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Amount (₹)</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor="#999"
        />
      </View>

      {/* Category Selector */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          {CATEGORIES[type].map((cat) => (
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
      </View>

      {/* Description Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="e.g., Grocery shopping"
          placeholderTextColor="#999"
        />
      </View>

      {/* Date Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="2025-12-08"
          placeholderTextColor="#999"
        />
      </View>

      {/* Notes Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Additional notes..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Update Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
        <Text style={styles.submitButtonText}>Update Transaction</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  typeButtonActive: {
    backgroundColor: '#6200ee'
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  typeTextActive: {
    color: '#fff'
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9'
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top'
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
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
  submitButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40
  }
});
