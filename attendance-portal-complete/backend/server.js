require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express(); // <- must come first

// Enable JSON parsing
app.use(express.json());
app.use(cookieParser());

// CORS: allow frontend origin and allow cookies
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const classroomRoutes = require('./routes/classroom');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/api/classroom', classroomRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/attendance_db')
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



