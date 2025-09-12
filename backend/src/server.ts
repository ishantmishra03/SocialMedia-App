import express from 'express';
import dotnev from 'dotenv';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import postRouter from './routes/post.routes';
import commentRouter from './routes/comment.routes';

dotnev.config();

const app = express();

connectDB();


// CORS SETUP
const whitelist: string[] = process.env.CORS_WHITELIST
  ? process.env.CORS_WHITELIST.split(',').map(origin => origin.trim())
  : [];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);

app.get('/', (_, res) => res.send("Server Working..."));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`Server is running on ${PORT}`); })