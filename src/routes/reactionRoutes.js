import { Router } from 'express';
import ReactionController from '../controllers/ReactionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = new Router();

// 🔐 tudo protegido
router.use(authMiddleware);

// ✅ Criar/atualizar reação
router.post('/', ReactionController.store);

// ✅ Contar reações por tipo
router.get('/:post_id/count', ReactionController.countByType);

// ✅ Listar reações de um post
router.get('/:post_id', ReactionController.reactionsByPost);

// ✅ Remover reação
router.delete('/:id', ReactionController.delete);

export default router;
