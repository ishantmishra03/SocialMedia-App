import { Types } from 'mongoose';
import NotificationModel, { INotification } from '../models/Notification';

class NotificationService {
  private isValidObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }

  async createNotification(
    userId: string,
    fromId: string,
    type: INotification['type'],
    postId?: string,
    io?: any
  ): Promise<INotification> {
    if (!userId || !fromId || !type) {
      throw new Error('User, From, and Type are required');
    }

    if (postId && !this.isValidObjectId(postId)) {
      throw new Error('Invalid post ID');
    }

    const notification = await NotificationModel.create({
      user: new Types.ObjectId(userId),
      from: new Types.ObjectId(fromId),
      type,
      post: postId ? new Types.ObjectId(postId) : undefined,
      isRead: false,
    });

    const populated = await notification.populate([
      { path: "from", select: "username avatar" },
      { path: "post", select: "content media" },
    ]);


    if (io) {
      io.to(userId).emit('new_notification', populated);
    }

    return populated;
  }


  async getUserNotifications(userId: string): Promise<INotification[]> {
    if (!this.isValidObjectId(userId)) {
      throw new Error('Invalid user ID');
    }

    return await NotificationModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('from', 'username avatar')
      .populate('post', 'content media')
      .lean();
  }


  async markNotificationAsRead(notificationId: string): Promise<INotification | null> {
    if (!this.isValidObjectId(notificationId)) {
      throw new Error('Invalid notification ID');
    }

    return await NotificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  }


  async markAllNotificationsAsRead(userId: string): Promise<{ modifiedCount: number }> {
    if (!this.isValidObjectId(userId)) {
      throw new Error('Invalid user ID');
    }

    const result = await NotificationModel.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );

    return { modifiedCount: result.modifiedCount };
  }
}

export default new NotificationService();