import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, SegmentedButtons, Menu, Provider } from 'react-native-paper';
import { TransactionContext } from '../contexts/TransactionContext';
import { useRouter } from 'expo-router';

const CATEGORIES = {
  expense: ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'],
  income: ['Salary', 'Business', 'Investment', 'Freelance', 'Other']
};

export default function AddTransactionScreen() {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [menuVisible, setMenuVisible] = useState(false);

  const { addTransaction } = useContext(TransactionContext);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    await addTransaction({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
      notes
    });

    Alert.alert('Success', 'Transaction added successfully');
    router.back();
  };

  return (
    <Provider>
      <ScrollView style={styles.container}>
        <SegmentedButtons
          value={type}
          onValueChange={(value) => {
            setType(value as 'income' | 'expense');
            setCategory(CATEGORIES[value as 'income' | 'expense'][0]);
          }}
          buttons={[
            { value: 'expense', label: 'Expense' },
            { value: 'income', label: 'Income' }
          ]}
          style={styles.segment}
        />

        <TextInput
          label="Amount (₹)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          mode="outlined"
          style={styles.input}
        />

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button 
              mode="outlined" 
              onPress={() => setMenuVisible(true)}
              style={styles.input}
            >
              Category: {category}
            </Button>
          }
        >
          {CATEGORIES[type].map((cat) => (
            <Menu.Item
              key={cat}
              onPress={() => {
                setCategory(cat);
                setMenuVisible(false);
              }}
              title={cat}
            />
          ))}
        </Menu>

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Notes (Optional)"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
          Add Transaction
        </Button>
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  segment: {
    marginBottom: 16
  },
  input: {
    marginBottom: 16
  },
  submitButton: {
    marginTop: 8,
    paddingVertical: 8
  }
});
