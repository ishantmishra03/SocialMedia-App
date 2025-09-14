import UserModel, { IUser } from "../models/User";
import { Types } from "mongoose";
import redisClient from "../utils/redisClient";

class UserService {
    // Helper: Invalidate Redis cache for user by username
    private async invalidateUserCacheByUsername(user: IUser) {
        if (!user?.username) return;
        await redisClient.del(`userProfile:${user.username}`);
    }

    // Get user profile by username
    async getUserProfile(username: string, currentUserId?: string): Promise<any | null> {
        const cacheKey = `userProfile:${username}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) return JSON.parse(cached);

        const userDoc = await UserModel.findOne({ username });
        if (!userDoc) return null;

        const followersCount = userDoc.followers.length;
        const followingCount = userDoc.following.length;

        const isFollowing = currentUserId
            ? userDoc.followers.some(f => f.equals(currentUserId))
            : false;

        const followBack = currentUserId
            ? userDoc.following.some(f => f.equals(currentUserId)) && !isFollowing
            : false;

        const userProfile = {
            _id: userDoc._id.toString(),
            username: userDoc.username,
            avatar: userDoc.avatar || "",
            bio: userDoc.bio || "",
            role: userDoc.role,
            followersCount,
            followingCount,
            savedPosts: userDoc.savedPosts || [],
            isFollowing,
            followBack,
        };

        await redisClient.set(cacheKey, JSON.stringify(userProfile), 'EX', 600); // Cache for 10 min
        return userProfile;
    }

    // Follow user
    async followUser(currentUserId: string, targetUserId: string) {
        if (currentUserId === targetUserId) throw new Error("Cannot follow yourself");

        const currentUser = await UserModel.findById(currentUserId);
        const targetUser = await UserModel.findById(targetUserId);

        if (!currentUser || !targetUser) throw new Error("User not found");

        if (!currentUser.following.includes(targetUser._id)) {
            currentUser.following.push(targetUser._id);
            targetUser.followers.push(currentUser._id);

            await currentUser.save();
            await targetUser.save();

            // Invalidate cache by username
            await this.invalidateUserCacheByUsername(currentUser);
            await this.invalidateUserCacheByUsername(targetUser);
        }

        return {
            followersCount: targetUser.followers.length,
            isFollowing: true,
            isFollowBack: targetUser.following.includes(currentUser._id),
        };
    }

    // Unfollow user
    async unfollowUser(currentUserId: string, targetUserId: string) {
        if (currentUserId === targetUserId) throw new Error("Cannot unfollow yourself");

        const currentUser = await UserModel.findById(currentUserId);
        const targetUser = await UserModel.findById(targetUserId);

        if (!currentUser || !targetUser) throw new Error("User not found");

        currentUser.following = currentUser.following.filter(f => !f.equals(targetUser._id));
        targetUser.followers = targetUser.followers.filter(f => !f.equals(currentUser._id));

        await currentUser.save();
        await targetUser.save();

        // Invalidate cache by username
        await this.invalidateUserCacheByUsername(currentUser);
        await this.invalidateUserCacheByUsername(targetUser);

        return {
            followersCount: targetUser.followers.length,
            isFollowing: false,
            isFollowBack: false,
        };
    }

    // Check follow status
    async checkFollow(currentUserId: string, targetUserId: string) {
        if (currentUserId === targetUserId) return { isFollowing: false, isFollowBack: false };

        const currentUser = await UserModel.findById(currentUserId).select("following");
        const targetUser = await UserModel.findById(targetUserId).select("following");

        if (!currentUser || !targetUser) throw new Error("User not found");

        const isFollowing = currentUser.following.some(id => id.equals(targetUserId));
        const isFollowBack = targetUser.following.some(id => id.equals(currentUserId));

        return { isFollowing, isFollowBack };
    }
}

export default new UserService();
