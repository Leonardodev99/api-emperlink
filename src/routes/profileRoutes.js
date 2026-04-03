import { Router } from 'express';
import ProfileController from '../controllers/ProfileController.js';
import upload from '../middlewares/upload';

const router = new Router();

router.post('/', ProfileController.store);
router.post('/avatar/:id', upload.single('file'), ProfileController.uploadAvatar);
router.get('/', ProfileController.index);
router.get('/user/:user_id', ProfileController.showByUser);
router.get('/:id', ProfileController.show);

router.put('/:id', ProfileController.update);
router.delete('/:id', ProfileController.delete);

export default router;
