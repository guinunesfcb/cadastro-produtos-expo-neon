import { getPool } from '../config/db';
import { env } from '../config/env';

async function initDb(): Promise<void> {
  console.log('[INIT_DB] Verificando conexao com o banco de dados Neon...');

  if (!env.DATABASE_URL) {
    console.error(
      '[ERRO] DATABASE_URL nao informada! Preencha a variavel no arquivo .env antes de executar este script.'
    );
    process.exit(1);
  }

  const pool = getPool();

  try {
    // 1. Testa conexao
    const testResult = await pool.query('SELECT NOW() as current_time, current_database() as db_name;');
    console.log(
      `[INIT_DB] Conectado com sucesso ao banco "${testResult.rows[0].db_name}" em ${testResult.rows[0].current_time}`
    );

    // 2. Verifica se a tabela 'produtos' ja existe
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'produtos'
      ) as table_exists;
    `;
    const checkResult = await pool.query(checkTableQuery);
    const tableExists = checkResult.rows[0]?.table_exists;

    if (tableExists) {
      console.log('[INIT_DB] A tabela "produtos" ja existe no banco de dados. Nenhuma alteracao destrutiva foi feita.');
    } else {
      console.log('[INIT_DB] Tabela "produtos" nao encontrada. Criando tabela...');
      
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS produtos (
          id SERIAL PRIMARY KEY,
          nome TEXT NOT NULL,
          preco NUMERIC(10,2) NOT NULL
        );
      `;
      await pool.query(createTableQuery);
      console.log('[INIT_DB] Tabela "produtos" criada com sucesso no Neon PostgreSQL!');
    }

    // 3. Valida colunas da tabela
    const columnsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'produtos'
      ORDER BY ordinal_position;
    `);

    console.log('[INIT_DB] Estrutura da tabela "produtos":');
    columnsResult.rows.forEach((col) => {
      console.log(` - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    console.log('[INIT_DB] Processo concluido com exito.');
  } catch (error) {
    console.error('[INIT_DB] Erro ao conectar ou inicializar tabela:', (error as Error).message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDb();
