import { app } from './app';
import { env, validateEnv } from './config/env';

validateEnv();

const server = app.listen(env.PORT, '0.0.0.0', () => {
  console.log(`[API] Servidor backend rodando na porta ${env.PORT}`);
  console.log(`[API] Disponivel em: http://localhost:${env.PORT}`);
  console.log(`[API] Healthcheck: http://localhost:${env.PORT}/health`);
});

process.on('SIGTERM', () => {
  console.log('[API] Encerrando servidor HTTP...');
  server.close(() => {
    console.log('[API] Servidor encerrado.');
  });
});
