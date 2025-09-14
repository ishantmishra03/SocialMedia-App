import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { authVerify } from '../middlewares/authVerify';

const userRouter = Router();

userRouter.get('/:identifier', authVerify, UserController.getProfile);
userRouter.post('/follow/:targetUserId', authVerify, UserController.followUser);
userRouter.post('/unfollow/:targetUserId', authVerify, UserController.unfollowUser);
userRouter.get('/check-follow/:targetUserId', authVerify, UserController.checkFollow);

export default userRouter;
