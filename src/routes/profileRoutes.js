import { Router } from 'express';
import ProfileController from '../controllers/ProfileController.js';
import upload from '../middlewares/upload.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = new Router();

// 🔐 TODAS PROTEGIDAS
router.use(authMiddleware);

// 📌 Criar perfil
router.post('/', ProfileController.store);

// 📸 Avatar (não precisa ID)
router.post('/avatar', upload.single('file'), ProfileController.uploadAvatar);

// 📌 Listar
router.get('/', ProfileController.index);

// 🔍 Perfil por utilizador
router.get('/user/:user_id', ProfileController.showByUser);

// 🔍 Perfil por ID
router.get('/:id', ProfileController.show);

// ✏️ Atualizar
router.put('/:id', ProfileController.update);

// ❌ Remover
router.delete('/:id', ProfileController.delete);

export default router;
