import { getApiBaseUrl } from '../config/apiConfig';
import { ApiResponse, Produto } from '../types/produto';

/**
 * Cliente HTTP para comunicacao com o backend
 */
export async function fetchProdutos(): Promise<Produto[]> {
  const baseUrl = getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/produtos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json: ApiResponse<Produto[]> = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error || `Erro ao carregar produtos (HTTP ${response.status})`);
    }

    return json.data || [];
  } catch (error: any) {
    if (error.message && error.message.includes('Network request failed')) {
      throw new Error(
        `Nao foi possivel conectar a API em ${baseUrl}. Verifique se o backend esta rodando e se o endereco IP esta correto.`
      );
    }
    throw error;
  }
}

export async function criarProduto(nome: string, preco: number): Promise<Produto> {
  const baseUrl = getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/produtos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome, preco }),
    });

    const json: ApiResponse<Produto> = await response.json();

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
        `Falha de conexao com a API em ${baseUrl}. Verifique a sua rede e o backend.`
      );
    }
    throw error;
  }
}

export async function deletarProduto(id: number): Promise<number> {
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
