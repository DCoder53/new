// message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  message: { type: String, required: true },
  userId: { type: String, required: true },
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
