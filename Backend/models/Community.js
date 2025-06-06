const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  username: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
   title: { type: String, required: true },
  recipe: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  Dislikes:Number,
  photo: String,
});

module.exports = mongoose.model('Community', communitySchema);
