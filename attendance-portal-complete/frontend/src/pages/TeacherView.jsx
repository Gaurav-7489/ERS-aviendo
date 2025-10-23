import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import * as XLSX from 'xlsx';

export default function TeacherView() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Fetch all classrooms created by the teacher
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/classroom/my', {
          headers: { Authorization: 'Bearer ' + token },
        });
        setClasses(res.data);
      } catch (err) {
        console.error(err);
        setMsg('Failed to load classrooms.');
      }
    })();
  }, []);

  // Fetch students when a class is selected
  const fetchStudents = async (classId) => {
    if (!classId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/api/classroom/${classId}/students`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      setMsg('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    if (!selectedClass) return alert('Select a class first.');
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/api/attendance/${selectedClass}/${date}`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      console.log(res.data);
      alert('Fetched attendance; check console for records');
    } catch (e) {
      console.error(e);
      alert('Failed to fetch attendance');
    }
  };

  const exportRange = async () => {
    const from = prompt('From (YYYY-MM-DD)', date);
    const to = prompt('To (YYYY-MM-DD)', date);
    if (!from || !to) return;
    if (!selectedClass) return alert('Select a class first.');

    try {
      const token = localStorage.getItem('token');
      const res = await api.get(
        `/api/attendance/export/${selectedClass}?from=${from}&to=${to}`,
        { headers: { Authorization: 'Bearer ' + token } }
      );

      const data = res.data.map((x) => ({
        Date: new Date(x.date).toLocaleDateString(),
        Name: x.student.profile?.name || x.student.email,
        Roll: x.student.profile?.roll || '',
        Department: x.student.profile?.department || '',
        Status: x.status,
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
      XLSX.writeFile(wb, `attendance_${selectedClass}_${from}_to_${to}.xlsx`);
    } catch (e) {
      console.error(e);
      alert('Failed to export Excel');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-sky-700 mb-6">Teacher — Classroom Management</h2>

      {/* Class Selector */}
      <div className="mb-6">
        <label className="block text-gray-600 mb-2 font-semibold">Select Classroom</label>
        <select
          className="w-full md:w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-sky-500"
          value={selectedClass}
          onChange={(e) => {
            setSelectedClass(e.target.value);
            fetchStudents(e.target.value);
          }}
        >
          <option value="">-- Select a Classroom --</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls.classId}>
              {cls.name} ({cls.classId})
            </option>
          ))}
        </select>
      </div>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button
          onClick={fetchAttendance}
          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
        >
          Fetch Attendance
        </button>
        <button
          onClick={exportRange}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Export Excel
        </button>
      </div>

      {msg && <p className="text-red-500 mb-4">{msg}</p>}

      {/* Student Table */}
      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p className="text-gray-500">No students found for this classroom.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="bg-sky-100">
              <tr>
                <th className="border p-3">Name</th>
                <th className="border p-3">Email</th>
                <th className="border p-3">Roll</th>
                <th className="border p-3">Department</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="even:bg-sky-50 hover:bg-sky-100 transition">
                  <td className="border p-3">{s.profile?.name || '—'}</td>
                  <td className="border p-3">{s.email}</td>
                  <td className="border p-3">{s.profile?.roll || '—'}</td>
                  <td className="border p-3">{s.profile?.department || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
