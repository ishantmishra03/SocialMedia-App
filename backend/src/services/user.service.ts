import UserModel, { IUser } from '../models/User';
import { Types } from 'mongoose';
import redisClient from '../utils/redisClient';

class UserService {
    // Get user profile by ID or username
    async getUserProfile(identifier: string): Promise<IUser | null> {
        const cacheKey = `userProfile:${identifier}`;

        //Try redis cache first
        const cached = await redisClient.get(cacheKey);
        if(cached){
            return JSON.parse(cached);
        }

        // NOT in cache then fetch from DB
        const isObjectId = Types.ObjectId.isValid(identifier);

        const user = isObjectId
            ? await UserModel.findById(identifier).select('-password -email -authProvider').lean()
            : await UserModel.findOne({ username: identifier }).select('-password -email -authProvider').lean();

        if(user){
            await redisClient.set(cacheKey, JSON.stringify(user), 'EX', 600);
        }

        return user;
    }

    // Update user profile (bio, avatar)
    //   async updateUserProfile(userId: string, updates: Partial<IUser>): Promise<IUser | null> {
    //     const allowedUpdates = ['avatar', 'bio', 'username']; 
    //     const filteredUpdates: Partial<IUser> = {};

    //     Object.entries(updates).forEach(([key, value]) => {
    //       if (allowedUpdates.includes(key)) filteredUpdates[key as keyof IUser] = value;
    //     });

    //     const updatedUser = await UserModel.findByIdAndUpdate(
    //       userId,
    //       { $set: filteredUpdates },
    //       { new: true, runValidators: true }
    //     ).select('-password');

    //     return updatedUser;
    //   }

    // Follow user
    async followUser(userId: string, targetUserId: string): Promise<void> {
        if (userId === targetUserId) throw new Error("Cannot follow yourself");

        const user = await UserModel.findById(userId);
        const targetUser = await UserModel.findById(targetUserId);

        if (!user || !targetUser) throw new Error("User not found");

        if (user.following.includes(targetUser._id)) return;

        user.following.push(targetUser._id);
        targetUser.followers.push(user._id);

        await user.save();
        await targetUser.save();

        // Invalidate cache as user changes
        await redisClient.del(`userProfile:${userId}`);
        await redisClient.del(`userProfile:${targetUserId}`);
    }

    // Unfollow user
    async unfollowUser(userId: string, targetUserId: string): Promise<void> {
        if (userId === targetUserId) throw new Error("Cannot unfollow yourself");

        const user = await UserModel.findById(userId);
        const targetUser = await UserModel.findById(targetUserId);

        if (!user || !targetUser) throw new Error("User not found");

        user.following = user.following.filter(f => !f.equals(targetUser._id));
        targetUser.followers = targetUser.followers.filter(f => !f.equals(user._id));

        await user.save();
        await targetUser.save();

        // Invalidate cache as user changes
        await redisClient.del(`userProfile:${userId}`);
        await redisClient.del(`userProfile:${targetUserId}`);
    }
}

export default new UserService();
