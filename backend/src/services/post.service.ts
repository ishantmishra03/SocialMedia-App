import { Types } from 'mongoose';
import PostModel from '../models/Post';
import { IPost } from '../models/Post';

class PostService {
    private isValidObjectId(id: string): boolean {
        return Types.ObjectId.isValid(id);
    }

    // Create new post
    async createPost(authorId: string, content: string, image?: string): Promise<IPost> {
        if (!content || !authorId) {
            throw new Error('Author and content are required');
        }

        if (!this.isValidObjectId(authorId)) {
            throw new Error('Invalid author ID');
        }

        return await PostModel.create({
            author: new Types.ObjectId(authorId),
            content,
            image,
        });
    }

    // Get pst By Id
    async getPostById(postId: string): Promise<IPost | null> {
        if (!this.isValidObjectId(postId)) {
            throw new Error('Invalid post ID');
        }

        const post = await PostModel.findById(postId)
            .populate('author', 'username')
            .populate('comments')
            .lean();

        if (!post) throw new Error('Post not found');

        return post;
    }

    // Get All Posts
    async getAllPosts(): Promise<IPost[]> {
        return await PostModel.find()
            .sort({ createdAt: -1 })
            .populate('author', 'username')
            .lean();
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

        await post.deleteOne();

        return { success: true };
    }
}

export default new PostService();
