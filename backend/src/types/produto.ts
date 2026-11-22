export interface Produto {
  id: number;
  nome: string;
  preco: number;
}

export interface CreateProdutoDTO {
  nome: string;
  preco: number | string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
