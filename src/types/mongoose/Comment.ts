import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema({
  author: { type: String, required: true },
  date: { type: Date, required: true },
  content: { type: String, required: true },
  article: { type: Schema.Types.ObjectId, ref: 'Article' },
});

export default mongoose.model('Comment', commentSchema);
