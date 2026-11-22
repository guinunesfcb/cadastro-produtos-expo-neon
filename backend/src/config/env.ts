import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  DATABASE_URL: process.env.DATABASE_URL || '',
};

export function validateEnv(): void {
  if (!env.DATABASE_URL) {
    console.warn(
      '[AVISO] DATABASE_URL nao foi definida no arquivo .env. Configure a string de conexao do Neon para conectar ao banco.'
    );
  }
}
