import { Pool } from 'pg';
import { env } from './env';

let poolInstance: Pool | null = null;

export function getPool(): Pool {
  if (!poolInstance) {
    if (!env.DATABASE_URL) {
      throw new Error(
        'DATABASE_URL nao configurada. Defina a variavel no arquivo .env do backend.'
      );
    }

    const isLocal = env.DATABASE_URL.includes('localhost') || env.DATABASE_URL.includes('127.0.0.1');

    poolInstance = new Pool({
      connectionString: env.DATABASE_URL,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    poolInstance.on('error', (err) => {
      console.error('[DATABASE_ERROR] Erro inesperado no pool de conexoes:', err.message);
    });
  }

  return poolInstance;
}
