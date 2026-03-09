import { Router } from 'express';
import GroupController from '../controllers/GroupController.js';

const router = new Router();

router.post('/', GroupController.store);

router.get('/', GroupController.index);

router.get('/users/:user_id/groups', GroupController.groupsByUser);

router.get('/:id', GroupController.show);


router.put('/:id', GroupController.update);

router.delete('/:id', GroupController.delete);

export default router;
