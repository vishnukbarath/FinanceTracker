import React, { useState, useContext, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { TransactionContext } from '../src/contexts/TransactionContext';

type TransactionType = 'income' | 'expense';

const CATEGORIES: Record<TransactionType, string[]> = {
  expense: ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'],
  income: ['Salary', 'Business', 'Investment', 'Freelance', 'Other']
};

export default function AddTransactionScreen() {
  const router = useRouter();
  const { addTransaction } = useContext(TransactionContext);

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  );

  /** -------- Derived Values -------- */
  const parsedAmount = useMemo(() => Number(amount), [amount]);
  const categories = useMemo(() => CATEGORIES[type], [type]);

  /** -------- Handlers -------- */
  const handleTypeChange = useCallback((newType: TransactionType) => {
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
  }, []);

  const handleAmountChange = useCallback((value: string) => {
    // Allow only numbers and decimals
    const sanitized = value.replace(/[^0-9.]/g, '');
    setAmount(sanitized);
  }, []);

  const validateForm = (): boolean => {
    if (!parsedAmount || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Amount must be greater than zero.');
      return false;
    }

    if (!description.trim()) {
      Alert.alert('Missing Description', 'Description is required.');
      return false;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      Alert.alert('Invalid Date', 'Use YYYY-MM-DD format.');
      return false;
    }

    return true;
  };

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    try {
      await addTransaction({
        type,
        amount: parsedAmount,
        category,
        description: description.trim(),
        notes: notes.trim(),
        date
      });

      Alert.alert('Success', 'Transaction added.');
      router.back();
    } catch (err) {
      Alert.alert('Error', 'Failed to add transaction.');
    }
  }, [
    type,
    parsedAmount,
    category,
    description,
    notes,
    date,
    addTransaction,
    router
  ]);

  /** -------- Render -------- */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Type Selector */}
        <View style={styles.typeContainer}>
          {(['expense', 'income'] as TransactionType[]).map(t => (
            <TouchableOpacity
              key={t}
              style={[
                styles.typeButton,
                type === t && styles.typeButtonActive
              ]}
              onPress={() => handleTypeChange(t)}
            >
              <Text
                style={[
                  styles.typeText,
                  type === t && styles.typeTextActive
                ]}
              >
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amount */}
        <Input
          label="Amount (₹)"
          value={amount}
          onChangeText={handleAmountChange}
          keyboardType="decimal-pad"
          placeholder="0.00"
        />

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextActive
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="e.g., Grocery shopping"
        />

        {/* Date */}
        <Input
          label="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          placeholder="2025-12-08"
        />

        {/* Notes */}
        <Input
          label="Notes (Optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Additional notes..."
          multiline
          numberOfLines={3}
          style={styles.textArea}
        />

        {/* Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Transaction</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/** -------- Reusable Input Component -------- */
function Input({
  label,
  style,
  ...props
}: {
  label: string;
  style?: any;
} & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        style={[styles.input, style]}
        placeholderTextColor="#999"
      />
    </View>
  );
}

/** -------- Styles -------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },

  typeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden'
  },
  typeButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center'
  },
  typeButtonActive: {
    backgroundColor: '#6200ee'
  },
  typeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333'
  },
  typeTextActive: {
    color: '#fff'
  },

  inputGroup: {
    marginBottom: 18
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333'
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
    height: 90,
    textAlignVertical: 'top'
  },

  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  categoryButtonActive: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee'
  },
  categoryText: {
    fontSize: 13,
    color: '#333'
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600'
  },

  submitButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700'
  }
});
