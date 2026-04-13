import { Router } from 'express';
import FollowController from '../controllers/FollowController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = new Router();

// 🔐 proteger tudo
router.use(authMiddleware);

// 📌 Seguir
router.post('/', FollowController.follow);

// 📌 Deixar de seguir
router.delete('/', FollowController.unfollow);

// 📌 Meus seguidores
router.get('/followers', FollowController.followers);

// 📌 Quem eu sigo
router.get('/following', FollowController.following);

// 📌 Verificar se sigo alguém
router.get('/check/:following_id', FollowController.checkFollow);

export default router;
