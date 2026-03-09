import { Router } from 'express';
import FeedController from '../controllers/FeedController.js';

const router = new Router();

router.get('/:user_id', FeedController.userFeed);

router.get('global', FeedController.globalFeed);

router.get('/groups/:user_id', FeedController.groupFeed);

export default router;
