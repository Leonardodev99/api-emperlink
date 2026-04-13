import { Router } from 'express';
import RatingController from '../controllers/RatingController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = new Router();

// 🔐 TODAS PROTEGIDAS
router.use(authMiddleware);

// ⭐ Criar avaliação
router.post('/', RatingController.store);

// 📊 Listar avaliações
router.get('/users/:user_id/ratings', RatingController.index);

// ⭐ Média
router.get('/users/:user_id/ratings/average', RatingController.average);

// ✏️ Atualizar
router.put('/:id', RatingController.update);

// 🗑 Remover
router.delete('/:id', RatingController.delete);

export default router;
