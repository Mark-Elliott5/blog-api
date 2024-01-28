import { Schema, Types, Model, model } from 'mongoose';

export interface IArticle {
  title: string;
  author: Types.ObjectId;
  date: Date;
  content: string;
  comments: Types.Array<Types.ObjectId>;
  url: string;
}

const articleSchema = new Schema<IArticle, Model<IArticle>>({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  date: { type: Date, required: true },
  content: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  url: { type: String, required: true },
});

// articleSchema.virtual('commentCount').get(function () {
//   return this.comments.length;
// });

export const Article = model('Article', articleSchema);
