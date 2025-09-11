import { Request, Response } from 'express';
import UserService from '../services/user.service';
import { AuthRequest } from '../middlewares/authVerify';

class UserController {
  // Get profile by username or id
  getProfile = async (req: Request, res: Response) => {
    try {
      const { identifier } = req.params;
      const user = await UserService.getUserProfile(identifier);

      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  // Update profile - requires auth (userId from auth middleware)
//   updateProfile = async (req: AuthRequest, res: Response) => {
//     try {
//       const userId = req.user?.id; // assuming req.user set by auth middleware
//       const updates = req.body;

//       const updatedUser = await UserService.updateUserProfile(userId, updates);

//       if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });

//       res.json({ success: true, user: updatedUser });
//     } catch (err: any) {
//       res.status(400).json({ success: false, error: err.message });
//     }
//   };

  // Follow user
  followUser = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id; 
      const { targetUserId } = req.params;

      await UserService.followUser(userId, targetUserId);

      res.json({ success: true, message: `You followed user ${targetUserId}` });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };

  // Unfollow user
  unfollowUser = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id; 
      const { targetUserId } = req.params;

      await UserService.unfollowUser(userId, targetUserId);

      res.json({ success: true, message: `You unfollowed user ${targetUserId}` });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };
}

export default new UserController();
