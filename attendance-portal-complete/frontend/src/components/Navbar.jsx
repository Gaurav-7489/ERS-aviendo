// Navbar placeholder
// components/NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // assuming you use react-router

export default function NavBar() {
  return (
    <nav className="bg-sky-700 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">Blue Attendance Portal</div>
      <div className="flex gap-4">
        <Link to="/dashboard" className="hover:bg-sky-600 px-3 py-1 rounded">Dashboard</Link>
        <Link to="/profile" className="hover:bg-sky-600 px-3 py-1 rounded">Profile</Link>
        <Link to="/classroom" className="hover:bg-sky-600 px-3 py-1 rounded">Classroom</Link>
        <Link to="/teacher" className="hover:bg-sky-600 px-3 py-1 rounded">Teacher View</Link>
      </div>
    </nav>
  );
}
