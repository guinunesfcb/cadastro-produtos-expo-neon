import { Alert, Platform } from 'react-native';

/**
 * Exibe uma mensagem amigavel ao usuario, compativel tanto com dispositivos moveis
 * (Alert nativo) quanto com navegadores Web (window.alert).
 */
export function exibirAlerta(titulo: string, mensagem?: string): void {
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

/**
 * Exibe uma caixa de dialogo de confirmacao compativel com Mobile e Web.
 */
export function exibirConfirmacao(
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
