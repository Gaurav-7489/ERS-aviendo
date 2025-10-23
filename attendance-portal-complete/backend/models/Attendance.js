const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
  classId: {type: String},
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present','absent','late'], default: 'present' }
}, {timestamps:true});
module.exports = mongoose.model('Attendance', attendanceSchema);
