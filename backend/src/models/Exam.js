const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true, min: 0 },
  marks: { type: Number, default: 1, min: 0 },
  negativeMarks: { type: Number, default: 0, min: 0 }
});
const examSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: String,
  subject: String,
  durationMinutes: { type: Number, required: true, min: 1 },
  startsAt: Date, endsAt: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [questionSchema], published: { type: Boolean, default: false, index: true }
}, { timestamps: true });
examSchema.index({ published: 1, startsAt: 1, endsAt: 1 });
module.exports = mongoose.model('Exam', examSchema);
