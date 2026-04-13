import { Router } from 'express';
import GroupController from '../controllers/GroupController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = new Router();

// 🔐 tudo protegido
router.use(authMiddleware);

// 📌 Criar grupo
router.post('/', GroupController.store);

// 📌 Listar todos
router.get('/', GroupController.index);

// 📌 Meus grupos
router.get('/me', GroupController.myGroups);

// 📌 Buscar por ID
router.get('/:id', GroupController.show);

// 📌 Atualizar (somente dono)
router.put('/:id', GroupController.update);

// 📌 Remover (somente dono)
router.delete('/:id', GroupController.delete);

export default router;
