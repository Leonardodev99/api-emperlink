import { Router } from 'express';
import MessageController from '../controllers/MessageController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = new Router();

// 🔐 tudo protegido
router.use(authMiddleware);

// 📩 Enviar mensagem
router.post('/', MessageController.store);

// 💬 Conversa (user autenticado + outro)
router.get('/conversation/:user2', MessageController.conversation);

// 📥 Inbox
router.get('/inbox', MessageController.inbox);

// ✔ Marcar como lida
router.put('/read/:id', MessageController.markAsRead);

// ❌ Apagar
router.delete('/:id', MessageController.delete);

export default router;
