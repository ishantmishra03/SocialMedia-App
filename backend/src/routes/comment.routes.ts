import { Router } from 'express';
import CommentController from '../controllers/comment.controller';
import { authVerify } from '../middlewares/authVerify';

const commentRouter = Router();

commentRouter.post('/:postId', authVerify, CommentController.createComment);
commentRouter.get('/:postId', CommentController.getCommentsByPost);
commentRouter.post('/:commentId/like', authVerify, CommentController.likeComment);
commentRouter.post('/:commentId/unlike', authVerify, CommentController.unlikeComment);
commentRouter.delete('/:commentId', authVerify, CommentController.deleteComment);

export default commentRouter;
