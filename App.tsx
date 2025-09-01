import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from '@/store';
import { AppNavigator } from '@/navigation/AppNavigator';
import { AuthProvider } from '@/contexts/AuthContext';

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </Provider>
  );
}