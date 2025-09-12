import { Types } from 'mongoose';
import StoryModel, { IStory } from '../models/Story';
import redisClient from '../utils/redisClient';
import cloudinary from '../utils/cloudinary';
import streamifier from 'streamifier';

class StoryService {
  private isValidObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }

  // Create a new story
  async createStory(userId: string, mediaBuffer: Buffer): Promise<IStory> {
    if (!userId || !mediaBuffer) {
      throw new Error('User and media are required');
    }

    if (!this.isValidObjectId(userId)) {
      throw new Error('Invalid user ID');
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'stories',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(mediaBuffer).pipe(uploadStream);
    });

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h expiry

    const story = await StoryModel.create({
      user: new Types.ObjectId(userId),
      mediaUrl: uploadResult.secure_url,
      expiresAt,
    });

    await redisClient.del(`stories:${userId}`);
    await redisClient.del('allStories');

    return story;
  }

  // Get all active stories
  async getAllStories(): Promise<IStory[]> {
    const cacheKey = 'allStories';
    const cachedStories = await redisClient.get(cacheKey);

    if (cachedStories) {
      return JSON.parse(cachedStories);
    }

    const now = new Date();
    const stories = await StoryModel.find({ expiresAt: { $gt: now } })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .lean();

    await redisClient.set(cacheKey, JSON.stringify(stories), 'EX', 600);

    return stories;
  }

  // Get stories of a specific user
  async getStoriesByUser(userId: string): Promise<IStory[]> {
    if (!this.isValidObjectId(userId)) {
      throw new Error('Invalid user ID');
    }

    const cacheKey = `stories:${userId}`;
    const cachedStories = await redisClient.get(cacheKey);

    if (cachedStories) {
      return JSON.parse(cachedStories);
    }

    const now = new Date();
    const stories = await StoryModel.find({
      user: userId,
      expiresAt: { $gt: now },
    })
      .sort({ createdAt: -1 })
      .lean();

    await redisClient.set(cacheKey, JSON.stringify(stories), 'EX', 600);

    return stories;
  }

  // Add a view
  async viewStory(storyId: string, userId: string): Promise<IStory | null> {
    if (!this.isValidObjectId(storyId) || !this.isValidObjectId(userId)) {
      throw new Error('Invalid ID');
    }

    const story = await StoryModel.findByIdAndUpdate(
      storyId,
      { $addToSet: { views: new Types.ObjectId(userId) } },
      { new: true }
    ).lean();

    if (!story) throw new Error('Story not found');

    await redisClient.del('allStories');
    await redisClient.del(`stories:${story.user}`);

    return story;
  }

  // Like a story
  async likeStory(storyId: string, userId: string): Promise<IStory | null> {
    if (!this.isValidObjectId(storyId) || !this.isValidObjectId(userId)) {
      throw new Error('Invalid ID');
    }

    const story = await StoryModel.findByIdAndUpdate(
      storyId,
      { $addToSet: { likes: new Types.ObjectId(userId) } },
      { new: true }
    ).lean();

    if (!story) throw new Error('Story not found');

    await redisClient.del('allStories');
    await redisClient.del(`stories:${story.user}`);

    return story;
  }

  // Unlike a story
  async unlikeStory(storyId: string, userId: string): Promise<IStory | null> {
    if (!this.isValidObjectId(storyId) || !this.isValidObjectId(userId)) {
      throw new Error('Invalid ID');
    }

    const story = await StoryModel.findByIdAndUpdate(
      storyId,
      { $pull: { likes: new Types.ObjectId(userId) } },
      { new: true }
    ).lean();

    if (!story) throw new Error('Story not found');

    await redisClient.del('allStories');
    await redisClient.del(`stories:${story.user}`);

    return story;
  }

  // Delete a story
  async deleteStory(storyId: string, userId: string): Promise<{ success: boolean }> {
    if (!this.isValidObjectId(storyId) || !this.isValidObjectId(userId)) {
      throw new Error('Invalid ID');
    }

    const story = await StoryModel.findById(storyId);
    if (!story) throw new Error('Story not found');

    if (story.user.toString() !== userId) {
      throw new Error('You are not authorized to delete this story');
    }

    await story.deleteOne();

    await redisClient.del('allStories');
    await redisClient.del(`stories:${userId}`);

    return { success: true };
  }
}

export default new StoryService();
