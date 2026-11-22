export interface Produto {
  id: number;
  nome: string;
  preco: number;
}

export interface NovoProdutoInput {
  nome: string;
  preco: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
