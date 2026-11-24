import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { showAlert } from '../utils/formatCurrency';

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('guinunesfcb@gmail.com');
  const [password, setPassword] = useState('123456');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleLogin = async () => {
    setErro(null);
    if (!email.trim()) {
      setErro('Informe o seu e-mail.');
      return;
    }

    setCarregando(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setErro(err.message || 'Falha ao realizar login.');
      showAlert('Erro', err.message || 'Falha ao autenticar.');
    } finally {
      setCarregando(false);
    }
  };

  const handleConvidado = async () => {
    setCarregando(true);
    try {
      await login('convidado@demo.com', '123456');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Catálogo de Produtos"
        subtitle="Acesse sua conta para gerenciar o estoque"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.titulo}>Identificação</Text>
          <Text style={styles.descricao}>
            Digite suas credenciais para acessar os produtos no Neon Serverless.
          </Text>

          <Input
            label="E-mail *"
            placeholder="seu.email@exemplo.com"
            value={email}
            onChangeText={(txt) => {
              setEmail(txt);
              if (erro) setErro(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={erro}
          />

          <Input
            label="Senha *"
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title="Entrar na Aplicação"
            onPress={handleLogin}
            loading={carregando}
            style={styles.botaoLogin}
          />

          <Button
            title="Entrar como Convidado"
            onPress={handleConvidado}
            variant="outline"
            disabled={carregando}
            style={styles.botaoConvidado}
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
    paddingTop: 24,
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
    marginBottom: 6,
  },
  descricao: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 18,
  },
  botaoLogin: {
    marginTop: 6,
    marginBottom: 10,
  },
  botaoConvidado: {
    marginTop: 2,
  },
});
