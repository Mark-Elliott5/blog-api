const mongoose = require('mongoose');

const { Schema } = mongoose;

const authorSchema = new Schema({
  name: { type: String, required: true },
  articles: { type: [Schema.Types.ObjectId], ref: 'Article', default: [] },
  url: { type: String, required: true },
});

module.exports = mongoose.model('Author', authorSchema);
