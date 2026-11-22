import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Obtem a URL base da API dinamicamente para diferentes ambientes:
 * 1. Variavel de ambiente EXPO_PUBLIC_API_URL (prioritaria)
 * 2. Emulador Android: 10.0.2.2:3001
 * 3. Simulador iOS / Web: localhost:3001
 * 4. Expo Go em dispositivo fisico: detecta automaticamente o IP do host (computador) via hostUri
 */
export function getApiBaseUrl(): string {
  // 1. Prioridade para variavel configurada explicitamente
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/$/, '');
  }

  // 2. Se estiver rodando via Expo Go no celular fisico, descobre o IP do computador
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip) {
      return `http://${ip}:3001`;
    }
  }

  // 3. Fallbacks padroes para emuladores locais
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }

  return 'http://localhost:3001';
}

export const API_BASE_URL = getApiBaseUrl();
