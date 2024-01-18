const mongoose = require('mongoose');

const { Schema } = mongoose;

const authorSchema = new Schema({
  name: { type: String, required: true },
  articles: { type: [Schema.Types.ObjectId], ref: 'Article', default: [] },
});

module.exports = mongoose.model('Author', authorSchema);
