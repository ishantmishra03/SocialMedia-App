import { Types } from 'mongoose';
import CommentModel, { IComment } from '../models/Comment';
import PostModel from '../models/Post';
import redisClient from '../utils/redisClient';

class CommentService {
    private isValidObjectId(id: string): boolean {
        return Types.ObjectId.isValid(id);
    }

    // Create new comment
    async createComment(authorId: string, postId: string, content: string): Promise<IComment> {
        if (!authorId || !postId || !content) {
            throw new Error('Author, Post, and Content are required');
        }

        if (!this.isValidObjectId(authorId) || !this.isValidObjectId(postId)) {
            throw new Error('Invalid author or post ID');
        }

        // Ensure post exists
        const post = await PostModel.findById(postId);
        if (!post) throw new Error('Post not found');

        const comment = await CommentModel.create({
            author: new Types.ObjectId(authorId),
            post: new Types.ObjectId(postId),
            content,
        });

        // Invalidate related caches
        await redisClient.del(`post:${postId}`);
        await redisClient.del(`comments:${postId}`);

        return comment;
    }

    // Get comments for a post
    async getCommentsByPost(postId: string): Promise<IComment[]> {
        if (!this.isValidObjectId(postId)) {
            throw new Error('Invalid post ID');
        }

        const cacheKey = `comments:${postId}`;
        const cachedComments = await redisClient.get(cacheKey);

        if (cachedComments) {
            return JSON.parse(cachedComments);
        }

        const comments = await CommentModel.find({ post: postId })
            .sort({ createdAt: -1 })
            .populate('author', 'username')
            .lean();

        await redisClient.set(cacheKey, JSON.stringify(comments), 'EX', 600);

        return comments;
    }

    // Like comment
    async likeComment(commentId: string, userId: string): Promise<IComment | null> {
        if (!this.isValidObjectId(commentId) || !this.isValidObjectId(userId)) {
            throw new Error('Invalid ID');
        }

        const updatedComment = await CommentModel.findByIdAndUpdate(
            commentId,
            { $addToSet: { likes: new Types.ObjectId(userId) } },
            { new: true }
        ).lean();

        if (!updatedComment) throw new Error('Comment not found');

        await redisClient.del(`comment:${commentId}`);
        await redisClient.del(`comments:${updatedComment.post}`);

        return updatedComment;
    }

    // Unlike comment
    async unlikeComment(commentId: string, userId: string): Promise<IComment | null> {
        if (!this.isValidObjectId(commentId) || !this.isValidObjectId(userId)) {
            throw new Error('Invalid ID');
        }

        const updatedComment = await CommentModel.findByIdAndUpdate(
            commentId,
            { $pull: { likes: new Types.ObjectId(userId) } },
            { new: true }
        ).lean();

        if (!updatedComment) throw new Error('Comment not found');

        await redisClient.del(`comment:${commentId}`);
        await redisClient.del(`comments:${updatedComment.post}`);

        return updatedComment;
    }

    // Delete comment
    async deleteComment(commentId: string, userId: string): Promise<{ success: boolean }> {
        if (!this.isValidObjectId(commentId) || !this.isValidObjectId(userId)) {
            throw new Error('Invalid ID');
        }

        const comment = await CommentModel.findById(commentId);
        if (!comment) throw new Error('Comment not found');

        if (comment.author.toString() !== userId) {
            throw new Error('You are not authorized to delete this comment');
        }

        await comment.deleteOne();

        await redisClient.del(`comment:${commentId}`);
        await redisClient.del(`comments:${comment.post}`);

        return { success: true };
    }
}

export default new CommentService();
