import { Router } from 'express';
import ReportController from '../controllers/ReportController.js';

// 💡 Importa o middleware de autenticação
import authMiddleware from '../middlewares/authMiddleware.js';

const router = new Router();

// 🔒 Aplica o middleware para injetar o req.userId antes de chamar o store
router.post('/', authMiddleware, ReportController.store);

// Se as outras rotas forem apenas para Administradores, também deves protegê-las:
router.get('/', authMiddleware, ReportController.index);
router.get('/:id', authMiddleware, ReportController.show);
router.put('/:id/status', authMiddleware, ReportController.updateStatus);
router.delete('/:id', authMiddleware, ReportController.delete);

export default router;
