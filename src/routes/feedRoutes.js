import { Router } from 'express';
import FeedController from '../controllers/FeedController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = new Router();

// 🔐 proteger tudo
router.use(authMiddleware);

// 🌍 Feed global
router.get('/global', FeedController.globalFeed);

// 👥 Feed de grupos
router.get('/groups', FeedController.groupFeed);

// 📢 Feed personalizado
router.get('/user', FeedController.userFeed);

export default router;
