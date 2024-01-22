import { Schema, Types, Model, model } from 'mongoose';

interface Comment {
  author: string;
  date: Date;
  content: string;
  article: Types.ObjectId;
}

const commentSchema = new Schema<Comment, Model<Comment>>({
  author: { type: String, required: true },
  date: { type: Date, required: true },
  content: { type: String, required: true },
  article: { type: Schema.Types.ObjectId, ref: 'Article' },
});

export default model('Comment', commentSchema);
