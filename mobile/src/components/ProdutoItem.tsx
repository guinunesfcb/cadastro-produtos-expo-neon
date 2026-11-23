import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Produto } from '../types/produto';
import { formatarMoeda } from '../utils/currency';
import { exibirAlerta, exibirConfirmacao } from '../utils/alerts';

interface ProdutoItemProps {
  produto: Produto;
  onExcluir: (id: number) => Promise<void>;
  excluindo: boolean;
}

export const ProdutoItem: React.FC<ProdutoItemProps> = ({
  produto,
  onExcluir,
  excluindo,
}) => {
  const handleConfirmarExclusao = () => {
    exibirConfirmacao(
      'Confirmar Exclusao',
      `Deseja realmente excluir o produto "${produto.nome}"?`,
      async () => {
        try {
          await onExcluir(produto.id);
        } catch (error: any) {
          exibirAlerta('Erro', error.message || 'Falha ao excluir produto.');
        }
      },
      'Excluir'
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.nome} numberOfLines={2}>
          {produto.nome}
        </Text>
        <Text style={styles.preco}>{formatarMoeda(produto.preco)}</Text>
      </View>

      <TouchableOpacity
        style={[styles.botaoExcluir, excluindo && styles.botaoDesabilitado]}
        onPress={handleConfirmarExclusao}
        disabled={excluindo}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel={`Excluir produto ${produto.nome}`}
        accessibilityHint="Toque para remover este produto permanentemente"
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

const styles = StyleSheet.create({
  card: {
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
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  preco: {
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
});
