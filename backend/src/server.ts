import express from 'express';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { connectDB } from './config/db';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import postRouter from './routes/post.routes';
import commentRouter from './routes/comment.routes';
import { initializeNotificationSocket } from './sockets/notificationSocket'; 

dotenv.config();

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

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: whitelist, credentials: true },
});

initializeNotificationSocket({ io });

app.locals.io = io;


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { console.log(`Server is running on ${PORT}`); });
