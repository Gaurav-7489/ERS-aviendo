// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';

// --------------------
// Middleware
// --------------------
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.userId = payload.id;
    req.role = payload.role;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
}

// Role-based middleware factory
function roleMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.role)) {
      return res.status(403).json({ msg: 'Forbidden: insufficient role' });
    }
    next();
  };
}

// --------------------
// Routes
// --------------------

// Get current user info
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update profile (student, cr can update only their profile)
router.patch('/me', authMiddleware, roleMiddleware(['student', 'cr', 'professor', 'hod']), async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Only student/CR can update personal info
    if (['student', 'cr'].includes(req.role)) {
      user.profile = { ...user.profile, ...req.body };
      user.profileFilled = true;
    }

    // Professors or HODs can only update CGPA or academic fields
    if (['professor', 'hod'].includes(req.role) && req.body.cgpa) {
      user.cgpa = req.body.cgpa;
    }

    await user.save();
    res.json(user); // send updated user
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to save profile' });
  }
});

// Admin/HOD route to get all students (example)
router.get('/all-students', authMiddleware, roleMiddleware(['hod', 'professor']), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-passwordHash');
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;
