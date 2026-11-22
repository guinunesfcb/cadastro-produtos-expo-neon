import express from 'express';
import cors from 'cors';
import produtoRoutes from './routes/produtoRoutes';
import { errorHandler } from './middlewares/errorHandler';

export const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json());

// Rota de status/healthcheck
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API de Produtos operacional',
    timestamp: new Date().toISOString(),
  });
});

// Rotas de produtos
app.use('/produtos', produtoRoutes);

// Middleware centralizado de tratamento de erros
app.use(errorHandler);
