import UserModel, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

class AuthService {
    //Register
    async register(username: string, email: string, password: string) {
        const existing = await UserModel.findOne({ $or: [{ email }, { password }] });
        if (existing) throw new Error('Email or username already in use');

        const hashed = await bcrypt.hash(password, 10);
        const user = await UserModel.create({ username, email, password: hashed, authProvider: 'local', });

        return this.generateToken(user);
    }

    //Login
    async login(email: string, password: string) {
        const user = await UserModel.findOne({ email });
        if (!user || !user.password) throw new Error('Invalid credentials');

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error('Invalid credentials');

        return this.generateToken(user);
    }

    // OAuth20 ( Google Login )
    async googleLogin({ email, username, googleId, avatar }: {
        email: string;
        username: string;
        googleId: string;
        avatar?: string;
    }) {

        let user = await UserModel.findOne({ googleId });

        if (!user) {
            const existingEmailUser = await UserModel.findOne({ email });

            if (existingEmailUser) {
                if (existingEmailUser.authProvider !== 'google') {
                    throw new Error('Email already registered with a different login method');
                }

                existingEmailUser.googleId = googleId;
                await existingEmailUser.save();
                user = existingEmailUser;
            } else {
                user = await UserModel.create({
                    username,
                    email,
                    googleId,
                    avatar,
                    authProvider: 'google',
                });
            }
        }

        return this.generateToken(user);
    }


    // Generates token for cookie
    private generateToken(user: IUser) {
        const payload = { id: user._id, username: user.username, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

        return {
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            },
        };
    }
}

export default new AuthService();
