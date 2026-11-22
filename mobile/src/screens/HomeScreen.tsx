import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Header } from '../components/Header';
import { ProdutoForm } from '../components/ProdutoForm';
import { ProdutoItem } from '../components/ProdutoItem';
import { EmptyList } from '../components/EmptyList';
import { ErrorFeedback } from '../components/ErrorFeedback';
import { fetchProdutos, criarProduto, deletarProduto } from '../services/api';
import { Produto } from '../types/produto';
import { getApiBaseUrl } from '../config/apiConfig';

export const HomeScreen: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [atualizando, setAtualizando] = useState<boolean>(false);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [excluindoIds, setExcluindoIds] = useState<number[]>([]);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);

  // Carrega a lista de produtos da API
  const carregarProdutos = useCallback(async (isPullToRefresh = false) => {
    if (isPullToRefresh) {
      setAtualizando(true);
    } else {
      setCarregando(true);
    }
    setErroCarregamento(null);

    try {
      const lista = await fetchProdutos();
      setProdutos(lista);
    } catch (err: any) {
      setErroCarregamento(err.message || 'Erro ao carregar produtos do servidor.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  // Handler para salvar novo produto
  const handleSalvarProduto = async (nome: string, preco: number) => {
    setSalvando(true);
    try {
      const novoProduto = await criarProduto(nome, preco);
      // Atualiza a lista imediatamente colocando o mais recente no topo
      setProdutos((atuais) => [novoProduto, ...atuais.filter((p) => p.id !== novoProduto.id)]);
      Alert.alert('Sucesso', `Produto "${novoProduto.nome}" cadastrado com sucesso!`);
    } finally {
      setSalvando(false);
    }
  };

  // Handler para excluir produto
  const handleExcluirProduto = async (id: number) => {
    // Evita multiplos cliques adicionando o ID a lista de exclusao ativa
    setExcluindoIds((atuais) => [...atuais, id]);
    try {
      await deletarProduto(id);
      // Atualiza imediatamente a lista removendo o item
      setProdutos((atuais) => atuais.filter((p) => p.id !== id));
      Alert.alert('Sucesso', 'Produto removido com sucesso.');
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Nao foi possivel excluir o produto.');
    } finally {
      setExcluindoIds((atuais) => atuais.filter((item) => item !== id));
    }
  };

  // Cabecalho da lista (Header + Formulario + Titulo da secao)
  const renderHeader = () => (
    <View>
      <Header />
      <ProdutoForm onSalvar={handleSalvarProduto} carregando={salvando} />

      {erroCarregamento && (
        <ErrorFeedback
          mensagem={erroCarregamento}
          onRetry={() => carregarProdutos()}
          carregando={carregando}
        />
      )}

      <View style={styles.secaoTituloContainer}>
        <Text style={styles.secaoTitulo}>Produtos Cadastrados</Text>
        <Text style={styles.contadorBadge}>
          {produtos.length} {produtos.length === 1 ? 'item' : 'itens'}
        </Text>
      </View>
    </View>
  );

  // Rodape da lista com informacoes de conexao da API
  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <Text style={styles.footerTexto}>
        Conectado a: {getApiBaseUrl()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {carregando && produtos.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Header />
          <View style={styles.centroLoading}>
            <ActivityIndicator size="large" color="#0284c7" />
            <Text style={styles.loadingTexto}>Carregando produtos...</Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProdutoItem
              produto={item}
              onExcluir={handleExcluirProduto}
              excluindo={excluindoIds.includes(item.id)}
            />
          )}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={!erroCarregamento ? <EmptyList /> : null}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => carregarProdutos(true)}
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
  secaoTituloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginTop: 18,
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
