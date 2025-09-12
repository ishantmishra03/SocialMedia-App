import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStory extends Document {
  user: Types.ObjectId;
  mediaUrl: string;
  views: Types.ObjectId[];
  likes: Types.ObjectId[];
  expiresAt: Date;
  createdAt: Date;
}

const StorySchema = new Schema<IStory>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mediaUrl: { type: String, required: true },
    views: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    expiresAt: { type: Date, required: true }, 
  },
  { timestamps: true }
);

export default mongoose.model<IStory>('Story', StorySchema);
