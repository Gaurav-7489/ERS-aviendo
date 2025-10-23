const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const auth = require('../middleware/auth');

// mark attendance (teacher)
router.post('/mark', auth.verifyTeacher, async (req,res)=>{
  try{
    const {studentId, date, status} = req.body;
    const d = new Date(date);
    const start = new Date(d.setHours(0,0,0,0));
    const end = new Date(d.setHours(23,59,59,999));
    let rec = await Attendance.findOne({student: studentId, date: {$gte:start,$lte:end}});
    if(rec){ rec.status = status; await rec.save(); }
    else{ rec = await Attendance.create({student:studentId, date: date, status}); }
    res.json(rec);
  }catch(e){ console.error(e); res.status(500).json({msg:'err'}); }
});

// get class attendance for a date (teacher)
router.get('/class/:date', auth.verifyTeacher, async (req,res)=>{
  try{
    const date = new Date(req.params.date);
    const start = new Date(date.setHours(0,0,0,0));
    const end = new Date(date.setHours(23,59,59,999));
    const records = await Attendance.find({date: {$gte:start,$lte:end}}).populate('student');
    res.json(records);
  }catch(e){ console.error(e); res.status(500).json({msg:'err'}); }
});

// student: get own attendance summary
router.get('/me', auth.verifyStudent, async (req,res)=>{
  const records = await Attendance.find({student: req.user._id}).sort({date:-1});
  res.json(records);
});

// export range (teacher)
router.get('/export', auth.verifyTeacher, async (req,res)=>{
  try{
    const {from,to} = req.query;
    const f = new Date(from);
    const t = new Date(to);
    const records = await Attendance.find({date: {$gte:f,$lte:t}}).populate('student');
    res.json(records);
  }catch(e){ console.error(e); res.status(500).json({msg:'err'}); }
});

module.exports = router;
