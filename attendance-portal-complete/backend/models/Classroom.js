const mongoose = require('mongoose');
const { Schema } = mongoose;

const classroomSchema = new Schema({
  classId: { type: String, required: true, unique: true }, // e.g., "MATH202"
  name: { type: String, required: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'User' },   // who created the class
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }],// enrolled students
  meta: {
    subject: String,
    semester: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Classroom', classroomSchema);
