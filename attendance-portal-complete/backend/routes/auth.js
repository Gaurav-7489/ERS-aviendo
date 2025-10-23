const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret';

// Signup
router.post('/signup', async (req,res) => {
  try {
    const { email, password, role, profile } = req.body;
    if(!['student','teacher'].includes(role))
      return res.status(400).json({ msg: 'Invalid role' });

    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({ msg: 'Email exists' });

    const passwordHash = await bcrypt.hash(password, 12); // strong hashing
    const user = new User({ email, passwordHash, role, profile });
    if(profile) user.profileFilled = true;
    await user.save();

    // Create tokens
    const accessToken = jwt.sign({ id: user._id, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Send refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // only for https in prod
      sameSite: 'Strict',
      maxAge: 7*24*60*60*1000
    });

    res.json({ accessToken, role: user.role });
  } catch(err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Signin
router.post('/signin', async (req,res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ msg: 'No user' });
    if(role && user.role !== role) return res.status(403).json({ msg: 'Wrong role' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if(!valid) return res.status(400).json({ msg: 'Invalid credentials' });

    const accessToken = jwt.sign({ id: user._id, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7*24*60*60*1000
    });

    res.json({ accessToken, role: user.role });
  } catch(err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Refresh token endpoint
router.post('/refresh', (req,res) => {
  const token = req.cookies.refreshToken;
  if(!token) return res.status(401).json({ msg: 'No token' });

  try {
    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign({ id: payload.id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  } catch(err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
});

module.exports = router;
