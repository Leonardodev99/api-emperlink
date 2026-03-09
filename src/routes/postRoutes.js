import { Router } from 'express';
import PostController from '../controllers/PostController.js';

const router = new Router();

router.post('/', PostController.store);
router.get('/', PostController.index);
router.get('/:id', PostController.show);
router.get('/user/:user_id', PostController.postsByUser);
router.put('/:id', PostController.update);
router.delete('/:id', PostController.delete);

export default router;
