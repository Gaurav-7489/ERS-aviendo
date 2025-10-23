import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';



export default function ProfileForm() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    department: '',
    course: '',
    year: '',
    semester: '',
    roll: ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get('/users/me');
        if (r.data.profile) setProfile(r.data.profile);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const r = await api.patch('/users/me', profile); // save profile
      setSuccess(true);

      // Redirect based on role
      if (r.data.role === 'teacher') navigate('/teacher');
      else navigate('/dashboard');

    } catch (e) {
      console.error(e);
      alert('Failed to save!');
    } finally {
      setSaving(false);
    }
  };


  const fields = [
    { key: 'name', label: 'Full Name' },
    { key: 'department', label: 'Department' },
    { key: 'course', label: 'Course' },
    { key: 'year', label: 'Year' },
    { key: 'semester', label: 'Semester' },
    { key: 'roll', label: 'Roll Number' },
  ];

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-sky-700">Profile (Fill Once)</h2>
      <div className="flex flex-col gap-4">
        {fields.map(f => (
          <div key={f.key} className="flex flex-col">
            <label className="mb-1 font-medium text-sky-900">{f.label}</label>
            <input
              placeholder={f.label}
              value={profile[f.key] || ''}
              onChange={e => setProfile({ ...profile, [f.key]: e.target.value })}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
            />
          </div>
        ))}

        <button
          onClick={save}
          disabled={saving}
          className={`mt-3 px-6 py-3 rounded-lg font-semibold text-white transition ${saving ? 'bg-sky-400 cursor-not-allowed' : 'bg-sky-700 hover:bg-sky-800'
            }`}
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>

        {success && <p className="text-green-600 mt-2">Profile saved successfully!</p>}
      </div>
    </div>
  );
}
