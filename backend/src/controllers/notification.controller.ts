import { Request, Response } from 'express';
import NotificationService from '../services/notification.service';
import { AuthRequest } from '../middlewares/authVerify';

class NotificationController {
  getNotifications = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const notifications = await NotificationService.getUserNotifications(userId);
      res.status(200).json({ success: true, data: notifications });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  markNotificationRead = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const notification = await NotificationService.markNotificationAsRead(id);
      res.status(200).json({ success: true, data: notification });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  markAllNotificationsRead = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const result = await NotificationService.markAllNotificationsAsRead(userId);
      res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
        modifiedCount: result.modifiedCount,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
}

export default new NotificationController();
