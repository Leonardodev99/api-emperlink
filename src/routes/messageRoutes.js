import { Router } from 'express';
import MessageController from '../controllers/MessageController.js';

const router = new Router();

router.post('/', MessageController.store);

router.get('/conversation/:user1/:user2', MessageController.conversation);

router.get('/inbox/:user_id', MessageController.inbox);

router.put('/read/:id', MessageController.markAsRead);

router.delete('/:id', MessageController.delete);

export default router;
