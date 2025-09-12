import { Request, Response } from 'express';
import StoryService from '../services/story.service';
import { AuthRequest } from '../middlewares/authVerify';

class StoryController {
  // Create new story
  async createStory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const mediaBuffer = req.file?.buffer;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      if (!mediaBuffer) {
        return res.status(400).json({ success: false, message: 'Media is required' });
      }

      const story = await StoryService.createStory(userId, mediaBuffer);
      res.status(201).json({ success: true, data: story });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message || 'Failed to create story' });
    }
  }

  // Get all stories
  async getAllStories(req: Request, res: Response) {
    try {
      const stories = await StoryService.getAllStories();
      res.status(200).json({ success: true, data: stories });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch stories' });
    }
  }

  // Get stories by user
  async getStoriesByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const stories = await StoryService.getStoriesByUser(userId);
      res.status(200).json({ success: true, data: stories });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message || 'Stories not found' });
    }
  }

  // View story
  async viewStory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { storyId } = req.params;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const story = await StoryService.viewStory(storyId, userId);
      res.status(200).json({ success: true, data: story });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to view story' });
    }
  }

  // Like story
  async likeStory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { storyId } = req.params;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const story = await StoryService.likeStory(storyId, userId);
      res.status(200).json({ success: true, data: story });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to like story' });
    }
  }

  // Unlike story
  async unlikeStory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { storyId } = req.params;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const story = await StoryService.unlikeStory(storyId, userId);
      res.status(200).json({ success: true, data: story });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to unlike story' });
    }
  }

  // Delete story
  async deleteStory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { storyId } = req.params;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const result = await StoryService.deleteStory(storyId, userId);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      if (error.message.includes('not authorized')) {
        return res.status(403).json({ success: false, message: error.message });
      }
      res.status(404).json({ success: false, message: error.message || 'Failed to delete story' });
    }
  }
}

export default new StoryController();
