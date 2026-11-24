import React from 'react';
import { StyleSheet, SafeAreaView, Platform, StatusBar as RNStatusBar, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { ProductsProvider } from './src/contexts/ProductsContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#0284c7" />
      <View style={styles.appContainer}>
        <AuthProvider>
          <ProductsProvider>
            <AppNavigator />
          </ProductsProvider>
        </AuthProvider>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0284c7',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  appContainer: {
    flex: 1,
    maxWidth: Platform.OS === 'web' ? 640 : undefined,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#f1f5f9',
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }
      : {}),
  },
});
