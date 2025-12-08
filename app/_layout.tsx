import { Stack } from 'expo-router';
import { TransactionProvider } from '../src/contexts/TransactionContext';

export default function RootLayout() {
  return (
    <TransactionProvider>
      <Stack screenOptions={{ 
        headerStyle: { backgroundColor: '#6200ee' }, 
        headerTintColor: '#fff' 
      }}>
        <Stack.Screen name="index" options={{ title: 'Finance Tracker' }} />
        <Stack.Screen name="add" options={{ title: 'Add Transaction' }} />
        <Stack.Screen name="history" options={{ title: 'Transaction History' }} />
        <Stack.Screen name="edit" options={{ title: 'Edit Transaction' }} />
      </Stack>
    </TransactionProvider>
  );
}
