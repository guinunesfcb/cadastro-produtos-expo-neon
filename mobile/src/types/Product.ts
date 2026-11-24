export interface Product {
  id: number;
  nome: string;
  preco: number;
}

// Alias em portugues para retrocompatibilidade
export type Produto = Product;

export interface CreateProductInput {
  nome: string;
  preco: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
