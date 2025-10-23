import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Classroom() {
  const [classId, setClassId] = useState('');
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user classes on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/users/me');
        if (res.data.classes) setJoinedClasses(res.data.classes);
      } catch (e) {
        console.error(e);
        alert('Failed to fetch your classes');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Join classroom
  const joinClass = async () => {
    if (!classId.trim()) return alert('Enter a valid classroom ID');
    try {
      const res = await api.post('/classroom/join', { classId: classId.trim() });
      setJoinedClasses(res.data.classes);
      setClassId('');
      alert(`Joined classroom ${classId} successfully!`);
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.msg || 'Failed to join classroom');
    }
  };

  if (loading) return <div className="p-6 text-center">Loading classes...</div>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-sky-700">Classroom</h2>

      {/* Join Classroom */}
      <div className="flex flex-col gap-2 mb-6">
        <input
          placeholder="Enter Classroom ID"
          value={classId}
          onChange={e => setClassId(e.target.value)}
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button
          onClick={joinClass}
          className="px-6 py-3 bg-sky-700 text-white rounded hover:bg-sky-800 mt-2"
        >
          Join Classroom
        </button>
      </div>

      {/* List joined classes */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Your Classes</h3>
        {joinedClasses.length === 0 ? (
          <p className="text-gray-600">You haven’t joined any classrooms yet.</p>
        ) : (
          <ul className="list-disc pl-5">
            {joinedClasses.map(c => (
              <li key={c} className="mb-1">
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
