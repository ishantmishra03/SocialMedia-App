import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password?: string; 
  googleId?: string;
  avatar?: string;
  bio?: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  savedPosts: Types.ObjectId[];
  role: 'user' | 'moderator' | 'admin';
  authProvider: 'local' | 'google';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, 
    googleId: { type: String }, 
    avatar: { type: String },
    bio: { type: String },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    savedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
  },
  { timestamps: true }
);


export default mongoose.model<IUser>('User', UserSchema);
