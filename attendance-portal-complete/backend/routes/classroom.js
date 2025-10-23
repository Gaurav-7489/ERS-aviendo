const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Classroom = require('../models/Classroom');
const { verify, verifyTeacher } = require('../middleware/authMiddleware');

// ✅ Create a new classroom (Teacher only)
router.post('/create', verifyTeacher, async (req, res) => {
  try {
    const { classId, name, subject, semester } = req.body;
    if (!classId || !name)
      return res.status(400).json({ msg: 'classId and name are required' });

    const exists = await Classroom.findOne({ classId });
    if (exists)
      return res.status(400).json({ msg: 'Classroom ID already exists' });

    const classroom = new Classroom({
      classId,
      name,
      teacher: req.user.id,
      meta: { subject, semester },
      students: []
    });

    await classroom.save();
    res.json({ msg: 'Classroom created successfully', classroom });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error creating classroom' });
  }
});

// ✅ Join a classroom (Student or Teacher)
router.post('/join', verify, async (req, res) => {
  try {
    const { classId } = req.body;
    if (!classId) return res.status(400).json({ msg: 'classId is required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const classroom = await Classroom.findOne({ classId });
    if (!classroom) return res.status(404).json({ msg: 'Classroom not found' });

    // Add user to class students (avoid duplicates)
    if (!classroom.students.includes(user._id)) {
      classroom.students.push(user._id);
      await classroom.save();
    }

    // Add classId to user record
    if (!user.classes) user.classes = [];
    if (!user.classes.includes(classId)) {
      user.classes.push(classId);
      await user.save();
    }

    res.json({ msg: `Joined classroom ${classId}`, classes: user.classes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error joining classroom' });
  }
});

// ✅ Fetch all classrooms (for dashboard listing later)
router.get('/', verify, async (req, res) => {
  try {
    const classes = await Classroom.find()
      .populate('teacher', 'email')
      .select('classId name meta');
    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch classrooms' });
  }
});

module.exports = router;
