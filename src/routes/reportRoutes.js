import { Router } from 'express';
import ReportController from '../controllers/ReportController.js';

const router = new Router();

router.post('/', ReportController.store);

router.get('/', ReportController.index);

router.get('/:id', ReportController.show);

router.put('/:id/status', ReportController.updateStatus);

router.delete('/:id', ReportController.delete);

export default router;
