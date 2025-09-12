import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
import UserModel from '../models/User';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { ZodError } from 'zod';
import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_CLIENT_ID } from '../config';
import { AuthRequest } from '../middlewares/authVerify';

const JWT_EXPIRE = 7 * 24 * 60 * 60 * 1000;
const isProd = process.env.NODE_ENV === 'production';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

class AuthController {
    //Register
    register = async (req: Request, res: Response) => {
        try {
            const parsedData = registerSchema.parse(req.body);

            const avatarBuffer = req.file?.buffer;

            await AuthService.register(parsedData.username, parsedData.email, parsedData.password, avatarBuffer);
            res.status(201).json({ success: true, message: "Registered successfully" });
        } catch (err: any) {
            if (err instanceof ZodError) {
                const errors = err.issues;
                return res.status(400).json({ success: false, message: errors });
            }
            res.status(400).json({ success: false, error: err.message });
        }
    }

    //Login
    login = async (req: Request, res: Response) => {
        try {
            const parsedBody = loginSchema.parse(req.body);
            const { token, user } = await AuthService.login(parsedBody.email, parsedBody.password);

            this.setCookie(token, res);

            res.status(200).json({ success: true, message: "Login success", user });
        } catch (err: any) {
            if (err instanceof ZodError) {
                const errors = err.issues;
                return res.status(400).json({ success: false, message: errors });
            }
            res.status(400).json({ success: false, error: err.message });
        }
    }

    //Google Login 
    googleLogin = async (req: Request, res: Response) => {
        const { credential } = req.body;

        try {
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();

            if (!payload || !payload.email_verified) {
                return res.status(401).json({ success: false, error: 'Google account not verified' });
            }

            if (!payload.email || !payload.name || !payload.sub) {
                return res.status(401).json({ success: false, error: 'Incomplete Google account information' });
            }

            const { email, name, picture, sub: googleId } = payload;

            let baseUsername = name.replace(/\s+/g, '_').toLowerCase();
            let username = baseUsername;

            let count = 1;
            while (await UserModel.findOne({ username })) {
                username = `${baseUsername}_${count++}`;
            }

            const { token, user } = await AuthService.googleLogin({
                email,
                username,
                avatar: picture,
                googleId,
            });

            this.setCookie(token, res);
            res.status(200).json({ success: true, message: 'Google login success', user });
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: 'Google login failed' });
        }
    };

    //Logout
    logout = async (req: Request, res: Response) => {
        this.clearCookie(res);

        res.status(200).json({ success: true, message: 'Logged out successfully' });
    }

    //Sets cookie 
    private setCookie(token: string, res: Response) {
        return res.cookie('token', token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: JWT_EXPIRE,
            path: '/',
        });
    }

    //Clears cookie
    private clearCookie(res: Response) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            path: '/',
        });
    }

    // is Authenticated or not
    isAuth = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id;

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            res.status(200).json({
                success: true, user: {
                    _id: user._id,
                    username: user.username,
                    avatar: user.avatar,
                },
            })
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new AuthController();
