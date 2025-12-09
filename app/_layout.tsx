
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';
import { AppProviders } from './providers';

export default function TabLayout() {
  return (
    
    <AppProviders>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: '#999',
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 88 : 60,
            paddingBottom: Platform.OS === 'ios' ? 24 : 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600'
          }
        }}
      >
          <Tabs.Screen
            name="transactions"
            options={{
              title: 'Transactions',
              tabBarLabel: 'Transactions',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>📊</Text>,
            }}
          />

          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarLabel: 'Home',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 28 }}>🏠</Text>,
              headerTitle: 'Finance Tracker',
            }}
          />

          <Tabs.Screen
            name="budget"
            options={{
              title: 'Budgets',
              tabBarLabel: 'Budget',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>💰</Text>,
            }}
          />
    </Tabs>
    </AppProviders>
  );
}
