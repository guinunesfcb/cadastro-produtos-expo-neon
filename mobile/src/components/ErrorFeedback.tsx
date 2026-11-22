import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

interface ErrorFeedbackProps {
  mensagem: string;
  onRetry?: () => void;
  carregando?: boolean;
}

export const ErrorFeedback: React.FC<ErrorFeedbackProps> = ({
  mensagem,
  onRetry,
  carregando = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.mensagem}>{mensagem}</Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          disabled={carregando}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Tentar carregar produtos novamente"
        >
          {carregando ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.retryText}>Tentar novamente</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
    marginBottom: 6,
  },
  mensagem: {
    fontSize: 14,
    color: '#b91c1c',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
