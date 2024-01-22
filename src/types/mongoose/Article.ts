import { Schema, Types, Model, model } from 'mongoose';

interface Article {
  title: string;
  author: Types.ObjectId;
  date: Date;
  content: string;
  comments: Types.Array<Types.ObjectId>;
}

const articleSchema = new Schema<Article, Model<Article>>({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author' },
  date: { type: Date, required: true },
  content: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

// articleSchema.virtual('commentCount').get(function () {
//   return this.comments.length;
// });

export default model('Article', articleSchema);
