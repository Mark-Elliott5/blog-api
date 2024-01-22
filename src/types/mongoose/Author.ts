import { Schema, Types, Model, model } from 'mongoose';

interface Author {
  name: string;
  articles: Types.Array<Types.ObjectId>;
}

const authorSchema = new Schema<Author, Model<Author>>({
  name: { type: String, required: true },
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
});

export default model('Author', authorSchema);
