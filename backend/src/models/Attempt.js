const mongoose = require('mongoose');
const attemptSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true, index: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  answers: [{ questionId: mongoose.Schema.Types.ObjectId, selectedOption: Number }],
  startedAt: { type: Date, default: Date.now }, submittedAt: Date,
  score: { type: Number, default: 0 }, totalMarks: { type: Number, default: 0 }, status: { type: String, enum: ['in_progress', 'submitted'], default: 'in_progress' }
}, { timestamps: true });
attemptSchema.index({ exam: 1, student: 1 }, { unique: true });
module.exports = mongoose.model('Attempt', attemptSchema);
