import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProductScreen } from '../screens/ProductScreen';

export type ScreenName = 'Login' | 'Home' | 'Product';

interface NavigationContextData {
  currentScreen: ScreenName;
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextData>(
  {} as NavigationContextData
);

export const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [screenStack, setScreenStack] = useState<ScreenName[]>(['Home']);

  const currentScreen = screenStack[screenStack.length - 1] || 'Home';

  const navigate = (screen: ScreenName) => {
    setScreenStack((prev) => [...prev, screen]);
  };

  const goBack = () => {
    setScreenStack((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, prev.length - 1);
      }
      return prev;
    });
  };

  if (!isAuthenticated) {
    return (
      <NavigationContext.Provider
        value={{ currentScreen: 'Login', navigate, goBack }}
      >
        <LoginScreen />
      </NavigationContext.Provider>
    );
  }

  return (
    <NavigationContext.Provider value={{ currentScreen, navigate, goBack }}>
      {currentScreen === 'Product' ? <ProductScreen /> : <HomeScreen />}
    </NavigationContext.Provider>
  );
};

export function useNavigation(): NavigationContextData {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation deve ser utilizado dentro de um AppNavigator');
  }
  return context;
}
