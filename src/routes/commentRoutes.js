import { Router } from 'express';
import CommentController from '../controllers/CommentController.js';

const router = new Router();

router.post('/', CommentController.store);
//router.get('/:post_id/comments', CommentController.commentsByPost);
router.get('/:id', CommentController.show);

router.put('/:id', CommentController.update);
router.delete('/:id', CommentController.delete);

export default router;
