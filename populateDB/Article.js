const mongoose = require('mongoose');

const { Schema } = mongoose;

const articleSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author' },
  date: { type: Date, required: true },
  content: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  url: { type: String, required: true },
});

module.exports = mongoose.model('Article', articleSchema);
