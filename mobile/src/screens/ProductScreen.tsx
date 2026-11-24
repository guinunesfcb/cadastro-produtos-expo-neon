import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '../navigation/AppNavigator';
import { useProducts } from '../hooks/useProducts';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import {
  validateProductName,
  normalizePrice,
  showAlert,
} from '../utils/formatCurrency';

export const ProductScreen: React.FC = () => {
  const { goBack, navigate } = useNavigation();
  const { addProduct, saving } = useProducts();

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [erroNome, setErroNome] = useState<string | null>(null);
  const [erroPreco, setErroPreco] = useState<string | null>(null);

  const handleSalvar = async () => {
    setErroNome(null);
    setErroPreco(null);

    // 1. Valida nome
    const resNome = validateProductName(nome);
    if (!resNome.valido || !resNome.nomeFormatado) {
      setErroNome(resNome.erro || 'Nome invalido');
      showAlert('Atencao', resNome.erro || 'Informe o nome do produto.');
      return;
    }

    // 2. Valida e normaliza preco (aceita virgula ou ponto)
    const precoNormalizado = normalizePrice(preco);
    if (precoNormalizado === null) {
      const msg = 'Informe um preco valido maior que zero (ex: 29,90 ou 1250.50).';
      setErroPreco(msg);
      showAlert('Atencao', msg);
      return;
    }

    // 3. Salva no banco via API
    try {
      await addProduct(resNome.nomeFormatado, precoNormalizado);
      showAlert(
        'Sucesso',
        `Produto "${resNome.nomeFormatado}" cadastrado com sucesso!`
      );
      setNome('');
      setPreco('');
      navigate('Home');
    } catch (err: any) {
      showAlert('Erro ao Salvar', err.message || 'Falha ao salvar produto.');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Novo Produto"
        subtitle="Cadastrar item no Neon Serverless"
        showBack
        onBack={goBack}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.titulo}>Informações do Produto</Text>

          <Input
            label="Nome do Produto *"
            placeholder="Ex: Mouse sem fio"
            value={nome}
            onChangeText={(txt) => {
              setNome(txt);
              if (erroNome) setErroNome(null);
            }}
            error={erroNome}
            editable={!saving}
          />

          <Input
            label="Preço em Reais (R$) *"
            placeholder="Ex: 89,90 ou 1500.00"
            value={preco}
            onChangeText={(txt) => {
              setPreco(txt);
              if (erroPreco) setErroPreco(null);
            }}
            keyboardType="numeric"
            error={erroPreco}
            helperText="Aceita virgula ou ponto como separador decimal"
            editable={!saving}
          />

          <Button
            title="Salvar Produto no Banco"
            onPress={handleSalvar}
            loading={saving}
            style={styles.botaoSalvar}
          />

          <Button
            title="Cancelar e Voltar"
            onPress={goBack}
            variant="outline"
            disabled={saving}
            style={styles.botaoCancelar}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    padding: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  botaoSalvar: {
    marginTop: 10,
    marginBottom: 8,
  },
  botaoCancelar: {
    marginTop: 4,
  },
});
