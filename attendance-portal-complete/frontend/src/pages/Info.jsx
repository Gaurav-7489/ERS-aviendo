// src/pages/Info.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Info() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-white transition-colors duration-1000">

      {/* Subtle moving gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Soft spotlight in center */}
      <div className="absolute w-72 h-72 bg-gradient-radial from-gray-100 via-white to-white rounded-full opacity-30 z-0" />

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center max-w-3xl space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
          About <span className="text-gray-700">BLUE Attendance Portal</span>
        </h1>
        <p className="text-lg text-gray-600">
          BLUE Attendance Portal is a modern, easy-to-use solution for managing student attendance.
          Students can mark attendance, view dashboards, and teachers can manage classrooms and exports efficiently.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate(-1)}
          className="glowing-btn bg-white text-gray-900 font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-50 transition duration-300"
        >
          Go Back
        </button>
      </motion.div>
    </div>
  );
}
