const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

router.get('/', auth.verify, async (req,res)=>{
  const notes = await Note.find().populate('author','email profile.name');
  res.json(notes);
});

router.post('/', auth.verifyTeacher, async (req,res)=>{
  const {title,content,isPaid,price} = req.body;
  const n = await Note.create({title,content,isPaid,price, author: req.user._id});
  res.json(n);
});

module.exports = router;
