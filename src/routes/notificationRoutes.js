import { Router } from 'express';
import NotificationController from '../controllers/NotificationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = new Router();

// 🔐 tudo protegido
router.use(authMiddleware);

// 🔔 Minhas notificações
router.get('/', NotificationController.index);

// ✔ Marcar uma como lida
router.put('/read/:id', NotificationController.markAsRead);

// ✔ Marcar todas
router.put('/read-all', NotificationController.markAllAsRead);

// ❌ Remover
router.delete('/:id', NotificationController.delete);

export default router;
