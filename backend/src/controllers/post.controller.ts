import { Request, Response } from 'express';
import PostService from '../services/post.service';
import { AuthRequest } from '../middlewares/authVerify';
import { ZodError } from 'zod';
import { postSchema } from '../schemas/post.schema';

class PostController {
  // Create new post
  async createPost(req: AuthRequest, res: Response) {
    try {
      const authorId = req.user?.id;
      const parsedBody = postSchema.parse(req.body);
      const mediaBuffer = req.file?.buffer;

      if (!authorId) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const post = await PostService.createPost(authorId, parsedBody.content, mediaBuffer);

      res.status(201).json({ success: true, data: post });
    } catch (err: any) {
      if (err instanceof ZodError) {
        const errors = err.issues;
        return res.status(400).json({ success: false, message: errors });
      }
      res.status(400).json({ success: false, message: err.message || 'Failed to create post' });
    }
  }

  // Get a post by ID
  async getPostById(req: Request, res: Response) {
    try {
      const { postId } = req.params;

      const post = await PostService.getPostById(postId);

      res.status(200).json({ success: true, data: post });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message || 'Post not found' });
    }
  }

  // Get all posts ( TODO: Pagination )
  async getAllPosts(req: Request, res: Response) {
    try {
      const posts = await PostService.getAllPosts();

      res.status(200).json({ success: true, data: posts });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch posts' });
    }
  }

  // Like a post
  async likePost(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { postId } = req.params;

      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const updatedPost = await PostService.likePost(postId, userId);

      res.status(200).json({ success: true, data: updatedPost });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to like post' });
    }
  }

  // Unlike a post
  async unlikePost(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { postId } = req.params;

      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const updatedPost = await PostService.unlikePost(postId, userId);

      res.status(200).json({ success: true, data: updatedPost });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to unlike post' });
    }
  }

  // Delete a post
  async deletePost(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { postId } = req.params;

      if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const result = await PostService.deletePost(postId, userId);

      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      if (error.message === 'Unauthorized' || error.message.includes('not authorized')) {
        return res.status(403).json({ success: false, message: error.message });
      }
      if (error.message === 'Post not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      res.status(400).json({ success: false, message: error.message || 'Failed to delete post' });
    }
  }
}

export default new PostController();
