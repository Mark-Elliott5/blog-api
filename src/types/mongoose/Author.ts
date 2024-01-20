import mongoose from 'mongoose';

const { Schema } = mongoose;

const authorSchema = new Schema({
  name: { type: String, required: true },
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
});

export default mongoose.model('Author', authorSchema);
