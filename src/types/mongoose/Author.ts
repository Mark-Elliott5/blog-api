import { Schema, Types, Model, model } from 'mongoose';

interface Author {
  name: string;
  articles: Types.Array<Types.ObjectId>;
  url: string;
}

const authorSchema = new Schema<Author, Model<Author>>({
  name: { type: String, required: true },
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  url: { type: String, required: true },
});

export default model('Author', authorSchema);
