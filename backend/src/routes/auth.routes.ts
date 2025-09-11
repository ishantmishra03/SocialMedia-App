import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { authVerify } from '../middlewares/authVerify';
import upload from '../utils/multer';

const authRouter = Router();

authRouter.post('/register', upload.single('avatar'), AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.post('/login/google', AuthController.googleLogin);
authRouter.post('/logout', authVerify, AuthController.logout);

export default authRouter;
