import { Router } from 'express';
import ReactionController from '../controllers/ReactionController.js';

const router = new Router();

router.post('/', ReactionController.store);
router.get('/:post_id/reactions', ReactionController.reactionsByPost);
router.get('/:post_id/reactions/count', ReactionController.countByType);
router.delete('/:id', ReactionController.delete);

export default router;
