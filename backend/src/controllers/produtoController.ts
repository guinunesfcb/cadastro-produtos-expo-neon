import { Request, Response, NextFunction } from 'express';
import { produtoService } from '../services/produtoService';

export class ProdutoController {
  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const produtos = await produtoService.listarTodos();
      res.status(200).json({
        success: true,
        data: produtos,
      });
    } catch (error) {
      next(error);
    }
  }

  async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { nome, preco } = req.body;
      const novoProduto = await produtoService.cadastrar(nome, preco);
      res.status(201).json({
        success: true,
        message: 'Produto cadastrado com sucesso!',
        data: novoProduto,
      });
    } catch (error) {
      next(error);
    }
  }

  async excluir(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { id: deletedId } = await produtoService.excluir(id);
      res.status(200).json({
        success: true,
        message: 'Produto excluido com sucesso!',
        data: { id: deletedId },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const produtoController = new ProdutoController();
