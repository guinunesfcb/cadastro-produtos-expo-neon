import { getPool } from '../config/db';
import { AppError } from '../middlewares/errorHandler';
import { Produto } from '../types/produto';

export function parsePreco(rawPreco: unknown): number | null {
  if (rawPreco === null || rawPreco === undefined || rawPreco === '') {
    return null;
  }

  let num: number;

  if (typeof rawPreco === 'number') {
    num = rawPreco;
  } else if (typeof rawPreco === 'string') {
    let str = rawPreco.trim();
    if (!str) return null;

    // Trata formatos: "1.250,90" (BR) ou "1,250.90" (US) ou "1250,90" ou "1250.90"
    if (str.includes(',') && str.includes('.')) {
      if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
        // Formato brasileiro: 1.250,90 -> 1250.90
        str = str.replace(/\./g, '').replace(',', '.');
      } else {
        // Formato americano: 1,250.90 -> 1250.90
        str = str.replace(/,/g, '');
      }
    } else if (str.includes(',')) {
      // Formato com virgula decimal: 1250,90 -> 1250.90
      str = str.replace(',', '.');
    }

    num = parseFloat(str);
  } else {
    return null;
  }

  if (isNaN(num) || !isFinite(num) || num <= 0) {
    return null;
  }

  // Arredonda para 2 casas decimais
  return Math.round(num * 100) / 100;
}

export class ProdutoService {
  async listarTodos(): Promise<Produto[]> {
    const pool = getPool();
    // Consulta parametrizada com ordenacao decrescente por ID
    const query = `
      SELECT 
        id, 
        nome, 
        CAST(preco AS FLOAT) as preco 
      FROM produtos 
      ORDER BY id DESC;
    `;
    const result = await pool.query(query);
    return result.rows.map((row) => ({
      id: Number(row.id),
      nome: String(row.nome),
      preco: Number(row.preco),
    }));
  }

  async cadastrar(nomeRaw: unknown, precoRaw: unknown): Promise<Produto> {
    if (typeof nomeRaw !== 'string') {
      throw new AppError('O campo "nome" e obrigatorio e deve ser um texto.', 400);
    }

    const nome = nomeRaw.trim();
    if (!nome) {
      throw new AppError('O campo "nome" nao pode ser vazio ou conter apenas espacos.', 400);
    }

    if (nome.length > 255) {
      throw new AppError('O campo "nome" deve ter no maximo 255 caracteres.', 400);
    }

    const preco = parsePreco(precoRaw);
    if (preco === null) {
      throw new AppError(
        'O campo "preco" e obrigatorio, deve ser um valor numerico valido e maior que zero.',
        400
      );
    }

    const pool = getPool();
    const query = `
      INSERT INTO produtos (nome, preco) 
      VALUES ($1, $2) 
      RETURNING id, nome, CAST(preco AS FLOAT) as preco;
    `;
    const result = await pool.query(query, [nome, preco]);
    const row = result.rows[0];

    return {
      id: Number(row.id),
      nome: String(row.nome),
      preco: Number(row.preco),
    };
  }

  async excluir(idRaw: unknown): Promise<{ id: number }> {
    const id = Number(idRaw);
    if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
      throw new AppError('ID do produto invalido.', 400);
    }

    const pool = getPool();
    const query = 'DELETE FROM produtos WHERE id = $1 RETURNING id;';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      throw new AppError(`Produto com ID ${id} nao foi encontrado.`, 404);
    }

    return { id };
  }
}

export const produtoService = new ProdutoService();
