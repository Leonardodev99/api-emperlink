import { Router } from 'express';
import FollowController from '../controllers/FollowController.js';

const router = new Router();

router.post('/', FollowController.follow);
router.delete('/', FollowController.unfollow);

router.get('/users/:user_id/followers', FollowController.followers);

router.get('/users/:user_id/following', FollowController.following);

router.get('/check/:follower_id/:following_id', FollowController.checkFollow);

export default router;
