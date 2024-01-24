import { Schema, Types, Model, model } from 'mongoose';

interface Comment {
  author: string;
  date: Date;
  content: string;
  article: Types.ObjectId;
  url: string;
}

const commentSchema = new Schema<Comment, Model<Comment>>({
  author: { type: String, required: true },
  date: { type: Date, required: true },
  content: { type: String, required: true },
  article: { type: Schema.Types.ObjectId, ref: 'Article' },
  url: { type: String, required: true },
});

export default model('Comment', commentSchema);
