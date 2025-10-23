// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');



const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: 'No token' });

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

module.exports = authMiddleware;


router.get('/me', authMiddleware, async (req,res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash'); // hide password
    if(!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch(err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
