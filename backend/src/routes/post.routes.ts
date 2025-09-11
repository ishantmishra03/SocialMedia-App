import { Router } from 'express';
import PostController from '../controllers/post.controller';
import { authVerify } from '../middlewares/authVerify';
import upload from '../utils/multer';

const postRouter = Router();

postRouter.get('/', PostController.getAllPosts);
postRouter.get('/:postId', PostController.getPostById);
postRouter.post('/', authVerify, upload.single('media'), PostController.createPost);
postRouter.post('/:postId/like', authVerify, PostController.likePost);
postRouter.post('/:postId/unlike', authVerify, PostController.unlikePost);
postRouter.delete('/:postId', authVerify, PostController.deletePost);

export default postRouter;
