import { Router } from 'express';
import CommentController from '../controllers/CommentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = new Router();

// 🔐 TODAS rotas protegidas
router.use(authMiddleware);

// 📌 Criar comentário
router.post('/', CommentController.store);

// 📌 Listar comentários de um post
router.get('/post/:post_id', CommentController.commentsByPost);

// 📌 Buscar comentário por ID
router.get('/:id', CommentController.show);

// 📌 Atualizar comentário
router.put('/:id', CommentController.update);

// 📌 Remover comentário
router.delete('/:id', CommentController.delete);

export default router;
