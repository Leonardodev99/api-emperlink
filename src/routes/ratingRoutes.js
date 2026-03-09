import { Router } from 'express';
import RatingController from '../controllers/RatingController.js';

const router = new Router();

router.post('/', RatingController.store);

router.get('/users/:user_id/ratings', RatingController.index);

router.get('/users/:user_id/ratings/average', RatingController.average);

router.put('/:id', RatingController.update);

router.delete('/:id', RatingController.delete);

export default router;
