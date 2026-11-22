import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Erros conhecidos do PostgreSQL (ex: tabela inexistente, erro de sintaxe)
  console.error('[ERRO_INTERNO]', err.message);

  // Nunca retornar senhas, tokens ou connection strings no erro
  res.status(500).json({
    success: false,
    error: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.',
  });
}
