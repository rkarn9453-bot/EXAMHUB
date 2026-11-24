const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'student', index: true },
  refreshTokenHash: { type: String, select: false }
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);
