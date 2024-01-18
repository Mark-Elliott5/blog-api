const mongoose = require('mongoose');

const { Schema } = mongoose;

const articleSchema = new Schema({
  name: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author' },
});

module.exports = mongoose.model('Article', articleSchema);
