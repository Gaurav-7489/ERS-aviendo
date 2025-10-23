// Run with: node seedTeacher.js (after setting MONGO_URI in env)
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();
(async ()=>{
  try{
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/attendance_db');
    const hash = await bcrypt.hash('teachpass123',10);
    const exists = await User.findOne({email:'teacher@school.edu'});
    if(exists){ console.log('teacher exists'); process.exit(0); }
    const t = new User({email:'teacher@school.edu', passwordHash:hash, role:'teacher', profileFilled:true, profile:{name:'Prof. Blue'}});
    await t.save();
    console.log('teacher created');
    process.exit(0);
  }catch(e){ console.error(e); process.exit(1); }
})();