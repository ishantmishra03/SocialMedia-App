import { Router } from 'express';
import NotificationController from '../controllers/notification.controller';
import { authVerify } from '../middlewares/authVerify';

const notificationRouter = Router();

notificationRouter.get('/', authVerify, NotificationController.getNotifications);
notificationRouter.patch('/:id/read', authVerify, NotificationController.markNotificationRead);
notificationRouter.patch('/read-all', authVerify, NotificationController.markAllNotificationsRead);

export default notificationRouter;
