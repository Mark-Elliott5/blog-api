import { Schema, Types, Model, model } from 'mongoose';

export interface IAuthor {
  name: string;
  articles: Types.Array<Types.ObjectId>;
  url: string;
}

const authorSchema = new Schema<IAuthor, Model<IAuthor>>({
  name: { type: String, required: true },
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  url: { type: String, required: true },
});

export const Author = model('Author', authorSchema);
