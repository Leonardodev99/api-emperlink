import { Router } from 'express';
import ProfileController from '../controllers/ProfileController.js';

const router = new Router();

router.post('/', ProfileController.store);
router.get('/', ProfileController.index);
router.get('/:id', ProfileController.show);
router.get('/user/:user_id', ProfileController.showByUser);
router.put('/:id', ProfileController.update);
router.delete('/:id', ProfileController.delete);

export default router;
