import { Router } from 'express';
import NotificationController from '../controllers/NotificationController.js';

const router = new Router();

router.post('/', NotificationController.store);

router.get('/:user_id', NotificationController.index);

router.put('/read/:id', NotificationController.markAsRead);

router.put('/read-all/:user_id', NotificationController.markAllAsRead);

router.delete('/:id', NotificationController.delete);

export default router;
