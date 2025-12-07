import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';
import DashboardScreen from '../src/screens/DashboardScreen';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <DashboardScreen />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/add')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee'
  }
});
