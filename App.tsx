import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { store } from '@/store';
import { AppNavigator } from '@/navigation/AppNavigator';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { NetworkStatus } from '@/components/NetworkStatus';

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor="#1B4332" />
            <AppNavigator />
            <NetworkStatus />
          </NavigationContainer>
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  );
}