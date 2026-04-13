import { Router } from 'express';
import PostController from '../controllers/PostController.js';
import CommentController from '../controllers/CommentController.js';
import upload from '../middlewares/upload.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = new Router();

// 🔐 TODAS PROTEGIDAS
router.use(authMiddleware);

// 📌 Criar post
router.post('/', upload.array('images', 5), PostController.store);

// 📌 Listar
router.get('/', PostController.index);

// 🔍 Hashtags
router.get('/hashtag/:name', PostController.postsByHashtag);

// 👤 Posts do usuário
router.get('/user/:user_id', PostController.postsByUser);

// 💬 Comentários do post
router.get('/:post_id/comments', CommentController.commentsByPost);

// 🔍 Buscar post
router.get('/:id', PostController.show);

// ✏️ Atualizar
router.put('/:id', PostController.update);

// ❌ Remover
router.delete('/:id', PostController.delete);

export default router;
