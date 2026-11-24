import { Alert, Platform } from 'react-native';

/**
 * Formata um valor numerico para o padrao de moeda brasileira (BRL): R$ 1.250,90
 */
export function formatCurrency(valor: number): string {
  if (typeof valor !== 'number' || isNaN(valor)) {
    return 'R$ 0,00';
  }

  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  } catch {
    // Fallback manual caso a localidade pt-BR nao esteja ativa
    const partes = valor.toFixed(2).split('.');
    const inteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `R$ ${inteira},${partes[1]}`;
  }
}

// Alias em portugues
export const formatarMoeda = formatCurrency;

/**
 * Normaliza e valida a string de preco informada pelo usuario.
 * Aceita formatos com virgula ou ponto (ex: "1.250,90", "1250,90", "1250.90", "15").
 * Retorna o numero decimal com 2 casas arredondadas ou null se invalido/negativo/zero.
 */
export function normalizePrice(precoStr: string): number | null {
  if (!precoStr || typeof precoStr !== 'string') {
    return null;
  }

  let str = precoStr.trim();
  if (!str) {
    return null;
  }

  // Trata separadores de milhar e decimal
  if (str.includes(',') && str.includes('.')) {
    if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
      // 1.250,90 -> 1250.90
      str = str.replace(/\./g, '').replace(',', '.');
    } else {
      // 1,250.90 -> 1250.90
      str = str.replace(/,/g, '');
    }
  } else if (str.includes(',')) {
    // 1250,90 -> 1250.90
    str = str.replace(',', '.');
  }

  const num = parseFloat(str);

  if (isNaN(num) || !isFinite(num) || num <= 0) {
    return null;
  }

  return Math.round(num * 100) / 100;
}

export const normalizarPreco = normalizePrice;

/**
 * Valida o nome do produto
 */
export function validateProductName(nome: string): {
  valido: boolean;
  erro?: string;
  nomeFormatado?: string;
} {
  if (!nome || typeof nome !== 'string') {
    return { valido: false, erro: 'O nome do produto e obrigatorio.' };
  }

  const trimmed = nome.trim();
  if (trimmed.length === 0) {
    return { valido: false, erro: 'O nome do produto nao pode ser vazio.' };
  }

  if (trimmed.length < 2) {
    return { valido: false, erro: 'O nome do produto deve ter no minimo 2 caracteres.' };
  }

  return { valido: true, nomeFormatado: trimmed };
}

export const validarNome = validateProductName;

/**
 * Exibe alertas compativeis com mobile e web
 */
export function showAlert(titulo: string, mensagem?: string): void {
  const textoCompleto = mensagem ? `${titulo}\n\n${mensagem}` : titulo;

  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(textoCompleto);
    } else {
      console.log(`[ALERTA] ${textoCompleto}`);
    }
  } else {
    Alert.alert(titulo, mensagem);
  }
}

export const exibirAlerta = showAlert;

/**
 * Exibe confirmacao compativel com mobile e web
 */
export function showConfirm(
  titulo: string,
  mensagem: string,
  onConfirmar: () => void,
  textoBotaoConfirmar = 'Excluir'
): void {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm) {
      const confirmou = window.confirm(`${titulo}\n\n${mensagem}`);
      if (confirmou) {
        onConfirmar();
      }
    } else {
      onConfirmar();
    }
  } else {
    Alert.alert(titulo, mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: textoBotaoConfirmar,
        style: 'destructive',
        onPress: onConfirmar,
      },
    ]);
  }
}

export const exibirConfirmacao = showConfirm;
