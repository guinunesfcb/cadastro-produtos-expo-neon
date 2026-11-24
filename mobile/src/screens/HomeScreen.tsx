import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../navigation/AppNavigator';
import { useProducts } from '../hooks/useProducts';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { EmptyList } from '../components/EmptyList';
import { ErrorFeedback } from '../components/ErrorFeedback';
import { formatCurrency, showConfirm, showAlert } from '../utils/formatCurrency';
import { Product } from '../types/Product';
import { getApiBaseUrl } from '../services/api';

export const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { navigate } = useNavigation();
  const {
    products,
    loading,
    refreshing,
    deletingIds,
    error,
    loadProducts,
    removeProduct,
  } = useProducts();

  const handleExcluir = (produto: Product) => {
    showConfirm(
      'Confirmar Exclusão',
      `Deseja realmente excluir o produto "${produto.nome}"?`,
      async () => {
        try {
          await removeProduct(produto.id);
          showAlert('Sucesso', 'Produto removido com sucesso.');
        } catch (err: any) {
          showAlert('Erro', err.message || 'Falha ao excluir o produto.');
        }
      },
      'Excluir'
    );
  };

  const renderHeader = () => (
    <View>
      <Header
        title="Catálogo de Produtos"
        subtitle={user ? `Conectado como ${user.name}` : 'PostgreSQL Neon Serverless'}
        showLogout
        onLogout={logout}
      />

      <View style={styles.actionContainer}>
        <Button
          title="+ Cadastrar Novo Produto"
          onPress={() => navigate('Product')}
          style={styles.botaoNovo}
        />
      </View>

      {error && (
        <ErrorFeedback
          mensagem={error}
          onRetry={() => loadProducts()}
          carregando={loading}
        />
      )}

      <View style={styles.secaoTituloContainer}>
        <Text style={styles.secaoTitulo}>Lista de Produtos</Text>
        <Text style={styles.contadorBadge}>
          {products.length} {products.length === 1 ? 'item' : 'itens'}
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <Text style={styles.footerTexto}>
        API: {getApiBaseUrl()}
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: Product }) => {
    const excluindo = deletingIds.includes(item.id);

    return (
      <View style={styles.itemCard}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemNome} numberOfLines={2}>
            {item.nome}
          </Text>
          <Text style={styles.itemPreco}>{formatCurrency(item.preco)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.botaoExcluir, excluindo && styles.botaoDesabilitado]}
          onPress={() => handleExcluir(item)}
          disabled={excluindo}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={`Excluir produto ${item.nome}`}
        >
          {excluindo ? (
            <ActivityIndicator size="small" color="#dc2626" />
          ) : (
            <Text style={styles.textoBotaoExcluir}>Excluir</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading && products.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Header
            title="Catálogo de Produtos"
            subtitle="Carregando dados..."
          />
          <View style={styles.centroLoading}>
            <ActivityIndicator size="large" color="#0284c7" />
            <Text style={styles.loadingTexto}>Carregando produtos...</Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={!error ? <EmptyList /> : null}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadProducts(true)}
              colors={['#0284c7']}
              tintColor="#0284c7"
            />
          }
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  listContent: {
    paddingBottom: 32,
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  botaoNovo: {
    backgroundColor: '#0284c7',
  },
  secaoTituloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginTop: 12,
    marginBottom: 8,
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  contadorBadge: {
    backgroundColor: '#e2e8f0',
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  itemPreco: {
    fontSize: 15,
    fontWeight: '700',
    color: '#059669',
  },
  botaoExcluir: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotaoExcluir: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
  },
  centroLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingTexto: {
    marginTop: 12,
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  footerContainer: {
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  footerTexto: {
    fontSize: 11,
    color: '#94a3b8',
  },
});
