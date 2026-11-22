import { Router } from 'express';
import { produtoController } from '../controllers/produtoController';

const router = Router();

// GET /produtos - Lista todos os produtos (ordenados por ID decrescente)
router.get('/', (req, res, next) => produtoController.listar(req, res, next));

// POST /produtos - Valida e cadastra um novo produto
router.post('/', (req, res, next) => produtoController.cadastrar(req, res, next));

// DELETE /produtos/:id - Exclui o produto pelo ID informado
router.delete('/:id', (req, res, next) => produtoController.excluir(req, res, next));

export default router;
