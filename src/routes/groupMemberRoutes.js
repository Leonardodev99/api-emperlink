import { Router } from 'express';
import GroupMemberController from '../controllers/GroupMemberController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = new Router();

// 🔐 tudo protegido
router.use(authMiddleware);

// 📌 Entrar
router.post('/:group_id/join', GroupMemberController.join);

// 📌 Sair
router.delete('/:group_id/leave', GroupMemberController.leave);

// 📌 Listar membros
router.get('/:group_id/members', GroupMemberController.members);

// 📌 Promover
router.put('/:group_id/promote', GroupMemberController.promote);

export default router;
