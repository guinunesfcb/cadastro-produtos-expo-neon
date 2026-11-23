import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { normalizarPreco, validarNome } from '../utils/validators';
import { exibirAlerta } from '../utils/alerts';

interface ProdutoFormProps {
  onSalvar: (nome: string, preco: number) => Promise<void>;
  carregando: boolean;
}

export const ProdutoForm: React.FC<ProdutoFormProps> = ({ onSalvar, carregando }) => {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);

  const handleSalvar = async () => {
    setErroValidacao(null);

    // 1. Valida nome
    const resNome = validarNome(nome);
    if (!resNome.valido || !resNome.nomeFormatado) {
      setErroValidacao(resNome.erro || 'Nome invalido');
      exibirAlerta('Atencao', resNome.erro || 'Por favor, informe o nome do produto.');
      return;
    }

    // 2. Valida e normaliza preco (aceita virgula ou ponto)
    const precoNormalizado = normalizarPreco(preco);
    if (precoNormalizado === null) {
      const msg = 'Informe um preco valido maior que zero (ex: 29,90 ou 1250.50).';
      setErroValidacao(msg);
      exibirAlerta('Atencao', msg);
      return;
    }

    // 3. Envia dados para a API
    try {
      await onSalvar(resNome.nomeFormatado, precoNormalizado);
      // 5. Limpa campos apos sucesso
      setNome('');
      setPreco('');
      setErroValidacao(null);
    } catch (err: any) {
      // 7. Apresenta erro caso ocorra falha
      exibirAlerta('Erro ao Salvar', err.message || 'Falha ao salvar produto.');
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>Novo Produto</Text>

      {erroValidacao && (
        <View style={styles.alertaErro}>
          <Text style={styles.textoAlertaErro}>{erroValidacao}</Text>
        </View>
      )}

      <View style={styles.campo}>
        <Text style={styles.label}>Nome do Produto *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Mouse sem fio"
          placeholderTextColor="#94a3b8"
          value={nome}
          onChangeText={(texto) => {
            setNome(texto);
            if (erroValidacao) setErroValidacao(null);
          }}
          editable={!carregando}
          autoCapitalize="sentences"
          accessibilityLabel="Nome do produto"
          accessibilityHint="Digite o nome do produto"
        />
      </View>

      <View style={styles.campo}>
        <Text style={styles.label}>Preço (R$) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 89,90 ou 1500.00"
          placeholderTextColor="#94a3b8"
          value={preco}
          onChangeText={(texto) => {
            setPreco(texto);
            if (erroValidacao) setErroValidacao(null);
          }}
          keyboardType="numeric"
          editable={!carregando}
          accessibilityLabel="Preco do produto em reais"
          accessibilityHint="Digite o preco do produto usando virgula ou ponto"
        />
      </View>

      <TouchableOpacity
        style={[styles.botaoSalvar, carregando && styles.botaoDesabilitado]}
        onPress={handleSalvar}
        disabled={carregando}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Salvar produto"
        accessibilityState={{ busy: carregando }}
      >
        {carregando ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.textoBotaoSalvar}>Salvar Produto</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  titulo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 14,
  },
  campo: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    minHeight: 46,
  },
  alertaErro: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  textoAlertaErro: {
    fontSize: 13,
    color: '#991b1b',
    fontWeight: '500',
  },
  botaoSalvar: {
    backgroundColor: '#0284c7',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: 4,
  },
  botaoDesabilitado: {
    backgroundColor: '#94a3b8',
  },
  textoBotaoSalvar: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
