import { Types } from 'mongoose';
import PostModel from '../models/Post';
import { IPost } from '../models/Post';
import redisClient from '../utils/redisClient';
import cloudinary from '../utils/cloudinary';
import streamifier from 'streamifier';

class PostService {
    private isValidObjectId(id: string): boolean {
        return Types.ObjectId.isValid(id);
    }

    // Create new post
    async createPost(authorId: string, content: string, mediaBuffer?: Buffer): Promise<IPost> {
        if (!content || !authorId) {
            throw new Error('Author and content are required');
        }

        if (!this.isValidObjectId(authorId)) {
            throw new Error('Invalid author ID');
        }

        let mediaObj: { url: string; publicId: string; resourceType: string } | undefined;

        if (mediaBuffer) {
            const uploadResult = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'posts',
                        resource_type: 'auto',
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                streamifier.createReadStream(mediaBuffer).pipe(uploadStream);
            });

            mediaObj = {
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
                resourceType: uploadResult.resource_type,
            };
        }

        const post = await PostModel.create({
            author: new Types.ObjectId(authorId),
            content,
            media: mediaObj,
        });

        await redisClient.del('allPosts');

        return post;
    }

    // Get post By Id
    async getPostById(postId: string): Promise<IPost | null> {
        if (!this.isValidObjectId(postId)) {
            throw new Error('Invalid post ID');
        }

        const cacheKey = `post:${postId}`;
        const cachedPost = await redisClient.get(cacheKey);

        if (cachedPost) {
            return JSON.parse(cachedPost);
        }

        const post = await PostModel.findById(postId)
            .populate('author', 'username')
            .populate('comments')
            .lean();

        if (!post) throw new Error('Post not found');

        await redisClient.set(cacheKey, JSON.stringify(post), 'EX', 600);

        return post;
    }

    // Get All Posts
    async getAllPosts(): Promise<IPost[]> {
        const cacheKey = 'allPosts';
        const cachedPosts = await redisClient.get(cacheKey);

        if (cachedPosts) {
            return JSON.parse(cachedPosts);
        }

        const posts = await PostModel.find()
            .sort({ createdAt: -1 })
            .populate('author', 'username')
            .lean();

        await redisClient.set(cacheKey, JSON.stringify(posts), 'EX', 600);

        return posts;
    }

    // Like Post
    async likePost(postId: string, userId: string): Promise<IPost | null> {
        if (!this.isValidObjectId(postId) || !this.isValidObjectId(userId)) {
            throw new Error('Invalid ID');
        }

        const updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            { $addToSet: { likes: new Types.ObjectId(userId) } },
            { new: true }
        ).lean();

        if (!updatedPost) throw new Error('Post not found');

        await redisClient.del(`post:${postId}`);
        await redisClient.del('allPosts');

        return updatedPost;
    }

    // Unlike post
    async unlikePost(postId: string, userId: string): Promise<IPost | null> {
        if (!this.isValidObjectId(postId) || !this.isValidObjectId(userId)) {
            throw new Error('Invalid ID');
        }

        const updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            { $pull: { likes: new Types.ObjectId(userId) } },
            { new: true }
        ).lean();

        if (!updatedPost) throw new Error('Post not found');

        await redisClient.del(`post:${postId}`);
        await redisClient.del('allPosts');

        return updatedPost;
    }


    // Delete Post
    async deletePost(postId: string, userId: string): Promise<{ success: boolean }> {
        if (!this.isValidObjectId(postId) || !this.isValidObjectId(userId)) {
            throw new Error('Invalid ID');
        }

        const post = await PostModel.findById(postId);
        if (!post) throw new Error('Post not found');

        if (post.author.toString() !== userId) {
            throw new Error('You are not authorized to delete this post');
        }

        if (post.media?.publicId && post.media?.resourceType) {
            await cloudinary.uploader.destroy(post.media.publicId, { resource_type: post.media.resourceType });
        }

        await post.deleteOne();

        await redisClient.del(`post:${postId}`);
        await redisClient.del('allPosts');

        return { success: true };
    }

}

export default new PostService();
