import { Router } from 'express';
import FeedController from '../controllers/FeedController.js';

const router = new Router();

router.get('/global', FeedController.globalFeed);

router.get('/groups/:user_id', FeedController.groupFeed);

router.get('/:user_id', FeedController.userFeed);

export default router;
