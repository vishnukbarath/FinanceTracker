import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { TransactionProvider } from '../src/contexts/TransactionContext';

export default function RootLayout() {
  return (
    <PaperProvider>
      <TransactionProvider>
        <Stack screenOptions={{ 
          headerStyle: { backgroundColor: '#6200ee' }, 
          headerTintColor: '#fff' 
        }}>
          <Stack.Screen name="index" options={{ title: 'Finance Tracker' }} />
          <Stack.Screen name="add" options={{ title: 'Add Transaction' }} />
        </Stack>
      </TransactionProvider>
    </PaperProvider>
  );
}
