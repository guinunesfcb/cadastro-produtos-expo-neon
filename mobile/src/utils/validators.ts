/**
 * Normaliza e valida a string de preco informada pelo usuario.
 * Aceita formatos com virgula ou ponto (ex: "1.250,90", "1250,90", "1250.90", "15").
 * Retorna o numero decimal com 2 casas arredondadas ou null se invalido/negativo/zero.
 */
export function normalizarPreco(precoStr: string): number | null {
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

export function validarNome(nome: string): { valido: boolean; erro?: string; nomeFormatado?: string } {
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
