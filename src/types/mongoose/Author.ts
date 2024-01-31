import { Schema, Types, Model, model } from 'mongoose';

export interface IAuthor {
  name: string;
  articles: Types.Array<Types.ObjectId>;
  url: string;
  username: string;
  password: string;
}

export interface IAuthorLogin {
  username: string;
  password: string;
}

export interface ICrudAuthor {
  name: string;
  username: string;
  password: string;
}

const authorSchema = new Schema<IAuthor, Model<IAuthor>>({
  name: { type: String, required: true },
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  url: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const Author = model('Author', authorSchema);
