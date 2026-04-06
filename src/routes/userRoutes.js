import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import upload from '../middlewares/upload.js';

const router = Router();

router.post('/', UserController.store);
router.post('/profile-image', upload.single('file'), UserController.uploadProfileImage);
router.get('/', UserController.index);
router.get('/:id', UserController.show);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);


export default router;
