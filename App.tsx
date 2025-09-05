import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { store } from '@/store';
import { AppNavigator } from '@/navigation/AppNavigator';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserProvider } from '@/contexts/UserContext';
import { CreatureProvider } from '@/contexts/CreatureContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { NetworkStatus } from '@/components/NetworkStatus';

// firebase shit
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AuthProvider>
          <NavigationContainer>
            <UserProvider>
              <CreatureProvider>
                <StatusBar style="light" backgroundColor="#1B4332" />
                <AppNavigator />
                <NetworkStatus />
              </CreatureProvider>
            </UserProvider>
          </NavigationContainer>
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  );
}