import { Router } from 'express';
import PostController from '../controllers/PostController.js';
import CommentController from '../controllers/CommentController.js';

const router = new Router();

router.post('/', PostController.store);
router.get('/', PostController.index);
router.get('/user/:user_id', PostController.postsByUser);
router.get('/:post_id/comments', CommentController.commentsByPost);


router.get('/:id', PostController.show);
router.put('/:id', PostController.update);
router.delete('/:id', PostController.delete);

export default router;
