const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], required: true },
  profileFilled: { type: Boolean, default: false },
  profile: {
    name: String,
    department: String,
    course: String,
    year: String,
    semester: String,
    roll: String,
    photoUrl: String,
    cgpa: Number,
    lastExamScore: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
