import '@expo/metro-runtime';
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent chama AppRegistry.registerComponent('main', () => App);
// Ele garante que o ambiente seja configurado corretamente em celulares (iOS/Android) e na Web.
registerRootComponent(App);
