import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { ApiResponse, Product } from '../types/Product';

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

/**
 * Cliente HTTP para comunicacao com o backend
 */
export async function fetchProducts(): Promise<Product[]> {
  const baseUrl = getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/produtos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json: ApiResponse<Product[]> = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error || `Erro ao carregar produtos (HTTP ${response.status})`);
    }

    return json.data || [];
  } catch (error: any) {
    if (error.message && error.message.includes('Network request failed')) {
      throw new Error(
        `Nao foi possivel conectar a API em ${baseUrl}. Verifique se o backend esta rodando.`
      );
    }
    throw error;
  }
}

export const fetchProdutos = fetchProducts;

export async function createProduct(nome: string, preco: number): Promise<Product> {
  const baseUrl = getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/produtos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, preco }),
    });

    const json: ApiResponse<Product> = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error || `Erro ao salvar produto (HTTP ${response.status})`);
    }

    if (!json.data) {
      throw new Error('Resposta invalida do servidor.');
    }

    return json.data;
  } catch (error: any) {
    if (error.message && error.message.includes('Network request failed')) {
      throw new Error(
        `Falha de conexao com a API em ${baseUrl}. Verifique a rede e o backend.`
      );
    }
    throw error;
  }
}

export const criarProduto = createProduct;

export async function deleteProduct(id: number): Promise<number> {
  const baseUrl = getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/produtos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json: ApiResponse<{ id: number }> = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error || `Erro ao excluir produto (HTTP ${response.status})`);
    }

    return id;
  } catch (error: any) {
    if (error.message && error.message.includes('Network request failed')) {
      throw new Error(
        `Falha de conexao com a API ao tentar excluir o produto. Verifique o servidor.`
      );
    }
    throw error;
  }
}

export const deletarProduto = deleteProduct;
