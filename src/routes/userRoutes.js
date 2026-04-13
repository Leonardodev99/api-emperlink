import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import upload from '../middlewares/upload.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = Router();

// 🔓 ROTAS PÚBLICAS
router.post('/', UserController.store);

// 🔐 ROTAS PROTEGIDAS
router.use(authMiddleware);

// 📸 Upload de imagem
router.post('/profile-image', upload.single('file'), UserController.uploadProfileImage);

// 👤 Listar usuários (apenas company)
router.get('/', roleMiddleware('company'), UserController.index);

// 🔍 Ver perfil
router.get('/:id', UserController.show);

// ✏️ Atualizar (apenas dono ou company)
router.put('/:id', UserController.update);

// ❌ Deletar (apenas company)
router.delete('/:id', roleMiddleware('company'), UserController.delete);

export default router;
