/**
 * Formata um valor numerico para o padrao de moeda brasileira (BRL): R$ 1.250,90
 */
export function formatarMoeda(valor: number): string {
  if (typeof valor !== 'number' || isNaN(valor)) {
    return 'R$ 0,00';
  }

  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  } catch {
    // Fallback manual caso o motor JS nao possua a locale pt-BR carregada
    const partes = valor.toFixed(2).split('.');
    const inteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `R$ ${inteira},${partes[1]}`;
  }
}
