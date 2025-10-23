require('dotenv').config();
const mongoose = require('mongoose');
const Classroom = require('./models/Classroom');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/attendance_db')
  .then(async () => {
    console.log('MongoDB connected');
    const existing = await Classroom.findOne({ classId: 'MATH202' });
    if (!existing) {
      const c = await Classroom.create({ classId: 'MATH202', name: 'Math 202' });
      console.log('Seeded classroom:', c.classId);
    } else {
      console.log('MATH202 already exists');
    }
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });
