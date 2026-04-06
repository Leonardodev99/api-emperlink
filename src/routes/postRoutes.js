import { Router } from 'express';
import PostController from '../controllers/PostController.js';
import CommentController from '../controllers/CommentController.js';
import upload from '../middlewares/upload';

const router = new Router();

router.post('/', upload.array('images', 5), PostController.store);
router.get('/', PostController.index);
router.get('/hashtag/:name', PostController.postsByHashtag);
router.get('/user/:user_id', PostController.postsByUser);
router.get('/:post_id/comments', CommentController.commentsByPost);


router.get('/:id', PostController.show);
router.put('/:id', PostController.update);
router.delete('/:id', PostController.delete);

export default router;
