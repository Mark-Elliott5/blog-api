import { Schema, Types, Model, model } from 'mongoose';

export interface IComment {
  author: string;
  date: Date;
  content: string;
  article: Types.ObjectId;
  url: string;
}

export interface ICrudComment {
  author: string;
  content: string;
}

const commentSchema = new Schema<IComment, Model<IComment>>({
  author: { type: String, required: true },
  date: { type: Date, required: true },
  content: { type: String, required: true },
  article: { type: Schema.Types.ObjectId, ref: 'Article' },
  url: { type: String, required: true },
});

export const Comment = model('Comment', commentSchema);
