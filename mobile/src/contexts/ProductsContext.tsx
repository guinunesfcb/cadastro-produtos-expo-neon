import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Product } from '../types/Product';
import { fetchProducts, createProduct, deleteProduct } from '../services/api';

interface ProductsContextData {
  products: Product[];
  loading: boolean;
  refreshing: boolean;
  saving: boolean;
  deletingIds: number[];
  error: string | null;
  loadProducts: (isPullToRefresh?: boolean) => Promise<void>;
  addProduct: (nome: string, preco: number) => Promise<Product>;
  removeProduct: (id: number) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextData>({} as ProductsContextData);

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async (isPullToRefresh = false) => {
    if (isPullToRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar produtos do servidor.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const addProduct = async (nome: string, preco: number): Promise<Product> => {
    setSaving(true);
    try {
      const newProduct = await createProduct(nome, preco);
      setProducts((current) => [
        newProduct,
        ...current.filter((p) => p.id !== newProduct.id),
      ]);
      return newProduct;
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (id: number): Promise<void> => {
    setDeletingIds((current) => [...current, id]);
    try {
      await deleteProduct(id);
      setProducts((current) => current.filter((p) => p.id !== id));
    } finally {
      setDeletingIds((current) => current.filter((itemId) => itemId !== id));
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        refreshing,
        saving,
        deletingIds,
        error,
        loadProducts,
        addProduct,
        removeProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export function useProducts(): ProductsContextData {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts deve ser utilizado dentro de um ProductsProvider');
  }
  return context;
}
