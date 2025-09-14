import { Request, Response } from "express";
import UserService from "../services/user.service";
import { AuthRequest } from "../middlewares/authVerify";
import NotificationService from "../services/notification.service";
import NotificationModel from "../models/Notification";

class UserController {
  // Get profile by username or id
  getProfile = async (req: AuthRequest, res: Response) => {
    try {
      const { identifier } = req.params;
      const currentUserId = req.user?.id;

      const user = await UserService.getUserProfile(identifier, currentUserId);

      if (!user)
        return res.status(404).json({ success: false, message: 'User not found' });

      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  // Follow user
  followUser = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { targetUserId } = req.params;

      if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

      const result = await UserService.followUser(userId, targetUserId);

      // Send follow notification
      if (userId !== targetUserId) {
        await NotificationService.createNotification(
          targetUserId,
          userId,
          'follow',
          undefined,
          req.app.locals.io
        );
      }

      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };

  // Unfollow user
  unfollowUser = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { targetUserId } = req.params;

      if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

      const result = await UserService.unfollowUser(userId, targetUserId);

      // Delete the follow notification 
      const notif = await NotificationModel.findOneAndDelete({
        type: 'follow',
        user: targetUserId,
        from: userId,
      });


      if (notif) {
        const io = req.app.locals.io;
        io.to(targetUserId).emit('remove_notification', notif._id);
      }

      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };


  // Check follow status
  checkFollow = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { targetUserId } = req.params;

      if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

      const result = await UserService.checkFollow(userId, targetUserId);

      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };
}

export default new UserController();
