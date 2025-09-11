import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPost extends Document {
  author: Types.ObjectId;
  content: string;
  media?: string;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  sharedFrom?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    media: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    sharedFrom: { type: Schema.Types.ObjectId, ref: 'Post' },
  },
  { timestamps: true }
);

PostSchema.index({ author: 1, createdAt: -1 });

export default mongoose.model<IPost>('Post', PostSchema);
