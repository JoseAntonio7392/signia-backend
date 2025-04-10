const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  sign: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String },
});

module.exports = mongoose.model('Lesson', lessonSchema);