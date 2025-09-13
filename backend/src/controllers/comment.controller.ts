import { Request, Response } from 'express';
import CommentService from '../services/comment.service';
import { AuthRequest } from '../middlewares/authVerify';
import { ZodError } from 'zod';
import NotificationService from '../services/notification.service';

class CommentController {
  // Create new comment
  async createComment(req: AuthRequest, res: Response) {
    try {
      const authorId = req.user?.id;
      const { postId } = req.params;
      const { content } = req.body;

      if (!authorId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const comment = await CommentService.createComment(authorId, postId, content);

       // Sends notification
      if (comment.author.toString() !== authorId) { 
        await NotificationService.createNotification(
          comment.author.toString(), 
          authorId,                      
          'comment',                     
          postId,                         
          req.app.locals.io              
        );
      }

      res.status(201).json({ success: true, data: comment });
    } catch (err: any) {
      if (err instanceof ZodError) {
        return res.status(400).json({ success: false, message: err.issues });
      }
      res.status(400).json({ success: false, message: err.message || 'Failed to create comment' });
    }
  }

  // Get comments by Post ID
  async getCommentsByPost(req: Request, res: Response) {
    try {
      const { postId } = req.params;

      const comments = await CommentService.getCommentsByPost(postId);

      res.status(200).json({ success: true, comments });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message || 'Comments not found' });
    }
  }

  // Like a comment
  async likeComment(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { commentId } = req.params;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const updatedComment = await CommentService.likeComment(commentId, userId);

      if (!updatedComment) {
        return res.status(404).json({ success: false, message: 'Comment not found' });
      }

      // Notify comment owner
      if (updatedComment.author.toString() !== userId) {
        await NotificationService.createNotification(
          updatedComment.author.toString(), 
          userId,                          
          'like',                           
          updatedComment.post.toString(),   
          req.app.locals.io                 
        );
      }

      res.status(200).json({ success: true, data: updatedComment });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to like comment' });
    }
  }

  // Unlike a comment
  async unlikeComment(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { commentId } = req.params;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const updatedComment = await CommentService.unlikeComment(commentId, userId);

      res.status(200).json({ success: true, data: updatedComment });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to unlike comment' });
    }
  }

  // Delete a comment
  async deleteComment(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { commentId } = req.params;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const result = await CommentService.deleteComment(commentId, userId);

      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      if (error.message.includes('not authorized')) {
        return res.status(403).json({ success: false, message: error.message });
      }
      if (error.message === 'Comment not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      res.status(400).json({ success: false, message: error.message || 'Failed to delete comment' });
    }
  }
}

export default new CommentController();
